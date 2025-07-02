<template>
  <div>
    <el-table :data="educations" style="width: 100%">
      <el-table-column prop="school" label="学校名称" width="180">
        <template v-slot="scope">
          <el-input 
            v-if="mode === 'edit'"
            v-model="scope.row.school" 
            @input="updateEducation(scope.$index, 'school', $event)"
          />
          <span v-else>{{ scope.row.school }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="major" label="专业">
        <template v-slot="scope">
          <el-input 
            v-if="mode === 'edit'"
            v-model="scope.row.major" 
            @input="updateEducation(scope.$index, 'major', $event)"
          />
          <span v-else>{{ scope.row.major }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startYear" label="开始年份" width="120">
        <template v-slot="scope">
          <el-input 
            v-if="mode === 'edit'"
            v-model="scope.row.startYear" 
            @input="updateEducation(scope.$index, 'startYear', $event)"
          />
          <span v-else>{{ scope.row.startYear }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endYear" label="结束年份" width="120">
        <template v-slot="scope">
          <el-input 
            v-if="mode === 'edit'"
            v-model="scope.row.endYear" 
            @input="updateEducation(scope.$index, 'endYear', $event)"
          />
          <span v-else>{{ scope.row.endYear }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" v-if="mode === 'edit'">
        <template v-slot="scope">
          <el-button type="danger" size="mini" @click="removeEducation(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-button 
      v-if="mode === 'edit'"
      type="primary" 
      size="small" 
      @click="addEducation"
      style="margin-top: 10px;"
    >
      添加教育经历
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    educations: Array,
    mode: String
  },
  methods: {
    addEducation() {
      this.$emit('add')
    },
    removeEducation(index) {
      this.$emit('remove', index)
    },
    updateEducation(index, field, value) {
      this.$emit('update', index, field, value)
    }
  }
}
</script>