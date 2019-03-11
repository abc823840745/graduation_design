<template>
  <div class="search-con">
    <Input
      class="mb-30"
      search
      enter-button
      placeholder="请输入搜索内容"
      v-model="searchText"
      @on-search="getSearchResult"
    />

    <Table
      class="mb-10 w100"
      border
      :loading="searchLoading"
      :columns="columns"
      :data="tableData"
    />

    <Page :total="total" class="page" @on-change="changePage" />

    <!-- <Modal fullscreen v-model="showModal">
      <p slot="header" style="text-align:center">
        搜索
      </p>
      <HomeworkDetail />
    </Modal> -->
  </div>
</template>

<script>
import HomeworkDetail from "@stuHomework/smart/check-online-homework-detail";
import { mapState } from "vuex";
import myMixin from "@/view/global/mixin";

export default {
  mixins: [myMixin],

  components: {
    HomeworkDetail
  },

  props: {
    tableData: Array,
    columns: Array,
    searchLoading: Boolean,
    total: Number
  },

  computed: {
    ...mapState({
      userName: state => state.user.userName,
      stuId: state => state.user.stu_nmuber
    })
  },

  data() {
    return {
      searchText: "",
      showModal: false
    };
  },

  methods: {
    // 获取搜索结果
    async getSearchResult() {
      this.$emit("search", this.searchText);
    },

    // 获取分页数据
    async changePage(page) {
      this.$emit("changePage", page);
    }
  }
};
</script>

<style lang='less' scoped>
@import "../public.less";

.search-con {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;

  .page {
    align-self: flex-end;
  }
}
</style>
