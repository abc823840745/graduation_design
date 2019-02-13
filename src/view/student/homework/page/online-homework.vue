<template>
  <div class="containter">
    <CourseSelect
      v-show="isSelectCourse"
      @goNext='goNext'
    />

    <div
      class="containter"
      v-show="!isSelectCourse && curDirectory !== 2"
    >
      <Modal
        v-model="showModal"
        title="上传"
        @on-ok="dialogOk"
        @on-cancel="dialogCancel"
      >
        <Alert show-icon>只能上传单个文件或文件夹，如果上传有误，请重新上传即可</Alert>

        <Select
          v-model="weeksNum"
          placeholder='请选择周数'
          style="width:200px;margin-bottom:10px;"
        >
          <Option
            v-for="item in weeksList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>

        <Upload
          ref="upload"
          type="drag"
          :on-remove="handleremove"
          action="//jsonplaceholder.typicode.com/posts/"
        >
          <div style="padding: 20px 0">
            <Icon
              type="ios-cloud-upload"
              size="52"
              style="color: #3399ff"
            ></Icon>
            <p>点击或者把文件拖拽到这里</p>
          </div>
        </Upload>
      </Modal>

      <div class="select-con">
        <MultipleChoice
          v-for="(item,index) in selectList"
          :key="index"
          :defaultValue="item['defaultValue']"
          :semesterTip="item['semesterTip']"
          :semesterList="item['semesterList']"
        />

        <Input
          class="search-item"
          search
          enter-button
          placeholder="请输入关键词"
        />
      </div>

      <Table
        border
        class="table-con mar-top"
        :columns="columns1"
        :data="data1"
      />

      <Page
        :total="30"
        class="mar-top"
      />
    </div>

    <WriteOnlineHomework
      v-show="curDirectory===2"
      @goBack="goBack"
    />
  </div>
</template>

<script>
import CourseSelect from "@teaHomework/smart/course-select";
import MultipleChoice from "@teaHomework/smart/multiple-choice";
import WriteOnlineHomework from "@stuHomework/smart/write-online-homework.vue";
import myMixin from "@stuHomework/mixin";

export default {
  mixins: [myMixin],

  components: {
    CourseSelect,
    MultipleChoice,
    WriteOnlineHomework
  },

  data() {
    return {
      isSelectCourse: true,
      curDirectory: 1, // 当前的目录
      showModal: false,
      weeksNum: "",
      weeksList: [
        {
          value: "第一周",
          label: "第一周"
        },
        {
          value: "第二周",
          label: "第二周"
        },
        {
          value: "第三周",
          label: "第三周"
        },
        {
          value: "第四周",
          label: "第四周"
        },
        {
          value: "第五周",
          label: "第五周"
        },
        {
          value: "第六周",
          label: "第六周"
        }
      ],
      selectList: [
        {
          semesterTip: "周数",
          defaultValue: "",
          semesterList: [
            {
              value: "第一周",
              label: "第一周"
            },
            {
              value: "第二周",
              label: "第二周"
            }
          ]
        },
        {
          semesterTip: "状态",
          defaultValue: "",
          semesterList: [
            {
              value: "未完成",
              label: "未完成"
            },
            {
              value: "已完成",
              label: "已完成"
            },
            {
              value: "已过期",
              label: "已过期"
            }
          ]
        }
      ],
      columns1: [
        {
          title: "实验",
          key: "experiment"
        },
        {
          title: "周数",
          key: "weeksNum"
        },
        {
          title: "完成时间",
          key: "finishTime"
        },
        {
          title: "状态",
          key: "status"
        },
        {
          title: "操作",
          key: "operation",
          render: (h, params) => {
            return h("div", [
              this.btnStyle("完成作业", h, () => {
                const status = params["row"]["status"];
                if (status === "已完成") {
                  return this.$Message.info("你已完成作业");
                }
                this.curDirectory = 2;
              })
            ]);
          }
        }
      ],
      data1: [
        {
          weeksNum: "第一周",
          experiment: "堂上构建简单服务器",
          finishTime: "10分钟",
          status: "未完成"
        },
        {
          weeksNum: "第二周",
          experiment: "构建简单服务器",
          finishTime: "10分钟",
          status: "未完成"
        }
      ]
    };
  },

  methods: {
    goNext() {
      this.isSelectCourse = false;
    },

    goBack() {
      this.curDirectory = 1;
    }
  }
};
</script>

<style lang='less' scoped>
.containter {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .mar-top {
    margin-top: 2.5%;
  }

  .table-con {
    width: 100%;
  }

  .select-con {
    display: flex;
    align-self: flex-start;
    width: 100%;

    .search-item {
      margin-left: 4%;
      width: 20%;
    }
  }
}
</style>
