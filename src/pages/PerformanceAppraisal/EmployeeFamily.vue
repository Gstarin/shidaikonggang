<template>
  <div>
    <el-table :data="relations" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="120">
        <template v-slot="scope">
          <el-input 
            v-if="mode === 'edit'"
            v-model="scope.row.name" 
            @input="updateFamilyMember(scope.$index, 'name', $event)"
          />
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="relation" label="关系" width="120">
        <template v-slot="scope">
          <el-input 
            v-if="mode === 'edit'"
            v-model="scope.row.relation" 
            @input="updateFamilyMember(scope.$index, 'relation', $event)"
          />
          <span v-else>{{ scope.row.relation }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="80">
        <template v-slot="scope">
          <el-select 
            v-if="mode === 'edit'"
            v-model="scope.row.gender" 
            @change="updateFamilyMember(scope.$index, 'gender', $event)"
          >
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
          </el-select>
          <span v-else>{{ scope.row.gender === 'male' ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="birthDate" label="出生日期" width="120">
        <template v-slot="scope">
          <el-date-picker 
            v-if="mode === 'edit'"
            v-model="scope.row.birthDate" 
            type="date"
            value-format="yyyy-MM-dd"
            @change="updateFamilyMember(scope.$index, 'birthDate', $event)"
          />
          <span v-else>{{ scope.row.birthDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="workplace" label="工作单位">
        <template v-slot="scope">
          <el-input 
            v-if="mode === 'edit'"
            v-model="scope.row.workplace" 
            @input="updateFamilyMember(scope.$index, 'workplace', $event)"
          />
          <span v-else>{{ scope.row.workplace }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="职位">
        <template v-slot="scope">
          <el-input 
            v-if="mode === 'edit'"
            v-model="scope.row.position" 
            @input="updateFamilyMember(scope.$index, 'position', $event)"
          />
          <span v-else>{{ scope.row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" v-if="mode === 'edit'">
        <template v-slot="scope">
          <el-button type="danger" size="mini" @click="removeFamilyMember(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-button 
      v-if="mode === 'edit'"
      type="primary" 
      size="small" 
      @click="addFamilyMember"
      style="margin-top: 10px;"
    >
      添加家庭成员
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    relations: Array,
    mode: String
  },
  methods: {
    addFamilyMember() {
      this.$emit('add')
    },
    removeFamilyMember(index) {
      this.$emit('remove', index)
    },
    updateFamilyMember(index, field, value) {
      this.$emit('update', index, field, value)
    }
  }
}
</script>