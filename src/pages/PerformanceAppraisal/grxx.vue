  <template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>绩效考核</b-breadcrumb-item>
      <b-breadcrumb-item active>个人信息</b-breadcrumb-item>
    </b-breadcrumb>
    <b-row>
      <b-col>
        <Widget title="<h5>档案信息</h5>" customHeader settings close>
          <!-- 使用 TableTemplate 组件 -->
          <TableTemplate
            ref="tableTemplate"
            :tableData="tableData"
            :columns="tableColumns"
            :formFields="formFields"
            :storageKey="'personalInfoData'"
            :showExcelHandler="true"
            :customFilter1="filterByYear"
            :customFilter2="filterByReward"
            :customFilter3="filterByPunish"
            @update:tableData="updateTableData"
          >
            <template v-slot:custom-filter1>
              <el-select v-model="selectedYear" placeholder="选择年度" style="width: 120px; margin-right: 15px;">
                <el-option value="" label="全部"></el-option>
                <el-option v-for="year in availableYears" :key="year" :label="year" :value="year"></el-option>
              </el-select>
            </template>
            
            <template v-slot:custom-filter2>
              <el-select v-model="selectedReward" placeholder="选择奖励" style="width: 120px; margin-right: 15px;">
                <el-option value="" label="全部"></el-option>
                <el-option v-for="reward in availableRewards" :key="reward" :label="reward" :value="reward"></el-option>
              </el-select>
            </template>
            
            <template v-slot:custom-filter3>
              <el-select v-model="selectedPunish" placeholder="选择处罚" style="width: 120px; margin-right: 15px;">
                <el-option value="" label="全部"></el-option>
                <el-option v-for="punish in availablePunishments" :key="punish" :label="punish" :value="punish"></el-option>
              </el-select>
            </template>
          </TableTemplate>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget'
import TableTemplate from '@/components/Template/xlsxTable'
import axios from '@/utils/axios.js'

export default {
  name: 'PersonalInfo',
  components: { Widget, TableTemplate },
  data() {
    return {
      selectedYear: '',
      selectedReward: '',
      selectedPunish: '',
      tableData: [],
      formFields: {
        fx: "", bumen: "", gongsi: "", neibu: "", name: "", sex: "", minzu: "", phone: "", 
        id_number: "", age: "", height: "", weight: "", pic: "", time1: "", zpqd: "", time2: "", 
        zzzt: "", jcnd1: "", reward1: "", punish1: "", jcnd2: "", reward2: "", punish2: "", 
        jcnd3: "", reward3: "", punish3: "", school1: "", major1: "", qijian1: "", xueli1: "", 
        school2: "", major2: "", qijian2: "", xueli2: "", school3: "", major3: "", qijian3: "", 
        xueli3: "", gzqj1: "", zzdw1: "", job1: "", gzqj2: "", zzdw2: "", job2: "", gzqj3: "", 
        zzdw3: "", job3: "", gzqj4: "", zzdw4: "", job4: "", gzqj5: "", zzdw5: "", job5: "", 
        zzmm: "", address: "", id_card: "", jnzs: "", qsxm1: "", sex1: "", minzu1: "", birth1: "", 
        age1: "", jiguan1: "", gzdw1: "", zaizhi1: "", zhiwu1: "", xueli11: "", qsxm2: "", sex2: "", 
        minzu2: "", birth2: "", age2: "", jiguan2: "", gzdw2: "", zaizhi2: "", zhiwu2: "", xueli22: "", 
        qsxm3: "", sex3: "", minzu3: "", birth3: "", age3: "", jiguan3: "", gzdw3: "", zaizhi3: "", 
        zhiwu3: "", xueli33: "", qsxm4: "", sex4: "", minzu4: "", birth4: "", age4: "", jiguan4: "", 
        gzdw4: "", zaizhi4: "", zhiwu4: "", xueli44: "", qsxm5: "", sex5: "", minzu5: "", birth5: "", 
        age5: "", jiguan5: "", gzdw5: "", zaizhi5: "", zhiwu5: "", xueli55: ""
      },
      tableColumns: [
        { prop: 'fx', label: '总序号', width: 100 },
        { prop: 'bumen', label: '所在部门', width: 140 },
        { prop: 'gongsi', label: '合同所属公司', width: 200 },
        { prop: 'neibu', label: '内部序号', width: 100 },
        { prop: 'name', label: '姓名', width: 100 },
        { prop: 'sex', label: '性别', width: 80 },
        { prop: 'minzu', label: '民族', width: 100 },
        { prop: 'phone', label: '电话', width: 150 },
        { prop: 'id_number', label: '身份证号', width: 200 },
        { prop: 'age', label: '年龄', width: 80, type: 'number' },
        { prop: 'height', label: '身高', width: 80, type: 'number' },
        { prop: 'weight', label: '体重', width: 80, type: 'number' },
        { 
          prop: 'pic', 
          label: '照片', 
          type: 'file',
          width: 150
        },
        { prop: 'time1', label: '最初合同签订时间', width: 150, type: 'date'  },
        { prop: 'zpqd', label: '招聘渠道', width: 150 },
        { prop: 'time2', label: '最新合同签订时间', width: 150, type: 'date'  },
        { prop: 'zzzt', label: '在职状态', width: 150 },
        
        // 奖惩信息
        { 
          label: '奖惩1',
          children: [
            { prop: 'jcnd1', label: '奖惩年度', width: 150 },
            { prop: 'reward1', label: '奖励', width: 150 },
            { prop: 'punish1', label: '处罚', width: 150 }
          ]
        },
        { 
          label: '奖惩2',
          children: [
            { prop: 'jcnd2', label: '奖惩年度', width: 150 },
            { prop: 'reward2', label: '奖励', width: 150 },
            { prop: 'punish2', label: '处罚', width: 150 }
          ]
        },
        { 
          label: '奖惩3',
          children: [
            { prop: 'jcnd3', label: '奖惩年度', width: 150 },
            { prop: 'reward3', label: '奖励', width: 150 },
            { prop: 'punish3', label: '处罚', width: 150 }
          ]
        },
        
        // 学习经历
        { 
          label: '学习经历1',
          children: [
            { prop: 'school1', label: '毕业院校', width: 200 },
            { prop: 'major1', label: '专业', width: 150 },
            { prop: 'qijian1', label: '学习期间', width: 300 },
            { prop: 'xueli1', label: '学历', width: 150 }
          ]
        },
        { 
          label: '学习经历2',
          children: [
            { prop: 'school2', label: '毕业院校', width: 200 },
            { prop: 'major2', label: '专业', width: 150 },
            { prop: 'qijian2', label: '学习期间', width: 300 },
            { prop: 'xueli2', label: '学历', width: 150 }
          ]
        },
        { 
          label: '学习经历3',
          children: [
            { prop: 'school3', label: '毕业院校', width: 200 },
            { prop: 'major3', label: '专业', width: 150 },
            { prop: 'qijian3', label: '学习期间', width: 300 },
            { prop: 'xueli3', label: '学历', width: 150 }
          ]
        },
        
        // 工作经历
        { 
          label: '工作经历1',
          children: [
            { prop: 'gzqj1', label: '工作期间', width: 300 },
            { prop: 'zzdw1', label: '任职单位', width: 200 },
            { prop: 'job1', label: '职位', width: 150 }
          ]
        },
        { 
          label: '工作经历2',
          children: [
            { prop: 'gzqj2', label: '工作期间', width: 300 },
            { prop: 'zzdw2', label: '任职单位', width: 200 },
            { prop: 'job2', label: '职位', width: 150 }
          ]
        },
        { 
          label: '工作经历3',
          children: [
            { prop: 'gzqj3', label: '工作期间', width: 300 },
            { prop: 'zzdw3', label: '任职单位', width: 200 },
            { prop: 'job3', label: '职位', width: 150 }
          ]
        },
        { 
          label: '工作经历4',
          children: [
            { prop: 'gzqj4', label: '工作期间', width: 300 },
            { prop: 'zzdw4', label: '任职单位', width: 200 },
            { prop: 'job4', label: '职位', width: 150 }
          ]
        },
        { 
          label: '工作经历5',
          children: [
            { prop: 'gzqj5', label: '工作期间', width: 300 },
            { prop: 'zzdw5', label: '任职单位', width: 200 },
            { prop: 'job5', label: '职位', width: 150 }
          ]
        },
        
        { prop: 'zzmm', label: '政治面貌', width: 150 },
        { prop: 'address', label: '家庭住址（现住址）', width: 400 },
        { prop: 'id_card', label: '家庭住址(身份证)', width: 400 },
        { prop: 'jnzs', label: '技能证书', width: 150 },
        
        // 亲属关系
        { 
          label: '关系1',
          children: [
            { prop: 'qsxm1', label: '亲属姓名', width: 150 },
            { prop: 'sex1', label: '性别', width: 80 },
            { prop: 'minzu1', label: '民族', width: 100 },
            { prop: 'birth1', label: '出生年月', width: 150 },
            { prop: 'age1', label: '年龄', width: 80 },
            { prop: 'jiguan1', label: '籍贯', width: 150 },
            { prop: 'gzdw1', label: '工作单位/学校名称', width: 200 },
            { prop: 'zaizhi1', label: '在职状态', width: 150 },
            { prop: 'zhiwu1', label: '职务', width: 150 },
            { prop: 'xueli11', label: '学历', width: 150 }
          ]
        },
        { 
          label: '关系2',
          children: [
            { prop: 'qsxm2', label: '亲属姓名', width: 150 },
            { prop: 'sex2', label: '性别', width: 80 },
            { prop: 'minzu2', label: '民族', width: 100 },
            { prop: 'birth2', label: '出生年月', width: 150 },
            { prop: 'age2', label: '年龄', width: 80 },
            { prop: 'jiguan2', label: '籍贯', width: 150 },
            { prop: 'gzdw2', label: '工作单位/学校名称', width: 200 },
            { prop: 'zaizhi2', label: '在职状态', width: 150 },
            { prop: 'zhiwu2', label: '职务', width: 150 },
            { prop: 'xueli22', label: '学历', width: 150 }
          ]
        },
        { 
          label: '关系3',
          children: [
            { prop: 'qsxm3', label: '亲属姓名', width: 150 },
            { prop: 'sex3', label: '性别', width: 80 },
            { prop: 'minzu3', label: '民族', width: 100 },
            { prop: 'birth3', label: '出生年月', width: 150 },
            { prop: 'age3', label: '年龄', width: 80 },
            { prop: 'jiguan3', label: '籍贯', width: 150 },
            { prop: 'gzdw3', label: '工作单位/学校名称', width: 200 },
            { prop: 'zaizhi3', label: '在职状态', width: 150 },
            { prop: 'zhiwu3', label: '职务', width: 150 },
            { prop: 'xueli33', label: '学历', width: 150 }
          ]
        },
        { 
          label: '关系4',
          children: [
            { prop: 'qsxm4', label: '亲属姓名', width: 150 },
            { prop: 'sex4', label: '性别', width: 80 },
            { prop: 'minzu4', label: '民族', width: 100 },
            { prop: 'birth4', label: '出生年月', width: 150 },
            { prop: 'age4', label: '年龄', width: 80 },
            { prop: 'jiguan4', label: '籍贯', width: 150 },
            { prop: 'gzdw4', label: '工作单位/学校名称', width: 200 },
            { prop: 'zaizhi4', label: '在职状态', width: 150 },
            { prop: 'zhiwu4', label: '职务', width: 150 },
            { prop: 'xueli44', label: '学历', width: 150 }
          ]
        },
        { 
          label: '关系5',
          children: [
            { prop: 'qsxm5', label: '亲属姓名', width: 150 },
            { prop: 'sex5', label: '性别', width: 80 },
            { prop: 'minzu5', label: '民族', width: 100 },
            { prop: 'birth5', label: '出生年月', width: 150 },
            { prop: 'age5', label: '年龄', width: 80 },
            { prop: 'jiguan5', label: '籍贯', width: 150 },
            { prop: 'gzdw5', label: '工作单位/学校名称', width: 200 },
            { prop: 'zaizhi5', label: '在职状态', width: 150 },
            { prop: 'zhiwu5', label: '职务', width: 150 },
            { prop: 'xueli55', label: '学历', width: 150 }
          ]
        },
      ]
    }
  },
  computed: {
    availableYears() {
      const years = new Set([
        ...this.tableData.map(item => item.jcnd1), 
        ...this.tableData.map(item => item.jcnd2), 
        ...this.tableData.map(item => item.jcnd3)
      ].filter(Boolean));
      return Array.from(years).sort();
    },
    availableRewards() {
      const rewards = new Set([
        ...this.tableData.map(item => item.reward1), 
        ...this.tableData.map(item => item.reward2), 
        ...this.tableData.map(item => item.reward3)
      ].filter(Boolean));
      return Array.from(rewards).sort();
    },
    availablePunishments() {
      const punishments = new Set([
        ...this.tableData.map(item => item.punish1), 
        ...this.tableData.map(item => item.punish2), 
        ...this.tableData.map(item => item.punish3)
      ].filter(Boolean));
      return Array.from(punishments).sort();
    }
  },

  methods: {
    calculateAges() {
      
      console.log(this.tableData);
      this.tableData.forEach(item => {
        if (item.id_number) {
          const birthYear = parseInt(String(item.id_number).substring(6, 10), 10);
          const birthMonth = parseInt(String(item.id_number).substring(10, 12), 10);
          const birthDay = parseInt(String(item.id_number).substring(12, 14), 10);
          
          const today = new Date();
          let age = today.getFullYear() - birthYear;
          const m = today.getMonth() + 1;
          const d = today.getDate();
          
          if (m < birthMonth || (m === birthMonth && d < birthDay)) {
            age--;
          }
          item.age = age;
        }
      });
    },
    
    updateTableData(newData) {
      this.tableData = newData;
      this.calculateAges();
    },
    
    filterByYear(item) {
      if (this.selectedYear === '') return true;
      return item.jcnd1 === this.selectedYear || 
             item.jcnd2 === this.selectedYear || 
             item.jcnd3 === this.selectedYear;
    },
    
    filterByReward(item) {
      if (this.selectedReward === '') return true;
      return item.reward1 === this.selectedReward || 
             item.reward2 === this.selectedReward || 
             item.reward3 === this.selectedReward;
    },
    
    filterByPunish(item) {
      if (this.selectedPunish === '') return true;
      return item.punish1 === this.selectedPunish || 
             item.punish2 === this.selectedPunish || 
             item.punish3 === this.selectedPunish;
    }
  }
}
</script>