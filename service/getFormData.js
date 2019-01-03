//此文件用于查找与处理最近30天的交易记录的逻辑
const fs = require('fs');
//下面的函数是交易额查询方法，返回总交易额trade。
exports.get_form_data = function(end) {
  return new Promise((resolve, reject) => { //给index/update页面响应一个请求，地址指向数据库
    //将传递来的起始和终止的时间参数转化为和交易记录中格式匹配的时间戳
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
    // console.log(fileData.length);

    if (fileData) {
      resolve([
        fileData,
        end
      ]);
    } else {
      reject({
        data: 0
      });
    }
  }).then(function(v) {
    let fileData = v[0]; //交易记录
    let end = v[1]; //30天前
    return new Promise((resolve, reject) => {
      let trade = 0;
      let price;
      let amount;
      let oneday = 86400;
      let everyday = [];
      let item = [];
      // price = fileData[0].price;

      //根据时间计算总成交额trade。并返回数据。
      setTimeout(function() {
        let lastDealTime = fileData[fileData.length - 1].date; //当前最后一笔交易的时间戳
        let beforeTime = parseInt(end); //30天前的时间戳
        console.log(typeof lastDealTime);
        for (let i = 0, l = fileData.length; i < l; i++) {
          //过去30天的交易记录
          if (beforeTime <= fileData[i].date && fileData[i].date <= (lastDealTime)) {
            item.push(fileData[i]);
          }
        }
        // console.log(everyday[everyday.length - 1])
        // console.log(item)
        let arr = []; //存储30天的成交额。
        //按天计算总成交额，并保存进新数组。
        for (let j = beforeTime; j < lastDealTime; j += oneday) {
          trade = 0;
          for (let i = 0, l = item.length; i < l; i++) {

            if (item[i].date >= j && fileData[i].date <= (j + oneday)) {
              price = item[i].price;
              amount = item[i].amount;
              trade = parseFloat(price) * parseFloat(amount) + trade
              trade = Math.floor(trade);
            }
          }
          arr.push(trade);
        }
        console.log(arr);
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {

          let num = arr[i] - arr[i + 1];
          newArr.push(num);
        }
        newArr[29] = arr[29];
        console.log(newArr);
        // console.log("123123", everyday);
        // console.log(fileData.length)
        //返回30天的总销量
        resolve(newArr);
      }, 1);
    });
  })
}