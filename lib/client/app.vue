<template>
  <div class="main">
    <div class="header">
      <span class="logo"></span>
      <!-- <img src="./images/apple.png"/> -->
    </div>
    <div>{{message}}</div>
    <div>123</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'hello world'
    }
  }
}
</script>

<style lang="less">
.main {
  .header {
    height: 60px;
    .logo {
      display: inline-block;
      width: 60px;
      height: 60px;
      background: url('./images/apple.png') center no-repeat;
      background-size: contain;
    }
  }
}
</style>


