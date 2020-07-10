import React, { Component } from "react";
import { Button, Table } from 'antd';
import { PlusSquareOutlined,FormOutlined,DeleteOutlined } from '@ant-design/icons'

import {connect} from 'react-redux'
 
import './index.less'
import {getSubjectList} from './redux'
const columns = [
  { title: '分类名称', dataIndex: 'title', key: 'name' },

  {
    title: '操作',
    dataIndex: '',
    key: 'x',
    render: () => (
      <>
        <Button type='primary' className='update-btn'>
          <FormOutlined />
        </Button>
        <Button type='danger'>
          <DeleteOutlined />
        </Button>
      </>
    ),
    width:200
  },
];
@connect(
  state=>({subjectList:state.subjectList}),{getSubjectList})
 class Subject extends Component {
  currentPage=1
    // state={
    //   subject:{}
    // }
    componentDidMount(){  
      // this.getComponentDidMount()
      this.props.getSubjectList(1,10)
    }


    // getComponentDidMount=async (page,limit)=>{
    //   const res =await reqGetSubjectList(page,limit)
    //   this.setState({
    //     subject:res
    //   })
    // }

    handleChang=(page,limit)=>{
      this.props.getSubjectList(page,limit)
      this.currentPage=page
    }
    handleSizeChang=(page,limit)=>{

      this.props.getSubjectList(page,limit)
      this.currentPage=page
    }

    
  render() {
    console.log(this.props.subjectList)
    return (
      <div className='subject'>
        <Button type="primary" className='subject-btn'>
          <PlusSquareOutlined />
         新建
       </Button>
        <Table
          columns={columns}
          expandable={{
            expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
            rowExpandable: record => record.name !== 'Not Expandable',
          }}
          
          dataSource={this.props.subjectList.items}
          
          rowKey='_id'
          pagination={{
            total: this.props.subjectList.total, //total表示数据总数
            showQuickJumper: true, //是否显示快速跳转
            showSizeChanger: true, // 是否显示修改每页显示数据数量
            pageSizeOptions:['5','10','15'], //设置每天显示数据数量的配置项
            defaultPageSize:5, //每页默认显示数据条数 默认是10,
            onChange:this.handleChang,
            onShowSizeChange:this.handleSizeChang,
            current:this.currentPage
          }}
        />
      </div>

    )
  }
}
export default Subject