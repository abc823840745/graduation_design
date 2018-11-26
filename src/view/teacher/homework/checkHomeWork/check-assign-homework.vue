<style lang="less" scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.mar-top {
  margin-top: 20px;
}
.table-con {
  width: 100%;
}

.header-con {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: transparent;
  .homework-progress {
    display: flex;
    align-items: center;
    .homework-progress-text {
      margin-right: 10px;
    }
  }
}
</style>
<template>
  <div class="containter">
    <home-work
      :selTip="selTip"
      @onChangeSelVal="onChangeSelVal"
      :completeProgress="70"
    />

    <Table
      stripe
      :columns="showTable(currentLevel , 'columns')"
      :data="showTable(currentLevel , 'data')"
      class="table-con mar-top"
    ></Table>
    <Page
      :total="30"
      class="mar-top"
    />

    <Button
      v-if="currentLevel === 3"
      type="primary"
      @click="submit"
      class="mar-top"
      size='large'
    >全部下载</Button>
  </div>

</template>
<script>
import homeWork from '../smart/homework-info';
export default {
  name: 'check-assign-homework',
  components: {
    homeWork,
  },
  data() {
    return {
      currentLevel: 1,
      selTip:'学期选择',
      selValue: '',
      selList: [
        {
          value: '已完成',
          label: '已完成',
        },
        {
          value: '未完成',
          label: '未完成',
        },
      ],
      columns1: [
        {
          title: '课程',
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
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      //   this.show(params.index);
                      //打开二级目录
                      this.currentLevel = 3;
                      this.selTip = '作业情况';
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
          courseName:'新媒体实训',
        },
      ],

      columns2: [
        {
          title: '班级',
          key: 'className',
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
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      //   this.show(params.index);
                      //打开二级目录
                      this.currentLevel = 2;
                      // this.selTip = '作业情况';
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
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      //   this.show(params.index);
                      //返回一级目录
                      this.currentLevel = 1;
                      this.selTip = '学期选择';
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
          className:'ATM',
        },
      ],

      columns3: [
        {
          title: '学号',
          key: 'studentId',
        },
        {
          title: '姓名',
          key: 'name',
        },
        {
          title: '提交情况',
          key: 'submission',
        },
        {
          title: '评分',
          key: 'score',
          render: (h, params) => {
            return h('div', [
              h('Rate', {
                props: {
                  value: 3,
                },
                style: {
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    // 评分
                  },
                },
              }),
            ]);
          },
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
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      //TODO:打开实验报告
                    },
                  },
                },
                '下载并打开'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      //返回上一步
                    this.currentLevel = 2;
                    // this.selTip = '学期选择';
                    },
                  },
                },
                '返回'
              ),
            ]);
          },
        },
      ],
      data3: [
        {
          studentId: '1540624158',
          name: '吕嘉俊',
          submission: '已完成',
          score: '',
          operation: '',
        },
      ],
    };
  },
  methods: {
    submit() {
      console.log('submit');
    },
    onChangeSelVal(data) {
      this.selValue = data.selValue;
    },
    showTable(condition , data){
      console.warn(condition,data);
      switch(condition){
        case 1:
          return data + '1'
          break;
        case 2:
          return data + '2'
          break;
        case 3:
          return data + '3'
          break;
      }
    }
  },
  created() {},
  mounted() {},
};
</script>
