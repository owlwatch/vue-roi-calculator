<!-- Pug Template -->
<template lang="pug">
section.Tab(
  :id="computedId"
  role="tabpanel"
  :aria-hidden="!isActive"
  :class="{'is-active':(isActive || mobile), 'card' : mobile}"
)
  .Tab__Nav.d-none(
    ref="tab"
  )
    slot(name="tab") {{ label }}

  .Tab__Header(
    :class="mobileClass('card-header')"
    ref="header"
  )
    h2(
        v-if="mobile"
      ) 
      button.btn.btn-link.btn-block.text-left.d-flex.w-100.align-items-center.px-0(
        :id="`${computedId}-header`"
        type="button"
        data-toggle="collapse"
        :data-target="`#${computedId}-card-body`"
        aria-expanded="false"
        :aria-controls="`${computedId}-card-body`"
      ) 
        div.flex-grow-1
          slot(name="header")
            span {{ header }}
        div.pl-2
          span.mdi.mdi-chevron-down
  .Tab__Content(
    :id="`${computedId}-card-body`"
    :class="mobileClass('collapse')"
    :aria-labelled-by="`${computedId}-header`"
  )
    div(
      :class="{'card-body':mobile}"
    ) 
      slot
</template>

<!-- Script -->
<script>
export default {
  props: {
    id: { default: null },
    name: { required: true },
    label: { default: '' }
  },
  data(){
    return {
      header : this.name,
      isActive : false,
      mobile : false
    };
  },
  watch : {
    tab(v){
      this.$emit('tab', v);
    }
  },
  mounted(){
    this.tab = this.$refs.tab.innerHTML;
  },
  computed: {
    computedId() {
      return this.id ? this.id : this.name.toLowerCase().replace(/ /g, "-");
    }
  },

  methods:{
    setActive(v){
      this.isActive = v;
    },
    setMobile(v){
      this.mobile = v;
    },
    mobileClass(cls){
      return this.mobile ? cls : '';
    }
  }
};
</script>

<!-- SCSS Style -->
<style lang="scss" scoped>
@import '../../scss/base.scss';
.Tab {
  position: absolute;
  left: -99999em;
  box-shadow: 0 0 20px rgba(0,0,0,.05);
  &.is-active {
    position: static;
    height: 100%;
  }
  &.card {
    position: static !important;
    height: auto !important;
  }
  .card-header {
    padding-top: 0.1em;
    padding-bottom: 0.1em;
    .btn-link {
      color: $gray-800;
      @include font-size(1.6rem);
      &:hover {
        text-decoration: none;
      }
      &:focus {
        outline: none;
        box-shadow: none;
        text-decoration: none;
      }
      .mdi {
        display: inline-block;
        color: $gray-800;
        transition: 0.2s transform;
      }
      &[aria-expanded="true"] .mdi {
        transform: rotate(180deg);
      }
    }
  }

  background: #fff;
  @include media-breakpoint-up(lg) {
    padding: 2rem;
  }
}
</style>