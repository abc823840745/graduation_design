<template>
  <div class="goods-all">
    <Table border :columns="columns" :data="tableData" size="large" no-data-text="该角色暂时没有负责的模块"></Table>
    <div class="choice_btn">
      <Button type="primary" @click="new_modal=true">添加新模块</Button>
      <p class="choice_tip">注意：权限模块一定要填写英文，模块描述可以为中文！</p>
    </div>
    <Modal v-model="new_modal" width="800">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>确定要添加模块？</span>
      </p>
      <Form :model="form" ref="content" :label-width="80" :rules="ruleInline">
        <FormItem prop="name" label="模块名称">
          <Input v-model="form.name" placeholder="请输入模块名称"></Input>
        </FormItem>
        <FormItem prop="module_desc" label="模块描述">
          <Input
            v-model="form.module_desc"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入模块描述"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="addNewModule">确定添加</Button>
      </div>
    </Modal>
    <Modal v-model="update_modal" width="500">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>模块信息管理</span>
      </p>
      <Form :model="form" ref="content" :label-width="80" :rules="ruleInline">
        <FormItem prop="name" label="模块名称">
          <Input v-model="form.name" placeholder="请输入模块名称"></Input>
        </FormItem>
        <FormItem prop="module_desc" label="模块简介">
          <Input
            v-model="form.module_desc"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入模块简介"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="updateModule">更新</Button>
      </div>
      <div slot="footer">
        <Button
          type="error"
          style="margin-top: 10px"
          size="large"
          long
          @click="deleteModule(form.id)"
        >删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getModules,
  addNewModule,
  updateModule,
  deleteModule
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
      rid: 0,
      form: {
        id: 0,
        name: "",
        module_desc: ""
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
        module_desc: [
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
            message: "请输入模块姓名",
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
          title: "模块名称",
          key: "name",
          align: "center"
        },
        {
          title: "模块描述",
          key: "module_desc",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          width: 380,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.seeDetail(this.tableData[params.index].id);
                    }
                  }
                },
                "查看模块操作"
              ),
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
                "编辑模块"
              )
            ]);
          }
        }
      ]
    };
  },
  created() {
    this.$nextTick(() => {
      this.rid = this.$route.query.id;
      this.getModules();
    });
  },
  methods: {
    getModules() {
      let rid = this.rid;
      getModules(rid).then(res => {
        if (res.data.message == "ok") {
          this.tableData = res.data.modules;
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
    addNewModule() {
      const form = this.form;
      form.time = new Date().getTime();
      form.r_id = this.rid;
      this.$refs["content"].validate(validate => {
        if (validate) {
          addNewModule(form).then(res => {
            if (res.data.message == "ok") {
              this.new_modal = false;
              this.$Notice.success({
                title: "添加成功!"
              });
              this.getModules();
            } else {
              this.$Notice.error({
                title: "操作失败，请稍后再试!"
              });
            }
          });
        }
      });
    },
    updateModule() {
      this.$refs["content"].validate(validate => {
        if (validate) {
          let form = this.form;
          form.r_id = this.rid;
          form.time = new Date().getTime();
          updateModule(form).then(res => {
            if (res.data.message == "ok") {
              this.$Notice.success({
                title: "更新成功"
              });
              this.update_modal = false;
              this.getModules();
            }
          });
        }
      });
    },
    deleteModule(id) {
      deleteModule(id).then(res => {
        if (res.data.message == "ok") {
          this.$Notice.success({
            title: "删除成功!"
          });
          this.update_modal = false;
          this.getModules();
        }
      });
    },
    seeDetail(id) {
     this.$router.push({
          path:"/admin/handle-manager",
          query:{
            id
          }
      })
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