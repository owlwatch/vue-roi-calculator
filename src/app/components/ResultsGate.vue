<!-- Pug Template -->
<template lang="pug">
<!-- Modal -->
.modal.fade(
  :id="id" 
  tabindex="-1" 
  role="dialog" 
  :aria-labelledby="`${id}-label`"
  aria-hidden="true"
  ref="modal"
)
  .modal-dialog(role="document")
    .modal-content
      .modal-header
        h3.modal-title(:id="`${id}-label`") Receive your custom report
        button.close(
          type="button" 
          data-bs-dismiss="modal"
          aria-label="Close"
        )
          span(aria-hidden="true") &times;

      .modal-body
        form.mktoForm(
          id="mktoForm_10468"
          data-formId="10468"
        )
</template>

<!-- Script -->
<script>
const $ = jQuery;
import FloatingLabel from 'vue-simple-floating-labels/src/components/FloatingLabel';
export default {

  components: {FloatingLabel},

  props : {
    id: {
      type: String,
      required: true
    },
    marketo_form_id: {
      type: String,
      required: true,
      default: '10468'
    },
    state: {
      type: Object,
      required: true
    },
    pdfUrl: {
      type: String
    }
  },
  data() {
    return {
      marketoLoaded: false
    }
  },
  mounted(){
    this.loadForm();
  },
  watch: {
    pdfUrl(){
      const $form = $(this.$el).find('form');
      $form.find('[name="iTMROICalculatorPDFLink"]').val(this.pdfUrl);
    }
  },
  methods: {
    loadForm(){
      this.marketoLoaded = false;
      MktoForms2.loadForm("//app-abj.marketo.com", "309-RHV-619", this.marketo_form_id, (form) => {
        
        const $form = $(this.$el).find('form');
        if( !$form.length ){
          return;
        }
        $form.find('.mktoFieldWrap').addClass('form-group');
        $form.find('.mktoLabel').addClass('control-label');
        $form.css('width','').find('.mktoField').addClass('form-control');
        $form.find('label').find('.mktoAsterix').each( function(){
          $(this).appendTo( $(this).parent() );
        });
        $form.find('[name="iTMROICalculatorPDFLink"]').val(this.pdfUrl);
        // $form.find('[name="iTMAssessmentIndustry"]').on('change', e => {
        //   this.user.industry = $(e.target).val();
        // });
        // $form.find('[name="iTMAssessmentOrgSize"]').on('change', e => {
        //   this.user.size = $(e.target).val();
        // });
        // $form.find('[name="Company"]').on('change', e => {
        //   this.user.company = $(e.target).val();
        // });
        $form.find('.mktoButton').addClass('btn btn-primary btn-lg font-heading');
        $form.find('.mktoButtonWrap').attr('style','');

        form.onSuccess( form => { 
          this.$emit('complete');
          return false;
        });

        this.marketoLoaded = true;
        this.floatingLabels();
      });
    },

    floatingLabels(){
      
      $(this.$el).find('.form-control').on('focus input  select blur change', function (e) {
        var $currEl = $(e.currentTarget);

        if($currEl.is('select')) {
          if($currEl.val() === $("option:first", $currEl).val()) {
            $('.control-label', $currEl.parent()).animate({opacity: 0}, 240);
            $currEl.parent().removeClass('focused');
          } else {
            $('.control-label', $currEl.parent()).css({opacity: 1});
            $currEl.parents('.form-group').toggleClass('focused', ((e.type === 'focus' || e.type === 'focusin' || this.value.length > 0) && ($currEl.val() !== $("option:first", $currEl).val())));
          }
        } else {
          $currEl.parents('.form-group').toggleClass('focused', (e.type === 'focus' || e.type === 'focusin' || this.value.length > 0));
        }
      }).trigger('blur');
    }
  }
};
</script>

<!-- SCSS Style -->
<style lang="scss" scoped>
.modal-header {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 0;
  h3 {
    display: block;
    width: 100%;
    text-align: center;
  }
}
.mktoForm {
  width: 100% !important;
  &::v-deep {
    .mktoOffset {
      display: none;
    }

    .mktoAsterix {
      position: static !important;
      margin: 0 0 0 0.5em!important;
      display: inline !important;
    }

    .mktoGutter {
      display: none;
    }

    .control-label {
      color: #ccc;
      margin-top: 0;
      padding-top: 0;
      padding-left: 10px;
      margin-bottom: 0;
    }

    .form-group {
        display: flex;
        height: 55px;
        margin: 0 auto 1em;
    }

    .control-label {
        font-size: 16px;
        width: auto !important;
        font-weight: 400 !important;
        opacity: 1;
        text-transform: none;
        pointer-events: none;
        position: absolute;
        transform: translate3d(0, 22px, 0) scale(1);
        transform-origin: left top;
        transition: 240ms;
        line-height: 29px;
    }

    .form-group.focused .control-label {
        opacity: 1;
        transform: scale(0.75);
        color: #2196f3;
    }

    .form-control {
        align-self: flex-end;
        &::-webkit-input-placeholder,
        &::-moz-placeholder,
        &::placeholder {
          color: transparent !important;
        }
    }

    .form-control::-webkit-input-placeholder {
        color: transparent !important;
        transition: 240ms;
    }

    .form-control:focus::-webkit-input-placeholder {
        transition: none;
    }

    .form-group.focused .form-control::-webkit-input-placeholder {
        
    }



    /* CSS from Bootstrap Start */
    .form-control {
      display: block;
      width: 100%;
      height: 37px;
      padding: 6px 16px;
      font-size: 13px;
      line-height: 1.846;
      color: #666666;
      background-color: transparent;
      background-image: none;
      border: 1px solid transparent;
      border-radius: 3px;
      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
      -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
      -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
      transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    }
    .form-control:focus {
      border-color: #66afe9;
      outline: 0;
      -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);
      box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);
    }
    .form-control::-moz-placeholder {
      color: #bbbbbb;
      opacity: 1;
    }
    .form-control:-ms-input-placeholder {
      color: #bbbbbb;
    }
    .form-control::-webkit-input-placeholder {
      color: #bbbbbb;
    }
    .form-control::-ms-expand {
      border: 0;
      background-color: transparent;
    }
    .form-control[disabled],
    .form-control[readonly],
    fieldset[disabled] .form-control {
      background-color: transparent;
      opacity: 1;
    }
    .form-control[disabled],
    fieldset[disabled] .form-control {
      cursor: not-allowed;
    }
    textarea.form-control {
      height: auto;
    }
    input[type="search"] {
      -webkit-appearance: none;
    }
    textarea,
    textarea.form-control,
    input.form-control,
    input[type=text],
    input[type=password],
    input[type=email],
    input[type=number],
    [type=text].form-control,
    [type=password].form-control,
    [type=email].form-control,
    [type=tel].form-control,
    [contenteditable].form-control {
      padding: 0;
      border: none;
      border-radius: 0;
      -webkit-appearance: none;
      -webkit-box-shadow: inset 0 -1px 0 #dddddd;
      box-shadow: inset 0 -1px 0 #dddddd;
      font-size: 16px;
    }
    textarea:focus,
    textarea.form-control:focus,
    input.form-control:focus,
    input[type=text]:focus,
    input[type=password]:focus,
    input[type=email]:focus,
    input[type=number]:focus,
    [type=text].form-control:focus,
    [type=password].form-control:focus,
    [type=email].form-control:focus,
    [type=tel].form-control:focus,
    [contenteditable].form-control:focus {
      -webkit-box-shadow: inset 0 -2px 0 #2196f3;
      box-shadow: inset 0 -2px 0 #2196f3;
    }
    textarea[disabled],
    textarea.form-control[disabled],
    input.form-control[disabled],
    input[type=text][disabled],
    input[type=password][disabled],
    input[type=email][disabled],
    input[type=number][disabled],
    [type=text].form-control[disabled],
    [type=password].form-control[disabled],
    [type=email].form-control[disabled],
    [type=tel].form-control[disabled],
    [contenteditable].form-control[disabled],
    textarea[readonly],
    textarea.form-control[readonly],
    input.form-control[readonly],
    input[type=text][readonly],
    input[type=password][readonly],
    input[type=email][readonly],
    input[type=number][readonly],
    [type=text].form-control[readonly],
    [type=password].form-control[readonly],
    [type=email].form-control[readonly],
    [type=tel].form-control[readonly],
    [contenteditable].form-control[readonly] {
      -webkit-box-shadow: none;
      box-shadow: none;
      border-bottom: 1px dotted #ddd;
    }
    textarea.input-sm,
    textarea.form-control.input-sm,
    input.form-control.input-sm,
    input[type=text].input-sm,
    input[type=password].input-sm,
    input[type=email].input-sm,
    input[type=number].input-sm,
    [type=text].form-control.input-sm,
    [type=password].form-control.input-sm,
    [type=email].form-control.input-sm,
    [type=tel].form-control.input-sm,
    [contenteditable].form-control.input-sm {
      font-size: 12px;
    }
    textarea.input-lg,
    textarea.form-control.input-lg,
    input.form-control.input-lg,
    input[type=text].input-lg,
    input[type=password].input-lg,
    input[type=email].input-lg,
    input[type=number].input-lg,
    [type=text].form-control.input-lg,
    [type=password].form-control.input-lg,
    [type=email].form-control.input-lg,
    [type=tel].form-control.input-lg,
    [contenteditable].form-control.input-lg {
      font-size: 17px;
    }
    select,
    select.form-control {
      border: 0;
      border-radius: 0;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      padding-left: 0;
      padding-right: 0\9;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAJ1BMVEVmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmaP/QSjAAAADHRSTlMAAgMJC0uWpKa6wMxMdjkoAAAANUlEQVR4AeXJyQEAERAAsNl7Hf3X6xt0QL6JpZWq30pdvdadme+0PMdzvHm8YThHcT1H7K0BtOMDniZhWOgAAAAASUVORK5CYII=);
      -webkit-background-size: 13px 13px;
              background-size: 13px;
      background-repeat: no-repeat;
      background-position: right center;
      -webkit-box-shadow: inset 0 -1px 0 #dddddd;
      box-shadow: inset 0 -1px 0 #dddddd;
      font-size: 16px;
      line-height: 1.5;
    }
    select::-ms-expand,
    select.form-control::-ms-expand {
      display: none;
    }
    select.input-sm,
    select.form-control.input-sm {
      font-size: 12px;
    }
    select.input-lg,
    select.form-control.input-lg {
      font-size: 17px;
    }
    select:focus,
    select.form-control:focus {
      -webkit-box-shadow: inset 0 -2px 0 #2196f3;
      box-shadow: inset 0 -2px 0 #2196f3;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAJ1BMVEUhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISF8S9ewAAAADHRSTlMAAgMJC0uWpKa6wMxMdjkoAAAANUlEQVR4AeXJyQEAERAAsNl7Hf3X6xt0QL6JpZWq30pdvdadme+0PMdzvHm8YThHcT1H7K0BtOMDniZhWOgAAAAASUVORK5CYII=);
    }
    select[multiple],
    select.form-control[multiple] {
      background: none;
    }

    .mktoButtonRow {
      display: block;
      text-align: center;
    }

  }
}
</style>