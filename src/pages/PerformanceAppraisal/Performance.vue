<template>
    <div class="tables-basic">
        <b-breadcrumb>
            <b-breadcrumb-item>绩效考核</b-breadcrumb-item>
            <b-breadcrumb-item active>个人绩效汇总</b-breadcrumb-item>
        </b-breadcrumb>
        <!-- <h2 class="page-title">市政公司支出信息</h2> -->
        <b-row>
            <b-col>
                <Widget title="<h5>个人绩效汇总</h5>" customHeader settings close>
                    <div class="table-header">
                        <b-form-file v-model="file" placeholder="请选择一个Excel文件"
                            style="margin-right: 15px;width: 520px"></b-form-file>
                        <b-button variant="default" class="mr-3" size="sm" @click="parseExcel"
                            style="width: 110px;height: 35px;">解析Excel</b-button>
                        <b-button variant="default" class="mr-3" size="sm"
                            style="width: 110px;height: 35px;" @click="handleExportTable('PerformanceTable1')">下载模板</b-button>
                            <b-button variant="default" class="mr-3" size="sm"
                            style="width: 110px;height: 35px;" @click="handleExportTable('Table')">导出文件</b-button>
                            <b-button variant="default" class="mr-3" size="sm"  @click="submitForm"
                            style="width: 110px;height: 35px;">增加</b-button>
                            <b-button variant="default" class="mr-3" size="sm" 
                            style="width: 110px;height: 35px;" @click="handleDelete">删除</b-button>
                            <b-button variant="default" class="mr-3" size="sm"  @click="sort_score"
                            style="width: 110px;height: 35px;">分数排名</b-button>
                          
                    </div>
                    <div class="table-header">
                        <b-input type="text" v-model="search" style="width: 360px;height: 35px;margin:0 15px;"
                            placeholder="Search..." />
                            <el-select v-model="selectedYear" placeholder="选择年份" style="width: 120px; margin-right: 15px;">
                            <el-option v-for="year in years" :key="year" :label="year === 'all' ? '全部' : year" :value="year"></el-option>
                          </el-select>
                          <el-select v-model="selectedMonth" placeholder="选择月份" style="width: 120px; margin-right: 15px;">
                            <el-option v-for="month in months" :key="month" :label="month === 'all' ? '全部' : month" :value="month"></el-option>
                          </el-select>
                          <b-button variant="default" class="mr-3" size="sm"  @click="save"
                          style="width: 110px;height: 35px;">保存</b-button>
                    </div>

                    <div id="table">
                        <el-table :data="current" style="width: 100%;text-align: center"  id="PerformanceTable" border   @selection-change="handleSelectionChange"  height="650" >
                          <el-table-column prop="date" label="日期" width="180">
                              <template slot-scope="scope">
                                <el-date-picker
                                  v-model="scope.row.date"
                                  type="date"
                                  placeholder="选择日期"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd">
                                </el-date-picker>
                              </template>
                            </el-table-column>
                            <el-table-column type="selection" width="40" fixed></el-table-column>
                            <el-table-column prop="bumen" label="部门/子公司" width="160" fixed>  
    <template slot-scope="scope">  
      <el-input v-model="scope.row.bumen"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="xingming" label="姓名" fixed  width="120">  
    <template slot-scope="scope">  
      <el-input v-model="scope.row.xingming"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="zongfen" label="总分" fixed>  
    <template slot-scope="scope">  
      <!-- <el-input   v-model  ="scope.row.zongfen"></el-input>   -->
      <span>{{ calculateTotal(scope.row).toFixed(2) }}</span>  
    </template>  
  </el-table-column>  
  <el-table-column prop="zongfenNoBonus" label="总分（不含加分项）" fixed>  
  <template slot-scope="scope">  
    <span>{{ calculateTotalNoBonus(scope.row).toFixed(2) }}</span>  
  </template>  
</el-table-column>  
  <el-table-column prop="KPI" label="KPI指标评分" width="120">  
    <template slot-scope="scope">  
      <el-input  type="number"   v-model.number  ="scope.row.KPI"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column   type="number" prop="koufen" label="负责人管理扣分" width="120">  
    <template slot-scope="scope">  
      <el-input   v-model.number  ="scope.row.koufen"></el-input>  
    </template>  
  </el-table-column>  
                            <el-table-column prop="B1" width="180">
                                <template slot="header">
                                    <div>B加分1</div>
                                    <div>受到集团或上级通报表扬</div>
                                    <div>（范围:1-20分）</div>
                                    
                                </template>
                                <template slot-scope="scope">  
      <el-input  type="number"   v-model.number ="scope.row.B1"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B1beizhu" label="B加1备注">
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B1beizhu"></el-input>  
    </template>  

                            </el-table-column>
                            <el-table-column prop="B2" width="200">
                                <template slot="header">
                                    <div>B加分2</div>
                                    <div>除法定工作时间外，从事外业工作时间较长</div>
                                    <div>（范围:1-30分）</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input  type="number"  v-model.number  ="scope.row.B2"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B2beizhu" label="B加2备注">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B2beizhu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B11" width="240">
                                <template slot="header">
                                    <div>B减分1</div>
                                    <div>被通报或批评，所负责工作，进度缓慢或严重影响公司形象</div>
                                    <div>（视具体情况而定）</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   type="number"  v-model.number  ="scope.row.B11"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B11beizhu" label="B减1备注">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B11beizhu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B22" width="180">
                                <template slot="header">
                                    <div>B减分2</div>
                                    <div>因工作发生重大失误，造成一定影响的</div>
                                    <div>（视具体情况而定）</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input  type="number"  v-model.number  ="scope.row.B22"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B22beizhu" label="B减2备注">
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B22beizhu"></el-input>  
    </template>  

                            </el-table-column>
                            <el-table-column prop="B33" width="220">
                                <template slot="header">
                                    <div>B减分3</div>
                                    <div>因个人原因，造成集团经济损失10000元（含）以下，且个人负主要责任的</div>
                                    <div>（出现一次，扣一半绩效）</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   type="number"  v-model.number  ="scope.row.B33"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B33beizhu" label="B减3备注">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B33beizhu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B44" width="220">
                                <template slot="header">
                                    <div>B减分4</div>
                                    <div>因个人原因，造成集团经济损失10000元以上，且个人负主要责任的</div>
                                    <div>（出现一次，扣全部绩效）</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input  type="number"  v-model.number ="scope.row.B44"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B44beizhu" label="B减4备注">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B44beizhu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C1" width="120">
                                <template slot="header">
                                    <div>C通用项1</div>
                                    <div>出勤管理评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input  type="number"  v-model.number  ="scope.row.C1"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="quekacishu" label="缺卡次数">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.quekacishu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C2" width="120">
                                <template slot="header">
                                    <div>C通用项2</div>
                                    <div>员工请假评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input  type="number"  v-model.number ="scope.row.C2"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C2beizhu" label="C2备注">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C2beizhu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C3" width="120">
                                <template slot="header">
                                    <div>C通用项3</div>
                                    <div>日志提交评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input  type="number"  v-model.number ="scope.row.C3"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="rizhiweitijiaocishu" label="日志未提交次数">
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.rizhiweitijiaocishu"></el-input>  
    </template>  

                            </el-table-column>
                            <el-table-column prop="C4" width="120">
                                <template slot="header">
                                    <div>C通用项4</div>
                                    <div>值班管理评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input  type="number"  v-model.number  ="scope.row.C4"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="weizhibancishu" label="未值班次数" width="120">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.weizhibancishu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C5" width="120">
                                <template slot="header">
                                    <div>C通用项5</div>
                                    <div>发现在岗期间做与工作无关的事评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input  type="number"   v-model.number  ="scope.row.C5"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C5beizhu" label="C5备注">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C5beizhu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C6" width="140">
                                <template slot="header">
                                    <div>C通用项6</div>
                                    <div>工作期间脱岗评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input  type="number" v-model.number  ="scope.row.C6"></el-input>  
    </template>  
                            </el-table-column>

                            <el-table-column prop="C6beizhu" label="C6备注">
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C6beizhu"></el-input>  
    </template>  

                            </el-table-column>
                            <el-table-column prop="C7" width="120">
                                <template slot="header">
                                    <div>C通用项7</div>
                                    <div>7S管理评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input  type="number" v-model.number  ="scope.row.C7"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="Skoufen" label="7S扣分">
                                <template slot-scope="scope">  
                                <el-input   v-model  ="scope.row.Skoufen"></el-input>  
                            </template>
 </el-table-column>
                            <el-table-column prop="C8" width="140">
                                <template slot="header">
                                    <div>C通用项8</div>
                                    <div>其他应遵守项评分</div>
                                </template>
                                <template slot-scope="scope">  
                                <el-input  type="number"  v-model.number ="scope.row.C8"></el-input>  
                            </template>
                            </el-table-column>
                            <el-table-column prop="C8beizhu" label="C8备注">

                                <template slot-scope="scope">  
                                <el-input   v-model  ="scope.row.C8beizhu"></el-input>  
                            </template>
                            </el-table-column>
                            <el-table-column prop="D1" width="120">
                                <template slot="header">
                                    <div>D日常考核项1</div>
                                    <div>事假</div>
                                </template>
                                <template slot-scope="scope">  
                                <el-input   v-model  ="scope.row.D1"></el-input>  
                            </template>
                            </el-table-column>
                            <el-table-column prop="D2" width="120">
                                <template slot="header">
                                    <div>D日常考核项2</div>
                                    <div>病假</div>
                                </template>
                                <template slot-scope="scope">  
                                <el-input   v-model  ="scope.row.D2"></el-input>  
                            </template>
                            </el-table-column>
                            <el-table-column prop="qingjiakouchufenshu" label="请假扣除分数" width="120">

                                <template slot-scope="scope">  
                                <el-input   v-model  ="scope.row.qingjiakouchufenshu"></el-input>  
                            </template>
                            </el-table-column>
                        </el-table>




                        <el-table :data="current" style="width: 100%;display: none" id="Table" border   @selection-change="handleSelectionChange"  height="650" >
                          <el-table-column prop="date" label="日期" width="180">
                             
                            </el-table-column>
                            <el-table-column type="selection" width="40" fixed></el-table-column>
                            <el-table-column prop="bumen" label="部门/子公司" width="120" fixed>  
   
  </el-table-column>  
  <el-table-column prop="xingming" label="姓名" fixed  width="120">  
   
  </el-table-column>  
  <el-table-column prop="zongfen" label="总分" fixed>  
    <template slot-scope="scope">  
      <!-- <el-input   v-model  ="scope.row.zongfen"></el-input>   -->
      <span>{{ calculateTotal(scope.row) }}</span>  
    </template>  
  </el-table-column>  
  <el-table-column prop="zongfenNoBonus" label="总分（不含加分项）" fixed>  
  <template slot-scope="scope">  
    <span>{{ calculateTotalNoBonus(scope.row) }}</span>  
  </template>  
</el-table-column>  
  <el-table-column prop="KPI" label="KPI指标评分" width="120">  
     
  </el-table-column>  
  <el-table-column   type="number" prop="koufen" label="负责人管理扣分" width="120">  
     
  </el-table-column>  
                            <el-table-column prop="B1" width="180">
                                <template slot="header">
                                    <div>B加分1</div>
                                    <div>受到集团或上级通报表扬</div>
                                    <div>（范围:1-20分）</div>
                                    
                                </template>
                               
                            </el-table-column>
                            <el-table-column prop="B1beizhu" label="B加1备注">
                               

                            </el-table-column>
                            <el-table-column prop="B2" width="200">
                                <template slot="header">
                                    <div>B加分2</div>
                                    <div>除法定工作时间外，从事外业工作时间较长</div>
                                    <div>（范围:1-30分）</div>
                                </template>
                   
   
                            </el-table-column>
                            <el-table-column prop="B2beizhu" label="B加2备注">

                                
                            </el-table-column>
                            <el-table-column prop="B11" width="240">
                                <template slot="header">
                                    <div>B减分1</div>
                                    <div>被通报或批评，所负责工作，进度缓慢或严重影响公司形象</div>
                                    <div>（视具体情况而定）</div>
                                </template>
                               
                            </el-table-column>
                            <el-table-column prop="B11beizhu" label="B减1备注">

                           
                            </el-table-column>
                            <el-table-column prop="B22" width="180">
                                <template slot="header">
                                    <div>B减分2</div>
                                    <div>因工作发生重大失误，造成一定影响的</div>
                                    <div>（视具体情况而定）</div>
                                </template>
                              
                            </el-table-column>
                            <el-table-column prop="B22beizhu" label="B减2备注">
                                

                            </el-table-column>
                            <el-table-column prop="B33" width="220">
                                <template slot="header">
                                    <div>B减分3</div>
                                    <div>因个人原因，造成集团经济损失10000元（含）以下，且个人负主要责任的</div>
                                    <div>（出现一次，扣一半绩效）</div>
                                </template>
                             
                            </el-table-column>
                            <el-table-column prop="B33beizhu" label="B减3备注">


                            </el-table-column>
                            <el-table-column prop="B44" width="220">
                                <template slot="header">
                                    <div>B减分4</div>
                                    <div>因个人原因，造成集团经济损失10000元以上，且个人负主要责任的</div>
                                    <div>（出现一次，扣全部绩效）</div>
                                </template>
                               
                            </el-table-column>
                            <el-table-column prop="B44beizhu" label="B减4备注">

                               
                            </el-table-column>
                            <el-table-column prop="C1" width="120">
                                <template slot="header">
                                    <div>C通用项1</div>
                                    <div>出勤管理评分</div>
                                </template>
                               
                            </el-table-column>
                            <el-table-column prop="quekacishu" label="缺卡次数">

                               
                            </el-table-column>
                            <el-table-column prop="C2" width="120">
                                <template slot="header">
                                    <div>C通用项2</div>
                                    <div>员工请假评分</div>
                                </template>
                                
                            </el-table-column>
                            <el-table-column prop="C2beizhu" label="C2备注">

                               
                            </el-table-column>
                            <el-table-column prop="C3" width="120">
                                <template slot="header">
                                    <div>C通用项3</div>
                                    <div>日志提交评分</div>
                                </template>
                             
                            </el-table-column>
                            <el-table-column prop="rizhiweitijiaocishu" label="日志未提交次数">
                               

                            </el-table-column>
                            <el-table-column prop="C4" width="120">
                                <template slot="header">
                                    <div>C通用项4</div>
                                    <div>值班管理评分</div>
                                </template>
                               
                            </el-table-column>
                            <el-table-column prop="weizhibancishu" label="未值班次数" width="120">

                             
                            </el-table-column>
                            <el-table-column prop="C5" width="120">
                                <template slot="header">
                                    <div>C通用项5</div>
                                    <div>发现在岗期间做与工作无关的事评分</div>
                                </template>
                               
                            </el-table-column>
                            <el-table-column prop="C5beizhu" label="C5备注">

                              
                            </el-table-column>
                            <el-table-column prop="C6" width="140">
                                <template slot="header">
                                    <div>C通用项6</div>
                                    <div>工作期间脱岗评分</div>
                                </template>
                                
                            </el-table-column>

                            <el-table-column prop="C6beizhu" label="C6备注">
                               

                            </el-table-column>
                            <el-table-column prop="C7" width="120">
                                <template slot="header">
                                    <div>C通用项7</div>
                                    <div>7S管理评分</div>
                                </template>
                              
                            </el-table-column>
                            <el-table-column prop="Skoufen" label="7S扣分">
                               
 </el-table-column>
                            <el-table-column prop="C8" width="140">
                                <template slot="header">
                                    <div>C通用项8</div>
                                    <div>其他应遵守项评分</div>
                                </template>
                                
                            </el-table-column>
                            <el-table-column prop="C8beizhu" label="C8备注">

                               
                            </el-table-column>
                            <el-table-column prop="D1" width="120">
                                <template slot="header">
                                    <div>D日常考核项1</div>
                                    <div>事假</div>
                                </template>
                               
                            </el-table-column>
                            <el-table-column prop="D2" width="120">
                                <template slot="header">
                                    <div>D日常考核项2</div>
                                    <div>病假</div>
                                </template>
                               
                            </el-table-column>
                            <el-table-column prop="qingjiakouchufenshu" label="请假扣除分数" width="120">

                               
                            </el-table-column>
                        </el-table>




                        <el-table  style="display: none;width: 100%" id="PerformanceTable1"@cell-dblclick="handleCellDblclick"  @selection-change="handleSelectionChange">
                            <el-table-column prop="date" label="日期" width="180">
                              <template slot-scope="scope">
                                <el-date-picker
                                  v-model="scope.row.date"
                                  type="date"
                                  placeholder="选择日期"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd">
                                </el-date-picker>
                              </template>
                            </el-table-column>
                            <el-table-column prop="bumen" label="部门/子公司" width="120" fixed>  
    <template slot-scope="scope">  
      <el-input v-model="scope.row.bumen"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="xingming" label="姓名" fixed>  
    <template slot-scope="scope">  
      <el-input v-model="scope.row.xingming"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="zongfen" label="总分" fixed>  
    <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.zongfen"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="zongfenNoBonus" label="总分（不含加分项）" fixed>  
  <template slot-scope="scope">  
    <el-input   v-model  ="scope.row.zongfenNoBonus"></el-input>  
  </template>  
</el-table-column>  
  <el-table-column prop="KPI" label="KPI指标评分" width="120">  
    <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.KPI"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="koufen" label="负责人管理扣分" width="120">  
    <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.koufen"></el-input>  
    </template>  
  </el-table-column>  
                            <el-table-column prop="B1" width="180">
                                <template slot="header">
                                    <div>B加分1</div>
                                    <div>受到集团或上级通报表扬</div>
                                    <div>（范围:1-20分）</div>
                                    
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B1"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B1beizhu" label="B加1备注">
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B1beizhu"></el-input>  
    </template>  

                            </el-table-column>
                            <el-table-column prop="B2" width="200">
                                <template slot="header">
                                    <div>B加分2</div>
                                    <div>除法定工作时间外，从事外业工作时间较长</div>
                                    <div>（范围:1-30分）</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B2"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B2beizhu" label="B加2备注">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B2beizhu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B11" width="240">
                                <template slot="header">
                                    <div>B减分1</div>
                                    <div>被通报或批评，所负责工作，进度缓慢或严重影响公司形象</div>
                                    <div>（视具体情况而定）</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B11"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B11beizhu" label="B减1备注">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B11beizhu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B22" width="180">
                                <template slot="header">
                                    <div>B减分2</div>
                                    <div>因工作发生重大失误，造成一定影响的</div>
                                    <div>（视具体情况而定）</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B22"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B22beizhu" label="B减2备注">
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B22beizhu"></el-input>  
    </template>  

                            </el-table-column>
                            <el-table-column prop="B33" width="220">
                                <template slot="header">
                                    <div>B减分3</div>
                                    <div>因个人原因，造成集团经济损失10000元（含）以下，且个人负主要责任的</div>
                                    <div>（出现一次，扣一半绩效）</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B33"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B33beizhu" label="B减3备注">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B33beizhu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B44" width="220">
                                <template slot="header">
                                    <div>B减分4</div>
                                    <div>因个人原因，造成集团经济损失10000元以上，且个人负主要责任的</div>
                                    <div>（出现一次，扣全部绩效）</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B44"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="B44beizhu" label="B减4备注">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.B44beizhu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C1" width="120">
                                <template slot="header">
                                    <div>C通用项1</div>
                                    <div>出勤管理评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C1"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="quekacishu" label="缺卡次数">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.quekacishu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C2" width="120">
                                <template slot="header">
                                    <div>C通用项2</div>
                                    <div>员工请假评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C2"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C2beizhu" label="C2备注">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C2beizhu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C3" width="120">
                                <template slot="header">
                                    <div>C通用项3</div>
                                    <div>日志提交评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C3"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="rizhiweitijiaocishu" label="日志未提交次数">
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.rizhiweitijiaocishu"></el-input>  
    </template>  

                            </el-table-column>
                            <el-table-column prop="C4" width="120">
                                <template slot="header">
                                    <div>C通用项4</div>
                                    <div>值班管理评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C4"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="weizhibancishu" label="未值班次数" width="120">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.weizhibancishu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C5" width="120">
                                <template slot="header">
                                    <div>C通用项5</div>
                                    <div>发现在岗期间做与工作无关的事评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C5"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C5beizhu" label="C5备注">

                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C5beizhu"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="C6" width="140">
                                <template slot="header">
                                    <div>C通用项6</div>
                                    <div>工作期间脱岗评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C6"></el-input>  
    </template>  
                            </el-table-column>

                            <el-table-column prop="C6beizhu" label="C6备注">
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C6beizhu"></el-input>  
    </template>  

                            </el-table-column>
                            <el-table-column prop="C7" width="120">
                                <template slot="header">
                                    <div>C通用项7</div>
                                    <div>7S管理评分</div>
                                </template>
                                <template slot-scope="scope">  
      <el-input   v-model  ="scope.row.C7"></el-input>  
    </template>  
                            </el-table-column>
                            <el-table-column prop="Skoufen" label="7S扣分">
                                <template slot-scope="scope">  
                                <el-input   v-model  ="scope.row.Skoufen"></el-input>  
                            </template>
 </el-table-column>
                            <el-table-column prop="C8" width="140">
                                <template slot="header">
                                    <div>C通用项8</div>
                                    <div>其他应遵守项评分</div>
                                </template>
                                <template slot-scope="scope">  
                                <el-input   v-model  ="scope.row.C8"></el-input>  
                            </template>
                            </el-table-column>
                            <el-table-column prop="C8beizhu" label="C8备注">

                                <template slot-scope="scope">  
                                <el-input   v-model  ="scope.row.C8beizhu"></el-input>  
                            </template>
                            </el-table-column>
                            <el-table-column prop="D1" width="120">
                                <template slot="header">
                                    <div>D日常考核项1</div>
                                    <div>事假</div>
                                </template>
                                <template slot-scope="scope">  
                                <el-input   v-model  ="scope.row.D1"></el-input>  
                            </template>
                            </el-table-column>
                            <el-table-column prop="D2" width="120">
                                <template slot="header">
                                    <div>D日常考核项2</div>
                                    <div>病假</div>
                                </template>
                                <template slot-scope="scope">  
                                <el-input   v-model  ="scope.row.D2"></el-input>  
                            </template>
                            </el-table-column>
                            <el-table-column prop="qingjiakouchufenshu" label="请假扣除分数" width="120">

                                <template slot-scope="scope">  
                                <el-input   v-model  ="scope.row.qingjiakouchufenshu"></el-input>  
                            </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-dialog  
      title="修改值"  
      :visible.sync="dialogVisible"  
      width="30%"  
      @close="dialogVisible = false"  
    >  
      <el-input v-model="editingValue" placeholder="请输入新值"  @keydown.enter="updateValue"></el-input>  
      <span slot="footer" class="dialog-footer">  
        <el-button @click="dialogVisible = false">取 消</el-button>  
        <el-button type="primary" @click="updateValue">确 定</el-button>  
      </span>  
    </el-dialog>  

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
import Sparklines from '../../components/Sparklines/Sparklines'
import * as XLSX from 'xlsx/xlsx.mjs'
import axios from '@/utils/axios.js'
import {export_excel} from '@/utils/exportExcel.js'

export default {
    name: 'Performance',
    components: { Widget, Sparklines },
    data() {
        return {
            dialogVisible: false,
            editingRow: null,
            editingValue: '',
            editingcolumn: null,
            search: "",
            file: null,
            flag: 0,
            currentPage: 1,
            tableData: [],
            tableData_temp: [],
            multipleSelection: [],
            selectedYear: 'all',
            selectedMonth: 'all',
            years: ['all'],
            months: ['all', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        };
    },
    mounted() {
        var that = this;
        document.addEventListener('keydown', function(event) {  
            if (event.key === 'Enter' && that.dialogVisible == true) {  
                console.log('回车键被按下了');  
                that.updateValue();  
            }  
        });

        axios.get('/api/data/performance').then(response => {
            this.tableData = response.data.map(item => {
                if (item.date && isNaN(new Date(item.date).getTime())) {
                    item.date = null; // 或设置为当前日期：new Date().toISOString().split('T')[0]
                }
                return item;
            });
            console.log(this.tableData);
            this.updateYearOptions();
        }).catch(error => {
            console.error('Error fetching JSON:', error);
        });
    },
    beforeDestroy() {
        axios.post('/api/save/performance', this.tableData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log('上传成功');
            })
            .catch(error => {
                console.error('出错：', error);
            });
    },
    computed: {
        filteredItems() {
            return this.tableData.filter(item => {
                const matchesSearch = this.search === "" || 
                    (item.bumen && String(item.bumen).includes(this.search)) ||
                    (item.xingming && String(item.xingming).includes(this.search));

                const itemDate = new Date(item.date);
                const isValidDate = !isNaN(itemDate.getTime());

                const matchesYear = this.selectedYear === 'all' || 
                    (isValidDate && itemDate.getFullYear() === Number(this.selectedYear));
                const matchesMonth = this.selectedMonth === 'all' || 
                    (isValidDate && itemDate.getMonth() + 1 === Number(this.selectedMonth));

                return matchesSearch && (this.selectedYear === 'all' || matchesYear) && (this.selectedMonth === 'all' || matchesMonth);
            });
        },
        current() {
            const start = (this.currentPage - 1) * 20;
            const end = start + 20;
            return this.filteredItems.slice(start, end);
        },
        rows() {
            return this.filteredItems.length
        },
    },
    methods: {
        save(){
            axios.post('/api/save/performance', this.tableData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log('上传成功');
            })
            .catch(error => {
                console.error('出错：', error);
            });
        },
        updateYearOptions() {
            const years = new Set(this.tableData
                .map(item => {
                    const date = new Date(item.date);
                    return isNaN(date.getTime()) ? null : date.getFullYear();
                })
                .filter(Boolean)
            );
            this.years = ['all', ...Array.from(years).sort()];
        },
        sort_score() {
            this.flag = 1 - this.flag;
            if (this.flag) {
                this.tableData_temp = [...this.tableData];
                this.tableData.sort((a, b) => this.calculateTotalNoBonus(b) - this.calculateTotalNoBonus(a));
                this.tableData.forEach((item, index) => {
                    item.xuhao = index + 1;
                });
            } else {
                this.tableData = this.tableData_temp.slice();
                this.tableData.forEach((item, index) => {
                    item.xuhao = index + 1;
                });
            }
        },
        handleSelectionChange(val) {  
            this.multipleSelection = val;
        },  
        handleDelete() {  
            const set = new Set(this.multipleSelection);  
            this.tableData = this.tableData.filter(item => !set.has(item));  
            this.multipleSelection = [];  
            this.tableData.forEach((item, index) => {
                item.xuhao = index + 1;
            });
            this.updateYearOptions();
        },  
        calculateTotalNoBonus(row) {  
            return (  
                (Number(row.KPI) || 0) -  
                (Number(row.B11) || 0) -  
                (Number(row.B22) || 0) -  
                (Number(row.B33) || 0) -  
                (Number(row.B44) || 0) +  
                (Number(row.C1) || 0) +  
                (Number(row.C2) || 0) +  
                (Number(row.C3) || 0) +  
                (Number(row.C4) || 0) +  
                (Number(row.C5) || 0) +  
                (Number(row.C6) || 0) +  
                (Number(row.C7) || 0) +  
                (Number(row.C8) || 0)
            );
        },
        calculateTotal(row) {  
            return (  
                this.calculateTotalNoBonus(row) +  
                (Number(row.B1) || 0) +
                (Number(row.B2) || 0)
            );
        },  
        submitForm() {
            const newRow = {
                xuhao: this.tableData.length + 1,
                bumen: "",
                xingming: "",
                zongfen: "",
                KPI: "",
                koufen: "",
                date: new Date().toISOString().split('T')[0], // 添加当前日期
                B1: "", B1beizhu: "", B2: "", B2beizhu: "", B11: "", B11beizhu: "", B22: "", B22beizhu: "",
                B33: "", B33beizhu: "", B44: "", B44beizhu: "",
                C1: "", quekacishu: "", C2: "", C2beizhu: "", C3: "", rizhiweitijiaocishu: "", C4: "",
                weizhibancishu: "", C5: "", C5beizhu: "", C6: "", C6beizhu: "", C7: "", Skoufen: "",
                C8: "", C8beizhu: "", D1: "", D2: "", qingjiakouchufenshu: ""
            };
            this.tableData.push(newRow);
            this.updateYearOptions();
        },
        handleCellDblclick(row, column, cell, event) {  
            this.editingRow = row.xuhao;
            this.editingcolumn = column.property;
            this.editingValue = row[column.property];
            this.dialogVisible = true;
        },  
        isNumeric(str) {  
            return !isNaN(parseFloat(str)) && isFinite(str);  
        },  
        updateValue() {  
            if (this.editingRow && this.editingValue !== this.editingRow.value) {  
                if (!this.isNumeric(this.editingValue)) {
                    this.tableData[this.editingRow-1][this.editingcolumn] = this.editingValue;  
                } else {
                    this.tableData[this.editingRow-1][this.editingcolumn] = Number(this.editingValue);  
                }
            }  
            this.dialogVisible = false;
            if (this.editingcolumn === 'date') {
                this.updateYearOptions();
            }
        },  
        handleExportTable(table_id) {
            this.$nextTick(function () {
                export_excel(table_id)
            })
        },
        parsePrice(price) {
            if (price === undefined) {
                return price
            } else {
                price = Number(price)
                const priceStr = price.toFixed(2);
                const formattedPrice = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return formattedPrice;
            }
        },
        handlePictureChange(event, item) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    item.picture = e.target.result;
                    item.isEditing = false;
                };
                reader.readAsDataURL(file);
            }
        },
        toggleEditing(item) {
            console.log(item)
            item.isEditing = true;
        },
        parseExcel() {
        if (this.file) {
            let that = this
            that.tableData = []
            const reader = new FileReader();
            reader.readAsArrayBuffer(this.file);
            reader.onload = function (e) {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const title = ["bumen", "xingming", "zongfen", "zongfenNoBonus", "date","KPI", "koufen",
                    "B1", "B1beizhu", "B2", "B2beizhu", "B11", "B11beizhu", "B22", "B22beizhu",
                    "B33", "B33beizhu", "B44", "B44beizhu",
                    "C1", "quekacishu", "C2", "C2beizhu", "C3", "rizhiweitijiaocishu", "C4",
                    "weizhibancishu", "C5", "C5beizhu", "C6", "C6beizhu", "C7", "7Skoufen",
                    "C8", "C8beizhu", "D1", "D2", "qingjiakouchufenshu", "date"]
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                for (let i = 2; i < jsonData.length; i++) {
                    let obj = {};
                    if (jsonData[i].length == 0) {
                        continue
                    }
                    for (let j = 0; j < jsonData[i].length; j++) {
                        if (title[j] == "zongfen" || title[j] == "zongfenNoBonus") continue;
                        if (title[j] == "date") {
                            // const date = new Date(jsonData[i][j]);
                            // obj[title[j]] = isNaN(date.getTime()) ? null : date;
                            const epoch =  new Date(Date.UTC(1899, 11, 30));  
    const offset = jsonData[i][j] ; // 1904年模式需要额外减去2天，因为Excel错误地将1900年视为闰年  
    obj[title[j]]=new Date(epoch.getTime() + (offset * 24 * 60 * 60 * 1000));  
                        } else {
                            obj[title[j]] = jsonData[i][j];
                        }
                    }
                    obj["isEditing"] = false;
                    that.tableData.push(obj);
                }
                that.updateYearOptions();
            };
        }
        this.tableData.forEach((item, index) => {
            item.xuhao = index + 1;
            console.log(item);
        });
    },

    },
    watch: {
        selectedYear() {
            this.currentPage = 1;
        },
        selectedMonth() {
            this.currentPage = 1;
        }
    }
};
</script>
  
  <style lang="scss" scoped>
  @import '../../styles/app';
  
//   .table-header {
//     width: 100%;
//     display: flex;
//     justify-content: flex-start;
//     margin-bottom: 15px;
//   }
  .table-header {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
    align-items: center;
    // text-align: center
  }
  .table-footer{
    // background-color: red;
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #table {
  
   // background-color: rgb(11, 8, 35);
    // 表格文字间距、颜色
    ::v-deep .cell {
      // padding: 0;
      color: #f8f8fa;
    }
  
    // 表头高度
    ::v-deep .el-table__header th {
      padding: 0;
      text-align: center;
      color:rgb(255, 255, 255) !important;
      height: 50px;
      line-height: 50px;
      background-color: rgb(119, 145, 179) !important;
    }
  
    ::v-deep .el-table__body tr,
    ::v-deep.el-table__body td {
      padding: 0;
      height: 50px;
      line-height: 50px;
      background-color: rgb(1, 10, 55) !important;
    }
  
    ::v-deep .el-table {
       background-color: transparent !important;
      color: #000000 ;
    }
  
    ::v-deep .el-table__expanded-cell {
      background-color: transparent !important;
    }
  
    // 透明背景
    ::v-deep .el-table th,
    ::v-deep .el-table tr,
    ::v-deep .el-table td {
      background-color: transparent;
    }
  
    // 下划线改成黑色
    // ::v-deep .el-table td,
    // ::v-deep .el-table th.is-leaf {
    //   border-bottom: 1px solid #000;
    // }
  
    // ::v-deep .el-table::before {
    //   //去掉最下面的那一条线
    //   height: 0px;
    // }
  
  
  }
  </style>