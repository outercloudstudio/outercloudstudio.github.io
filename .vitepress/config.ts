import { createContentLoader, defineConfig, SiteConfig } from 'vitepress'
import { Feed } from 'feed'
import { writeFileSync } from "node:fs";
import path from "node:path/posix";

const hostname = 'https://outercloud.dev'

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
    vite: {
        plugins: [
            {
                name: 'image-optimizer',
                enforce: 'post',
                async generateBundle(_, bundle) {
                    const images = Object.keys(bundle).filter(k => /\.(png|jpe?g|webp|gif)$/i.test(k))

                    if (images.length === 0) return

                    const sharp = (await import('sharp')).default

                    console.log(`\nOptimizing ${images.length} images...`)

                    for (const key of images) {
                        const asset = bundle[key]

                        if (asset.type !== 'asset' || !(asset.source instanceof Uint8Array)) continue

                        const ext = key.split('.').pop().toLowerCase()

                        let optimized = null

                        if (ext === 'png') {
                            optimized = await sharp(asset.source).png({ quality: 50, compressionLevel: 9 }).toBuffer()
                        } else if (ext === 'jpg' || ext === 'jpeg') {
                            optimized = await sharp(asset.source).jpeg({ quality: 50, mozjpeg: true }).toBuffer()
                        } else if (ext === 'webp') {
                            optimized = await sharp(asset.source).webp({ quality: 50 }).toBuffer()
                        }

                        if (optimized) {
                            const before = asset.source.length
                            const after = optimized.length
                            
                            console.log(`  ${key}: ${(before / 1024).toFixed(1)}kb → ${(after / 1024).toFixed(1)}kb`)
                            
                            asset.source = optimized
                        }
                    }
                }
            },
        ],
    },
    buildEnd: async (config: SiteConfig) => {
        const feed = new Feed({
            title: 'Liam Hanrahan',
            description: 'Welcome to my feed from the internet \\(^o^)/',
            id: hostname,
            link: hostname,
            language: 'en',
            image: 'https://www.outercloud.dev/favicon.png',
            favicon: `${hostname}/favicon.png`,
        })

        const posts = await createContentLoader('blogs/*/index.md', {
            transform(rawData) {
                return rawData
                    .sort((a, b) => {
                        return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
                    })
                    .filter(page => !page.frontmatter.hidden)
                    .map(page => {
                        return {
                            title: page.frontmatter.title,
                            description: page.frontmatter.longDescription ?? page.frontmatter.description,
                            date: page.frontmatter.date,
                            url: page.url,
                        }
                    })
            },
        }).load()

        for (const { url, description, title, date } of posts) {
            feed.addItem({
                title: title,
                id: `${hostname}${url}`,
                link: `${hostname}${url}`,
                description: description,
                date: new Date(date)
            })
        }

        writeFileSync(path.join(config.outDir, 'rss.xml'), feed.rss2())
    }
})
