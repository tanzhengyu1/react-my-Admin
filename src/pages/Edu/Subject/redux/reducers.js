import {
  GET_SUBJECT_LIST,GET_TWOSUBJECT_LIST,UPDETA_SUBJECT
} from "./constants";

const initSbujectList = {
  total: 0, // 总数
  items: [], // 详细user数据
}

export default function subjectList(prevState = initSbujectList, action) {
  switch (action.type) {
    case GET_SUBJECT_LIST:
      //要实现二级课程费雷,需要给items中每一个数据添加chirdern属性
      //有了children属性,每一数据才可以展开
      action.data.items.forEach(item=>{
        item.children=[]
  })
    return action.data


    case GET_TWOSUBJECT_LIST:
       //把获取的二级分类数据添加到一级分类的childen属性中
       //判断是否有二级分类数据
      if(action.data.items.length>0){
       //获取一级分类的id
        const parentId =action.data.items[0].parentId
        //遍历一级分类数据,
        //把二级分类的数据给乡音的一级分类
        prevState.items.forEach(item=>{
          if(item._id===parentId){
            item.children = action.data.items
          }
        })
        
      }   
      return {
        ...prevState
      }
      case UPDETA_SUBJECT:     
      prevState.items.forEach(subject=>{
        if(subject._id===action.data.id){
          subject.title=action.data.title
          return
        }
        subject.children.forEach(secSubject=>{
          if(secSubject._id===action.data.id){
            secSubject.title=action.data.title
          }
        })
      })
      return {
        ...prevState
      }
    default:
      return prevState;
  }
}
