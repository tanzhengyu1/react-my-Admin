import {GET_COURSE_LIMIT_LIST} from './constant'
import {reqGetCourseLimitList} from '@api/edu/course'

function getCourseListSync(data){
    return {type:GET_COURSE_LIMIT_LIST,data}
}
export function getCourseList(data){
    return dispatch=>{
        return reqGetCourseLimitList(data).then(res=>{
            dispatch(getCourseListSync(res))
            return res
        })

}
}


