const deal = $('.deal');
const startTime = $('.starttime');

laydate.render({
	elem: '.starttime',
	type: 'datetime'
});
laydate.render({
	elem: '.endtime',
	type: 'datetime'
});

function ClickAction(element) {
	this.element = element;
}
ClickAction.prototype.search_date = function() {
	this.element.click(() => {
		let start = $('.starttime').val();
		let end = $('.endtime').val();
		//发送请求到后台接口，传入参数：起始时间（start）和终止时间（end）
		axios.get('/bitcoin', {
				params: {
					start: start,
					end: end
				}
			})
			.then(function(res) {
				console.log(res.data);
				deal.text('总成交额为人民币：' + res.data + "元")
				console.log(deal.text());
				console.log("起始时间：" + startTime.val());
			})
			.catch(function(err) {
				console.log(err);
			});
	})
}
$.extend({
	search: ClickAction
});
let f = new $.search($('.submit')); //这里给jquery添加了一个发送数据插件
f.search_date();