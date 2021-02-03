<template lang="pug">
  .me-container
    span I am an angel
    div.btn-wrap
      button(type="button", @click="toggleList(1)") 1
      button(type="button", @click="toggleList(2)") 2
      button(type="button", @click="toggleList(3)") 3
      button(type="button", @click="toggleList(4)") 4
      button(type="button", @click="deleteItem") deleteItem
      button(type="button", @click="addObjItem") 增加对象属性
      button(type="button", @click="triggerJsonp") jsonp
    .key-wrap
      select
        option(v-for="(item, index) in list", :value="item.key") {{ item.name }}
      </select>
    .add-item
      p 原属性:{{ obj.a }}
      p 新加属性：{{ obj.b }}
      //- div(v-for="(item, index) in list", :key="index") 
      //-   | {{ item.name }}
      //-   | {{ item.key }}
      //- div -----------------------
      //- p(v-for="(item, index) in originalList", :key="index") 
      //-   | {{ item.name }}
      //-   | {{ item.key }}
</template>

<script>
let getKeyList = function() {
  return [{
    name: '账号名称',
    key: 'mediaName',
    type: 'a',
    link: 'accountLink'
  }, {
    name: '当前等级',
    key: 'afterRank',
  }, {
    name: '评估时间',
    key: 'approveTime'
  }, {
    name: '评估前等级',
    key: 'beforeRank',
  }, {
    name: '真实粉丝量',
    key: 'realFanNo',
  }, {
    name: '是否原创',
    key: 'mediaOrigin'
  }, {
    name: '发文数(近30天)',
    key: 'postNo',
  }, {
    name: '垂直度',
    key: 'postVertical',
  }, {
    name: '平均点击率',
    key: 'clickRate',
  }, {
    name: '阅读量',
    key: 'readNo',
  }, {
    name: '互动量',
    key: 'interactNo'
  }]
}
let appendList = {
  1: [{
    name: '低质率',
    key: 'postLowRate'
  }, {
    name: '优质率',
    key: 'postExcellentRate'
  }, {
    name: '内容质量评估人',
    key: 'postEditedName'
  }, {
    name: '评级人',
    key: 'approvedName'
  }],
  2: [{
    name: '晋升条件',
    key: 'remark',
    type: 'button',
    btnType: 'text',
    className: 'monitor-btn'
  }, {
    name: '评级人',
    key: 'approvedName'
  }],
  3: [{
    name: '降级条件',
    key: 'remark',
    type: 'button',
    btnType: 'text',
    className: 'monitor-btn' 
  }, {
    name: '评级人',
    key: 'approvedName'
  }],
  4: [{
    name: '存疑项',
    key: 'remark',
    type: 'button',
    btnType: 'text',
    className: 'monitor-btn'
  }, {
    name: '评级人',
    key: 'approvedName'
  }]
}
export default {
  data() {
    return {
      list: [],
      originalList: [],
      obj: {
        a: 1
      }
    }
  },
  mounted() {
    this.list = getKeyList().concat(appendList[1])
  },
  methods: {
    toggleList(key) {
      this.list = getKeyList().concat(appendList[key]);                                                                               
    },
    deleteItem() {
      this.originalList = JSON.parse(JSON.stringify(this.list));
      this.list = this.list.slice(0,1).concat(this.list.slice(2));
    },
    addObjItem() {
      this.obj = Object.assign({}, this.obj, {a: 4, b: 2});
    },
    triggerJsonp() {
      window.triggerJsonp = function(data) {
        console.log(data);
      }
      let script = document.createElement('script');
      script.type = "text/javascript";
      script.src = "http://local.yidianzixun.com:3007/api/getJsonp?callback=triggerJsonp";
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  }
}
</script>