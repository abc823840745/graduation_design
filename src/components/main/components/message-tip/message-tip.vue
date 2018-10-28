<template>
    <div @click="showMessage" class="message-con">
        <Tooltip :content="value > 0 ? '有' + value + '条未读消息' : '无未读消息'" placement="bottom">
            <Badge :count="value" dot>
                <Icon type="md-notifications" :size="22" />
            </Badge>
        </Tooltip>

    </div>
</template>

<script>
    import { openNewPage } from '@/libs/util.js';
    export default {
        name: 'message',
        props: {
            value: {
                type: Number,
                default: 0
            }
        },
        methods: {
            showMessage() {
                this.$router.push({
                    name: 'message_index'
                });

            }
        }
    };

</script>
<style>
    .message-con {
        position: relative;
        top: 15px;
        margin-right: 10px;
        cursor: pointer;
    }
    
    .message-con i {
        margin-top: -38px;
        vertical-align: middle;
    }
      .message-con  .ivu-tooltip-inner{
          position: relative;
          top: -25px;
      }
</style>