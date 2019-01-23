<template>
  <div class="goods-all">
    <div class="choice_btn">
      <Button type="success" @click="new_modal=true">添加新角色</Button>
    </div>
    <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时未到开题时间"></Table>
    <Modal v-model="new_modal" width="600">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>注意：权限角色一定要填写英文，角色描述可以为中文！</span>
      </p>
      <Form :model="form" ref="content" :label-width="80" :rules="ruleInline">
        <FormItem prop="name" label="角色名称">
          <Input v-model="form.name" placeholder="请输入角色名称"></Input>
        </FormItem>
        <FormItem prop="role_desc" label="角色描述">
          <Input
            v-model="form.role_desc"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入角色描述"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="addNewRole">确定添加</Button>
      </div>
    </Modal>
    <Modal v-model="update_modal" width="500">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>角色信息管理</span>
      </p>
      <Form :model="form" ref="content" :label-width="80" :rules="ruleInline">
        <FormItem prop="name" label="角色名称">
          <Input v-model="form.name" placeholder="请输入角色名称"></Input>
        </FormItem>
        <FormItem prop="role_desc" label="角色简介">
          <Input
            v-model="form.role_desc"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入角色简介"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="updateRole">更新</Button>
      </div>
      <div slot="footer">
        <Button
          type="error"
          style="margin-top: 10px"
          size="large"
          long
          @click="deleteRole(form.id)"
        >删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getRoles, addNewRole, updateRole, deleteRole } from "@/api/permission";
import { getMyDate } from "@/libs/tools";
import config from "@/config";
export default {
  name: "choice-teacher",
  data() {
    return {
      form: {
        id: 0,
        name: "",
        role_desc: ""
      },
      update_modal: false,
      new_modal: false,
      content_modal: false,
      page: 1,
      total: 21,
      pageSize: 10,
      haveSelect: [],
      userInfo: {},
      info: {},
      modal1: false,
      tableData: [],
      ruleInline: {
        role_desc: [
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
            message: "请输入角色姓名",
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
          title: "角色名称",
          key: "name",
          align: "center"
        },
        {
          title: "角色描述",
          key: "role_desc",
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
                "查看权限模块"
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
                "编辑角色"
              )
            ]);
          }
        }
      ]
    };
  },
  created() {
    this.$nextTick(() => {
      this.userInfo = this.$store.state.user;
      this.getRoles();
    });
  },
  methods: {
    getRoles() {
      let token = this.userInfo.token;
      getRoles({ token }).then(res => {
        if (res.data.message == "ok") {
          this.tableData = res.data.roleList;
          this.tableData.forEach(item => {
            item.time = getMyDate(item.time, "yyyy-MM-dd")
          });
        } else {
          this.$Notice.error({
            title: "操作失败，请稍后再试!"
          });
        }
      });
    },
    addNewRole() {
      const form = this.form;
      form.time = new Date().getTime()
      this.$refs["content"].validate(validate => {
        if (validate) {
          addNewRole(form).then(res => {
            if (res.data.message == "ok") {
              this.new_modal = false;
              this.$Notice.success({
                title: "添加成功!"
              });
               this.getRoles();
            } else {
              this.$Notice.error({
                title: "操作失败，请稍后再试!"
              });
            }
          });
        }
      });
    },
    updateRole() {
      this.$refs["content"].validate(validate => {
        if (validate) {
            let form =  this.form
             form.time = new Date().getTime()
          updateRole(form).then(res => {
            if (res.data.message == "ok") {
              this.$Notice.success({
                title: "更新成功"
              });
              this.update_modal = false;
              this.getRoles();
            }
          });
        }
      });
    },
    deleteRole(id) {
      deleteRole(id).then(res => {
        if (res.data.message == "ok") {
          this.$Notice.success({
            title: "删除成功!"
          });
          this.update_modal = false;
          this.getRoles();
        }
      });
    },
    seeDetail(id) {
      this.$router.push({
          path:"/admin/modules-manager",
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
  position: relative;
  margin:15px 0 0 15px;
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