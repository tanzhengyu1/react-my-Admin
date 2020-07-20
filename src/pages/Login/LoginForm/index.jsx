import React, { Component ,useState} from "react";
import { Form, Input, Button, Checkbox, Row, Col, Tabs, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { login,mobileLogin } from "@redux/actions/login";
import {reqGetverifyCode} from '@api/acl/oauth'
import "./index.less";


const { TabPane } = Tabs;


function LoginForm (props) {

  const [form] = Form.useForm()
  // console.log(Form)
  //定义是否展示获取验证码还是展示倒计时 ,默认是展示获取验证码
  const [isShowDownCount,setIsShowDownCount] = useState(false)
  //定义倒计时需要的时间秒数的数据状态 默认为5秒
  let [downCount,setDownCount] = useState(5)
  //定义状态,当前是账号密码登录还是手机登录的状态数据
  let [activeKey,setActiveKey]=useState('user')
  //登录按钮点击处理事件的函数
    const onFinish = () => {
      //需要判断当前这个页签是手机登录还是账号密码登录
      if(activeKey==='user'){
        //校验用户名和密码
        form.validateFields(['username','password']).then(res=>{
          //当前 res 就是当前输入的用户的账号密码 ,把res解构出来
          let {username,password} =res
          //解构后传给请求
            props.login(username, password).then((token) => {
      // 登录成功
      // console.log("登陆成功~");
      // 持久存储token
      localStorage.setItem("user_token", token);
      //点击后跳转到首页
      props.history.replace("/");
        })
      })
      }else{
        //校验手机号和验证码
        //校验用户名和密码
        form.validateFields(['phone','verify']).then(res=>{
          let {phone,verify} =res
          props.mobileLogin(phone,verify).then(token=>{
            localStorage.setItem('user_token',token)
            props.history.replace('/')
          })
        })
      }
    // .catch(error => {
    //   notification.error({
    //     message: "登录失败",
    //     description: error
    //   });
    // });
  };
  console.log(props)
  //antd中的第二种校验方式
  const vilidator=(rules,value)=>{
    //rules 表示校验 的时那个表单项
    //value 时表单的值
    //返回的时一个 prommmise对象,成功返回成功的promise,否则返回失败的promise
    return new Promise((resolve,reject)=>{
      //如果没有表单值 就返回失败的提示
      if(!value){
        return reject('必填项')
      }
      //如果表单的长度少于4个,就返回失败的提示
      if(value.length<4){
        return reject('至少4个字符')
      }
        //如果表单的长度超过16个,就返回失败的提示
      if(value.length>16){
        return reject('不得超过16个字符')
      }
      //正则表达式,如果不是数字字母下划线,就返回失败的提示
      if(!/^[a-zA-Z0-9_]+$/){
        return reject('必须时数字字母下划线')
      }
      //成功
      resolve()
    })
  }
  //点击发送验证码后的执行的操作
  const getVerify=async ()=>{
    //拿到是当前在表单里面输入的手机号
    const res = await form.validateFields(['phone'])
    console.log(res)
    //发送异步请求-->通常为了节省开支,获取验证码一般测试一次就够了,
    await reqGetverifyCode(res.phone)
    //后面代码可以执行,说明验证请求成功了
    //当请求发送后,按钮此时的状态应该是倒计时状态,并且按钮不能点击-
    setIsShowDownCount(true)
    //创建定时器
    let timeId = setInterval(() => {
      //每隔一秒减一
      downCount--
      //修改秒数 的数据
      setDownCount(downCount)
      //当秒数为0时,就 清除定时器
      if(downCount<=0){
        clearInterval(timeId)
        //清除时候 此时 按钮的显示状态应该是-->获取验证码
        setIsShowDownCount(false)
        //重置秒数,
        setDownCount(5)
      }
     
    }, 1000);
  }
  //tab切换触发的事件处理函数 -->activeKey拿到就是当前点击标签页的名字
  const handleTabChange=activeKey=>{
    setActiveKey(activeKey)
  }
  const gitOauthLogin=()=>{
    window.location.href=
    'https://github.com/login/oauth/authorize?client_id=22728617dc7d1586c5bd '
  }
    return (
      <>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          // onFinish={onFinish}
          form={form}
        >
          <Tabs
            defaultActiveKey="user"
            tabBarStyle={{ display: "flex", justifyContent: "center" }}
            //切换页签的处理函数
            onChange={handleTabChange}
          >
            <TabPane tab="账户密码登陆" key="user">
              <Form.Item name="username" rules={[
                {required:true,message:'请输入你的用户名'},
                {min:4,message:'至少输入4位字符'},
                {max:16,message:'输入的字符不能超过16位'},
                {
                  pattern: /^[0-9a-zA-Z_]+$/,
                  message: '只能输入数字字母下划线'
                }
              ]} >
                <Input
                  prefix={<UserOutlined className="form-icon" />}
                  placeholder="用户名: admin"
                />
              </Form.Item>
              <Form.Item name="password" 
              rules={[
                {vilidator}
              ]}
              >
                <Input
                  prefix={<LockOutlined className="form-icon" />}
                  type="password"
                  placeholder="密码: 111111"
                />
              </Form.Item>
            </TabPane>
            <TabPane tab="手机号登陆" key="phone">
              <Form.Item name="phone"
               rules={[
                {
                  required: true,
                  message: '请输入手机号'
                },
                {
                  pattern: /^1[3456789]\d{9}$/,
                  message: '你输入不是手机号'
                }
              ]}
              >
                <Input
                  prefix={<MobileOutlined className="form-icon" />}
                  placeholder="手机号"
                />
              </Form.Item>

              <Row justify="space-between">
                <Col span={16}>
                  <Form.Item name="verify"
                  rules={[
                    {required:true,message:'请输入验证码'},
                    {pattern:/^[\d]{6}$/,message:'请输入验证码'}
                  ]}
                  
                  >
                    <Input
                      prefix={<MailOutlined className="form-icon" />}
                      placeholder="验证码"
                    />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Button className="verify-btn" onClick={getVerify} disabled={isShowDownCount}>
                    {isShowDownCount?`${downCount}秒后获取`:'获取验证码'}
                  </Button>
                
                </Col>
              </Row>
            </TabPane>
          </Tabs>
          <Row justify="space-between">
            <Col span={7}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>自动登陆</Checkbox>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Button type="link">忘记密码</Button>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              // htmlType="submit" 如果不注释那么它会校验所有的表单数据
              className="login-form-button"
              onClick={onFinish}
            >
              登陆
            </Button>
          </Form.Item>
          <Form.Item>
            <Row justify="space-between">
              <Col span={16}>
                <span>
                  其他登陆方式
                  <GithubOutlined className="login-icon" onClick={gitOauthLogin} />
                  <WechatOutlined className="login-icon" />
                  <QqOutlined className="login-icon" />
                </span>
              </Col>
              <Col span={3}>
                <Button type="link">注册</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </>
    );
  }


export default withRouter(
  connect(null,
   { login,mobileLogin}
  )(LoginForm)
)
