<template>
  <div class="message">
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
          <span class="user-name">发布人：{{item['username']}}</span>
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

  </div>
</template>

<script>
export default {
  data() {
    return {
      messageList: [
        {
          avatar: "http://iph.href.lu/200x200",
          username: "罗技好",
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
        },
        {
          avatar: "http://iph.href.lu/200x200",
          username: "扬子江",
          classify: "作业",
          time: "2018-9-21",
          title: "JavaScript 的this 指向问题",
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
        },
        {
          avatar: "http://iph.href.lu/200x200",
          username: "林之感",
          classify: "毕设",
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
    }
  }
};
</script>

<style scoped lang='less'>
.message {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card_container {
  width: 100%;
  margin-bottom: 20px;
}

.notice_time {
  font-size: 10px;
  color: gray;
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