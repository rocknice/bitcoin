const Koa = require('koa');
const app = new Koa();
const router = require('koa-simple-router');
const convert = require('koa-convert');
const path = require('path');
const render = require('koa-swig');
const co = require('co');
const serve = require('koa-static');
const createForm = require('./service/getFormData.js');
const service = require('./service/searchDealData.js');
const rp = require('request-promise');
const fs = require('fs');
const qs = require('querystring');

function Pr(url) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: url,
			success: function(response) {
				resolve(response.data)
			},
			error: function(err) {
				reject(err)
			}
		})
	})
}
Pr('www.xxx.com/a').then((res) => {
	console.log(res)
	return res
}).then((res) => {
	if (res) {
		Pr('www.xxx.com/b')
	}
}).then(() => {

})

function Car(color, price) {
	this.color = color;
	this.price = price;
}
Car.prototype.sell = function(color, price) {
	alert(`把${this.color}的dawdawdCruze卖给了小王，价格是${this.price}`)
}
var Cruze = function(color, price, name) {
	Car.call(this, color, price)
	this.name = name
}
var __pro = Object.create(Car.prototype)
Cruze.prototype = __pro
__pro.constructor = Cruze;
Cruze.prototype.constructor = Cruze

Cruze.prototype.sell = function(color, price, name) {
	alert(`把${this.color}的Cruze卖给了小王，价格是${this.price}，${this.name}`)
}
var s = new Cruze('红色', '14万', '王圣元')
s.sell()

class Car {
	constructor(color, price) {
		this.color = color;
		this.price = price;
	}
	sell() {
		alert(`把${this.color}的Cruze卖给了小王，价格是${this.price}`)
	}
}
class Cruze extends Car {
	constructor(color, price, name) {
		super(color, price)
		this.name = name
	}
	sell() {
		super.sell()
		console.log(this.name)
	}
}
var s = new Cruze('红色', '14万', '王圣元')
s.sell()
//模块一、自动对bitcoin接口发起请求，请求回数据，导入数据库（json文件）。
//注：数据库用一个json文件代替

let comysql = function(tid) {
	let data = {
		since: tid
	};
	let database = [];
	const params = qs.stringify(data);
	let options = {
		hostname: 'localbitcoins.com',
		port: 80,
		uri: "https://localbitcoins.com/bitcoincharts/cny/trades.json?" + params,
		// path: '/bitcoincharts/cny/trades.json',
		method: 'GET'
	};
	console.log(params)
	return new Promise((resolve, reject) => { //给index/update页面响应一个请求，地址指向数据库
		//向比特币交易记录接口发送请求
		rp(options).then(function(result) {
			let info = JSON.parse(result);
			console.log(info.length);
			console.log(info[info.length - 1].tid);
			//将请求回来的交易记录录入json文件。
			fs.writeFile('dealDate.json', result, {
				flag: "a+"
			}, function() {
				console.log("保存数据");
			});
			//若下次请求回来的数据长度依然大于0，也就是说还有数据。
			if (!!info.length && info.length > 0) {
				data.since = info[info.length - 1].tid;
				let lastTid = data.since;
				resolve(
					//继续请求后面的数据
					comysql(lastTid).then(() => {
						console.log('保存新数据完成');
					})
				);
			} else {
				reject(['无新数据']);
			}
		}).catch(err => {
			console.log(err)
		});
	});
}
comysql(7099694).then(() => {
	console.log('保存新数据完成');
});

const s = "hello";
const e = "world";
const c = `foo ${s} ${e} bar`;

function test(strs, ...values) {
	console.log(values)
}
//模块二、每隔15秒向接口发送一次请求，并对比数据，若有新数据，则将新交易记录录入数据库文件。
// let keepReq = setInterval(function() {
// 	console.log(2)
// 	let fileContent = fs.readFileSync('./dataBase.json', 'utf8');
// 	let changeContent = fileContent.replace(/\]/g, "");
// 	var finalContent = changeContent.replace(/\[/g, ",");
// 	if (finalContent.substr(0, 1) == ',') {
// 		finalContent = finalContent.substr(1);
// 	};
// 	// let fileData = finalContent.split(",");
// 	//转化成对象
// 	let fileData = eval("[" + finalContent + "]");
// 	return new Promise((resolve, reject) => { //给index/update页面响应一个请求，地址指向数据库
// 		let data = {
// 			since: fileData[fileData.length - 1].tid
// 		};
// 		let database = [];
// 		const params = qs.stringify(data);
// 		let options = {
// 			hostname: 'localbitcoins.com',
// 			port: 80,
// 			uri: "https://localbitcoins.com/bitcoincharts/cny/trades.json?" + params,
// 			// path: '/bitcoincharts/cny/trades.json',
// 			method: 'GET'
// 		};
// 		//向比特币交易记录接口发送请求
// 		rp(options).then(function(result) {
// 			let info = JSON.parse(result);
// 			for (let i = 0; i < info.length; i++) {
// 				//判断若有新数据，则写入。
// 				if (info[i].tid > fileData[fileData.length - 1].tid) {
// 					console.log("1123123", info[0].date);
// 					fs.writeFile('./dataBase.json', result, {
// 						flag: "a+"
// 					}, function() {
// 						resolve(["保存完成"])
// 					});
// 				} else {
// 					reject(['无新数据'])
// 				}
// 			}
// 		}).catch(err => {
// 			console.log(err)
// 		});
// 	});
// }, 15000000);


app.context.render = co.wrap(render({
	root: path.join(__dirname, './views'),
	autoescope: true,
	cache: 'memory',
	ext: 'html',
	writeBody: false
}));

//模块三、本地服务器接口，给前端页面调用
app.use(router(_ => {
	//主页面
	_.get('/', async (ctx, next) => {
		ctx.body = await ctx.render('index.html')
	})
	//接口，处理查询请求
	_.get('/bitcoin', async (ctx, next) => {
		ctx.set('Cache-Control', 'no-cache');
		ctx.set('Access-Control-Allow-Origin', '*');
		let querystring = require('querystring');
		//解析参数
		let params = querystring.parse(ctx.req._parsedUrl.query);
		let start = params.start;
		let end = params.end;
		//根据前台传来的参数计算出这一时间段的交易量，并返回前台显示
		ctx.body = await service.get_search_data(start, end);
	})
	//接口，处理查询请求
	_.get('/formdata', async (ctx, next) => {
		ctx.set('Cache-Control', 'no-cache');
		ctx.set('Access-Control-Allow-Origin', '*');
		let querystring = require('querystring');
		//解析参数
		let params = querystring.parse(ctx.req._parsedUrl.query);
		let end = params.end;
		//根据前台传来的参数计算出这一时间段的交易量，并返回前台显示
		ctx.body = await createForm.get_form_data(end);
	})
}));

//模块四、连接mysql数据库，导入数据
// var mysql = require('mysql');
// var Sequelize = require('sequelize');
// let sequelize = new Sequelize('database', 'username', 'password', {
// 	host: 'localhost',
// 	port: 3306,
// 	dialect: 'mysql',
// 	dialectOptions: {
// 		socketPath: '/tmp/mysql.sock' // 指定套接字文件路径
// 	},
// 	pool: {
// 		max: 5,
// 		min: 0,
// 		idle: 10000
// 	}
// });
// var connection = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: '123456',
// 	port: '3306',
// 	database: 'test',
// });

// connection.connect();

// var addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
// //增加条目
// var addSqlParams = ['交易单号', '交易时间戳', '交易数量', '交易价格'];

// connection.query(addSql, addSqlParams, function(err, result) {
// 	if (err) {
// 		console.log('[INSERT ERROR] - ', err.message);
// 		return;
// 	}

// 	console.log('--------------------------INSERT----------------------------');
// 	//console.log('INSERT ID:',result.insertId);        
// 	console.log('INSERT ID:', result);
// 	console.log('-----------------------------------------------------------------\n\n');
// });

// connection.end();

//静态资源目录
app.use(convert(serve(path.join(__dirname, './static'))));
app.listen(3000, () => {
	console.log('Server Started');
});