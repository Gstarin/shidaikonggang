<template>
  <WaterQualityReport :config="config" />
</template>

<script>
import WaterQualityReport from './table';
import { nitrateNitrogenTableConfig } from './config';

export default {
  name: 'NitrateNitrogenTable',
  components: { WaterQualityReport },
  data() {
    return {
      config: nitrateNitrogenTableConfig
    };
  }
};
</script>