import request from '@utils/request'
const BASE_URL='/admin/edu/lesson'
export function reqGetLessonList(chapterId){
    return request({
        url:`${BASE_URL}/get/${chapterId}`,
        method:'GET'
    })
}
    //新增课时,上传视频,获取七云牛的方法
        export function reqGetQinniuToken(){
            return request({
                url:'/uploadtoken',
                method:'GET'
            })
        }

        export function reqAddLessonList({chapterId,title,video,free}){
            return request({
                url:`${BASE_URL}/save`,
                method:'POST',
                data:{
                    chapterId,
                    title,
                    free,
                    video
                }
            })
        }
        
