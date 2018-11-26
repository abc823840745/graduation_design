<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  .mar-top {
    margin-top: 20px;
  }
  .table-con {
    width: 100%;
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
    margin-right: 30px;
  }
}
</style>
<template>
  <div class="containter">
    <div class="select-con">
      <div
        v-if="!showTwoLevel"
        class="select-list-con"
      >
        <p class="select-title">学期选择:</p>
        <Select
          v-model="semester"
          class="select-list"
        >
          <Option
            v-for="item in semesterList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div>

      <div
        v-if="showTwoLevel"
        class="select-list-con"
      >
        <p class="select-title">完成情况:</p>
        <Select
          v-model="finishCondition"
          class="select-list"
        >
          <Option
            v-for="item in finishList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div>

      <div
        v-if="showTwoLevel"
        class="select-list-con"
      >
        <p class="select-title">作业类型:</p>
        <Select
          v-model="hwClassify"
          class="select-list"
        >
          <Option
            v-for="item in hwClassifyList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div>
    </div>

    <Table
      stripe
      class="table-con mar-top"
      :columns="!showTwoLevel ? columns1 : columns2"
      :data="!showTwoLevel ? data1 : data2"
    />
    <Page
      :total="30"
      class="mar-top"
    />
  </div>
</template>
<script>
export default {
  name: 'my-homework',
  data() {
    return {
      showTwoLevel:false,
      columns1: [
        {
          title: '课程名',
          key: 'courseName',
        },
        {
          title: '操作',
          key: 'operation',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: false,
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      //进入二级目录
                      //TODO:跳转回一级目录第一页
                      this.showTwoLevel = true;
                    },
                  },
                },
                '查看'
              ),
            ]);
          },
        },
      ],
      data1: [
        {
          courseName: '新媒体实训',
        },
        {
          courseName: '新媒体实训',
        },
        {
          courseName: '新媒体实训',
        },
      ],

      columns2: [
        {
          title: '作业名',
          key: 'homeworkName',
        },
        {
          title: '作业类型',
          key: 'homeworkClassify',
        },
        {
          title: '截止时间',
          key: 'stopTime',
        },
        {
          title: '提交情况',
          key: 'submission',
        },
        {
          title: '评分',
          key: 'score',
        },
        {
          title: '操作',
          key: 'operation',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: false,
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      // 打开在线作业详情
                      this.$router.push({
                        name: 'student-online-homework-detail',
                      });
                    },
                  },
                },
                '查看'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: false,
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      //   this.show(params.index);
                      //返回上一步
                      //TODO:跳转回一级目录第一页
                      this.showTwoLevel = false;
                    },
                  },
                },
                '返回'
              ),
            ]);
          },
        },
      ],
      data2: [
        {
          homeworkName: '实验1',
          homeworkClassify: '在线作业',
          stopTime: '2018-9-14',
          submission: '已完成',
          score: '100',
          // operation: '',
        },
      ],
      semester:'',
      semesterList:[
        {
          value: '2016-2017第一学期',
          label: '2016-2017第一学期',
        },
        {
          value: '2016-2017第二学期',
          label: '2016-2017第二学期',
        },
        {
          value: '2017-2018第一学期',
          label: '2017-2018第一学期',
        },
        {
          value: '2017-2018第二学期',
          label: '2017-2018第二学期',
        },
      ],
      finishCondition: '',
      finishList: [
        {
          value: '已完成',
          label: '已完成',
        },
        {
          value: '未完成',
          label: '未完成',
        },
      ],
      hwClassify: '',
      hwClassifyList: [
        {
          value: '课时作业',
          label: '课时作业',
        },
        {
          value: '在线作业',
          label: '在线作业',
        },
      ],
    };
  },
  methods: {},
  created() {},
  mounted() {},
};
</script>
