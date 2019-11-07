// 商品接口

import request from '@/utils/request'


export default{
    // 分页查询搜索接口
    search(page,size,searchMap){
        return request({
            url: `/goods/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })   
    },

    // 新增商品
    add(pojo){
        return request({
            url: '/goods',
            method: 'post',
            data: pojo
        })
    },

    // 根据id查询数据
    getById(id){
        return request({
            url: `/goods/${id}`,
            method: 'get'
        })
    },

    // 编辑数据
    update(pojo){
        return request({
            url: `/goods/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },

    // 删除数据
    deleteById(id){
        return request({
            url: `/goods/${id}`,
            method: 'delete'
        })
    },
}