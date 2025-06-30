<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>绩效考核</b-breadcrumb-item>
      <b-breadcrumb-item active>项目绩效</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>项目绩效</h5>" customHeader settings close>
          <div>
           <div> <span>项目名称：</span>&nbsp;&nbsp;&nbsp;<el-input v-model="addproject" style="width:300px;"></el-input>  &nbsp;&nbsp;&nbsp; <b-button variant="default" class="mr-3" size="sm" style="width: 110px; height: 35px;" @click="addProject">增加</b-button>&nbsp;&nbsp;&nbsp; <b-button variant="default" class="mr-3" size="sm" style="width: 110px; height: 35px;" @click="deleteProject">删除</b-button></div>
           <br>
           <div>  <span>工程名称：</span>&nbsp;&nbsp;&nbsp;<el-input v-model="addconstruction"  style="width:300px;"></el-input> &nbsp;&nbsp;&nbsp;  <b-button variant="default" class="mr-3" size="sm" style="width: 110px; height: 35px;" @click="addConstruction">增加</b-button>&nbsp;&nbsp;&nbsp; <b-button variant="default" class="mr-3" size="sm" style="width: 110px; height: 35px;" @click="deleteConstruction">删除</b-button></div>
           <br>
           <div>  <span>工程细化：</span>&nbsp;&nbsp;&nbsp;<el-input v-model="adddetail"  style="width:300px;"></el-input> &nbsp;&nbsp;&nbsp;  <b-button variant="default" class="mr-3" size="sm" style="width: 110px; height: 35px;" @click="addDetail">增加</b-button>&nbsp;&nbsp;&nbsp; <b-button variant="default" class="mr-3" size="sm" style="width: 110px; height: 35px;" @click="deleteDetail">删除</b-button></div>

          </div>
          <br>
          <div class="filter-section" style="margin-bottom: 20px;">
            <b-form-select v-model="selectedDepartment" :options="departments" @change="onDepartmentChange" placeholder="选择公司部门" />
            <b-form-select v-model="selectedProject" :options="projects" @change="onProjectChange" placeholder="选择项目名称" :disabled="!selectedDepartment" />
            <b-form-select v-model="selectedConstruction" :options="constructions" @change="onConstructionChange" placeholder="选择工程名称" :disabled="!selectedProject" />
            <b-form-select v-model="selectedDetail" :options="details" @change="onPathChange" placeholder="选择工程细化" :disabled="!selectedConstruction" />
          </div>
          <div v-if="selectedDepartment && selectedProject && selectedConstruction && selectedDetail">
            <div class="table-header" style="width: 100%; display: flex; justify-content: center; margin-bottom: 15px;">
              <!-- <b-input type="text" v-model="search" style="width: 360px; height: 35px; margin: 0 15px;" placeholder="Search..." /> -->
              <b-button variant="default" class="mr-3" size="sm" @click="dialogVisible = true" style="width: 110px; height: 35px;">增加</b-button>
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px; height: 35px;" @click="deleteSelected">删除</b-button>
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px; height: 35px;" @click="save">保存</b-button>
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="handleExportTable('PerformanceTable1')">下载模板</b-button>
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="handleExportTable('PerformanceTable')">导出文件</b-button>
            </div>
            <div id="table">
              <el-table ref="table" :data="current" style="width: 100%;" @selection-change="handleSelectionChange" id="PerformanceTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="序号" width="55"></el-table-column>
                <el-table-column prop="project" label="项目" width="100"></el-table-column>
                <el-table-column prop="responsible" label="直接责任人" width="100"></el-table-column>
                <el-table-column prop="construction" label="工程" width="100"></el-table-column>
                <el-table-column prop="detail" label="工程细化" width="100"></el-table-column>
                <el-table-column prop="length" label="全长(米)" width="80">
                  <template slot-scope="scope">
                    <div>{{ scope.row.length }}</div>
                    <div>{{ scope.row.side }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="begin" label="倒排工期表开始时间" width="180"></el-table-column>
                <el-table-column prop="end" label="倒排工期表结束时间" width="180"></el-table-column>
                <el-table-column prop="ontime" label="是否按工期表完成" width="100"></el-table-column>
                <el-table-column prop="date" label="实际完成日期" width="100">
                  <template slot-scope="scope">
                    <div>{{ scope.row.date }}</div>
                    <div>{{ scope.row.sideDate }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="延期天数">
                  <el-table-column prop="overdue" label="超期完成" width="150"></el-table-column>
                  <el-table-column prop="unfinished" label="截至今日未完成" width="150"></el-table-column>
                </el-table-column>
                <el-table-column label="日志信息" width="160">
                  <template slot-scope="scope">
                    <b-button variant="default" class="mr-3" size="sm" @click="showLogDialog(scope.row)" style="width: 110px; height: 35px;">查看</b-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-dialog :visible.sync="dialogVisible" title="上传">
					      <el-form ref="form" :model="form" label-width="140px">
					        <el-form-item label="序号">
					          <el-input v-model="form.id" ></el-input>
					        </el-form-item>
					        <el-form-item label="项目">
					          <el-input v-model="form.xm" ></el-input>
					        </el-form-item>
					        
					        <el-form-item label="直接负责人">
					          <el-input type="input" v-model="form.name"></el-input>
					        </el-form-item>
                            <el-form-item label="工程">
                                <el-input v-model="form.gongcheng" ></el-input>
					        </el-form-item>
                            <el-form-item label="工程细化">
                                <el-input v-model="form.xihua" ></el-input>
					        </el-form-item>
                            <el-form-item label="全长（米）">
                                <el-input v-model="form.length" ></el-input>
					        </el-form-item>
                            <el-form-item label="倒排工期表开始时间">
                                <el-input v-model="form.begin" ></el-input>
					        </el-form-item>
                            <el-form-item label="倒排工期表结束时间">
                                <el-input v-model="form.end" ></el-input>
					        </el-form-item>
                            <el-form-item label="是否按工期表完成">
                                <el-input v-model="form.ontime" ></el-input>
					        </el-form-item>
                            <el-form-item label="实际完成日期">
                                <el-input v-model="form.date" ></el-input>
					        </el-form-item>
                            <el-form-item label="超期完成">
                                <el-input v-model="form.chaoqi" ></el-input>
					        </el-form-item>
                            <el-form-item label="截至至今日未完成">
                                <el-input v-model="form.weiwancheng" ></el-input>
					        </el-form-item>






					      </el-form>
					      <span slot="footer" class="dialog-footer">
					        <el-button @click="dialogVisible = false" >取 消</el-button>
					        <el-button type="primary" @click="submitForm">确 定</el-button>
					      </span>
					</el-dialog>
          


              <el-table ref="table"  :data=[] style="width: 100%;display: none;" @selection-change="handleSelectionChange" id="PerformanceTable1" >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="序号" width="55"></el-table-column>
                <el-table-column prop="project" label="项目" width="100"></el-table-column>
                <el-table-column prop="responsible" label="直接责任人" width="100"></el-table-column>
                <el-table-column prop="construction" label="工程" width="100"></el-table-column>
                <el-table-column prop="detail" label="工程细化" width="100"></el-table-column>
                <el-table-column prop="length" label="全长(米)" width="80">
                  <template slot-scope="scope">
                    <div>{{ scope.row.length }}</div>
                    <div>{{ scope.row.side }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="begin" label="倒排工期表开始时间" width="180"></el-table-column>
                <el-table-column prop="end" label="倒排工期表结束时间" width="180"></el-table-column>
                <el-table-column prop="ontime" label="是否按工期表完成" width="100"></el-table-column>
                <el-table-column prop="date" label="实际完成日期" width="100">
                  <template slot-scope="scope">
                    <div>{{ scope.row.date }}</div>
                    <div>{{ scope.row.sideDate }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="延期天数">
                  <el-table-column prop="overdue" label="超期完成" width="150"></el-table-column>
                  <el-table-column prop="unfinished" label="截至今日未完成" width="150"></el-table-column>
                </el-table-column>
                <el-table-column label="日志信息" width="160">
                  <template slot-scope="scope">
                    <b-button variant="default" class="mr-3" size="sm" @click="showLogDialog(scope.row)" style="width: 110px; height: 35px;">查看</b-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-else>
            <p>请先选择公司部门、项目名称、工程名称和工程细化。</p>
          </div>
          <el-dialog :visible.sync="dialogVisible1" title="日志详情" width="1200px">
            <table border="1">
              <thead>
                <tr>
                  <th>开始时间</th>
                  <th>结束时间</th>
                  <th>完成情况</th>
                  <th>长度（米）</th>
                  <th>完成占比（%）</th>
                  <th>未完成原因</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in selectedLog" :key="index">
                  <td><input v-model="item.begin"></td>
                  <td><input v-model="item.end"></td>
                  <td><input v-model="item.wcqk"></td>
                  <td><input v-model="item.length"></td>
                  <td><input v-model="item.zhanbi"></td>
                  <td><input v-model="item.reason"></td>
                </tr>
              </tbody>
            </table>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible1 = false">取 消</el-button>
              <el-button type="danger" @click="delete1">删除</el-button>
              <el-button type="primary" @click="submitForm1">新增</el-button>
            
            </span>
          </el-dialog>
          <div class="table-footer">
            <!-- <b-pagination v-model="currentPage" :total-rows="rows" size="lg"></b-pagination> -->
          </div>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import {export_excel} from '@/utils/exportExcel.js'
import { construct } from 'core-js/fn/reflect';
import axios from '@/utils/axios.js'

export default {
  name: 'gcxm_',
  components: { Widget },
  data() {
    return {
      path:"",
      dialogVisible: false,
      dialogVisible1: false,
      selectedLog: [],
      form: {
        length: '',
        begin: '',
        end: '',
        ontime: '',
        date: '',
        overdue: '',
        unfinished: '',
      },
      file: null,
      currentPage: 1,
      search: '',
      tableData: [
        {
          id: 1,
          project: '项目A',
          responsible: '负责人A',
          construction: '工程A',
          detail: '细化A',
          length: '100',
          side: '东侧',
          begin: '2023-01-01',
          end: '2023-12-31',
          ontime: '是',
          date: '2023-12-31',
          sideDate: '东侧',
          overdue: '10',
          unfinished: '0',
          log: [
            { begin: '2024-07-08', end: '2024-07-10', wcqk: '已完成', length: 100, zhanbi: 90, reason: '无' },
            { begin: '2024-07-11', end: '2024-07-13', wcqk: '未完成', length: 80, zhanbi: 70, reason: '雨天' }
          ],
        },
        {
          id: 2,
          project: '项目B',
          responsible: '负责人B',
          construction: '工程B',
          detail: '细化B',
          length: '200',
          side: '西侧',
          begin: '2023-02-01',
          end: '2023-11-30',
          ontime: '否',
          date: '2023-11-30',
          sideDate: '西侧',
          overdue: '15',
          unfinished: '5',
          log: [
            { begin: '2024-07-08', end: '2024-07-10', wcqk: '已完成', length: 200, zhanbi: 95, reason: '无' },
            { begin: '2024-07-11', end: '2024-07-13', wcqk: '未完成', length: 180, zhanbi: 85, reason: '设备故障' }
          ],
        },
      ],
      selectedRows: [],
      departments: ['廊坊时代空港市政工程有限公司', '建设统筹部', '时代空港房地产开发有限责任公司','综合管理部','人力资源部','投资发展部','财务金融部','成本管控中心','瑞景园林','青清水务','时代空港物业','博泰酒店','生物质电厂'],
      projects: [],
      constructions: [],
      details: [],
      selectedDepartment: null,
      selectedProject: null,
      selectedConstruction: null,
      selectedDetail: null,
      project:{},
      construct:{},
      detail:{},
        total:[],
      addproject:"",
      addconstruction:"",
      adddetail:""
    };
  },
  mounted() {
    // Fetch table data from API
    axios.get('/api/data/xiangmujx').then(response => {
      this.total = response.data;
      this.project=this.total[0];
      this.construct=this.total[1];
      this.detail=this.total[2]
    }).catch(error => {
      console.error('Error fetching JSON:', error);
    });
  },

  methods: {
    save(){
      axios.post('/api/save/gongchengxm', [this.tableData, this.path], {
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

        this.total=[]
        this.total.push(this.project)
        this.total.push(this.construct)
        this.total.push(this.detail)
        axios.post('/api/save/xiangmujx', this.total, {
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
    submitForm(){
      this.tableData.push(
        {
          id:this.form.id,
          log:[],
          project:this.form.xm,
          responsible:this.form.name,
          construction:this.form.gongcheng,
          detail:this.form.xihua,
          length:this.form.length,
          begin:this.form.begin,
          end:this.form.end,
          ontime:this.form.ontime,
          date:this.form.date,
          overdue:this.form.chaoqi,
          unfinished:this.form.weiwancheng
        }),
        this.form={},
        this.dialogVisible=0
        
      
    },
    onPathChange(){
this.path=this.selectedDepartment+this.selectedProject+this.selectedConstruction+this.selectedDetail;
console.log(this.path)
axios.post('/api/data/gongchengxm',{ iddd: this.path }, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
         console.log('Fetched JSON:', response.data);
         this.tableData = response.data
        if(this.tableData.length==undefined) this.tableData=[] 
        
 
      }).catch(error => {
        console.error('Error fetching JSON:', error);
        // console.log(this.path)
      });

    },
    handleExportTable(table_id) {
            this.$nextTick(function () {
                export_excel(table_id)
            })

        },
        deleteProject()
        {
          if(this.selectedDepartment!=null)
        {
          this.project[this.selectedDepartment].pop();
          this.addproject='';
        }
        else
        this.addproject='';  
        },
        deleteConstruction()
        {
          if(this.selectedProject!=null)
        {
          this.construct[this.selectedProject].pop();
          this.addconstruction='';
        }
        else
        this.addconstruction='';  
        },
        deleteDetail()
        {
          if(this.selectedConstruction!=null)
        {
          this.detail[this.selectedConstruction].pop();
          this.adddetail='';
        }
        else
        this.adddetail='';  
        },
        addProject()
        {
          if(this.selectedDepartment!=null)
        {
          if(this.project[this.selectedDepartment]==undefined)  this.project[this.selectedDepartment]=[]
          this.project[this.selectedDepartment].push(this.addproject);
          this.addproject='';
        } 
        else
        this.addproject='';

        this.projects =this.project[this.selectedDepartment] ;
        },
        addConstruction()
        {
          if(this.selectedProject!=null)
        {
          if(this.construct[this.selectedProject]==undefined)  this.construct[this.selectedProject]=[]
          this.construct[this.selectedProject].push(this.addconstruction);
          this.addconstruction='';
        } 
        else
        this.addconstruction='';

        this.constructions =this.construct[this.selectedProject] ;
        },
        addDetail()
        {
          if(this.selectedConstruction!=null)
        {
          if(this.detail[this.selectedConstruction]==undefined)  this.detail[this.selectedConstruction]=[]
          this.detail[this.selectedConstruction].push(this.adddetail);
          this.adddetail='';
        } 
        else
        this.adddetail='';

        this.details=this.detail[this.selectedConstruction] ;
        },

    onDepartmentChange() {
      this.projects =this.project[this.selectedDepartment] ;
      this.selectedProject = null;
      this.selectedConstruction = null;
      this.selectedDetail = null;
    },
    onProjectChange() {
      this.constructions = this.construct[this.selectedProject];
      this.selectedConstruction = null;
      this.selectedDetail = null;
    },
    onConstructionChange() {
      this.details = this.detail[this.selectedConstruction];
      this.selectedDetail = null;
    },
    deleteSelected() {
      this.tableData = this.tableData.filter(item => !this.selectedRows.includes(item));
      this.selectedRows = [];
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    submitForm1() {
      console.log('日志详情:', this.selectedLog);
      this.selectedLog.push({})
    },

    delete1()
    {
      if(this.selectedLog.length>0)
      this.selectedLog.pop();
    }, 
       showLogDialog(row) {
      this.selectedLog = row.log;
      this.dialogVisible1 = true;
    }
  },
  computed: {
    current() {
      const filterRE = new RegExp(this.search, 'i');
      const filteredData = this.tableData.filter(item => {
        return filterRE.test(item.project) || filterRE.test(item.responsible) || filterRE.test(item.construction) || filterRE.test(item.detail);
      });
      this.rows = filteredData.length;
      const start = (this.currentPage - 1) * 10;
      return filteredData.slice(start, start + 10);
    }
  }
};
</script>







<style lang="scss" scoped>
@import '../../styles/app';
.filter-section {
    display: flex;
    justify-content: space-between;
}
.table-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.table-header {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 15px;
}

.tables-basic {
    padding: 20px;
}

.filter-section {
    display: flex;
    justify-content: space-between;
}

.table-header {
    display: flex;
    justify-content: flex-start;
}

.table-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
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