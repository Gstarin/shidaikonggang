<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item>项目管理</b-breadcrumb-item>
      <b-breadcrumb-item active>项目流程图</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">项目流程图</h1>
    <!-- 
    <div class="label">
<ul>
  <li><span class="legend">不需要：</span><span id="li1">红色</span></li>
  <li><span class="legend">未上传：</span><span id="li2">白色</span></li>
  <li><span class="legend">已上传：</span><span id="li3">绿色</span></li>
</ul>
    </div> -->
    <!-- <div class="dashed-line"></div> -->
    
    <el-row :gutter="20">
      <el-col :span="6" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(13)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="13" slot="reference" class="grid-content bg-purple">
            选定勘探单位
          </div>
        </el-popover>
      </el-col>
      <el-col :span="4" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(14)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="14" slot="reference" class="grid-content bg-purple">
            现场侦查成果
          </div>
        </el-popover>
      </el-col>
      <el-col :span="6" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(15)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="15" slot="reference" class="grid-content bg-purple">
            配合主管部门办理用地迁证
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(16)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="16" slot="reference" class="grid-content bg-purple">
            选定初步开发设计单位<br />绘制和设计图纸<br />选定编算编制单位、编算
          </div>
        </el-popover>
      </el-col>
      <el-col :span="4" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(17)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="17" slot="reference" class="grid-content bg-purple">
            初步设计批复
          </div>
        </el-popover>
      </el-col>
      <el-col :span="6" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(18)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="18" slot="reference" class="grid-content bg-purple">
            办理工程规划许可证
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" :offset="16">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(21)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="21" slot="reference" class="grid-content bg-purple">
            设计、预算、评审、最高限价、备案
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(19)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="19" slot="reference" class="grid-content bg-purple">
            选定招标代理单位
          </div>
        </el-popover>
      </el-col>
      <el-col :span="4" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(20)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="20" slot="reference" class="grid-content bg-purple">
            招标公告批准
          </div>
        </el-popover>
      </el-col>
      <el-col :span="6" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(22)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="22" slot="reference" class="grid-content bg-purple">
            EPC项目:编算备案
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4" :offset="10">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(24)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="24" slot="reference" class="grid-content bg-purple">
            公开招标
          </div>
        </el-popover>
      </el-col>
      <el-col :span="4" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(23)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="23" slot="reference" class="grid-content bg-purple">
            招标方案校准
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4" :offset="10">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(25)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="25" slot="reference" class="grid-content bg-purple">
            确定设计、选工、管理
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" :offset="9">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(26)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="26" slot="reference" class="grid-content bg-purple">
            发布中标通知、签订合同
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8" :offset="8">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(27)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="27" slot="reference" class="grid-content bg-purple">
            组织进场沟通会、签订安全、质量、进度、环保责任承诺书
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4" :offset="10">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(28)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="28" slot="reference" class="grid-content bg-purple">
            工程预算
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4" :offset="10">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(29)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="29" slot="reference" class="grid-content bg-purple">
            办理施工许可证
          </div>
        </el-popover>
      </el-col>
      <el-col :span="4" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(30)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="30" slot="reference" class="grid-content bg-purple">
            签民工保障金
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4" :offset="4">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(35)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="35" slot="reference" class="grid-content bg-purple">
            预算审核结果
          </div>
        </el-popover>
      </el-col>
      <el-col :span="4" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(31)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="31" slot="reference" class="grid-content bg-purple">
            跟进施工情况，每日上报产值
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4" :offset="4">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(36)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="36" slot="reference" class="grid-content bg-purple">
            合同审核结果
          </div>
        </el-popover>
      </el-col>
      <el-col :span="4" :offset="2">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(32)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px;
                            margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="32" slot="reference" class="grid-content bg-purple">
            施工验收、移交、尾保
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4" :offset="10">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(33)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="33" slot="reference" class="grid-content bg-purple">
            结算、审计
          </div>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4" :offset="10">
        <el-popover placement="top" v-model="visible" @click.native="openZhengming(34)">
          <div class="btn-group">
            <b-button
              variant="default"
              size="sm"
              style="width: 80px; height: 35px; margin-right: 5px"
            >
              证明材料
            </b-button>
          </div>
          <div id="34" slot="reference" class="grid-content bg-purple">
            资料归档、移交
          </div>
        </el-popover>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import LeaderLine from "leader-line";
import { Select, Option, MessageBox } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

export default {
  name: "Project",
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      project_id: 0,
      idd: "",
      lines: [
        [13, 14],
        [15, 14],
        [14, 17],
        [16, 17],
        [18, 17],
        [17, 20],
        [19, 20],
        [21, 20],
        [22, 20],
        [23, 20],
        [20, 24],
        [24, 25],
        [25, 26],
        [26, 27],
        [27, 28],
        [28, 29],
        [30, 29],
        [29, 31],
        [31, 32],
        [32, 33],
        [33, 34],
        [35,31],
        [36,31]
      ],
      line_lists: [],
      visible: false,
    };
  },
  mounted() {
    this.idd = this.$route.query.id;
    console.log(this.project_id);
    setTimeout(() => {
      this.createLines();
    }, 500);
  },
  beforeDestroy() {
    for (let line of this.line_lists) {
      line.remove();
    }
  },
  methods: {
    $confirm: MessageBox.confirm,
    createLines() {
      let lineStyle = { color: "white" };
      for (let line of this.lines) {
        this.line_lists.push(
          new LeaderLine(
            document.getElementById(line[0].toString()),
            document.getElementById(line[1].toString()),
            lineStyle
          )
        );
      }
    },
    openZhengming(id) {
      event.stopPropagation();
      console.log('Opening zhengming for id:', id);
     console.log('project_id:', this.project_id);
     console.log('idd:', this.idd);
      this.$router.push({
        name: 'zhengming',
        query: { 
          id: id,
          projectId: this.project_id,
          idd: this.idd
        }
      });
    },
  },
};
</script>

<style scoped>

#li1{
  color: red;
}

#li2{
  color:#f9fafc;
}

#li3{
  color:chartreuse;
}
.label ul {  
    
    padding: 0; /* 移除默认的内边距 */  
    text-align: center; /* 文本居中 */  
    display: flex;  
    flex-direction: column;  
    gap: 10px;
}  
.label ul li{
  font-weight: 700;
}
.label{
position: relative;
left: 850px;
top: 0 px;
width: 300px;
height:100px;
background-color: transparent;
border-radius: 15px;
border-width: 4px;
border-style: solid;
border-color: aquamarine;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* background: red; */
}

.btn-group {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.el-row {
  margin-bottom: 50px;
}

.el-col {
  border-radius: 4px;
}

.bg-purple {
  background: rgba(22, 22, 50, 0.5);
}

.grid-content {
  border-radius: 4px;
  min-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  color: #f9fafc;
  font-size: 14px;
}

.grid-content:hover {
  background-color: rgba(22, 22, 50, 1);
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.dashed-line {  
    border-top: 3px dashed red; /* 上边框为1px宽，虚线样式，黑色 */  
    width: 100%; /* 根据需要设置宽度 */  
    margin: 20px 0; /* 上下外边距，用于与其他内容分隔 */  
}
</style>
