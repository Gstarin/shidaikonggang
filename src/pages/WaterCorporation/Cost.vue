<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>水务公司</b-breadcrumb-item>
      <b-breadcrumb-item active>水厂生产、排水情况</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>水厂生产、排水情况</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'waterProduction'"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-table>
              <el-table style="display: none;width: 100%" id="DisburseTable1">
                <el-table-column prop="riqi" label="日期" width="100"></el-table-column>
                <el-table-column prop="jinshuizongliang" label="排水总量（m³）" width="150"></el-table-column>
                <el-table-column prop="zhishuizongliang" label="制水总量（m³）" width="150"></el-table-column>
                <el-table-column prop="zhuchequ" label="主城区（m³）" width="140"></el-table-column>
                <el-table-column prop="xiangzhen" label="乡镇（m³）" width="140"></el-table-column>
                <el-table-column prop="zongji" label="总计（m³）" width="140"></el-table-column>
                <el-table-column prop="jingkaiqu" label="经开区（m³）" width="140"></el-table-column>
                <el-table-column prop="linshuigongchang" label="临空水厂（m³）" width="140"></el-table-column>
                <el-table-column prop="sanshekou" label="三舍口（m³）" width="140"></el-table-column>
                <el-table-column prop="jinzewei" label="金泽水厂（m³）" width="140"></el-table-column>
                <el-table-column prop="zongji2" label="总计（m³）" width="140"></el-table-column>
                <el-table-column prop="shengtaishui" label="生态水（m³）" width="140"></el-table-column>
                <el-table-column prop="total" label="总计（m³）" width="140"></el-table-column>
                <el-table-column prop="target" label="生产目标（m³）" width="140"></el-table-column>
              </el-table>
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
  name: 'WaterProduction',
  components: { Widget, TableTemplate },
  data() {
    return {
      tableData: [],
      tableColumns: [
        { prop: 'riqi', label: '日期', width: 100, type: 'date' },
        { prop: 'jinshuizongliang', label: '排水总量（m³）', width: 150, type: 'number' },
        { prop: 'zhishuizongliang', label: '制水总量（m³）', width: 150, type: 'number' },
        
        { 
              label: '1#管网',
              children: [
                { prop: 'zhuchequ', label: '主城区（m³）', width: 140, type: 'number' },
                { prop: 'xiangzhen', label: '乡镇（m³）', width: 140, type: 'number' },
                { prop: 'zongji', label: '总计（m³）', width: 140, type: 'number' }
              ]
            },
            { 
              label: '2#, 3#管网',
              children: [
                { prop: 'jingkaiqu', label: '经开区（m³）', width: 140, type: 'number' },
                { prop: 'linshuigongchang', label: '临空水厂（m³）', width: 140, type: 'number' },
                { prop: 'sanshekou', label: '三舍口（m³）', width: 140, type: 'number' },
                { prop: 'jinzewei', label: '金泽水厂（m³）', width: 140, type: 'number' },
                { prop: 'zongji2', label: '总计（m³）', width: 140, type: 'number' }
              ]
            },
        
        { prop: 'shengtaishui', label: '生态水（m³）', width: 140, type: 'number' },
        { prop: 'total', label: '总计（m³）', width: 140, type: 'number' },
        { prop: 'target', label: '生产目标（m³）', width: 140, type: 'number' }
      ],
      formFields: {
        riqi: new Date().toISOString().slice(0, 10),
        jinshuizongliang: 0,
        zhishuizongliang: 0,
        zhuchequ: 0,
        xiangzhen: 0,
        zongji: 0,
        jingkaiqu: 0,
        linshuigongchang: 0,
        sanshekou: 0,
        jinzewei: 0,
        zongji2: 0,
        shengtaishui: 0,
        total: 0,
        target: 0
      }
    };
  },
  methods: {
    updateTableData(newData) {
      this.tableData = newData;
    },
  }
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';
</style>