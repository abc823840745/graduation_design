const myMixin = {
  methods: {
    btnStyle(btnTitle, h, onclick) {
      return h(
        'Button',
        {
          props: {
            type: 'primary',
            size: 'default',
          },
          style: {
            marginRight: '5px',
          },
          on: {
            click: onclick,
          },
        },
        btnTitle
      );
    },

    showTable(name, num) {
      let val = null;
      for (let i = 1; i <= num; i++) {
        if (this.curDirectory === i) {
          val = this[`${name}${i}`];
          break;
        }
      }
      return val;
    },
  },
};

export default myMixin;
