<template>
  <div class="filter-container">
    <el-date-picker
      v-model="selectedYearMonth"
      type="month"
      placeholder="选择年月"
      value-format="yyyy-MM"
      :clearable="true"
      @change="handleMonthChange"
      style="width: 150px; margin-right: 15px;"
    />
    <el-button 
      v-if="selectedYearMonth"
      @click="clearMonthFilter"
      size="small"
      icon="el-icon-close"
      circle
    />
  </div>
</template>

<script>
export default {
  name: 'MonthYearFilter',
  props: {
    // 新增字段名配置
    fieldName: {
      type: String,
      default: 'date' // 默认字段名
    }
  },
  data() {
    return {
      selectedYearMonth: ''
    }
  },
  methods: {
    handleMonthChange() {
      this.$emit('change', this.selectedYearMonth)
    },
    clearMonthFilter() {
      this.selectedYearMonth = ''
      this.$emit('change', '')
    },
    // 修改过滤器方法，使用传入的字段名
    filterMethod(item) {
      if (!this.selectedYearMonth) return true
      
      const itemDate = item[this.fieldName]
      if (!itemDate) return false
      
      return itemDate.substr(0, 7) === this.selectedYearMonth
    }
  }
}
</script>