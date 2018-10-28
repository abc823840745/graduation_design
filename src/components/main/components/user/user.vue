<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <span class="user_name">{{user.username}}</span>
      <Avatar :src="user.avatar" />
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import './user.less'
  import { mapActions } from 'vuex'
  export default {
    name: 'User',
    props: {
      user: {
        type: Object,
        default: ''
      }
    },
    methods: {
    ...mapActions([
      'handleLogOut'
    ]),
      handleClick(name) {
        switch (name) {
          case 'logout':
            this.handleLogOut().then(() => {
              this.$router.push({
                name: 'login'
              })
            })
            break
        }
      }
    }
  }

</script>