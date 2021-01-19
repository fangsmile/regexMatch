const path = require('path');

module.exports = {
    // mode: 'development',
    
    entry: './src/index.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.ts$/,
            use: "ts-loader"
        }]
    },
    resolve: {
        extensions: [
            '.ts','.js', '.json', '.less', '.css'
        ]
    },
    devServer:{
        port:8085,
        hot: true
  }    
};