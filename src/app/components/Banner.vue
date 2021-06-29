<!-- Pug Template -->
<template lang="pug">
.roi-calculator__banner(
  :style="bannerStyle"
)
  .container.roi-calculator__banner-container
    h1.roi-calculator__banner-heading {{ title }}

    .roi-calculator__banner-progress Step {{ step }} of {{ steps }}
</template>

<!-- Script -->
<script>
export default {
  name: 'Banner',
  props : {
    state: Object,
    title : String,
    step : Number,
    steps : Number
  },
  computed:{
    bannerStyle(){
      const styles = {};
      if( this.state && this.state.config ){
        if( this.state.config.fields.banner_image ){
          styles.backgroundImage = `url(${this.state.config.fields.banner_image.url})`;
        }
        return styles;
      }
    }
  }
};
</script>

<!-- SCSS Style -->
<style lang="scss">
.roi-calculator {
  &__banner {
    background: #633B85;
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    color: #fff;
    text-align: center;
    &-container {
      padding-top: 7.5rem;
      padding-bottom: 2rem;
    }
    &-heading {
      margin-bottom: 4rem;
    }
    &-progress {
      font-size: 1.3rem;
    }
  }
}
</style>