<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item active>跨境电商产业园项目</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">项目管理</h1>
    
    <!-- 使用 TableTemplate 组件 -->
    <Widget title="<h5>项目管理文件</h5>" customHeader settings close>
      <TableTemplate
        ref="tableTemplate"
        :tableData="tableData"
        :columns="tableColumns"
        :formFields="formFields"
        :storageKey="'crossBorderProjectFiles'"
        @update:tableData="updateTableData"
      >
        <!-- 文件类型筛选器 -->
        <template v-slot:custom-filter1>
          <el-select 
            v-model="selectedFileType" 
            placeholder="筛选文件类型" 
            clearable
            style="width: 200px; margin-right: 15px;"
            @change="filterByFileType"
          >
            <el-option 
              v-for="type in fileTypes" 
              :key="type" 
              :label="type" 
              :value="type"
            ></el-option>
          </el-select>
        </template>
      </TableTemplate>
    </Widget>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import TableTemplate from '@/components/Template/xlsxTable';
import axios from '@/utils/axios.js';

export default {
  name: 'CrossBorderProject',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedFileType: '',
      tableData: [
            { fileType: '月度入住企业信息表', fileName: '',file:null },
            { fileType: '月度入住企业情况统计表', fileName: '',file:null },
            { fileType: '月快递数据', fileName: '',file:null },
            { fileType: '合作项目', fileName: '',file:null },
            { fileType: '收发文', fileName: '',file:null },
            { fileType: '月工作汇报', fileName: '',file:null },
            { fileType: '产业园制式文件', fileName: '',file:null }
          ],
      tableColumns: [
        { 
          prop: 'fileType', 
          label: '文件类型', 
          width: 200,
          
          editable: true
        },
        { 
          prop: 'fileName', 
          label: '文件名', 
          width: 500
        },
        { 
          prop: 'file', 
          label: '文件', 
          type: 'file',
          width: 500
        }
      ],
      formFields: {
        fileType: '',
        fileName: '',
        file: null
      }
    }
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData;
      // 更新文件类型列表
      this.updateFileTypes();
    },
    
    filterByFileType() {
      if (!this.selectedFileType) {
        this.$refs.tableTemplate.clearSearch();
        return;
      }
      
      this.$refs.tableTemplate.searchText = this.selectedFileType;
      this.$refs.tableTemplate.performSearch();
    },
    
    updateFileTypes() {
      // 从现有数据中提取所有文件类型
      const types = new Set(this.tableData.map(item => item.fileType));
      this.fileTypes = Array.from(types).sort();
      
      // 更新下拉选项
      this.tableColumns[0].options = this.fileTypes.map(type => ({
        label: type,
        value: type
      }));
    },
    
    // 添加新文件类型
    addNewFileType(newType) {
      if (!newType || this.fileTypes.includes(newType)) return;
      
      this.fileTypes.push(newType);
      this.fileTypes.sort();
      
      // 更新下拉选项
      this.tableColumns[0].options = this.fileTypes.map(type => ({
        label: type,
        value: type
      }));
    }
  },
  watch: {
    tableData: {
      deep: true,
      handler() {
        this.updateFileTypes();
      }
    }
  }
}
</script>

<style>
/* 可以保留原有的样式或根据需要调整 */
#el_tree {
  background-color: rgba(26, 26, 56, 0.8);
}

#el_input {
  background-color: rgba(106, 106, 173, 0.8);
}
</style>