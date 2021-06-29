<!-- Pug Template -->
<template lang="pug">
.PdfReport
</template>

<!-- Script -->
<script>

import numeral from 'numeral';

import { translate } from "../helpers/lang";
import { abbreviatedCurrency } from "../helpers/formatters";
import { applyVerticalAlignment, findInlineHeight } from "../helpers/pdfmake-vertical-align";

const $ = jQuery;

import axios from 'axios';

function matchProtocol(url){
  return url.replace(/^https?:/, window.location.protocol);
}

export default {
  name: "PdfReport",

  props: {
    state: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      fontBase: this.state.config.font_base,
      pdfUrl: "",
      docBase64: "",
      iframeSrc: "",
      resultsSections: [{
        key: 'ann_savings',
        tab: translate('results_details_overall_savings_tab'),
        heading: translate('results_details_overall_savings_heading'),
        content: translate('results_details_overall_savings_content', true)
      },{
        key: 'ann_savings_fewer_incidents',
        tab: translate('results_details_reduce_incidents_tab'),
        heading: translate('results_details_reduce_incidents_heading'),
        content: translate('results_details_reduce_incidents_content', true)
      },{
        key: 'ann_savings_response',
        tab: translate('results_details_response_tab'),
        heading: translate('results_details_response_heading'),
        content: translate('results_details_response_content', true)
      },{
        key: 'ann_savings_efficiency',
        tab: translate('results_details_efficiency_tab'),
        heading: translate('results_details_efficiency_heading'),
        content: translate('results_details_efficiency_content', true)
      }]
    };
  },

  computed: {
    signature(){
      const signature = {
        time: new Date().getTime()
      };
      this.state.questions.forEach( q => {
        signature[q.id] = this.state[q.id];
      });
      return JSON.stringify(signature);
    }
  },

  async created(){
    
  },

  destroyed(){
    // console.log('destroyed');
  },

  mounted() {
    // this might already exist...
    this.buildPdf();
  },

  watch : {
    pdfUrl(v){
      if(v !== ''){
        this.$emit('ready', v);
      }
    }
  },

  methods: {
    async buildPdf() {
      this.pdfmake = await import('pdfmake');
      this.html2pdfmake = await import("html-to-pdfmake");
      
      this.pdfmake.fonts = {
        HelveticaNeue: {
          normal: `${this.fontBase}/HelveticaNeue/HelveticaNeue-Light.ttf`,
          bold: `${this.fontBase}/HelveticaNeue/HelveticaNeue-Bold.ttf`,
          italics: `${this.fontBase}/HelveticaNeue/HelveticaNeue-Italic.ttf`,
          bolditalics: `${this.fontBase}/HelveticaNeue/HelveticaNeue-BoldItalic.ttf`
        },
        Tungsten : {
          normal: `${this.fontBase}/Tungsten/Tungsten-Medium.ttf`,
          bold: `${this.fontBase}/Tungsten/Tungsten-Semibold.ttf`,
        }
      };
      const doc = await this.createDoc();
      const pdf = this.pdfmake.createPdf(doc);
      pdf.getBase64( base64 => this.savePdf(base64) );
      pdf.getDataUrl( url => this.iframeSrc = url );
    },

    async savePdf( base64 ){
      const formData = new FormData();
      formData.append('nonce', this.state.config.nonce);
      formData.append('pdf', base64);
      formData.append('signature', this.signature);
      const response = await axios.request({
        method: 'post',
        url: this.state.config.pdfUrl, 
        data: formData, 
        withCredentials: true
      });

      if( response.data.success ){

        this.pdfUrl = response.data.url;
      }
      
    },

    async createDoc() {
      const headerImage = await this.toDataURL(this.state.config.fields.pdf_header_image.url,'image/jpeg');
      const {proofpointLogoSvg} = await import('../helpers/images');
      this.proofpointLogoSvg = proofpointLogoSvg;
      const images = {headerImage};

      if( this.state.config.fields.pdf_costs_image ){
        images.costs_report = matchProtocol( this.state.config.fields.pdf_costs_image.url );
      }

      if( this.state.config.fields.pdf_analyze_image ){
        images.economy_analysis_report = matchProtocol( this.state.config.fields.pdf_analyze_image.url );
      }
      
      if( this.state.config.fields.pdf_frequency_image ){
        images.frequency_chart = matchProtocol(this.state.config.fields.pdf_frequency_image.url );
      }

      if( this.state.config.fields.pdf_costs_and_industry_image ){
        images.costs_and_industry = matchProtocol(this.state.config.fields.pdf_costs_and_industry_image.url);
      }

      if( this.state.config.fields.pdf_key_cost_drivers_image ){
        images.key_cost_drivers = matchProtocol(this.state.config.fields.pdf_key_cost_drivers_image.url);
      }

      this.images = images;
      return {
        content: [
          this.introPage(),
          {pageBreak: 'before', text:''},
          this.detailPage(),
          {pageBreak: 'before', text:''},
          this.costOfInsiderThreatsPage(),
          {pageBreak: 'before', text:''},
          this.economyAnalysisPage(),
          {pageBreak: 'before', text:''},
          this.dissectionPage(),
          {pageBreak: 'before', text:''},
          this.chartsPage(),
          {pageBreak: 'before', text:''},
          this.lastPage()
        ],
        header: (currentPage, pageCount, pageSize) => this.header(currentPage, pageCount, pageSize),
        // footer: (currentPage, pageCount) => this.footer(currentPage, pageCount),
        background: (currentPage, pageSize) =>
          this.background(currentPage, pageSize),
        pageSize: "A4",
        pageMargins: [20, 120, 20, 0],
        defaultStyle: {
          font: "HelveticaNeue",
          fontSize: 11,
          lineHeight: 1.25,
          color: "#0F292F",
        },
        styles: {
          
        },
        images: images
      };
    },

    background(currentPage, pageSize) {
      return currentPage === 1
        ? [
            {
              image: "headerImage",
              width: pageSize.width,
            },
          ]
        : [];
    },

    header(currentPage, pageCount, pageSize){
      return currentPage === 1  ? [{
        svg: this.proofpointLogoSvg,
        width: 120,
        margin: [20,20,20,30]
      },{
        text: translate('report_heading'),
        style: {
          font: 'Tungsten',
          fontSize: 34,
          bold: true,
          color: '#ffffff',
          lineHeight: 1
        },
        margin: [20,0]
      }] : [{
        margin: 20,
        alignment: 'right',
        style : {
          fontSize: 9
        },
        text: [
          translate('report_heading').toUpperCase(),
          '  |  ',{
            text: 'ITM Threat Management'.toUpperCase(),
            bold: true
          }
        ]
      }];
    },

    sidebar(key){
      const body = [];
      this.resultsSections.forEach( item => {
        if( key && item.key !== key ){
          return;
        }
        body.push([{
          text : item.tab,
          linkToDestination : item.key,
          margin: [0,0,0,5],
          style : {
            fontSize: 8
          }
        },{
          text: abbreviatedCurrency.format(this.state[item.key]),
          linkToDestination : item.key,
          margin: [0,0,0,5],
          style : {
            fontSize: 8,
            bold: true,
            alignment: 'right',
            color: '#3561AB'
          }
        }]);
      });
      return {
        layout: 'noBorders',
        table: {
          headerRows: 0,
          widths: ['*', 40],
          body
        }
      };
    },

    introPage(){
      // lets get that table of contents built.
      return {
        margin: [0,30,0,0],
        columnGap : 25,
        columns: [
          {
            width: 175,
            stack: [
              this.sidebar()
            ]
            
          },{
            width: '*',
            stack: [
              this.html2doc(translate('report_introduction', true, this.state)),
              this.chart()
            ]
          }
        ]
      }
    },

    chart(){

      const chunks = [{
        text: translate('report_chart_heading'),
        margin: [0, 80, 0, 10],
        bold: false,
        fontSize: 28,
        lineHeight: 1.1,
        alignment: 'center',
        font: 'Tungsten'
      }];

      const height = 250;

      const parts = {};
      ['ann_savings_fewer_incidents','ann_savings_response','ann_savings_efficiency'].forEach(key=>{
        parts[key] = {
          height: height * (this.state[key]/this.state.ann_savings),
          value: abbreviatedCurrency.format(this.state[key])
        };
      });
      
      chunks.push({
        layout: { 
          paddingTop: function (index, node) {
            applyVerticalAlignment(node, index, 'center');
            return 0;
          }, 
          hLineWidth: function (i, node) {
            return i===0 || i === 3 ? 0.5 : 0;
          },
          hLineColor: function(i, node){
            return "#999999";
          },
          vLineWidth: function (i) {
            return 0;
          },
        },
        table: {
          widths: ['1%', '32%', '1%', '32%', '1%','32%', '1%'],
          body: [[
            {
              svg: '<svg width="300" height="200" viewBox="0 0 300 200"></svg>',
              height: parts.ann_savings_fewer_incidents.height,
              width: 1,
            },{
              fontSize: 9,
              alignment: 'right',
              height: parts.ann_savings_fewer_incidents.height,
              bold: true,
              text: translate('ann_savings_fewer_incidents').toUpperCase(),
            },{
              rowSpan: 3,
              text: ''
            },{
              text: parts.ann_savings_fewer_incidents.value,
              height: parts.ann_savings_fewer_incidents.height,
              fillColor: '#1d428a',
              fontSize: 16,
              bold: true,
              color: '#fff',
              alignment: 'center'
            },{
              rowSpan: 3,
              text: ''
            },{
              rowSpan: 3,
              fillColor: "#009CDE",
              height,
              color: '#fff',
              alignment: 'center',
              stack: [{
                text: 'ANNUAL SAVINGS',
                bold: true,
                fontSize: 10,
              },{
                text: 'AFTER ITM',
                bold: true,
                fontSize: 10,
              },{
                text: 'INVESTMENT',
                bold: true,
                fontSize: 10,
              },{
                text: abbreviatedCurrency.format(this.state.ann_savings),
                fontSize: 18,
                lineHeight: 1,
                bold: true,
                margin: [0,10,0,0]
              },{
                text: 'SAVINGS',
                fontSize: 14,
                bold: true,
                margin: [0,0]
              }]
            },{
              rowSpan: 3,
              text: ''
            }
          ],[
            {
              svg: '<svg width="300" height="200" viewBox="0 0 300 200"></svg>',
              height: parts.ann_savings_response.height,
              width: 1,
            },{
              fontSize: 8,
              alignment: 'right',
              bold: true,
              text: translate('ann_savings_response').toUpperCase(),
              height: parts.ann_savings_response.height,
            },'',{
              text: parts.ann_savings_response.value,
              height: parts.ann_savings_response.height,
              fontSize: 16,
              bold: true,
              color: '#fff',
              fillColor: '#8031A7',
              alignment: 'center',
            },'','',''
          ],[
            {
              svg: '<svg width="300" height="200" viewBox="0 0 300 200"></svg>',
              height: parts.ann_savings_efficiency.height,
              width: 1,
            },
            {
              fontSize: 8,
              alignment: 'right',
              height: parts.ann_savings_efficiency.height,
              bold: true,
              text: translate('ann_savings_efficiency').toUpperCase(),
            },'',{
              fillColor: '#00BFB3',
              height: parts.ann_savings_efficiency.height,
              alignment: 'center',
              color: '#fff',
              fontSize: 16,
              bold: true,
              text: parts.ann_savings_efficiency.value
            },'','',''
          ]]
        }
      });
      return chunks;
    },

    detailPage(){
      const chunks = [];
      this.resultsSections.forEach( (item,i) => {
        chunks.push({
          margin: [0,0,0,10],
          columnGap : 25,
          columns: [
            {
              width: 175,
              stack: [
                {
                  margin:[0,5,0,0],
                  stack: [this.sidebar( item.key )]
                }
              ]
              
            },{
              width: '*',
              stack: [
                {
                  id: item.key,
                  text: item.heading.toUpperCase(),
                  fontSize: 28,
                  font: 'Tungsten',
                  margin: [0,0,0,2]
                },
                this.html2doc(item.content),
              ]
            }
          ]
        })
      });
      return chunks;
    },

    costOfInsiderThreatsPage(){
      const content = this.html2doc(translate('report_cost_of_insider_threats_page', true)).map(node=>{
        if( ['H1','H4'].includes(node.nodeName) ){
          node.margin = [0,0,0,0]
        }
        return node;
      });
      const columns = [{
        width: '50%',
        stack: content
      }];

      if( this.images.costs_report ){
        columns.push({
          image: 'costs_report',
          width: 200,
          alignment: 'center'
        });
      }else {
        columns.push('');
      }

      return [{
        columnGap: 50,
        columns
      }];
    },

    economyAnalysisPage(){
      const content = this.html2doc(translate('report_economy_analysis', true)).map(node=>{
        if( ['H1'].includes(node.nodeName) ){
          node.margin = [0,0,0,0]
        }
        return node;
      });
      const columns = [{
        width: '50%',
        stack: content
      }];

      if( this.images.economy_analysis_report ){
        columns.push({
          image: 'economy_analysis_report',
          width: 200,
          alignment: 'center'
        });
      }else {
        columns.push('');
      }

      return [{
        columnGap: 50,
        columns
      }];
    },

    dissectionPage(){
      
      const chunks = [{
        text: translate('report_dissection_heading'),
        fontSize: 28,
        font: 'Tungsten',
        margin: [0,100]
      }]
      if( this.images.frequency_chart ){
        chunks.push({
          image: 'frequency_chart',
          alignment: 'center',
          width: 480
        });
      }

      return chunks;
    },

    chartsPage(){
      const chunks = [];
      if( this.images.costs_and_industry ){
        chunks.push({
          image: 'costs_and_industry',
          alignment: 'center',
          width: 480,
          margin: [0,0,0,80]
        });
      }

      if( this.images.key_cost_drivers ){
        chunks.push({
          image: 'key_cost_drivers',
          alignment: 'center',
          width: 480
        });
      }

      return chunks;
    },

    lastPage(){
      let stack = this.html2doc(translate('report_footer', true));
      stack = stack.map( node => {
        if( ['H3','H4'].includes(node.nodeName) ){
          node.alignment='center';
        }
        if( node.nodeName == 'HR' ){
          return {
            margin: [0,10],
            layout: {
              hLineWidth: i => i===0 ? 0.5 : 0,
              hLineColor: () => '#cccccc',
              vLineWidth: () => 0,
              paddingTop: () => 0
            },
            table: {
              widths: ['100%'],
              body: [['']]
            }
          }
        }
        return node;
      });
      stack.push({
        margin: [0,10,0,0],
        svg: this.proofpointLogoSvg.replace(/#fff(fff)?/g, '#000000'),
        width: 120
      });
      return [{
        margin: [0,450,0,0],
        stack
      }]
    },

    html2doc(string) {
      return this.html2pdfmake(string, {
        defaultStyles: {
          h1: {
            bold: false,
            fontSize: 28,
            font: "Tungsten",
            margin: [0, 0, 0, 12],
          },
          h2: { bold: false, fontSize: 20, font: "Tungsten", margin: [0, 0, 0, 4] },
          h3: { bold: false, fontSize: 30, font: "Tungsten", margin: [0, 0, 0, 4], color: '#8031A7', lineHeight: 1 },
          h4: { bold: false, fontSize: 16, font: "HelveticaNeue", margin: [0, 0, 0, 4] },
          p: { margin: [0, 0, 0, 10], fontSize: 9 },
          ul: { margin: [0, 0, 0, 10], fontSize: 9 },
          ol: { margin: [0, 0, 0, 10], fontSize: 9 },
        },
      });
    },

    toDataURL(src, outputFormat) {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.crossOrigin = "Anonymous";
        src = src.replace(/^https?:/, window.location.protocol)
        img.onload = function () {
          var canvas = document.createElement("CANVAS");
          var ctx = canvas.getContext("2d");
          var dataURL;
          canvas.height = this.naturalHeight;
          canvas.width = this.naturalWidth;
          ctx.drawImage(this, 0, 0);
          dataURL = canvas.toDataURL(outputFormat);
          return resolve(dataURL);
        };
        img.src = src;
        if (img.complete || img.complete === undefined) {
          img.src =
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
          img.src = src;
        }
      });
    }

  },
};
</script>

<!-- SCSS Style -->
<style lang="scss" scoped>
.PdfReport {
  position: relative;
  iframe {
    position: relative;
    width: 100vw;
    height: 100vh;
    left: 50%;
    transform: translateX(-50%);
    border: 0;
  }
}
</style>