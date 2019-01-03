使用方法：

1、在bitcoin文件夹下，npm install。

2、node app.js。

3、打开浏览器输入:localhost:3000。

#采用了nodejs向服务器接口请求比特币数据，并且不断将比特币数据存入数据库，做简单的拼接处理。

#nodejs暴露出查询接口，用户访问页面时，发起请求，并按传入的参数去数据库查询数据并返回所需的数据。

#图表使用了echarts。

#后续加入react、antd、webpack、nginx等，部署到服务器。

#用最新的koa容器去重新对项目文件与路由分层。