/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */




require('./bootstrap');

window.Vue = require('vue');

import moment from 'moment';

import VueProgressBar from 'vue-progressbar';







// vform
import { Form, HasError, AlertError} from 'vform';

window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)


import Gate from "./Gate";
Vue.prototype.$gate = new Gate(window.user);


// Sweet Alert
import Swal from 'sweetalert2';
window.Swal = Swal;

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
})

window.Toast = Toast;


// Vue Router
import VueRouter from 'vue-router';
Vue.use(VueRouter)

const routes = [
    { path: '/dashboard', component: require('./components/Dashboard.vue').default },
    { path: '/profile', component: require('./components/Profile.vue').default },
    { path: '/users', component: require('./components/Users.vue').default },
    { path: '/developer', component: require('./components/Developer.vue').default }

]

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

Vue.filter('upText', function(value){
    return value.charAt(0).toUpperCase() + value.slice(1)
});

Vue.filter('myDate', function (value) {
   return moment(value).format('MMMM Do YYYY')
});



Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '3px'
})


let Fire = new Vue();
window.Fire = Fire;

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

Vue.component('example-component', require('./components/ExampleComponent.vue').default);


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */


Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);

const app = new Vue({
    router
}).$mount('#app')
