// 会员管理接口

import request from '@/utils/request'

export default {
    // 获取会员列表数据
    getList(){
        return request({
            url: '/member/list',
            method: 'get'
        })
    },

    // 分页查询会员列表
    // page 当前页码，size每页查询条数，searchMap条件查询的条件值
    search(page, size, searchMap){
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    }
}