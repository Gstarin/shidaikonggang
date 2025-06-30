<template>
  <div id="app">
    <div class="container">
      <div class="box" v-for="(item, index) in boxes" :key="item.id">
		<img v-if="item.imageUrl" :src="item.imageUrl" class="avatar" @click="showForm(index)"/>
        <el-upload v-else
          class="avatar-uploader"
          :action="'https://jsonplaceholder.typicode.com/posts/'"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
		  :http-request="(res) => upload(res, index)"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="name">{{ item.name }}</div>
        <div class="delete-btn">
          <!-- <el-button type="danger" size="mini" @click="deleteBox(index)"
            >删除</el-button
          > -->
        </div>
      </div>
      <div class="add-btn">
        <el-button type="primary" @click="addBox">添加方框</el-button>
      </div>
    </div>
    <el-table v-if="showTableFlag" :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="Name" width="180"> </el-table-column>
      <el-table-column prop="imageUrl" label="Image" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" class="table-avatar" />
        </template>
      </el-table-column>
    </el-table>
	
	<el-dialog
	id="PerformanceTable"
	ref="myDialog"
	  title="员工信息"
	  :visible.sync="dialogVisible"
	  width="80%"
	  :before-close="handleClose"
	>
	  <el-form ref="form" :model="form" label-width="120px">
		<el-row :gutter="2">
		  <el-col :span="8">
			<el-form-item label="总序号">
			  <el-input v-model="form.id" />
			</el-form-item>
		  </el-col>
		  <el-col :span="8">
			<el-form-item label="内部序号">
			  <el-input v-model="form.internalId" />
			</el-form-item>
			
		  </el-col>
		  <el-col :span="8">
			
			<!-- <el-form-item label="合同所属公司">
			  <el-input v-model="form.company" />
			</el-form-item> -->
		  </el-col>
		</el-row>
		<el-row :gutter="20">
		  <el-col :span="8">
			<!-- <el-form-item label="所在部门">
			  <el-input v-model="form.department" />
			</el-form-item> -->
			<el-form-item label="姓名">
			  <el-input v-model="form.name" />
			</el-form-item>
			<el-form-item label="民族">
			  <el-input v-model="form.ethnicity" />
			</el-form-item>
		  </el-col>
		  <el-col :span="8">
			<!-- <el-form-item label="在职状态">
			  <el-select v-model="form.employmentStatus">
				<el-option label="在职" value="employed" />
				<el-option label="离职" value="resigned" />
			  </el-select>
			</el-form-item> -->

			
		  </el-col>
		  <el-col :span="8">
			<el-form-item label="性别">
			  <el-select v-model="form.gender">
				<el-option label="男" value="male" />
				<el-option label="女" value="female" />
			  </el-select>
			</el-form-item>
			<el-form-item label="出生年月">
			  <el-input v-model="form.chusheng" />
			  <!-- const birthYear = parseInt(String(this.tableData[i].id_number).substring(6, 10), 10);  
    const birthMonth = parseInt(String(this.tableData[i].id_number).substring(10, 12), 10);  
    const birthDay = parseInt(String(this.tableData[i].id_number).substring(12, 14), 10);   -->
			</el-form-item>
			<!-- <el-form-item label="招聘渠道">
			  <el-input v-model="form.recruitmentChannel" />
			</el-form-item> -->
		  </el-col>
		  <el-col :span="8">
		  <el-form-item label="">
			  <el-upload
				class="avatar-uploader"
				action="https://jsonplaceholder.typicode.com/posts/"
				:show-file-list="false"
				:on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload"
			  >
				<img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" @click="showForm()" />
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			  </el-upload>
			  
			</el-form-item>
			  </el-col>
		</el-row>
		<el-row :gutter="20">
		  <el-col :span="8">
			
			
			<el-form-item label="籍贯">
			  <el-input v-model="form.id_card" />
			</el-form-item>
			<el-form-item label="身高">
			  <el-input-number v-model="form.height" :min="150" :max="220" />
			</el-form-item>
			<el-form-item label="联系方式">
			  <el-input v-model="form.phone" />
			</el-form-item>
			
			<el-form-item label="家庭住址">
			  <el-input v-model="form.address" />
			</el-form-item>
			
		  </el-col>
		  <el-col :span="8">
			
			<el-form-item label="政治面貌">
			  <el-input v-model="form.zzmm" />
			</el-form-item>
			<el-form-item label="体重">
			  <el-input-number v-model="form.weight" :min="50" :max="200" />
			</el-form-item>
			<el-form-item label="身份证号">
			  <el-input v-model="form.idCard" />
			</el-form-item>

			<el-form-item label="技能证书">
			  <el-input v-model="form.jnzs" />
			</el-form-item>
			
		  </el-col>
		  <el-col :span="8">
			
		  </el-col>
		</el-row>
		<el-row :gutter="20">
		  <el-col :span="8">
			<!-- <el-form-item label="年龄">
			  <el-input-number v-model="form.age" :min="18" :max="100" />
			</el-form-item> -->
		  </el-col>
		  <el-col :span="8">
			
		  </el-col>
		  <el-col :span="8">
			
		  </el-col>
		</el-row>
		<el-row :gutter="20">
		  <el-col :span="8">
			<!-- <el-form-item label="最初合同签订时间" label-width="130px">
			  <el-date-picker v-model="form.firstContractDate" type="date" placeholder="选择日期" />
			</el-form-item>
		  </el-col>
		  <el-col :span="8">
			<el-form-item label="最新合同签订时间" label-width="130px">
			  <el-date-picker v-model="form.latestContractDate" type="date" placeholder="选择日期" />
			</el-form-item> -->
			
		  </el-col>
		  <el-col :span="8">
			
		  </el-col>
		</el-row>
		<el-row :gutter="20">
		  <el-col :span="8">
		
			
		  </el-col>
		  <el-col :span="8">
			
		  </el-col>
		  <!-- <el-col :span="8">
			  <el-form-item label="奖惩年度">
				<div v-for="(item, index) in form.jcnd" :key="'jcnd' + index" style="display: flex; align-items: center;">
				  <el-input v-model="form.jcnd[index]" style="flex: 1;"></el-input>
				  <el-button type="danger" icon="el-icon-delete" @click="removeJCND(index)" style="margin-left: 10px;"></el-button>
				</div>
				<el-button type="primary" icon="el-icon-plus" @click="addJCND" style="margin-top: 10px;">添加奖惩年度</el-button>
			  </el-form-item>
			</el-col>
		  </el-row>
		  <el-row :gutter="20">
			<el-col :span="8">
			  <el-form-item label="奖励">
				<div v-for="(item, index) in form.reward" :key="'reward' + index" style="display: flex; align-items: center;">
				  <el-input v-model="form.reward[index]" style="flex: 1;"></el-input>
				  <el-button type="danger" icon="el-icon-delete" @click="removeReward(index)" style="margin-left: 10px;"></el-button>
				</div>
				<el-button type="primary" icon="el-icon-plus" @click="addReward" style="margin-top: 10px;">添加奖励</el-button>
			  </el-form-item>
			</el-col>
			<el-col :span="8">
			  <el-form-item label="处罚">
				<div v-for="(item, index) in form.punishment" :key="'punishment' + index" style="display: flex; align-items: center;">
				  <el-input v-model="form.punishment[index]" style="flex: 1;"></el-input>
				  <el-button type="danger" icon="el-icon-delete" @click="removePunishment(index)" style="margin-left: 10px;"></el-button>
				</div>
				<el-button type="primary" icon="el-icon-plus" @click="addPunishment" style="margin-top: 10px;">添加处罚</el-button>
			  </el-form-item>

			</el-col> -->
		</el-row>

		<el-row>
        <el-col :span="24">
          <h3 style="color: black;">奖惩信息</h3>
          <!-- <el-button type="primary" @click="addRewardPunishment">添加</el-button> -->
          <el-table :data="form.jcnd" style="width: 100%">
            <el-table-column prop="year" label="奖惩年度" />
            <el-table-column prop="reward" label="奖励" />
            <el-table-column prop="punishment" label="处罚" />
            <!-- <el-table-column label="操作"> -->
              <template slot-scope="scope">
                <el-button type="danger" @click="removeRewardPunishment(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
		<el-row>
		  <el-col :span="24">
			<h3 style="color: black;">学习经历</h3>
			<!-- <el-button type="primary" @click="addEducation">添加</el-button> -->
			<el-table :data="form.educations" style="width: 100%">
			  <el-table-column prop="school" label="毕业院校" />
			  <el-table-column prop="major" label="专业" />
			  <el-table-column prop="startYear" label="开始年月" />
			  <el-table-column prop="endYear" label="结束年月" />
			  <!-- <el-table-column label="操作"> -->
				<template slot-scope="scope">
				  <el-button type="danger" @click="removeEducation(scope.row)">删除</el-button>
				</template>
			  </el-table-column>
			</el-table>
		  </el-col>
		</el-row>
		<el-row>
		  <el-col :span="24">
			<h3 style="color: black;">工作经历</h3>
			<!-- <el-button type="primary" @click="addWork">添加</el-button> -->
			<el-table :data="form.workExperiences" style="width: 100%">
			  <el-table-column prop="startYear" label="开始年月" />
			  <el-table-column prop="endYear" label="结束年月" />
			  <el-table-column prop="company" label="任职单位" />
			  <el-table-column prop="position" label="职位" />
			  <!-- <el-table-column label="操作"> -->
				<template slot-scope="scope">
				  <el-button type="danger" @click="removeWork(scope.row)">删除</el-button>
				</template>
			  </el-table-column>
			</el-table>
		  </el-col>
		</el-row>
		<el-row>
		  <el-col :span="24">
			<h3 style="color: black;">关系</h3>
			<!-- <el-button type="primary" @click="addRelation">添加</el-button> -->
			<el-table :data="form.relations" style="width: 100%">
			  <el-table-column prop="name" label="名称" />
			  <el-table-column prop="gender" label="性别" />
			  <el-table-column prop="ethnicity" label="民族" />
			  <el-table-column prop="birthDate" label="出生年月" />
			  <el-table-column prop="age" label="年龄" />
			  <el-table-column prop="birthPlace" label="籍贯" />
			  <el-table-column prop="workplace" label="工作单位/学校名称" />
			  <el-table-column prop="employmentStatus" label="在职状态" />
			  <el-table-column prop="position" label="职务" />
			  <el-table-column prop="education" label="学历" />
			  <!-- <el-table-column label="操作"> -->
				<template slot-scope="scope">
				  <el-button type="danger" @click="removeRelation(scope.row)">删除</el-button>
				</template>
			  </el-table-column>
			</el-table>
		  </el-col>
		</el-row>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
		<el-button  @click="export_pdf">导出 pdf</el-button>  
		<el-button @click="dialogVisible = false">取 消</el-button>
		<el-button type="primary" @click="onSubmit">确 定</el-button>
	  </span>
	</el-dialog>
	
  </div>
</template>



<script>

import {export_excel} from '@/utils/exportExcel.js'
import jsPDF from 'jspdf';  
import html2canvas from 'html2canvas';

import axios from '@/utils/axios.js'


export default {
  name: 'App',
  data() {
    return {
      boxes: [
        { id: 1, name: 'Box 1', imageUrl: '' },
        { id: 2, name: 'Box 2', imageUrl: '' },
        { id: 3, name: 'Box 3', imageUrl: '' },
      ],
      showTableFlag: false,
      tableData: [],
      nextId: 4,
	  dialogVisible: false,
	  form: {
		  id: '',
		  chusheng:'',
		  zzmm:"",
		  address:"",
		  id_card:"",
		  department: '',
		  company: '',
		  internalId: '',
		  name: '',
		  gender: 'male',
		  ethnicity: '',
		  phone: '',
		  idCard: '',
		  age: null,
		  height: null,
		  weight: null,
		  imageUrl: '',
		  firstContractDate: null,
		  recruitmentChannel: '',
		  latestContractDate: null,
		  employmentStatus: 'employed',
		  reward: [],  // 支持多个奖励
        punishment: [],  // 支持多个处罚
		  educations: [],
		  workExperiences: [],
		  relations: [],
		  rewardsAndPunishments: [], // 合并后的奖惩信息数组
		  jcnd: [],  // 支持多个奖惩年度,
		  jnzs:"",
		}
    };
  },

  mounted() {
	this.boxes=[]

	//读取员工数据
      axios.get('/api/data/grxx').then(response => {
        console.log('Fetched JSON:', response.data);
        this.tableData = response.data
             //计算年龄
             let i=0;
            for(i=0;i<this.tableData.length;i++)
        {


		this.boxes.push({id:0, name: '', imageUrl: '' })
		this.boxes[i].id=i+1;
		this.boxes[i].name=this.tableData[i].name;
		// this.boxes[i].imageUrl =  URL.createObjectURL(this.tableData[i].pic);
		this.boxes[i].imageUrl=this.tableData[i].pic;
        }


		
            for(i=0;i<this.tableData.length;i++)
        {
            // 提取出生年月日  
    const birthYear = parseInt(String(this.tableData[i].id_number).substring(6, 10), 10);  
    const birthMonth = parseInt(String(this.tableData[i].id_number).substring(10, 12), 10);  
    const birthDay = parseInt(String(this.tableData[i].id_number).substring(12, 14), 10);  
  
  
  this.tableData[i].chusheng=birthYear+"/"+birthMonth+"/"+birthDay;
  
        }

      }).catch(error => {
        console.error('Error fetching JSON:', error);
      });
console.log(this.boxes)

	 
    },


  methods: {
   //  handleAvatarSuccess(res, index) {
	  // console.log(this.boxes)
   //    this.$set(this.boxes[index], 'imageUrl', URL.createObjectURL(res.raw));
   //  },
   handleExportTable(table_id) {
            this.$nextTick(function () {
                export_excel(table_id)
            })

        },
		
	showForm(id){
	  this.dialogVisible = true;
	  const employeeData = this.tableData[id];
	  this.form.id=this.tableData[id].fx;
	  this.form.chusheng=this.tableData[id].chusheng;
	  this.form.zzmm=this.tableData[id].zzmm;
	  this.form.id_card=this.tableData[id].id_card;
	  this.form.address=this.tableData[id].address;
	  this.form.jnzs=this.tableData[id].jnzs;
	  this.form.department=this.tableData[id].bumen;
	  this.form.company=this.tableData[id].gongsi;
	  this.form.internalId=this.tableData[id].neibu;
	  this.form.name=this.tableData[id].name;
	  this.form.gender=this.tableData[id].sex;
	  this.form.ethnicity=this.tableData[id].minzu;
	  this.form.phone=this.tableData[id].phone;
	  this.form.idCard=this.tableData[id].id_number;
	  this.form.age=this.tableData[id].age;
	  this.form.height=this.tableData[id].height;
	  this.form.weight=this.tableData[id].weight;
	  this.form.imageUrl=this.tableData[id].pic;
	  this.form.firstContractDate=this.tableData[id].time1;
	  this.form.recruitmentChannel=this.tableData[id].zpqd;
	  this.form.latestContractDate=this.tableData[id].time2;
	  this.form.employmentStatus=this.tableData[id].zzzt;
	//   this.form.reward = employeeData.reward ? [employeeData.reward] : [];
    //   this.form.punishment = employeeData.punish ? [employeeData.punish] : [];
    //   this.form.jcnd = employeeData.jcnd ? [employeeData.jcnd] : [];
	this.form.jcnd =[]
	  this.form.educations=[]
	  this.form.workExperiences=[]
	  this.form.relations=[]

	 if(this.tableData[id].jcnd1!="")
 		{
        this.addJcnd();
        this.form.jcnd[0].year=this.tableData[id].jcnd1;
        this.form.jcnd[0].reward=this.tableData[id].reward1;
        this.form.jcnd[0].punishment=this.tableData[id].punish1;
     }
     if(this.tableData[id].jcnd2!="")
     {
        this.addJcnd();
        this.form.jcnd[1].year=this.tableData[id].jcnd2;
        this.form.jcnd[1].reward=this.tableData[id].reward2;
        this.form.jcnd[1].punishment=this.tableData[id].punish2;
     }
     if(this.tableData[id].jcnd3!="")
     {
        this.addJcnd();
        this.form.jcnd[2].year=this.tableData[id].jcnd3;
        this.form.jcnd[2].reward=this.tableData[id].reward3;
        this.form.jcnd[2].punishment=this.tableData[id].punish3;
     }


	 if(this.tableData[id].school1!="")
	 {
		this.addEducation();
		this.form.educations[0].school=this.tableData[id].school1;
		this.form.educations[0].major=this.tableData[id].major1;

		let index=this.tableData[id].qijian1.indexOf('-');
		this.form.educations[0].startYear=this.tableData[id].qijian1.slice(0,index);
		this.form.educations[0].endYear=this.tableData[id].qijian1.slice(index+1,);

	 }
	 if(this.tableData[id].school2!="")
	 {
		this.addEducation();
		this.form.educations[1].school=this.tableData[id].school2;
		this.form.educations[1].major=this.tableData[id].major2;

		let index=this.tableData[id].qijian2.indexOf('-');
		this.form.educations[1].startYear=this.tableData[id].qijian2.slice(0,index);
		this.form.educations[1].endYear=this.tableData[id].qijian2.slice(index+1,);

	 }
	 if(this.tableData[id].school3!="")
	 {
		this.addEducation();
		this.form.educations[2].school=this.tableData[id].school3;
		this.form.educations[2].major=this.tableData[id].major3;

		let index=this.tableData[id].qijian3.indexOf('-');
		this.form.educations[2].startYear=this.tableData[id].qijian3.slice(0,index);
		this.form.educations[2].endYear=this.tableData[id].qijian3.slice(index+1,);

	 }
	 if(this.tableData[id].job1!="")
	 {
		this.addWork();
		let index=this.tableData[id].gzqj1.indexOf('-');
		if(index==-1){ index=this.tableData[id].gzqj1.length-3;this.form.workExperiences[0].startYear=this.tableData[id].gzqj1.slice(0,index+1);}
		else this.form.workExperiences[0].startYear=this.tableData[id].gzqj1.slice(0,index);

		
		this.form.workExperiences[0].endYear=this.tableData[id].gzqj1.slice(index+1,);
		this.form.workExperiences[0].company=this.tableData[id].zzdw1;
		this.form.workExperiences[0].position=this.tableData[id].job1;
	 }
	 if(this.tableData[id].job2!="")
	 {
		this.addWork();
		let index=this.tableData[id].gzqj2.indexOf('-');
		if(index==-1){ index=this.tableData[id].gzqj2.length-3;this.form.workExperiences[1].startYear=this.tableData[id].gzqj2.slice(0,index+1);}
		else this.form.workExperiences[1].startYear=this.tableData[id].gzqj2.slice(0,index);
		this.form.workExperiences[1].endYear=this.tableData[id].gzqj2.slice(index+1,);
		this.form.workExperiences[1].company=this.tableData[id].zzdw2;
		this.form.workExperiences[1].position=this.tableData[id].job2;
	 }
	 else
	 {
		this.form.workExperiences[0].endYear="至今";
	 }
	 if(this.tableData[id].job3!="")
	 {
		this.addWork();
		let index=this.tableData[id].gzqj3.indexOf('-');
		if(index==-1){ index=this.tableData[id].gzqj3.length-3;this.form.workExperiences[2].startYear=this.tableData[id].gzqj3.slice(0,index+1);}
		else this.form.workExperiences[2].startYear=this.tableData[id].gzqj3.slice(0,index);
		this.form.workExperiences[2].endYear=this.tableData[id].gzqj3.slice(index+1,);
		this.form.workExperiences[2].company=this.tableData[id].zzdw3;
		this.form.workExperiences[2].position=this.tableData[id].job3;
	 }
	 else
	 {
		this.form.workExperiences[1].endYear="至今";
	 }
	 if(this.tableData[id].job4!="")
	 {
		this.addWork();
		let index=this.tableData[id].gzqj4.indexOf('-');
		if(index==-1){ index=this.tableData[id].gzqj4.length-3;this.form.workExperiences[3].startYear=this.tableData[id].gzqj4.slice(0,index+1);}
		else this.form.workExperiences[3].startYear=this.tableData[id].gzqj4.slice(0,index);
		this.form.workExperiences[3].endYear=this.tableData[id].gzqj4.slice(index+1,);
		this.form.workExperiences[3].company=this.tableData[id].zzdw4;
		this.form.workExperiences[3].position=this.tableData[id].job4;
	 }
	 else
	 {
		this.form.workExperiences[2].endYear="至今";
	 }
	 if(this.tableData[id].job5!="")
	 {
		this.addWork();
		let index=this.tableData[id].gzqj5.indexOf('-');
		if(index==-1){ index=this.tableData[id].gzqj5.length-3;this.form.workExperiences[4].startYear=this.tableData[id].gzqj5.slice(0,index+1);}
		else this.form.workExperiences[4].startYear=this.tableData[id].gzqj5.slice(0,index);
		this.form.workExperiences[4].endYear="至今";
		if(this.tableData[id].job5=="-")
		this.form.workExperiences[4].endYear="-";
		this.form.workExperiences[4].company=this.tableData[id].zzdw5;
		this.form.workExperiences[4].position=this.tableData[id].job5;
	 }
	 else
	 {
		this.form.workExperiences[3].endYear="至今";
	 }
	 if(this.tableData[id].qsxm1!="")
	 {
		this.addRelation();
		this.form.relations[0].name=this.tableData[id].qsxm1;
		this.form.relations[0].gender=this.tableData[id].sex1;
		this.form.relations[0].ethnicity=this.tableData[id].minzu1;
		this.form.relations[0].birthDate=this.tableData[id].birth1;
		this.form.relations[0].age=this.tableData[id].age1;
		this.form.relations[0].birthPlace=this.tableData[id].jiguan1;
		this.form.relations[0].workplace=this.tableData[id].gzdw1;
		this.form.relations[0].employmentStatus=this.tableData[id].zaizhi1;
		this.form.relations[0].position=this.tableData[id].zhiwu1;
		this.form.relations[0].education=this.tableData[id].xueli11;
	
	 }
	 	 
	 if(this.tableData[id].qsxm2!="")
	 {
		this.addRelation();
		this.form.relations[1].name=this.tableData[id].qsxm2;
		this.form.relations[1].gender=this.tableData[id].sex2;
		this.form.relations[1].ethnicity=this.tableData[id].minzu2;
		this.form.relations[1].birthDate=this.tableData[id].birth2;
		this.form.relations[1].age=this.tableData[id].age2;
		this.form.relations[1].birthPlace=this.tableData[id].jiguan2;
		this.form.relations[1].workplace=this.tableData[id].gzdw2;
		this.form.relations[1].employmentStatus=this.tableData[id].zaizhi2;
		this.form.relations[1].position=this.tableData[id].zhiwu2;
		this.form.relations[1].education=this.tableData[id].xueli22;
	
	 }
	 	 
	 if(this.tableData[id].qsxm3!="")
	 {
		this.addRelation();
		this.form.relations[2].name=this.tableData[id].qsxm3;
		this.form.relations[2].gender=this.tableData[id].sex3;
		this.form.relations[2].ethnicity=this.tableData[id].minzu3;
		this.form.relations[2].birthDate=this.tableData[id].birth3;
		this.form.relations[2].age=this.tableData[id].age3;
		this.form.relations[2].birthPlace=this.tableData[id].jiguan3;
		this.form.relations[2].workplace=this.tableData[id].gzdw3;
		this.form.relations[2].employmentStatus=this.tableData[id].zaizhi3;
		this.form.relations[2].position=this.tableData[id].zhiwu3;
		this.form.relations[2].education=this.tableData[id].xueli33;
	
	 }
	 	 
	 if(this.tableData[id].qsxm4!="")
	 {
		this.addRelation();
		this.form.relations[3].name=this.tableData[id].qsxm4;
		this.form.relations[3].gender=this.tableData[id].sex4;
		this.form.relations[3].ethnicity=this.tableData[id].minzu4;
		this.form.relations[3].birthDate=this.tableData[id].birth4;
		this.form.relations[3].age=this.tableData[id].age4;
		this.form.relations[3].birthPlace=this.tableData[id].jiguan4;
		this.form.relations[3].workplace=this.tableData[id].gzdw4;
		this.form.relations[3].employmentStatus=this.tableData[id].zaizhi4;
		this.form.relations[3].position=this.tableData[id].zhiwu4;
		this.form.relations[3].education=this.tableData[id].xueli44;
	
	 }
	 	 
	 if(this.tableData[id].qsxm5!="")
	 {
		this.addRelation();
		this.form.relations[4].name=this.tableData[id].qsxm5;
		this.form.relations[4].gender=this.tableData[id].sex5;
		this.form.relations[4].ethnicity=this.tableData[id].minzu5;
		this.form.relations[4].birthDate=this.tableData[id].birth5;
		this.form.relations[4].age=this.tableData[id].age5;
		this.form.relations[4].birthPlace=this.tableData[id].jiguan5;
		this.form.relations[4].workplace=this.tableData[id].gzdw5;
		this.form.relations[4].employmentStatus=this.tableData[id].zaizhi5;
		this.form.relations[4].position=this.tableData[id].zhiwu5;
		this.form.relations[4].education=this.tableData[id].xueli55;
	
	 }




	
	},
	async export_pdf(){

		const dialog = this.$refs.myDialog.$el;
  const dialogBody = dialog.querySelector('.el-dialog__body');

  const totalHeight = dialogBody.scrollHeight;
  const totalWidth = dialogBody.scrollWidth;

  // 确保对整个内容进行捕获
  const canvas = await html2canvas(dialogBody, {
    scale: 2,
    useCORS: true,
    width: (totalWidth+500),
    height: totalHeight
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [totalWidth, totalHeight]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, totalWidth, totalHeight);
  pdf.save('dialog_content.pdf');
	},
	addJCND() {
      this.form.jcnd.push('');
    },
    
    removeJCND(index) {
      this.form.jcnd.splice(index, 1);
    },
    
    addReward() {
      this.form.reward.push('');
    },
    
    removeReward(index) {
      this.form.reward.splice(index, 1);
    },
    
    addPunishment() {
      this.form.punishment.push('');
    },
    
    removePunishment(index) {
      this.form.punishment.splice(index, 1);
    },
	
	upload(res, index){
	  console.log(this.dialogVisible)
	  console.log(this.boxes, res, index)
	  this.boxes[index].imageUrl =  URL.createObjectURL(res.file);
	},
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
	  const isImage = ['image/jpeg', 'image/png', 'image/gif'].includes(
		file.type
	  );
	  if (!isLt2M) {
		this.$message.error('上传图片大小不能超过 2MB!');
	  }
	  if (!isImage) {
		this.$message.error('上传文件必须是图片格式!');
	  }
	  return isLt2M && isImage;
    },
    showTable() {
      this.showTableFlag = true;
      this.tableData = this.boxes.map((item) => ({
        name: item.name,
        imageUrl: item.imageUrl,
      }));
    },
    addBox() {
      this.boxes.push({
        id: this.nextId++,
        name: `Box ${this.nextId}`,
        imageUrl: '',
      });
    },
    deleteBox(index) {
      this.boxes.splice(index, 1);
    },
	handleClose(done) {
	  this.$confirm('确认关闭？')
		.then(_ => {
		  done()
		})
		.catch(_ => {})
	},
	addJcnd(){
		this.form.jcnd.push({
		year: '',
		reward:'',
		punishment: '',

	  })
	},
	addEducation() {
	  this.form.educations.push({
		school: '',
		major: '',
		startYear: null,
		endYear: null
	  })
	},
	removeEducation(row) {
	  const index = this.form.educations.indexOf(row)
	  if (index !== -1) {
		this.form.educations.splice(index, 1)
	  }
	},
	addWork() {
	  this.form.workExperiences.push({
		startYear: null,
		endYear: null,
		company: '',
		position: ''
	  })
	},
	removeWork(row) {
	  const index = this.form.workExperiences.indexOf(row)
	  if (index !== -1) {
		this.form.workExperiences.splice(index, 1)
	  }
	},
	addRelation() {
	  this.form.relations.push({
		name: '',
		gender: 'male',
		ethnicity: '',
		birthDate: null,
		age: null,
		birthPlace: '',
		workplace: '',
		employmentStatus: 'employed',
		position: '',
		education: ''
	  })
	},
	removeRelation(row) {
	  const index = this.form.relations.indexOf(row)
	  if (index !== -1) {
		this.form.relations.splice(index, 1)
	  }
	},
	onSubmit() {
	  console.log(this.form)
	  this.dialogVisible = false
	},
	addRewardPunishment() {
      this.form.jcnd.push({
        year: '',
        reward: '',
        punishment: ''
      });
    },
    
    removeRewardPunishment(row) {
      const index = this.form.jcnd.indexOf(row);
      if (index !== -1) {
        this.form.jcnd.splice(index, 1);
      }
    },

  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/app';


// .el-form-item{
// 	  width: 50px;
// }
.table-photo {
  width: 50px;
  height: 50px;
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.box {
  width: 150px;
  height: 200px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.name {
  margin-top: 10px;
}
.table-avatar {
  width: 50px;
  height: 50px;
}
.add-btn {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
</style>