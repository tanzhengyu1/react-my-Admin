import {GET_USER_INFO,GET_USER_MENU} from './constants'

const initUser={
  name:'',//用户名
  avatar:'',//用户头像
  permissionValueList:[],//用户按钮级别的权限
  permissionList:[]//用户菜单界别的权限
}
export default function user(prevState=initUser,action){
  switch(action.type){
    case GET_USER_INFO:
      return{
        //解构原来的数据的数据
        ...prevState,
        //解构新的数据,新的数据会覆盖原来的数据
        ...action.data
      }
      case GET_USER_MENU:
        return{
          ...prevState,
          permissionList:action.data
        }
        default:
          return prevState
  }

}








