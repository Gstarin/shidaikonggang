<template>
    <div>
      <b-breadcrumb>
        <b-breadcrumb-item active>项目档案</b-breadcrumb-item>
      </b-breadcrumb>
      <h1 class="page-title fw-semi-bold">项目档案</h1>
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
          label: "立项阶段",
          pdfId: "lixiang",
          children: [
            { label: "政府委托授权书", pdfId: "lixiang_shouquanshu", children: [] },
            { label: "项目代建委托协议", pdfId: "lixiang_weituo", children: [] },
            { label: "用地预审与选址意见书", pdfId: "lixiang_yongdi", children: [] },
            { label: "建设用地规划许可证", pdfId: "lixiang_yongdixuke", children: [] },
            { label: "建设工程规划许可证", pdfId: "lixiang_gongchengxuke", children: [] },
            { label: "项目建议书", pdfId: "lixiang_jianyi", children: [] },
            { label: "项目建议书复批", pdfId: "lixiang_jianyifupi", children: [] },
            { label: "可行性研究报告", pdfId: "lixiang_kexingxing", children: [] },
            { label: "可行性研究报告复批", pdfId: "lixiang_kexingxingfupi", children: [] },
            { label: "初步设计概算书", pdfId: "lixiang_chubusheji", children: [] },
            { label: "初步设计概算书复批", pdfId: "lixiang_chubushejifupi", children: [] },
            { label: "下达投资计划书", pdfId: "lixiang_touzijijhua", children: [] },
          ]
        },
        {
          label: "招标阶段",
          pdfId: "zhaobiao",
          children: [
            { label: "招标核准核准意见表（批复）", pdfId: "zhaobiao_hezhun", children: [] },
            { label: "全过程造价咨询招标核准（批复）", pdfId: "zhaobiao_zaojia", children: [] },
            { label: "招标公示信息", pdfId: "zhaobiao_gongshi", children: [] },
            { label: "评标报告", pdfId: "zhaobiao_pingbiao", children: [] },
            { label: "中标通知书", pdfId: "zhaobiao_zhongbiao", children: [] },
            { label: "招投标全套备案资料", pdfId: "zhaobiao_beian", children: [] },
            { label: "环评报告及批复", pdfId: "zhaobiao_huanping", children: [] }
          ]
        },
        {
          label: "施工阶段",
          pdfId: "shigong",
          children: [
            { label: "建设工程施工许可证", pdfId: "shigong_xuke", children: [] },
            { label: "施工图及说明）", pdfId: "shigong_tushuo", children: [] },
            { label: "勘察承包合同", pdfId: "shigong_kancha", children: [] },
            { label: "设计、施工承包合同", pdfId: "shigong_shejishigong", children: [] },
            { label: "监理委托合同", pdfId: "shigong_jianli", children: [] },
          ]
        },
        {
          label: "竣工阶段",
          pdfId: "jungong",
          children: [
            { label: "安全技术交底资料", pdfId: "jungong_anquan", children: [] },
            { label: "竣工验收报告", pdfId: "jungong_yanshou", children: [] },
            { label: "竣工图纸", pdfId: "jungong_tuzhi", children: [] },
            { label: "施工日志", pdfId: "jungong_shigongrizhi", children: [] },
            { label: "监理日志", pdfId: "jungong_jianlirizhi", children: [] },
            { label: "工程影像资料（全过程）", pdfId: "jungong_yingxiang", children: [] },
          ]
        },
        {
          label: "其他",
          pdfId: "qita",
          children: [
            { label: "政府相关会议纪要", pdfId: "qita_huiyi", children: [] }
          ]
        }
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
      if (a.children.length === 0) {
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

