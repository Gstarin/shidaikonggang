<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>财政金融部</b-breadcrumb-item>
      <b-breadcrumb-item active>收入信息</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">收入合同目录</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>收入合同台账</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="contracts"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'income_contract_management'"
            :customFilter1="filterByProjectNumber"
            :customFilter2="filterByClient"
            @update:tableData="updateTableData"
            @row-click="goToDetailPage"
          >
           <!-- 项目编号过滤器 -->
            <template v-slot:custom-filter1>
              <b-form-input
                v-model="projectNumberFilter"
                placeholder="按项目编号过滤"
                class="mr-3 mb-2"
                style="width: 180px;"
                @change="handleProjectNumberFilterChange"
              />
            </template>
            
            <!-- 甲方单位过滤器 -->
            <template v-slot:custom-filter2>
              <b-form-select
                v-model="clientFilter"
                :options="clientOptions"
                placeholder="按甲方单位过滤"
                class="mr-3 mb-2"
                style="width: 180px;"
                @change="handleClientFilterChange"
              >
                <template #first>
                  <option :value="null">全部甲方单位</option>
                </template>
              </b-form-select>
            </template>
            </TableTemplate>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import TableTemplate from '@/components/Template/xlsxTable'
import Decimal from 'decimal.js'

export default {
  name: 'IncomeContractManagement',
  components: { Widget, TableTemplate },
  data() {
    return {
      contracts: [],
      projectNumberFilter: '', // 项目编号过滤条件
      clientFilter: null,     // 甲方单位过滤条件
      clientOptions: [],      // 甲方单位选项
      tableColumns: [
        { prop: 'xuhao', label: '序号', width: 60 },
        { prop: 'xiangmubianhao', label: '项目编号', width: 120},
        { prop: 'xiangmumingcheng', label: '项目名称', width: 200 },
        { prop: 'jiafangdanwei', label: '甲方单位', width: 150 },
        { prop: 'hetongbianhao', label: '合同编号', width: 150  ,slot: true},
        { prop: 'hetongmingcheng', label: '合同名称', width: 200 },
        { 
          prop: 'qiandingriqi', 
          label: '签订日期', 
          width: 120,
          type: 'date'
        },
        { prop: 'zhuyaoneirong', label: '主要内容', width: 200 },
        { 
          prop: 'hetongjine_buhanshui', 
          label: '合同金额(不含税价)', 
          width: 150,
          type: 'highPrecision'
        },
        { 
          prop: 'shuie', 
          label: '税额', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'hetongjine_hanshui', 
          label: '合同金额(含税价)', 
          type: 'variable',
          calculate: (row) => {
            const buhanshui = new Decimal(row.hetongjine_buhanshui || 0)
            const shuie = new Decimal(row.shuie || 0)
            return buhanshui.plus(shuie).toFixed(2)
          }
        },
        { 
          prop: 'buchongjine', 
          label: '补充金额', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'hetongzonge', 
          label: '合同结算金额', 
          width: 120,
          type: 'variable',
          calculate: (row) => {
            const hanshui = new Decimal(row.hetongjine_hanshui || 0)
            const buchong = new Decimal(row.buchongjine || 0)
            return hanshui.plus(buchong).toFixed(2)
          }
        },
        { 
          prop: 'shoukuanzonge', 
          label: '收款总额', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'yishoukuanbili', 
          label: '已收款比例', 
          width: 120,
          type: 'variable',
          calculate: (row) => {
            const shoukuan = new Decimal(row.shoukuanzonge || 0)
            const zonge = new Decimal(row.hetongzonge || 0)
            if (zonge.equals(0)) return '0.00%'
            return shoukuan.dividedBy(zonge).times(100).toFixed(2) + '%'
          }
        },
        { 
          prop: 'kaipiaojine', 
          label: '开票金额', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'kaipiaoshuie', 
          label: '开票税额', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'kaipiaozonge', 
          label: '开票总额', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'shuilv', 
          label: '税率(%)', 
          width: 100,
          type: 'variable',
          calculate: (row) => {
            const zonge = new Decimal(row.kaipiaozonge || 0)
            const shoukuan = new Decimal(row.kaipiaoshuie || 0)
            return shoukuan.times(100).dividedBy(zonge).toFixed(2)
          }
        },
        { 
          prop: 'yingshouyue_hanshui', 
          label: '应收余额(含税)', 
          width: 150,
          type: 'variable',
          calculate: (row) => {
            const zonge = new Decimal(row.hetongzonge || 0)
            const shoukuan = new Decimal(row.shoukuanzonge || 0)
            return zonge.minus(shoukuan).toFixed(2)
          }
        },
        { 
          prop: 'guazhangjine', 
          label: '挂账金额', 
          width: 120,
          type: 'variable',
          calculate: (row) => {
            const zonge = new Decimal(row.kaipiaozonge || 0)
            const kaipiao = new Decimal(row.shoukuanzonge || 0)
            return zonge.minus(kaipiao).toFixed(2)
          }
        },
        { 
          prop: 'weikaipiaojine', 
          label: '未开票金额', 
          width: 150,
          type: 'variable',
          calculate: (row) => {
            const zonge = new Decimal(row.hetongzonge || 0)
            const kaipiao = new Decimal(row.kaipiaozonge || 0)
            return zonge.minus(kaipiao).toFixed(2)
          }
        },
        { 
          prop: 'shifoujieqing', 
          label: '是否结清', 
          width: 100,
          type: 'variable',
          calculate: (row) => {
            if (!row.yingshouyue_hanshui) return '结清'
            return parseFloat(row.yingshouyue_hanshui||0) <= 0 ? '结清' : '未结清'
          }
        },
        { prop: 'beizhu', label: '备注', width: 200 },
        { 
          prop: 'hetongleixing', 
          label: '合同类型', 
          width: 120
        },
        { 
          prop: 'yinshuashuilv', 
          label: '印花税税率(%)', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'shuishouyouhui', 
          label: '收税优惠(%)', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'yinshuashuie', 
          label: '印花税税额', 
          width: 120,
          type: 'variable',
          calculate: (row) => {
            const buhanshui = new Decimal(row.hetongjine_buhanshui || 0)
            const shuishouyouhui = new Decimal(row.shuishouyouhui || 0).dividedBy(100)
            const yinshuashuilv = new Decimal(row.yinshuashuilv || 0).dividedBy(100)
            
            const tax = buhanshui
              .times(new Decimal(1).minus(shuishouyouhui))
              .times(yinshuashuilv)
            
            return tax.toFixed(2)
          }
        },
        { 
          prop: 'jiaonayinshuashuiqi', 
          label: '缴纳印花税税期', 
          width: 150,
          type: 'date'
        }
      ],
      formFields: {
        xuhao: 0,
        xiangmubianhao: '',
        xiangmumingcheng: '',
        jiafangdanwei: '',
        hetongbianhao: '',
        hetongmingcheng: '',
        qiandingriqi: '',
        zhuyaoneirong: '',
        hetongjine_buhanshui: 0,
        shuie: 0,
        hetongjine_hanshui: 0,
        buchongjine: 0,
        hetongzonge: 0,
        shoukuanzonge: 0,
        yishoukuanbili: '0%',
        kaipiaojine: 0,
        kaipiaoshuie: 0,
        kaipiaozonge: 0,
        shuilv: 0,
        yingshouyue_hanshui: 0,
        guazhangjine: 0,
        weikaipiaojine: 0,
        shifoujieqing: '否',
        beizhu: '',
        hetongleixing: '',
        yinshuashuilv: 0,
        shuishouyouhui: 0,
        yinshuashuie: 0,
        jiaonayinshuashuiqi: ''
      }
    }
  },
  mounted() {
    // 初始化时加载甲方单位选项
    this.updateClientOptions();
  },
  methods: {
    updateTableData(newData) {
    this.contracts = newData;
  },
  
    goToDetailPage(row) {
    this.$router.push({ 
      name: 'contract-payment-details', 
      params: { contractId: row.hetongbianhao } 
    })
  },
  // 更新甲方单位选项
    updateClientOptions() {
      const clients = new Set();
      this.contracts.forEach(contract => {
        if (contract.jiafangdanwei) {
          clients.add(contract.jiafangdanwei);
        }
      });
      this.clientOptions = Array.from(clients).map(client => ({
        value: client,
        text: client
      }));
    },
    
    // 按项目编号过滤
    filterByProjectNumber(item) {
      if (!this.projectNumberFilter) return true;
      return item.xiangmubianhao && 
             item.xiangmubianhao.toLowerCase().includes(this.projectNumberFilter.toLowerCase());
    },
    
    // 按甲方单位过滤
    filterByClient(item) {
      if (!this.clientFilter) return true;
      return item.jiafangdanwei === this.clientFilter;
    },
    
    // 项目编号过滤变化处理
    handleProjectNumberFilterChange() {
      this.$refs.tableTemplate.clearSearch();
    },
    
    // 甲方单位过滤变化处理
    handleClientFilterChange() {
      this.$refs.tableTemplate.clearSearch();
    },
  }
}
</script>