import React, { Component } from 'react';
//导入antd组件
import { Card, Input, Form, Switch, Button, message, Upload } from 'antd'
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons'
//导入路由组件
import { Link } from 'react-router-dom'
import MyUpload from '../MyUpload'
import {reqAddLessonList} from '@api/edu/lesson'
//导入样式
import './index.less'


//表单布局属性
const layout = {
    // antd把一个宽度分为24份
    // 表单文字描述部分
    labelCol: {
        span: 3
    },
    // 表单项部分
    wrapperCol: {
        span: 6
    }
}

// 表单校验失败的回调函数
// const onFinishFailed = errorInfo => {
//   console.log('Failed:', errorInfo)
// }
// @connect(state=>({subjectList:state.subjectList})

// ,{getSubjectList})
class index extends Component {
    onFinish= async values=>{
        console.log(values)
        const chapterId= this.props.location.state._id
        const data={
            ...values,
            chapterId
        }
       await reqAddLessonList(data)
       message.success('课时添加成功')
       this.props.history.push('/edu/chapter/list')
        console.log(this.props)
    }
    render() {
        console.log(this.props.subjectList)
        return (
            <Card title={
                <>
                    <Link to='/edu/chapter/list'>
                        <ArrowLeftOutlined />
                    </Link>
                    <span className="lesson-add">新增课时</span>
                </>
            }
            >
                <Form
                    {...layout}
                
                    // 当点击表单内的提交按钮,onFinish会触发
                    onFinish={this.onFinish}
                // 提交失败的时候会触发
                // onFinishFailed={onFinishFailed}
                initialValues={{
               
                    free:true
                }}
                >
                    {/* form表单中每一个表单都需要使用Form.Item包裹 */}
                    <Form.Item
                        //表示提示的文字
                        label='课时名称'
                        // 表单想提交时的属性
                        name='title'
                        //校验表单
                        rules={[
                            {
                                required: true,
                                //未通过时,提示文字
                                message: '请输入课时名称!'
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='是否免费'
                        name='free'
                        rules={[
                            {
                                required: true,
                                message: '请选择是否免费'
                            }
                        ]}
                        valuePropName='checked'
                    >
                        <Switch
                            checkedChildren='开启'
                            unCheckedChildren="关闭"
                            defaultChecked
                        />
                    </Form.Item>
                    <Form.Item
                        label='上传视频' name="video"
                        rules={[
                            {
                                required: true,
                                message: '请选择上传视频'
                            }
                        ]}
                    >
                     <MyUpload></MyUpload>
                    </Form.Item>
                    <Form.Item>
                        {/* htmlType 这个时表单的提交按钮 */}
                        <Button type='primary' htmlType='submit'>
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        );
    }
}

export default index;








