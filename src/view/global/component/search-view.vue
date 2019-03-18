<template>
  <div class="search-con">
    <div class="search-bar df">
      <Input
        class="mb-30 search-item"
        search
        enter-button
        placeholder="请输入搜索内容"
        v-model="searchText"
        @on-search="getSearchResult"
      />
    </div>

    <Table
      class="mb-10 w100"
      border
      :loading="loading"
      :columns="columns"
      :data="tableData"
    />

    <Page :total="total" class="page" @on-change="changePage" />
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
      loading: false,
      showModal: false
    };
  },

  methods: {
    // 获取搜索结果
    async getSearchResult() {
      this.loading = true;
      this.$emit("search", this.searchText);
      this.loading = false;
    },

    // 获取分页数据
    async changePage(page) {
      this.loading = true;
      this.$emit("changePage", page);
      this.loading = false;
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

  .search-bar {
    width: 100%;

    .search-item {
      width: 30%;
    }
  }

  .page {
    align-self: flex-end;
  }
}
</style>
