<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>财政金融部</b-breadcrumb-item>
      <b-breadcrumb-item active>项目汇总</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">项目财务汇总表</h1>
    <b-row>
      <b-col>
        <Widget title="<h5>项目财务汇总(基于收入支出信息自动生成)</h5>" customHeader settings close>
          <TableTemplate
            ref="tableTemplate"
            :tableData="summaryData"
            :columns="summaryColumns"
            :formFields="formFields"
            :storageKey="'project_summary_management'"
            :showExcelHandler="true"
            @update:tableData="updateTableData"
          />
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import TableTemplate from '@/components/Template/xlsxTable'
import Decimal from 'decimal.js'
import dbInstance from '@/database/db.js'

export default {
  name: 'ProjectSummary',
  components: { Widget, TableTemplate },
  data() {
    return {
      incomeContracts: [],
      expenseContracts: [],
      summaryData: [],
      summaryColumns: [
        { prop: 'xuhao', label: '序号', width: 60 },
        { prop: 'xiangmubianhao', label: '项目编号', width: 120 },
        { prop: 'xiangmumingcheng', label: '项目名称', width: 200 },
        { prop: 'jiafangdanwei', label: '甲方单位', width: 200 },
        { 
          prop: 'yingshou_hanshui', 
          label: '应收总额(含税)', 
          width: 150,
          type: 'highPrecision'
        },
        { 
          prop: 'yishoukuan_hanshui', 
          label: '已收款(含税)', 
          width: 150,
          type: 'highPrecision'
        },
        { 
          prop: 'yingshouyue_hanshui', 
          label: '未收余额(含税)', 
          width: 150,
          type: 'highPrecision'
        },
        { 
          prop: 'chengjianzigongsi', 
          label: '承建子公司', 
          width: 150
        },
        { 
          prop: 'yingfu_hanshui', 
          label: '应付总额(含税)', 
          width: 150,
          type: 'highPrecision'
        },
        { 
          prop: 'yifukuan_hanshui', 
          label: '已付成本(含税)', 
          width: 150,
          type: 'highPrecision'
        },
        { 
          prop: 'yingfuyue_hanshui', 
          label: '未付余额(含税)', 
          width: 150,
          type: 'highPrecision'
        }
      ],
      formFields: {
        xuhao: 0,
        xiangmubianhao: '',
        xiangmumingcheng: '',
        jiafangdanwei: '',
        yingshou_hanshui: 0,
        yishoukuan_hanshui: 0,
        yingshouyue_hanshui: 0,
        chengjianzigongsi: '',
        yingfu_hanshui: 0,
        yifukuan_hanshui: 0,
        yingfuyue_hanshui: 0
      }
    }
  },
  methods: {
    async updateTableData(newData) {
      await this.loadAndSummarizeData()
    },
    
    // 从收入和支出合同页面获取数据并汇总
    async loadAndSummarizeData() {
      try {
        // 从本地存储加载收入合同数据
        const incomeData = await dbInstance.load('income_contract_management')
        // 从本地存储加载支出合同数据
        const expenseData = await dbInstance.load('contract_management')
        
        if ((!incomeData || !Array.isArray(incomeData)) && 
            (!expenseData || !Array.isArray(expenseData))) return
        
        this.incomeContracts = incomeData || []
        this.expenseContracts = expenseData || []
        
        // 按项目编号分组汇总
        const summaryMap = {}
        
        // 处理收入数据
        this.incomeContracts.forEach(contract => {
          const projectId = contract.xiangmubianhao
          
          if (!projectId) return
          
          if (!summaryMap[projectId]) {
            summaryMap[projectId] = {
              xiangmubianhao: projectId,
              xiangmumingcheng: new Set(),
              jiafangdanwei: new Set(),
              yingshou_hanshui: new Decimal(0),
              yishoukuan_hanshui: new Decimal(0),
              yingshouyue_hanshui: new Decimal(0),
              chengjianzigongsi: new Set(),
              yingfu_hanshui: new Decimal(0),
              yifukuan_hanshui: new Decimal(0),
              yingfuyue_hanshui: new Decimal(0)
            }
          }
          
          // 收集所有项目名称和甲方单位
          if (contract.xiangmumingcheng) {
            summaryMap[projectId].xiangmumingcheng.add(contract.xiangmumingcheng)
          }
          if (contract.jiafangdanwei) {
            summaryMap[projectId].jiafangdanwei.add(contract.jiafangdanwei)
          }
          
          // 汇总收入金额
          const hetongzonge = new Decimal(contract.hetongzonge || 0)
          const shoukuanzonge = new Decimal(contract.shoukuanzonge || 0)
          const yingshouyue = new Decimal(contract.yingshouyue_hanshui || 0)
          
          summaryMap[projectId].yingshou_hanshui = summaryMap[projectId].yingshou_hanshui.plus(hetongzonge)
          summaryMap[projectId].yishoukuan_hanshui = summaryMap[projectId].yishoukuan_hanshui.plus(shoukuanzonge)
          summaryMap[projectId].yingshouyue_hanshui = summaryMap[projectId].yingshouyue_hanshui.plus(yingshouyue)
        })
        
        // 处理支出数据
        this.expenseContracts.forEach(contract => {
          const projectId = contract.xiangmubianhao
          
          if (!projectId) return
          
          if (!summaryMap[projectId]) {
            summaryMap[projectId] = {
              xiangmubianhao: projectId,
              xiangmumingcheng: new Set(),
              jiafangdanwei: new Set(),
              yingshou_hanshui: new Decimal(0),
              yishoukuan_hanshui: new Decimal(0),
              yingshouyue_hanshui: new Decimal(0),
              chengjianzigongsi: new Set(),
              yingfu_hanshui: new Decimal(0),
              yifukuan_hanshui: new Decimal(0),
              yingfuyue_hanshui: new Decimal(0)
            }
          }
          
          // 收集所有项目名称和承建子公司
          if (contract.xiangmumingcheng) {
            summaryMap[projectId].xiangmumingcheng.add(contract.xiangmumingcheng)
          }
          if (contract.qianyuezigongsi) {
            summaryMap[projectId].chengjianzigongsi.add(contract.qianyuezigongsi)
          }
          
          // 汇总支出金额
          const hetongzonge = new Decimal(contract.hetongzonge || 0)
          const fukuanzonge = new Decimal(contract.fukuanzonge || 0)
          const weifujine = new Decimal(contract.weifujine_hanshui || 0)
          
          summaryMap[projectId].yingfu_hanshui = summaryMap[projectId].yingfu_hanshui.plus(hetongzonge)
          summaryMap[projectId].yifukuan_hanshui = summaryMap[projectId].yifukuan_hanshui.plus(fukuanzonge)
          summaryMap[projectId].yingfuyue_hanshui = summaryMap[projectId].yingfuyue_hanshui.plus(weifujine)
        })
        
        // 转换为数组并格式化
        this.summaryData = Object.values(summaryMap).map((item, index) => ({
          xuhao: index + 1,
          xiangmubianhao: item.xiangmubianhao,
          xiangmumingcheng: Array.from(item.xiangmumingcheng).join(', '),
          jiafangdanwei: Array.from(item.jiafangdanwei).join(', '),
          yingshou_hanshui: item.yingshou_hanshui.toFixed(2),
          yishoukuan_hanshui: item.yishoukuan_hanshui.toFixed(2),
          yingshouyue_hanshui: item.yingshouyue_hanshui.toFixed(2),
          chengjianzigongsi: Array.from(item.chengjianzigongsi).join(', '),
          yingfu_hanshui: item.yingfu_hanshui.toFixed(2),
          yifukuan_hanshui: item.yifukuan_hanshui.toFixed(2),
          yingfuyue_hanshui: item.yingfuyue_hanshui.toFixed(2)
        }))
        
        // 保存汇总数据到本地存储
        await dbInstance.save('project_summary_management', this.summaryData)
      } catch (error) {
        console.error('加载和汇总数据时出错:', error)
      }
    }
  },
  async created() {
    await this.loadAndSummarizeData()
  }
}
</script>