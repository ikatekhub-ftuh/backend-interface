<template>
  <div>
    Home
  </div>
  <div>
    <router-link class="ml-2" v-for="item in $router.options.routes" :to="{name: item.name}">{{item.name}}</router-link>
  </div>
</template>

<script>
</script>

<style scoped>
</style>
