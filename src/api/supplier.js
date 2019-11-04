// 供应商接口

import request from '@/utils/request'


export default({
    getList(){   //  获取所有供应商接口 
        return request({
            url: '/supplier/list',
            method: 'get'
        })
    },
    search(page,size,searchMap){  //  分页查询接口
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },

    // 新增供应商接口
    add(pojo){
        return request({
            url: '/supplier',
            method: 'post',
            data: pojo
        })
    },

    // 查询单条数据，编辑使用
    getById(id){
        return request({
            url: `/supplier/${id}`,
            method: 'get'
        })
    },

    // 更新数据接口
    update(pojo){
        return request({
            url:`/supplier/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },

    // 删除接口
    deleteById(id){
        return request({
            url:`/supplier/${id}`,
            method:'delete'
        })
    }
})