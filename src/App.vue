<template>
  <ConfirmPopup></ConfirmPopup>
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
