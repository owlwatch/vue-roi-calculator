<!-- Pug Template -->
<template lang="pug">
page(
  :display="display"
  :complete="complete"
  v-on="$listeners"
  nextText="Results"
)
  template(v-slot:summary="")
    div(
      v-html="summary"
    )

  template(v-slot:content="")
    .row
      .col-lg-9

        .roi-calculator__primary-label {{ translate('spend_question') }}

        .roi-calculator__primary-intro(
          v-html="translate('spend_introduction', true)"
        )

        question(
          :question="questions.detection_spend"
          :currency="true"
          labelClass="roi-calculator__secondary-label"
          :tooltipManager="tooltipManager"
          :tooltip="translate('spend_tooltip_detection', true)"
        )

        question(
          :question="questions.response_spend"
          :currency="true"
          labelClass="roi-calculator__secondary-label"
          :tooltipManager="tooltipManager"
          :tooltip="translate('spend_tooltip_response', true)"
        )

        question(
          :question="questions.recovery_spend"
          :currency="true"
          labelClass="roi-calculator__secondary-label"
          :tooltipManager="tooltipManager"
          :tooltip="translate('spend_tooltip_recovery', true)"
        )

        .roi-calculator__spend-total
          .row
            .col-7.col-md-9.text-left
              .roi-calculator__secondary-label Total Spend per Incident

            .col-5.col-md-3.text-right
              p.roi-calculator__spend-total-value {{ currencyFormatter.format(state.average_spend_per_incident) }}
</template>

<!-- Script -->
<script>
import {translate} from '../helpers/lang';
import {currencyFormatter} from '../helpers/formatters';
import Page from './Page.vue';
import Question from './Question.vue';

export default {
  components: {Page, Question},
  props : {
    display: String,
    questions: {
      type: Array
    },
    state: {
      type: Object
    }
  },

  data(){
    const tooltipManager = {
      tooltips : [],
      show(tooltip){
        this.tooltips.forEach(tip => tip !== tooltip && tip.classList.remove('-show'));
        this.active = tooltip;
        tooltip.classList.add('-show');
        if( !this.tooltips.includes(tooltip) ){
          this.tooltips.push(tooltip);
        }
      },
      hide(tooltip){
        tooltip.classList.remove('-show');
      }
    };
    return {
      translate,
      currencyFormatter,
      tooltipManager
    }
  },
  computed : {
    complete(){
      return this.state.detection_spend + this.state.response_spend + this.state.recovery_spend > 0;
    },
    summary(){
      return translate('summary_spend', true, this.state );
    }
  }
};
</script>

<!-- SCSS Style -->
<style lang="scss">
@import '../../scss/base.scss';
.roi-calculator {
  &__spend {
    &-total {
      margin-top: 3rem;
      padding-top: 2.5rem;
      border-top: 2px solid $gray-400;
    }
    &-total-value {
      font-weight: 500;
      font-size: 1.6rem;
    }
  }
  &__primary {
    &-intro {
      margin: 1em 0;
      
    }
  }
}
</style>