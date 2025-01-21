const esbuild = require('esbuild');
const reactPlugin = require('esbuild-plugin-react18');
const sassPlugin = require(`esbuild-sass-plugin`).default;
const esbuildPluginPostcss = require('esbuild-plugin-postcss').default;

esbuild.build({
    entryPoints: ['src/pages/docs/docs.tsx'], // React应用的入口文件
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
