<template>
  <WaterQualityReport :config="config" />
</template>

<script>
import WaterQualityReport from './table';
import { mlssConfig } from './config';

export default {
  name: 'MLSSTable',
  components: { WaterQualityReport },
  data() {
    return {
      config: mlssConfig
    };
  }
};
</script>