import React, { Component } from 'react';
//导入antd组件
import { Card, Input, Form, Select, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
//导入路由组件
import { Link } from 'react-router-dom'
//导入样式
import './index.less'
// import {connect} from 'react-redux'
// import {getSubjectList} from '../../redux'
//导入异步的action 
import { reqGetSubjectList,reqAddSubjectList } from '@api/edu/subject'
//导入样式
const Option = Select.Option

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
  state = {
    subjectList: {
      total: 0,
      items: []
    }
  }
  //类似累加器,用来储存下一次请求的也是
  page = 1
  //组件挂载成功,立即发送请求获取一级课程分类的数据
  async componentDidMount() {
    //由于这是后台管理系统,一级分类的数据可能会随时变化,所以不建议直接从redux里面拿数据
    //所以推荐使用redux提供的函数发送请求,获取最新的数据,存在redux中,
     // this.props.getSubjectList(1,10)
    //再从redux中拿数据  请求第一个参数是 当前的页面数, 第二歌参数为当前页面显示几条数据
    //直接 请求数据
    const res = await reqGetSubjectList(this.page++, 10)
    this.setState({
      subjectList: res
    })

  }
  //点击加载更多一级课程分类的数据
  handleMore = async () => {
    //继续调用请求
    const res = await reqGetSubjectList(this.page++, 10)
    //其实就是把新的数据与老的数据进行拼接
    //结构第一页的数据,和所有的数据
    const newItems = [...this.state.subjectList.items, ...res.items]
    //把拼接好的数据重新赋值给totao 和 items
    this.setState({
      subjectList: {
        total: res.total,
        items: newItems
      }
    })
  }
  
// 点击添加按钮,表单校验成功之后的回调函数
 onFinish =async values => {
  try {
    //fa发送异步请求,请求新增课程分类
    await reqAddSubjectList(values.subjectname,values.parentid)
    //成功提示框
    message.success('课程分类添加成功')
    //添加成功后跳转到 list页面-->课程分类页面
    this.props.history.push('/edu/subject/list')
  } catch  {
    message.error('课程分类添加失败')
  }
}
  render() {
    console.log(this.props.subjectList)
    return (
      <Card title={
        <>
          <Link to='/edu/subject/list'>
            <ArrowLeftOutlined />
          </Link>
          <span className="subject-add">新增课程</span>
        </>
      }
      >
        <Form
          {...layout}
          name='subject'
          // 当点击表单内的提交按钮,onFinish会触发
          onFinish={this.onFinish}
          // 提交失败的时候会触发
          // onFinishFailed={onFinishFailed}
        >
          {/* form表单中每一个表单都需要使用Form.Item包裹 */}
          <Form.Item
          //表示提示的文字
            label='课程分类名称'
            // 表单想提交时的属性
            name='subjectname'
            //校验表单
            rules={[
              {
                required: true,
                //未通过时,提示文字
                message: '请输入课程分类!'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='父级分类id'
            name='parentid'
            rules={[
              {
                required: true,
                message: '请选择分类id'
              }
            ]}
          >
            <Select
            //自定义下拉框列表中展示的内容-->给下拉框增加一条列表项
              dropdownRender={menu => {
                return (
                  <>
                  {/* 表示我们写再子节点位置的option渲染到这里 */}
                    {menu}
                    {/* 利用 与  的语法进行判断 ,把总数据条数与,当前页面的数据进行比较
                    此时 布尔值为 真, 会展示后面的数据,
                    如果 布尔值 为假 ,那么 加载更多数据这个按钮时不会出现的
                    */}
                    {this.state.subjectList.total > 
                    this.state.subjectList.items.length && (
                      <Button type='link' onClick={this.handleMore}>
                        加载更多数据
                      </Button>
                    )}
                  </>
                )
              }}
            >
              {/* 一级课程分类,这一项不是动态数据,所以可以直接写死 */}
              <Option value={0} key={0}>
                {'一级菜单'}
              </Option>
              {/* 动态渲染一级课程分类的数据,并赋予id与名字 */}
              {this.state.subjectList.items.map(Subject => {
                return (<Option
                  value={Subject._id} key={Subject._id}>
                  {Subject.title}
                </Option>
                )
              })}
            </Select>
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








