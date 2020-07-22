import React, { Component } from 'react';
import {connect} from 'react-redux'
import {getUserInfo,getUserMenu} from './redux'
import Loading from '@comps/Loading'
@connect(null,
  {getUserInfo,getUserMenu}
  )
class Authorized extends Component {
  state={
    //其实就是设置一个标识,使其先挂载再render渲染
    loading:true
  }
 async componentDidMount(){
   //这样一条一条的获取请求太慢了
    // this.props.getUserInfo()
    // this.props.getUserMenu()
    let {getUserInfo,getUserMenu} =this.props
    console.log(this.props)
    //数据一定存在了redux中
    await Promise.all([getUserInfo(),getUserMenu()])
    this.setState({
      //修改状态
      loading:false
    })
  }
  render() {
   let {loading} = this.state
  //  加载成功后 就展示渲染PrimartLayout组件
  //否则就展示loading组件
   return loading ? <Loading></Loading> : this.props.render()
  }
}

export default Authorized;