<template>
    <div>
      <b-breadcrumb>
        <b-breadcrumb-item active>跨境电商产业园项目</b-breadcrumb-item>
      </b-breadcrumb>
      <h1 class="page-title fw-semi-bold">项目管理</h1>
      <!-- <b-button variant="default" class="mr-3" size="sm" @click="dialogVisible = true" style="width: 110px;height: 35px;">增加</b-button> -->
                        <!-- <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="handleExportTable('DisburseTable')">删除</b-button> -->
                            <br>
                            <br>
  
      <el-input 
  placeholder="输入关键字进行过滤"
  v-model="filterText">
  </el-input>
  
  <el-tree id="el_tree"
  class="filter-tree"
  :data="data" 
  :props="defaultProps"
  v-on:node-click="jump" 
  v-on:node-contextmenu="jump2" 
  :filter-node-method="filterNode"
  ref="tree">
  </el-tree>
  
  <el-dialog :visible.sync="dialogVisible" title="新增单位和项目">
  
  
                <el-form ref="form" :model="form" label-width="120px">
            
                  <el-form-item label="相关单位">
                    <el-input type="textarea" v-model="form.text1"></el-input>
                  </el-form-item>
                  <el-form-item label="相关项目">
                    <el-input type="textarea" v-model="form.text2"></el-input>
                  </el-form-item>
  
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="submitForm">确 定</el-button>
                </span>
          </el-dialog>
  
  
    </div>
  </template>
  
  
  <script>
  import Widget from '@/components/Widget/Widget';
    import axios from '@/utils/axios.js'
  export default {
    name: 'xgdw',
    components: { Widget },
    data() {
      
      return {
        form: {
  
        text1: '', // 文字内容
        text2: '' // 文字内容
      },
      project_id:6,
        dialogVisible: false,
        xgdw:" ",
        filterText: '',
        data: [
            {label:"月度入住企业信息表",children:[]},
            {label:"月度入住企业情况统计表",children:[]},
            {label:"月快递数据",children:[]},
            {label:"合作项目",children:[]},
            {label:"收发文",children:[]},
            {label:"月工作汇报",children:[]},
          

        ],
        tableData:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    mounted() {
    //   axios.get('/api/data/xgdw').then(response => {
    //       // console.log('Fetched JSON:', response.data);
    //       this.tableData = response.data;
    //   console.log(this.tableData[1].xiangguandanwei);
  
    //   this.tableData.sort((a, b) =>  a.xiangguandanwei.localeCompare(b.xiangguandanwei, 'zh-Hans-CN'));  
  
    //   let i=0;
    //   for(i=0;i<this.tableData.length;i++)
    //   {
       
    //     if(i===0)
    //     { this.data.push({"label":this.tableData[i].xiangguandanwei,"children":[]});
    //     this.data[this.data.length-1].children.push({"label":this.tableData[i].xiangmumingcheng,"children":[]})
    //     continue;
    //   }
  
   
    //       if(this.tableData[i].xiangguandanwei==this.data[this.data.length-1].label)
    //       {
    //         if(this.data[this.data.length-1].children.length===0||this.tableData[i].xiangmumingcheng!==this.data[this.data.length-1].children[this.data[this.data.length-1].children.length-1].label)
    //         this.data[this.data.length-1].children.push({"label":this.tableData[i].xiangmumingcheng,"children":[]});
    //       }
    //       else{
    //         this.data.push({"label":this.tableData[i].xiangguandanwei,"children":[]});
    //         this.data[this.data.length-1].children.push({"label":this.tableData[i].xiangmumingcheng,"children":[]})
    //       }
  
    //   }}).catch(error => {
    //       console.error('Error fetching JSON:', error);
    //   });
    
    
  
        },
  
  
    
    
  
  beforeDestroy() {
      if (this.tableData.length > 0) {
        //   axios.post('/api/save/xgdw', this.tableData, {
        //       headers: {
        //           'Content-Type': 'application/json',
        //       },
        //   })
        //       .then(response => {
        //           console.log('市政公司收入表上传成功');
        //       })
        //       .catch(error => {
        //           console.error('市政公司收入表文件时出错：', error);
        //       });
      }
  },
  
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
  
    methods: {
      submitForm() {
     
      let newRow = {
  
      "label": this.form.text1,
      "children":[]
      };
  
      newRow.children.push({"label":this.form.text2,"children":[]})
      // 将新行添加到表格数据数组中
      this.data.push(newRow);
     
      // 重置表单
      this.resetForm();
  
      // 关闭对话框
      this.dialogVisible = false;
    },
  
    resetForm() {
      this.form = {
    
      text1: '',
      text2:" "
      }
    },
  
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
    


      upload_pdf(id) {
      var that = this;
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/pdf";
      input.addEventListener("change", function () {
        const formData = new FormData();
        formData.append("pdf", input.files[0]);
        formData.append("projectName", that.project_id);
        formData.append("pdfName", id);
        axios
          .post("/api/save/pdf", formData)
          .then((response) => {
            that.$message({
              message: "PDF上传成功",
              type: "success",
            });
          })
          .catch((error) => {
            console.error("上传 PDF 文件时出错：", error);
          });
      });
      input.click();
    },
    download_pdf(id) {
      var that = this;
      axios
        .get(
          `/api/data/pdf?projectName=${that.project_id}&&pdfName=${id}`
        )
        .then((response) => {
          const url = "http://8.130.106.134:5000/" + response.data;
          window.open(url, "_blank");
        })
        .catch((error) => {
          that.$message({
            message: "PDF暂为上传",
            type: "error",
          });
        });
    },

        jump(a,b,c){
       
        if(!b.isLeaf)
        {
          this.jieduan=a.label;
        }

        if(a.children.length===0) 
     {
      this.weituoshu=a.label;
      this.upload_pdf(a.label); 
     }

      },

      jump2(a,b,c,d){
        
        if(b.children.length===0) 
      {
        this.download_pdf(b.label); 
      }
      },



    },
  
  }
  </script>
  
  
  
  <style>
  /* .table-row:hover {
  background-color: rgba(26, 26, 56, 0.8);
  } */
  
  #el_tree{
    background-color: rgba(26, 26, 56, 0.8);
    
  }
  
  #el_input{
    background-color: rgba(106, 106, 173, 0.8);
    
  }
  
  </style>
  
  