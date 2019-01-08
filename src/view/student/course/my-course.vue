<style lang="less">
.select_bar {
  margin-bottom: 10px;
  .st {
    display: inline-block;
    margin-left: 10px;
    line-height: 24px;
  }
}
.class_wrap {
  overflow: hidden;
  .class_box {
    position: relative;
    float: left;
    border: 1px solid #ddd;
    margin: 8px;
    border-radius: 10px;
    width: 220px;
    height: 100px;
    padding: 24px 10px 10px 10px;
    background-color: #fff;
    font-size: 12px;
    color: #666;
    text-align: center;
    cursor: pointer;
    .class_name {
      font-weight: 600;
      font-size: 14px;
    }
    .course_code,.class_code {
      margin: 0 4px;
    }
    .class_del {
      position: absolute;
      cursor: pointer;
      right: 8px;
      top: 4px;
      width: 20px;
      height: 20px;
      background-size: 20px 20px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA8UlEQVRYR+2WQQrCQAxF89UD6F6v4SVEmll06eHcS5Od3kEv4cKleIHWiKBQpLWhLVRhuhzy819/yjSggR8M7E8RwJ0AMy+JaAdg0TC2M4A0y7KjZ7y1AMx8+GiwBDDzNDWzKxGdSrWFqq6qtLUAIQQrC8yMAF9gVbUiUin+XQBP1H3U+DLtw6mmRxPAKIRQdPAvRGTyTR8B/isBMzNVHaVpOs7zPC/N9i4i44rzfr+BCBATiAnEBAZPoMVfsd+bcAgAYuYbgGkL86fkIiLzLvsAJUmyBrD1bsRvs9dmvFHVfSeAlm/uljXtA+5GbQsjwAMKakAw4ooGqAAAAABJRU5ErkJggg==);
    }
  }
}
.page_nav {
  text-align: center;
}
</style>
<template>
  <div>
    <div class="select_bar">
      <span class="st">学年：</span>
      <Select v-model="year" @on-change="changeYear" placeholder="请选择学年" size="small" style="width:80px">
        <Option v-for="item in year_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <span class="st">学期：</span>
      <Select v-model="term" @on-change="changeTerm" placeholder="请选择学期" size="small" style="width:120px">
        <Option value="1">第一学期</Option>
        <Option value="2">第二学期</Option>
      </Select>
    </div>
    <div class="class_wrap">
      <div class="class_box" v-for="(item,index) in course_list" :key="index" @click="goCourseDetail(item)">
        <h3 class="class_name">{{item.name}}</h3>
        <p class="course_code">课程代码：{{item.course_code}}</p>
        <p class="class_code">教学班：{{item.class_code}}</p>
        <!-- <i class="class_del"></i> -->
      </div>
    </div>
    <div class="page_nav">
      <Page :total="total" :current="current" :page-size="page_size" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'my-course',
  data () {
    return {
      current: 1,
      page_size: 10,
      total: 1,
      year: '2018',
      term: '1',
      year_list: [
        {
          value: '2018',
          label: '2018'
        },
        {
          value: '2017',
          label: '2017'
        },
        {
          value: '2016',
          label: '2016'
        },
        {
          value: '2015',
          label: '2015'
        }
      ],
      course_list: [
        {
          id: 1,
          name: 'Java基础',
          course_code: 'GS4002',
          class_code: 'ACM01'
        },
        {
          id: 2,
          name: 'HTML5网页设计',
          course_code: 'GS4003',
          class_code: 'AMT02'
        }
      ]
    }
  },
  methods: {
    changeYear (e) {
      console.log(e)
    },
    changeTerm (e) {
      console.log(e)
    },
    goCourseDetail (item) {
      console.log(item)
      this.$router.push(`course-detail/${item.id}`)
    }
  },
  created () {},
  mounted () {}
}
</script>
