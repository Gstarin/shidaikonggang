<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>成本中心</b-breadcrumb-item>
      <b-breadcrumb-item active>工程项目类</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>工程项目价格库</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="items"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'projectSupplies'"
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
  name: 'ProjectSupplies',
  components: { Widget, TableTemplate },
  data() {
    return {
      items: [],
      // 表格列配置
      tableColumns: [
        { prop: 'class', label: '类别', width: 150 },
        { prop: 'name', label: '材料名称', width: 200 },
        { prop: 'info', label: '规格型号', width: 150 },
        { prop: 'unit', label: '单位', width: 150 },
        { prop: 'price', label: '预算价（元）', width: 150, type: 'number' },
        { prop: 'source1_price', label: '价格来源项目', width: 180 },
        { prop: 'source2_price', label: '价格', width: 150, type: 'number' },
        { prop: 'source3_price', label: '经办人', width: 150 },
        { prop: 'extra', label: '备注', width: 150 }
      ],
      // 表单字段配置
      formFields: {
        class: '',
        name: '',
        info: '',
        unit: '',
        price: '',
        source1_price: '',
        source2_price: '',
        source3_price: '',
        extra: ''
      }
    }
  },
  methods: {
    updateTableData(newData) {
      this.items = newData
    },
    // 格式化价格显示
    parsePrice(price) {
      if (price === undefined) {
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
}
</style>