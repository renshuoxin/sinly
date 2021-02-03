export default {
  create() {
    if(this.mode != 'edit') {
      this.getPrize(); //获取抽奖的奖品
      this.getRemainTimes();  //获取用户剩余抽奖次数
    }
  },
  methods: {
    getPrize() {

    },
    getRemainTimes() {

    },
    // 保存用户抽到的奖品
    savePrize() {

    },
    run() {

    }
  },
}