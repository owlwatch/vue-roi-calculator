<!-- Pug Template -->
<template lang="pug">
.form-group.roi-calculator__question(
  @mouseenter="showTooltip()"
  @mousemove="showTooltip()"
  @mouseleave="hideTooltip()"
)
  label(
    :class="labelClass"
    :for="question.id"
  ) {{ questionLabel }}
  
  template( v-if="question.Type == 'Dropdown'")
    select.form-control.custom-select(
      v-model="question.value"
      :id="question.id"
    )
      option(value="")
      option(
        v-for="option of question.options"
        :value="option.text"
      ) {{ option.text }}

  template( v-if="question.Type == 'Range'")
    div.roi-calculator__slider(
      :class="sliderContainerClasses"
    )
      div(
        :class="sliderInputClasses"
      )
        div(style="position: relative")
          input.form-control-range.custom-range.roi-calculator__range(
            type="range"
            :id="question.id"
            :min="min"
            :max="max"
            :step="step"
            v-model="question.value"
            @focus="showTooltip()"
            @blur="hideTooltip()"
          )
          div(
            :class="sliderValueClasses"
          )
            div.roi-calculator__range-value(
              :style="valueStyle"
              :class="{'roi-calculator__range-value--below' : showValueBelow, 'roi-calculator__range-value--right' : !showValueBelow}"
            )
              span {{ formattedValue }}
      
      div.roi-calculator__tooltip.col-lg-4(
        ref="tooltip"
        v-if="tooltip"
        v-html="tooltip"
      )

</template>

<!-- Script -->
<script>
import RangeSlider from 'vue-range-slider';
export default {
  
  name: 'Question',

  components: {RangeSlider},

  props: {
    question : {
      type: Object
    },
    label : {
      type: String
    },
    showValueBelow: {
      type : Boolean,
      default: false
    },
    currency : {
      type: Boolean,
      default: false
    },
    labelClass : {
      type : String,
      default : 'roi-calculator__primary-label'
    },
    tooltip : {
      type : String
    },
    tooltipManager : {
      type : Object
    }
  },

  data(){
    let min,max,step;
    if( this.question.Type == 'Range'){
      [min,max] = this.question.Answers.split('-');
      step = Math.ceil((max-min)/100)
    }
    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    return {
      currencyFormatter,
      min,
      max,
      step,
      value: Math.ceil(this.question.value/step) * step,
      questionLabel: this.label ? this.label : this.question.Question 
    };
  },

  created(){

    if( this.question.Type == 'Range' ){
      let [min,max] = this.question.Answers.split('-');
      let step = Math.ceil((max-min)/100);
      this.question.value = Math.round(this.question.value / step) * step;
    }
  },

  computed : {
    formattedValue(){
      return this.currency ? this.currencyFormatter.format(this.question.value) : this.question.value
    },

    valueStyle(){
      if( this.showValueBelow ){
        const percent = (this.question.value - this.min) / (this.max - this.min) * 100;
        return {
          left: `calc( ${percent}% + (${8 - percent * 0.15}px))`
        }
      }
      return {};
    },

    sliderContainerClasses(){
      return {
        'row roi-calculator__slider--value-below' : this.showValueBelow,
        'row align-items-center' : !this.showValueBelow
      }
    },
    
    sliderInputClasses(){
      return {
        'col-7 col-md-9' : !this.showValueBelow,
        'col-12' : this.showValueBelow
      }
    },

    sliderValueClasses(){
      return {
        'col-5 col-md-3 text-right' : !this.showValueBelow
      }
    }
  },

  watch: {
    value(v){
      this.question.setValue( v );
    }
  },

  methods : {
    showTooltip(){
      if( this.$refs.tooltip && this.tooltipManager ){
        this.tooltipManager.show(this.$refs.tooltip);
      }
    },
    hideTooltip(){
      if( this.$refs.tooltip && this.tooltipManager ){
        this.tooltipManager.hide(this.$refs.tooltip);
      }
    }
  }

};
</script>

<!-- SCSS Style -->
<style lang="scss">
@import '../../scss/base.scss';
@import 'vue-range-slider/dist/vue-range-slider.css';
.range-slider {
  display: block;
  width: 100%;
}
.roi-calculator {
  &__question {
    position: relative;
    margin-bottom: 3rem;
    margin-top: 3rem;
  }
  &__slider {
    position: relative;
    display: flex;
    &--value-below {
      flex-direction: column;
      margin-bottom: 4rem;
    }
  }
  &__range {
    @include media-breakpoint-down(md){
      margin-top: 30px;
    }
    &:focus {
      outline: none !important;
    }
    &-value {
      &--below {
        font-size: 1.2rem;
        font-weight: 400;
        position: absolute;
        top: 100%;
        margin-top: 0.5em;
        text-align: center;
        transform: translateX(-50%);
        @include media-breakpoint-down(md){
          bottom: 100%;
          transform: translateX(-50%);
          margin-top: 0;
          margin-bottom: 0px;
          top: auto;
        }
      }
      &--right {
        font-size: 1.6rem;
      }
    }
  }
  &__tooltip {
    color: $gray-800;
  }
  @include media-breakpoint-up(lg){

    &__tooltip {
      $border-color: $gray-500;
      transition: 0.2s;
      position: absolute;
      left: 100%;
      top: 50%;
      margin-left: 0px;
      opacity: 0;
      transform: translateY(-50%);
      border-left: 2px solid $border-color;
      font-size: 1rem;
      &.-show {
        margin-left: 10px;
        opacity: 1;
      }
      &:after, &:before {
        right: 100%;
        top: 50%;
        border: solid transparent;
        content: "";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }

      &:after {
        border-color: rgba(255, 255, 255, 0);
        border-right-color: #EDEDED;
        border-width: 6px;
        margin-top: -6px;
      }
      &:before {
        border-color: rgba(204, 204, 204, 0);
        border-right-color:$border-color;
        border-width: 9px;
        margin-top: -9px;
      }
    }
  }
  @include media-breakpoint-down(md){
    &__tooltip {
      font-size: 0.9rem;
    }
  }
}
</style>