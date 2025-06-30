let publicPath = process.env.NODE_ENV === 'production' ? 'light-blue-vue-admin/' : '/';

module.exports = {
  publicPath:'./',
  productionSourceMap: false,
  devServer: { 
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://111.11.15.235:65001',
        changeOrigin: true,
        logLevel: 'debug'
      }
    }
  },

  lintOnSave: false ,//关闭eslint检查

  chainWebpack: config => {  
    config.module  
      .rule('geojson')  
      .test(/\.geojson$/)  
      .use('raw-loader')  
      .loader('raw-loader')  
      .end();  
  }  

};
