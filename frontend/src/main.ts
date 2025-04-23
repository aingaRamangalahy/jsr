import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useResourceStore } from './stores/resource';

import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  unstyled: true,
});

// Initialize important stores
const resourceStore = useResourceStore();
resourceStore.init();

app.mount('#app');
