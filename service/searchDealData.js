//此文件处理查询某时间段内的逻辑
const rp = require('request-promise');
const fs = require('fs');
//下面的函数是交易额查询方法，返回总交易额trade。
exports.get_search_data = function(start, end) {

  return new Promise((resolve, reject) => { //给index/update页面响应一个请求，地址指向数据库

    //将传递来的起始和终止的时间参数转化为和交易记录中格式匹配的时间戳
    let newstart = Date.parse(start) / 1000;
    let newend = Date.parse(end) / 1000;
    // const info = JSON.parse(result)
    //读取json文件，并将数据转化成可用的格式
    let fileContent = fs.readFileSync('./dataBase.json', 'utf8');
    let changeContent = fileContent.replace(/\]/g, "");
    var finalContent = changeContent.replace(/\[/g, ",");
    if (finalContent.substr(0, 1) == ',') {
      finalContent = finalContent.substr(1);
    }
    // let fileData = finalContent.split(",");
    //转化成对象
    let fileData = eval("[" + finalContent + "]")
    // = JSON.parse(fileContent);

    if (fileData) {
      resolve([fileData,
        newstart,
        newend
      ]);
    } else {
      reject({
        data: 0
      });
    }
  }).then(function(v) {
    let fileData = v[0]; //交易记录
    let newstart = v[1]; //起始时间
    let newend = v[2]; //结束时间
    return new Promise((resolve, reject) => {
      let trade = 0;
      let price;
      let amount;
      // price = fileData[0].price;
      console.log(fileData);
      console.log(newstart);
      //根据时间计算总成交额trade。并返回数据。
      setTimeout(function() {
        for (let i = 0, l = fileData.length; i < l; i++) {
          if (fileData[i].date >= newstart && fileData[i].date <= newend) {
            price = fileData[i].price;
            amount = fileData[i].amount;
            trade = parseFloat(price) * parseFloat(amount) + trade;
          }
        }
        trade = Math.floor(trade);
        console.log(trade);
        // console.log(fileData.length)
        resolve(trade);
      }, 1);

    });
  })
}
//根据传来的时间戳遍历json文件中的交易记录，计算一段时间内总的比特币交易量并返回数据。
// function contrast(fsdata, newstart, newend) {

//   return new Promise((resolve, reject) => {
//     let trade = 0;
//     console.log(newstart);
//     for (let i = 0, l = fsdata.length; i < l; i++) {
//       if (fsdata[i].date >= newstart && fsdata[i].date <= newend) {
//         trade += fsdata[i].prise.parseFloat() * fsdata[i].amount.parseFloat();

//       }
//     }
//     console.log(trade);
//     // console.log(fsdata.length)
//     resolve(
//       trade
//     );
//   });

// }
// return function(cb) {
//   var http = require('http');
//   var qs = require('querystring');
//   var data = {
//     key: key,
//     start: start,
//     end: end
//   };

//   /*向交易量查询接口发请求*/
//   var content = qs.stringify(data);
//   var options = {
//     hostname: 'localbitcoins.com',
//     port: 80,
//     path: '/bitcoincharts/cny/trades.json',
//     method: 'GET'
//   };

//   var req = http.request(options, function(res) {
//     var body = '';

//     res.setEncoding('utf8');
//     res.on('data', function(data) {
//       body += data;
//     });
//     res.on('end', function() {
//       cb(null, body);
//     });
//   });

//   req.end();
// }