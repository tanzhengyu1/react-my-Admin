import {getChapterList,getLessonList,
    batchDellesson,batchDelChapter} from './actions'
import  chapterList from './reducer'
//在Index中要将外界需要的异步action 和reducer导出去
 export {getChapterList,chapterList,getLessonList,
    batchDellesson,batchDelChapter
}


