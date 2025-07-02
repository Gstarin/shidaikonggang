<template>
  <div class="tables-basic">
    <b-row>
      <b-col>
        <Widget title="<h5>交通费用</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'trafficExpenses'"
            :customFilter1="filterByMonth"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
              <el-date-picker
                v-model="selectMonth"
                type="month"
                placeholder="选择年月"
                @change="handleMonthChange"
                value-format="yyyy-MM"
                style="margin-right: 15px;"
              ></el-date-picker>
            </template>
          </TableTemplate>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import TableTemplate from '@/components/Template/xlsxTable';
import axios from '@/utils/axios.js';

export default {
  name: 'TrafficExpenses',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectMonth: null,
      path: '',
      tableData: [],
      formFields: {
        xuhao: 0,
        name: "",
        gendeer: "",
        nation: "",
        id: "",
        birthday: "",
        age: "",
        img: "",
        height: "",
        weight: "",
        phone: "",
        satus: "",
      },
      tableColumns: [
        { prop: 'xuhao', label: '序号', width: 100, type: 'number' },
        { prop: 'name', label: '车牌号', width: 150 },
        { prop: 'gendeer', label: '所属车队', width: 150 },
        { prop: 'nation', label: '缴费日期', width: 150 },
        { prop: 'id', label: '高速费（元）', width: 120, type: 'number' },
        { prop: 'birthday', label: '过桥费（元）', width: 120, type: 'number' },
        { prop: 'age', label: '停车费（元）', width: 120, type: 'number' },
        { prop: 'img', label: '洗车费（元）', width: 120, type: 'number' },
        { prop: 'height', label: '其他费（元）', width: 120, type: 'number' },
        { 
          prop: 'weight', 
          label: '合计（元）', 
          width: 120, 
          type: 'variable',
          calculate: (row) => {
            const sum = [row.id, row.birthday, row.age, row.img, row.height]
              .filter(val => !isNaN(parseFloat(val)))
              .reduce((acc, val) => acc + parseFloat(val), 0);
            return sum.toFixed(2);
          }
        },
        { prop: 'phone', label: '备注', width: 200 },
        { prop: 'satus', label: '图片', width: 150 ,type: 'file'}
      ]
    };
  },
  methods: {
    
    updateTableData(newData) {
      this.tableData = newData;
    },
    filterByMonth(item) {
      if (!this.selectMonth) return true
      
      const itemDate = item.time2
      if (!itemDate) return false
      
      // 处理不同日期格式
      const dateObj = new Date(itemDate)
      const year = dateObj.getFullYear()
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
      const itemYearMonth = `${year}-${month}`
      
      return itemYearMonth === this.selectMonth
    },
    
    handleMonthChange() {
      console.log('当前筛选月份:', this.selectMonth)
    },
    
    clearMonthFilter() {
      this.selectMonth = null
    },
  }
};
</script>
