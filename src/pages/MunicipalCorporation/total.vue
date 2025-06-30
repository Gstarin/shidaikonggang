<template>
    <div class="tables-basic">
        <b-breadcrumb>
            <b-breadcrumb-item>市政公司</b-breadcrumb-item>
            <b-breadcrumb-item active>收支汇总表</b-breadcrumb-item>
        </b-breadcrumb>
        <b-row>
            <b-col>
                <Widget title="<h5>市政公司项目收支情况统计表</h5>" customHeader settings close>
                    <div class="table-header">
                        <!-- 搜索框 -->
                        <b-input v-model="search" placeholder="搜索相关单位、项目名称" style="width: 280px; margin-right: 15px;"></b-input>
                        <b-button variant="default" class="mr-3" size="sm" @click="handleExportTable('DisburseTable1')">导出Excel</b-button>
                        <b-form-select v-model="selectedUnit" :options="units" class="mr-3 mb-2 select-small" placeholder="选择子公司" @input="handleSelectChange"></b-form-select>
                    </div>
                    <div id="table">
                        <el-table :data="current" style="width: 100%" id="DisburseTable" height="500">
                              <el-table-column prop="xiangmumingcheng" label="项目名称" width="200"></el-table-column>
                            <el-table-column prop="xiangguandanwei" label="建设单位" width="150"></el-table-column>
                            <el-table-column prop="yingshoukuan" label="应收款" width="150">
                              <template slot="header">
                                <span>应收款<br/>(万元)</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="shishoukuan" label="实收款" width="100">
                              <template slot="header">
                                <span>实收款<br/>(万元)</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="yingshouweishou" label="应收未收" width="100">
                              <template slot="header">
                                <span>应收未收<br/>(万元)</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="yingfukuan" label="应付款" width="100">
                              <template slot="header">
                                <span>应付款<br/>(万元)</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="shifukuan" label="实付款" width="100">
                              <template slot="header">
                                <span>实付款<br/>(万元)</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="yingfuweifu" label="应付未付" width="100">
                              <template slot="header">
                                <span>应付未付<br/>(万元)</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="beizhu" label="备注" width="200"></el-table-column>
                        </el-table>
                        <el-table :data=[]  style=" display: none;width: 100%" id="DisburseTable1" height="500">
                              <el-table-column prop="xiangmumingcheng" label="项目名称" width="200"></el-table-column>
                            <el-table-column prop="xiangguandanwei" label="建设单位" width="150"></el-table-column>
                            <el-table-column prop="yingshoukuan" label="应收款" width="150">
                              <template slot="header">
                                <span>应收款<br/>(万元)</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="shishoukuan" label="实收款" width="100">
                              <template slot="header">
                                <span>实收款<br/>(万元)</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="yingshouweishou" label="应收未收" width="100">
                              <template slot="header">
                                <span>应收未收<br/>(万元)</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="yingfukuan" label="应付款" width="100">
                              <template slot="header">
                                <span>应付款<br/>(万元)</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="shifukuan" label="实付款" width="100">
                              <template slot="header">
                                <span>实付款<br/>(万元)</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="yingfuweifu" label="应付未付" width="100">
                              <template slot="header">
                                <span>应付未付<br/>(万元)</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="beizhu" label="备注" width="200"></el-table-column>
                        </el-table>
                    </div>
                    <div class="table-footer">
                        <b-pagination v-model="currentPage" :total-rows="rows" size="lg"></b-pagination>
                    </div>
                </Widget>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import {export_excel} from '@/utils/exportExcel.js';
import { getData } from '@/utils/dataStorage';

export default {
    name: 'Total',
    components: { Widget },
    data() {
        return {
            search: "",
            selectedUnit: "",
            units: ["全部", "市政公司", "博泰酒店", "房地产", "时代空港", "青清水务", "瑞景园林", "首钢",  "物业公司"],
            currentPage: 1,
            tableData: [],
            refreshInterval: null
        };
    },
    mounted() {
        this.fetchData();
        // 添加定时刷新
        this.refreshInterval = setInterval(() => {
            this.fetchData();
        }, 300000); // 每5分钟刷新一次
    },
    beforeDestroy() {
        // 清除定时器
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    },
    methods: {
        async fetchData() {
            try {
                // 获取收入明细数据
                const incomeDetailData = await getData('income_detail') || [];
                
                // 获取支出明细数据
                const disburseDetailData = await getData('disburse_detail') || [];
                
                // 合并和处理明细数据
                this.mergeDetailData(incomeDetailData, disburseDetailData);
            } catch (error) {
                console.error('获取数据失败:', error);
                this.$message.error('获取数据失败');
            }
        },
        
        mergeDetailData(incomeDetailData, disburseDetailData) {
            const mergedData = new Map();
            
            // 处理收入明细数据
            incomeDetailData.forEach(detail => {
                const key = `${detail.xiangmumingcheng}-${detail.xiangguandanwei}`;
                if (!mergedData.has(key)) {
                    mergedData.set(key, {
                        xiangmumingcheng: detail.xiangmumingcheng,
                        xiangguandanwei: detail.xiangguandanwei,
                        yingshoukuan: 0,
                        shishoukuan: 0,
                        yingshouweishou: 0,
                        yingfukuan: 0,
                        shifukuan: 0,
                        yingfuweifu: 0,
                        beizhu: ''
                    });
                }
                
                const current = mergedData.get(key);
                // 累加收入相关金额
                if (detail.kaipiaojinehanshui) {
                    current.yingshoukuan += Number(detail.kaipiaojinehanshui) || 0;
                }
                if (detail.shoukuanjine) {
                    current.shishoukuan += Number(detail.shoukuanjine) || 0;
                }
                current.yingshouweishou = current.yingshoukuan - current.shishoukuan;
                
                // 更新备注
                if (detail.beizhu && detail.beizhu !== current.beizhu) {
                    current.beizhu = current.beizhu ? `${current.beizhu}; ${detail.beizhu}` : detail.beizhu;
                }
            });
            
            // 处理支出明细数据
            disburseDetailData.forEach(detail => {
                const key = `${detail.xiangmumingcheng}-${detail.xiangguandanwei}`;
                if (!mergedData.has(key)) {
                    mergedData.set(key, {
                        xiangmumingcheng: detail.xiangmumingcheng,
                        xiangguandanwei: detail.xiangguandanwei,
                        yingshoukuan: 0,
                        shishoukuan: 0,
                        yingshouweishou: 0,
                        yingfukuan: 0,
                        shifukuan: 0,
                        yingfuweifu: 0,
                        beizhu: ''
                    });
                }
                
                const current = mergedData.get(key);
                // 累加支出相关金额
                if (detail.kaipiaojinehanshui) {
                    current.yingfukuan += Number(detail.kaipiaojinehanshui) || 0;
                }
                if (detail.shoukuanjine) {
                    current.shifukuan += Number(detail.shoukuanjine) || 0;
                }
                current.yingfuweifu = current.yingfukuan - current.shifukuan;
                
                // 更新备注
                if (detail.beizhu && detail.beizhu !== current.beizhu) {
                    current.beizhu = current.beizhu ? `${current.beizhu}; ${detail.beizhu}` : detail.beizhu;
                }
            });
            
            this.tableData = Array.from(mergedData.values());
        },

        handleSelectChange() {
            this.fetchData();
        },

        handleExportTable(table_id) {
            this.$nextTick(() => {
                export_excel(table_id);
            });
        }
    },
    computed: {
        filteredItems() {
            if (!this.tableData) return [];
            
            return this.tableData.filter(item => {
                const matchesSearch = !this.search || 
                    (item.xiangguandanwei && item.xiangguandanwei.includes(this.search)) ||
                    (item.xiangmumingcheng && item.xiangmumingcheng.includes(this.search));
                
                const matchesUnit = !this.selectedUnit || this.selectedUnit === "全部" || 
                    item.xiangguandanwei === this.selectedUnit;
                
                return matchesSearch && matchesUnit;
            });
        },
        current() {
            const start = (this.currentPage - 1) * 20;
            const end = start + 20;
            return this.filteredItems.slice(start, end);
        },
        rows() {
            return this.filteredItems.length;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.table-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  margin-bottom: 15px;
}

.table-footer {
  margin-top: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#table{
  color:rgb(255, 255, 255) !important;
  font-weight: 600;
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

.select-small {
  max-width: 180px;
}
</style>
