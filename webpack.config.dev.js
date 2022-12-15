const JS_DEV_CONFIG = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    }
};

const CSS_DEV_CONFIG = {
    mode: 'development'
};

export {
    JS_DEV_CONFIG as JS_MODE_CONFIG,
    CSS_DEV_CONFIG as CSS_MODE_CONFIG
};
