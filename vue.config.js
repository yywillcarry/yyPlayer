const path = require('path')


function resolve(dir) {
    return path.join(__dirname, dir)
}


module.exports = {
    publicPath: '',
    chainWebpack(config) {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('api', resolve('src/api'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('pages', resolve('src/pages'))
            .set('utils', resolve('src/utils'))


    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                resolve('src/styles/var.less'),
                resolve('src/styles/mixin.less')
            ]
        }
    },
    devServer: {
        proxy: 'http://localhost:3000'
    }

}