<template>
  <div class="containter">
    <MultipleChoice
      semesterTip='学期选择'
      :defaultValue.sync='semester'
      :semesterList='semesterList'
      class="flex-start"
    />

    <div class="course-containter">
      <Card
        class="card"
        v-for="item in courseList"
        :key="item['name']"
      >
        <div
          class="course-touch"
          @click='goNext'
        >
          <div class="card-containter">
            <div class="left-con">
              <div
                class="circle"
                :style="{background:getRandomColor()}"
              >
                <p>{{item['name'].slice(0,1)}}</p>
              </div>
            </div>

            <div class="right-con">
              <p>{{item['name']}}</p>
            </div>

          </div>
        </div>

        <div
          class="card-fill"
          v-for="(item,index) in 10"
          :key="index"
        ></div>
      </Card>
    </div>

    <Page
      :total="30"
      class="mar-top"
    />

  </div>
</template>

<script>
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import myMixin from "@teaHomework/mixin";

export default {
  mixins: [myMixin],

  components: {
    MultipleChoice
  },

  data() {
    return {
      semester: "2017-2018第二学期",
      semesterList: [
        {
          value: "2016-2017第一学期",
          label: "2016-2017第一学期"
        },
        {
          value: "2016-2017第二学期",
          label: "2016-2017第二学期"
        },
        {
          value: "2017-2018第一学期",
          label: "2017-2018第一学期"
        },
        {
          value: "2017-2018第二学期",
          label: "2017-2018第二学期"
        }
      ],
      courseList: [
        { name: "新媒体实训" },
        { name: "JavaScript编程" },
        { name: "vue应用程序开发哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈" },
        { name: "新媒体概论" },
        { name: "PhotoShop" },
        { name: "Java" },
        { name: "Flash" },
        { name: "html5" },
        { name: "React" },
        { name: "Angular" }
      ]
    };
  },

  methods: {
    getRandomColor() {
      let colorList = [
        "#4d4af2",
        "#bea41e",
        "#68eec6",
        "#9b2cf2",
        "#d2ee81",
        "#1c87b5",
        "#c21487",
        "#ace114",
        "#5d17cf",
        "#8beebf",
        "#f06072",
        "#e8ea86",
        "#0ac7a5",
        "#8e1aea",
        "#c8f68d",
        "#c219bb",
        "#FF1493",
        "#8B008B",
        "#483D8B",
        "#00BFFF",
        "#2F4F4F",
        "#2E8B57",
        "#FF6347"
      ];
      let color = colorList[Math.floor(Math.random() * colorList.length)];
      return color;
    },

    goNext() {
      this.$emit("goNext");
    }
  }
};
</script>

<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  .course-containter {
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding-top: 3%;

    .card {
      width: 197px;
      height: 97px;
      margin-bottom: 2%;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .course-touch {
        width: 100%;
        height: 97px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .card-containter {
        width: 163px;
        height: auto;
        display: flex;

        .left-con {
          width: 40px;
          display: flex;
          align-items: center;

          .circle {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;

            p {
              color: #fff;
              font-size: 15px;
            }
          }
        }

        .right-con {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-left: 5%;
          overflow: hidden;
          text-overflow: ellipsis; //文本溢出显示省略号
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;

          p {
            font-size: 14px;
            font-weight: bold;
          }
        }
      }
    }

    .card-fill {
      width: 197px;
      height: 0;
    }
  }

  .flex-start {
    align-self: flex-start;
  }

  .mar-top {
    margin-top: 20px;
  }

  .table-con {
    width: 100%;
  }

  .content {
    margin-top: 20px;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content: center;
  }

  .course-name {
    width: 20%;
    height: 120px;
    display: flex;
    background: gainsboro;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 20px;
    border-radius: 10px;
    margin-right: 50px;
    margin-bottom: 20px;
  }

  .course-name:nth-child(4n) {
    margin-right: 0;
  }

  .select-con {
    display: flex;
    align-self: flex-start;
    width: 100%;
  }

  .select-title {
    margin-right: 10px;
  }

  .select-list {
    width: 200px;
  }

  .select-list-con {
    display: flex;
    align-items: center;
  }
}
</style>