import React, { Component } from 'react';
import {loginSuccessSync} from '@redux/actions/login'
import {connect}from 'react-redux'
@connect()
class Oauth extends Component {
    componentDidMount(){
        //1,从游览器地址栏把token的值分割出来 拿到token
        const token=window.location.search.split('=')[1]
      //  console.log(this.props)
      //需要用修饰符才能拿到dispatch ,在同步函数里面拿到token
      //把token储存在redux中
        this.props.dispatch(loginSuccessSync({token}))
        //把token存在本地缓存中
        localStorage.setItem('user_token',token)
        //跳转到首页
        this.props.history.replace('/')
    }
    render() {
        return (
            <div>
                git授权登录
            </div>
        );
    }
}

export default Oauth;





