import React, { Component } from 'react';
//导入 antd 中的栅格布局组件
//row 表示一行  col 表示一列

import { Row, Col,Statistic } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
//导入项目中封装的卡片组件
import Card from '@comps/Card'
const firstRowCol ={
  //xs.md.lg 表示不同的屏幕尺寸
  //span 表示在col的行 中占的格数
  //一行一共24个格
  xs:{span:24},
  md:{span:12},
  lg:{span:6}

}

class Analysis extends Component {
  render() {
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col {...firstRowCol}>
            <Card 
          title={<Statistic
          //card 标题
            title='总销售额'
           
            value={112893}
            prefix={'￥'}
          />}
          footer={<span>日销售额￥8888</span>}>
            {/* card 内容 */}
            <span>升值率12%<CaretUpOutlined style={{color:'red'}} /> </span>
            <span style={{marginLeft:10}}>升值率10%<CaretDownOutlined style={{color:'hotpink'}} /></span>
            </Card></Col>
            <Col {...firstRowCol}>
            <Card 
          title={<Statistic
          //card 标题
            title='访问量'
           
            value={9999}
           
          />}
          footer={<span>日销售额￥9999</span>}>
            {/* card 内容 */}
            
            </Card></Col>
          <Col {...firstRowCol}><Card></Card></Col>
          <Col {...firstRowCol}><Card></Card></Col>
        </Row>
      </div>
    );
  }
}

export default Analysis;