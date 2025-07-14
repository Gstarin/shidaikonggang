<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>加油费用</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'cq1'"
            :showExcelHandler="true"
            :customFilter1="filterByYearMonth"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
              <el-date-picker 
                v-model="selectMonth" 
                type="month" 
                placeholder="选择年月" 
                value-format="yyyy-MM"
                style="margin-right: 15px"
              ></el-date-picker>
            </template>
            
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="DisburseTable1">
                <el-table-column 
                  v-for="column in tableColumns" 
                  :key="column.prop"
                  :prop="column.prop" 
                  :label="column.label" 
                ></el-table-column>
              </el-table>
            </template>
          </TableTemplate>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
<<<<<<< HEAD
import TableTemplate from '@/components/Template/xlsxTable'
import moment from 'moment'

export default {
  name: 'd1',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectMonth: null,
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: 55 },
        { 
          prop: 'date', 
          label: '日期', 
          width: 180,
          type: 'date'
        },
        { 
          prop: 'driver', 
          label: '驾驶员', 
          width: 100,
          editable: true
        },
        { 
          prop: 'car_number', 
          label: '车辆号码', 
          width: 100,
          editable: true
        },
        { 
          prop: 'miles', 
          label: '当前里程数', 
          width: 100,
          type: 'number',
          editable: true
        },
        { 
          prop: 'youpin', 
          label: '油品', 
          width: 180,
          editable: true
        },
        { 
          prop: 'price', 
          label: '单价(元)', 
          width: 120,
          type: 'number',
          editable: true
        },
        { 
          prop: 'jyss', 
          label: '加油升数', 
          type: 'number',
          editable: true
        },
        { 
          prop: 'money', 
          label: '加油金额(元)', 
          type: 'number',
          editable: true
        },
        { 
          prop: 'beizhu', 
          label: '备注', 
          editable: true
        }
      ],
      formFields: {
        id: 0,
        date: null,
        driver: '',
        car_number: '',
        miles: 0,
        youpin: '',
        price: 0,
        jyss: 0,
        money: 0,
        beizhu: ''
      }
    }
  },
  computed: {
    filteredItems() {
      if (!this.selectMonth) return this.tableData
      
      return this.tableData.filter(item => {
        if (!item.date) return false
        const date = new Date(item.date)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        return `${year}-${month}` === this.selectMonth
      })
    }
  },
  methods: {
    updateTableData(newData) {
      // 确保id连续
      newData.forEach((item, index) => {
        item.id = index + 1
      })
      this.tableData = newData
    },
    
    customFilter1(item) {
      if (!this.selectMonth) return true
      
      if (!item.date) return false
      const date = new Date(item.date)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      return `${year}-${month}` === this.selectMonth
    }
=======
import XlsxTable from '@/components/Template/xlsxTable.vue' // 即 TableTemplate.vue 重命名为 xlsxTable.vue 的组件
import axios from '@/utils/axios'

export default {
  name: 'FuelCosts',
  components: {
    Widget,
    XlsxTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'id', label: '序号', type: 'number' },
        { prop: 'date', label: '日期', type: 'date' },
        { prop: 'driver', label: '驾驶员' },
        { prop: 'car_number', label: '车辆号码' },
        { prop: 'miles', label: '当前里程数' },
        { prop: 'youpin', label: '油品' },
        { prop: 'price', label: '单价（元）', type: 'number' },
        { prop: 'jyss', label: '加油升数', type: 'number' },
        {
          prop: 'money',
          label: '加油金额（元）',
          type: 'variable',
          calculate: row => {
            const price = parseFloat(row.price) || 0
            const qty = parseFloat(row.jyss) || 0
            return (price * qty).toFixed(2)
          }
        },
        { prop: 'beizhu', label: '备注' }
      ],
      formFields: {
        id: null,
        date: null,
        driver: '',
        car_number: '',
        miles: '',
        youpin: '',
        price: '',
        jyss: '',
        money: '',
        beizhu: ''
      }
    }
  },
  mounted() {
    axios.get('/api/data/cq1').then(res => {
      this.tableData = res.data || []
    })
  },
  beforeDestroy() {
    axios.post('/api/save/cq1', this.tableData, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      console.log('保存成功')
    }).catch(err => {
      console.error('保存失败', err)
    })
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
  }
}
</script>
