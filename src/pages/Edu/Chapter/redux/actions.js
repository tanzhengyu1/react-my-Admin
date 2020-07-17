import {GET_CHAPTER_LIST,GET_LESSON_LIST,BATCH_DEL_CHAPTER,BATCH_DEL_LESSON} from './constans'
import {reqGetChapterList,reqBatchDelChapter} from '@api/edu/chapter'
import {reqGetLessonList,reqBatchDelLesson} from '@api/edu/lesson'
//获取章节列表的同步action
 function getChapterListSync(data){
     return{ type:GET_CHAPTER_LIST,data}
 }
//获取章节列表的异步action
export function getChapterList({page,limit,courseId}){
    return dispatch=>{
        return reqGetChapterList({page,limit,courseId}).then(res=>{
            dispatch(getChapterListSync(res))
            return res
        })
    }
}
//获取课时列表的同步action
function getLessonListSync(data){
    return{ type:GET_LESSON_LIST,data}
}
//获取课时列表异步的actionn
export function getLessonList(chapterId){
   return dispatch=>{
       return reqGetLessonList(chapterId).then(res=>{
           dispatch(getLessonListSync(res))
           return res
       })
   }
}
//删除章节列表
function batchDellessonSync(data){
    return{ type:BATCH_DEL_LESSON,data}
}
//获取章节列表的数据
export function batchDellesson(lessonIds){
   return dispatch=>{
       return reqBatchDelLesson(lessonIds).then(res=>{
           dispatch(batchDellessonSync(lessonIds))
           return res
       })
   }
}
//删除课时

function batchDelChapterSync(data){
    return{ type:BATCH_DEL_CHAPTER,data}
}
//获取课时列表异步的actionn
export function batchDelChapter(chapterIds){
   return dispatch=>{
       return reqBatchDelChapter(chapterIds).then(res=>{
           dispatch(batchDelChapterSync(chapterIds))
           return res
       })
   }
}
