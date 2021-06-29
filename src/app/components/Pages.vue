<!-- Pug Template -->
<template lang="pug">
.roi-calculator__pages
  
  page-company(
    :display="display(0)"
    :questions="questions"
    :state="state"
    :first="true"
    @next="currentPage++; $emit('reset')"
    @goto="currentPage=0"
  )
  
  page-incidents(
    :display="display(1)"
    :questions="questions"
    :state="state"
    @next="currentPage++"
    @back="currentPage--"
    @goto="currentPage=1"
  )

  page-spend(
    :display="display(2)"
    :questions="questions"
    :state="state"
    @next="currentPage++"
    @back="currentPage--"
    @goto="currentPage=2"
  )

  page-results(
    :display="display(3)"
    :state="state"
  )
</template>

<!-- Script -->
<script>
import PageCompany from './PageCompany.vue';
import PageIncidents from './PageIncidents.vue';
import PageSpend from './PageSpend.vue';
import PageResults from './PageResults.vue';

const $ = jQuery;
export default {

  components : {
    PageCompany, 
    PageIncidents,
    PageSpend,
    PageResults
  },

  props: {
    questions : {
      required : true,
      type : Array
    },
    state : {
      type: Object
    }
  },

  data(){
    return {
      currentPage: 0
    }
  },

  watch : {
    currentPage(page){
      this.$emit('step', page + 1)
    }
  },

  methods: {
    display(index){
      if( this.currentPage < index ){
        return 'none';
      }
      if( this.currentPage == index ){
        return 'active';
      }
      else {
        return 'summary';
      }
    }
  }
};
</script>

<!-- SCSS Style -->
<style lang="scss">

</style>