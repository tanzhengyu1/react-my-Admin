import request from '@utils/request'
const BASE_URL ='/admin/edu/course'
export function reqGetCourseList(){
    return request({
        url:`${BASE_URL}`,
        method:'GET'
    })
}
//获取分页课程的数据
export function reqGetCourseLimitList({
    page,limit,title,teacherId,subject,subjectParentId
}){
    return request({
        url:`${BASE_URL}/${page}/${limit}`,
        method:'GET',
        params:{
            title,
            teacherId,
            subject,
            subjectParentId
        }
    })


}