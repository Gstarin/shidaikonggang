<template>
  <WaterQualityReport :config="config" />
</template>

<script>
import WaterQualityReport from './table';
import { yuanshuiConfig } from './config';

export default {
  name: 'WaterPac2Table',
  components: { WaterQualityReport },
  data() {
    return {
      config: yuanshuiConfig
    };
  }
};
</script>