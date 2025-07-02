<template>
  <el-form :model="form" label-width="120px" label-position="left">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="员工ID">
          <el-input v-model="form.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="form.name" :disabled="mode !== 'edit'" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gender" :disabled="mode !== 'edit'">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
          </el-select>
        </el-form-item>
      </el-col>
      
      <el-col :span="8">
        <el-form-item label="出生日期">
          <el-date-picker 
            v-model="form.birthDate" 
            type="date" 
            placeholder="选择日期"
            :disabled="mode !== 'edit'"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="民族">
          <el-input v-model="form.ethnicity" :disabled="mode !== 'edit'" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" :disabled="mode !== 'edit'" />
        </el-form-item>
      </el-col>
      
      <el-col :span="8">
        <!-- 修改EmployeeBasicInfo.vue中的头像显示部分 -->
        <el-form-item label="头像">
        <div class="avatar-upload-container">
            <img v-if="form.avatarUrl" :src="form.avatarUrl" class="preview-avatar" />
            <div v-else class="avatar-placeholder">
            <i class="el-icon-user-solid"></i>
            </div>
            <el-button 
            v-if="mode === 'edit'"
            type="primary" 
            size="small" 
            @click="$emit('upload-avatar')"
            >
            上传头像
            </el-button>
        </div>
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="身份证号">
          <el-input v-model="form.idCard" :disabled="mode !== 'edit'" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="家庭住址">
          <el-input v-model="form.address" :disabled="mode !== 'edit'" />
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
  },
  computed: {
    imageUrl() {
      return this.$parent.imageCache[this.form.avatarPath] || ''
    }
  }
}
</script>

<style scoped>
.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
}
</style>