import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, } from "antd";
import {connect} from 'react-redux'
import{withRouter} from 'react-router-dom'
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  GlobalOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";
//导入siderMenu,因为其内部比较复杂, 把左侧的导航抽取出来,弄成一个新的组件,,
import SiderMenu from '../SiderMenu'
import "./index.less"
import logo from "@assets/images/logo.png";
const { Header, Content, Footer, Sider } = Layout
// const { SubMenu } = Menu
@withRouter
@connect(state=>({user:state.user}))
 class PrimaryLayout extends Component {
  state = {
    collapsed: false
  }
  onCollapse = collapsed => {
    console.log(collapsed)
    this.setState({ collapsed })
  }
  render() {
    let {name,avatar,permissionList} = this.props.user
    //获取游览器路径
    const path = this.props.location.pathname
    //正则提取
    const reg =/[/][a-z]*/g
    //这里拿到的是所有的路径
    const maschArr = path.match(reg)
    //一级path
    const firstPath = maschArr[0]
    //二级path
    const srcPath = maschArr[1]
    //二级第二个path
    const thrPath = maschArr[2] || ''
    let firstName
    let secName
    //遍历数据查找对应的一级菜单名和二级菜单名
    permissionList.forEach(item=>{
      //如果当前路径为一级菜单
      if(item.path===firstPath){
        //拿到一级菜单的数据
        firstName= item.name
        //遍历二级菜单的数据
        item.children.forEach(secItem=>{
          //此时的二级分类 需要拼接一下
          if(secItem.path===srcPath+thrPath){
            //拿到二级分类的数据
            secName = secItem.name
          }
        })
      }

    })

    return(
      <Layout className='layout'>
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this.onCollapse}
      >
        <div className='logo'>
          <img src={logo} alt='' />
          {/* <h1>硅谷教育管理系统</h1> */}
          {!this.state.collapsed && <h1>硅谷教育管理系统</h1>}
        </div>
        <SiderMenu />
        {/* <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline'>
          <Menu.Item key='1' icon={<PieChartOutlined />}>
            Option 1
            </Menu.Item>
          <Menu.Item key='2' icon={<DesktopOutlined />}>
            Option 2
            </Menu.Item>
          <SubMenu key='sub1' icon={<UserOutlined />} title='User'>
            <Menu.Item key='3'>Tom</Menu.Item>
            <Menu.Item key='4'>Bill</Menu.Item>
            <Menu.Item key='5'>Alex</Menu.Item>
          </SubMenu>
          <SubMenu key='sub2' icon={<TeamOutlined />} title='Team'>
            <Menu.Item key='6'>Team 1</Menu.Item>
            <Menu.Item key='8'>Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key='9' icon={<FileOutlined />} />
        </Menu> */}
      </Sider>

      <Layout className='site-layout'>
        <Header className='layout-header'>
          <img src={avatar} alt='' />
          <span>{name}</span>
          <GlobalOutlined />
        </Header>
        <Content>
          <div className='layout-nav'>
         {firstName===undefined ? '首页':
         <>
            <Breadcrumb>
            {/* 一级,二级菜单名赋值 */}
              <Breadcrumb.Item>{firstName}</Breadcrumb.Item>
              <Breadcrumb.Item>{secName}</Breadcrumb.Item>
            </Breadcrumb>
         </>}
            <h3>{secName}</h3>
          </div>

          <div className='layout-content'>Bill is a cat.</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
          </Footer>
      </Layout>
    </Layout>
    )
   
  }

}

export default PrimaryLayout
