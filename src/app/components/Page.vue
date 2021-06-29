<!-- Pug Template -->
<template lang="pug">
.roi-calculator__page
  .container
    transition-expand(
      
    )
      .roi-calculator__page-summary(
        v-if="display=='summary'"
      )
        a(
          href="#"
          @click.prevent="$emit('goto')"
        )
          .d-flex.align-items-center.py-3
            div.flex-grow-1
              slot(
                name="summary"
              )
                p Summary of this page
            
            div.px-2
              span.mdi.mdi-menu-down.mdi-24px

    transition-expand
      .roi-calculator__page-content.row(
        v-if="display=='active'"
      )
        .py-5.col-12(
          :class="columnClass"
        )
          slot(
            name="content"
          )
        
          .roi-calculator__page-footer
            slot(
              name="footer"
            )
              button.btn.btn-primary.btn-lg(
                v-if="!first"
                @click="$emit('back')"
              ) Back

              button.btn.btn-primary.btn-lg(
                @click="$emit('next')"
                :disabled="!complete"
              ) {{ nextText }}
</template>

<!-- Script -->
<script>
import TransitionExpand from './TransitionExpand.vue';
const $=jQuery;
export default {
  components:  {TransitionExpand},
  props : {
    display: String,
    first: {
      type : Boolean,
      default: false
    },
    complete: {
      type: Boolean,
      default: false
    },
    nextText : {
      type: String,
      default: 'Next'
    },
    columnClass : {
      default: ''
    }
  },

  watch: {
    display(value){
      if( value === 'active' ){
        let $el = $(this.$el).prev();
        if( !$el.length ) $el = $(this.$el).parent();
        $('html,body').animate({
            scrollTop : $($el).offset().top - $('body').offset().top
        }, 400);
      }
    }
  }
};
</script>

<!-- SCSS Style -->
<style lang="scss">
.roi-calculator {
  &__page {
    &-summary {
      overflow: hidden;
      border-bottom: 2px solid #ccc;
      a {
        color: #999;
        display: block;
        font-size: 1.2rem;
        text-decoration: none;
      }
    }
    &-footer {
      margin-top: 2rem;
      button + button {
        margin-left: 1.5rem;
      }
    }
  }
}
.expand-enter-active,
.expand-leave-active {
  transition-property: opacity, height;
}

.expand-enter,
.expand-leave-to {
  opacity: 0;

}
</style>