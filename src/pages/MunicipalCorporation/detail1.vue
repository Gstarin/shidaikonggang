<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item to="/expense-contract">财政金融部</b-breadcrumb-item>
      <b-breadcrumb-item>支出信息</b-breadcrumb-item>
      <b-breadcrumb-item active>合同付款详情</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">合同付款详情 - {{ contractInfo.hetongbianhao }} {{ contractInfo.hetongmingcheng }}</h1>
    
    <!-- 顶部信息展示区域 -->
    <b-row class="mb-4">
      <b-col>
        <b-card class="info-card">
          <b-row class="info-row">
            <b-col md="3" class="info-item">
              <div class="info-label">签约单位</div>
              <div class="info-value">{{ contractInfo.qianyuedanwei || '-' }}</div>
            </b-col>
            <b-col md="3" class="info-item">
              <div class="info-label">项目编号</div>
              <div class="info-value">{{ contractInfo.xiangmubianhao || '-' }}</div>
            </b-col>
            <b-col md="3" class="info-item">
              <div class="info-label">项目名称</div>
              <div class="info-value">{{ contractInfo.xiangmumingcheng || '-' }}</div>
            </b-col>
            <b-col md="3" class="info-item">
              <div class="info-label">合同总额</div>
              <div class="info-value">{{ formatCurrency(contractInfo.hetongzonge) || '-' }}</div>
            </b-col>
          </b-row>
          <b-row class="info-row">
            <b-col md="6" class="info-item">
              <div class="info-label">应付余额</div>
              <div class="info-value highlight">{{ formatCurrency(contractInfo.weifujine_hanshui) || '0.00' }}</div>
            </b-col>
            <b-col md="6" class="info-item">
              <div class="info-label">执行情况</div>
              <div class="info-value" :class="{'text-success': isCleared, 'text-warning': !isCleared}">
                {{ contractInfo.shifoujieqing || '未结清' }}
                <span v-if="isCleared" class="cleared-badge">已结清</span>
                <span v-else class="uncleared-badge">未结清</span>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    
    <b-row>
      <b-col>
        <Widget title="<h5>付款明细</h5>" customHeader settings close>
          <TableTemplate
            ref="paymentTable"
            :tableData="paymentDetails"
            :columns="paymentColumns"
            :formFields="paymentFormFields"
            :storageKey="`expense_contract_payments_${contractInfo.hetongbianhao}`"
            @update:tableData="updatePaymentData"
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
  name: 'detail1',
  components: { Widget, TableTemplate },
  data() {
    return {
      contractInfo: {},
      paymentDetails: [],
      paymentColumns: [
        { prop: 'xuhao', label: '序号', width: 60 },
        { 
          prop: 'jizhangriqi', 
          label: '记账日期', 
          width: 120,
          type: 'date'
        },
        { prop: 'zhaiyao', label: '摘要', width: 200 },
        { 
          prop: 'kaipiaojine', 
          label: '开票金额', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'kaipiaoshue', 
          label: '开票税额', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'jiashuiheji', 
          label: '价税合计', 
          width: 120,
          type: 'variable',
          calculate: (row) => {
            const kaipiaojine = new Decimal(row.kaipiaojine || 0)
            const kaipiaoshue = new Decimal(row.kaipiaoshue || 0)
            return kaipiaojine.plus(kaipiaoshue).toFixed(2)
          }
        },
        { 
          prop: 'fukuanjine', 
          label: '付款金额', 
          width: 120,
          type: 'highPrecision'
        },
        { 
          prop: 'shuilv', 
          label: '税率(%)', 
          width: 100,
          type: 'variable',
          calculate: (row) => {
            const kaipiaojine = new Decimal(row.kaipiaojine || 0)
            const kaipiaoshue = new Decimal(row.kaipiaoshue || 0)
            if (kaipiaojine.equals(0)) return '0.00'
            return kaipiaoshue.dividedBy(kaipiaojine).times(100).toFixed(2) + '%'
          }
        },
        { prop: 'pingzhenghao', label: '凭证号', width: 120 },
        { prop: 'beizhu', label: '备注', width: 200 }
      ],
      paymentFormFields: {
        xuhao: 0,
        jizhangriqi: '',
        zhaiyao: '',
        kaipiaojine: 0,
        kaipiaoshue: 0,
        jiashuiheji: 0,
        fukuanjine: 0,
        shuilv: 0,
        pingzhenghao: '',
        beizhu: ''
      }
    }
  },
  computed: {
    isCleared() {
      return this.contractInfo.shifoujieqing === '结清' || 
             parseFloat(this.contractInfo.weifujine_hanshui || 0) <= 0
    }
  },
  async created() {
    await this.loadContractInfo()
    await this.loadPaymentDetails()
    await this.calculateAndUpdateContract()
  },
  methods: {
    formatCurrency(value) {
      if (!value) return '0.00'
      return new Decimal(value).toFixed(2)
    },
    
    async loadContractInfo() {
      try {
        const contractId = this.$route.params.contractId
        const contracts = await dbInstance.load('contract_management')
        const contract = contracts.find(c => c.hetongbianhao === contractId)
        
        if (contract) {
          this.contractInfo = contract
        } else {
          this.$router.push('/expense-contract')
        }
      } catch (error) {
        console.error('加载合同信息失败:', error)
        this.$router.push('/expense-contract')
      }
    },
    
    async loadPaymentDetails() {
      try {
        const storageKey = `expense_contract_payments_${this.contractInfo.hetongbianhao}`
        const details = await dbInstance.load(storageKey)
        
        if (details && Array.isArray(details)) {
          this.paymentDetails = details.map((item, index) => ({
            ...item,
            xuhao: index + 1
          }))
        }
      } catch (error) {
        console.error('加载付款明细失败:', error)
      }
    },
    
    async updatePaymentData(newData) {
      this.paymentDetails = newData
      await this.calculateAndUpdateContract()
    },
    
    async calculateAndUpdateContract() {
      // 计算汇总数据
      const totalFukuan = this.paymentDetails.reduce((sum, item) => {
        return sum.plus(new Decimal(item.fukuanjine || 0))
      }, new Decimal(0))
      
      const totalKaipiao = this.paymentDetails.reduce((sum, item) => {
        return sum.plus(new Decimal(item.kaipiaojine || 0))
      }, new Decimal(0))
      
      const totalShuie = this.paymentDetails.reduce((sum, item) => {
        return sum.plus(new Decimal(item.kaipiaoshue || 0))
      }, new Decimal(0))
      
      const totalJiashui = this.paymentDetails.reduce((sum, item) => {
        return sum.plus(new Decimal(item.jiashuiheji || 0))
      }, new Decimal(0))

      const total1 = new Decimal(this.contractInfo.hetongzonge || 0).minus(totalFukuan)
      
      // 更新合同信息
      const contracts = await dbInstance.load('contract_management')
      const contractIndex = contracts.findIndex(
        c => c.hetongbianhao === this.contractInfo.hetongbianhao
      )
      
      if (contractIndex !== -1) {
        const updatedContract = {
          ...contracts[contractIndex],
          fukuanzonge: totalFukuan.toFixed(2),
          kaipiaojine: totalKaipiao.toFixed(2),
          kaipiaoshuei: totalShuie.toFixed(2),
          kaipiaozonge: totalJiashui.toFixed(2)
        }
        
        // 计算其他衍生字段
        const hetongzonge = new Decimal(updatedContract.hetongzonge || 0)
        const yifukuanbili = hetongzonge.equals(0) 
          ? '0%' 
          : totalFukuan.dividedBy(hetongzonge).times(100).toFixed(2) + '%'
        
        updatedContract.yifukuanbili = yifukuanbili
        updatedContract.weifujine_hanshui = total1.toFixed(2)
        updatedContract.shifoujieqing = parseFloat(updatedContract.weifujine_hanshui) <= 0 ? '结清' : '未结清'
        contracts[contractIndex] = updatedContract
        
        await dbInstance.save('contract_management', contracts)
        
        // 更新本地数据
        this.contractInfo = updatedContract
      }
    },
  },
  async beforeDestroy() {
    await this.calculateAndUpdateContract()
  }
}
</script>

<style scoped>
.page-title {
  margin-bottom: 20px;
}

.info-card {
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.info-row {
  margin-bottom: 10px;
}

.info-item {
  padding: 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item:last-child {
  border-right: none;
}

.info-label {
  font-size: 12px;
  color: #a0a0a0;
  margin-bottom: 5px;
}

.info-value {
  font-size: 16px;
  color: white;
  font-weight: 500;
}

.highlight {
  color: #ffcc00;
  font-weight: bold;
}

.text-success {
  color: #28a745;
}

.text-warning {
  color: #ffc107;
}

.cleared-badge {
  display: inline-block;
  padding: 2px 8px;
  background-color: #28a745;
  color: white;
  border-radius: 10px;
  font-size: 12px;
  margin-left: 8px;
}

.uncleared-badge {
  display: inline-block;
  padding: 2px 8px;
  background-color: #ffc107;
  color: #212529;
  border-radius: 10px;
  font-size: 12px;
  margin-left: 8px;
}
</style>