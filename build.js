


const esbuild = require('esbuild');
const reactPlugin = require('esbuild-plugin-react18');
const sassPlugin = require(`esbuild-sass-plugin`).default;
const esbuildPluginPostcss = require('esbuild-plugin-postcss').default;

const build = (path) => esbuild.build({
    entryPoints: [path], // React应用的入口文件
    bundle: true,
    outdir: 'build',
    loader: {
        '.js': 'js',
        '.jsx': 'jsx',
        '.ts': 'ts',
        '.tsx': 'tsx',
        ".png": "file",
        ".jpg": "file",
        ".jpeg": "file",
        ".svg": "file",
        ".gif": "file",
    },
    plugins: [
        reactPlugin(),
        sassPlugin({
            cache: true,
            implementation: require('sass'),
        }),
        esbuildPluginPostcss({
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        })],
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    minify: true,
}).catch(() => process.exit(1));


build('src/pages/docs/docs.tsx')
build('src/pages/ast/ast.tsx')
build('src/pages/ocr/ocr.tsx')
build('src/pages/log/log.tsx')
build('src/pages/takeScreen/takeScreen.tsx')
build('src/pages/script/script.tsx')
build('src/pages/app/app.tsx')

