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
          <div class="notice_time">发布时间：{{item['time']}}</div>
        </div>

      </div>
      <p class="title">{{item['title']}}</p>
      <p class="content">
        {{item['content']}}
        <span
          class="answer"
          @click="toggleAnswerBar(index)"
        >- 回复</span>
      </p>

      <div
        class="anwser-bar"
        v-show="item['isAnswer']"
      >
        <i-input
          type="textarea"
          :rows="2"
          placeholder="请输入..."
        >
        </i-input>

        <i-button
          type="primary"
          class="answer-button"
          slot="append"
        >回复</i-button>

      </div>

    </Card>

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
          time: "2018-9-21",
          title: "JavaScript 的 this 指向问题",
          content: "我想问问老师关于 JavaScript 的 this 指向问题",
          isAnswer: false
        },
        {
          avatar: "http://iph.href.lu/200x200",
          username: "扬子江",
          time: "2018-9-21",
          title: "JavaScript 的this 指向问题",
          content: "我想问问老师关于 JavaScript 的 this 指向问题",
          isAnswer: false
        },
        {
          avatar: "http://iph.href.lu/200x200",
          username: "林之感",
          time: "2018-9-21",
          title: "JavaScript 的 this 指向问题",
          content: "我想问问老师关于 JavaScript 的 this 指向问题",
          isAnswer: false
        }
      ]
    };
  },
  methods: {
    toggleAnswerBar(index) {
      let messageList = [...this.messageList];
      messageList[index]["isAnswer"] = !messageList[index]["isAnswer"];
      this.messageList = messageList;
    }
  }
};
</script>

<style scoped lang='less'>
.card_container {
  margin-bottom: 20px;
}

.notice_time {
  margin-top: 8%;
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
  margin-left: 2%;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.content:hover {
  cursor: pointer;
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
}

.title {
  position: relative;
  margin-bottom: 6px;
  color: gray;
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