const Views = [{
  name: 'home',
  path: '/home',
  component: done => require(['../../views/home.vue'], done)
}, {
  name: 'you',
  path: '/you',
  component: done => require(['../../views/you.vue'], done)
}, {
  name: 'me',
  path: '/me',
  component: done => require(['../../views/me.vue'], done)
}, {
  name: 'vueHtml5Editor',
  path: '/editor1',
  component: done => require(['../../views/vueHtml5Editor.vue'], done)
}, {
  name: 'wangEditor',
  path: '/wangEditor',
  component: done => require(['../../views/wangEditor.vue'], done)
}, {
  path: '/*',
  redirect: '/home'
}]

export default Views