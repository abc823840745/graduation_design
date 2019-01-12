<template>
  <div class="goods-all">
    <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时未到开题时间"></Table>
    <div class="choice_btn">
      <Button type="primary" @click="new_modal=true">添加新操作</Button>
      <p class="choice_tip">注意：权限操作一定要填写英文，操作描述可以为中文！</p>
    </div>
    <Modal v-model="new_modal" width="800">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>确定要添加操作？</span>
      </p>
      <Form :model="form" ref="content" :label-width="80" :rules="ruleInline">
        <FormItem prop="name" label="操作名称">
          <Input v-model="form.name" placeholder="请输入操作名称"></Input>
        </FormItem>
        <FormItem prop="handle_desc" label="操作描述">
          <Input
            v-model="form.handle_desc"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入操作描述"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="addNewHandle">确定添加</Button>
      </div>
    </Modal>
    <Modal v-model="update_modal" width="500">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>操作信息管理</span>
      </p>
      <Form :model="form" ref="content" :label-width="80" :rules="ruleInline">
        <FormItem prop="name" label="操作名称">
          <Input v-model="form.name" placeholder="请输入操作名称"></Input>
        </FormItem>
        <FormItem prop="handle_desc" label="操作简介">
          <Input
            v-model="form.handle_desc"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入操作简介"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="updateHandle">更新</Button>
      </div>
      <div slot="footer">
        <Button
          type="error"
          style="margin-top: 10px"
          size="large"
          long
          @click="deleteHandle(form.id)"
        >删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getHandle,
  addNewHandle,
  updateHandle,
  deleteHandle
} from "@/api/permission";
import { getMyDate } from "@/libs/tools";
import config from "@/config";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? config.baseUrl.dev
    : config.baseUrl.pro;
const uploadUrl = baseUrl + "/upload/work";
let timer = null;
export default {
  name: "choice-teacher",
  data() {
    return {
      mid: 0,
      form: {
        id: 0,
        name: "",
        handle_desc: ""
      },
      update_modal: false,
      tableLoading: false,
      new_modal: false,
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      tableTitle: [],
      file: null,
      modules: [],
      content_modal: false,
      guide_teacher: "",
      page: 1,
      total: 21,
      pageSize: 10,
      selectable: false,
      haveSelect: [],
      originSelect: [],
      uploadUrl,
      uploadList: [],
      userInfo: {},
      info: {},
      modal1: false,
      tableData: [],
      newData: [],
      ruleInline: {
        handle_desc: [
          {
            required: true,
            message: "请输入有效的描述",
            trigger: "blur",
            type: "string"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入操作姓名",
            trigger: "blur",
            type: "string"
          }
        ]
      },
      columns: [
        {
          title: "添加日期",
          key: "time",
          align: "center"
        },
        {
          title: "操作名称",
          key: "name",
          align: "center"
        },
        {
          title: "操作描述",
          key: "handle_desc",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          width: 300,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.update_modal = true;
                      this.form = this.tableData[params.index];
                    }
                  }
                },
                "编辑操作"
              )
            ]);
          }
        }
      ]
    };
  },
  created() {
    this.$nextTick(() => {
      this.mid = this.$route.query.id;
      this.getHandle();
    });
  },
  methods: {
    getHandle() {
      let mid = this.mid;
      getHandle(mid).then(res => {
        if (res.data.message == "ok") {
          this.tableData = res.data.handles;
          this.tableData.forEach(item => {
            item.time = getMyDate(item.time, "yyyy-MM-dd");
          });
        } else {
          this.$Notice.error({
            title: "操作失败，请稍后再试!"
          });
        }
      });
    },
    addNewHandle() {
      const form = this.form;
      form.time = new Date().getTime();
      form.m_id = this.mid;
      this.$refs["content"].validate(validate => {
        if (validate) {
          addNewHandle(form).then(res => {
            if (res.data.message == "ok") {
              this.new_modal = false;
              this.$Notice.success({
                title: "添加成功!"
              });
              this.getHandle();
            } else {
              this.$Notice.error({
                title: "操作失败，请稍后再试!"
              });
            }
          });
        }
      });
    },
    updateHandle() {
      this.$refs["content"].validate(validate => {
        if (validate) {
          let form = this.form;
           form.m_id =this.mid
          form.time = new Date().getTime();
          updateHandle(form).then(res => {
            if (res.data.message == "ok") {
              this.$Notice.success({
                title: "更新成功"
              });
              this.update_modal = false;
              this.getHandle();
            }
          });
        }
      });
    },
    deleteHandle(id) {
      deleteHandle(id).then(res => {
        if (res.data.message == "ok") {
          this.$Notice.success({
            title: "删除成功!"
          });
          this.update_modal = false;
          this.getHandle();
        }
      });
    }
  }
};
</script>

<style>
.menber_list {
  position: relative;
  margin-bottom: 10px;
  cursor: pointer;
}

.tag_list {
  position: relative;
  margin: 10px 0;
}

.choice_btn {
  position: fixed;
  width: 320px;
  text-align: center;
  left: 50%;
  bottom: 80px;
  transform: translateX(-20px);
  margin: 0 auto;
}

.choice_tip {
  position: relative;
  margin-top: 10px;
}

.upload_container {
  position: relative;
  margin: 15px 0;
  left: 50%;
  transform: translateX(-80px);
}

.page_container {
  position: absolute;
  right: 20px;
  margin-top: 30px;
}
</style>