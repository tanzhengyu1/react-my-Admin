//用node 的express 框架,搭建框架
//1,引入express
const express = require('express')
//2.引入mockjs
const Mock = require('mockjs')
//从mock的身上拿到Random 的随机方法
const Random = Mock.Random
//ctitle 是中文标题的方法
Random.ctitle()
//调用express 的到一个对象
const app = express()
//use 是express 中的一个中间件
//使用来解决跨域的
app.use((req,res,next)=>{
    //设置响应头
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Headers', 'content-type,token')
    res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
    //调用下一个中间件
    next()
})
//app.get 是 get请求
//第一个参数是接口的路径
// 第二个参数是一个回调函数 当接收对应的请求会触发
//这个回调中接收两个参数,req --> 请求对象, res ==>响应对象
// 通过req 上传参数  通过 res上传数据
app.get('/admin/edu/subject/:page/:limit',(req,res)=>{
    //page 是 id , limit 是几个数据
    const {page,limit} = req.params
    const data=Mock.mock({
        total:Random.integer(+limit+2,limit*2),
        [`itmes|${limit}`] :[
            {
            '_id|+1':1,
            title:'@ctitle(2,5)',
            parentId:0
            }
        ]
    })
    //res 是响应对象
    // 后台返给游览器的应该是json 格式的字符串
     //下面是在 把对象转化成json 字符串格式,返回给游览器
    res.json({
        code:20000,
        success:true,
        data,
        message:''
    })
})
app.listen(8888,err=>{
    if(err){
      return console.log('服务器失败',err)
        
    }
    console.log('服务器启动成功,端口8888正在运行')
})
