<style lang="less">

</style>
<template>
  <div>
    <Tabs @on-click="getName">
      <TabPane style="height:800px;" :label="workItem.name" v-for="(workItem,index) in workType" :key="index" icon="logo-apple">
        <Row>
          <Col v-for="(item,index) in movieList" :key="index" span="6">
          <Card style="margin-bottom:28px;width:320px;cursor:pointer">
            <div @click="goToDetail(item)" style="text-align:center">
              <img class="img-container" :src="item.cover">
              <h3 class="title-wrapper">{{item.title}}</h3>
            </div>
          </Card>
          </Col>
        </Row>
        <Row v-if="total>8">
          <div class="page_container">
            <Page :total="total" @on-change="changePage" />
          </div>
        </Row>
      </TabPane>

    </Tabs>
  </div>
</template>
<script>
  import { getMovieList } from "@/api/movie";
  import { getMyDate } from '@/libs/tools'
  export default {
    name: 'movie_detail',
    data() {
      return {
        workType: [{
          name: '网络与新媒体',
          value: 'network'
        }, {
          name: '数字媒体技术',
          value: 'game'
        }, {
          name: '动画',
          value: 'paint'
        }],
        theme2: 'light',
        curPage: 1,
        pageSizes: 10,
        pageCount: 10,
        total: 1,
        type: "network",
        typeList: ["game", "paint", "network"],
        start: 0,
        keyword: "",
        activeName: "first",
        orderActive: "first",
        movieList: []
      };
    },
    created() {

      this.$nextTick(() => {
        this.getMovie()
      })
    },
    methods: {
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      getName(name) {
        this.type = this.workType[name].value
        this.start = 0
        this.getMovie()
      },
      onSubmit() {
        this.$Message("submit!");
      },
      goToDetail(item) {
        var movie = JSON.stringify(item)
        this.$router.push({ path: `/movie/detail?movie=${movie}` })
      },
      changePage(e) {
        this.start = e - 1
        this.getMovie()
      },
      getMovie() {
        var type = this.type
        var offset = this.start
        var keyword = this.keyword
        getMovieList(type, offset, keyword).then((res) => {
          var movieList = res.data.movies
          if (res.data.status == 1) {
            this.movieList = movieList
            this.total = res.data.count
          }
        })
      },
      handleClick(index) {
        if (index > 3) {
          return
        }
        this.type = this.typeList[index - 1]
        this.curPage = 1
        this.getMovie()
      },
    }
  };

</script>
<style>
  .img-container {
    position: relative;
    width: 290px;
    height: 200px;
  }
  
  .title-wrapper {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .page_container {
    position: absolute;
    right: 120px;
    margin-top: 30px;
  }
</style>