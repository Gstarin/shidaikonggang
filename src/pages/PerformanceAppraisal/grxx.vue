<template>
    <div class="tables-basic">
      <b-breadcrumb>
        <b-breadcrumb-item>绩效考核</b-breadcrumb-item>
        <b-breadcrumb-item active>个人信息</b-breadcrumb-item>
      </b-breadcrumb>
      <!-- <h2 class="page-title">市政公司支出信息</h2> -->
      <b-row>
        <b-col>
          <Widget title="<h5>档案信息</h5>" customHeader settings close>
            <div class="table-header">
              <b-form-file v-model="file" placeholder="请选择一个Excel文件" style="margin-right: 15px;width: 50%"></b-form-file>
              <b-button variant="default" class="mr-3" size="sm" @click="parseExcel"
                style="width: 110px;height: 35px;">解析Excel</b-button>
              <!-- <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;">导出Excel</b-button> -->
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="submitForm">增加</b-button>
              <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"  @click="handleDelete">删除</b-button>
              <!-- <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;"  @click="exportExcel">test</b-button> -->
              
              <b-input type="text" v-model="search" style="width: 360px;height: 35px;margin:0 15px;"
              placeholder="Search..." />
             
            </div>
            <div class="table-header">
              <span>选择年度：</span>
              <el-select v-model="selectedYear" placeholder="选择年度" style="width: 120px; margin-right: 15px;">
              <el-option
                value=""
                label="全部">
              </el-option>
              <el-option
                v-for="year in availableYears"
                :key="year"
                :label="year"
                :value="year">
              </el-option>
            </el-select>
            <span>选择奖励：</span>
            <el-select v-model="selectedReward" placeholder="选择奖励" style="width: 120px; margin-right: 15px;">
        <el-option value="" label="全部"></el-option>
        <el-option v-for="reward in availableRewards" :key="reward" :label="reward" :value="reward"></el-option>
      </el-select>
      <span>选择处罚：</span>
      <el-select v-model="selectedPunish" placeholder="选择处罚" style="width: 120px; margin-right: 15px;">
        <el-option value="" label="全部"></el-option>
        <el-option v-for="punish in availablePunishments" :key="punish" :label="punish" :value="punish"></el-option>
      </el-select>
      <b-button variant="default" class="mr-3" size="sm"
      style="width: 110px;height: 35px;"  @click="handleExportTable('grxx')">导出Excel</b-button>
            </div>
            <div id="table" >
              <el-table :data="current" style="width: 100%; text-align: center" class="custom-table"   @selection-change="handleSelectionChange"  height="650"  id="educe-table">
                <el-table-column type="selection" fixed>
  
                </el-table-column>
                <el-table-column prop="fx" label="总序号" fixed>
                  <template slot-scope="scope">  
     
     <el-input v-model="scope.row.fx"></el-input>  
   </template>
  </el-table-column>
        
                <el-table-column prop="bumen" label="所在部门 " fixed width=140>
                  <template slot-scope="scope">  
     
      <el-input type="textarea" v-model="scope.row.bumen"></el-input>  
    </template>
                </el-table-column>
                <el-table-column prop="gongsi" label="合同所属公司" fixed width=200>  
    <template v-slot="scope">  
      <el-input  type="textarea"  v-model="scope.row.gongsi"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="neibu" label="内部序号" fixed>  
    <template v-slot="scope">  
      <el-input v-model="scope.row.neibu"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="name" label="姓名" fixed width=100>  
    <template v-slot="scope">  
      <el-input v-model="scope.row.name"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="sex" label="性别" >  
    <template v-slot="scope">  
      <el-input v-model="scope.row.sex"></el-input>  
    </template>  
  </el-table-column>
  
  
  <el-table-column prop="minzu" label="民族" >  
    <template v-slot="scope">  
      <el-input v-model="scope.row.minzu"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="phone" label="电话"  width=150>  
    <template v-slot="scope">  
      <el-input   v-model="scope.row.phone"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="id_number"    label="身份证号"  width=200>  
    <template v-slot="scope">  
      <el-input  v-model="scope.row.id_number"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="age" label="年龄" width="120">  
    <template v-slot="scope">  
      <el-input v-model="scope.row.age" type="number"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="height" label="身高"  width="120">  
    <template v-slot="scope">  
      <el-input v-model="scope.row.height" type="number"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="weight" label="体重"  width="120">  
    <template v-slot="scope">  
      <el-input v-model="scope.row.weight" type="number"></el-input>  
    </template>  
  </el-table-column> 
  
  <el-table-column prop="pic" label="照片" >
  <template #default="scope">  
    <div v-if="scope.row.isEditing" style="width: 2000px;">
            <b-form-file
              v-model="scope.row.pic"
              @change="handlePictureChange($event, scope.row)"
              accept="image/*"
              plain
            ></b-form-file>
            </div>
            <div v-else  @dblclick="toggleEditing(scope.row)">
            <img 
              class="img-rounded"
              :src="scope.row.pic"
              alt=""
              height="50"
            />
            </div>
  
  </template>  
  </el-table-column>
  <el-table-column prop="time1" label="最初合同签订时间"  width=150>  
    <template v-slot="scope">  
      <el-input v-model="scope.row.time1"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="zpqd" label="招聘渠道" width=150>  
    <template v-slot="scope">  
      <el-input v-model="scope.row.zpqd"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="time2" label="最新合同签订时间"  width=150>  
    <template v-slot="scope">  
      <el-input v-model="scope.row.time2"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="zzzt" label="在职状态" width=150>  
    <template v-slot="scope">  
      <el-input v-model="scope.row.zzzt"></el-input>  
    </template>  
  </el-table-column>  
 
  <el-table-column label="奖惩1">
          <el-table-column prop="jcnd1" label="奖惩年度"width=150>
            <template v-slot="scope">
              <el-input v-model="scope.row.jcnd1"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="reward1" label="奖励"width=150>
            <template v-slot="scope">
              <el-input v-model="scope.row.reward1"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="punish1" label="处罚"width=150>
            <template v-slot="scope">
              <el-input v-model="scope.row.punish1"></el-input>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="奖惩2">
          <el-table-column prop="jcnd2" label="奖惩年度"width=150>
            <template v-slot="scope">
              <el-input v-model="scope.row.jcnd2"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="reward2" label="奖励"width=150>
            <template v-slot="scope">
              <el-input v-model="scope.row.reward2"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="punish2" label="处罚"width=150>
            <template v-slot="scope">
              <el-input v-model="scope.row.punish2"></el-input>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="奖惩3">
          <el-table-column prop="jcnd3" label="奖惩年度"width=150>
            <template v-slot="scope">
              <el-input v-model="scope.row.jcnd3"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="reward3" label="奖励"width=150>
            <template v-slot="scope">
              <el-input v-model="scope.row.reward3"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="punish3" label="处罚"width=150>
            <template v-slot="scope">
              <el-input v-model="scope.row.punish3"></el-input>
            </template>
          </el-table-column>
        </el-table-column>
  
  <el-table-column label="学习经历1">  
        <el-table-column prop="school1" label="毕业院校"width=200>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.school1"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="major1" label="专业"width=150>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.major1"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="qijian1" label="学习期间"width=300>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.qijian1"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="xueli1" label="学历"width=150>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.xueli1"></el-input>  
            </template>  
        </el-table-column>  
    </el-table-column>  
              
    <el-table-column label="学习经历2">  
        <el-table-column prop="school2" label="毕业院校"width=200>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.school2"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="major2" label="专业"width=150>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.major2"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="qijian2" label="学习期间"width=300>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.qijian2"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="xueli2" label="学历"width=150>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.xueli2"></el-input>  
            </template>  
        </el-table-column>  
    </el-table-column>  
  
    <el-table-column label="学习经历3">  
        <el-table-column prop="school3" label="毕业院校"width=200>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.school3"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="major3" label="专业"width=150>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.major3"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="qijian3" label="学习期间"width=300>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.qijian3"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="xueli3" label="学历"width=150>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.xueli3"></el-input>  
            </template>  
        </el-table-column>  
    </el-table-column>  
  
  
        <el-table-column label="工作经历1">  
        <el-table-column prop="gzqj1" label="工作期间"width=300>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.gzqj1"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="zzdw1" label="任职单位"width=200>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.zzdw1"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="job1" label="职位"width=150>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.job1"></el-input>  
            </template>  
        </el-table-column>  
    </el-table-column>  
  
    <el-table-column label="工作经历2">  
        <el-table-column prop="gzqj2" label="工作期间"width=300>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.gzqj2"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="zzdw2" label="任职单位"width=200>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.zzdw2"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="job2" label="职位"width=150>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.job2"></el-input>  
            </template>  
        </el-table-column>  
    </el-table-column>  
  
            
    <el-table-column label="工作经历3">  
        <el-table-column prop="gzqj3" label="工作期间"width=300>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.gzqj3"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="zzdw3" label="任职单位"width=200>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.zzdw3"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="job3" label="职位"width=150>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.job3"></el-input>  
            </template>  
        </el-table-column>  
    </el-table-column>  
            
    <el-table-column label="工作经历4">  
        <el-table-column prop="gzqj4" label="工作期间"width=300>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.gzqj4"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="zzdw4" label="任职单位"width=200>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.zzdw4"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="job4" label="职位"width=150>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.job4"></el-input>  
            </template>  
        </el-table-column>  
    </el-table-column>  
  
            
    <el-table-column label="工作经历5">  
        <el-table-column prop="gzqj5" label="工作期间"width=300>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.gzqj5"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="zzdw5" label="任职单位"width=200>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.zzdw5"></el-input>  
            </template>  
        </el-table-column>  
        <el-table-column prop="job5" label="职位"width=150>  
            <template v-slot="scope">  
                <el-input v-model="scope.row.job5"></el-input>  
            </template>  
        </el-table-column>  
    </el-table-column>  
  
    <el-table-column prop="zzmm" label="政治面貌"width=150>  
        <template v-slot="scope">  
            <el-input v-model="scope.row.zzmm"></el-input>  
        </template>  
    </el-table-column>  
  
    <el-table-column prop="address" label="家庭住址（现住址）"width=400>  
        <template v-slot="scope">  
            <el-input v-model="scope.row.address"></el-input>  
        </template>  
    </el-table-column>  
  
    <el-table-column prop="id_card" label="家庭住址(身份证)"width=400>  
        <template v-slot="scope">  
            <el-input v-model="scope.row.id_card"></el-input>  
        </template>  
    </el-table-column>  
  
    <el-table-column prop="jnzs" label="技能证书"width=150>  
        <template v-slot="scope">  
            <el-input v-model="scope.row.jnzs"></el-input>  
        </template>  
    </el-table-column> 
  
               
          
  
            <el-table-column label="关系1">
                <el-table-column prop="qsxm1" label="亲属姓名"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.qsxm1"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="sex1" label="性别"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.sex1"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="minzu1" label="民族"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.minzu1"></el-input>  
        </template>  
                </el-table-column>
  
                <el-table-column prop="birth1" label="出生年月"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.birth1"></el-input>  
        </template>  
                </el-table-column>
  
  
                <el-table-column prop="age1" label="年龄"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.age1"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="jiguan1" label="籍贯"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.jiguan1"></el-input>  
        </template>  
                </el-table-column>
  
  
                <el-table-column prop="gzdw1" label="工作单位/学校名称"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.gzdw1"></el-input>  
        </template>           
                </el-table-column>
                <el-table-column prop="zaizhi1" label="在职状态"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.zaizhi1"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="zhiwu1" label="职务"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.zhiwu1"></el-input>  
        </template>  
                </el-table-column>
  
                <el-table-column prop="xueli11" label="学历"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.xueli11"></el-input>  
        </template>  
                </el-table-column>
  
            </el-table-column>
  
  
            <el-table-column label="关系2">
                <el-table-column prop="qsxm2" label="亲属姓名"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.qsxm2"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="sex2" label="性别"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.sex2"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="minzu2" label="民族"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.minzu2"></el-input>  
        </template>  
                </el-table-column>
  
                <el-table-column prop="birth2" label="出生年月"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.birth2"></el-input>  
        </template>  
                </el-table-column>
  
  
                <el-table-column prop="age2" label="年龄"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.age2"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="jiguan2" label="籍贯"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.jiguan2"></el-input>  
        </template>  
                </el-table-column>
  
  
                <el-table-column prop="gzdw2" label="工作单位/学校名称"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.gzdw2"></el-input>  
        </template>           
                </el-table-column>
                <el-table-column prop="zaizhi2" label="在职状态"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.zaizhi2"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="zhiwu2" label="职务"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.zhiwu2"></el-input>  
        </template>  
                </el-table-column>
  
                <el-table-column prop="xueli22" label="学历"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.xueli22"></el-input>  
        </template>  
                </el-table-column>
  
            </el-table-column>
            <el-table-column label="关系3">
                <el-table-column prop="qsxm3" label="亲属姓名"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.qsxm3"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="sex3" label="性别"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.sex3"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="minzu3" label="民族"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.minzu3"></el-input>  
        </template>  
                </el-table-column>
  
                <el-table-column prop="birth3" label="出生年月"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.birth3"></el-input>  
        </template>  
                </el-table-column>
  
  
                <el-table-column prop="age3" label="年龄"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.age3"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="jiguan3" label="籍贯"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.jiguan3"></el-input>  
        </template>  
                </el-table-column>
  
  
                <el-table-column prop="gzdw3" label="工作单位/学校名称"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.gzdw3"></el-input>  
        </template>           
                </el-table-column>
                <el-table-column prop="zaizhi3" label="在职状态"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.zaizhi3"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="zhiwu3" label="职务"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.zhiwu3"></el-input>  
        </template>  
                </el-table-column>
  
                <el-table-column prop="xueli33" label="学历"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.xueli33"></el-input>  
        </template>  
                </el-table-column>
  
            </el-table-column>
            <el-table-column label="关系4">
                <el-table-column prop="qsxm4" label="亲属姓名"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.qsxm4"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="sex4" label="性别"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.sex4"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="minzu4" label="民族"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.minzu4"></el-input>  
        </template>  
                </el-table-column>
  
                <el-table-column prop="birth4" label="出生年月"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.birth4"></el-input>  
        </template>  
                </el-table-column>
  
  
                <el-table-column prop="age4" label="年龄"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.age4"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="jiguan4" label="籍贯"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.jiguan4"></el-input>  
        </template>  
                </el-table-column>
  
  
                <el-table-column prop="gzdw4" label="工作单位/学校名称"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.gzdw4"></el-input>  
        </template>           
                </el-table-column>
                <el-table-column prop="zaizhi4" label="在职状态"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.zaizhi4"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="zhiwu4" label="职务"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.zhiwu4"></el-input>  
        </template>  
                </el-table-column>
  
                <el-table-column prop="xueli44" label="学历"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.xueli44"></el-input>  
        </template>  
                </el-table-column>
  
            </el-table-column>
  
            <el-table-column label="关系5">
                <el-table-column prop="qsxm5" label="亲属姓名"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.qsxm5"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="sex5" label="性别"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.sex5"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="minzu5" label="民族"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.minzu5"></el-input>  
        </template>  
                </el-table-column>
  
                <el-table-column prop="birth5" label="出生年月"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.birth5"></el-input>  
        </template>  
                </el-table-column>
  
  
                <el-table-column prop="age5" label="年龄"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.age5"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="jiguan5" label="籍贯"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.jiguan5"></el-input>  
        </template>  
                </el-table-column>
  
  
                <el-table-column prop="gzdw5" label="工作单位/学校名称"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.gzdw5"></el-input>  
        </template>           
                </el-table-column>
                <el-table-column prop="zaizhi5" label="在职状态"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.zaizhi5"></el-input>  
        </template>  
                </el-table-column>
                <el-table-column prop="zhiwu5" label="职务"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.zhiwu5"></el-input>  
        </template>  
                </el-table-column>
  
                <el-table-column prop="xueli55" label="学历"width=150>
                  <template v-slot="scope">  
            <el-input v-model="scope.row.xueli55"></el-input>  
        </template>  
                </el-table-column>
  
            </el-table-column>
  
  
  
  
  
              </el-table>

              <el-table :data="current" style="width: 100%; display: none;text-align: center" class="custom-table"   @selection-change="handleSelectionChange"  height="650"  id="grxx">
                <el-table-column type="selection" >
  
                </el-table-column>
                <el-table-column prop="fx" label="总序号" >
                 
  </el-table-column>
        
                <el-table-column prop="bumen" label="所在部门 "  width=140>
                 
                </el-table-column>
                <el-table-column prop="gongsi" label="合同所属公司" width=140>  
  
  </el-table-column>  
  <el-table-column prop="neibu" label="内部序号" >  
  
  </el-table-column>  
  <el-table-column prop="name" label="姓名"  width=100>  
    
  </el-table-column>  
  <el-table-column prop="sex" label="性别" >  
 
  </el-table-column>
  
  
  <el-table-column prop="minzu" label="民族" >  
   
  </el-table-column>  
  <el-table-column prop="phone" label="电话"  width=150>  
    <template v-slot="scope">  
      <el-input   v-model="scope.row.phone"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="id_number"    label="身份证号"  width=200>  
    <template v-slot="scope">  
      <el-input  v-model="scope.row.id_number"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="age" label="年龄" width="90">  
    <template v-slot="scope">  
      <el-input v-model="scope.row.age" type="number"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="height" label="身高"  width="90">  
    <template v-slot="scope">  
      <el-input v-model="scope.row.height" type="number"></el-input>  
    </template>  
  </el-table-column>  
  <el-table-column prop="weight" label="体重"  width="90">  
    <template v-slot="scope">  
      <el-input v-model="scope.row.weight" type="number"></el-input>  
    </template>  
  </el-table-column> 
  
  <el-table-column prop="pic" label="照片" >
  <template #default="scope">  
    <div v-if="scope.row.isEditing" style="width: 2000px;">
            <b-form-file
              v-model="scope.row.pic"
              @change="handlePictureChange($event, scope.row)"
              accept="image/*"
              plain
            ></b-form-file>
            </div>
            <div v-else  @dblclick="toggleEditing(scope.row)">
            <img 
              class="img-rounded"
              :src="scope.row.pic"
              alt=""
              height="50"
            />
            </div>
  
  </template>  
  </el-table-column>
  <el-table-column prop="time1" label="最初合同签订时间"  width=150>  
   
  </el-table-column>  
  <el-table-column prop="zpqd" label="招聘渠道">  
    
  </el-table-column>  
  <el-table-column prop="time2" label="最新合同签订时间"  width=150>  
     
  </el-table-column>  
  <el-table-column prop="zzzt" label="在职状态">  
   
  </el-table-column>  
 
  <el-table-column label="奖惩1">
          <el-table-column prop="jcnd1" label="奖惩年度">
           
          </el-table-column>
          <el-table-column prop="reward1" label="奖励">
            
          </el-table-column>
          <el-table-column prop="punish1" label="处罚">
           
          </el-table-column>
        </el-table-column>

        <el-table-column label="奖惩2">
          <el-table-column prop="jcnd2" label="奖惩年度">
           
          </el-table-column>
          <el-table-column prop="reward2" label="奖励">
           
          </el-table-column>
          <el-table-column prop="punish2" label="处罚">
            
          </el-table-column>
        </el-table-column>

        <el-table-column label="奖惩3">
          <el-table-column prop="jcnd3" label="奖惩年度">
           
          </el-table-column>
          <el-table-column prop="reward3" label="奖励">
           
          </el-table-column>
          <el-table-column prop="punish3" label="处罚">
          
          </el-table-column>
        </el-table-column>
  
  <el-table-column label="学习经历1">  
        <el-table-column prop="school1" label="毕业院校">  
           
        </el-table-column>  
        <el-table-column prop="major1" label="专业">  
           
        </el-table-column>  
        <el-table-column prop="qijian1" label="学习期间">  
           
        </el-table-column>  
        <el-table-column prop="xueli1" label="学历">  
           
        </el-table-column>  
    </el-table-column>  
              
    <el-table-column label="学习经历2">  
        <el-table-column prop="school2" label="毕业院校">  
           
        </el-table-column>  
        <el-table-column prop="major2" label="专业">  
           
        </el-table-column>  
        <el-table-column prop="qijian2" label="学习期间">  
            
        </el-table-column>  
        <el-table-column prop="xueli2" label="学历">  
          
        </el-table-column>  
    </el-table-column>  
  
    <el-table-column label="学习经历3">  
        <el-table-column prop="school3" label="毕业院校">  
           
        </el-table-column>  
        <el-table-column prop="major3" label="专业">  
           
        </el-table-column>  
        <el-table-column prop="qijian3" label="学习期间">  
           
        </el-table-column>  
        <el-table-column prop="xueli3" label="学历">  
           
        </el-table-column>  
    </el-table-column>  
  
  
        <el-table-column label="工作经历1">  
        <el-table-column prop="gzqj1" label="工作期间">  
           
        </el-table-column>  
        <el-table-column prop="zzdw1" label="任职单位">  
           
        </el-table-column>  
        <el-table-column prop="job1" label="职位">  
          
        </el-table-column>  
    </el-table-column>  
  
    <el-table-column label="工作经历2">  
        <el-table-column prop="gzqj2" label="工作期间">  
          
        </el-table-column>  
        <el-table-column prop="zzdw2" label="任职单位">  
            
        </el-table-column>  
        <el-table-column prop="job2" label="职位">  
             
        </el-table-column>  
    </el-table-column>  
  
            
    <el-table-column label="工作经历3">  
        <el-table-column prop="gzqj3" label="工作期间">  
            
        </el-table-column>  
        <el-table-column prop="zzdw3" label="任职单位">  
           
        </el-table-column>  
        <el-table-column prop="job3" label="职位">  
           
        </el-table-column>  
    </el-table-column>  
            
    <el-table-column label="工作经历4">  
        <el-table-column prop="gzqj4" label="工作期间">  
          
        </el-table-column>  
        <el-table-column prop="zzdw4" label="任职单位">  
           
        </el-table-column>  
        <el-table-column prop="job4" label="职位">  
          
        </el-table-column>  
    </el-table-column>  
  
            
    <el-table-column label="工作经历5">  
        <el-table-column prop="gzqj5" label="工作期间">  
          
        </el-table-column>  
        <el-table-column prop="zzdw5" label="任职单位">  
          
        </el-table-column>  
        <el-table-column prop="job5" label="职位">  
          
        </el-table-column>  
    </el-table-column>  
  
    <el-table-column prop="zzmm" label="政治面貌">  
       
    </el-table-column>  
  
    <el-table-column prop="address" label="家庭住址（现住址）">  
      
    </el-table-column>  
  
    <el-table-column prop="id_card" label="家庭住址(身份证)">  
      
    </el-table-column>  
  
    <el-table-column prop="jnzs" label="技能证书">  
       
    </el-table-column> 
  
               
          
  
            <el-table-column label="关系1">
                <el-table-column prop="qsxm1" label="亲属姓名">
                 
                </el-table-column>
                <el-table-column prop="sex1" label="性别">
                 
                </el-table-column>
                <el-table-column prop="minzu1" label="民族">
                  
                </el-table-column>
  
                <el-table-column prop="birth1" label="出生年月">
                
                </el-table-column>
  
  
                <el-table-column prop="age1" label="年龄">
                  
                </el-table-column>
                <el-table-column prop="jiguan1" label="籍贯">
                  
                </el-table-column>
  
  
                <el-table-column prop="gzdw1" label="工作单位/学校名称">
                           
                </el-table-column>
                <el-table-column prop="zaizhi1" label="在职状态">
                 
                </el-table-column>
                <el-table-column prop="zhiwu1" label="职务">
                  
                </el-table-column>
  
                <el-table-column prop="xueli11" label="学历">
                 
                </el-table-column>
  
            </el-table-column>
  
  
            <el-table-column label="关系2">
                <el-table-column prop="qsxm2" label="亲属姓名">
                  
                </el-table-column>
                <el-table-column prop="sex2" label="性别">
                
                </el-table-column>
                <el-table-column prop="minzu2" label="民族">
                  
                </el-table-column>
  
                <el-table-column prop="birth2" label="出生年月">
                 
                </el-table-column>
  
  
                <el-table-column prop="age2" label="年龄">
                 
                </el-table-column>
                <el-table-column prop="jiguan2" label="籍贯">
                   
                </el-table-column>
  
  
                <el-table-column prop="gzdw2" label="工作单位/学校名称">
                          
                </el-table-column>
                <el-table-column prop="zaizhi2" label="在职状态">
                  
                </el-table-column>
                <el-table-column prop="zhiwu2" label="职务">
                 
                </el-table-column>
  
                <el-table-column prop="xueli22" label="学历">
                 
                </el-table-column>
  
            </el-table-column>
            <el-table-column label="关系3">
                <el-table-column prop="qsxm3" label="亲属姓名">
                 
       
                </el-table-column>
                <el-table-column prop="sex3" label="性别">
                 
       
                </el-table-column>
                <el-table-column prop="minzu3" label="民族">
                 
       
                </el-table-column>
  
                <el-table-column prop="birth3" label="出生年月">
                 
       
                </el-table-column>
  
  
                <el-table-column prop="age3" label="年龄">
                 
       
                </el-table-column>
                <el-table-column prop="jiguan3" label="籍贯">
                 
       
                </el-table-column>
  
  
                <el-table-column prop="gzdw3" label="工作单位/学校名称">
                 
                
                </el-table-column>
                <el-table-column prop="zaizhi3" label="在职状态">
                 
       
                </el-table-column>
                <el-table-column prop="zhiwu3" label="职务">
                 
       
                </el-table-column>
  
                <el-table-column prop="xueli33" label="学历">
                 
       
                </el-table-column>
  
            </el-table-column>
            <el-table-column label="关系4">
                <el-table-column prop="qsxm4" label="亲属姓名">
                 
       
                </el-table-column>
                <el-table-column prop="sex4" label="性别">
                 
       
                </el-table-column>
                <el-table-column prop="minzu4" label="民族">
                 
       
                </el-table-column>
  
                <el-table-column prop="birth4" label="出生年月">
                 
       
                </el-table-column>
  
  
                <el-table-column prop="age4" label="年龄">
                 
       
                </el-table-column>
                <el-table-column prop="jiguan4" label="籍贯">
                 
       
                </el-table-column>
  
  
                <el-table-column prop="gzdw4" label="工作单位/学校名称">
                 
                
                </el-table-column>
                <el-table-column prop="zaizhi4" label="在职状态">
                 
       
                </el-table-column>
                <el-table-column prop="zhiwu4" label="职务">
                 
       
                </el-table-column>
  
                <el-table-column prop="xueli44" label="学历">
                 
       
                </el-table-column>
  
            </el-table-column>
  
            <el-table-column label="关系5">
                <el-table-column prop="qsxm5" label="亲属姓名">
                 
       
                </el-table-column>
                <el-table-column prop="sex5" label="性别">
                 
       
                </el-table-column>
                <el-table-column prop="minzu5" label="民族">
                 
       
                </el-table-column>
  
                <el-table-column prop="birth5" label="出生年月">
                 
       
                </el-table-column>
  
  
                <el-table-column prop="age5" label="年龄">
                 
       
                </el-table-column>
                <el-table-column prop="jiguan5" label="籍贯">
                 
       
                </el-table-column>
  
  
                <el-table-column prop="gzdw5" label="工作单位/学校名称">
                 
                
                </el-table-column>
                <el-table-column prop="zaizhi5" label="在职状态">
                 
       
                </el-table-column>
                <el-table-column prop="zhiwu5" label="职务">
                 
                </el-table-column>
  
                <el-table-column prop="xueli55" label="学历">
              
                </el-table-column>
  
            </el-table-column>
  
  
  
  
  
              </el-table>
            </div>
            <el-dialog  
      title="修改值"  
      :visible.sync="dialogVisible"  
      width="30%"  
      @close="dialogVisible = false"  
    >  
      <el-input v-model="editingValue" placeholder="请输入新值"></el-input>  
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
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx/xlsx.mjs'
import { saveAs } from 'file-saver';  
  import axios from '@/utils/axios.js'
  import {export_excel} from '@/utils/exportExcel.js'

  export default {
    name: 'Record',
    components: { Widget, Sparklines },
    data() {
      return {
        search:"",
        dialogVisible: false, // 控制对话框的显示与隐藏  
      editingRow: null, // 当前编辑的行数据  
      editingValue: '', // 输入框中的值  
      editingcolumn: null,
        file: null,
        currentPage: 1,
        tableData: [],
        multipleSelection :[],
        selectedYear: '',
          selectedReward: '',
      selectedPunish: ''
      };
    },
    mounted() {
      axios.get('/api/data/grxx').then(response => {
        // console.log('Fetched JSON:', response.data);
        this.tableData = response.data
        if(this.tableData.length==undefined) this.tableData=[]
             //计算年龄
             let i=0;
            for(i=0;i<this.tableData.length;i++)
        {
            // 提取出生年月日  
    const birthYear = parseInt(String(this.tableData[i].id_number).substring(6, 10), 10);  
    const birthMonth = parseInt(String(this.tableData[i].id_number).substring(10, 12), 10);  
    const birthDay = parseInt(String(this.tableData[i].id_number).substring(12, 14), 10);  
  
  
  
    // 获取当前日期  
    const today = new Date();  
  
    // 计算年龄  
    let age = today.getFullYear() - birthYear;  
    // 如果今天还没过生日，则年龄减一  
    const m = today.getMonth()+1;  
    const d = today.getDate();  
    if (m < birthMonth || (m === birthMonth && d < birthDay)) {  
        age--;  
    }  
  this.tableData[i].age=age;
  
        }
  
      }).catch(error => {
        console.error('Error fetching JSON:', error);
      });
    },
    beforeDestroy() {
      axios.post('/api/save/grxx', this.tableData, {
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
          (item.bumen != undefined && String(item.bumen).includes(this.search)) ||
          (item.gongsi != undefined && String(item.gongsi).includes(this.search)) ||
          (item.jnzs != undefined && String(item.jnzs).includes(this.search)) ||
          (item.zzzt != undefined && String(item.zzzt).includes(this.search)) ||
          (item.jcnd1 != undefined && String(item.jcnd1).includes(this.search)) ||
        (item.jcnd2 != undefined && String(item.jcnd2).includes(this.search)) ||
        (item.jcnd3 != undefined && String(item.jcnd3).includes(this.search)) ||
        (item.reward1 != undefined && String(item.reward1).includes(this.search)) ||
        (item.reward2 != undefined && String(item.reward2).includes(this.search)) ||
        (item.reward3 != undefined && String(item.reward3).includes(this.search)) ||
        (item.punish1 != undefined && String(item.punish1).includes(this.search)) ||
        (item.punish2 != undefined && String(item.punish2).includes(this.search)) ||
        (item.punish3 != undefined && String(item.punish3).includes(this.search));
          const matchesYear = this.selectedYear === '' || item.jcnd1 === this.selectedYear || item.jcnd2 === this.selectedYear || item.jcnd3 === this.selectedYear;
      const matchesReward = this.selectedReward === '' || item.reward1 === this.selectedReward || item.reward2 === this.selectedReward || item.reward3 === this.selectedReward;
      const matchesPunish = this.selectedPunish === '' || item.punish1 === this.selectedPunish || item.punish2 === this.selectedPunish || item.punish3 === this.selectedPunish;

      return matchesSearch && matchesYear && matchesReward && matchesPunish;
      });
    },
    availableYears() {
      const years =new Set([...this.tableData.map(item => item.jcnd1), ...this.tableData.map(item => item.jcnd2), ...this.tableData.map(item => item.jcnd3)].filter(Boolean));
      return Array.from(years).sort();
    }, availableRewards() {
    const rewards = new Set([...this.tableData.map(item => item.reward1), ...this.tableData.map(item => item.reward2), ...this.tableData.map(item => item.reward3)].filter(Boolean));
    return Array.from(rewards).sort();
  },
  availablePunishments() {
    const punishments = new Set([...this.tableData.map(item => item.punish1), ...this.tableData.map(item => item.punish2), ...this.tableData.map(item => item.punish3)].filter(Boolean));
    return Array.from(punishments).sort();
  },
        current() {
            const start = (this.currentPage - 1) * 20;
            const end = start + 20;
            console.log(this.filteredItems.slice(start, end))
            return this.filteredItems.slice(start, end);
        },
        rows() {
            return this.filteredItems.length
        },
    },
    methods: {
      exportExcel(){
        let fix = document.querySelector('.el-table__fixed-left'); // 查找固定列的 DOM 元素  
        let table = document.querySelector('#'+'grxx'); // 查找表格的 DOM 元素  
        let removedFix = table.removeChild(fix);  
        let wb = XLSX.utils.table_to_book(removedFix, { raw: true });  
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });  
        try {  
      FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '文件名.xlsx');  
    } catch (e) {  
      if (typeof console !== 'undefined') {  
        console.log(e, wbout);  
      }  
    }  

  
      },
      exportElTableToExcel()
      {
        const ws_data = this.tableData.map(row => Object.values(row));  
  
  // 创建新的工作簿和工作表  
  const wb = XLSX.utils.book_new();  
  const ws = XLSX.utils.aoa_to_sheet(ws_data);  

  // 给工作表命名  
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  

  // 生成 Excel 文件  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });  

  // 导出文件名  
  const fileName = `export_${new Date().getTime()}.xlsx`;  

  // 保存文件  
  FileSaver.saveAs(new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName);
      },
      handleExportTable(table_id) {
            this.$nextTick(function () {
                export_excel(table_id)
            })

        },
        
      handleSelectionChange(val) {  
      this.multipleSelection = val; 
        
    },  
    handleDelete() {  
     
     
       
      const set = new Set(this.multipleSelection);  
      this.tableData = this.tableData.filter(item => !set.has(item));  
     
      this.multipleSelection = [];  
      { let i=0;
        for(i=0;i<this.tableData.length;i++) this.tableData[i].id=(i+1);
       
        }
  
    },  
    
  
      submitForm() {
        { let i=0;
        for(i=0;i<this.tableData.length;i++) this.tableData[i].id=(i+1);
       
        }
     
     const newRow = {
       id:this.tableData.length+1,fx:"",bumen:"",gongsi:"",neibu:"",name:"",sex:"",minzu:"",phone:"",id_number:"",age:"",height:"",weight:"",pic:"1",time1:"",zpqd:"",time2:"",zzzt:"",jcnd:"",reward:"",punish:"",school1:"",major1:"",qijian1:"",xueli1:"",school2:"",major2:"",qijian2:"",xueli2:"",school3:"",major3:"",qijian3:"",xueli3:"",
       gzqj1:"",zzdw1:"",job1:"", gzqj2:"",zzdw2:"",job2:"", gzqj3:"",zzdw3:"",job3:"", gzqj4:"",zzdw4:"",job4:"", gzqj5:"",zzdw5:"",job5:"",zzmm:"",address:"",id_card:"",jnzs:"",
       qsxm1:"",sex1:"",minzu1:"",birth1:"",age1:"",jiguan1:"",gzdw1:"",zaizhi1:"",zhiwu1:"",xueli11:"",qsxm2:"",sex2:"",minzu2:"",birth2:"",age2:"",jiguan2:"",gzdw2:"",zaizhi2:"",zhiwu2:"",xueli22:"",qsxm3:"",sex3:"",minzu3:"",birth3:"",age3:"",jiguan3:"",gzdw3:"",zaizhi3:"",zhiwu3:"",xueli33:"",qsxm4:"",sex4:"",minzu4:"",birth4:"",age4:"",jiguan4:"",gzdw4:"",zaizhi4:"",zhiwu4:"",xueli44:"",qsxm5:"",sex5:"",minzu5:"",birth5:"",age5:"",jiguan5:"",gzdw5:"",zaizhi5:"",zhiwu5:"",xueli5:"",isEditing:true,jcnd1:"",reward1:"",punish1:"",jcnd2:"",reward2:"",punish2:"",jcnd3:"",reward3:"",punish3:"",
        
      };
        
  
  
     
     this.tableData.push(newRow);
  
  
   },
  
  
      handleCellDblclick(row, column, cell, event) {  
      this.editingRow = row.id; // 保存当前编辑的行数据 
      this.editingcolumn= column.property;
    
      this.editingValue = row[column.property]; // 设置输入框的初始值为当前单元格的值  
      this.dialogVisible = true; // 显示对话框  
    },  
  
    isNumeric(str) {  
    return !isNaN(parseFloat(str)) && isFinite(str);  
  },  
  
    updateValue() {  
      if (this.editingRow && this.editingValue !== this.editingRow.value) {  
  
       
        if(!this.isNumeric(this.editingValue)){
        this.tableData[this.editingRow-1][this.editingcolumn] = this.editingValue;  }
    else
     this.tableData[this.editingRow-1][this.editingcolumn] = Number(this.editingValue);  
      }  
      this.dialogVisible = false; // 关闭对话框  }
    },  
  
      parsePrice(price) {
        // 将数字转换为字符串，并固定两位小数
        if (price === undefined) {
          return price
        }
        else {
          price = Number(price)
          const priceStr = price.toFixed(2);
          // 使用正则表达式将字符串中的数字每三位一组，并用逗号分隔
          const formattedPrice = priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return formattedPrice;
        }
      },
      handlePictureChange(event, item) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            item.pic = e.target.result; // 设置图片预览
            item.isEditing = false; // 完成上传后关闭编辑状态
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
            // 获取第一个工作表
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const title = ["fx","bumen","gongsi","neibu","name","sex","minzu","phone","id_number","age","height","weight","pic","time1","zpqd","time2","zzzt","jcnd1","reward1","punish1","jcnd2","reward2","punish2","jcnd3","reward3","punish3","school1","major1","qijian1","xueli1","school2","major2","qijian2","xueli2","school3","major3","qijian3","xueli3","gzqj1","zzdw1","job1","gzqj2","zzdw2","job2","gzqj3","zzdw3","job3","gzqj4","zzdw4","job4","gzqj5","zzdw5","job5","zzmm","address","id_card","jnzs","qsxm1","sex1","minzu1","birth1","age1","jiguan1","gzdw1","zaizhi1","zhiwu1","xueli11","qsxm2","sex2","minzu2","birth2","age2","jiguan2","gzdw2","zaizhi2","zhiwu2","xueli22","qsxm3","sex3","minzu3","birth3","age3","jiguan3","gzdw3","zaizhi3","zhiwu3","xueli33","qsxm4","sex4","minzu4","birth4","age4","jiguan4","gzdw4","zaizhi4","zhiwu4","xueli44","qsxm5","sex5","minzu5","birth5","age5","jiguan5","gzdw5","zaizhi5","zhiwu5","xueli55"];
            // 解析工作表数据
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            // console.log('解析后的数据为：', jsonData)
            for (let i = 4; i < jsonData.length; i++) {
              let obj = {};
              if (jsonData[i].length == 0) {
                continue
              }
              for (let j = 0; j < jsonData[i].length; j++) {
                if (typeof jsonData[i][j + 1] === 'number') {
                  obj[title[j]] = jsonData[i][j + 1];
                } else {
                  obj[title[j]] = jsonData[i][j + 1];
                }
  
              }
              obj["isEditing"] = false
              that.tableData.push(obj)
            }
  
          };
        }
      },
  
    },
  };
  </script>
  
  <style lang="scss" scoped>
  @import '../../styles/app';
  
  .table-header {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;
    text-align: center
  }

  .table-footer {
    // background-color: red;
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  #table {
  
    //background-color: red;
    // 表格文字间距、颜色
    ::v-deep .cell {
      // padding: 0;
      color: #9f9fad;
    }
  
    // 表头高度
    ::v-deep .el-table__header th {
      padding: 0;
      height: 50px;
      line-height: 50px;
      text-align: center

    }
  
    ::v-deep .el-table__body tr,
    ::v-deep.el-table__body td {
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
  
    // 透明背景
    ::v-deep .el-table th,
    ::v-deep .el-table tr,
    ::v-deep .el-table td {
      background-color:rgb(62, 69, 69);
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