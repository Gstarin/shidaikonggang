<template>
  <div id="app">
    <div class="container">
      <!-- 搜索和操作按钮区域 -->
      <div class="table-header d-flex align-items-center mb-3">
        <b-form-input 
          v-model="searchText" 
          placeholder="输入员工姓名搜索" 
          class="mr-3 mb-2" 
          style="max-width: 200px;"
          @keyup.enter="performSearch"
        ></b-form-input>
        <b-button variant="secondary" class="mr-3 mb-2" size="sm" @click="performSearch">搜索</b-button>
        <b-button variant="light" class="mr-3 mb-2" size="sm" @click="clearSearch">清除</b-button>
        <b-button variant="primary" class="mr-3 mb-2" size="sm" @click="saveAllData">保存</b-button>
        <b-button variant="info" class="mr-3 mb-2" size="sm" @click="exportAllData">导出数据</b-button>
        <b-button variant="success" class="mr-3 mb-2" size="sm" @click="importData">导入数据</b-button>
      </div>

      <!-- 人员展示区域 -->
      <div class="boxes-container">
        <div class="box" v-for="(item, index) in displayBoxes" :key="item.id">
          <div class="avatar-container" @click="showEmployeeDetails(index)">
            <img v-if="item.avatarPath && imageCache[item.avatarPath]" 
                 :src="imageCache[item.avatarPath]" 
                 class="avatar"
                 @error="handleImageError(index)"/>
            <div v-else class="avatar-placeholder">
              <i class="el-icon-user-solid"></i>
            </div>
          </div>
          <div class="name">{{ item.name }}</div>
          <div class="employee-id">ID: {{ item.id }}</div>
          <div class="box-actions">
            <el-button type="primary" size="mini" @click.stop="editEmployee(index)">编辑</el-button>
            <el-button type="danger" size="mini" @click.stop="deleteBox(index)">删除</el-button>
          </div>
        </div>
        
        <div class="add-box" @click="addNewEmployee">
          <i class="el-icon-plus"></i>
          <span>添加员工</span>
        </div>
      </div>
    </div>

    <!-- 员工详情对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      v-draggable
      custom-class="employee-dialog"
    >
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="基本信息" name="basic">
          <employee-basic-info 
            :form="currentEmployee" 
            :mode="dialogMode"
            @update-field="updateEmployeeField"
            @upload-avatar="handleAvatarUpload"
          />
        </el-tab-pane>
        <el-tab-pane label="工作信息" name="work">
          <employee-work-info 
            :form="currentEmployee" 
            :mode="dialogMode"
            @update-field="updateEmployeeField"
          />
        </el-tab-pane>
        <el-tab-pane label="教育经历" name="education">
          <employee-education 
            :educations="currentEmployee.educations" 
            :mode="dialogMode"
            @add="addEducation"
            @remove="removeEducation"
            @update="updateEducation"
          />
        </el-tab-pane>
        <el-tab-pane label="工作经历" name="experience">
          <employee-experience 
            :experiences="currentEmployee.workExperiences" 
            :mode="dialogMode"
            @add="addWorkExperience"
            @remove="removeWorkExperience"
            @update="updateWorkExperience"
          />
        </el-tab-pane>
        <el-tab-pane label="家庭成员" name="family">
          <employee-family 
            :relations="currentEmployee.relations" 
            :mode="dialogMode"
            @add="addFamilyMember"
            @remove="removeFamilyMember"
            @update="updateFamilyMember"
          />
        </el-tab-pane>
      </el-tabs>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="export_pdf">导出PDF</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEmployee" v-if="dialogMode === 'edit'">保存</el-button>
      </span>
    </el-dialog>

    <!-- 图片上传隐藏input -->
    <input 
      type="file" 
      ref="avatarInput" 
      style="display: none" 
      accept="image/*"
      @change="processAvatarUpload"
    >
  </div>
</template>

<script>
import { export_excel } from '@/utils/exportExcel.js'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import axios from '@/utils/axios.js'
import dbInstance from '@/database/db.js'
import EmployeeBasicInfo from './EmployeeBasicInfo.vue'
import EmployeeWorkInfo from './EmployeeWorkInfo.vue'
import EmployeeEducation from './EmployeeEducation.vue'
import EmployeeExperience from './EmployeeExperience.vue'
import EmployeeFamily from './EmployeeFamily.vue'

// 初始化员工数据结构
const EMPLOYEE_TEMPLATE = {
  id: '',
  name: '',
  gender: 'male',
  birthDate: '',
  ethnicity: '',
  idCard: '',
  phone: '',
  address: '',
  avatarPath: '',
  educations: [],
  workExperiences: [],
  relations: [],
  department: '',
  position: '',
  hireDate: '',
  status: 'active',
  emergencyContact: '',
  emergencyPhone: '',
  avatarInfo: {  // 改为存储图片信息而不是文件对象
    fileName: '',
    lastModified: 0,
    size: 0,
    type: ''
  }
}

export default {
  name: 'EmployeeDisplay',
  components: {
    EmployeeBasicInfo,
    EmployeeWorkInfo,
    EmployeeEducation,
    EmployeeExperience,
    EmployeeFamily
  },
  data() {
    return {
      boxes: [],
      searchText: '',
      isSearching: false,
      searchResults: [],
      dialogVisible: false,
      dialogMode: 'view', // 'view' or 'edit'
      currentEmployee: JSON.parse(JSON.stringify(EMPLOYEE_TEMPLATE)),
      activeTab: 'basic',
      imageCache: {},
      storageKey: 'employee-display-data',
      fileHandles: {} // 用于存储文件句柄
    }
  },
  computed: {
    displayBoxes() {
      if (this.isSearching) {
        return this.searchResults
      }
      return this.boxes
    },
    dialogTitle() {
      return this.dialogMode === 'edit' 
        ? `编辑员工 - ${this.currentEmployee.name || '新员工'}` 
        : `员工详情 - ${this.currentEmployee.name || ''}`
    }
  },
  async created() {
    await this.initialize()
  },
  methods: {
    // 初始化应用
    async initialize() {
      try {
        await this.loadData()
        await this.loadImageCache()
      } catch (error) {
        console.error('初始化失败:', error)
        this.$message.error('初始化失败: ' + error.message)
      }
    },
    
    // 加载员工数据
    async loadData() {
      try {
        // 先尝试从本地加载
        const savedData = await dbInstance.load(this.storageKey)
        if (savedData && savedData.employees) {
          this.boxes = savedData.employees
          this.fileHandles = savedData.fileHandles || {}
          return
        }
        
        // 本地没有则从API加载
        const response = await axios.get('/api/data/grxx')
        this.processEmployeeData(response.data)
        
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('加载数据失败，请重试')
      }
    },
    
    // 处理从API获取的员工数据
    processEmployeeData(apiData) {
      this.boxes = apiData.map((item, index) => {
        // 处理出生日期
        let birthDate = ''
        if (item.id_number) {
          const birthYear = parseInt(String(item.id_number).substring(6, 10), 10)
          const birthMonth = parseInt(String(item.id_number).substring(10, 12), 10)
          const birthDay = parseInt(String(item.id_number).substring(12, 14), 10)
          birthDate = `${birthYear}/${birthMonth}/${birthDay}`
        }
        
        return {
          id: item.id || index + 1,
          name: item.name || '',
          gender: item.sex || 'male',
          birthDate,
          ethnicity: item.minzu || '',
          idCard: item.id_number || '',
          phone: item.phone || '',
          address: item.address || '',
          avatarPath: item.avatarPath || '',
          department: item.bumen || '',
          position: item.job || '',
          educations: this.parseEducations(item),
          workExperiences: this.parseWorkExperiences(item),
          relations: this.parseRelations(item),
          rawData: item // 保留原始数据
        }
      })
    },
    
    // 解析教育经历
    parseEducations(item) {
      const educations = []
      for (let i = 1; i <= 3; i++) {
        if (item[`school${i}`]) {
          const period = item[`qijian${i}`] || ''
          const [startYear, endYear] = period.split('-')
          educations.push({
            school: item[`school${i}`],
            major: item[`major${i}`],
            startYear,
            endYear: endYear || '至今'
          })
        }
      }
      return educations
    },
    
    // 解析工作经历
    parseWorkExperiences(item) {
      const experiences = []
      for (let i = 1; i <= 5; i++) {
        if (item[`job${i}`]) {
          const period = item[`gzqj${i}`] || ''
          const [startYear, endYear] = period.includes('-') 
            ? period.split('-') 
            : [period, '至今']
          experiences.push({
            company: item[`zzdw${i}`],
            position: item[`job${i}`],
            startYear,
            endYear
          })
        }
      }
      return experiences
    },
    
    // 解析家庭成员
    parseRelations(item) {
      const relations = []
      for (let i = 1; i <= 5; i++) {
        if (item[`qsxm${i}`]) {
          relations.push({
            name: item[`qsxm${i}`],
            gender: item[`sex${i}`],
            ethnicity: item[`minzu${i}`],
            birthDate: item[`birth${i}`],
            age: item[`age${i}`],
            relation: item[`relation${i}`],
            workplace: item[`gzdw${i}`],
            position: item[`zhiwu${i}`]
          })
        }
      }
      return relations
    },
    
    // 加载图片缓存
    async loadImageCache() {
      for (const employee of this.boxes) {
        if (employee.avatarPath) {
          try {
            const fileHandle = this.fileHandles[employee.avatarPath]
            if (fileHandle) {
              const file = await fileHandle.getFile()
              this.$set(this.imageCache, employee.avatarPath, URL.createObjectURL(file))
            }
          } catch (error) {
            console.error('加载图片失败:', employee.avatarPath, error)
          }
        }
      }
    },
    
    // 保存所有数据
	async saveAllData() {
	try {
		const dataToSave = {
		employees: this.boxes.map(emp => {
			const empCopy = {...emp}
			// 不保存图片数据，只保存引用信息
			delete empCopy.avatarFile
			return empCopy
		}),
		lastUpdated: new Date().toISOString()
		}
		
		await dbInstance.save(this.storageKey, dataToSave)
		this.$message.success('数据保存成功')
	} catch (error) {
		console.error('保存数据失败:', error)
		this.$message.error('保存数据失败: ' + error.message)
	}
	},
    
    // 导出数据
    async exportAllData() {
      try {
        // 创建一个包含所有数据的对象
        const exportData = {
          employees: this.boxes.map(emp => {
            const empCopy = {...emp}
            // 不导出文件句柄和图片数据
            delete empCopy.avatarPath
            return empCopy
          }),
          exportedAt: new Date().toISOString()
        }
        
        // 创建Blob
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        
        // 创建下载链接
        const a = document.createElement('a')
        a.href = url
        a.download = `employees_export_${new Date().toISOString().slice(0, 10)}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        this.$message.success('数据导出成功')
      } catch (error) {
        console.error('导出数据失败:', error)
        this.$message.error('导出数据失败: ' + error.message)
      }
    },
    
    // 导入数据
    async importData() {
      try {
        // 创建文件输入元素
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        
        input.onchange = async e => {
          const file = e.target.files[0]
          if (!file) return
          
          const reader = new FileReader()
          reader.onload = async event => {
            try {
              const data = JSON.parse(event.target.result)
              if (!data.employees) {
                throw new Error('无效的数据格式')
              }
              
              this.$confirm('导入数据将覆盖当前数据，是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(async () => {
                this.boxes = data.employees
                await this.saveAllData()
                this.$message.success('数据导入成功')
              })
            } catch (error) {
              console.error('导入数据失败:', error)
              this.$message.error('导入数据失败: ' + error.message)
            }
          }
          reader.readAsText(file)
        }
        
        input.click()
      } catch (error) {
        console.error('导入数据失败:', error)
        this.$message.error('导入数据失败: ' + error.message)
      }
    },
    
    // 显示员工详情
    showEmployeeDetails(index) {
      this.dialogMode = 'view'
      this.currentEmployee = JSON.parse(JSON.stringify(this.boxes[index]))
      this.dialogVisible = true
    },
    
    // 编辑员工
    editEmployee(index) {
      this.dialogMode = 'edit'
      this.currentEmployee = JSON.parse(JSON.stringify(this.boxes[index]))
      this.dialogVisible = true
    },
    
    // 添加新员工
    addNewEmployee() {
      this.dialogMode = 'edit'
      this.currentEmployee = JSON.parse(JSON.stringify(EMPLOYEE_TEMPLATE))
      this.currentEmployee.id = this.generateEmployeeId()
      this.dialogVisible = true
    },
    
    // 生成员工ID
    generateEmployeeId() {
      const maxId = this.boxes.reduce((max, emp) => Math.max(max, parseInt(emp.id) || 0), 0)
      return (maxId + 1).toString()
    },
    
    // 保存员工信息
    async saveEmployee() {
  try {
    // 验证必填字段
    if (!this.currentEmployee.name) {
      this.$message.error('请输入员工姓名')
      return
    }
    
    // 查找员工索引
    const index = this.boxes.findIndex(emp => emp.id === this.currentEmployee.id)
    
    if (index >= 0) {
      // 更新现有员工
      this.boxes.splice(index, 1, {...this.currentEmployee})
    } else {
      // 添加新员工
      this.boxes.push({...this.currentEmployee})
    }
    
    await this.saveAllData()
    this.dialogVisible = false
    this.$message.success('员工信息保存成功')
  } catch (error) {
    console.error('保存员工信息失败:', error)
    this.$message.error('保存员工信息失败: ' + error.message)
  }
},
    
    // 删除员工
    async deleteBox(index) {
      try {
        await this.$confirm('确定要删除这个员工吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // 删除关联的图片文件
        const employee = this.boxes[index]
        if (employee.avatarPath) {
          try {
            const fileHandle = this.fileHandles[employee.avatarPath]
            if (fileHandle) {
              // 在实际应用中，你可能需要请求文件系统权限来删除文件
              // 这里我们只是从缓存中移除
              delete this.fileHandles[employee.avatarPath]
              delete this.imageCache[employee.avatarPath]
            }
          } catch (error) {
            console.error('删除图片文件失败:', error)
          }
        }
        
        this.boxes.splice(index, 1)
        await this.saveAllData()
        this.$message.success('员工已删除')
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除员工失败:', error)
          this.$message.error('删除员工失败: ' + error.message)
        }
      }
    },
    
    // 处理头像上传
    handleAvatarUpload() {
      this.$refs.avatarInput.click()
    },
    
    // 处理头像文件选择
    // 修改图片上传方法
	// 修改后的头像上传处理方法
async processAvatarUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    // 验证图片
    if (!file.type.match('image.*')) {
      throw new Error('请选择图片文件')
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('图片大小不能超过2MB')
    }
    
    // 创建FormData对象
    const formData = new FormData()
    formData.append('file', file)
    
    // 上传到服务器
    const response = await axios.post('/api/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.data.success) {
      // 更新员工信息
      this.currentEmployee.avatarPath = response.data.path
      this.currentEmployee.avatarUrl = response.data.url
      
      // 更新图片缓存
      this.$set(this.imageCache, response.data.path, response.data.url)
      
      this.$message.success('头像上传成功')
    } else {
      throw new Error(response.data.error || '上传失败')
    }
  } catch (error) {
    console.error('上传头像失败:', error)
    this.$message.error('上传头像失败: ' + error.message)
  } finally {
    event.target.value = ''
  }
},
    
    // 使用文件系统API保存文件
    async saveFileToLocal(fileName, file) {
		try {
			// 返回一个可序列化的对象，而不是文件句柄
			return {
			fileName,
			lastModified: file.lastModified,
			size: file.size,
			type: file.type,
			// 存储为Blob URL
			blobUrl: URL.createObjectURL(file)
			}
		} catch (error) {
			console.error('保存文件失败:', error)
			throw error
		}
		},

		// 修改图片加载方法
		async loadImageCache() {
  for (const employee of this.boxes) {
    if (employee.avatarPath) {
      try {
        // 直接从服务器加载图片
        this.$set(this.imageCache, employee.avatarPath, employee.avatarUrl)
      } catch (error) {
        console.error('加载图片失败:', employee.avatarPath, error)
      }
    }
  }
},
    
    // 处理图片加载错误
    handleImageError(index) {
      console.warn('图片加载失败:', this.boxes[index].avatarPath)
      delete this.imageCache[this.boxes[index].avatarPath]
    },
    
    // 导出PDF
    async export_pdf() {
      try {
        const dialog = this.$refs.myDialog.$el
        const dialogBody = dialog.querySelector('.el-dialog__body')
        
        // 临时显示所有标签内容
        const originalTab = this.activeTab
        const tabs = ['basic', 'work', 'education', 'experience', 'family']
        
        for (const tab of tabs) {
          this.activeTab = tab
          await this.$nextTick()
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        
        this.activeTab = originalTab
        await this.$nextTick()
        
        const canvas = await html2canvas(dialogBody, {
          scale: 2,
          useCORS: true,
          scrollX: 0,
          scrollY: 0
        })
        
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm'
        })
        
        const imgProps = pdf.getImageProperties(imgData)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save(`${this.currentEmployee.name}_员工信息.pdf`)
      } catch (error) {
        console.error('导出PDF失败:', error)
        this.$message.error('导出PDF失败: ' + error.message)
      }
    },
    
    // 更新员工字段
    updateEmployeeField(field, value) {
      this.$set(this.currentEmployee, field, value)
    },
    
    // 教育经历操作
    addEducation() {
      this.currentEmployee.educations.push({
        school: '',
        major: '',
        degree: '',
        startYear: '',
        endYear: ''
      })
    },
    
    removeEducation(index) {
      this.currentEmployee.educations.splice(index, 1)
    },
    
    updateEducation(index, field, value) {
      this.$set(this.currentEmployee.educations[index], field, value)
    },
    
    // 工作经历操作
    addWorkExperience() {
      this.currentEmployee.workExperiences.push({
        company: '',
        position: '',
        startYear: '',
        endYear: '',
        description: ''
      })
    },
    
    removeWorkExperience(index) {
      this.currentEmployee.workExperiences.splice(index, 1)
    },
    
    updateWorkExperience(index, field, value) {
      this.$set(this.currentEmployee.workExperiences[index], field, value)
    },
    
    // 家庭成员操作
    addFamilyMember() {
      this.currentEmployee.relations.push({
        name: '',
        relation: '',
        gender: 'male',
        birthDate: '',
        workplace: '',
        position: '',
        phone: ''
      })
    },
    
    removeFamilyMember(index) {
      this.currentEmployee.relations.splice(index, 1)
    },
    
    updateFamilyMember(index, field, value) {
      this.$set(this.currentEmployee.relations[index], field, value)
    },
    
    // 搜索功能
    performSearch() {
      if (!this.searchText.trim()) {
        this.clearSearch()
        return
      }
      
      this.isSearching = true
      const searchTerm = this.searchText.toLowerCase()
      this.searchResults = this.boxes.filter(emp => 
        emp.name && emp.name.toLowerCase().includes(searchTerm) ||
        (emp.id && emp.id.toString().includes(searchTerm)) ||
        (emp.department && emp.department.toLowerCase().includes(searchTerm)) ||
        (emp.position && emp.position.toLowerCase().includes(searchTerm)))
    },
    
    clearSearch() {
      this.searchText = ""
      this.isSearching = false
      this.searchResults = []
    },
    
    // 关闭对话框
    handleClose(done) {
      if (this.dialogMode === 'edit' && this.hasChanges()) {
        this.$confirm('有未保存的更改，确定要关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        }).catch(() => {})
      } else {
        done()
      }
    },
    
    // 检查是否有更改
    hasChanges() {
      if (this.dialogMode !== 'edit') return false
      
      const original = this.boxes.find(emp => emp.id === this.currentEmployee.id)
      if (!original) return true // 新员工
      
      return JSON.stringify(original) !== JSON.stringify(this.currentEmployee)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/app';

.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.table-header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.boxes-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  border: 1px solid #e0e0e0;
  
  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    font-size: 40px;
    color: #c0c4cc;
  }
}

.name {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.employee-id {
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
}

.box-actions {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  
  .el-button {
    padding: 5px 8px;
    font-size: 12px;
  }
}

.add-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f7fa;
  border: 2px dashed #c0c4cc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #409eff;
    color: #409eff;
  }
  
  i {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  span {
    font-size: 14px;
  }
}

.employee-dialog {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  
  .el-dialog__body {
    overflow-y: auto;
    padding: 20px;
    flex-grow: 1;
  }
  
  .el-tabs__content {
    padding: 15px 0;
  }
}
</style>