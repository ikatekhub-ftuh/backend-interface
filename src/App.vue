<template>
  <ConfirmPopup class="max-lg:hidden" group="popup"></ConfirmPopup>
  <ConfirmDialog class="lg:hidden" group="dialog"></ConfirmDialog>
  <Toast class="max-lg:hidden"></Toast>
  <div class="page">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        default: {
          title: 'IKATEKhub FTUH'
        }
      };
    },
    provide() {
      return {
        default: this.default
      };
    }
  };
</script>
