<template>
    <div @click="showMessage" class="message-con">
        <Tooltip :content="value? '有新回复': '无新回复'" placement="bottom">
            <Badge :dot="value">
                <Icon type="ios-text" :size="22" />
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
                type: Boolean,
                default: false
            }
        },
        methods: {
            showMessage() {
                if(this.$store.state.user.role == 'student'){
                    this.$router.push("/student/answering/reply");
                }else{
                    this.$router.push("/teacher/answering/reply");
                }
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
    
    .message-con .ivu-tooltip-inner {
        position: relative;
        top: -25px;
    }
</style>