<template>
  <WaterQualityReport :config="config" />
</template>

<script>
import WaterQualityReport from './table';
import { zongdanConfig } from './config';

export default {
  name: 'TotalNitrogenTable',
  components: { WaterQualityReport },
  data() {
    return {
      config: zongdanConfig
    };
  }
};
</script>