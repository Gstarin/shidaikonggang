<template>
  <WaterQualityReport :config="config" />
</template>

<script>
import WaterQualityReport from './table';
import { ammoniaConfig } from './config';

export default {
  name: 'AmmoniaTable',
  components: { WaterQualityReport },
  data() {
    return {
      config: ammoniaConfig
    };
  }
};
</script>