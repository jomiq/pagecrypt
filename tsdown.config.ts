import { minify } from 'html-minifier-next'
import { defineConfig, type Rolldown } from 'tsdown'

export default defineConfig({
    dts: true,
    attw: {
        profile: 'esm-only',
    },
    publint: true,
    entry: {
        index: 'src/index.ts',
        core: 'src/core.ts',
        cli: 'src/cli.ts',
    },
    plugins: [minifyHTMLPlugin()],
    nodeProtocol: true,
})

function minifyHTMLPlugin(): Rolldown.Plugin {
    return {
        name: 'minify-html-plugin',
        transform: {
            filter: {
                id: /\.html$/,
            },
            async handler(code) {
                return {
                    code: await minifyHTML(code),
                    moduleType: 'text',
                }
            },
        },
    }
}

async function minifyHTML(html: string) {
    const minifiedHTML = await minify(html, {
        removeDefaultTypeAttributes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        decodeEntities: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
    })
    console.log(
        `HTML size reduced by ${Math.round(100 - (minifiedHTML.length / html.length) * 100)}%`,
    )

    return minifiedHTML
}
