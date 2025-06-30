<template>
  <div>
    <div class="map" ref="map">

    </div>
    <div class="point1" data-tooltip="这是提示语1"></div>
    <div class="point2" data-tooltip="这是提示语2"></div>
    <div class="point3" data-tooltip="这是提示语3"></div>
	
    <div class="stats">
      <h6 class="mt-1">员工数量</h6>
      <p class="h3 m-0">
      <span class="mr-xs fw-normal"><AnimatedNumber value="200"
                                                    v-bind="animateNumberOptions"></AnimatedNumber></span>
        <i class="marker"/>
        <i class="marker1"/>
        <i class="marker2"/>
        <i class="marker3"/>
       
      
      </p>
      
    </div>
    
  </div>

</template>




 
<script>




import AnimatedNumber from "animated-number-vue";
import * as echarts from 'echarts';

//import cities from './mock';
import myGeoJSON from './langfang.geojson'; 
export default {
  name: 'Map',
  components: { AnimatedNumber },
  data() {
    return {
      animateNumberOptions: {
        duration: 2000,
        easing: 'easeInQuad',
        formatValue(value) {
          let number = value.toFixed(0);
          let numberAsArrayWithSapces = [];
          while (number >= 1) {
            numberAsArrayWithSapces.unshift(number % 1000);
            number = (number/1000).toFixed();
          }
          return numberAsArrayWithSapces.join(' ');
        }
      }
    }
  },
  mounted() {
	echarts.registerMap('myCustomMap', myGeoJSON);  
  
	// 初始化图表  
	this.map = echarts.init(this.$refs.map);  

	// 配置图表选项  
	const option = {  
		// ... 配置项（例如：visualMap, series等）  
		series: [  
		{  
			name: '自定义地图',  
			type: 'map',  
			mapType: 'myCustomMap', // 自定义地图名称  
			roam: false, // 是否开启鼠标缩放和平移漫游  
			label: {  
			show: true  
			},  
			data: [  
			// 假设你有一些与GeoJSON中的区域对应的数据  
			{name: '区域1', value: 50},  
			{name: '区域2', value: 30},  
			// ...  
			]  
      }  
    ]  
  };  

	// 渲染图表  
	this.map.setOption(option);  
 
   },
};
</script>

<style src="./Map.scss" lang="scss" />
