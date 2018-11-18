<template>
    <div class="editor-wrapper">
        <div v-if="row.status==0 || row.status==-2 ||  row.status==3">
            <div :id="editorId"></div>
            <Button @click="submitWeekReport(1)" class="btn" type="success">提交周报</Button>
            <Button @click="submitWeekReport(0)" class="btn" type="success">保存</Button>
        </div>
    </div>
</template>

<script>
    import Editor from 'wangeditor'
    import 'wangeditor/release/wangEditor.min.css'
    import { oneOf } from '@/libs/tools'
    import { submitWeekReport } from '@/api/teacher'
    export default {
        name: 'Editor',
        data() {
            return {
                content: ''
            }
        },
        props: {
            value: {
                type: String,
                default: ''
            },
            row: {
                type: Object,
                default: {}
            },
            /**
             * 绑定的值的类型, enum: ['html', 'text']
             */
            valueType: {
                type: String,
                default: 'html',
                validator: (val) => {
                    return oneOf(val, ['html', 'text'])
                }
            },
            /**
             * @description 设置change事件触发时间间隔
             */
            changeInterval: {
                type: Number,
                default: 200
            },
            /**
             * @description 是否开启本地存储
             */
            cache: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            editorId() {
                return `editor${this._uid}`
            }
        },
        methods: {
            setHtml(val) {
                console.log(this.editor.txt.html(val), 555)
            },
            filterFun(content) {
                content.replace("<", "&lt;")
                content.replace(">", "&gt;")
                content.replace('"', "&quot;")
                return content
            },
            submitWeekReport(save) {
                let {token} = this.$store.state.user
                let {week, status, more_time,type} = this.row
                let content = this.content
                let time = new Date().getTime()
                if (content.trim() == '') {
                    return
                }

                submitWeekReport(token, time, week, status, content, save, more_time,type).then((res) => {
                    if (res.data.message == 'ok') {
                        this.$Notice.success({
                            title: '周报提交成功！'
                        })
                        this.$router.go(0)
                    }
                })
            }
        },
        mounted() {
            this.editor = new Editor(`#${this.editorId}`)
            this.value = this.row.content ? this.row.content : this.value
            this.content = this.row.content ? this.row.content : this.value
            this.editor.customConfig.onchange = (html) => {
                let text = this.editor.txt.text()
                this.content = html
                if (this.cache) localStorage.editorCache = html

            }
            this.editor.customConfig.onchangeTimeout = this.changeInterval
            // create这个方法一定要在所有配置项之后调用
            this.editor.create()
            // 如果本地有存储加载本地存储内容
            let html = this.value || localStorage.editorCache
            if (html) this.editor.txt.html(html)
        }
    }

</script>

<style>
    .btn {
        position: relative;
        margin: 10px;
    }
</style>