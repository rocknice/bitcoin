//图表
let dom = document.getElementById("container");
let myChart = echarts.init(dom);
let app = {};
option = null;
app.title = '坐标轴刻度与标签对齐';

let time = new Date();

function CurrentTime(year, month, day) {

    this.year = time.getFullYear();
    this.month = time.getMonth() + 1;
    this.day = time.getDate();
}
CurrentTime.prototype.getTime = function(date, month, day) {
    let m = time.getMonth() + 1;
    let now = this.day - date;
    if (now <= 0) {
        m = time.getMonth() + 1 - 1;
        if (time.getMonth() == 3) {
            now = 31;
            now = now + 22 - date;
        } else if (time.getMonth() == 2) {
            now = 28;
        } else {
            now = 30;
        }
    }
    return m + "." + now
}
let today = new CurrentTime();

console.log(today.getTime(1))


let end = Math.floor(new Date().getTime() / 1000) - 2592000;

function getData() {
    axios.get('/formdata', {
            params: {
                end: end
            }
        })
        .then(function(res) {
            let formdata = res.data;
            option.series[0].data = formdata;
            console.log("1123123", option.series[0].data);
            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }
        })
        .catch(function(err) {
            console.log(err);
        });
}
option = {
    title: {
        show: true,
        text: '近三十天中国区比特币交易量',
        left: 50,
        borderWidth: 2
    },
    color: ['#3398DB'],
    legend: {
        data: ['交易总额']
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [{
        type: 'category',
        name: '日期',
        data: [today.getTime(29), today.getTime(28), today.getTime(27), today.getTime(26), today.getTime(25), today.getTime(24), today.getTime(23), today.getTime(22), today.getTime(21), today.getTime(20), today.getTime(19), today.getTime(18), today.getTime(17), today.getTime(16), today.getTime(15), today.getTime(14), today.getTime(13), today.getTime(12), today.getTime(11), today.getTime(10), today.getTime(9), today.getTime(8), today.getTime(7), today.getTime(6), today.getTime(5), today.getTime(4), today.getTime(3), today.getTime(2), today.getTime(1), today.getTime(0)],
        axisTick: {
            alignWithLabel: true
        }
    }],
    yAxis: [{
        type: 'value',
        name: '单日交易量（元）'
    }],
    series: [{
        name: '交易总量（元）',
        type: 'bar',
        barWidth: '60%',
        data: [getData()]
    }]
};