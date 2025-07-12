<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>青清水务</b-breadcrumb-item>
      <b-breadcrumb-item active>污水厂离职人员</b-breadcrumb-item>
    </b-breadcrumb>

    <b-row>
      <b-col>
        <Widget title="污水厂离职人员" customHeader settings close>
          <xlsxTable
            v-model:tableData="items"
            :columns="columns"
            :formFields="formFields"
            apiEndpoint="/api/save/wsclizhi"
            storageKey="wsclizhi"
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
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import xlsxTable from '@/components/Template/xlsxTable'

export default {
  name: 'WSCLiZhi',
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
        { prop: 'lizhi', label: '离职时间', type: 'date' },
        { prop: 'people', label: '劳动关系', type: 'text' },
        { prop: 'jine', label: '工作地点', type: 'text' },
        { prop: 'note', label: '备注', type: 'text' }
      ],
      formFields: {
        time: '',
        name: '',
        danwei: '',
        number: '',
        remaining: '',
        sunhao: '',
        phone: '',
        job: '',
        time2: '',
        lizhi: '',
        people: '',
        jine: '',
        note: ''
      }
    }
  },
  methods: {
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
