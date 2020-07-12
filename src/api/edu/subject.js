import request from "@utils/request";
//优化路径
const BASE_URL = "/admin/edu/subject";

// const Mock_URL =`http://localhost:8888${BASE_URL}`
//获取课程分类
export function reqGetSubjectList(page,limit) {
  //request返回的时一i个promise
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
        // http://localhost:8888/admin/edu/subject/1/10
    method: "GET",
  });
}
//获取二级分类课程
export function reqGetTwoSubjectList(parentId) {
    //request返回的时一i个promise
  return request({
    url: `${BASE_URL}/get/${parentId}`,
    method: "GET",
  });
}
//添加课程分类
export function reqAddSubjectList(title,parentId) {
    //request返回的时一i个promise
  return request({
    url: `${BASE_URL}/save`,
    method: "POST",
    data:{
      title,
      parentId
    }
  });
}