const esbuild = require('esbuild');
const reactPlugin = require('esbuild-plugin-react18');
const sassPlugin = require(`esbuild-sass-plugin`).default;
const esbuildPluginPostcss = require('esbuild-plugin-postcss').default;

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');


const esbuildProblemMatcherPlugin = {
    name: 'esbuild-problem-matcher',
    setup(build) {
        build.onStart(() => {
            console.log('[watch] build started');
        });
        build.onEnd((result) => {
            result.errors.forEach(({ text, location }) => {
                console.error(`✘ [ERROR] ${text}`);
                console.error(`    ${location.file}:${location.line}:${location.column}:`);
            });
            console.log('[watch] build finished');
        });
    },
};

const sharedConfig = {
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
        }),
        esbuildProblemMatcherPlugin
    ],
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    minify: true,
};

const entryPoints = [
    'src/pages/docs/docs.tsx',
    'src/pages/ast/ast.tsx',
    'src/pages/ocr/ocr.tsx',
    'src/pages/log/log.tsx',
    'src/pages/takeScreen/takeScreen.tsx',
    'src/pages/script/script.tsx',
    'src/pages/app/app.tsx',
    'src/pages/test/test.tsx',
];

const build = async () => {
    try {
        const ctx = await esbuild.context({
            ...sharedConfig,
            entryPoints,
        });
        if (watch) {
            await ctx.watch({});
            console.log('Build started with watch mode.');
        } else {
            await ctx.rebuild();
            await ctx.dispose();
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

build();
