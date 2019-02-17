<template>
  <div class="containters">

    <h2>修改任务信息</h2>

    <Divider />

    <RadioItem
      :inputInfo='inputInfo[0]'
      @onChangeSubject="onChangeSubject"
      @onChangeRadio="onChangeRadio"
    />

    <RadioItem
      :inputInfo='inputInfo[1]'
      @onChangeSubject="onChangeSubject2"
      @onChangeRadio="onChangeRadio2"
    />

    <div class="mar-bottom">
      <p class="input-title">{{inputInfo[2]['title']}}</p>
      <Input
        type="textarea"
        :autosize="{minRows: 2,maxRows: 5}"
        v-model="inputInfo[2]['subject']"
        :placeholder="inputInfo[2]['placeholder']"
        clearable
        style="width: 250px"
      />
      <div class="radio-list">
        <p>答案:</p>
        <CheckboxGroup v-model="inputInfo[2]['choice']">
          <Checkbox
            label="A"
            class="checkbox-item"
          >A</Checkbox>
          <Checkbox
            label="B"
            class="checkbox-item"
          >B</Checkbox>
          <Checkbox
            label="C"
            class="checkbox-item"
          >C</Checkbox>
          <Checkbox
            label="D"
            class="checkbox-item"
          >D</Checkbox>
        </CheckboxGroup>
      </div>
    </div>

    <div class="mar-bottom">
      <p class="input-title">{{inputInfo[3]['title']}}</p>
      <Input
        type="textarea"
        :autosize="{minRows: 2,maxRows: 5}"
        v-model="inputInfo[3]['subject']"
        :placeholder="inputInfo[3]['placeholder']"
        clearable
        style="width: 250px"
      />
    </div>

    <div class="btnGround">
      <Button
        type="primary"
        size='large'
        @click="$emit('goBack')"
      >上一步</Button>

      <Button
        type="primary"
        size='large'
        @click="submit"
      >提交</Button>
    </div>

  </div>
</template>

<script>
import RadioItem from "@/view/global/radio-item";

export default {
  name: "create-subject",

  props: {
    homeworkInfo: Object
  },

  components: {
    RadioItem
  },

  data() {
    return {
      inputInfo: [
        {
          subject: "haha",
          title: "1、单选题",
          choice: "A"
        },
        {
          subject: "haha",
          title: "2、单选题",
          choice: "B"
        },
        {
          subject: "haha",
          title: "3、多选题",
          choice: ["A", "B"]
        },
        {
          subject: "haha",
          title: "4、主观题",
          choice: ""
        }
      ]
    };
  },

  methods: {
    submit() {
      if (
        !this.inputInfo[0]["subject"] ||
        !this.inputInfo[0]["choice"] ||
        !this.inputInfo[1]["subject"] ||
        !this.inputInfo[1]["choice"] ||
        !this.inputInfo[2]["subject"] ||
        this.inputInfo[2]["choice"].length === 0
      ) {
        return this.$Message.error("缺少必填信息");
      }
      this.$Message.success("成功");
    },

    onChangeSubject(data) {
      this.inputInfo[0]["subject"] = data.subject;
    },

    onChangeSubject2(data) {
      this.inputInfo[1]["subject"] = data.subject;
    },

    onChangeRadio(data) {
      this.inputInfo[0]["choice"] = data.radioChoice;
    },

    onChangeRadio2(data) {
      this.inputInfo[1]["choice"] = data.radioChoice;
    }
  }
};
</script>

<style lang="less" scoped>
.containters {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  padding: 0 1%;

  p {
    font-size: 15px;
  }

  .mar-bottom {
    margin-bottom: 30px;

    .input-title {
      margin-bottom: 5px;
    }

    .radio-list {
      width: 100%;
      margin-top: 10px;
      display: flex;
      align-items: center;

      .radio-item {
        margin-left: 15px;
      }
    }

    .checkbox-item {
      margin-left: 21px;
    }
  }

  .btnGround {
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
