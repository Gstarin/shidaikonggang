<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>财政金融部</b-breadcrumb-item>
      <b-breadcrumb-item active>支出信息</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">支出合同目录</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>支出合同台账</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="contracts"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'contract_management'"
            :customFilter1="filterByProjectNumber"
            :customFilter2="filterBySubsidiary"
            :customFilter3="filterByContractUnit"
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
                @input="handleFilterChange"
              />
            </template>
            
            <!-- 承建子公司过滤器 -->
            <template v-slot:custom-filter2>
              <b-form-select
                v-model="subsidiaryFilter"
                :options="subsidiaryOptions"
                placeholder="按承建子公司过滤"
                class="mr-3 mb-2"
                style="width: 180px;"
                @change="handleFilterChange"
              >
                <template #first>
                  <option :value="null">全部承建子公司</option>
                </template>
              </b-form-select>
            </template>
            
            <!-- 签约单位过滤器 -->
            <template v-slot:custom-filter3>
              <b-form-select
                v-model="contractUnitFilter"
                :options="contractUnitOptions"
                placeholder="按签约单位过滤"
                class="mr-3 mb-2"
                style="width: 180px;"
                @change="handleFilterChange"
              >
                <template #first>
                  <option :value="null">全部签约单位</option>
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
  name: 'ContractManagement',
  components: { Widget, TableTemplate },
  data() {
    return {
      contracts: [],
      projectNumberFilter: '',      // 项目编号过滤条件
      subsidiaryFilter: null,       // 承建子公司过滤条件
      contractUnitFilter: null,     // 签约单位过滤条件
      subsidiaryOptions: [],        // 承建子公司选项
      contractUnitOptions: [],      // 签约单位选项
      tableColumns: [
        { prop: 'xuhao', label: '序号', width: 60},
        { prop: 'xiangmubianhao', label: '项目编号', width: 120 },
        { prop: 'xiangmumingcheng', label: '项目名称', width: 200 },
        { 
          prop: 'qianyuezigongsi', 
          label: '承建子公司', 
          width: 150,
        },
        { prop: 'hetongbianhao', label: '合同编号', width: 150 ,slot:true},
        { prop: 'hetongmingcheng', label: '合同名称', width: 200 },
        { prop: 'qianyuedanwei', label: '签约单位', width: 150 },
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
          type: 'highPrecision',

        },
        { 
          prop: 'shuie', 
          label: '税额', 
          width: 120,
          type: 'highPrecision',
        },
        { 
          prop: 'hetongjine_hanshui', 
          label: '合同金额（含税价）', 
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
          prop: 'fukuanzonge', 
          label: '付款总额', 
          width: 120,
          type: 'highPrecision',
        },
        { 
          prop: 'yifukuanbili', 
          label: '已付款比例', 
          width: 120,
          type: 'variable',
          calculate: (row) => {
            const fukuan = new Decimal(row.fukuanzonge || 0)
            const zonge = new Decimal(row.hetongzonge || 0)
            if (zonge.equals(0)) return '0.00%'
            return fukuan.dividedBy(zonge).times(100).toFixed(2) + '%'
          }
        },
        { 
          prop: 'kaipiaojine', 
          label: '开票金额', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'kaipiaoshuei', 
          label: '开票税额', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'kaipiaozonge', 
          label: '开票总额', 
          width: 120,
          type: 'highPrecision',
        },
        { 
          prop: 'shuilv', 
          label: '税率(%)', 
          width: 100,
          type: 'variable',
          calculate: (row) => {
            const zonge = new Decimal(row.kaipiaoshuei || 0)
            const fukuan = new Decimal(row.kaipiaozonge || 0)
            return zonge.times(100).dividedBy(fukuan).toFixed(2)
          }
        },
        { 
          prop: 'weifujine_hanshui', 
          label: '未付余额(含税)', 
          width: 150,
          type: 'variable',
          calculate: (row) => {
            const zonge = new Decimal(row.hetongzonge || 0)
            const fukuan = new Decimal(row.fukuanzonge || 0)
            return zonge.minus(fukuan).toFixed(2)
          }
        },
        { 
          prop: 'guazhangjine_hanshui', 
          label: '挂账金额(含税)', 
          width: 150,
          type: 'variable',
          calculate: (row) => {
            const zonge = new Decimal(row.kaipiaozonge || 0)
            const kaipiao = new Decimal(row.fukuanzonge || 0)
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
            if (!row.weifujine_hanshui) return '结清'
            return parseFloat(row.weifujine_hanshui||0) <= 0 ? '结清' : '未结清'
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
          type: 'highPrecision',
        },
        { 
          prop: 'shuishouyouhui', 
          label: '收税优惠(%)', 
          width: 120,
          type: 'highPrecision',
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
        qianyuezigongsi: '',
        hetongbianhao: '',
        hetongmingcheng: '',
        qianyuedanwei: '',
        qiandingriqi: '',
        xiangmubianhao: '',
        xiangmumingcheng: '',
        zhuyaoneirong: '',
        hetongjine_buhanshui: 0,
        shuie: 0,
        hetongjine_hanshui: 0,
        buchongjine: 0,
        hetongzonge: 0,
        fukuanjine: 0,
        fukuanzonge: 0,
        yifukuanbili: '0%',
        kaipiaojine: 0,
        kaipiaoshuei: 0,
        kaipiaozonge: 0,
        shuilv: 0,
        weifujine_hanshui: 0,
        guazhangjine_hanshui: 0,
        weikaipiaojine: 0,
        shifoujieqing: '否',
        beizhu: '',
        hetongleixing: '',
        yinshuashuilv: 0,
        shuishouyouhui: '0%',
        yinshuashuie: 0,
        jiaonayinshuashuiqi: ''
      }
    }
  },

  methods: {
    
    updateTableData(newData) {
    this.contracts = newData;
  },
  
    goToDetailPage(row) {
  this.$router.push({ 
    name: 'expense-contract-details', 
    params: { contractId: row.hetongbianhao } 
  })
},
updateTableData(newData) {
      this.contracts = newData;
      // 更新承建子公司和签约单位选项
      this.updateFilterOptions();
    },
    
    // 更新过滤器选项
    updateFilterOptions() {
      const subsidiaries = new Set();
      const contractUnits = new Set();
      
      this.contracts.forEach(contract => {
        if (contract.qianyuezigongsi) {
          subsidiaries.add(contract.qianyuezigongsi);
        }
        if (contract.qianyuedanwei) {
          contractUnits.add(contract.qianyuedanwei);
        }
      });
      
      this.subsidiaryOptions = Array.from(subsidiaries).map(item => ({
        value: item,
        text: item
      }));
      
      this.contractUnitOptions = Array.from(contractUnits).map(item => ({
        value: item,
        text: item
      }));
    },
    
    // 按项目编号过滤
    filterByProjectNumber(item) {
      if (!this.projectNumberFilter) return true;
      return item.xiangmubianhao && 
             item.xiangmubianhao.toLowerCase().includes(this.projectNumberFilter.toLowerCase());
    },
    
    // 按承建子公司过滤
    filterBySubsidiary(item) {
      if (!this.subsidiaryFilter) return true;
      return item.qianyuezigongsi === this.subsidiaryFilter;
    },
    
    // 按签约单位过滤
    filterByContractUnit(item) {
      if (!this.contractUnitFilter) return true;
      return item.qianyuedanwei === this.contractUnitFilter;
    },
    
    // 过滤器变化处理
    handleFilterChange() {
      this.$refs.tableTemplate.clearSearch();
    },
  },
  mounted() {
    // 初始化时加载过滤器选项
    this.updateFilterOptions();
  }
}
</script>
