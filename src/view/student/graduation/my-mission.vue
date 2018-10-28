

<template>
  <div class="goods">
    <Table border :columns="columns" :data="tableData" size="large" no-data-text="暂时没有个人毕业设计相关信息"></Table>
  </div>
</template>
<script>
  import Cookies from "js-cookie";
  import { getTeamList, updateWork } from '@/api/user'
  export default {
    name: "my-mission",
    data() {
      return {
        tableData: [],
        multiple: false,
        limit: 1,
        columns: [
          {
            title: '姓名',
            key: 'username',
            width: 200,
            align: 'center'
          },
          {
            title: '班级',
            key: 'class',
            width: 172,
            align: 'center'
          },
          {
            title: '专业',
            key: 'major',
            width: 260,
            align: 'center'
          },
          {
            title: '学号',
            key: 'stu_number',
            width: 195,
            align: 'center'
          },
          {
            title: '毕设导师',
            key: 'guide_teacher',
            width: 200,
            align: 'center'
          },
          {
            title: '负责内容',
            width: 220,
            key: 'work_type',
            align: 'center'
          },
          {
            title: "论文",
            key: "action",
            width: 290,
            align: "center",
            render: (h, params) => {
              return h(this.tableData[params.index].paper == ''&&this.tableData[params.index].u_id== this.userInfo.id ? "Upload" : 'div', { props: { action: "http://www.kaolaplay.com:7002/upload/work",maxSize:10240,beforeUpload:this.beforeFileUpload,onSuccess:this.handlePaperSuccess } }, [
                h(
                  this.tableData[params.index].paper == '' ? "Button" : 'a',
                  {
                    props: {
                      type: this.tableData[params.index].u_id== this.userInfo.id?"primary":"default",

                    },
                    domProps: {
                      href: "scope.row.work",
                      download: "w3logo"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        
                      }
                    }
                  },
                  this.tableData[params.index].paper == '' ? '等待上传' : '下载'
                )
              ]);
            }
          }, {
            title: "毕业设计",
            key: "action",
            width: 290,
            align: "center",
            render: (h, params) => {
              return h(this.tableData[params.index].work == ''&&this.tableData[params.index].u_id== this.userInfo.id ? "Upload" : 'div', { props: { action: "http://www.kaolaplay.com:7002/upload/work",maxSize:10240,beforeUpload:this.beforeFileUpload	,onSuccess:this.handleWorkSuccess  } }, [
                h(
                  this.tableData[params.index].work == '' ? "Button" : 'a',
                  {
                    props: {
                      type: this.tableData[params.index].u_id== this.userInfo.id?"primary":"default",
                    },
                    domProps: {
                      href: this.tableData[params.index].work,
                      download: "w3logo"
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                     
                      }
                    }
                  },
                  this.tableData[params.index].work == '' ? '等待上传' : '下载'
                )
              ]);
            }
          }
        ]
      };
    },
    created() {
      this.$nextTick(() => {
       this.userInfo =this.$store.state.user
        this.getTeam(this.userInfo.team_id)
      })
    },
    methods: {
      getTeam(id) {
        getTeamList(id).then((res) => {
          this.tableData = res.team
          console.log(res.team)
        })
      },
      showExceed() {
        this.$Notify({
          title: '提示',
          message: '毕业设计和论文每人只能上传一份，如要重新上传，请先删除已上传作品!',
          duration: 10000
        });
      },
      beforeFileUpload(file) {

        const isZip = file.name.substring(file.name.lastIndexOf(".") + 1) == "zip"
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isZip) {
          this.$Message.error("上传文件只能是zip格式!");
        }
        if (!isLt10M) {
          this.$Message.error("上传文件大小不能超过 10MB!");
        }
        return isZip && isLt10M;
      },
      handleWorkSuccess(res, file) {
        var url = "https://" + res.data.url
        var sid = this.userInfo.id
        var name = this.userInfo.name
        var team_id = this.userInfo.team_id
        var that = this
        updateWork(sid, url, "work", team_id, "更新毕业设计", name).then(() => {
          that.$Message.success("上传毕业设计成功");
          that.getTeam(that.userInfo.team_id)
        })
      },
      handlePaperSuccess(res, file) {
        var url = "https://" + res.data.url
        var sid = this.userInfo.id
        var name = this.userInfo.name
        var team_id = this.userInfo.team_id
        var that = this
        updateWork(sid, url, "paper", team_id, "更新毕业论文", name).then(() => {
          that.$Message.success("上传毕业论文成功");
          that.getTeam(that.userInfo.team_id)
        })

      },

    }
  };

</script>
