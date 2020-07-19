import React, { Component } from 'react'
//导入 antd 中的栅格布局组件
import { Row, Col, Statistic ,Progress } from 'antd'

import { CaretUpOutlined, CaretDownOutlined} from '@ant-design/icons'
//row 表示一行  col 表示一列
import { AreaChart, ColumnChart } from 'bizcharts'

//导入项目中封装的卡片组件
import Card from '@comps/Card'
const firstRowCol = {
  //xs.md.lg 表示不同的屏幕尺寸
  //span 表示在col的行 中占的格数
  //一行一共24个格
  xs: { span: 24 },
  md: { span: 12 },
  lg: { span: 6 }

}
const data = [
  { year: '1991', value: 3 },
  { year: '1992', value: 4 },
  { year: '1993', value: 9 },
  { year: '1994', value: 5 },
  { year: '1995', value: 4.9 },
  { year: '1996', value: 6 },
  { year: '1997', value: 20 },
  { year: '1998', value: 9 },
  { year: '1999', value: 13 },
];

const columndata = [
  {
    type: '家具家电',
    sales: 38,
  },
  {
    type: '粮油副食',
    sales: 52,
  },
  {
    type: '生鲜水果',
    sales: 61,
  },
  {
    type: '美容洗护',
    sales: 145,
  },
  {
    type: '母婴用品',
    sales: 48,
  },
  {
    type: '进口食品',
    sales: 38,
  },
  {
    type: '食品饮料',
    sales: 38,
  },
  {
    type: '家庭清洁',
    sales: 38,
  },
];

class Analysis extends Component {
  state={
    loading:false
  }
  componentDidMount(){
    this.setState({
      loading:true
    })
    setTimeout(()=>{
      this.setState({
        loading:false
      })
    },2000)
  }
  render() {
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col {...firstRowCol}>
            <Card
              title={
                //card 标题
                <Statistic title='总销售额' value={112893} prefix={'￥'} />
              }
              footer={<span>日销售额￥8,888</span>}>
              {/* card 内容 */}
              <span>升值率12%<CaretUpOutlined style={{ color: 'red' }} /> </span>
              <span style={{ marginLeft: 10 }}>升值率10%<CaretDownOutlined style={{ color: 'hotpink' }} /></span>
            </Card>
          </Col>
          <Col {...firstRowCol}>
            <Card
              title={<Statistic title='访问量' value={9999} />}
              //card 标题
              footer={<span>日销售额￥9,999</span>}>
              {/* card 内容 */}
              <AreaChart
                data={data}
                // title={{
                //   visible: true,
                //   text: '面积图',
                // }}
                xField='year'
                yField='value'
                xAxis={{
                  visible: false
                }}
                yAxis={{
                  visible: false
                }}
                smoth={true}
                padding={'0'}
              /></Card></Col>
          <Col {...firstRowCol}>
            <Card
              title={<Statistic title='支付笔数' value={5555} />}
              footer={<span>转化率60%</span>}
            >
              <ColumnChart
                data={columndata}
                // title={{
                //   visible: true,
                //   text: '基础柱状图',
                // }}
                // forceFit
                padding='0'
                xField='type'
                yField='sales'
                xAxis={{
                  visible: false
                }}
                yAxis={{
                  visible: false
                }}
                meta={{
                  type: {
                    alias: '类别',
                  },
                  sales: {
                    alias: '销售额(万)',
                  },
                }}
              />
            </Card>
          </Col>
          <Col {...firstRowCol}>
            <Card   title={<Statistic title='运营结果' value={7777} />}
              footer={<span>转化率80.9%</span>} >
                loading={this.state.loading}
              <Progress
               
                percent={80.9}
                strokeColor={{
                  from:'#bfa',
                  to:'pink'
                }}
                status='active'
              />
            </Card>
            </Col>
        </Row>
      </div>
    );
  }
}

export default Analysis;