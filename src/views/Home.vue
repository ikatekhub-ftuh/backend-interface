<template>
  <div>
    Home
    <!-- {{role}} -->
    <!-- <img :src="" > -->
  </div>
  <div>
    <Button><router-link :to="{name: 'dashboard'}">Lewat Sini</router-link></Button>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        res: ''
      }
    },
  }
</script>

<style scoped>
</style>
