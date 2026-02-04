import { createContentLoader } from 'vitepress'
export default createContentLoader(
    'blogs/*/index.md', 
    {
        excerpt: true,
        transform(rawData) {
            return rawData.sort((a, b) => {
            return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
        }).map((page) => {
            return {
                title: page.frontmatter.title,
                excerpt: page.excerpt,
                date: new Date(page.frontmatter.date),
                url: page.url
            }
        })
    }
})