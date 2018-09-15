import Vue from 'vue'
import 'quill/dist/quill.snow.css'

if (process.browser) {
  const VueQuillEditor = require('vue-quill-editor/dist/ssr')
  Vue.use(VueQuillEditor)
}
