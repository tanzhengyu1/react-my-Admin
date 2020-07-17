import React, { Component } from "react";
import { Button, message, Tooltip, Modal, Alert, Table } from "antd";
import {
  FullscreenOutlined,
  RedoOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import Player from 'griffith'
import  screenfull from 'screenfull'
import relativeTime from "dayjs/plugin/relativeTime"

import { connect } from "react-redux"
import SearchForm from "./SearchForm"
import { getLessonList,chapterList,batchDelChapter,batchDellesson } from './redux'
import "./index.less"

dayjs.extend(relativeTime)

@connect(
  state => ({
    // courseList: state.courseList
    // permissionValueList: filterPermissions(
    //   state.course.permissionValueList,
    //   "Course"
    // )
    chapterList: state.chapterList
  }),
  { getLessonList,batchDelChapter,batchDellesson }
)
class Chapter extends Component {
  state = {
    searchLoading: false,
    previewVisible: false,//控制modal窗口是否显示
    previewImage: "",
    selectedRowKeys: [],
    video: ''
  };
//video 是要游览的视频路径
  showModal = video => () => {
    this.setState({
      previewVisible: true,
      video
    });

  };

  handleImgModal = () => {
    this.setState({
      previewVisible: false,
    });
  };

  componentDidMount() {
    // const { page, limit } = this.state;
    // this.handleTableChange(page, limit);
  }

  handleTableChange = (page, limit) => {
    this.setState({
      tableLoading: true,
    });

    this.getcourseList({ page, limit }).finally(() => {
      this.setState({
        tableLoading: false,
        page,
        limit,
      });
    });
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

  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  };
  // 定义点击展开按钮 展现当前课程里面的的小课程处理函数
  //expand 参数为 当前点击的状态是否被点击 record 参数为当前被点击这行的数据
  handleClickExpand = (expand, record) => {
    console.log(expand, record)
    //如果当前状态被点击,那么就发送请求
    if (expand) {
      //发送请求获取数据
      this.props.getLessonList(record._id)
    }
  }
  //点击跳转到新增课时的页面
  handleAddLesson = data => () => {
    this.props.history.push('/edu/chapter/addlesson', data)
  }
//批量删除按钮的事件处理函数
  handleBatchDel = () => {
    //弹出comfirm对话框
    Modal.confirm({
      title: '确定要删除吗?',
      onOk: async () => {
      // selectedRowKeys 里面存的是所有选中的课时,和章节
      //所以在批量删除之前要分清哪些是课时id,哪些是章节id
        let chapterIds = [] //存储 章节id
        let lessonIds = []// 存储课时id
        //拿到所有被选中的的id
        let selecteRowKeys = this.state.selectedRowKeys
        //拿到章节数据
        let chapterList = this.props.chapterList.items
        //遍历章节数据
        chapterList.forEach(chapter => {
          //拿到章节数据的id
          let chapterId = chapter._id
          //从selectedRowKeys里面找是否有章节id,如果有就拿出来
          let index = selecteRowKeys.indexOf(chapterId)
    
          if (index > -1) {
            //说明找到了章节id,然后从selectedRowKeys 把这些数据切割
            //splice会修改原来的数据,并且 返回切割的新的数组
            //此时newArr 里面存的就是 章节的id
            let newArr = selecteRowKeys.splice(index, 1)
            //往 chapterIds添加 章节id
            chapterIds.push(newArr[0])
          }
        })
        //因为splice 切割后的数据 里面就只剩下 课时的id了
        lessonIds = [...selecteRowKeys]
        console.log(chapterIds)
        console.log(selecteRowKeys)
        //调用异步action,删除章节 ,删除课时
        await this.props.batchDelChapter(chapterIds)
        await this.props.batchDellesson(lessonIds)
        //删除成功后提示框
        message.success('批量删除成功')
      }
    })
  }
  //点击全弄按钮,页面变成全屏
  handlescreenfull=()=>{
    screenfull.toggle()
  }
  render() {
    const { previewVisible, previewImage, selectedRowKeys } = this.state;

    const columns = [
      {
        title: "章节名称",
        dataIndex: "title",
      },
      {
        title: "是否免费",
        dataIndex: "free",
        //如果没有写dataIndex 那么render接收到的就是这一行的数据
        //如果写了,那么render函数接收的就是这一行数据中对应的dataIndex那个属性的值
        //每一行都有free这个属性
        //render 里面第一个参数是当前这行的数据
        //利用三元表达式 判断数据 显示状态 -->章节不展现是否免费,课时才显示
        render: isFree => {
          return isFree === true ? "是" : isFree === false ? "否" : "";
        }
      },
      {
        title: "视频",
        //value表示的就是这一行的数据 
        render: value => {
          //如果是章节数据,不展示任何内容
          //如果是课时数据,判断是否免费,是免费才可以游览按钮
          //如果没有free属性 不显示 游览按钮
          //如果课时的free是false,返回的是und
          if (!value.free) return
          //否则 显示 游览按钮
          return <Button onClick={this.showModal(value.video)}>预览</Button>
        },
      },
      {
        title: "操作",
        width: 300,
        fixed: "right",
        render: data => {
          // if ("free" in data) {
            //其实下面的data.free 就是用来判断当前数据是章节还是课时
          return (
            <div>
              {/* 章节数据中是没有free属性的,所以新增课时按钮的操作会执行 ,课时数据才有free */}
              {/* 因为课时数据中的free false,所以返回的也是Und,所以课时是不会显示新增按钮 */}
              {data.free === undefined && (
                <Tooltip title="新增课时">
                  <Button type="primary"
                    onClick={this.handleAddLesson(data)}
                    style={{ marginRight: 10 }}
                  >
                    <PlusOutlined />
                  </Button>
                </Tooltip>
              )}
            {/* 如果是课时,就显示更新课时,否则反之 */}
              <Tooltip title={data.free === undefined ? '更新章节' : '更新课时'}>
                <Button type="primary" style={{ marginRight: 10 }}>
                  <FormOutlined />
                </Button>
              </Tooltip>
               {/* 如果是课时,就显示删除课时,否则反之 */}
              <Tooltip title={data.free === undefined ? '删除章节' : '删除课时'}>
                <Button type="danger">
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </div>
          );
        }
      },
      // },
    ];
    const sources = {
      hd: {
        play_url: this.state.video,
        bitrate: 1,
        duration: 1000,
        format: '',
        height: 500,
        size: 160000,
        width: 500
      }
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      // hideDefaultSelections: true,
      // selections: [
      //   Table.SELECTION_ALL,
      //   Table.SELECTION_INVERT,
      //   {
      //     key: "odd",
      //     text: "Select Odd Row",
      //     onSelect: changableRowKeys => {
      //       let newSelectedRowKeys = [];
      //       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
      //         if (index % 2 !== 0) {
      //           return false;
      //         }
      //         return true;
      //       });
      //       this.setState({ selectedRowKeys: newSelectedRowKeys });
      //     }
      //   },
      //   {
      //     key: "even",
      //     text: "Select Even Row",
      //     onSelect: changableRowKeys => {
      //       let newSelectedRowKeys = [];
      //       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
      //         if (index % 2 !== 0) {
      //           return true;
      //         }
      //         return false;
      //       });
      //       this.setState({ selectedRowKeys: newSelectedRowKeys });
      //     }
      //   }
      // ]
    };

    return (
      <div>
        <div className="course-search">
          <SearchForm />
        </div>
        <div className="course-table">
          <div className="course-table-header">
            <h3>课程章节列表</h3>
            <div>
              <Button type="primary" style={{ marginRight: 10 }}>
                <PlusOutlined />
                <span>新增</span>
              </Button>
              <Button type="danger"
                style={{ marginRight: 10 }}
                onClick={this.handleBatchDel}
              >
                <span>批量删除</span>
              </Button>
              <Tooltip title="全屏" className="course-table-btn" onClick={this.handlescreenfull}>
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
          <Alert
            message={
              <span>
                <InfoCircleOutlined
                  style={{ marginRight: 10, color: "#1890ff" }}
                />
                {`已选择 ${selectedRowKeys.length} 项`}
              </span>
            }
            type="info"
            style={{ marginBottom: 20 }}
          />
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.props.chapterList.items}
            rowKey="_id"
            expandable={{
              onExpand: this.handleClickExpand
            }}
          />
        </div>

        <Modal
          title='视频'
          visible={previewVisible}

          onCancel={this.handleImgModal}
          footer={null}
          destroyOnClose={true}
        >
          <Player
            sources={sources}
            id={'1'}
            cover={'http://localhost:3000/logo512.png'}
            duration={1000}
          >
          </Player>

        </Modal>
      </div>
    );
  }
}

export default Chapter;
