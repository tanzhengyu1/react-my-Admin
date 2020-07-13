import { GET_CHAPTER_LIST, GET_LESSON_LIST } from './constans'
const initChapterList = {
    total: 0,
    items: []
}
export default function chapterList(prevState = initChapterList, action) {
    switch (action.type) {
        case GET_CHAPTER_LIST:
            //为所有遍历的数据添加子属性 并给且自数据是数组类型
            action.data.items.forEach(item => {
                item.children = []
            })
            return action.data
        case GET_LESSON_LIST:
            // 必须在有数据的情况下
            if (action.data.length > 0) {
                //拿到 当前的这个id值
                const chapterId = action.data[0].chapterId
                //遍历所有items数据,
                prevState.items.forEach(chapter => {
                //判断如果遍历的id与 之前拿到的id值相同
                    if (chapter._id === chapterId) {
                        //把当前的action数据给 这个items这条数据的子属性
                        chapter.children = action.data
                    }
                })
            }
            return {
                ...prevState
            }
        default:
            return prevState
    }
}



