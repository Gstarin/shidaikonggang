<template>
  <WaterQualityReport :config="config" />
</template>

<script>
import WaterQualityReport from './table';
import { otherTableConfig } from './config';

export default {
  name: 'OtherTable',
  components: { WaterQualityReport },
  data() {
    return {
      config: otherTableConfig
    };
  }
};
</script>