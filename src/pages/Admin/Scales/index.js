import React, { Component } from 'react';
import { Card, Button, DatePicker } from 'antd'
import moment from 'moment'
//导入日期范围选择器
const { RangePicker } = DatePicker
const tabListNotitle = [
    {
        key: 'scales',
        tab: '销量量'
    },
    {
        key: 'visits',
        tab: '访问量'
    }
]
//每个页签对应正文需要展示的内容
const contentListNotitle = {
    scales: <p>销售量...</p>,
    visits: <p>访问量...</p>
}
class index extends Component {
    state = {
        //选中的页签
        avtiveKey: 'sacles',
        //实现按钮高亮-->默认显示今日 按钮 
        // day 今日, week 本周, month 本月, year 本年
        activeBtn: 'day',
        //用于控制时间范围的组件的值
        rangDate: [moment(), moment()]
    }
    handleBtn = activeBtn => () => {
        //计算范围时间
        let rangeDate
        switch (activeBtn) {
            case 'day':
                rangeDate = [moment(), moment()]
                break
            case 'week':
                rangeDate = [moment(), moment().add(1, 'w')]
                break
            case 'month':
                rangeDate = [moment(), moment().add(1, 'M')]
                break
            case 'year':
                rangeDate = [moment(), moment().add(1, 'y')]
                break
        }
        this.setState({
            activeBtn,
            rangeDate
          })
    }
    //在rangePicker组件中选择了新的日期范围触发的事件回调函数
    handleRange=(datas,dataString)=>{
        //data拿到的就是在rangePicker中选择的日期范围
        this.setState({
            rangDate:datas
        })
    }
        render() {
            //拿到state 的数据
            let { activeBtn, rangDate } = this.state
            const extra = (
                <>
                    <Button
                        type={activeBtn === 'day' ? 'link' : 'text'}
                        onClick={this.handleBtn('day')}
                    >
                        今日
            </Button>
                    <Button
                        type={activeBtn === 'week' ? 'link' : 'text'}
                        onClick={this.handleBtn('week')}
                    >
                        本周
            </Button>
                    <Button
                        type={activeBtn === 'month' ? 'link' : 'text'}
                        onClick={this.handleBtn('month')}
                    >
                        本月
            </Button>
                    <Button
                        type={activeBtn === 'year' ? 'link' : 'text'}
                        onClick={this.handleBtn('year')}
                    >
                        本年
            </Button>
            {/* RangePicker 想要控制RangePicker里面展示说明的范围,事件就是操作它的value值 */}
                    <RangePicker value={rangDate} onChange={this.handleRange}/>
                </>
            )
            return (
                <div>
                    <Card style={{ width: '100%' }}
                    //表示标签页的标题
                        tabList={tabListNotitle}
                        //表示当前选中了哪一个标签页
                        activeTabKey={this.state.avtiveKey}
                        //点击后高亮
                        tabBarExtraContent={extra}
                        //点击切换标签页
                        onTabChange={key => {
                            console.log(key)
                            this.setState({
                                avtiveKey: key
                            })
                        }}

                    >
                        {/* 需要展示标签页的内容 */}
                        {contentListNotitle[this.state.avtiveKey]}
                    </Card>
                </div>
            );
        }
    }

    export default index;