<template>
  <WaterQualityReport :config="config" />
</template>

<script>
import WaterQualityReport from './table';
import { phConfig } from './config';

export default {
  name: 'PHTable',
  components: { WaterQualityReport },
  data() {
    return {
      config: phConfig
    };
  }
};
</script>