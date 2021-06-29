<!-- Pug Template -->
<template lang="pug">
page(
  :display="display"
  :complete="complete"
  v-on="$listeners"
)
  template(v-slot:summary="")
    div(
      v-html="summary"
    )

  template(v-slot:content="")
    .row
      .col-lg-9
        question(
          :question="questions.incidents_per_year"
          :showValueBelow="true"
          :tooltip="translate('incidents_tooltip', true)"
          :tooltipManager="tooltipManager"
        )
    
</template>

<!-- Script -->
<script>
import {translate} from '../helpers/lang';
import Page from './Page.vue';
import Question from './Question.vue';

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
    return {tooltipManager, translate};
  },
  computed : {
    complete(){
      return this.state.incidents_per_year > 0;
    },
    summary(){
      return translate('summary_incidents', true, this.state );
    }
  }
};
</script>

<!-- SCSS Style -->
<style lang="scss">

</style>