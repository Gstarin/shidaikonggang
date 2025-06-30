<template>
  <WaterQualityReport :config="config" />
</template>

<script>
import WaterQualityReport from './table';
import { zonglinConfig } from './config';

export default {
  name: 'TotalPhosphorusTable',
  components: { WaterQualityReport },
  data() {
    return {
      config: zonglinConfig
    };
  }
};
</script>