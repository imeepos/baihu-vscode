module.exports = {
    content: [
        './src/pages/**/*.tsx'
    ],
    plugins: [],
    theme: {
        extend: {
            flex: {
                '2': '2 2 0%', // 两个 flex 值
                '3': '3 3 0%', // 另外两个 flex 值
            },
            colors: {}
        }
    }
}
