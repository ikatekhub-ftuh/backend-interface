<template>
  <div>
    <button @click="sudocheck()">privilege</button>
    <p>{{result}}</p>
  </div>
</template>

<script>
  export default {
    name: 'Dashboard',
    data() {
      return {
        result: ''
      }
    },
    methods: {
      sudocheck() {
        axios.get('sudocheck')
          .then((res) => {
            this.result = res.data.message
          })
          .catch((err) => {
            console.log(err)
            this.result = "you are not superadmin"
          })
      }
    }
  }
</script>

<style scoped>
</style>
