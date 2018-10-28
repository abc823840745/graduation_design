<style lang="less">
    @import '../styles/unlock.less';
</style>

<template>
    <transition name="show-unlock">
        <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleUnlock">
            <div @click="handleClickAvator" class="unlock-avator-con" :style="{marginLeft: avatorLeft}">
                <img class="unlock-avator-img" :src="avatorImgPath">
                <div class="unlock-avator-cover">
                    <span><Icon type="unlocked" :size="30"></Icon></span>
                    <p>解锁</p>
                </div>
            </div>
            <div class="unlock-avator-under-back" :style="{marginLeft: avatorLeft}"></div>
            <div class="unlock-input-con">
                <div class="unlock-input-overflow-con">
                    <div class="unlock-overflow-body" :style="{right: inputLeft}">
                        <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="密码同登录密码" />
                        <div ref="unlockBtn"  @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock" class="unlock-btn">
                        </div> 
                    </div>
                </div>
            </div>
            <div class="unlock-locking-tip-con">已锁定</div>
        </div>
    </transition>
</template>
<script>
    import { unlock } from '@/api/user'
    import Cookies from 'js-cookie';
    export default {
        name: 'Unlock',
        data() {
            return {
                avatorImgPath: '',
                avatorLeft: '0px',
                inputLeft: '400px',
                password: '',
                check: null
            };
        },
        props: {
            showUnlock: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            avatorPath() {
                return localStorage.avatorImgPath;
            }
        },
        mounted() {
            this.avatorImgPath = this.$store.state.user.avatorImgPath

        },
        methods: {
            validator() {
                let {token, stu_nmuber} = this.$store.state.user
                return new Promise((resolve) => {
                    unlock({ token, username: stu_nmuber, password: this.password }).then((res) => {
                        if (res.data.message == 'ok') {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    })
                })
            },
            handleClickAvator() {
                this.avatorLeft = '-180px';
                this.inputLeft = '0px';
                this.$refs.inputEle.focus();
            },
            handleUnlock() {
                this.validator().then((res) => {
                    console.log(8858888)
                    if (res) {
                        this.avatorLeft = '0px';
                        this.inputLeft = '400px';
                        this.password = '';
                        Cookies.set('locking', '0');
                        this.$emit('on-unlock');
                    } else {
                        this.$Message.error('密码错误,请重新输入。如果忘了密码，清除浏览器缓存重新登录即可，这里没有做后端验证');
                    }
                })
            },
            unlockMousedown() {
                this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn';
            },
            unlockMouseup() {
                this.$refs.unlockBtn.className = 'unlock-btn';
            }
        }
    };

</script>
<style>
    .unlock-btn {
        float: left;
        display: block;
        font-size: 20px;
        padding: 7px 30px;
        cursor: pointer;
        border-radius: 0 25px 25px 0;
        border: 2px solid #e2ddde;
        border-left: none;
        background: #2d8cf0;
        outline: none;
        transition: all .2s;
        margin-top: 10px;
        height: 48px;
        &:hover {
            background: #5cadff;
            box-shadow: 0 0 10px 3px rgba(255, 255, 255, .2);
        }
    }
    .unlock-btn::before{
        position: absolute;
        content: "解锁";
        color: white;
        font-size: 18px;
        margin-left: -20px;
        margin-top: 2px;
    }
    .click-unlock-btn {
        background: #2b85e4 !important;
    }
</style>