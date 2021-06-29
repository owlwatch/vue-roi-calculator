<!-- Pug Template -->
<template lang="pug">
.Tabs.row.mx-0
  .col-auto.px-0
    ul.Tabs__Nav.nav.flex-column.d-none.d-lg-block(
      v-if="!mobile"
      role="tablist"
    )
      li.Tabs__NavItem.nav-item(
        v-for="(tab, i) in tabs"
        :key="i"
        :class="{ 'is-active': tab.isActive }"
        role="presentation"
      )
        a.Tabs__NavLink.nav-link(
          v-html="tab.tab"
          :aria-controls="tab.hash"
          :aria-selected="tab.isActive"
          @click.prevent="selected = tab"
          href="#"
          role="tab"
          :class="{'is-active': tab.isActive}"
        )
  .Tabs__Panels.col-12.col-md.px-0
    slot
</template>

<!-- Script -->
<script>
import debounce from 'debounce';
const $ = jQuery;
export default {
  
  data(){
    return {
      selected: null,
      tabs: [],
      windowWidth: 0
    }
  },

  created(){
    this.tabs = this.$children;
    this.resizeWatcher = debounce( e=> this.setWindowWidth(), 20);
    $(window).on('resize orientationchange', this.resizeWatcher);
    
  },

  destroyed(){
    $(window).off('resize orientationchange', this.resizeWatcher);
  },

  mounted(){
    if( this.tabs.length ){
      this.selected = this.tabs[0];
    }
    this.setWindowWidth()
    this.tabs.forEach( tab => tab.setMobile( this.mobile ) );
  },

  watch : {
    selected(tab, old){
      if( old ){
        old.setActive(false);
      }
      tab.setActive(true);
    },

    mobile(v){
      this.tabs.forEach( tab => {
        tab.setMobile(v);
      });
    }
  },

  computed:{
    mobile(){
      return this.windowWidth < 992;
    }
  },

  methods : {
    setWindowWidth(){
      this.windowWidth = $(window).width()
    },
    select(id){
      const tab = this.tabs.find(t => t.computedId == id);
      if( tab ){
        this.selected = tab;
      }
    }
  }
};
</script>

<!-- SCSS Style -->
<style lang="scss">
@import '../../scss/base.scss';
.Tabs{
  &__Nav {
    margin-top: 2rem;
    margin-bottom: 2rem;
    position: relative;
    min-width: 16em;
    z-index: 1;
  }
  &__NavLink {
    cursor: pointer;
    padding-top: 1rem;
    padding-bottom: 1rem;
    position: relative;
    color: $gray-800;
    &:hover {
      color: #000;
    }
    &:after {
      content: '';
      display: block;
      position: absolute;
      left: 100%;
      top: 0;
      width: 0rem;
      background: transparent;
      height: 100%;
      transition: 0.3s;
    }
    &.is-active {
      background: #606368;
      &, * { color: #fff !important; }
      &:after {
        width: 0.5rem;
        background: $blue;
      }
    }
  }
}
</style>