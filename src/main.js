import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from "@fortawesome/free-solid-svg-icons";
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})


library.add(fas)
const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(vuetify)
app.mount('#app')
