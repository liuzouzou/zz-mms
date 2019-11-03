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
    }
})