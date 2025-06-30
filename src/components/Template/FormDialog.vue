<!-- FormDialog.vue -->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title">
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item 
        v-for="field in fields" 
        :key="field.prop" 
        :label="field.label"
      >
        <el-input v-model="form[field.prop]"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="$emit('submit')">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: Boolean,
    title: String,
    form: Object,
    fields: Array
  }
}
</script>