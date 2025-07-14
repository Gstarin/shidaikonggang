<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>项目管理</b-breadcrumb-item>
      <b-breadcrumb-item active>项目流程图</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">项目流程图</h1>

    <div class="upload-hint">
      <i class="el-icon-info"></i> 右键点击项目框上传文件，左键点击下载文件
    </div>
    <div class="flowchart-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-title title-heading">政府投资项目</div>
          <div id="1" class="grid-content bg-white" @click="download_pdf('gov_approval')" @contextmenu.prevent="upload_pdf('gov_approval')">
            政府批准文件
            <div class="file-status" :class="{'has-file': hasFile('gov_approval')}">
              {{ getFileName('gov_approval') || '未上传' }}
            </div>
          </div>
          <div id="2" class="grid-content bg-white" @click="download_pdf('authorization')" @contextmenu.prevent="upload_pdf('authorization')">
            授权委托书
            <div class="file-status" :class="{'has-file': hasFile('authorization')}">
              {{ getFileName('authorization') || '未上传' }}
            </div>
          </div>
          <div id="3" class="grid-content bg-white" @click="download_pdf('management_agreement')" @contextmenu.prevent="upload_pdf('management_agreement')">
            委托管理协议
            <div class="file-status" :class="{'has-file': hasFile('management_agreement')}">
              {{ getFileName('management_agreement') || '未上传' }}
            </div>
          </div>
          <el-row :gutter="20">
            <el-col :span="8">
              <div id="4" class="grid-content bg-white" @click="download_pdf('proposal')" @contextmenu.prevent="upload_pdf('proposal')">
                项目建议书
                <div class="file-status" :class="{'has-file': hasFile('proposal')}">
                  {{ getFileName('proposal') || '未上传' }}
                </div>
              </div>
            </el-col>
            <el-col :span="8" :offset="8">
              <div id="5" class="grid-content bg-red" @click="download_pdf('land_preliminary_review')" @contextmenu.prevent="upload_pdf('land_preliminary_review')">
                建设项目用地预审与选址意见书
                <div class="file-status" :class="{'has-file': hasFile('land_preliminary_review')}">
                  {{ getFileName('land_preliminary_review') || '未上传' }}
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="16">
              <div id="6" class="grid-content bg-red" @click="download_pdf('land_allocation_decision')" @contextmenu.prevent="upload_pdf('land_allocation_decision')">
                不动产权证
                <div class="file-status" :class="{'has-file': hasFile('land_allocation_decision')}">
                  {{ getFileName('land_allocation_decision') || '未上传' }}
                </div>
              </div>
            </el-col>
          </el-row>
          <div id="7" class="grid-content bg-white" @click="download_pdf('proposal_review')" @contextmenu.prevent="upload_pdf('proposal_review')">
            项目建议书批复
            <div class="file-status" :class="{'has-file': hasFile('proposal_review')}">
              {{ getFileName('proposal_review') || '未上传' }}
            </div>
          </div>
          <div id="8" class="grid-content bg-yellow" @click="download_pdf('social_stability')" @contextmenu.prevent="upload_pdf('social_stability')">
            社会稳定风险分析报告及论证
            <div class="file-status" :class="{'has-file': hasFile('social_stability')}">
              {{ getFileName('social_stability') || '未上传' }}
            </div>
          </div>
          <div id="9" class="grid-content bg-white" @click="download_pdf('feasibility_report')" @contextmenu.prevent="upload_pdf('feasibility_report')">
            可行性研究报告
            <div class="file-status" :class="{'has-file': hasFile('feasibility_report')}">
              {{ getFileName('feasibility_report') || '未上传' }}
            </div>
          </div>
          <div id="10" class="grid-content bg-white" @click="download_pdf('feasibility_review')" @contextmenu.prevent="upload_pdf('feasibility_review')">
            可行性研究报告批复
            <div class="file-status" :class="{'has-file': hasFile('feasibility_review')}">
              {{ getFileName('feasibility_review') || '未上传' }}
            </div>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <div id="11" class="grid-content bg-white" @click="download_pdf('environmental_impact')" @contextmenu.prevent="upload_pdf('environmental_impact')">
                环境影响报告
                <div class="file-status" :class="{'has-file': hasFile('environmental_impact')}">
                  {{ getFileName('environmental_impact') || '未上传' }}
                </div>
              </div>
              <div id="12" class="grid-content bg-white" @click="download_pdf('environmental_impact_review')" @contextmenu.prevent="upload_pdf('environmental_impact_review')">
                环境影响报告批复
                <div class="file-status" :class="{'has-file': hasFile('environmental_impact_review')}">
                  {{ getFileName('environmental_impact_review') || '未上传' }}
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div id="13" class="grid-content bg-white" @click="download_pdf('safety_evaluation')" @contextmenu.prevent="upload_pdf('safety_evaluation')">
                安全预评价报告
                <div class="file-status" :class="{'has-file': hasFile('safety_evaluation')}">
                  {{ getFileName('safety_evaluation') || '未上传' }}
                </div>
              </div>
              <div id="14" class="grid-content bg-white" @click="download_pdf('safety_evaluation_explanation')" @contextmenu.prevent="upload_pdf('safety_evaluation_explanation')">
                安全预评价报告说明
                <div class="file-status" :class="{'has-file': hasFile('safety_evaluation_explanation')}">
                  {{ getFileName('safety_evaluation_explanation') || '未上传' }}
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="12">
          <div class="grid-title title-heading">企业投资项目</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <div id=101 class="grid-content bg-white">企业备案项目</div>
              <div id="15" class="grid-content bg-white" @click="download_pdf('group_approval')" @contextmenu.prevent="upload_pdf('group_approval')">
                集团批准文件
                <div class="file-status" :class="{'has-file': hasFile('group_approval')}">
                  {{ getFileName('group_approval') || '未上传' }}
                </div>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <div id="16" class="grid-content bg-yellow" @click="download_pdf('project_intro')" @contextmenu.prevent="upload_pdf('project_intro')">
                    项目简介
                    <div class="file-status" :class="{'has-file': hasFile('project_intro')}">
                      {{ getFileName('project_intro') || '未上传' }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="8" :offset="8">
                  <div id="17" class="grid-content bg-red" @click="download_pdf('land_auction')" @contextmenu.prevent="upload_pdf('land_auction')">
                    土地招拍挂，签订土地出让合同
                    <div class="file-status" :class="{'has-file': hasFile('land_auction')}">
                      {{ getFileName('land_auction') || '未上传' }}
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8" :offset="16">
                  <div id="18" class="grid-content bg-red" @click="download_pdf('property_right')" @contextmenu.prevent="upload_pdf('property_right')">
                    不动产权证
                    <div class="file-status" :class="{'has-file': hasFile('property_right')}">
                      {{ getFileName('property_right') || '未上传' }}
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <div id="19" class="grid-content bg-yellow" @click="download_pdf('social_stability_eval')" @contextmenu.prevent="upload_pdf('social_stability_eval')">
                    社会稳定风险评估分析报告及论证
                    <div class="file-status" :class="{'has-file': hasFile('social_stability_eval')}">
                      {{ getFileName('social_stability_eval') || '未上传' }}
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <div id="20" class="grid-content bg-yellow" @click="download_pdf('enterprise_filing')" @contextmenu.prevent="upload_pdf('enterprise_filing')">
                    企业投资项目备案信息
                    <div class="file-status" :class="{'has-file': hasFile('enterprise_filing')}">
                      {{ getFileName('enterprise_filing') || '未上传' }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <div id=102 class="grid-content bg-white">企业核准项目</div>
              <div id="21" class="grid-content bg-white" @click="download_pdf('group_approval')" @contextmenu.prevent="upload_pdf('group_approval')">
                集团批准文件
                <div class="file-status" :class="{'has-file': hasFile('group_approval')}">
                  {{ getFileName('group_approval') || '未上传' }}
                </div>
              </div>
              <el-row :gutter="10">
                <el-col :span="8">
                  <div id="22" class="grid-content bg-yellow" @click="download_pdf('project_intro')" @contextmenu.prevent="upload_pdf('project_intro')">
                    项目申请报告
                    <div class="file-status" :class="{'has-file': hasFile('project_intro')}">
                      {{ getFileName('project_intro') || '未上传' }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="8" :offset="8">
                  <div id="23" class="grid-content bg-red" @click="download_pdf('land_auction')" @contextmenu.prevent="upload_pdf('land_auction')">
                    土地招拍挂，签订土地出让合同
                    <div class="file-status" :class="{'has-file': hasFile('land_auction')}">
                      {{ getFileName('land_auction') || '未上传' }}
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8" :offset="16">
                  <div id="24" class="grid-content bg-red" @click="download_pdf('property_right')" @contextmenu.prevent="upload_pdf('property_right')">
                    不动产权证
                    <div class="file-status" :class="{'has-file': hasFile('property_right')}">
                      {{ getFileName('property_right') || '未上传' }}
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="103">
                  <div id="25" class="grid-content bg-yellow" @click="download_pdf('social_stability_eval')" @contextmenu.prevent="upload_pdf('social_stability_eval')">
                    规划方案审查
                    <div class="file-status" :class="{'has-file': hasFile('social_stability_eval')}">
                      {{ getFileName('social_stability_eval') || '未上传' }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div id="26" class="grid-content bg-yellow" @click="download_pdf('social_stability_eval')" @contextmenu.prevent="upload_pdf('social_stability_eval')">
                    社会稳定风险评估分析报告及论证
                    <div class="file-status" :class="{'has-file': hasFile('social_stability_eval')}">
                      {{ getFileName('social_stability_eval') || '未上传' }}
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <div id="27" class="grid-content bg-yellow" @click="download_pdf('enterprise_filing')" @contextmenu.prevent="upload_pdf('enterprise_filing')">
                    核准批复
                    <div class="file-status" :class="{'has-file': hasFile('enterprise_filing')}">
                      {{ getFileName('enterprise_filing') || '未上传' }}
                    </div>
                  </div>
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
import dbInstance from '@/database/db.js'


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
      uploadDialogVisible: false,
      uploadPercentage: 0,
      currentUploadType: "",
      fileList: [], // 存储文件列表
    };
  },
  mounted() {
    this.idd = this.$route.query.hetong;
    console.log(this.idd);
    
    // 加载文件列表
    this.loadFileList();
    
    // 确保在 DOM 元素加载完成之后执行
    this.$nextTick(() => {
      setTimeout(() => {
        this.createLines();
      }, 1000);
    });
  },
  methods: {
        
    async loadFileList() {
      try {
        console.log('正在加载文件列表...');
        // 使用dbInstance加载数据
        const data = await dbInstance.load(`filestorage_${this.idd}`);
        this.fileList = data || [];
        console.log('文件列表加载成功:', this.fileList);
      } catch (error) {
        console.error('加载文件列表失败:', error);
        this.fileList = [];
      }
    },
    
    async saveFileList() {
      try {
        console.log('正在保存文件列表...');
        // 使用dbInstance保存数据
        await dbInstance.save(`filestorage_${this.idd}`, this.fileList);
        console.log('文件列表保存成功');
      } catch (error) {
        console.error('保存文件列表失败:', error);
      }
    },
    
    // 触发文件上传
    upload_pdf(type) {
      this.currentUploadType = type;
      this.$refs.fileInput.click();
    },
    
    // 文件选择处理
    async onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const type = this.currentUploadType;
      if (!type) return;
      
      this.uploadDialogVisible = true;
      this.uploadPercentage = 0;
      
      try {
        // 检查是否有现有文件需要删除
        const existingFile = this.fileList.find(item => item.type === type);
        if (existingFile) {
          await this.$confirm('这会删除原本的文件，确定吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
          
          await axios.delete('/api/delete', {
            data: {
              filename: existingFile.filename,
              path: existingFile.path
            }
          });
          
          // 从文件列表中移除
          this.fileList = this.fileList.filter(item => item.type !== type);
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('originalname', encodeURIComponent(file.name));
        
        const res = await axios.post('/api/uploads', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            this.uploadPercentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          }
        });
        
        const responseData = {
          ...res.data,
          originalname: decodeURIComponent(res.data.originalname || file.name)
        };
        
        // 添加到文件列表
        this.fileList.push({
          type,
          originalname: responseData.originalname,
          filename: responseData.filename,
          size: responseData.size,
          path: decodeURIComponent(responseData.path),
          url: responseData.url,
          uploadTime: new Date().toISOString()
        });
        
        // 保存文件列表
        await this.saveFileList();
        
        this.$message.success('文件上传成功');
      } catch (error) {
        if (error !== 'cancel') {
          console.error('上传失败:', error);
          this.$message.error(error.message || '文件上传失败');
        } else {
          this.$message.info('已取消上传');
        }
      } finally {
        e.target.value = '';
        this.uploadDialogVisible = false;
      }
    },
    
    // 文件下载/查看
    download_pdf(type) {
      const fileInfo = this.fileList.find(item => item.type === type);
      if (!fileInfo) {
        this.$message.warning('没有找到该文件');
        return;
      }
      window.open(fileInfo.url, '_blank');
    },
    createLines() {
  // 检查 LeaderLine 是否可用
  if (typeof LeaderLine === 'undefined' || !LeaderLine) {
    console.error('LeaderLine is not available');
    return;
  }

  // 清除已有的线
  this.line_lists.forEach(line => line.remove());
  this.line_lists = [];

  let lineStyle = { 
    color: "white", 
    size: 2,
    path: "straight" 
  };

  for (let i = 0; i < this.lines.length; i++) {
    const startId = this.lines[i][0];
    const endId = this.lines[i][1];

    const startElement = document.getElementById(startId.toString());
    const endElement = document.getElementById(endId.toString());

    if (!startElement || !endElement) {
      console.error(`无法找到元素：${startId} 或 ${endId}`);
      continue;
    }

    try {
      // 获取特定的连接方向配置
      let startSocket = "bottom"; 
      let endSocket = "top";      
      if (this.linePositions[startId] && this.linePositions[startId][endId]) {
        const specificPosition = this.linePositions[startId][endId];
        startSocket = specificPosition.startSocket || startSocket;
        endSocket = specificPosition.endSocket || endSocket;
      }

      // 创建连线 - 使用正确的API
      const line = new LeaderLine(
        startElement,
        endElement,
        {
          startPlug: "behind",
          endPlug: "arrow1",
          startSocket: startSocket,
          endSocket: endSocket,
          ...lineStyle
        }
      );
      
      this.line_lists.push(line);
    } catch (error) {
      console.error('创建连线失败:', error);
    }
  }
},
  hasFile(type) {
    return this.fileList.some(item => item.type === type);
  },
  
  getFileName(type) {
    const file = this.fileList.find(item => item.type === type);
    return file ? file.originalname : null;
  },
    
  },
  created() {
    // 初始化时加载数据
    this.idd = this.$route.query.hetong;
    console.log('项目ID:', this.idd);
    this.loadFileList();
  },
  beforeDestroy() {
    // 组件销毁前保存数据
    this.saveFileList();
    
    // 清理LeaderLine实例
    if (this.line_lists && this.line_lists.length > 0) {
      this.line_lists.forEach(line => line.remove());
    }
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

.file-status {
  font-size: 12px;
  margin-top: 5px;
  color: #e74c3c; /* 默认红色，未上传 */
}

.file-status.has-file {
  color: #2ecc71; /* 绿色，已上传 */
}
</style>
