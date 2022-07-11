import request from "@/utils/request";

// 找房（下拉弹窗）
export function getAreas(params) {
  return request({
    url: "/houses/condition",
    method: "get",
    params,
  });
}

// 房屋列表
export function getHouseList(params) {
  return request({
    url: "/houses",
    method: "get",
    params,
  });
}
