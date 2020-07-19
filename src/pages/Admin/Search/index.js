import React, { Component } from 'react';
import { Card, Radio } from 'antd'
import {
    Chart,
    registerShape,
    Geom,
    Axis,
    Tooltip,
    Interval,
    Interaction,
    Coordinate,
    Legend,
    Annotation
} from "bizcharts";
import './index.less'
const data = [
    {
        type: "分类一",
        value: 20
    },
    {
        type: "分类二",
        value: 18
    },
    {
        type: "分类三",
        value: 32
    },
    {
        type: "分类四",
        value: 15
    },
    {
        type: "Other",
        value: 15
    }
]; // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值

const sliceNumber = 0.01; // 自定义 other 的图形，增加两条线
//自定义other的图像
registerShape("interval", "sliceShape", {
    draw(cfg, container) {
        const points = cfg.points;
        let path = [];
        path.push(["M", points[0].x, points[0].y]);
        path.push(["L", points[1].x, points[1].y - sliceNumber]);
        path.push(["L", points[2].x, points[2].y - sliceNumber]);
        path.push(["L", points[3].x, points[3].y]);
        path.push("Z");
        path = this.parsePath(path);
        return container.addShape("path", {
            attrs: {
                fill: cfg.color,
                path: path
            }
        });
    }
});
class index extends Component {
    state={
        value:0
    }
    handleonChange = e => {
        console.log(e)
    }
    //点击数据的事件处理函数
    //可以接收一个事件对象
    DataClick=e=>{
        console.log(e)
        //获取图标中数据的值
        const value = e.data.data.value
        //修改点击数据的值
        this.setState({
            value :this.state.value + value
        })

    }
    render() {
        const extra = (
            <>
                <Radio.Group onChange={this.handleonChange} defaultValue="all">
                    <Radio.Button value="all">全部渠道</Radio.Button>
                    <Radio.Button value="online">线上</Radio.Button>
                    <Radio.Button value="offline">门店</Radio.Button>

                </Radio.Group>

            </>
        )
     
        return (
            <div className='search'>
                <Card title='销售类型占比' extra={extra}>
                    {/* chart 时bizcharts里面所有图标的跟组件
                    data 时数据源
                    */}
                    <Chart data={data} height={500} autoFit 
                    //点击图标 触发事件
                    onIntervalClick={this.DataClick}
                    >
                        {/* 
                        Coordinates时坐标系组件
                        type:坐标类型
                        redius 坐标整体半径 值: 0-1
                        innerRadus:环内半径 值 0-1
                        // */}
                    

                        <Coordinate type="theta" radius={0.8} innerRadius={0.75} />
                        <Axis visible={false} />
                        {/* 鼠标移动到图标上,展示的提示文字会默认展示title的内容
                        showTitle 值为false 表示不展示 title
                        如果把 TooLtip 组件注释掉,也会有展示信息提示,并且有title
                        利用自定义Tooltip 返回一个null
                        */}


                        <Tooltip showTitle={false}>
                        {(title,items)=>{
                            console.log(title, items)
                            //拿到当前鼠标移动的的数据颜色 
                            const color =items[0].color
                            return(
                                <div className='tooltip' >
                                    <span className='dot' style={{background:color}}></span>
                            <span style={{marginRight:5}}>{title}</span>
                            <span>{items[0].value}</span>
                                </div>
                            )
                        }}

                        </Tooltip>
                        {/* 饼图的主体组件 */}
                        <Interval
                            adjust="stack" //图标的样式
                            position="value"//设置图标依据的值
                            color="type" //根据数据定义颜色
                            shape="sliceShape"//将数据值映射到图形的形状上的方法
                        />
                        {/* 点击后的交互效果 */}
                        <Interaction type="element-single-selected" />
                        {/* 图例组件 设置图例组件的位置 */}
                        <Legend position='right' />
                        {/* 图形标注 */}

                        <Annotation.Text 
                        // 表示图标注展示的位置
                        //[水平方向,垂直方向]
                        position={['50%','45%']}
                        //需要展示的文字
                        content='销售量'
                        style={{
                            fontSize:30,
                            textAlign:'center',
                            fontWeight:700
                        }}
                        
                        />
                        <Annotation.Text 
                        position={['50%','55%']}
                        content={this.state.value}
                        style={{
                            fontSize:25,
                            textAlign:'center'
                        }}
                        />
                    </Chart>
                </Card>
            </div>
        );
    }
}

export default index;