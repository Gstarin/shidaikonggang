<template>
  <WaterQualityReport :config="config" />
</template>

<script>
import WaterQualityReport from './table';
import { waterPacConfig } from './config';

export default {
  name: 'WaterPacTable',
  components: { WaterQualityReport },
  data() {
    return {
      config: waterPacConfig
    };
  }
};
</script>