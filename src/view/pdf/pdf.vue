<template>
  <div class="pdf" v-show="fileType === 'pdf'" ref="pdf_window">
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
      <Button class="full-screen-btn" size="small" shape="circle" :icon="is_full_screen?'ios-contract':'ios-expand'" @click="hanleFull"></Button>
    </p>
    <div :class="{'pdf-area': true, 'full-screen': is_full_screen}">
      <pdf
        :src="src"
        :page="currentPage"
        @num-pages="pageCount=$event"
        @page-loaded="currentPage=$event"
        @loaded="loadPdfHandler"
        @click.native="clickChangePage">
      </pdf>
    </div>
    <div class="right-area">

    </div>
  </div>
</template>
<script>
  import pdf from 'vue-pdf'
  export default {
    components: {
      pdf
    },
    props: {
      src: String,
    },
    data () {
      return {
        currentPage: 0,
        pageCount: 0,
        fileType: 'pdf',
        is_full_screen: false
      }
    },
　　created() {
　　　　pdf.createLoadingTask(this.src)
        const _that=this;
        window.addEventListener('resize', function() {
            if (_that.is_full_screen) {
              console.log('退出全屏')
              _that.is_full_screen = false
            }else{
              _that.is_full_screen = true
            }
        })
　　},
    methods: {
      changePdfPage (val) {
        if (val === 0 && this.currentPage > 1) {
          this.currentPage--
        }
        if (val === 1 && this.currentPage < this.pageCount) {
          this.currentPage++
        }
      },
      // pdf加载时
      loadPdfHandler (e) {
        this.currentPage = 1 // 加载的时候先加载第一页
      },
      // 点击PDF触发下一页
      clickChangePage() {
        this.currentPage++
      },
      // 展示全屏
      showFull() {
        var full = this.$refs.pdf_window;
        this.launchIntoFullscreen(full);
      },
      // 全屏函数
      launchIntoFullscreen(element) {
        if(element.requestFullscreen){
            element.requestFullscreen();
        }
        else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
      },
      // 退出全屏
      exitFullscreen() {
        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
      },
      // 点击全屏
      hanleFull() {
        if(this.is_full_screen){
          this.exitFullscreen()
        }else{
          this.showFull()
        }
      }
    }
  }

</script>
<style lang="less" scoped>
.pdf {
  padding-top: 53px;
  width: 100%;
  position: relative;
  display: flex;
  background-color: #fff;
  .pdf-area {
    flex: 1;
    padding-top: 10px;
    &.full-screen {
      padding-top: 0;
      height: calc(~"100vh - 53px");
      overflow-y: auto;
    }
  }
  .right-area {
    width: 300px;
  }
  .arrow {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    text-align: center;
    cursor: pointer;
    padding: 10px 0;
    .full-screen-btn {
      position: absolute;
      right: 20px;
      top: 11px;
    }
  }
}
</style>
