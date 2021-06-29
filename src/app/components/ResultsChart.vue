<!-- Pug Template -->
<template lang="pug">
.roi-calculator__results-chart
  .roi-calculator__results-dash(
    data-dash="1"
    ref="dash1"
  )
  .roi-calculator__results-dash(
    data-dash="2"
    ref="dash2"
  )
  
  .roi-calculator__results-column.roi-calculator__results-column-parts(
    ref="resultsParts"
  )
    
    .roi-calculator__results-column-part(
      ref="ann_savings_efficiency"
      data-part="ann_savings_efficiency"
      @click="$emit('click', 'ann_savings_efficiency')"
    )
      .roi-calculator__results-column-fill
        .roi-calculator__results-column-heading {{ translate('ann_savings_efficiency') }}
        .roi-calculator__results-column-value(data-value)

    .roi-calculator__results-column-part(
      ref="ann_savings_response"
      data-part="ann_savings_response"
      @click="$emit('click', 'ann_savings_response')"
    )
      .roi-calculator__results-column-fill
        .roi-calculator__results-column-heading {{ translate('ann_savings_response') }}
        .roi-calculator__results-column-value(data-value)

    .roi-calculator__results-column-part(
      ref="ann_savings_fewer_incidents"
      data-part="ann_savings_fewer_incidents"
      @click="$emit('click', 'ann_savings_fewer_incidents')"
    )
      .roi-calculator__results-column-fill
        .roi-calculator__results-column-heading {{ translate('ann_savings_fewer_incidents') }}
        .roi-calculator__results-column-value(data-value)

  .roi-calculator__results-column.roi-calculator__results-column-total(
    ref="resultsTotal"
    @click="$emit('click', 'ann_savings')"
  )
    .roi-calculator__results-column-fill
      .roi-calculator__results-column-heading {{ translate('ann_savings') }}
      .roi-calculator__results-column-value(data-value)
      .roi-calculator__results-column-label Savings
</template>

<!-- Script -->
<script>
import {translate} from '../helpers/lang';
import {currencyFormatter, abbreviatedCurrency} from '../helpers/formatters';
import numeral from 'numeral';
const $ = jQuery;

export default {

  props : {
    state: {
      type: Object
    },
    duration: {
      default: 1500
    }
  },

  data(){
    return {
      translate,
      currencyFormatter,
      abbreviatedCurrency,
      numeral
    };
  },

  mounted() {
    this.animate();
  },

  computed : {
    complete(){
      return true;
    }
  },

  watch : {
    display(v){
      if( 'active' === v ){
        setTimeout(()=>this.animate(),10);
      }
    }
  },

  methods : {
    percent(part){
      return this.state[part] / this.state.ann_savings;
    },
    animate(){
      const duration = this.duration;
      if( !this.$refs.resultsParts ){
        return;
      }
      const parts = this.$refs.resultsParts.querySelectorAll('[data-part]');
      const total = this.state.ann_savings;
      let offset = 0;
      parts.forEach( (part,i) => {
        offset += this.animatePart(part, i, duration, offset);
      });

      $(this.$refs.resultsTotal).css({
        height: 0
      });

      $(this.$el).find('[data-dash]').css({opacity: 0});

      const $value = $(this.$refs.resultsTotal).find('[data-value]');
      $(this.$refs.resultsTotal).animate({
        height: '100%'
      }, {
        duration,
        easing: 'linear',
        progress: (animation, progress) => {
          $value.html( abbreviatedCurrency.format(progress * total));
        },
        complete: () => {
          this.$emit('ready');
        }
      });
    },

    animatePart(part, i, totalDuration, offset){
      const name = $(part).data('part');
      const percent = this.percent(name);
      const amount = this.state[name];
      const duration = totalDuration * percent;
      const easing = 'linear';
      const $value = $(part).find('[data-value]');
      $(part).removeClass('-show-heading');
      $(part).css({height: 0});
      setTimeout(() => {
        if( i > 0 ){
          $(this.$refs['dash'+i]).css({
            opacity: 1,
            bottom: (offset/totalDuration * 100) + '%'
          });
        }
        $(part).animate({
          height: `${percent * 100}%`
        }, {
          duration,
          easing,
          progress(animation, progress){
            $value.html( abbreviatedCurrency.format(progress * amount) );
          }
        }).addClass('-show-heading');
      }, offset);
      return duration;
    }
  }
};
</script>

<!-- SCSS Style -->
<style lang="scss">
@import '../../scss/base.scss';
.roi-calculator {
  &__results {
    &-chart {
      margin: 0 auto;
      height: 400px;
      display: flex;
      justify-content: center;
      border-top: 2px solid #ccc;
      border-bottom: 2px solid #ccc;
      position: relative;
    }
    &-dash {
      border-top: 2px dashed #d8d8d8;
      position: absolute;
      left: 0;
      right: 0;
      margin-bottom: -2px;
      bottom: 20%;
      opacity: 0;
      transition: 0.5s opacity;
      &[data-dash="2"]{
        bottom: 40%;
      }
    }

    &-column {
      width: 180px;
      display: flex;
      flex-direction: column-reverse;
      color: #fff;
      &+& {
        margin-left: 2rem;
      }
      &-fill {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: $blue;
        height: 100%;
        justify-content: center;
        position: relative;
      }
      &-part {
        position: relative;
        overflow: visible !important;
        z-index: 3;
        cursor: pointer;
        transition: background-color .2s, transform .2s, box-shadow .2s;
        transform-origin: 50% 50%;
        &-fill {
          transition: background-color .2s, transform .2s, box-shadow .2s;
        }
        &:after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          content: '';
          display: block;
          pointer-events: 0;
          transition: 0.2s background-color;
        }
        &:hover {
          transform: scale(1.05);
          &:after {
            background: rgba(255,255,255,0.1);
          }
        }
        & + & {
          z-index: 2; 
        }
        & + & + & {
          z-index: 1;
        }
      }
      &-part[data-part="ann_savings_fewer_incidents"] &-fill{
        background: $dark-blue;
      }
      &-part[data-part="ann_savings_response"] &-fill{
        background: $purple;
      }
      &-part[data-part="ann_savings_efficiency"] &-fill{
        background: $green;
      }
      &-total {
        height: 0;
        align-self: flex-end;
        flex-direction: column-reverse;
        position: relative;
        cursor: pointer;
        transition: 0.2s transform;
        transform-origin: 50% 50%;
        &:after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          content: '';
          display: block;
          pointer-events: 0;
          transition: 0.2s background-color;
        }
        &:hover {
          transform: scale(1.05);
          &:after {
            background-color: rgba(#fff,0.1);
          }
        }
      }
      &-total &-fill {
        padding: 0 1rem;
      }
      &-heading {
        color: #fff;
        font-size: 0.9rem;
        text-transform: uppercase;
        font-weight: 500;
        line-height: 1.3;
        font-family: $font-family-sans-serif;
        .-show-heading & {
          opacity: 1 !important;
        }
      }
      &-part &-heading {
        color: #333;
        font-size: 0.8rem;
        width: 150px;
        text-align: right;
        text-transform: uppercase;
        font-weight: 500;
        font-family: $font-family-sans-serif;
        position: absolute;
        top: 50%;
        right: 100%;
        margin-right: 1rem;
        transform: translateY(-50%);
        opacity: 0;
        transition: 1s opacity;
        @include media-breakpoint-down(md){
          display: none;
        }
      }
      &-value {
        position: relative;
        font-size: 1.1rem;
        font-weight: 600;
        line-height: 1.1;
        text-transform: uppercase;
      }
      &-label {
        font-size: 1.2rem;
        font-weight: 500;
        text-transform: uppercase;
      }
      &-total &-heading {
        position: relative;
        margin-bottom: 1em;
      }
      &-total &-value {
        position: relative;
        font-size: 2rem;
        font-weight: 500;
      }
    }
  }
}
</style>