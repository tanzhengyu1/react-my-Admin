import request from '@utils/request'
const BASE_URL='/admin/edu/chapter'
//获取所有课程的数据
export function reqGetChapterList({page,limit,courseId}){
    return request({
        url:`${BASE_URL}/${page}/${limit}`,
        method:'GET',
        params:{
            courseId
        }
    })
}
export function reqBatchDelChapter(chapterIds){
    return request({
        url:`${BASE_URL}/batchRemove`,
        method:'DELETE',
        params:{
            idList:chapterIds
        }
    })
}



