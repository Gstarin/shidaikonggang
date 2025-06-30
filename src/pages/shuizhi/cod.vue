<template>
  <WaterQualityReport :config="config" />
</template>

<script>
import WaterQualityReport from './table';
import { codConfig } from './config';

export default {
  name: 'CODTable',
  components: { WaterQualityReport },
  data() {
    return {
      config: codConfig
    };
  }
};
</script>