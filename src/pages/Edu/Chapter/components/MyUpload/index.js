//上传视频的逻辑比较复杂,所以自定义一个组件,包裹antd中的upload组件,
//所以上传的逻辑也卸载这个自定义的组件中
import React, { Component } from 'react';
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { reqGetQinniuToken } from '@api/edu/lesson'

import * as qiniu from 'qiniu-js'
import { nanoid } from 'nanoid'
//定义上传视频的大小
const MAX_VIDEO_SIZE = 50 * 1024 * 1024

class index extends Component {
    //定义构造函数
    //构造函数中只是从缓存中获取数据/定义状态
    constructor() {
        super()
        //从缓存中获取有没有token
        const str = localStorage.getItem('upload_token')
        //如果有,说明是有内容的字符串,说明之前储存过token
        //这里没有必要判断token是否过期,只需要从缓存中拿到值就行,赋值给state
        //把缓存的的字符串转换成对象,对象中是有uploadToken和expires这两个数据的
        //把转换出来额数据赋值
        if (str) {
            const res = JSON.parse(str)
            this.state = {
                expires: res.expires,
                uploadToken: res.uploadToken
            }
        } else {
            //没有内容,und,说明没有存储过
            this.state = {
                expires: 0,
                uploadToken: ''
            }
        }
    }
    //该函数是要在上传视频之前调用
    //第一个参数 里面拿到的是 上传视频时的文件
    handleBeforeUpload = (file, fileList) => {

        // console.log(file)
        //返回一个 promise 判断成功 与失败
        return new Promise(async (resolve, reject) => {
            //首先判断文件的大小是否符合要求,超过的话,下面所有代码不执行
            if (file.size > MAX_VIDEO_SIZE) {
                message.error('视频不能超过50m')
                //如果视频过大,后面的代码就不执行了
                reject('视频不能超过50m')
                return
            }
            //再在请求之前判断token是否过去了
            if (Date.now() > this.state.expires) {
                //如果 token 过期了需要重新获取请求
                const { uploadToken, expires } = await reqGetQinniuToken()
                //重新获取 要将数据存储
                // state 里 时有最新的数据的,本地缓存中也时最新数据,所以此时的请求的数据时最新的5
                this.saveUploadToken(uploadToken, expires)
            }

            resolve(file)
        })
    }
    //储存uoloadTOken 和过期时间的方法 第一个参数是 token 第二个参数是 过期时间
    saveUploadToken = (uploadToken, expires) => {
        //把uoloadToke储存到本地缓存
        //locastorage 不能直接存对象,需要用JSON.stringify 转成字符串
        //expires 时秒数,时过期时间的周期值,7200表示的时两个小时,超过了就需要重新获取请求
        //获取到token的时间 + 时间 周期 才是 过期目标的最终 获取时间
        //当 七牛云 创建token ,就已经开始计时了,当游览器得到token的时候,可能过去了很久
        //所以在计算目标 过期时间 也要考虑 到 那段时间
        //targetTime 存的时 当前目标基础数据减去 当中处理 的大概时间
        const targetTime = Date.now() + expires * 1000 - 2 * 60 * 1000
        expires = targetTime
        const upload_token = JSON.stringify({ uploadToken, expires })
        localStorage.setItem('upload_token', upload_token)
        //把 token 储存到state中
        this.setState({
            uploadToken,
            expires
        })
    }
    //只有 在真正传视频的时候调用,次函数会覆盖默认上传方式
    //value 拿到的时拿钱视频的 数据,里面有三个方法
    handleCustomReques = value => {
        console.log('上传了')
        console.log(value)
        const file = value.file
        const key = nanoid(10) //生成一个长度为10的id,保证是唯一的
        // token 需要给本地服务器发送请求获取 (时效两个小时)
        const token = this.state.uploadToken
        //上传的配置项,呵配置上传文件的类型
        // * 可以上传所有格式的视频
        //后代限制上传文件的类型,不是视频,就不饿能上传成功
        const putExtra = {

            mimeType: 'video/*' //用来限定上传文件类名

        }
        // 创建config对象,控制上传到那个区域 
        const config = {
            region: qiniu.region.z2 // 选择上传域名区域 z2表示华南
        }
        const observable = qiniu.upload(
            file, // 上传的文件
            key, //最终上传之后的文件资源名 (保证唯一) 使用nanoid库,生成这个key
            token, //上传验证信息，前端通过接口请求后端获得
            putExtra,
            config
        )
        // 创建上传过程触发回调函数的对象
        const observer = {
            //上传过程中触发的回调函数
            next(res) {
                console.log(res)
                value.onProgress(res.total)
            },
            //上传失败触发的回调函数
            error(err) {
                console.log(err)
                value.onError(err)
            },
            // 上传成功触发的回调函数 
            complete: res => {
                console.log(res)
                value.onSuccess(res)
                //注意:解决上传视频成功,但表单验证不通过的问题
                //手动调用 form.Item传过来的Onchange 方法,需要传入表单控制的数据
                //以后要给本地服务器存储的实际就是 上传视频成功的地址
                //地址 : 自己七牛云空间的域名 + 文件名
                this.props.onChange('http://qdgfsh13k.bkt.clouddn.com/' + res.key)
                // this.props.onChange('http://qdcdb1qpp.bkt.clouddn.com/' + res.key)
                // console.log('http://qdgfsh13k.bkt.clouddn.com/' + res.key)
            }
        }
        // 上传开始 -->会返回一个 上传取消的方法
        this.subscription = observable.subscribe(observer)
    }
    //在组件 卸载的时候调用 上传成功返回的上传取消方法
    componentWillUnmount() {
        console.log(this)
        this.subscription && this.subscription.unsubscribe()
    }
    render() {
        // console.log(this.state.expires)
        // console.log(Date.now())
        return (
            <div>
                <Upload
                    beforeUpload={this.handleBeforeUpload}
                    customRequest={this.handleCustomReques}
                    //前端控制上传视频的类型,不是视频文件,就看不到
                    accept='video/*'
                >
                    <Button>
                        <UploadOutlined /> 上传视频
                    </Button>
                </Upload>
            </div>
        );
    }
}

export default index;