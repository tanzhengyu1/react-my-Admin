import {
  GET_SUBJECT_LIST
} from "./constants";

const initSbujectList = {
  total: 0, // 总数
  items: [], // 详细user数据
}

export default function subjectList(prevState = initSbujectList, action) {
  switch (action.type) {
    case GET_SUBJECT_LIST:
      return action.data;
  
    default:
      return prevState;
  }
}
