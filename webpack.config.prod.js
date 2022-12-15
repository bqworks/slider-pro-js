const JS_PROD_CONFIG = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};

const CSS_PROD_CONFIG = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                loader: "postcss-loader"
            }
        ]
    }
};

export {
    JS_PROD_CONFIG as JS_MODE_CONFIG,
    CSS_PROD_CONFIG as CSS_MODE_CONFIG
};