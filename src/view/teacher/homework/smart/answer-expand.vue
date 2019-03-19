<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">题目：</span>
        <span class="expand-value">{{ row.context }}</span>
      </Col>
    </Row>

    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">参考答案: </span>
        <span class="expand-value">{{ row.answer }}</span>
      </Col>
    </Row>

    <Row>
      <Col span="24">
        <span class="expand-key">分值: </span>
        <span class="expand-value">{{ row.grade }}</span>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    row: Object
  }
};
</script>