<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="8">
        <span class="expand-key">A、 </span>
        <span class="expand-value">{{ row.optionA }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">B、 </span>
        <span class="expand-value">{{ row.optionB }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">C、 </span>
        <span class="expand-value">{{ row.optionC }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <span class="expand-key">D、 </span>
        <span class="expand-value">{{ row.optionC }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">参考答案: </span>
        <span class="expand-value">{{ row.referenceAnswer }}</span>
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