<template>
  <div class="approval-container">
    <!-- 审批类型选择区域 -->
    <div class="approval-type-section" v-if="!currentType">
      <h2 class="section-title">审批功能</h2>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="4" v-for="(item, index) in approvalTypes" :key="index">
          <el-card 
            class="approval-type-card" 
            shadow="hover">
            <!-- 内部包裹一个可点击的 div -->
            <div 
              class="card-content" 
              @click="handleTypeSelect(item.value)"
              style="width: 100%; height: 100%; cursor: pointer;">
              <i :class="item.icon"></i>
              <div class="card-title">{{ item.label }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 二级界面 -->
    <div v-if="currentType" class="second-level">
      <!-- 顶部导航 -->
      <div class="nav-header">
        <el-page-header @back="goBack" :content="getTypeLabel"></el-page-header>
      </div>

      <!-- 操作按钮区 -->
      <div class="operation-bar">
        <el-button type="primary" icon="el-icon-plus" @click="showCreateDialog = true">新建申请</el-button>
        <el-button-group>
          <el-button icon="el-icon-search">查询</el-button>
          <el-button icon="el-icon-refresh">重置</el-button>
        </el-button-group>
      </div>

      <!-- 搜索条件区 -->
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="申请编号">
            <el-input v-model="searchForm.code" placeholder="请输入申请编号"></el-input>
          </el-form-item>
          <el-form-item label="申请状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态">
              <el-option label="待审批" value="pending"></el-option>
              <el-option label="审批中" value="processing"></el-option>
              <el-option label="已通过" value="approved"></el-option>
              <el-option label="已拒绝" value="rejected"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <div class="table-area">
        <el-table
          :data="tableData"
          style="width: 100%"
          border>
          <el-table-column
            prop="code"
            label="申请编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="type"
            label="申请类型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="applicant"
            label="申请人"
            width="120">
          </el-table-column>
          <el-table-column
            prop="department"
            label="所属部门"
            width="120">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="申请时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="100">
            <template slot-scope="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="currentApprover"
            label="当前审批人"
            width="120">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleView(scope.row)">查看</el-button>
              <el-button size="mini" type="primary" @click="handleApprove(scope.row)">审批</el-button>
              <el-button size="mini" type="danger" @click="handleCancel(scope.row)">撤销</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-area">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 新建申请对话框 -->
    <el-dialog
      :title="'新建' + getTypeLabel"
      :visible.sync="showCreateDialog"
      width="60%">
      <el-form ref="form" :model="formData" label-width="120px">
        <!-- 请假申请表单 -->
        <template v-if="currentType === 'leave'">
          <el-form-item label="申请人类型">
            <el-radio-group v-model="formData.applicantType">
              <el-radio label="normal">普通员工</el-radio>
              <el-radio label="manager">部门负责人</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="请假类型">
            <el-select v-model="formData.leaveType" placeholder="请选择请假类型">
              <el-option label="事假" value="personal"></el-option>
              <el-option label="病假" value="sick"></el-option>
              <el-option label="年假" value="annual"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请假时间">
            <el-date-picker
              v-model="formData.leaveTimeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="请假事由">
            <el-input type="textarea" v-model="formData.leaveReason"></el-input>
          </el-form-item>
        </template>

        <!-- 用印申请表单 -->
        <template v-if="currentType === 'seal'">
          <el-form-item label="申请人类型">
            <el-radio-group v-model="formData.applicantType">
              <el-radio label="normal">普通员工</el-radio>
              <el-radio label="manager">部门负责人</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用印公司">
            <el-select v-model="formData.company" placeholder="请选择用印公司">
              <el-option label="AAA1有限责任公司" value="AAA1"></el-option>
              <el-option label="AAA2有限公司" value="AAA2"></el-option>
              <el-option label="AAA3有限公司" value="AAA3"></el-option>
              <el-option label="其他公司" value="other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用印文件">
            <el-upload
              class="upload-demo"
              action="/upload"
              multiple
              :limit="3">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传需要用印的文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="用印事由">
            <el-input type="textarea" v-model="formData.sealReason"></el-input>
          </el-form-item>
        </template>

        <!-- 补卡申请表单 -->
        <template v-if="currentType === 'attendance'">
          <el-form-item label="申请人类型">
            <el-radio-group v-model="formData.applicantType">
              <el-radio label="normal">普通员工</el-radio>
              <el-radio label="manager">部门负责人</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="补卡日期">
            <el-date-picker
              v-model="formData.attendanceDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="补卡时间">
            <el-time-picker
              v-model="formData.attendanceTime"
              placeholder="选择时间">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="补卡原因">
            <el-input type="textarea" v-model="formData.attendanceReason"></el-input>
          </el-form-item>
        </template>

        <!-- 证件使用申请表单 -->
        <template v-if="currentType === 'certificate'">
          <el-form-item label="证件类型">
            <el-select v-model="formData.certificateType" placeholder="请选择证件类型">
              <el-option label="营业执照" value="business"></el-option>
              <el-option label="资质证书" value="qualification"></el-option>
              <el-option label="其他证件" value="other"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用时间">
            <el-date-picker
              v-model="formData.certificateTimeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="使用用途">
            <el-input type="textarea" v-model="formData.certificateUse"></el-input>
          </el-form-item>
        </template>

        <!-- 合同协议会签表单 -->
        <template v-if="currentType === 'contract'">
          <el-form-item label="合同名称">
            <el-input v-model="formData.contractName"></el-input>
          </el-form-item>
          <el-form-item label="合同类型">
            <el-select v-model="formData.contractType" placeholder="请选择合同类型">
              <el-option label="采购合同" value="purchase"></el-option>
              <el-option label="销售合同" value="sales"></el-option>
              <el-option label="框架协议" value="framework"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同文件">
            <el-upload
              class="upload-demo"
              action="/upload"
              :limit="1">
              <el-button size="small" type="primary">上传合同文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="相关说明">
            <el-input type="textarea" v-model="formData.contractDesc"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCreateDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'approval',
  data() {
    return {
      currentType: '',
      showCreateDialog: false,
      approvalTypes: [
        { label: '请假审批', value: 'leave', icon: 'el-icon-date' },
        { label: '补卡审批', value: 'attendance', icon: 'el-icon-time' },
        { label: '用印审批', value: 'seal', icon: 'el-icon-document' },
        { label: '证件使用审批', value: 'certificate', icon: 'el-icon-notebook-2' },
        { label: '合同协议会签', value: 'contract', icon: 'el-icon-collection' }
      ],
      searchForm: {
        code: '',
        status: '',
        dateRange: ''
      },
      formData: {
        applicantType: 'normal',
        leaveType: '',
        leaveTimeRange: '',
        leaveReason: '',
        company: '',
        sealReason: '',
        attendanceDate: '',
        attendanceTime: '',
        attendanceReason: '',
        certificateType: '',
        certificateTimeRange: '',
        certificateUse: '',
        contractName: '',
        contractType: '',
        contractDesc: ''
      },
      tableData: [
        {
          code: 'AP202311001',
          type: '请假申请',
          applicant: '张三',
          department: '技术部',
          createTime: '2023-11-25 09:00:00',
          status: '待审批',
          currentApprover: '李四'
        },
        {
          code: 'AP202311002',
          type: '用印申请',
          applicant: '王五',
          department: '市场部',
          createTime: '2023-11-25 10:00:00',
          status: '审批中',
          currentApprover: '赵六'
        }
      ],
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    getTypeLabel() {
      const type = this.approvalTypes.find(t => t.value === this.currentType)
      return type ? type.label : ''
    }
  },
  methods: {
    handleTypeSelect(type) {
      this.currentType = type;
    },
    goBack() {
      this.currentType = '';
    },
    getStatusType(status) {
      const statusMap = {
        '待审批': 'warning',
        '审批中': 'primary', 
        '已通过': 'success',
        '已拒绝': 'danger'
      };
      return statusMap[status] || 'info';
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleView(row) {
      console.log('查看', row);
    },
    handleApprove(row) {
      console.log('审批', row);  
    },
    handleCancel(row) {
      console.log('撤销', row);
    },
    submitForm() {
      // 在这里处理表单提交逻辑
      this.showCreateDialog = false;
      // 例如，重置表单数据
      this.resetFormData();
      // 可以添加通知或其他用户反馈
      this.$message.success('申请提交成功！');
    },
    resetFormData() {
      this.formData = {
        applicantType: 'normal',
        leaveType: '',
        leaveTimeRange: '',
        leaveReason: '',
        company: '',
        sealReason: '',
        attendanceDate: '',
        attendanceTime: '',
        attendanceReason: '',
        certificateType: '',
        certificateTimeRange: '',
        certificateUse: '',
        contractName: '',
        contractType: '',
        contractDesc: ''
      };
    }
  }
}
</script>

<style scoped>
.approval-container {
 padding: 20px;
 background-color: #f5f7fa;
 min-height: 100vh;
}

.section-title {
 font-size: 24px;
 font-weight: 500;
 color: #303133;
 margin-bottom: 20px;
}

.approval-type-card {
 height: 120px;
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 transition: all 0.3s;
}

.approval-type-card:hover {
 transform: translateY(-5px);
}

.card-content i {
 font-size: 32px;
 margin-bottom: 10px;
 color: #409EFF;
}

.card-title {
 font-size: 16px;
 color: #303133;
}

.nav-header {
 background-color: white;
 padding: 16px;
 margin-bottom: 20px;
 border-radius: 4px;
}

.operation-bar {
 background-color: white;
 padding: 16px;
 margin-bottom: 20px;
 border-radius: 4px;
 display: flex;
 justify-content: space-between;
}

.search-area {
 background-color: white;
 padding: 20px;
 margin-bottom: 20px;
 border-radius: 4px;
}

.search-form {
 display: flex;
 flex-wrap: wrap;
}

.table-area {
 background-color: white;
 padding: 20px;
 border-radius: 4px;
}

.pagination-area {
 margin-top: 20px;
 display: flex;
 justify-content: center;
}

.dialog-footer {
 text-align: right;
}

.upload-demo {
 width: 360px;
}
</style>
