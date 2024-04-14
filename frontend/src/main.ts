import { createApp } from 'vue'
import { createPinia } from 'pinia'


import './style.css'
import 'primevue/resources/themes/aura-light-pink/theme.css'
import 'primeicons/primeicons.css'
import "vue-connect-wallet/dist/style.css";



import PrimeVue from 'primevue/config';
import App from './App.vue'




import Button from "primevue/button"
import Menubar from 'primevue/menubar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Chart from 'primevue/chart';




import { createMemoryHistory, createRouter } from 'vue-router'
import ListSensors from './pages/ListSensors.vue';
import CreateDevice from './pages/CreateDevice.vue';
import Getdata from './pages/Getdata.vue';
import Home from './pages/Home.vue';


const routes = [
    { path: '/', component: Home },
    { path: '/Getdata', component: Getdata },
    { path: '/Createdevice', component: CreateDevice },
    { path: '/ListSensors', component: ListSensors }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

const pinia = createPinia()

createApp(App)
    .use(PrimeVue)
    .use(router)
    .use(pinia)
    .component('Button', Button)
    .component('Chart', Chart)
    .component('Menubar', Menubar)
    .component('DataTable', DataTable)
    .component('Column', Column)
    .component('Dialog', Dialog)
    .mount('#app');
