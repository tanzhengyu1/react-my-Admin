import React, { Component } from 'react';
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { reqGetQinniuToken } from '@api/edu/lesson'
import * as qiniu from 'qiniu-js'
import { nanoid } from 'nanoid'
const MAX_VIDEO_SIZE = 50 * 1024 * 1024
class index extends Component {
    constructor() {
        super()
        const str = localStorage.getItem('upload_token')
        if (str) {
            const res = JSON.parse(str)
            this.state = {
                expires: res.expires,
                uploadToken: res.uploadToken
            }
        } else {
            this.state = {
                expires: 0,
                uploadToken: ''
            }
        }
    }
    handleBeforeUpload = (file, fileList) => {
        return new Promise(async (resolve, reject) => {
            if (file.size > MAX_VIDEO_SIZE) {
                message.error('视频不能超过50m')
                reject('视频不能超过50m')
                return
            }
            if (Date.now() > this.state.expires) {
                const { uploadToken, expires } = await reqGetQinniuToken()
                this.saveUploadToken(uploadToken, expires)
            }

            resolve(file)
        })
    }
    saveUploadToken = (uploadToken, expires) => {
        const targetTime = Date.now() + expires * 1000-2*60*1000
        expires = targetTime
        const upload_token = JSON.stringify({ uploadToken, expires })
        localStorage.setItem('upload_token', upload_token)
        this.setState({
            uploadToken,
            expires
        })
    }

    handleCustomReques = value => {
        // console.log('上传了')
        // console.log(this.state.uploadToken)
        const file =value.file
        const key = nanoid(10) //生成一个长度为10的id,保证是唯一的
          // token 需要给本地服务器发送请求获取 (时效两个小时)
          const token = this.state.uploadToken   
           const putExtra = {
      
            mimeType: 'video/*' //用来限定上传文件类名
            
        }
          // 创建config对象
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
                value.onError(err)
            },
            // 上传成功触发的回调函数 
            complete:res=> { 
                console.log(res)
                value.onSuccess(res)
                this.props.onChange('http://qdgfsh13k.bkt.clouddn.com/' + res.key)
            }
        }
        // 上传开始
        this.subscription = observable.subscribe(observer)
    }
  
    componentWillUnmount(){
        console.log(this)
        this.subscription && this.subscription.unsubscribe()
    }
        render() {
            return (
                <div>
                    <Upload
                        beforeUpload={this.handleBeforeUpload}
                        customRequest={this.handleCustomReques}
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