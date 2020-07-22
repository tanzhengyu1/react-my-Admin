import React, { Component } from "react";
import { connect } from 'react-redux'
import { Menu, Layout, Breadcrumb } from "antd";
import {Link, withRouter} from 'react-router-dom'
import {
  PieChartOutlined,
  TeamOutlined,
} from "@ant-design/icons"
import Icons  from '@conf/icons'
import { defaultRoutes } from '@conf/routes'
const { SubMenu } = Menu
@withRouter
@connect(state => ({ permissionList: state.user.permissionList }))
//在siderMenu组件中需要遍历两个数组
//一个是redux中的 permissionList数据 ,
//一个是 '@conf/routes 里的defaultRoutes -->首页数据

class SiderMenu extends Component {
  //定义的一个函数,在函数中遍历数组,动态渲染左侧导航菜单
  //由于要遍历两个数组,所以未来这个函数需要调用两次

  renderMenu = menus => {
    //这个return 是将renderMenu得到的新数组返回出去
    return menus.map(menu => {
      //先判断这个菜单是否要展示,根据hidden 来确定 是否展示
      //如果是 true 展示  , false 表示展示
      if (menu.hidden) return
      //通过icon祖父从,找到对应的icon组件,--注意:要大写,因为下面会把它当组件使用
      const Icon = Icons[menu.icon]
      //判断一级菜单是否有二级菜单,并且二级菜单里面是有数据的
      if (menu.children && menu.children.length) {
        return (
          <SubMenu key={menu.path} icon={<Icon />} title={menu.name}>
           {/* 遍历渲染二级菜单的数据 */}
            {menu.children.map(secMenu => {
              //还是要判断二级分类菜单是否有hideen 数据
              if (secMenu.hidden) return
              return (
              <Menu.Item key={menu.path+secMenu.path}>
                {/* 二级菜单的路径是一级菜单与二级菜单的拼接 */}
               <Link to={menu.path+secMenu.path}> {secMenu.name}</Link>
                </Menu.Item>
              )
              })}
  
          </SubMenu>

        )
        //说明只有一级菜单
      } else {
        //这里的return 是给新数组添加一个菜单组件
        return (
          //只有首页的一级菜单才需要使用Link
          <Menu.Item key={menu.path} icon={<Icon />}>
            {menu.path==='/' ? <Link to="/">{menu.name}</Link> : menu.name}
            
          </Menu.Item>
        )
      }
    })
  }
  render() {
    console.log(this.props)
    //这里的path拿到的是一个拼接完整的一级与二级的拼接
    const path=this.props.location.pathname
    console.log(path)
    //字符串中有一个math 方法,match里面可以放入一个正则表达式,可以返回一个数组
    //数组中返回的值就是我们要的
    //一般正则匹配是需要加^$,但是正则提取不加
    const reg=/[/][a-z]*/ //提取一级菜单路径的正则
   const firstPath= path.match(reg)[0]

    return (
      <>
        <Menu theme='dark' defaultSelectedKeys={[path]}
         mode='inline'    defaultOpenKeys={[firstPath]} >
          {/* 把返回的新的数组渲染出来 因为调用两次 
          这两次展示的分别是首页菜单和普通的菜单 */}
          {this.renderMenu(defaultRoutes)}
          {this.renderMenu(this.props.permissionList)}
          {/* <Menu.Item key='1' icon={<PieChartOutlined />}>
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
          <Menu.Item key='9' icon={<FileOutlined />} /> */}
        </Menu>
      </>
    )


  }
}
export default SiderMenu;
