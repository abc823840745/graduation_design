<template>
  <div class="teacher-homework-main df">
    <div class="main-left-con df-fdc">
      <Echart />

      <div class="table-con df-fdc">
        <Table
          border
          class="table mb-10"
          :columns="columns1"
          :data="data1"
        />

        <Page :total="30" />
      </div>

    </div>

    <div class="main-right-con">
      <SliderBar />
    </div>

  </div>
</template>

<script>
import Echart from "@stuHomework/smart/echart";
import SliderBar from "@teaHomework/smart/slider-bar";

export default {
  components: {
    Echart,
    SliderBar
  },

  data() {
    return {
      columns1: [
        {
          title: "课程名",
          key: "courseName"
        },
        {
          title: "待完成实验数量",
          key: "unFinishHomeworkCount"
        },
        {
          title: "已完成实验数量",
          key: "finishHomeworkCount"
        }
      ],
      data1: [
        {
          courseName: "新媒体实训",
          unFinishHomeworkCount: 10,
          finishHomeworkCount: 10
        },
        {
          courseName: "新媒体实训",
          unFinishHomeworkCount: 10,
          finishHomeworkCount: 10
        },
        {
          courseName: "新媒体实训",
          unFinishHomeworkCount: 10,
          finishHomeworkCount: 10
        },
        {
          courseName: "新媒体实训",
          unFinishHomeworkCount: 10,
          finishHomeworkCount: 10
        }
      ]
    };
  }
};
</script>

<style lang='less' >
@import "../../../global/public.less";

.teacher-homework-main {
  .w(100%);

  .main-left-con {
    .w(70%);

    .echart-containter {
      .w(100%);
      display: flex;
    }

    .table-con {
      align-items: flex-end;
      width: 96.5%;
      padding-top: 3%;
      padding-left: 3%;
      box-sizing: border-box;

      .table {
        width: 100%;
      }
    }
  }

  .main-right-con {
    .w(30%);
  }
}
</style>