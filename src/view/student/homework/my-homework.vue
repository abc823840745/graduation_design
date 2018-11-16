<style lang="less">

</style>
<template>
  <div>
  </div>
</template>
<script>
  export default {
    name: 'my-homework',
    data() {
      return {
      }
    },
    methods: {

    },
    created() {
      let data = JSON.parse(this.$route.query.data)
      console.log(data.lesson)
    },
    mounted() {

    }
  }

</script>