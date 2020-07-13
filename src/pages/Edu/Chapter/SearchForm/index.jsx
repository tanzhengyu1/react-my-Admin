import React,{useEffect,useState} from "react";
import { Form, Select, Button, message } from "antd";
import {connect} from 'react-redux'
import {reqGetCourseList} from '@api/edu/course'
import { getChapterList } from '../redux'
import "./index.less";

const { Option } = Select
//函数组件是不能使用修饰器语法
function SearchForm(props) {
  const [courseList,setCourseList]=useState([])
  const [form] = Form.useForm();

  const resetForm = () => {
    form.resetFields(['courseId']);
  };
  //获取课程列表数据--.相当于类组件挂载成功的生命周期的钩子-->componentDidMount
  
useEffect(()=>{
  //useEffect的回调函数不允许是一个异步函数,所以,在回调函数中重新定义一个异步函数
  async function fetchData(){
    const res = await reqGetCourseList()
    console.log(res)
    //给课程列表赋值
    setCourseList(res)
  }
  fetchData()
},[])
//根据课程列表获取章节列表数据的方法
  const handleGETchapterList= async value=>{
    console.log(value)
    const data={
      page:1,
      limit:10,
      courseId:value.courseId
    }
    await props.getChapterList(data)
    message.success('课程章节列表数据获取成功')
  }



  return (
    <Form layout="inline" form={form} onFinish={handleGETchapterList}>
      <Form.Item name="courseId" label="课程">
        <Select
          allowClear
          placeholder="课程"
          style={{ width: 250, marginRight: 20 }}
        >
          {courseList.map(couse=>(
             <Option key={couse._id} value={couse._id}>
               {couse.title}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: "0 10px 0 30px" }}
        >
          查询课程章节
        </Button>
        <Button onClick={resetForm}>重置</Button>
      </Form.Item>
    </Form>
  );
}

export default connect(null,{getChapterList})( SearchForm);
