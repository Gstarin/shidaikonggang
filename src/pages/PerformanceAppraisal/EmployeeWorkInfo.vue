<template>
  <el-form :model="form" label-width="120px" label-position="left">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="部门">
          <el-input v-model="form.department" :disabled="mode !== 'edit'" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="职位">
          <el-input v-model="form.position" :disabled="mode !== 'edit'" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="入职日期">
          <el-date-picker 
            v-model="form.hireDate" 
            type="date" 
            placeholder="选择日期"
            :disabled="mode !== 'edit'"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="在职状态">
          <el-select v-model="form.status" :disabled="mode !== 'edit'">
            <el-option label="在职" value="active" />
            <el-option label="离职" value="inactive" />
            <el-option label="休假" value="on_leave" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="紧急联系人">
          <el-input v-model="form.emergencyContact" :disabled="mode !== 'edit'" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="紧急联系电话">
          <el-input v-model="form.emergencyPhone" :disabled="mode !== 'edit'" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    form: Object,
    mode: String
  }
}
</script>