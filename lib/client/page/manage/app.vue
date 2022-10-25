<template lang="pug">
  .main
    .header
      .left-logo
        span.logo
        span.logo-text sinly
      .right
        //- .date {{ date }}
        ul.nav
          li.nav-item  
            router-link.nav-item-link(to="/home") home
          li.nav-item  
            router-link.nav-item-link(to="/you") you
          li.nav-item
            router-link.nav-item-link(to="/me") me
          li.nav-item
            router-link.nav-item-link(to="/quillEditor") editor
    .content
      router-view
</template>

<script>
import '../../css/base.less'
import { formatDate } from '../../utils'

export default {
  data() {
    return {
      date: ''
    }
  },
  mounted() {
    setInterval(() => {
      this.date = formatDate(new Date());
    }, 1000)
  }
}
</script>

<style lang="less">
.main {
  padding: 0px 10px;
  height: 100%;
  .header {
    height: 60px;
    border-bottom: 1px solid #dcdfe6;
    padding: 15px 0px;
    .left-logo {
      display: inline-block;
      .logo {
        display: inline-block;
        width: 60px;
        height: 60px;
        background: url('/images/apple.png') center no-repeat;
        background-size: contain;
        vertical-align: middle;
      }
      .logo-text {
        font-size: 24px;
        font-weight: 700;
        margin-left: 10px;
      }
    }
    .right {
      font-size: 20px;
      float: right;
      line-height: 30px;
      margin-top: 15px;
      .date {
        color: #999;
      }
      .nav {
        .nav-item {
          color: #409EFF;
          float: left;
          margin-right: 50px;
          &:last-child {
            margin-right: 0px;
          }
          &:hover {
            .nav-item-link {
              opacity: 1;
            }
          }
          .nav-item-link {
            opacity: .5;
            &.router-link-active {
              opacity: 1;
            }
          }
        }
      }
    }
  }
  .content {
    padding: 20px 0px;
    height: 100%;
  }
}
</style>


