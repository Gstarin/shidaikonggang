<template>
  <el-table-column 
    :prop="column.prop" 
    :label="column.label" 
    :width="column.width"
  >
    <template v-if="column.children && column.children.length">
      <recursive-column 
        v-for="child in column.children"
        :key="child.prop"
        :column="child"
      />
    </template>
    
    <template v-else v-slot="scope">
      <!-- 原有单元格内容 -->
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: 'RecursiveColumn',
  props: {
    column: {
      type: Object,
      required: true
    }
  }
}
</script>