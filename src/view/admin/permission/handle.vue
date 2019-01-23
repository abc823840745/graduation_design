<template>
  <div class="goods-all">
    <div class="btn_con">
      <Button type="primary" @click="new_modal=true">添加新操作</Button>
      <Button class="update_btn" @click="changeHandle" type="warning">更新操作权限</Button>
    </div>
    <Table
      border
      @on-selection-change="getSelection"
      :columns="columns"
      :data="tableData"
      size="large"
      no-data-text="暂时未到开题时间"
    ></Table>
    <Modal v-model="new_modal" width="800">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>注意：操作名称一定要填写英文，操作描述可以为中文！</span>
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
  deleteHandle,
  changeHandle
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
      haveSelect: [],
      mid: 0,
      form: {
        id: 0,
        name: "",
        handle_desc: ""
      },
      update_modal: false,
      new_modal: false,
      modules: [],
      content_modal: false,
      page: 1,
      total: 21,
      pageSize: 10,
      tableData: [],
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
          type: "selection",
          width: 60,
          align: "center"
        },
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
            if (item.status == 1) {
              this.haveSelect.push(item.id);
              item["_checked"] = true;
            }
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
          form.m_id = this.mid;
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
    },
    getSelection(selection) {
      selection = selection.map(item => {
        return item.id;
      });
      console.log(selection)
      this.haveSelect = selection;
    },
    changeHandle() {
      this.$Modal.confirm({
        title: "更新权限控制",
        content: "<p>确定要更改该角色权限控制操作为复选框中的内容?</p>",
        onOk: () => {
          changeHandle(this.haveSelect,this.mid).then(res => {
            if (res.data.message === "ok") {
               this.getHandle();
              this.$Message.success("更新成功");
            }else{
               this.$Message.error("更新失败，请稍后再试！");
            }
              this.$Modal.remove();
          });
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

.btn_con {
  position: relative;
  margin: 5px 0 10px 0;
}
.update_btn {
  position: relative;
  margin-left: 15px;
}
.page_container {
  position: absolute;
  right: 20px;
  margin-top: 30px;
}
</style>