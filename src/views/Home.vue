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
    methods: {
    },
    mounted() {
      // this.test()
    }
  }
</script>

<style scoped>
</style>
