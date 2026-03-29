import Layout from './Layout.vue'
import type { Theme } from 'vitepress'

import './style.css'
import './fonts/style.css'

import 'vitepress/dist/client/theme-default/styles/vars.css'
import 'vitepress/dist/client/theme-default/styles/components/vp-code.css'

import InlineImage from './components/InlineImage.vue'
import Emoticon from './components/Emoticon.vue'
import Quote from './components/Quote.vue'

export default {
	Layout,

	enhanceApp({ app, router, siteData }) {
		app.component('InlineImage', InlineImage)
		app.component('Emoticon', Emoticon)
		app.component('Quote', Quote)
	},
} satisfies Theme
