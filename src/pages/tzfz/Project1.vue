<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>项目管理</b-breadcrumb-item>
      <b-breadcrumb-item active>项目流程图</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">项目流程图</h1>

    <!-- <div class="label">
      <ul>
        <li><span class="legend">不需要：</span><span id="li1">红色</span></li>
        <li><span class="legend">未上传：</span><span id="li2">白色</span></li>
        <li><span class="legend">已上传：</span><span id="li3">绿色</span></li>
      </ul>
    </div> -->
    <div class="upload-hint">
      <i class="el-icon-info"></i> 右键点击项目框上传文件，左键点击下载文件
    </div>
    <div class="flowchart-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-title title-heading">政府投资项目</div>
          <div id="1" class="grid-content bg-white" @click="download_pdf('gov_approval')" @contextmenu.prevent="upload_pdf('gov_approval')">政府批准文件</div>
          <div id="2" class="grid-content bg-white" @click="download_pdf('authorization')" @contextmenu.prevent="upload_pdf('authorization')">授权委托书</div>
          <div id="3" class="grid-content bg-white" @click="download_pdf('management_agreement')" @contextmenu.prevent="upload_pdf('management_agreement')">委托管理协议</div>
          <el-row :gutter="20">
            <el-col :span="8">
              <div id="4" class="grid-content bg-white" @click="download_pdf('proposal')" @contextmenu.prevent="upload_pdf('proposal')">项目建议书</div>
            </el-col>
            <el-col :span="8" :offset="8">
              <div id="5" class="grid-content bg-red" @click="download_pdf('land_preliminary_review')" @contextmenu.prevent="upload_pdf('land_preliminary_review')">建设项目用地预审与选址意见书</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="16">
              <div id="6" class="grid-content bg-red" @click="download_pdf('land_allocation_decision')" @contextmenu.prevent="upload_pdf('land_allocation_decision')">不动产权证</div>
            </el-col>
          </el-row>
          <div id="7" class="grid-content bg-white" @click="download_pdf('proposal_review')" @contextmenu.prevent="upload_pdf('proposal_review')">项目建议书批复</div>
          <div id="8" class="grid-content bg-yellow" @click="download_pdf('social_stability')" @contextmenu.prevent="upload_pdf('social_stability')">社会稳定风险分析报告及论证</div>
          <div id="9" class="grid-content bg-white" @click="download_pdf('feasibility_report')" @contextmenu.prevent="upload_pdf('feasibility_report')">可行性研究报告</div>
          <div id="10" class="grid-content bg-white" @click="download_pdf('feasibility_review')" @contextmenu.prevent="upload_pdf('feasibility_review')">可行性研究报告批复</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <div id="11" class="grid-content bg-white" @click="download_pdf('environmental_impact')" @contextmenu.prevent="upload_pdf('environmental_impact')">环境影响报告</div>
              <div id="12" class="grid-content bg-white" @click="download_pdf('environmental_impact_review')" @contextmenu.prevent="upload_pdf('environmental_impact_review')">环境影响报告批复</div>
            </el-col>
            <el-col :span="12">
              <div id="13" class="grid-content bg-white" @click="download_pdf('safety_evaluation')" @contextmenu.prevent="upload_pdf('safety_evaluation')">安全预评价报告</div>
              <div id="14" class="grid-content bg-white" @click="download_pdf('safety_evaluation_explanation')" @contextmenu.prevent="upload_pdf('safety_evaluation_explanation')">安全预评价报告说明</div>
            </el-col>
          </el-row>
        </el-col>

<el-col :span="12">
  <div class="grid-title title-heading">企业投资项目</div>
  <el-row :gutter="20">
    <el-col :span="12">
      <div id=101 class="grid-content bg-white">企业备案项目</div>
      <div id="15" class="grid-content bg-white" @click="download_pdf('group_approval')" @contextmenu.prevent="upload_pdf('group_approval')">集团批准文件</div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div id="16" class="grid-content bg-yellow" @click="download_pdf('project_intro')" @contextmenu.prevent="upload_pdf('project_intro')">项目简介</div>
        </el-col>
        <el-col :span="8" :offset="8">
          <div id="17" class="grid-content bg-red" @click="download_pdf('land_auction')" @contextmenu.prevent="upload_pdf('land_auction')">土地招拍挂，签订土地出让合同</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8" :offset="16">
          <div id="18" class="grid-content bg-red" @click="download_pdf('property_right')" @contextmenu.prevent="upload_pdf('property_right')">不动产权证</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div id="19" class="grid-content bg-yellow" @click="download_pdf('social_stability_eval')" @contextmenu.prevent="upload_pdf('social_stability_eval')">社会稳定风险评估分析报告及论证</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div id="20" class="grid-content bg-yellow" @click="download_pdf('enterprise_filing')" @contextmenu.prevent="upload_pdf('enterprise_filing')">企业投资项目备案信息</div>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="12">
      <div id=102 class="grid-content bg-white">企业核准项目</div>
      <div id="21" class="grid-content bg-white" @click="download_pdf('group_approval')" @contextmenu.prevent="upload_pdf('group_approval')">集团批准文件</div>
      <el-row :gutter="10">
        <el-col :span="8">
          <div id="22" class="grid-content bg-yellow" @click="download_pdf('project_intro')" @contextmenu.prevent="upload_pdf('project_intro')">项目申请报告</div>
        </el-col>
        <el-col :span="8" :offset="8">
          <div id="23" class="grid-content bg-red" @click="download_pdf('land_auction')" @contextmenu.prevent="upload_pdf('land_auction')">土地招拍挂，签订土地出让合同</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8" :offset="16">
          <div id="24" class="grid-content bg-red" @click="download_pdf('property_right')" @contextmenu.prevent="upload_pdf('property_right')">不动产权证</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="103">
          <div id="25" class="grid-content bg-yellow" @click="download_pdf('social_stability_eval')" @contextmenu.prevent="upload_pdf('social_stability_eval')">规划方案审查</div>
        </el-col>
        <el-col :span="24">
          <div id="26" class="grid-content bg-yellow" @click="download_pdf('social_stability_eval')" @contextmenu.prevent="upload_pdf('social_stability_eval')">社会稳定风险评估分析报告及论证</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div id="27" class="grid-content bg-yellow" @click="download_pdf('enterprise_filing')" @contextmenu.prevent="upload_pdf('enterprise_filing')">核准批复</div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</el-col>
      </el-row>
      <el-dialog
      title="文件上传中"
      :visible.sync="uploadDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-progress :percentage="uploadPercentage"></el-progress>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpload">取消上传</el-button>
      </span>
    </el-dialog>
    <input 
  type="file" 
  ref="fileInput" 
  style="display: none" 
  @change="onFileChange"
>
    </div>
  </div>
</template>

<script>
import LeaderLine from "leader-line";
import axios from '@/utils/axios.js';

export default {
  name: "Project",
  data() {
    return {
      project_id: 0,
      idd:"",
      lines: [
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [4, 7],
        [7, 8],
        [8, 9],
        [9, 10],
        [10, 11],
        [10, 13],
        [11, 12],
        [13, 14],
        [101,15],
        [102,21],
        [21,22],
        [22,23],
        [23,24],
        [22,25],
        [25,26],
        [26,27],
        [15, 16],
        [16, 17],
        [17, 18],
        [16, 19],
        [19, 20],
      ],
      linePositions: { 
        4: {
          5: { startSocket: "right", endSocket: "left" }, // 4到5的方向
        },
        16: {
          17: { startSocket: "right", endSocket: "left" } // 16到17的方向
        },
        22: {
          23: { startSocket: "right", endSocket: "left" } // 16到17的方向
        },
      },
      line_lists: [],
      // 新增的上传相关数据
      uploadDialogVisible: false,
      uploadPercentage: 0,
      allowedFileTypes: [
        'application/pdf', 
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png'
      ],
      maxFileSize: 200 * 1024 * 1024 // 200MB
    };
  },
  mounted() {
    this.idd = this.$route.query.hetong;
    console.log(this.idd);
    // 确保在 DOM 元素加载完成之后执行
    this.$nextTick(() => {
      setTimeout(() => {
        this.createLines();
      }, 500);
    });
  },
  methods: {
  createLines() {
    let lineStyle = { color: "white", path: "straight" };

    for (let i = 0; i < this.lines.length; i++) {
      const startId = this.lines[i][0];
      const endId = this.lines[i][1];

      const startElement = document.getElementById(startId.toString());
      const endElement = document.getElementById(endId.toString());

      if (startElement && endElement) {
        // 获取特定的连接方向配置
        let startSocket = "bottom"; 
        let endSocket = "top";      
        if (this.linePositions[startId] && this.linePositions[startId][endId]) {
          const specificPosition = this.linePositions[startId][endId];
          startSocket = specificPosition.startSocket || startSocket;
          endSocket = specificPosition.endSocket || endSocket;
        }

        this.line_lists.push(
          new LeaderLine(
            startElement,
            endElement,
            {
              startSocket: startSocket,
              endSocket: endSocket,
              ...lineStyle
            }
          )
        );
      } else {
        console.error(`无法找到元素：${startId} 或 ${endId}`);
      }
    }
  },
  async upload_pdf(id) {
      const that = this;
      const input = document.createElement("input");
      input.type = "file";
      input.accept = this.allowedFileTypes.join(",");
      
      input.addEventListener("change", async function() {
        const file = input.files[0];
        that.currentUploadFile = {
          name: file.name,
          size: file.size
        };
        
        // 检查文件大小
        if (file.size > that.maxFileSize) {
          that.$message.error(`文件大小不能超过${that.formatFileSize(that.maxFileSize)}`);
          return;
        }
        // 准备上传
        that.uploadPercentage = 0;
        that.uploadStatus = null;
        that.uploadDialogVisible = true;
        
        const formData = new FormData();
        formData.append("file", file);
        try {
          const response = await axios.post("/api/uploads", formData, {
            onUploadProgress: progressEvent => {
              that.uploadPercentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            },
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          // 上传成功
          that.uploadStatus = "success";
          that.$message.success("文件上传成功");
          
          // 保存文件关联信息到后端
          await that.saveFileInfo(id, response.data);
          
        } catch (error) {
          if (!axios.isCancel(error)) {
            that.uploadStatus = "exception";
            that.$message.error("文件上传失败: ");
          }
        } finally {
          setTimeout(() => {
            that.uploadDialogVisible = false;
          }, 1500);
        }
      });
      
      input.click();
    },
    
    // 保存文件信息到后端
    async saveFileInfo(id, fileData) {
      try {
        const fileInfo = {
          projectId: this.project_id,
          documentId: id + this.idd,
          fileName: fileData.filename,
          originalName: fileData.originalname,
          filePath: fileData.path,
          fileUrl: fileData.url,
          uploadTime: new Date().toISOString()
        };
        
        await axios.post("/api/save-data", {
          comfrom: "file_records",
          filename: `${id}_${this.idd}.json`,
          data: JSON.stringify(fileInfo)
        });
      } catch (error) {
        console.error("保存文件信息失败:", error);
      }
    },
    
    // 取消上传
    cancelUpload() {
      this.uploadDialogVisible = false;
      this.$message.info("上传已取消");
    },
    
    // 下载文件方法
    async download_pdf(id) {
      try {
        // 1. 首先获取文件信息
        const response = await axios.get("/api/load-data", {
          params: {
            comfrom: "file_records",
            filename: `${id}_${this.idd}.json`
          }
        });
        
        if (!response.data) {
          throw new Error("文件未上传");
        }
        
        const fileInfo = response.data;
        
        // 2. 使用后端下载接口
        const downloadUrl = `${process.env.VUE_APP_API_BASE_URL}/uploads/${encodeURIComponent(fileInfo.fileName)}`;
        console.error(downloadUrl);
        window.open(downloadUrl, '_blank');
        
      } catch (error) {
        console.error("下载文件失败:", error);
        this.$message({
          message: error.message || "文件下载失败",
          type: "error",
          duration: 3000
        });
      }
    },
    
    // 删除文件方法
    async deleteFile(filePath) {
      try {
        await axios.delete("/api/delete", {
          data: {
            filename: path.basename(filePath),
            path: filePath
          }
        });
        this.$message.success("文件删除成功");
      } catch (error) {
        console.error("删除文件失败:", error);
        this.$message.error("文件删除失败: " + error.message);
      }
    },
   
},
async created() {
    this.idd = this.$route.query.hetong;
    console.log(this.idd);
    try {
      const response = await axios.get("/api/load-data", {
        params: { comfrom: "project_flow", filename: `${this.idd}.json` }
      });
      if (response.data) {
        Object.assign(this.$data, response.data);
      }
    } catch (error) {
      console.log("加载保存数据失败，使用默认数据");
    }
    this.$nextTick(() => this.createLines());
  },
  beforeDestroy() {
    // 移除线条
    for (let line of this.line_lists) {
      line.remove();
    }
    // 自动保存数据
    axios.post("/api/save-data", {
      comfrom: "project_flow",
      filename: `${this.idd}.json`,
      data: JSON.stringify(this.$data)
    }).catch(error => {
      console.error("自动保存失败:", error);
    });
  },

  
  };
</script>


<style scoped>
body {
  background-color: #34495e; 
}

.label {
  width: auto;
  max-width: 400px;
  padding: 15px;
  margin: 0 auto 20px auto; 
  background-color: #2c3e5082;
  border-radius: 8px;
  /*border: 1px solid #1abc9c;*/
  color: white;
  text-align: left;
}

.label ul li {
  font-weight: 700;
  color: white;
}

#li1 {
  color: #e74c3c;
}

#li2 {
  color: #ecf0f1;
}

#li3 {
  color: #2ecc71;
}

.flowchart-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #2c3e50;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
}

.grid-title {
  background-color: #34495e; /* Darker background for titles */
  color: #ecf0f1; /* Light color for readability */
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}
.grid-title.title-heading {
  background-color:#2c3e50;
  color: #ffffff;
  font-size: 22px; 
  font-weight: bold; 
  text-align: center;
  padding: 10px;
  border-radius: 8px; 
  margin-bottom: 10px;
}
.grid-content {
  border-radius: 8px;
  min-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  color: #34495e;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 65px;
  padding: 15px;
  background-color: #ecf0f1;
  transition: background-color 0.3s, transform 0.3s;
}

.grid-content:hover {
  background-color: #dcdde1;
  transform: scale(1.02);
}

.grid-content.bg-yellow {
  background-color: #f39c12;
}

.grid-content.bg-red {
  background-color: #e57063;
}

.grid-content.bg-white {
  background-color: #ecf0f1;
}
</style>
