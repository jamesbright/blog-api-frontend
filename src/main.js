import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import Axios from 'axios'
import { BootstrapVue, IconsPlugin, DropdownPlugin, FormSelectPlugin } from 'bootstrap-vue'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'mdbvue/lib/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'animate.css'
import VueButtonSpinner from "vue-button-spinner";
import CKEditor from '@ckeditor/ckeditor5-vue2';

Vue.use(CKEditor);

Vue.component('button-spinner', VueButtonSpinner);
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(DropdownPlugin)
Vue.use(FormSelectPlugin)
const base = Axios.create({
  baseURL: "https://blog-api764.herokuapp.com/api/" // replace on production env
  //baseURL: "http://localhost:5000/api/" // replace on production env
});
Vue.prototype.$http = base;

Vue.use(VueToast, {
  // One of the options
  position: 'bottom-right'
})

//Vue.prototype.$toast = VueToast;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
