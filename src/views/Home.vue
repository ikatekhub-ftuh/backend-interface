<template>
  <div>
    Home
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
