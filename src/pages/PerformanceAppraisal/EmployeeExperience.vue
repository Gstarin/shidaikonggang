<template>
  <div>
    <el-table :data="experiences" style="width: 100%">
      <el-table-column prop="company" label="公司名称" width="180">
        <template v-slot="scope">
          <el-input 
            v-if="mode === 'edit'"
            v-model="scope.row.company" 
            @input="updateWorkExperience(scope.$index, 'company', $event)"
          />
          <span v-else>{{ scope.row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="职位">
        <template v-slot="scope">
          <el-input 
            v-if="mode === 'edit'"
            v-model="scope.row.position" 
            @input="updateWorkExperience(scope.$index, 'position', $event)"
          />
          <span v-else>{{ scope.row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startYear" label="开始年份" width="120">
        <template v-slot="scope">
          <el-input 
            v-if="mode === 'edit'"
            v-model="scope.row.startYear" 
            @input="updateWorkExperience(scope.$index, 'startYear', $event)"
          />
          <span v-else>{{ scope.row.startYear }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endYear" label="结束年份" width="120">
        <template v-slot="scope">
          <el-input 
            v-if="mode === 'edit'"
            v-model="scope.row.endYear" 
            @input="updateWorkExperience(scope.$index, 'endYear', $event)"
          />
          <span v-else>{{ scope.row.endYear }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" v-if="mode === 'edit'">
        <template v-slot="scope">
          <el-button type="danger" size="mini" @click="removeWorkExperience(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-button 
      v-if="mode === 'edit'"
      type="primary" 
      size="small" 
      @click="addWorkExperience"
      style="margin-top: 10px;"
    >
      添加工作经历
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    experiences: Array,
    mode: String
  },
  methods: {
    addWorkExperience() {
      this.$emit('add')
    },
    removeWorkExperience(index) {
      this.$emit('remove', index)
    },
    updateWorkExperience(index, field, value) {
      this.$emit('update', index, field, value)
    }
  }
}
</script>