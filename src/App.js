import React,{useEffect, useState} from "react";
import { Router } from "react-router-dom";
import history from "@utils/history";
//导入国际化包
import {IntlProvider} from 'react-intl'
//导入需要的语言包
// en-->英文 包  zh --.中文包
import {en,zh} from './locales'
//导入antd 国际化
import {ConfigProvider} from 'antd'
import enUS from 'antd/es/locale/en_US'
import zhCN from 'antd/es/locale/en_GB'
import Layout from "./layouts";
// 引入重置样式（antd已经重置了一部分了）
import PubsSub from 'pubsub-js'
import "./assets/css/reset.css";

function App() {
  const [locale,setLocale]  = useState('zh')
  useEffect(()=>{
   const token = PubsSub.subscribe('LANGUAGE',(message,data)=>{
      setLocale(data)
      return ()=>{
        PubsSub.unsubscribe(token)
      }
    })
  },[]) 
  //通过window.navigator 获取当前游览器的语言环境
  // const locale= window.navigator.language==='zh-CN'?'zh':'en'
  const message =locale ==='en' ? en : zh
  // const message =locale ==='en'
  const antdLocale = locale ==='en' ? enUS : zhCN
  return (
    <Router history={history}>
      <ConfigProvider locale={antdLocale}>
      {/* locale 表示当前的语言环境  message 表示使用哪个语言包 */}
      <IntlProvider locale={locale} messages={message}>
             <Layout />
      </IntlProvider>
      </ConfigProvider>
    </Router>
  );
}

export default App;
