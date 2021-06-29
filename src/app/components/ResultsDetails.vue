<!-- Pug Template -->
<template lang="pug">
tabs.roi-calculator__results-details(
  ref="tabs"
)
  tab(
    v-for="tab in tabs"
    :name="tab.key"
    :label="tab.tab"
    :id="tab.key"
  )
    template(v-slot:tab="")
      table.w-100
        tr
          td.pr-4 {{ tab.tab }}
          td.text-right.font-weight-bold.text-blue {{ abbreviatedCurrency.format(state[tab.key]) }}

    template(v-slot:header="")
      table.w-100
        tr
          td.pr-4 {{ tab.heading }}
          td.text-right.text-blue {{ abbreviatedCurrency.format(state[tab.key]) }}

    template(v-slot:default="")
      h2.d-none.d-lg-block.text-uppercase {{ tab.heading }}
      div(v-html="tab.content")
  
</template>

<!-- Script -->
<script>
import {translate} from '../helpers/lang';
import {currencyFormatter, abbreviatedCurrency} from '../helpers/formatters';
import numeral from 'numeral';
import Tabs from '../common/Tabs';
import Tab from '../common/Tab';
export default {
  
  components: {
    Tabs, Tab
  },

  props : {
    state: {
      type: Object
    }
  },

  data(){
    const tabs = [
      {
        tab: translate('results_details_overall_savings_tab'),
        heading: translate('results_details_overall_savings_heading'),
        key: 'ann_savings',
        content: translate('results_details_overall_savings_content', true)
      },
      {
        tab: translate('results_details_reduce_incidents_tab'),
        heading: translate('results_details_reduce_incidents_heading'),
        key: 'ann_savings_fewer_incidents',
        content: translate('results_details_reduce_incidents_content', true)
      },
      {
        tab: translate('results_details_response_tab'),
        heading: translate('results_details_response_heading'),
        key: 'ann_savings_response',
        content: translate('results_details_response_content', true)
      },
      {
        tab: translate('results_details_efficiency_tab'),
        heading: translate('results_details_efficiency_heading'),
        key: 'ann_savings_efficiency',
        content: translate('results_details_efficiency_content', true)
      }
    ]
    return {
      numeral,
      abbreviatedCurrency,
      tabs
    }
  },

  methods:{
    select(id){
      return this.$refs.tabs.select(id);
    }
  }

};
</script>

<!-- SCSS Style -->
<style lang="scss" scoped>
@import '../../scss/base.scss';
.roi-calculator__results-details {
  .Tab::v-deep {
    .btn-link {
      color: $gray-800;
    }
  }
}
</style>