<template>
	<div class="visits-page">
		<b-row>
			<el-menu :default-active="activeIndex" mode="horizontal"  background-color="#3f4269">
				<el-menu-item index="1"> 中心面板 </el-menu-item>
				<el-menu-item index="2" @click="jump"> 全局搜索 </el-menu-item>
			</el-menu>
		</b-row>
		

		<b-row>
			<b-col lg="7">
				<Widget class="bg-transparent">
					<Map />
				</Widget>
			</b-col>
			<b-col lg="4" offset-lg="1">
				<!-- <Widget
					class="bg-transparent"
					title="<h5>员工绩效<span class='fw-semi-bold'>&nbsp;排行</span></h5>"
					settings
					refresh
					close
					customHeader
				>
					<div class="row progress-stats">
						<div class="col-9">
							<h6 class="name">陈某某</h6>
						</div>
						<div class="col-3 text-center">
							<span>
								<AnimatedNumber :value="120.53" v-bind="animateNumberOptions"></AnimatedNumber>
							</span>
						</div>
					</div>
					<div class="row progress-stats">
						<div class="col-9">
							<h6 class="name">郑某某</h6>
						</div>
						<div class="col-3 text-center">
							<span>
								<AnimatedNumber :value="115.03" v-bind="animateNumberOptions"></AnimatedNumber>
							</span>
						</div>
					</div>
					<div class="row progress-stats">
						<div class="col-9">
							<h6 class="name">冯某某</h6>
						</div>
						<div class="col-3 text-center">
							<span>
								<AnimatedNumber :value="113.06" v-bind="animateNumberOptions"></AnimatedNumber>
							</span>
						</div>
					</div>
					<div class="row progress-stats">
						<div class="col-9">
							<h6 class="name">周某某</h6>
						</div>
						<div class="col-3 text-center">
							<span>
								<AnimatedNumber :value="97.8" v-bind="animateNumberOptions"></AnimatedNumber>
							</span>
						</div>
					</div>
					<div class="row progress-stats">
						<div class="col-9">
							<h6 class="name">李某某</h6>
						</div>
						<div class="col-3 text-center">
							<span>
								<AnimatedNumber :value="96.2" v-bind="animateNumberOptions"></AnimatedNumber>
							</span>
						</div>
					</div>
				</Widget>
				<Widget title="<h5>员工绩效分布</span></h5>" close collapse customHeader> -->
					<!-- <apexchart type="pie" height="200" :series="cd.pie.series" :options="cd.pie.options" /> -->
				<!-- </Widget> -->
			</b-col>
		</b-row>
		<b-row>
			<b-col xl="4" xs="12">
				<Widget title="<h6> 项目支出情况 </h6>" close settings customHeader>
					<div class="stats-row">
						<div class="stat-item">
							<h6 class="name">总金额(万元)</h6>
							<p class="value">{{ totalYingfukuan.toFixed(2) }}</p>
						</div>
						<div class="stat-item">
							<h6 class="name">应付未付(万元)</h6>
							<p class="value">{{ totalYingfuweifu.toFixed(2) }}</p>
						</div>
					</div>
					<b-progress variant="success" :value="38.42" :max="100" class="progress-xs" />
					<p>
						<small>
							<span class="circle bg-primary text-white mr-2">
								<i class="la la-angle-up" />
							</span>
						</small>
						<span class="fw-semi-bold">&nbsp;17% higher</span>
						&nbsp;than last month
					</p>
				</Widget>
			</b-col>
			<b-col xl="4" xs="12">
				<Widget title="<h6> 项目收入情况 </h6>" close settings customHeader>
					<div class="stats-row">
						<div class="stat-item">
							<h6 class="name">应收款(万元)</h6>
							<p class="value">{{ totalYingshoukuan.toFixed(2) }}</p>
						</div>
						<div class="stat-item">
							<h6 class="name">应收未收(万元)</h6>
							<p class="value">{{ totalYingshouweishou.toFixed(2) }}</p>
						</div>
					</div>
					<b-progress variant="danger" :value="0" :max="100" class="progress-xs" />
					<p>
						<small>
							<span class="circle bg-primary text-white mr-2">
								<i class="la la-angle-down" />
							</span>
						</small>
						<span class="fw-semi-bold">&nbsp;0% lower</span>
						&nbsp;than last month
					</p>
				</Widget>
			</b-col>
			<b-col xl="4" xs="12">
				<Widget title="<h6> 暂置 </h6>" close settings customHeader>
					<b-progress variant="primary" :value="60" :max="100" class="progress-xs" />
					<p>
						<small>
							<span class="circle bg-primary text-white mr-2">
								<i class="la la-plus" />
							</span>
						</small>
						<span class="fw-semi-bold">&nbsp;8 734 higher</span>
						&nbsp;than last month
					</p>
				</Widget>
			</b-col>
		</b-row>
		<b-row>
			<b-col lg="4" xs="12">
				<Widget title="<h6><span class='badge badge-danger mr-2'>New</span> 日志</h6>" refresh close customHeader>
					<div class="widget-body p-0">
						<div class="list-group list-group-lg">
							<a class="list-group-item" href="#" v-for="log in logs" :key="log.id">
								<span class="thumb-sm float-left mr">
									<!-- <img class="" :src="log.img.url"  /> -->
									<el-image style="width: 40px; height: 40px" :src="log.img.url" :preview-src-list="log.img.preview">
									</el-image>
									<!-- <i class="status status-bottom bg-success" /> -->
								</span>
								<div>
									<div style="display: flex; justify-content: space-between">
										<h6 class="m-0">{{ log.name }}</h6>
										<h6 class="m-0">{{ log.date }}</h6>
									</div>

									<p class="help-block text-ellipsis m-0">
										{{ log.log }}
									</p>
								</div>
							</a>
						</div>
					</div>
					<footer class="bg-widget mt">
						<input type="search" class="form-control form-control-sm" placeholder="Search" />
					</footer>
				</Widget>
			</b-col>
			<b-col lg="4" xs="12">
				<Widget title="<h6> Market <span class='fw-semi-bold'>Stats</span></h6>" close customHeader>
					<div class="widget-body">
						<h3>净收入￥720</h3>
						<p class="fs-mini text-muted mb mt-sm">
							目标 <span class="fw-semi-bold">￥820</span> 每天已达到
							<span class="fw-semi-bold">96%</span>
						</p>
					</div>
					<div class="widget-bottom-overflow">
						<table class="table table-striped table-sm market-stats">
							<thead class="no-bd">
								<tr>
									<th>
										<div class="checkbox abc-checkbox">
											<input
												type="checkbox"
												class="mt-0"
												id="checkbox210"
												@click="checkTable(0)"
												:checked="checkedArr[0]"
											/>
											<label for="checkbox210" />
										</div>
									</th>
									<th>&nbsp;</th>
									<th>&nbsp;</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<div class="checkbox abc-checkbox">
											<input
												type="checkbox"
												class="mt-0"
												id="checkbox212"
												@click="checkTable(1)"
												:checked="checkedArr[1]"
											/>
											<label for="checkbox212" />
										</div>
									</td>
									<td></td>
									<td class="text-align-right fw-semi-bold">￥346.1</td>
								</tr>
								<tr>
									<td>
										<div class="checkbox abc-checkbox">
											<input
												type="checkbox"
												class="mt-0"
												id="checkbox214"
												@click="checkTable(2)"
												:checked="checkedArr[2]"
											/>
											<label for="checkbox214" />
										</div>
									</td>
									<td></td>
									<td class="text-align-right fw-semi-bold">￥533.1</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="widget-body mt-xlg chart-overflow-bottom">
						<area-chart
							class="area-chart"
							height="100px"
							:options="{ legend: false, scales: { yAxes: [{ display: false }], xAxes: [{ display: false }] } }"
							:chart-data="dataCollection"
						></area-chart>
					</div>
				</Widget>
			</b-col>
			<b-col lg="4" xs="12">
				<Widget title="<h6>Calendar</h6" bodyClass="p-0" settings close customHeader>
					<Calendar />
					<div class="list-group fs-mini">
						<a href="#" class="list-group-item text-ellipsis">
							<span class="badge badge-pill bg-primary float-right">6:45</span>
							Weed out the flower bed
						</a>
						<a href="#" class="list-group-item text-ellipsis">
							<span class="badge badge-pill badge-success float-right">9:41</span>
							Stop world water pollution
						</a>
					</div>
				</Widget>
			</b-col>
		</b-row>
	</div>
</template>

<script>
	import Vue from 'vue';
	import Widget from '@/components/Widget/Widget';
	import Map from './components/Map/Map';
	import Calendar from './components/Calendar/Calendar';
	import AreaChart from './components/AreaChart/AreaChart';
	import AnimatedNumber from 'animated-number-vue';
	import { chartData } from './mock';
	import axios from '@/utils/axios.js';
import { JumbotronPlugin } from 'bootstrap-vue';

	export default {
		name: 'Visits',
		components: {
			Widget,
			Map,
			Calendar,
			AreaChart,
			AnimatedNumber,
		},
		data() {
			return {
				activeIndex:0,
				totalYingshoukuan: 0,
				totalYingshouweishou: 0,
				logs: [],
				performance: [],
				animateNumberOptions: {
					duration: 1000,
					easing: 'easeInQuad',
					formatValue(value) {
						return value;
					},
				},
				cd: chartData,
				checkedArr: [false, false, false],
				dataCollection: null,
				totalYingfukuan: 0,
				totalYingfuweifu: 0,
			};
		},
		methods: {
			jump()
			{
				this.$router.push({
          path:"/app/search/sousuo",
     
         })
			},
			calculateTotals() {
				this.totalYingshoukuan = this.tableData.reduce((sum, item) => sum + parseFloat(item.yingshoukuan || 0), 0);
				this.totalYingshouweishou = this.tableData.reduce(
					(sum, item) => sum + parseFloat(item.yingshouweishou || 0),
					0
				);
				this.totalYingfukuan = this.tableData.reduce((sum, item) => sum + parseFloat(item.yingfukuan || 0), 0);
				this.totalYingfuweifu = this.tableData.reduce((sum, item) => sum + parseFloat(item.yingfuweifu || 0), 0);
			},
			checkTable(id) {
				let arr = [];
				if (id === 0) {
					const val = !this.checkedArr[0];
					for (let i = 0; i < this.checkedArr.length; i += 1) {
						arr[i] = val;
					}
				} else {
					arr = this.checkedArr;
					arr[id] = !arr[id];
				}
				if (arr[0]) {
					let count = 1;
					for (let i = 1; i < arr.length; i += 1) {
						if (arr[i]) {
							count += 1;
						}
					}
					if (count !== arr.length) {
						arr[0] = !arr[0];
					}
				}
				Vue.set(this, 'checkedArr', arr);
			},
			fillData() {
				this.dataCollection = {
					labels: [
						this.getRandomInt(),
						this.getRandomInt(),
						this.getRandomInt(),
						this.getRandomInt(),
						this.getRandomInt(),
						this.getRandomInt(),
						this.getRandomInt(),
					],
					datasets: [
						{
							label: 'Data One',
							backgroundColor: '#1870DC',
							borderColor: 'transparent',
							data: [
								this.getRandomInt(),
								this.getRandomInt(),
								this.getRandomInt(),
								this.getRandomInt(),
								this.getRandomInt(),
								this.getRandomInt(),
								this.getRandomInt(),
							],
						},
						{
							label: 'Data Two',
							backgroundColor: '#F45722',
							borderColor: 'transparent',
							data: [
								this.getRandomInt(),
								this.getRandomInt(),
								this.getRandomInt(),
								this.getRandomInt(),
								this.getRandomInt(),
								this.getRandomInt(),
								this.getRandomInt(),
							],
						},
					],
				};
			},
			getRandomInt() {
				return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
			},
		},
		mounted() {
			this.fillData();
			// axios
			// 	.get('/api/data/log')
			// 	.then((response) => {
			// 		// console.log('Fetched JSON:', response.data);
			// 		this.logs = response.data;
			// 	})
			// 	.catch((error) => {
			// 		console.error('Error fetching JSON:', error);
			// 	});
			// axios
			// 	.get('/api/data/performance')
			// 	.then((response) => {
			// 		// console.log('Fetched JSON:', response.data);
			// 		this.performance = response.data;
			// 	})
			// 	.catch((error) => {
			// 		console.error('Error fetching JSON:', error);
			// 	});
			// axios.get('/api/data/disburse').then((response) => {
			// 	this.tableData = response.data;
			// 	this.calculateTotals();
			// });
		},
	};
</script>

<style src="./Visits.scss" lang="scss" />
