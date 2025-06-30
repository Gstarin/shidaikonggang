<template>
    <div>
      <b-breadcrumb>
        <b-breadcrumb-item active>集团内部资料</b-breadcrumb-item>
      </b-breadcrumb>
      <h1 class="page-title fw-semi-bold">集团内部资料</h1>
      <!-- <b-button variant="default" class="mr-3" size="sm" @click="dialogVisible = true" style="width: 110px;height: 35px;">增加</b-button>
                        <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;" @click="handleExportTable('DisburseTable')">删除</b-button> -->
                            <br>
                            <br>

  

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
  name: 'xmdangan',
  components: { Widget },
  data() {
    return {
      project_id: 3,
      form: {
        text1: '', // 文字内容
        text2: '' // 文字内容
      },
      dialogVisible: false,
      lastClickedNode: null,
      lastClickedTime: 0,
      jieduan: "",
      weituoshu: "",
      htmc: "",
      data: [
        {
          label: "领导批示",
          children: [],
          pdfId: "lingdaopishi"
        },
        {
          label: "债券资金申请、下达、使用相关资料",
          pdfId: "zhaiquanzijin",
          children: []
        },
        {
          label: "建设项目列入年度计划的批复文件",
          pdfId: "jianshejihuabeifu",
          children: []
        },
        {
          label: "立项依据",
          pdfId: "lixiangyiju",
          children: [
            {
              label: "环评",
              pdfId: "lixiangyiju_huanping",
              children: []
            },
            {
              label: "批复",
              pdfId: "lixiangyiju_pifu",
              children: []
            },
            {
              label: "可行性研究报告",
              pdfId: "lixiangyiju_kexingxing",
              children: []
            },
            {
              label: "项目建议书",
              pdfId: "lixiangyiju_xiangmujianyi",
              children: []
            },
            {
              label: "项目简介",
              pdfId: "lixiangyiju_xiangmujianjie",
              children: []
            },
            {
              label: "下达投资计划书",
              pdfId: "lixiangyiju_touzijijhua",
              children: []
            }
          ]
        },
        {
          label: "规划部门",
          pdfId: "guihuabumen",
          children: [
            {
              label: "选址意见书用地预审",
              pdfId: "guihuabumen_xuanzhi",
              children: []
            },
            {
              label: "建设工程规划许可证",
              pdfId: "guihuabumen_guihuaxuke",
              children: []
            }
          ]
        },
        {
          label: "国土局",
          pdfId: "guotuju",
          children: [
            {
              label: "建设用地许可证",
              pdfId: "guotuju_yongdixuke",
              children: []
            },
            {
              label: "城乡建设用地批准书",
              pdfId: "guotuju_yongdipizhun",
              children: []
            },
            {
              label: "土地使用证",
              pdfId: "guotuju_tudishiyong",
              children: []
            }
          ]
        },
        {
          label: "建设单位",
          pdfId: "jianshedanwei",
          children: [
            {
              label: "招标审核意见",
              pdfId: "jianshedanwei_zhaobiaoshenhe",
              children: []
            },
            {
              label: "初步设计及批复",
              pdfId: "jianshedanwei_chubusheji",
              children: []
            },
            {
              label: "概算及批复",
              pdfId: "jianshedanwei_gaisuan",
              children: []
            },
            {
              label: "招投标",
              pdfId: "jianshedanwei_zhaotoubiao",
              children: []
            },
            {
              label: "全过程造价咨询招标文件、合同书、中标通知书",
              pdfId: "jianshedanwei_zaojia",
              children: []
            },
            {
              label: "勘察招标文件、合同书、中标通知书",
              pdfId: "jianshedanwei_kancha",
              children: []
            },
            {
              label: "设计招投标文件、合同书、中标通知书",
              pdfId: "jianshedanwei_sheji",
              children: []
            },
            {
              label: "监理招投标文件、合同书、中标通知书",
              pdfId: "jianshedanwei_jianli",
              children: []
            },
            {
              label: "施工招投标文件、合同书、中标通知书",
              pdfId: "jianshedanwei_shigong",
              children: []
            },
            {
              label: "工地地质勘查报告",
              pdfId: "jianshedanwei_dizhi",
              children: []
            },
            {
              label: "政府有关部门对施工图设计文件的审批意见",
              pdfId: "jianshedanwei_shenpi",
              children: []
            },
            {
              label: "财政评审报告",
              pdfId: "jianshedanwei_caizhengshenhe",
              children: []
            }
          ]
        },
        {
          label: "施工单位",
          pdfId: "shigongdanwei",
          children: [
            {
              label: "资质证书",
              pdfId: "shigongdanwei_zizhi",
              children: []
            },
            {
              label: "营业执照",
              pdfId: "shigongdanwei_yingyezhizhao",
              children: []
            },
            {
              label: "施工许可证",
              pdfId: "shigongdanwei_shigongxuke",
              children: []
            },
            {
              label: "施工图",
              pdfId: "shigongdanwei_shigongtu",
              children: []
            },
            {
              label: "工程变更单、洽商单等变更手续",
              pdfId: "shigongdanwei_biangeng",
              children: []
            },
            {
              label: "竣工图纸",
              pdfId: "shigongdanwei_jungongtu",
              children: []
            },
            {
              label: "施工过程中全部合同",
              pdfId: "shigongdanwei_hetong",
              children: []
            },
            {
              label: "工程预算",
              pdfId: "shigongdanwei_yusuan",
              children: []
            },
            {
              label: "安全、技术交底资料",
              pdfId: "shigongdanwei_anquanjishu",
              children: []
            },
            {
              label: "工程变更预算",
              pdfId: "shigongdanwei_biangengyusuan",
              children: []
            },
            {
              label: "竣工决算书",
              pdfId: "shigongdanwei_jungongjuesuan",
              children: []
            },
            {
              label: "工程影像资料",
              pdfId: "shigongdanwei_yingxiang",
              children: []
            },
            {
              label: "监理及施工日志",
              pdfId: "shigongdanwei_rizhi",
              children: []
            },
            {
              label: "消防验收报告",
              pdfId: "shigongdanwei_xiaofang",
              children: []
            },
            {
              label: "河北生房屋建筑工程质量保修书",
              pdfId: "shigongdanwei_zhiliangbaoxiu",
              children: []
            }
          ]
        },
        {
          label: "竣工验收报告",
          pdfId: "jungongyanshous",
          children: []
        },
        {
          label: "竣工验收报告报备表",
          pdfId: "jungongyanshoubaobei",
          children: []
        },
        {
          label: "工程状况",
          pdfId: "gongchengzhuangkuang",
          children: []
        },
        {
          label: "工程结算报告",
          pdfId: "gongchengjiesuan",
          children: []
        },
        {
          label: "工程结算财务报表、帐薄",
          pdfId: "gongchengjiesuancaiwu",
          children: []
        },
        {
          label: "竣工审计",
          pdfId: "jungongshenji",
          children: []
        },
        {
          label: "备注",
          pdfId: "beizhu",
          children: []
        },
      ],
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  mounted() {
    this.htmc = this.$route.query.hetong;
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    upload_pdf(node) {
      var that = this;
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/pdf";
      input.addEventListener("change", function () {
        const formData = new FormData();
        formData.append("pdf", input.files[0]);
        formData.append("projectName", that.project_id);
        formData.append("pdfName", node.pdfId);
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
    download_pdf(node) {
      var that = this;
      axios
        .get(
          `/api/data/pdf?projectName=${that.project_id}&&pdfName=${node.pdfId}`
        )
        .then((response) => {
          const url = "http://8.130.106.134:5000/" + response.data;
          window.open(url, "_blank");
        })
        .catch((error) => {
          that.$message({
            message: "PDF暂未上传",
            type: "error",
          });
        });
    },
    jump(a, b, c) {
      if (!b.isLeaf) {
        this.jieduan = a.label;
      }
      if (a.children.length === 0||a.children.length==undefined) {
        this.weituoshu = a.label;
        this.upload_pdf(a);
      }
    },
    jump2(a, b, c, d) {
      if (b.children.length === 0) {
        this.download_pdf(a);
      }
    },
    submitForm() {
      let newRow = {
        label: this.form.text1,
        pdfId: this.form.text1.replace(/\s+/g, '_').toLowerCase(),
        children: []
      };
      if (this.form.text2) {
        newRow.children.push({
          label: this.form.text2,
          pdfId: `${newRow.pdfId}_${this.form.text2.replace(/\s+/g, '_').toLowerCase()}`,
          children: []
        });
      }
      this.data.push(newRow);
      this.resetForm();
      this.dialogVisible = false;
    },
    resetForm() {
      this.form = {
        text1: '',
        text2: ''
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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

