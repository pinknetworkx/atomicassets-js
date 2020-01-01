const path = require('path');

module.exports = {
    entry: {
        nftstandard: './src/index.ts',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: { configFile: 'tsconfig.web.json' }
                },
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts']
    },
    output: {
        filename: x => x.chunk.name.replace('_', '-') + '.js',
        library: '[name]',
        path: path.resolve(__dirname, 'dist'),
    }
};