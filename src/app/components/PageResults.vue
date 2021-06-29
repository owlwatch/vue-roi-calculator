<!-- Pug Template -->
<template lang="pug">
page(
  :display="display"
  :complete="complete"
  v-on="$listeners"
)
  template(v-slot:summary="")
    

  template(v-slot:content="") 
    .roi-calculator__results
      .text-center
        h2.roi-calculator__results-title {{translate('results_title')}}

        .roi-calculator__results-introduction(
          v-html="translate('results_introduction', true)"
        )

        button.btn.btn-lg.btn-primary.mt-4(
          :disabled="pdfUrl==''"
          @click="download()"
        ) 
          span(
            v-if="pdfUrl == ''"
          ) Generating Report <span class="mdi mdi-loading mdi-spin"></span>
          span(
            v-else
          ) Download Report

        results-chart.mt-5.mb-5(
          :state="state"
          @click="handleChartClick"
        )
        //- .roi-calculator__results-footer.mt-6
        //-   button.btn.btn-lg.btn-primary(
        //-     :disabled="pdfUrl==''"
        //-     @click="download()"
        //-   ) 
        //-     span(
        //-       v-if="pdfUrl == ''"
        //-     ) Generating Report <span class="mdi mdi-loading mdi-spin"></span>
        //-     span(
        //-       v-else
        //-     ) Download Report

        results-gate(
          id="roi-modal"
          ref="gate"
          :state="state"
          :pdfUrl="pdfUrl"
          marketo_form_id="10468"
          @complete="ungate()"
        )

        pdf-report(
          ref="pdfReport"
          :state="state"
          @ready="pdfReady"
        )
    
    results-details(
      ref="details"
      :state="state"
    )
    
  template(v-slot:footer="")
    div
</template>

<!-- Script -->
<script>
import Page from './Page.vue';
import ResultsDetails from './ResultsDetails';
import ResultsChart from './ResultsChart';
import ResultsGate from './ResultsGate';
import PdfReport from './PdfReport';
import {translate} from '../helpers/lang';
import {currencyFormatter} from '../helpers/formatters';
import numeral from 'numeral';
import BSN from 'bootstrap.native';

const $ = jQuery;

export default {

  components: {
    Page,
    ResultsDetails,
    ResultsChart,
    ResultsGate,
    PdfReport
  },

  props : {
    display: {
      type: String,
      default: 'none'
    },
    questions: {
      type: Array
    },
    state: {
      type: Object
    }
  },

  data(){
    return {
      translate,
      currencyFormatter,
      numeral,
      gated: true,
      pdfUrl: ''
    };
  },

  destroyed(){
    $(this.$refs.modal).modal('dispose');
  },

  computed : {
    complete(){
      return true;
    },
    modal(){
      if( this.$refs.gate.$el ){
        if( !$(this.$refs.gate.$el).data('modal') ){
          $(this.$refs.gate.$el).data('modal',new BSN.Modal(this.$refs.gate.$el,{backdrop: true}));
        }
        return $(this.$refs.gate.$el).data('modal');
      }
      return null;
    }
  },

  watch : {
    display(v){
      if( 'active' === v ){
        this.pdfUrl = '';
      }
    }
  },

  methods : {
    download(){
      if( this.gated ){
       this.modal.show();
      }
      else {
        window.location = this.pdfUrl;
      }
    },
    pdfReady(url){
      this.pdfUrl = url;
    },
    ungate(){
      this.modal.hide();
      this.gated = false;
      window.location = this.pdfUrl;
    },
    handleChartClick(id){
      // open the corresponding details
      this.$refs.details.select(id);
      $('html,body').animate({
          scrollTop : $(this.$refs.details.$el).offset().top - $('body').offset().top - 50
      }, 400);
    }
  }
};
</script>

<!-- SCSS Style -->
<style lang="scss">
@import '../../scss/base.scss';
.roi-calculator {
  &__results {
    background: #fff;
    border: 1px solid $gray-200;
    border-bottom: 2px solid $gray-300;
    padding: 2rem;

    &-title {
      text-transform: none;
    }

    &-introduction {
      font-size: 1.2rem;
    }

    &-details {
      margin-top: 3rem;
    }
  }
  .chart-screenshot {
    position: absolute;
    width: 600px;
    left: 0;
    top: 0;
    background: #fff;
  }
}
</style>