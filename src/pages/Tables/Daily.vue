<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>成本中心</b-breadcrumb-item>
      <b-breadcrumb-item active>日常用品类</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>日常用品价格库</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="items"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'dailySupplies'"
            @update:tableData="updateTableData"
            @save-success="handleSaveSuccess"
          />
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import TableTemplate from '@/components/Template/xlsxTable'
import axios from '@/utils/axios.js'

export default {
  name: 'DailySupplies',
  components: { Widget, TableTemplate },
  data() {
    return {
      items: [],
      // 表格列配置
      tableColumns: [
        { prop: 'class', label: '类别', width: 150 },
        { prop: 'info', label: '规格', width: 150 },
        { prop: 'name', label: '物品名称', width: 150 },
        { prop: 'unit', label: '单位', width: 150 },
        { prop: 'low_price', label: '集采价含税（元/个）', width: 180, type: 'number' },
        { prop: 'high_price', label: '最高限价不含税（元/个）', width: 200, type: 'number' },
        { prop: 'submit', label: '经办人', width: 150 },
        { prop: 'extra', label: '备注', width: 150 },
        { 
          prop: 'picture', 
          label: '图示', 
          width: 250,
          type: 'file',
          accept: 'image/*'
        }
      ],
      // 表单字段配置
      formFields: {
        class: '',
        info: '',
        name: '',
        unit: '',
        low_price: '',
        high_price: '',
        submit: '',
        extra: '',
        picture: null
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    updateTableData(newData) {
      this.items = newData
    },
    
    // 格式化价格显示
    parsePrice(price) {
      if (price === "") {
        return price
      } else {
        price = Number(price)
        const priceStr = price.toFixed(2)
        const formattedPrice = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return formattedPrice
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.table-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}

.table-footer {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#table {
  ::v-deep .cell {
    color: #9f9fad;
  }

  ::v-deep .el-table__header th {
    padding: 0;
    height: 50px;
    line-height: 50px;
  }

  ::v-deep .el-table__body tr,
  ::v-deep .el-table__body td {
    padding: 5px 0;
    height: 50px;
    line-height: 50px;
  }

  ::v-deep .el-table {
    background-color: transparent !important;
  }

  ::v-deep .el-table__expanded-cell {
    background-color: transparent !important;
  }

  ::v-deep .el-table th,
  ::v-deep .el-table tr,
  ::v-deep .el-table td {
    background-color: transparent;
  }
  
  .file-cell {
    display: flex;
    flex-direction: column;
    padding: 8px 0;
    
    .uploaded-files {
      margin-bottom: 8px;
      word-break: break-all;
      
      img {
        max-width: 100px;
        max-height: 100px;
      }
    }
    
    button {
      margin: 2px 0;
      width: 100%;
    }
  }
}
</style>