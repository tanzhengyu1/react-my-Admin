import React, { Component } from "react";
import { Button, message, Table, Tooltip, Modal } from "antd";
import {
  FormOutlined,
  DeleteOutlined,
  UploadOutlined,
  PlusOutlined,
  FullscreenOutlined,
  // FullscreenExitOutlined,
  RedoOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { connect } from "react-redux";
import SearchForm from "./SearchForm";
// import { getCourseList } from "./redux";
import {getCourseList} from './redux'
//导入国际包
import {FormattedMessage,useIntl} from 'react-intl'
// import { filterPermissions } from "@utils/permission";
import "./index.less";

// @connect(
  // (state) => ({
    // courseList: state.courseList
    // permissionValueList: filterPermissions(
    //   state.course.permissionValueList,
    //   "Course"
    // )
  // })
  // { getcourseList }
//)
@connect(
  state=>({courseList:state.courseList}),
  {getCourseList}
)



class Course extends Component {
  state = {
    searchLoading: false,
    tableLoading: false,
    page: 1, // 页数
    limit: 5, // 每页显示条数
    previewVisible: false,
    previewImage: "",
  };

  search = searchName => {
    this.setState({
      searchLoading: true,
    });

    const { page, limit } = this.state

    // this.getcourseList({ Coursename: searchName, page, limit }).finally(() => {
    //   this.setState({
    //     searchLoading: false,
    //   });
    // });
  };

  renderTableItem = () => {
    // const { permissionValueList } = this.props;

    return (
      <div>
        <Tooltip title="发布课程">
          <Button type="primary">
            <UploadOutlined />
          </Button>
        </Tooltip>
        <Tooltip title="更新课程">
          <Button type="primary" className="acl-edit-btn">
            <FormOutlined />
          </Button>
        </Tooltip>
        <Tooltip title="删除课程">
          <Button type="danger">
            <DeleteOutlined />
          </Button>
        </Tooltip>
      </div>
    );
  };

  showImgModal = img => {
    return () => {
      this.setState({
        previewVisible: true,
        previewImage: img,
      });
    };
  };

  handleImgModal = () => {
    this.setState({
      previewVisible: false
    });
  };

  columns = [
    {
      title: "序号",
      dataIndex: "index",
      width: 70,
    },
    {
      title: "课程标题",
      dataIndex: "title",
      ellipsis: true,
      width: 200,
    },
    {
      title: "课程描述",
      dataIndex: "description",
      ellipsis: true,
      width: 300,
    },
    {
      title: "课程图片",
      dataIndex: "cover",
      width: 120,
      render: (img) => (
        <img
          onClick={this.showImgModal(img)}
          style={{ width: 50, height: 40, cursor: "pointer" }}
          src={img}
          alt="课程图片"
        />
      ),
    },
    {
      title: "课程价格",
      dataIndex: "price",
      render: (text) => <span>{`￥ ${text}`}</span>,
      width: 120,
      // sorter: {
      //   compare: (a, b) => b.price - a.price,
      // },
      sorter: true // 后台排序~
    },
    {
      title: "课程讲师",
      dataIndex: "teacherId",
      width: 100,
    },
    {
      title: "所属课程分类",
      dataIndex: "subjectParentId",
      width: 150,
    },
    {
      title: "总课时",
      dataIndex: "lessonNum",
      width: 100,
      render: (text) => <span>{`${text} 小时`}</span>,
    },
    {
      title: "总阅读量",
      dataIndex: "viewCount",
      width: 100,
      render: (text) => <span>{`${text} 次`}</span>,
    },
    {
      title: "总购买量",
      dataIndex: "buyCount",
      width: 100,
      render: (text) => <span>{`${text} 个`}</span>,
    },
    {
      title: "最新修改时间",
      dataIndex: "gmtModified",
      width: 200,
    },
    {
      title: "课程状态",
      dataIndex: "status",
      width: 100,
    },
    {
      title: "版本号",
      dataIndex: "version",
      width: 100,
    },
    {
      title: "操作",
      render: this.renderTableItem,
      width: 200,
      fixed: "right",
    },
  ];

  componentDidMount() {
    // const { page, limit } = this.state;
    // this.handleTableChange(page, limit);
  }

  handleTableChange = async (page, limit) => {
    this.setState({
      tableLoading: true,
    });

    // this.getcourseList({ page, limit }).finally(() => {
    //   this.setState({
    //     tableLoading: false,
    //     page,
    //     limit,
    //   });
    // });
    this.currentPage=1
    //调用异步action发送请求,获取下一页数据,视图重新进行渲染
    await this.props.getCourseList({page,limit})
    this.currentPage=page
    this.setState({
      //成功后修改小圈圈的状态
      tableLoading:false
    })
    message.success('数据获取成功')
  };

  getcourseList = ({ page, limit, Coursename, nickName }) => {
    return this.props
      .getcourseList({ page, limit, Coursename, nickName })
      .then(total => {
        if (total === 0) {
          message.warning("暂无用户列表数据");
          return;
        }
        message.success("获取用户列表数据成功");
      });
  };

  render() {
    console.log(this.props)
    //拿到这个界面需要的数据
    const {
      page,
      limit,
      tableLoading,
      previewVisible,
      previewImage,
    } = this.state;
    //从redux 中获取数据
   let {courseList} = this.props
   //map中的第二参数时当前这条的下标,需要获取id把id展现到页面的数据的序号中
    courseList = courseList.items.map((item,index)=>{
      return{
        ...item,
        index:index+1
      }
    })
    //total 表示 课程的所有数据
    const total = this.props.courseList.total

    return (
      <div>
        <div className="course-search">
          <SearchForm />
        </div>

        <div className="course-table">
          <div className="course-table-header">
    <h3>{<FormattedMessage id="courseList" />}</h3>
            <div>
              <Button type="primary" style={{ marginRight: 10 }}>
                <PlusOutlined />
                <span>新建</span>
              </Button>
              <Tooltip title="全屏" className="course-table-btn">
                <FullscreenOutlined />
              </Tooltip>
              <Tooltip title="刷新" className="course-table-btn">
                <RedoOutlined />
              </Tooltip>
              <Tooltip title="设置" className="course-table-btn">
                <SettingOutlined />
              </Tooltip>
            </div>
          </div>
          <Table
            columns={this.columns}
            dataSource={courseList}
            rowKey="_id"
            pagination={{
             
              pageSize: limit,
              pageSizeOptions: ["5", "10", "20", "30", "40", "50", "100"],
              showQuickJumper: true,
              showSizeChanger: true,
              total,
              onChange: this.handleTableChange,
              onShowSizeChange: this.handleTableChange,
              current:this.currentPage
            }}
            //在表格中展示的时正在加载中的小圈圈
            loading={tableLoading}
            //让表格水平方向可以滚动
            scroll={{ x: 1200 }}
            onChange={(pagination, filters, sorter, extra)=>{
              console.log(pagination, filters, sorter, extra)
            }}
          />
        </div>

        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleImgModal}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default Course;
