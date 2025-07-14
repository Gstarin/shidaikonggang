<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>青清水务</b-breadcrumb-item>
      <b-breadcrumb-item active>污水厂在职人员</b-breadcrumb-item>
    </b-breadcrumb>
<<<<<<< HEAD
    <b-row>
      <b-col>
        <Widget title="<h5>污水厂在职人员</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="staffData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'wsczaizhi'"
            :customFilter1="filterByYearMonth"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
              <div class="filter-container">
                <el-date-picker
                  v-model="selectedYearMonth"
                  type="month"
                  placeholder="选择年月"
                  value-format="yyyy-MM"
                  :clearable="true"
                  @change="handleMonthChange"
                  style="width: 150px; margin-right: 15px;"
                />
                <el-button 
                  v-if="selectedYearMonth"
                  @click="clearMonthFilter"
                  size="small"
                  icon="el-icon-close"
                  circle
                />
              </div>
            </template>
          </TableTemplate>
=======

    <b-row>
      <b-col>
        <Widget title="污水厂在职人员" customHeader settings close>
          <xlsxTable
            v-model:tableData="items"
            :columns="columns"
            :formFields="formFields"
            apiEndpoint="/api/save/wsczaizhi"
            storageKey="wsczaizhi"
            :rowFilter="row => isMonthMatched(row.time2)"
          >
            <template #custom-filter1>
              <el-date-picker
                v-model="selectMonth"
                type="month"
                placeholder="筛选入职月份"
                value-format="yyyy-MM"
                style="margin-right: 15px"
              />
            </template>
          </xlsxTable>
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
<<<<<<< HEAD
import TableTemplate from '@/components/Template/xlsxTable'

export default {
  name: 'WaterStaff',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYearMonth: '',
      staffData: [],
      tableColumns: [
        { prop: 'time', label: '序号', width: 100 },
        { prop: 'name', label: '姓名', width: 120 },
        { prop: 'danwei', label: '性别', width: 100 },
        { prop: 'number', label: '年龄', width: 100, type: 'number' },
        { 
          prop: 'remaining', 
          label: '出生日期', 
          width: 150,
          type: 'date'
        },
        { prop: 'sunhao', label: '身份证号', width: 180 },
        { prop: 'phone', label: '电话', width: 150 },
        { prop: 'job', label: '岗位', width: 150 },
        { 
          prop: 'time2', 
          label: '入职时间', 
          width: 150,
          type: 'date'
        },
        { prop: 'people', label: '劳动关系', width: 150 },
        { prop: 'jine', label: '工作地点', width: 150 },
        { prop: 'note', label: '备注', width: 200 }
=======
import xlsxTable from '@/components/Template/xlsxTable'

export default {
  name: 'WSCZaizhi',
  components: { Widget, xlsxTable },
  data() {
    return {
      items: [],
      selectMonth: null,
      columns: [
        { prop: 'time', label: '序号', type: 'text' },
        { prop: 'name', label: '姓名', type: 'text' },
        { prop: 'danwei', label: '性别', type: 'text' },
        { prop: 'number', label: '年龄', type: 'number' },
        { prop: 'remaining', label: '出生日期', type: 'date' },
        { prop: 'sunhao', label: '身份证号', type: 'text' },
        { prop: 'phone', label: '电话', type: 'text' },
        { prop: 'job', label: '岗位', type: 'text' },
        { prop: 'time2', label: '入职时间', type: 'date' },
        { prop: 'people', label: '劳动关系', type: 'text' },
        { prop: 'jine', label: '工作地点', type: 'text' },
        { prop: 'note', label: '备注', type: 'text' }
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
      ],
      formFields: {
        time: '',
        name: '',
        danwei: '',
<<<<<<< HEAD
        number: 0,
=======
        number: '',
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
        remaining: '',
        sunhao: '',
        phone: '',
        job: '',
        time2: '',
        people: '',
        jine: '',
        note: ''
      }
    }
  },
  methods: {
<<<<<<< HEAD
    updateTableData(newData) {
      this.staffData = newData
    },
  
    
    filterByYearMonth(item) {
      if (!this.selectedYearMonth) return true
      
      if (!item.time2) return false
      
      const date = new Date(item.time2)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const itemMonth = `${year}-${month}`
      
      return itemMonth === this.selectedYearMonth
    },
    
    clearMonthFilter() {
      this.selectedYearMonth = ''
    }
  }
}
</script>

=======
    isMonthMatched(dateStr) {
      if (!this.selectMonth) return true
      if (!dateStr) return false
      const d = new Date(dateStr)
      const y = d.getFullYear()
      const m = `${d.getMonth() + 1}`.padStart(2, '0')
      return `${y}-${m}` === this.selectMonth
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.form-control {
  background-color: white !important;
  /* 使用 !important 确保覆盖其他样式 */
}

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
    padding: 0;
    height: 50px;
    line-height: 50px;
  }

  ::v-deep .el-table {
    background-color: transparent !important;
    color: #9f9fad !important;
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

.clickable {
  cursor: pointer;
  color: #9f9fad;
  text-decoration: underline;
}
</style>
  
>>>>>>> 5972632f8faa86ea1f83a98c45bb66278ab3ba29
