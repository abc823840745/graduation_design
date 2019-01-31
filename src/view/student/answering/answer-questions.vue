<template>
  <div class="message">
    <Modal
      v-model="isShowModal"
      width="580"
    >
      <p
        slot="header"
        style="text-align:center"
      >
        <Icon type="ios-information-circle"></Icon>
        <span>你确认要新建吗？</span>
      </p>

      <div class="input-item">
        <span>标题</span>
        <Input
          v-model="form['title']"
          placeholder="请输入标题"
        />
      </div>

      <div class="input-item">
        <span>选择老师</span>
        <Select
          :model.sync="form['teacherName']"
          style="width:200px"
        >
          <Option
            v-for="item in teacherList"
            :key="item['value']"
            :value="item['value']"
          >{{ item.label }}</Option>
        </Select>
      </div>

      <div class="input-item">
        <span>问题类型</span>
        <Select
          :model.sync="form['classify']"
          style="width:200px"
        >
          <Option
            v-for="item in classifyList"
            :key="item['value']"
            :value="item['value']"
          >{{ item.label }}</Option>
        </Select>
      </div>

      <div class="input-item">
        <span>问题</span>
        <Input
          v-model="form['question']"
          type="textarea"
          :autosize="{minRows: 2,maxRows: 5}"
          placeholder="请输入问题详情"
        />
      </div>
    </Modal>

    <div
      v-if="messageList.length!==0"
      class="message"
    >
      <Card
        class="card_container"
        v-for="(item,index) in messageList"
        :key="index"
        :bordered="false"
      >
        <div
          slot="title"
          class="user-info"
        >
          <img
            class="avatar"
            :src="item['avatar']"
          />
          <div class="right-con">
            <span class="user-name">解答人：{{item['username']}}</span>
            <div class="user-name">类型：{{item['classify']}}</div>
            <div class="notice_time">发布时间：{{item['time']}}</div>
          </div>
        </div>

        <p class="title">{{item['title']}}</p>

        <div
          v-for="(content,contentIndex) in item['content']"
          :key="content['msg']"
          class="content"
        >
          <p>
            {{content['msg']}}
            <span
              v-if="contentIndex === item['content']['length'] - 1"
              class="answer"
              @click="toggleAnswerBar(index,contentIndex)"
            >
              {{!content['isAnswer'] ? '- 回复':'- 收起'}}
            </span>
          </p>

          <div
            class="anwser-bar"
            v-show="content['isAnswer']"
          >
            <i-input
              type="textarea"
              :rows="2"
              placeholder="请输入..."
            />

            <i-button
              type="primary"
              class="answer-button"
            >回复</i-button>
          </div>
        </div>

      </Card>

      <Page
        :total="30"
        class="mar-top"
      />

      <Button
        class="question-button"
        icon="ios-download-outline"
        type="primary"
        @click="showModal"
      >
        发起疑问
      </Button>
    </div>

    <div
      class="none-data"
      v-if="messageList.length===0"
    >
      <Alert show-icon>你还没有发起过问题，赶紧来发起疑问让老师来解答吧</Alert>

      <Button
        class="question-button"
        icon="ios-download-outline"
        type="primary"
        @click="showModal"
      >
        发起疑问
      </Button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowModal: false,
      form: {
        title: "",
        teacherName: "",
        classify: "",
        question: ""
      },
      classifyList: [
        {
          value: "course",
          label: "课程"
        },
        {
          value: "homework",
          label: "作业"
        },
        {
          value: "graduationProject",
          label: "毕设"
        }
      ],
      teacherList: [
        {
          value: "孟辉",
          label: "孟辉"
        },
        {
          value: "程亮",
          label: "程亮"
        },
        {
          value: "杨艳",
          label: "杨艳"
        }
      ],
      messageList: [
        {
          avatar: "http://iph.href.lu/200x200",
          username: "孟辉",
          classify: "课程",
          time: "2018-9-21",
          title: "JavaScript 的 this 指向问题",
          content: [
            {
              msg: "我想问问老师关于 JavaScript 的 this 指向问题",
              isAnswer: false
            },
            {
              msg: "我说过很多次了，你自己看书",
              isAnswer: false
            }
          ]
        }
      ]
    };
  },
  methods: {
    toggleAnswerBar(index, contentIndex) {
      let messageList = [...this.messageList];
      messageList[index]["content"][contentIndex]["isAnswer"] = !messageList[
        index
      ]["content"][contentIndex]["isAnswer"];
      this.messageList = messageList;
    },
    showModal() {
      this.isShowModal = true;
    }
  }
};
</script>

<style scoped lang='less'>
.message {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.none-data {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card_container {
  width: 100%;
  margin-bottom: 20px;
}

.notice_time {
  font-size: 10px;
  color: gray;
}

.input-item {
  display: flex;
  align-items: center;
  margin-top: 5%;
  span {
    width: 5%;
    margin-left: 2%;
    margin-right: 1.5%;
  }
}

.input-item:nth-of-type(1) {
  margin-top: 0;
}

.input-item:nth-of-type(4) {
  align-items: flex-start;
  span {
    margin-top: 5px;
  }
}

.info_container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-info {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
}

.right-con {
  height: 60px;
  margin-left: 2%;
  display: flex;
  flex-direction: column;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.question-button {
  margin-top: 1.5%;
}

.content {
  cursor: pointer;
  margin-bottom: 0.5%;
}

.answer {
  font-size: 13px;
  margin-left: 1%;
}

.answer:hover {
  color: #2d8cf0;
}

.page_container {
  position: absolute;
  right: 20px;
  margin-top: 30px;
}

.user-name {
  height: 40px;
  margin-right: 6%;
}

.title {
  position: relative;
  margin-bottom: 6px;
  font-size: 18px;
  font-weight: bold;
}

.anwser-bar {
  margin-top: 1%;
  display: flex;
}

.answer-button {
  width: 80px;
  height: 52px;
}
</style>