<!-- Pug Template -->
<template lang="pug">
.roi-calculator(
  :class="config.attributes.class"
  :style="config.attributes.style"
)
  banner(
    :state="state"
    :title="config.fields.title"
    :step="step"
    :steps="steps"
  )

  pages.mt-4(
    v-if="loaded"
    :state="state"
    :questions="questions"
    @reset="setDefaults()"
    @step="i => step = i"
  )

</template>

<!-- Script -->
<script>

import {loadLanguageStrings} from './helpers/lang';

import Vue from 'vue';
import axios from 'axios';
import {parse as parseExpression, compile as compileExpression} from 'mathjs';

import Banner from './components/Banner';
import Pages from './components/Pages';

export default {

  name : "ROICalculator",

  components: {
    Banner, Pages
  },

  props: {
    config : Object
  },

  data(){
    return {
      loaded: false,
      step : 1,
      steps : 4,
      defaultsIndex: -1,
      defaultIndexes: {},
      industries: [],
      orgSizes: [],
      headers: [],
      calculations: [],
      constants: [],
      questions: [],
      state: {}
    };
  },

  async created(){
    const ranges = [
      'Interactive: Questions',
      'Interactive: Calculations',
      'Interactive: Constants',
      'Interactive: Org Sizes',
      'Interactive: Industries',
      'Interactive: Copy'
    ].map( id => `ranges=${id}`).join('&');

    const {google_sheet_id, google_api_key} = this.config.fields;

    this.config.pdfUrl = (window.location.pathname.replace(/\/$/,''))+'/roi-pdf/';

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${google_sheet_id}/values:batchGet/?key=${google_api_key}&${ranges}`;
    const response = await axios.get(url);
    
    this.parseData( ... response.data.valueRanges.map( range => range.values ) );

    this.loaded = true;

  },

  methods : {
    
    parseData(questions, calculations, constants, orgSizes, industries, copy){
      this.parseCopy( copy );
      this.orgSizes = this.parseOptions( orgSizes );
      this.industries = this.parseOptions( industries );
      this.parseQuestions(questions, orgSizes, industries);
      this.parseConstants(constants);
      this.parseCalculations(calculations);
      this.createState();
    },

    parseCopy( rows ){
      rows.forEach( ([key, value]) => loadLanguageStrings({[key]:value}));
    },

    parseOptions( rows ){
      const options = [];
      let headers = null;
      rows.forEach( row => {
        if( !headers ){
          headers = row;
        }
        else options.push({
          value: row[0],
          text: row[1]
        });
      });
      return options;
    },

    parseQuestions(questions){
      // grab the default indexes
      let row = questions.shift();

      // loop through to find the dropdown labels
      row.forEach((value, index) => {
        if('Defaults' === value ){
          this.defaultsIndex = index;
        }
        if(this.defaultsIndex > -1 && value ){
          this.defaultIndexes[index] = value;
        }
      });

      // grab the headers
      this.headers = [];
      row = questions.shift();

      // store the main headers and the default category indexes
      row.forEach((value, index) => {
        this.headers[index] = value;
      });


      questions.forEach((row) => {
        const question = {
          setValue(v){
            this.value = v;
          }
        };
        row.forEach((value, index) => {
          if( index < this.defaultsIndex ){
            question[this.headers[index]] = value;
          }
          else {
            if( index === this.defaultsIndex ){
              question.default = value;
            }
            else {
              // check for the different set of defaults
              if( !question.defaults ){
                question.defaults = {};
              }
              if( this.defaultIndexes[index] ){
                question.defaults[this.defaultIndexes[index]] = {};
                question.currentDefaultCategory = question.defaults[this.defaultIndexes[index]];
              }
              if( value && question.currentDefaultCategory ){
                question.currentDefaultCategory[this.headers[index]] = value;
              }
            }
          }
        });

        if( question.id == 'org_size' ){
          question.options = this.orgSizes;
        }
        else if( question.id == 'industry' ){
          question.options = this.industries;
        }

        if( Object.keys(question).length ){
          if( question.defaults ){
            if( !Object.keys(question.defaults).length ){
              delete question.defaults;
            }
            else {
              Object.keys(question.defaults).forEach( key => {
                if( !Object.keys(question.defaults[key]).length ){
                  delete question.defaults[key];
                }
              });
            }
          }
          if( question.default ){
            question.value = Number(question.default.replace(/[$,]/g,''));
          }
          else {
            question.value = '';
          }
          this.questions[question.id] = question;
          this.questions.push(question);
        }
      });

    },

    parseCalculations(data){
      let headers = false;
      data.forEach( row => {
        if( !headers ){
          headers = row;
          return;
        }
        if( !row[0] ){
          return;
        }
        const obj = {};
        row.forEach( (v,i) => {
          obj[headers[i]] = v;
        });
        obj.parsed = parseExpression(obj.Expression);
        obj.fn = compileExpression(obj.Expression);
        this.calculations.push(obj);
      });
    },

    parseConstants(data){
      let headers = false;
      data.forEach( row => {
        if( !headers ){
          headers = row;
          return;
        }
        if( !row[0] ){
          return;
        }
        const obj = {};
        row.forEach( (v,i) => {
          obj[headers[i]] = v;
        });
        this.constants.push(obj);
      });
    },

    createState(){
      const data = {
        data: {
          config: this.config,
          questions: this.questions,
          orgSizes: this.orgSizes,
          industries: this.industries
        },
        computed: {},
        methods: {
          populateContext( args, context ){
            args.forEach( arg => {
              if( arg.content && arg.content.args ){
                this.populateContext( arg.content.args, context );
              }
              else if( arg.args ){
                this.populateContext( arg.args, context );
              }
              else if( arg.name ){
                context[arg.name] = Number(this[arg.name]);
              }
            });
          }
        }
      };

      this.questions.forEach( question => {
        if( question.id ){
          data.computed[question.id] = () => question.value;
        }
      });

      this.constants.forEach( constant => {
        if( constant.id ){
          data.computed[constant.id] = () => {
            if( constant.Value.match(/%$/) ){
              return Number(constant.Value.replace(/%$/, '')) / 100;
            }
          }
        }
      });

      this.calculations.forEach( calculation => {
        if( calculation.id ){
          data.computed[calculation.id] = function() {
            const context = {};
            this.populateContext( calculation.parsed.args, context, this );
            return calculation.fn.evaluate( context );
          };
        }
      });

      this.state = new Vue(data);
      
    },

    setDefaults(){
      this.questions.forEach( question => {
        if( question.defaults ){
          if( question.defaults['Organization Size'] ){
            const selected = this.state.orgSizes.find( opt => opt.text == this.state.org_size);
            if( selected && question.defaults['Organization Size'][selected.value] ){
              question.value = Number(question.defaults['Organization Size'][selected.value].replace(/[$,]/g,''))
            }
          }
          else if( question.defaults['Industry'] ){
            const selected = this.state.industries.find( opt => opt.text == this.state.industry);
            if( selected && question.defaults['Industry'][selected.value] ){
              question.value = Number(question.defaults['Industry'][selected.value].replace(/[$,]/g,''))
            }
          }
        }
        else if( question.default ){
          question.value = question.value = Number(question.default.replace(/[$,]/g,''))
        }
      });
    }
  }
};
</script>

<!-- SCSS Style -->
<style lang="scss">
@import '../scss/base.scss';
.roi-calculator {
  background-color: #EDEDED;

  &__primary-label {
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 0.5em;
  }

  &__secondary-label {
    font-size: 1.2rem;
    font-weight: 500;
    text-transform: uppercase;
    color: $dark-blue;
  }
}
</style>