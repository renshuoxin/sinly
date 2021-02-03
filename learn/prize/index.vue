<template>
  <div>
    <div class="title" data-site="title">{{ options.title }}</div>
    <div class="desc" data-site="desc">{{ options.desc }}</div>
    <div :is="options.component" data-site="component"></div>
  </div>
</template>
<script>
import circle from './circle.vue'
import card from './card.vue'
import other from './other.vue'

export default {
  data() {
    return {
      component: ''
    }
  },
  props: {
    type: String,
    options: Object,   //传递了抽奖组件的一些初始化参数，如皮肤、奖品个数、等
    mode: 'h5'   //组件的模式：h5 | 后台配置的可编辑模式
  },
  watch: {
    options(val) {
      // 根据val.component 动态加载对应的抽奖组件
    }
  },
  mounted() {
    if(this.mode === 'edit') {
      this.initEvent();
    }
  },
  methods: {
    initEvent() {
      this.$el.addEventListener('click', (e) => {
        let target = e.target;
        // site和表单中配置项相对应
        let site = target.getAttribute('data-site');
      })
    }
  },
  components: {
    circle, card, other
  }
}
</script>



/*工程化
1、如何实现按需加载 webpack 钩子函数
2、微前端，实现独立打包独立上线
a/b   组件，项目
c/d   项目

h5
// lerna 项目 vuecli4 webpack
*/

node 
jade ssr
script src="manage"
json {manage, manage.md5.js}

html-plugin

// 提高后台配置开发效率
1、表单 基础表单组件、表单验证、表单
2、h5页面本身的复用

技术选型： vue/react 
方案：
1、实现表单基础组件 功能和样式
2、可以引入微前端 配置不同的活动时，加载对应的项目组件
3、


