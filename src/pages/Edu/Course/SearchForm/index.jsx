import React, { useState,useEffect } from "react";
import { Form, Input, Select, Cascader, Button, message } from "antd";
//需要 导入所有讲师的方法
import {reqGetAllTeacherList} from '@api/edu/teacher'
//导入 获取所有课程的方法
import {reqALLSubjectList,reqGetTwoSubjectList} from '@api/edu/subject'
import {getCourseList} from '../redux'
//导入国际化的包
//页面中 不是所有的地方都能使用 FormattedMessage 组件
//不支持的时候可以用useIntl 钩子函数
import {FormattedMessage,useIntl} from 'react-intl'
import { connect } from "react-redux";
import "./index.less";
const { Option } = Select;

function SearchForm(props) {
  //得到国际化对象
  const intl = useIntl()
  const [form] = Form.useForm();
//定义储存讲师列表的状态
  const [teacherList, setTeacherList] = useState([])
//定义储存所有一级课程分类的状态
const [subjectList,setSubjectList]= useState([])
//利用useEffECT,实现组件挂载获取数据
useEffect(()=>{
  async function fetchData(){
     // 注意: 这样的写法,会导致获取完讲师数据,再请求课程分类.会比较耗时
      // 所以要使用Promise.all来实现
      // const teachers = await reqGetAllTeacherList()
      // const subjectList = await reqALLSubjectList()
    //等所有请求的数据响应了,就会拿到对应的数据
    const [teachers,subjectList] = await Promise.all([
      reqGetAllTeacherList(),
      reqALLSubjectList()
    ])
    //由于使用cascader组件,需要将subjectList中的数据结构改成cascader组件要求的结构
    //遍历一级分类数据,拿到一级分类 的id和 名字(title)
    const options =subjectList.map(subject=>{
      return {
        value:subject._id,
        label:subject.title,
        isLeaf:false //false 表示有子数据,true 表示没有子数据
      }
    })
    //把数据赋值给tearchList,subjectList此时 初始化状态里面已经有数据了
    setTeacherList(teachers)
    setSubjectList(options)
  }
  fetchData()
},[])

// selectedOptions  获取 当前点击数据的所有数据
//二级分类的id
  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  //const loadData = selectedOptions => {
    // const targetOption = selectedOptions[selectedOptions.length - 1];
    // targetOption.loading = true;

    // // load options lazily
    // setTimeout(() => {
    //   targetOption.loading = false;
    //   targetOption.children = [
    //     {
    //       label: `${targetOption.label} Dynamic 1`,
    //       value: "dynamic1"
    //     },
    //     {
    //       label: `${targetOption.label} Dynamic 2`,
    //       value: "dynamic2"
    //     }
    //   ];
    //   setOptions([...options]);
    // }, 1000);
  //};
    const loadData = async selectedOptions=>{
      //targetOption 当前点击的一级分类数据
      console.log(selectedOptions)
      const targetOption = selectedOptions[selectedOptions.length-1]
      //cascader 组件底层实现正在加载,给当前的一级分类数据添加loading,并赋值true
   
      targetOption.loading=true
      //调用请求拿到二级分类 -->targetOption.value拿到的时二级分类的id
      let towSubject =await reqGetTwoSubjectList(targetOption.value)
      //由于cascader组件,对渲染的数据有格式要求,所以二级分类的数据也要数据重构
      towSubject = towSubject.items.map(item=>{
        return{
          //赋值 二级分类的id和title (名字)
          value:item._id,
          label:item.title
        }
      })
      //该请求的数据都请求到了,所以此时可以关闭正在加载 这个功能
      targetOption.loading = false
      //如果没有二级分类,那么点击一级,都会去请求二级分类
      //如果选中,需要判断是否有二级分类数据,如果有,那么就可以积极进行展开二级分类数据
      //否则 就关闭这个一级分类数据的子属性
      if(towSubject.length>0){
          targetOption.children = towSubject

      }else{
        targetOption.isLeaf=true
      }

      //更新subjectList 数据
      setSubjectList([...subjectList])
      console.log(towSubject)
      
    }


 
  const resetForm = () => {
    
    form.resetFields();
  };
 // 点击查询按钮的事件回调函数
const finish =async value=>{
   /**
     * subject: (2) ["5ee171adc311f5151c52332a", "5ee17310c311f5151c523334"]
       teacherId: "5ee1ebc844086831e4a48eca"
       title: undefined

       subject: ["5ee172f9c311f5151c523331"]
       teacherId: "5ee1ebc844086831e4a48eca"
       title: undefined

       总结: teacherId和title, 如果选择了,就是具体的值,没选就是undefined
       但是subject不一样
       如果只选了一级课程分类 --> subject数据中一条数据
       如果只选了二级课程分类 --> subject数据中两条数据,第一条是一级,第二条是二级

       如果要请求接口,获取课程列表数据
       subjectId
       subjectParentId

       如果subject数组,只有一条数据
       subjectId就是 subject[0]
       subjectParentId 就是 0 

       如果subject数组,有两条数据
       subjectId 就是 subject[1]
       subjectParentId 就是 subject[0]
     */
  //可能课程没有选择,就是und
  let subjectId
  let subjectParentId
 
  //如果有一级分类数据,并且数据长度大于1
  //只拿一级分类和二级分类的数据
  if(value.subject&&value.subject.length>1){
    //subjectId-->拿到的时二级分类的id 
    subjectId=value.subject[1]
    //subjectParentId-->拿到的时一级分类的id
    subjectParentId=value.subject[0]
  }
  //如果当前只选择一级分类
  if(value.subject&&value.subject.length===1){
    //subjectId-->拿到的时二级分类的id 
    subjectId=value.subject[0]
    //一级分类id =0
    subjectParentId=0
  
  }
//请求接口,获取课程分页的数据
  const data={
    page:1,
    limit:5,
    title:value.title,
    teacherId:value.teacherId,
    subjectId,
    subjectParentId
  }
  await props.getCourseList(data)
  message.success('课程数据获取成功')

 
}

  return (
   
    <Form layout="inline" form={form} onFinish={finish}>
      <Form.Item name="title" label={<FormattedMessage id='title' />}>
        <Input placeholder={intl.formatMessage({
            id:'title'
          })} style={{ width: 250, marginRight: 20 }} />
      </Form.Item>
      <Form.Item name="teacherId" label={<FormattedMessage id='teacher' />}>
        <Select
          allowClear
          placeholder={intl.formatMessage({
            id:'teacher'
          })}
          style={{ width: 250, marginRight: 20 }}
        >
          {teacherList.map(item=>(
        <Option value={item._id} key={item._id}>{item.name}</Option>
          ))}
          
         
        </Select>
      </Form.Item>
      <Form.Item name="subject" label={<FormattedMessage id='subject' />}>
        <Cascader
        // 可以显示多级菜单
          style={{ width: 250, marginRight: 20 }}
          options={subjectList}
          loadData={loadData}
          onChange={onChange}
          // changeOnSelect
          placeholder={intl.formatMessage({
            id:'subject'
          })}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: "0 10px 0 30px" }}
        >
          {<FormattedMessage id='searchBtn' />}
        </Button>
        <Button onClick={resetForm}>{<FormattedMessage id='resetBtn' />}</Button>
      </Form.Item>
    </Form>
  );
}

export default connect(
  null,{getCourseList}
  )(SearchForm)
