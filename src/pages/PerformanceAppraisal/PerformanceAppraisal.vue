<template>
    <div class="tables-basic">
      <b-breadcrumb>
        <b-breadcrumb-item>YOU ARE HERE</b-breadcrumb-item>
        <b-breadcrumb-item active>Tables Basic</b-breadcrumb-item>
      </b-breadcrumb>
      <h2 class="page-title">Tables - <span class="fw-semi-bold">Static</span></h2>
      <b-row>
        <b-col>
          <Widget
            title="<h5>Table <span class='fw-semi-bold'>Styles</span></h5>"
            customHeader settings close
          >
            <div class="table-resposive">
              <table class="table">
                <thead>
                  <tr>
                    <th class="hidden-sm-down">#</th>
                    <th>图示</th>
                    <th>类别</th>
                    <th class="hidden-sm-down">规格</th>
                    <th class="hidden-sm-down">物品名称</th>
                    <th class="hidden-sm-down">单位</th>
                    <th class="hidden-sm-down">集采价含税（元/个）</th>
                    <th class="hidden-sm-down">最高限价不含税（元/个）</th>
                    <th class="hidden-sm-down">提交人</th>
                    <th class="hidden-sm-down">备注</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in current" :key="row.id">
                    <td>{{row.id}}</td>
                    <td class="width-150" @dblclick="toggleEditing(row)">
                        <div v-if="row.isEditing">
                          <b-form-file
                            v-model="row.picture"
                            @change="handlePictureChange($event, row)"
                            accept="image/*"
                            plain
                          ></b-form-file>
                        </div>
                        <div v-else>
                          <img
                            class="img-rounded"
                            :src="row.picture"
                            alt=""
                            height="50"
                          />
                        </div>
                    </td>
                    <td class="width-200">
                      {{row.class}}
                    </td>
                    <td class="width-200">
                      {{row.info}}
                    </td>
                    <td class="text-muted">
                      {{row.name}}
                    </td>
                    <td class="width-200">
                      {{row.unit}}
                    </td>
                    <td class="width-150">
                      {{parsePrice(row.low_price)}}
                    </td>
                    <td class="width-200">
                      {{parsePrice(row.high_price)}}
                    </td>
                    <td class="width-200">
                      {{row.submit}}
                    </td>
                    <td class="width-200">
                      {{row.extra}}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="clearfix">
              <div class="float-right">
                  <b-form-file v-model="file" placeholder="请选择一个Excel文件" style="margin-right: 15px;"></b-form-file>
                  <b-button variant="default" class="mr-3" size="sm" @click="parseExcel" style="width: 110px;height: 35px;">解析Excel</b-button>
                  <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;">导出Excel</b-button>
                  <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;">导出Excel</b-button>
                  <b-button variant="default" class="mr-3" size="sm" style="width: 110px;height: 35px;">导出Excel</b-button>
                  
              </div>
              <b-pagination v-model="currentPage" pills :total-rows="rows" size="lg" style="margin-left: auto;margin-right: auto; width: 150px;"></b-pagination>
            </div>
          </Widget>
        </b-col>
      </b-row>
    </div>
  </template>
  
  <script>
  import Vue from 'vue';
  import Widget from '@/components/Widget/Widget';
  import Sparklines from '../../components/Sparklines/Sparklines'
  import * as XLSX from 'xlsx/xlsx.mjs'
  import axios from '@/utils/axios.js'
  import { number } from '@amcharts/amcharts4/core';
  
  export default {
    name: 'Tables',
    components: { Widget, Sparklines },
    data() {
      return {
        file: null,
        currentPage: 1,
        tableStyles: [
          {
            id: 443,
            picture: require('../../assets/tables/1.jpg'), // eslint-disable-line global-require
            class: '维修工具',
            extra: undefined,
            high_price: 3.5,
            info: 32,
            low_price: undefined,
            name: "PE管",
            submit: undefined,
            unit: "米",
          }
        ],
      };
    },
    mounted() {
      axios.get('/api/data/daily').then(response => {
          console.log('Fetched JSON:', response.data);
          this.tableStyles = response.data
      }).catch(error => {
          console.error('Error fetching JSON:', error);
      });
    },
    beforeDestroy() {
      axios.post('/api/save/daily', this.tableStyles, {
          headers: {
              'Content-Type': 'application/json',
          },
      })
          .then(response => {
              console.log('日常报价表上传成功');
          })
          .catch(error => {
              console.error('上传日常报价表文件时出错：', error);
      });
    },
    computed: {
      current() {
        const start = (this.currentPage - 1) * 20;
        const end = start + 20;
        console.log(this.tableStyles.slice(start, end))
        return this.tableStyles.slice(start, end);
      },
      rows(){
          return this.tableStyles.length
      },
    },
    methods: {
        parsePrice(price) {
              // 将数字转换为字符串，并固定两位小数
            if(price === undefined){
                return price
            }
            else{
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
            item.picture = e.target.result; // 设置图片预览
            item.isEditing = false; // 完成上传后关闭编辑状态
          };
          reader.readAsDataURL(file);
        }
      },
      toggleEditing(item) {
          console.log(item)
          item.isEditing = true;
      },
      parseExcel(){
          if (this.file) {
              let that = this
              that.tableStyles = []
              const reader = new FileReader();
              reader.readAsArrayBuffer(this.file);
              reader.onload = function (e){
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                // 获取第一个工作表
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const title = ["id", "picture", "class", "info", "name", "unit", "low_price", "high_price", "submit", "extra"]
                // 解析工作表数据
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                for (let i = 0; i < jsonData.length - 1; i++) {
                    let obj = {};
                    for (let j = 0; j < jsonData[0].length; j++) {
                        obj[title[j]] = jsonData[i + 1][j];
                    }
                      obj["isEditing"] = false
                    that.tableStyles.push(obj)
                 } 
              };
          }
      },
      
    },
  };
  </script>
  
  <style src="./Tables.scss" lang="scss" scoped />
  