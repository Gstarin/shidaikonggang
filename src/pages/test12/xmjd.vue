<template>
    <div>
      <b-breadcrumb>
        <b-breadcrumb-item active>项目管理</b-breadcrumb-item>
      </b-breadcrumb>
      <h1 class="page-title fw-semi-bold">项目管理</h1>
      <b-row>
        <b-col>
          <Widget
            title="<h5>项目<span class='fw-semi-bold'>列表</span></h5>"
            customHeader
            settings
            close
          > 
          <!-- <el-dialog :visible.sync="dialogVisible1" title="工作日志" width="75%">
            <table class="table">
              <thead>  
                <tr>  
                    <th>项目名称</th>  
                    <th>时间</th>  
                    <th>完成进度</th>  
                    <th>负责人</th>  
                    <th>备注</th>  
                    
                </tr>  
              </thead>  
              <tbody>  
                <tr v-for="(item, index) in projects[choice].log" :key="index">  
                    <td><input :model="item.name"></td>  
                    <td><input :model="item.time"></td>  
                    <td><input :model="item.jindu"></td>  
                    <td><input :model="item.person"></td>  
                    <td><input :model="item.beizhu"></td>  
                  
                </tr>  

             </tbody>  
          </table> -->

                          

					      <!-- <span slot="footer" class="dialog-footer">
					        <el-button @click="dialogVisible1 = false">取 消</el-button>
					        <el-button type="primary" @click="add">新增</el-button>
					      </span> -->
					</el-dialog>
            <div>
              <table class="table">
                <thead>
                  <tr>
                    <th class="hidden-sm-down">#</th>
                    <th>序号</th>
                    <th>项目名称</th>
                    <th class="hidden-sm-down">创建日期</th>
                    <th class="hidden-sm-down">项目状态</th>
                    <th class="hidden-sm-down">工作日志</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in projects" :key="row.id" class="table-row">
                    <td><b-form-checkbox v-model="row.selected"></b-form-checkbox></td>
                    <td >
                      {{ row.id+1 }}
                    </td>
                    <td >
                      {{ row.name }}
                    </td>
                    <td>
                      {{ row.date }}
                    </td>
  
                    <td class="text-muted">
                      {{ row.status }}
                    </td>
                    <td class="width-150">
                      <b-button variant="success" class="mr-3" size="sm" @click="edit(row.name)">查看</b-button>
                  
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="clearfix">
              <div class="float-right">
                <b-button variant="default" class="mr-3" size="sm"@click="dialogVisible = true"
                  >新建项目</b-button
                >
                <b-button variant="default" class="mr-3" size="sm"
                @click="deleteSelectedRecords" >删除项目</b-button
                >
              </div>

            <el-dialog :visible.sync="dialogVisible" title="上传信息">
              <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="项目名称">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="创建日期">
                  <el-input v-model="form.date" ></el-input>
                </el-form-item>
              
                <el-form-item label="项目状态">
                  <el-input  v-model="form.status"></el-input>
                </el-form-item>

                

              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
              </span>
        </el-dialog>

              <!-- <p>项目列表</p> -->
            </div>
          </Widget>
        </b-col>
      </b-row>
    </div>
  </template>
  <script>
  import Widget from "@/components/Widget/Widget";
  import axios from '@/utils/axios.js'
  export default {
    name: "xmjd",
    components: { Widget },
    data() {
      return {
        dialogVisible: false,
        // dialogVisible1:false,
        choice:0,
        form: {
            id:"",
            name:"",
            date:"",
            status:"",
            log:[],
            selected: false

      
    },

        projects: [
         
        ],
      };
    },
    mounted() {
      axios.get('/api/data/xmjd').then(response => {
          // console.log('Fetched JSON:', response.data);
          this.projects = response.data
      }).catch(error => {
          console.error('Error fetching JSON:', error);
      });
  },
  beforeDestroy() {
      if (this.projects.length > 0) {
          axios.post('/api/save/xmjd', this.projects, {
              headers: {
                  'Content-Type': 'application/json',
              },
          })
              .then(response => {
                  console.log('市政公司收入表上传成功');
              })
              .catch(error => {
                  console.error('市政公司收入表文件时出错：', error);
              });
      }
  },

    methods: {
        submitForm(){
         

            this.form.id=this.projects.length+1,
            this.projects.push(this.form);
            this.form={
                id:this.projects.length,
            name:"",
            date:"",
            status:"",
            log:[],
            selected: false
            }
            let i=0;
          for(i=0;i<this.projects.length;i++)
        {
          this.projects[i].id=i;
        }
            this.dialogVisible=false;
        },
        // add()
        // {
        //     const newRow={
        //         name:"",
        //         time:"",
        //         jindu:"",
        //         person:"",
        //         beizhu:"",
        //         selected: false
        //     };
        //     this.projects[this.choice].log.push(newRow);
        // },
        deleteSelectedRecords() {
      this.projects = this.projects.filter(item => !item.selected);
      let i=0;
          for(i=0;i<this.projects.length;i++)
        {
          this.projects[i].id=i;
        }
    },

       

      edit(name) {
        // this.dialogVisible1=true,
        // this.choice=id-1;

        this.$router.push({
          path:"/app/test12/xmjd2?name=" + name,
          query: {  
    name: name  
  }  

      })
    
    
    },
      del(id) {},
    },
  };
  </script>
  
  <style lang="scss" scoped>
  @import '../../styles/app';
  .table-row:hover {
    background-color: rgba(26, 26, 56, 0.8);
  }
  </style>
  