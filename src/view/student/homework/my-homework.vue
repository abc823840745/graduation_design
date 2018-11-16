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
      console.log(JSON.parse(this.$route.query.data))
    },
    mounted() {

    }
  }

</script>