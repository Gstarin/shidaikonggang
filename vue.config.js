let publicPath = process.env.NODE_ENV === 'production' ? 'light-blue-vue-admin/' : '/';

module.exports = {
  publicPath:'./',
  productionSourceMap: false,
  devServer: { 
    disableHostCheck: true,
    host:'0.0.0.0',
    port: 65002,
    proxy: {
      '/api': {
        target: 'http://localhost:65001',
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
