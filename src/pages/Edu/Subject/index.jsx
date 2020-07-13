import React, { Component } from "react";
//导入antd 组件
import { Button, Table, Tooltip, message, Modal } from 'antd';
import {
  PlusSquareOutlined, FormOutlined,
  DeleteOutlined, ExclamationCircleOutlined
}
  from '@ant-design/icons'
//导入 connect -->连接redux和React 组件,给它包裹下所有的组件提供方法与数据
import { connect } from 'react-redux'

//导入 redux中的异步action 
import { getSubjectList, getTowSubjectList, UpdetaSubjectList, subjectList } from './redux'
//直接导入删除课程分类的方法
import { reqDeleteSubjectList } from '@api/edu/subject'
//导入样式文件
import './index.less'
const { confirm } = Modal
@connect(
  //subjectList 此时接收到了reducers 里面的初始化数据
  state => ({ subjectList: state.subjectList }),
  //传入是一个异步action,但是在展示组件中使用的函数时通过connet 进行封装后的
  { getSubjectList, getTowSubjectList, UpdetaSubjectList })
class Subject extends Component {
  currentPage = 1
  pageSize = 10
  state = {
    //如果subjectId没有,代表表格的每一行直接显示分类的数据title,
    //如果有值,那么就是要修改数据id,然后显示input
    subjecId: '',
    //用来设置受控组件
    subjectTitle: ''
  }
  componentDidMount() {
    // this.getComponentDidMount()
    this.props.getSubjectList(1, 10)
  }
  // getComponentDidMount=async (page,limit)=>{
  //   const res =await reqGetSubjectList(page,limit)
  //   this.setState({
  //     subject:res
  //   })
  // }
  //点击页码,获取对应页码的数据
  // 参数一:当前点击的页码 参数二:当前页码需要展示几条数据
  handleChang = (page, pageSize) => {
    //发送请求
    this.props.getSubjectList(page, pageSize)
    //currentPage 是显示当前页码 
    this.currentPage = page
  }

  //一页显示几条数据变化时触发的回调函数 
  //参数一:当前点击的页面 参数二:需要显示几条数据
  handleSizeChang = (current, size) => {
    // console.log(current, size)
    this.props.getSubjectList(current, size)
    this.pageSize = size
  }

  //点击跳转转到添加课程分类中
  handleClick = () => {
    //新建时在教学模块下面,所以前面要加edu
    this.props.history.push('/edu/subject/add')
  }

  //点击呵展开按钮
  //expanded 为真 代表展开 false 代表关闭
  //record  就是对应的这一行的数据
  handleExpand = (expanded, record) => {
    //判断如果时展开的就马上请求二级菜单的数据,关闭状态就啥也不干
    if (expanded) {
      //请求二级菜单数据,需要传入当前这一行的id
      this.props.getTowSubjectList(record._id)
    }
  }
  //点击编辑按钮,数据变为input 回调函数
  InputClick = (value) => {
    //修改subject
    return () => {
      this.setState({
        //修改当前这一行的id和title属性
        subjecId: value._id,
        subjectTitle: value.title
      })
      this.oldSujectTitle = value.title
    }
  }
  //修改数据是,受控组件input的change回调函数
  //把当前修改的数据重新给subjectTitle
  ChangeInput = e => {
    this.setState({
      subjectTitle: e.target.value.trim()
    })
  }
  //取消按钮的事件回调
  handleCancel = () => {
    this.setState({
      subjecId: '',
      subjectTitle: ''
    })
  }
  //更新确认按钮的事件回调
  handleUpdeta = () => {
    let { subjecId, subjectTitle } = this.state
    //优化代码
    if (subjectTitle.length === 0) {
      message.error('课程名称不能为空')
      return
    }
    if (this.oldSujectTitle === subjectTitle) {
      message.error('课程名称不能相同')
      return
    }
    this.props.UpdetaSubjectList(subjectTitle, subjecId)
    message.success('修改成功')
    this.handleCancel()
  }
  handleDel = value => () => {
    confirm({
      title: (
        <>
          <div>
            确定要删除
      <span style={{ color: 'pink', fontSize: 35 }}>{value.title}</span>
        吗???
        </div>
        </>
      ),
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        // 删除数据的方法
        await reqDeleteSubjectList(value._id)
        message.success('删除成功')
        //删除时需要注意的点
        //如果当前页码时最后哦一页,并且当前页码只有一条数据时,应该请求上一页的数据
        //1,判断当前是否时第一页 this.currentpage !==1
        //2.判断当前页码只剩一条数据 -->说明没有修改redux,所以redux中的items.length
        //长度为一就是当前页面只有一条数据
        //3.判断是当前页面时否时最后一页 --> 用所有数据条数/数据一共有多少页
        //然后通过ceil方法向上取整 例如 11/2 =3 所以第三页一定是最后一页
        

        const totalPage = Math.ceil(
          this.props.subjectList.total / this.pageSize
        )
        if (
          this.currentPage !== 1 &&
          this.props.subjectList.items.length === 1 &&
          totalPage === this.currentPage
        ) {
          this.props.getSubjectList(--this.currentPage, this.pageSize)
          return
        }
        this.props.getSubjectList(this.currentPage, this.pageSize)
      }
    })
  }
  render() {
    //columns必须写到render中,因为state变化,render才会重新调用,columns才会重新执行

    const columns = [
      {
        title: '分类名称',
        //  dataIndex: 'title', 
        key: 'title',
        render: (value) => {
          //如果state里面的id 与 这一条数据相同,那么就展示Input
          //以为第一页有十条数据,素以render回调会执行十次
          //这里的value是对应的每一条数据
          if (this.state.subjecId === value._id) {
            return (
              <input value={this.state.subjectTitle}
                className="suject-inout"
                onChange={this.ChangeInput}
              />
            )
          }
          return <span>{value.title}</span>
        }
      },

      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: value => {
          //判断当前数据的id是否与state里面的subjectId的值相同,
          //如果是,那么就显示确定和取消按钮,否则展示修改和删除按钮
          if (this.state.subjecId === value._id) {
            return <>
              <Button type='primary' className='update-btn' onClick={this.handleUpdeta}>确认</Button>
              <Button type='danger' onClick={this.handleCancel}>取消</Button>
            </>
          }
          return (
            <>
              <Tooltip title="更新课程分类">
                <Button type='primary' className='update-btn' onClick={this.InputClick(value)} >
                  <FormOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="删除课程分类">
                <Button type='danger' onClick={this.handleDel(value)} >
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </>
          )
        },
        width: 200
      },
    ];
    console.log(this.props.subjectList)
    return (
      <div className='subject'>
        <Button type="primary" className='subject-btn'
          onClick={this.handleClick}>
          <PlusSquareOutlined />
         新建
       </Button>
        <Table
          //控制列
          columns={columns}
          //控制展开项
          expandable={{
            //expandedRowRender 会把二级菜单渲染到一级菜单的位置,所以不用
            // expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
            // rowExpandable: record => record.name !== 'Not Expandable',
            //当点击展开按钮,触发事件处理函数
            onExpand: this.handleExpand
          }}
          // 每一行的数据
          dataSource={this.props.subjectList.items}
          // 把数据中的_id作为key的值
          rowKey='_id'
          pagination={{
            total: this.props.subjectList.total, //total表示数据总数
            showQuickJumper: true, //是否显示快速跳转
            showSizeChanger: true, // 是否显示修改每页显示数据数量
            pageSizeOptions: ['5', '10', '15'], //设置每天显示数据数量的配置项
            // defaultPageSize:5, //每页默认显示数据条数 默认是10,
            onChange: this.handleChang,
            onShowSizeChange: this.handleSizeChang,
            current: this.currentPage
          }}
        />
      </div>

    )
  }
}
export default Subject