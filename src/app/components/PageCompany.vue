<!-- Pug Template -->
<template lang="pug">
page.company-page(
  :display="display"
  :complete="complete"
  :first="true"
  v-on="$listeners"
  columnClass="col-lg-9 mx-auto"
)
  template(v-slot:summary="")
    div(
      v-html="summary"
    )

  template(v-slot:content="")

    div.introduction(
      v-html="introduction"
    )

    div.questions
      question(
        :question="questions.industry"
      )

      question(
        :question="questions.org_size"
      )

</template>

<!-- Script -->
<script>
import {translate} from '../helpers/lang';
import Page from './Page.vue';
import Question from './Question.vue';

export default {

  components: {
    Page, Question
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

  computed : {
    complete(){
      return this.state.org_size != '' && this.state.industry != '';
    },
    introduction(){
      return translate('introduction', true);
    },
    summary(){
      return translate('summary_company', true, this.state);
    }
  },
};
</script>

<!-- SCSS Style -->
<style lang="scss" scoped>
.company-page {
  margin: 0 auto;
}
.introduction {
  font-size: 1.2rem;
  margin-bottom: 1.5em;
}
</style>