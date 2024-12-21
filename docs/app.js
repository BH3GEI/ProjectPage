const { createApp } = Vue

const app = createApp({
    data() {
        return {
            links: [],
            homepage: null,
            rawUrl: 'https://raw.githubusercontent.com/BH3GEI/links/main/links.md',
            hover: null,
            sortMethod: 'name', // 'name' or 'category'
        }
    },
    computed: {
        sortedLinks() {
            if (this.sortMethod === 'name') {
                return [...this.links].sort((a, b) => a.title.localeCompare(b.title))
            } else {
                return [...this.links].sort((a, b) => {
                    if (!a.category && !b.category) return 0
                    if (!a.category) return 1
                    if (!b.category) return -1
                    return a.category.localeCompare(b.category)
                })
            }
        }
    },
    methods: {
        async fetchLinks() {
            try {
                const response = await axios.get(this.rawUrl)
                const markdown = response.data
                
                // 解析 markdown 文件中的链接和分类
                const links = []
                const lines = markdown.split('\n')
                let currentCategory = ''
                
                lines.forEach(line => {
                    // 检查是否是分类标题
                    if (line.startsWith('#')) {
                        currentCategory = line.replace(/#/g, '').trim()
                        return
                    }
                    
                    // 解析链接
                    // 更新正则表达式以匹配新的格式
                    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)(?:\s+\[icon\]\(([^)]+)\))?(?:\s+-\s+(.+))?/
                    const match = line.match(linkRegex)
                    
                    if (match) {
                        const title = match[1]
                        const url = match[2]
                        const customIcon = match[3]
                        const description = match[4] || ''
                        
                        // 如果有自定义图标，创建img元素
                        const icon = customIcon ? {
                            type: 'image',
                            url: customIcon
                        } : {
                            type: 'mdi',
                            name: this.getDefaultIcon(url)
                        }
                        
                        const linkItem = {
                            title,
                            url,
                            description,
                            category: currentCategory,
                            icon
                        }

                        // 如果是主页链接，单独存储
                        if (title.includes('Homepage')) {
                            this.homepage = linkItem
                        } else {
                            links.push(linkItem)
                        }
                    }
                })
                
                this.links = links
            } catch (error) {
                console.error('Error fetching links:', error)
            }
        },
        getDefaultIcon(url) {
            if (url.includes('github.com')) return 'mdi-github'
            if (url.includes('youtube.com')) return 'mdi-youtube'
            if (url.includes('twitter.com')) return 'mdi-twitter'
            if (url.includes('bilibili.com')) return 'mdi-video'
            if (url.includes('docs.') || url.endsWith('.md')) return 'mdi-file-document-outline'
            return 'mdi-link-variant'
        },
        sortByName() {
            this.sortMethod = 'name'
        },
        sortByCategory() {
            this.sortMethod = 'category'
        }
    },
    mounted() {
        this.fetchLinks()
    }
})

app.mount('#app')
