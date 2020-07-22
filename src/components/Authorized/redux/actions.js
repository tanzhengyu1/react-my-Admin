import { getMenu, getInfo } from "@api/acl/login";

import {GET_USER_MENU,GET_USER_INFO} from "./constants";
/**
 * 获取权限菜单
 */
// 获取用户信息
function GetUserInfoSync (data){
  return{type:GET_USER_INFO,data}
} 

export function getUserInfo()  {
  return dispatch => {
    return getInfo().then((res) => {
      dispatch(GetUserInfoSync(res))
      return res
    });
  }
};
//获取菜单列表
function GetUserMenuSync(data){
  return {type:GET_USER_MENU,data}
}
export function getUserMenu(){
  return dispatch=>{
    return getMenu().then(res=>{
      dispatch(GetUserMenuSync(res.permissionList))
      return res.permissionList
    })
  }
}



