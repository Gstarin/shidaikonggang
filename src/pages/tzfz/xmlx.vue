<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item active>项目管理</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title fw-semi-bold">项目管理</h1>
    <b-row>
      <b-col>
        <Widget
          title="<h5>项目<span class='fw-semi-bold'>列表</span></h5>"
          customHeader
          settings
          close
        >
          <div class="table-resposive">
            <table class="table">
              <thead>
                <tr>
                  <th class="hidden-sm-down">#</th>
                  <th>项目名称</th>
                  <th class="hidden-sm-down">创建日期</th>
                  <th class="hidden-sm-down">项目状态</th>
                  <!-- <th class="hidden-sm-down">编辑</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in projects" :key="row.id" class="table-row">
                  <td>{{ row.id }}</td>
                  <td @click="edit(row.id)" style="cursor: pointer;text-decoration: underline; color:blue">
                    {{ row.name }}
                  </td>
                  <td>
                    {{ row.date }}
                  </td>

                  <td class="text-muted">
                    {{ row.status }}
                  </td>
                  <!-- <td class="width-150">
                    <b-button variant="success" class="mr-3" size="sm" @click="edit(row.id)">修改</b-button>
                    <b-button variant="warning" class="mr-3" size="sm">删除</b-button>
                  </td> -->
                </tr>
              </tbody>
            </table>
          </div>
          <div class="clearfix">
            <div class="float-right">
              <b-button variant="default" class="mr-3" size="sm"
                >新建项目</b-button
              >
              <b-button variant="default" class="mr-3" size="sm"
                >删除项目</b-button
              >
            </div>
            <!-- <p>项目列表</p> -->
          </div>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import Widget from "@/components/Widget/Widget";
export default {
  name: "ProjectManagement",
  components: { Widget },
  data() {
    return {
      projects: [
        {
          id: 1,
          name: "津兴高铁永清新城站交通枢纽配套项目",
          date: "2024-01-01",
          status: "进行中",
        },
        {
          id: 2,
          name: "廊霸路绿化及生态公园提升项目",
          date: "2024-01-01",
          status: "进行中",
        },
      ],
    };
  },
  methods: {
    edit(id) {
      this.$router.push("/app/tzfz/Project?id=" + id);
    },
    del(id) {},
  },
};
</script>

<style>
.table-row:hover {
  background-color: rgba(26, 26, 56, 0.8);
}
</style>
