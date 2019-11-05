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

        
    }
}