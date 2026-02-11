import { defineConfig, HeadConfig } from 'vitepress'

export default defineConfig({
  title: "outercloud.dev",
  description: 'Hi! I\'m Liam Hanrahan. I like to program.',
  srcDir: './src',
  outDir: './dist',
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { 
      href: 'https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Fira+Code:wght@300..700&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap',
      rel: 'stylesheet'
    }],
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],
  cleanUrls: true,
  markdown: {
    config(md) {
        md.disable('emoji')
    },
    theme: {
      light: 'material-theme-darker',
      dark: 'material-theme-darker',
    }
  },
  transformHead: ({ pageData }) => {
    const head: HeadConfig[] = []

    head.push(['meta', { property: 'og:title', content: pageData.frontmatter.title }])
    head.push(['meta', { property: 'og:description', content: pageData.frontmatter.description }])

    return head
  }
})
