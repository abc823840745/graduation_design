<template>
  <div class="containter">
    <Modal
      v-model="isShowModal"
      title="返回"
      @on-ok="goBack"
    >
      <p>返回上一步填写数据将丢失</p>
    </Modal>

    <course-select
      v-if="!showCreSub"
      @goCreSub='goCreSub'
    />
    <my-homework
      v-else
      @showModal='showModal'
    />
  </div>
</template>

<script>
import courseSelect from "@teaHomework/smart/course-select";
import myHomework from "@teaHomework/smart/my-homework";

export default {
  data() {
    return {
      isShowModal: false,
      showCreSub: false
    };
  },
  components: {
    courseSelect,
    myHomework
  },
  methods: {
    goCreSub() {
      this.showCreSub = true;
    },
    goBack() {
      this.showCreSub = false;
    },
    showModal() {
      this.isShowModal = true;
    }
  }
};
</script>

<style>
.containter {
  width: 100%;
  height: auto;
}
</style>
