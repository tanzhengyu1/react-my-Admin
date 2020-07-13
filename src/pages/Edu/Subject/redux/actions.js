import {
  reqGetSubjectList,reqGetTwoSubjectList,
  reqUpdetaSubjectList
} from "@api/edu/subject";

import {
  GET_SUBJECT_LIST,GET_TWOSUBJECT_LIST,UPDETA_SUBJECT
} from "./constants";

//获取一级分类 --同步
const getSubjectListSync = (list) => ({
  type: GET_SUBJECT_LIST,
  data: list,
});
//获取一级分类异步action -->通常情况下 使用异步都会有一个同步
export const getSubjectList = (page, limit) => {
  return (dispatch) => {
    return reqGetSubjectList(page, limit).then((response) => {
      dispatch(getSubjectListSync(response));
      return response
    });
  };
};
//获取二级分类同步action
const getTwoSubjectListSync = list => ({
  type: GET_TWOSUBJECT_LIST,
  data: list,
});
//获取二级分类的异步action
export const getTowSubjectList = parentId => {
  return (dispatch) => {
    return reqGetTwoSubjectList(parentId).then((response) => {
      dispatch(getTwoSubjectListSync(response));
      return response
    });
  };
};

//获取更新 分类的同步action
const UpdetaSubjectListSync = data => ({
  type: UPDETA_SUBJECT,
  data
});
//获取更新分类的异步action
export const UpdetaSubjectList = (title,id) => {
  console.log('请求成功')
  return dispatch => {
   return reqUpdetaSubjectList(title,id).then(res => {
      dispatch(UpdetaSubjectListSync({title,id}));
    return res
    });
  };
};



