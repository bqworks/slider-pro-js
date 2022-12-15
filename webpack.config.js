import { merge } from 'webpack-merge';

const mode = process.env.mode === 'development' ? 'development' : 'production';
const configModeFile = mode === 'development' ? 'webpack.config.dev.js' : 'webpack.config.prod.js';

const { JS_COMMON_CONFIG, CSS_COMMON_CONFIG } = await import( './webpack.config.common.js' );
const { JS_MODE_CONFIG, CSS_MODE_CONFIG } = await import( './' + configModeFile );

const JS_CONFIG = merge( JS_COMMON_CONFIG, JS_MODE_CONFIG );
const CSS_CONFIG = merge( CSS_COMMON_CONFIG, CSS_MODE_CONFIG );

export default [
    JS_CONFIG,
    CSS_CONFIG
];
