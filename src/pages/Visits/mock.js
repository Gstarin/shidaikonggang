import config from '../../config';
const colors = config.colors;

let columnColors = [colors.blue, colors.green, colors.orange, colors.red, colors.default, colors.gray, colors.teal, colors.pink];
let lineColors = [colors.blue, colors.green, colors.orange];

export const chartData = {
	pie: {
	  series: [25, 15, 44, 55, 41, 17],
	  options: {
		labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		theme: {
		  monochrome: {
			enabled: true,
			color: colors.blue,
		  }
		},
		stroke: {
		  show: false,
		  width: 0
		},
		legend: false,
		responsive: [{
		  breakpoint: 480,
		  options: {
			chart: {
			  width: 200
			},
			legend: {
			  position: 'bottom'
			}
		  }
		}]
	  }
	},
}