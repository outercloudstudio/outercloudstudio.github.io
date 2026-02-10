// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import type { Theme } from 'vitepress'

import './style.css'
import './fonts/style.css'

import 'vitepress/dist/client/theme-default/styles/vars.css'
import 'vitepress/dist/client/theme-default/styles/components/vp-code.css'

export default {
  Layout,
  
  enhanceApp({ app, router, siteData }) {}
} satisfies Theme

