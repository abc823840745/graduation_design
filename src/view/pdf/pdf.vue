<template>
  <div class="pdf" v-show="fileType === 'pdf'">
    <p class="arrow">
      <ButtonGroup shape="circle" size="small">
          <Button type="dashed" @click="changePdfPage(0)">
              <Icon type="ios-arrow-back"></Icon>
              上一页
          </Button>
          <Button type="dashed" :disabled="true">{{currentPage}} / {{pageCount}}</Button>
          <Button type="dashed" @click="changePdfPage(1)">
              下一页
              <Icon type="ios-arrow-forward"></Icon>
          </Button>
      </ButtonGroup>
    </p>
    <pdf
      :src="src"
      :page="currentPage"
      @num-pages="pageCount=$event"
      @page-loaded="currentPage=$event"
      @loaded="loadPdfHandler">
    </pdf>
  </div>
</template>
<script>
  import pdf from 'vue-pdf'
  export default {
    components: {
      pdf
    },
    props: {
      src: String
    },
    data () {
      return {
        currentPage: 0, // pdf文件页码
        pageCount: 0, // pdf文件总页数
        fileType: 'pdf', // 文件类型
      }
    },
　　created() {
　　　　// 有时PDF文件地址会出现跨域的情况,这里最好处理一下
　　　　pdf.createLoadingTask(this.src)
　　},
    methods: {
      // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
      changePdfPage (val) {
        // console.log(val)
        if (val === 0 && this.currentPage > 1) {
          this.currentPage--
          // console.log(this.currentPage)
        }
        if (val === 1 && this.currentPage < this.pageCount) {
          this.currentPage++
          // console.log(this.currentPage)
        }
      },
      // pdf加载时
      loadPdfHandler (e) {
        this.currentPage = 1 // 加载的时候先加载第一页
      }

    }
  }

</script>
<style lang="less" scoped>
.pdf {
  width: 100%;
  position: relative;
  .arrow {
    // position: absolute;
    // right: 8px;
    // top: -40px;
    text-align: center;
    cursor: pointer;
    margin: 10px 0;
  }
}
</style>
