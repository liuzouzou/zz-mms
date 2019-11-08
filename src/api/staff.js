// 员工管理接口

import request from '@/utils/request'


export default{
    // 分页查询员工列表
    // page 当前页码，size每页查询条数，searchMap条件查询的条件值
    search(page,size,searchMap){
        return request({
            url: `/staff/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })

    },
    // 新增员工
    add(pojo){
        return request({
            url: '/staff',
            method: 'post',
            data: pojo
        })
    },
    // 通过id查询员工信息
    getById(id){
        return request({
            url: `/staff/${id}`,
            method: 'get'
        }) 
    },

    // 更新数据
    update(pojo){
        return request({
            url: `/staff/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },
     // 删除员工
     deleteById(id){
        return request({
            url: `/staff/${id}`,
            method: 'delete',
        })
    },
}