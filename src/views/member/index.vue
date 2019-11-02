<template>
  <div>
    <!-- 
      :data绑定渲染的数据
      border 表格边框
      height 表格高度
     -->
    <el-table
    :data="list"
    height="380"
    border
    style="width: 100%">
    <!-- type='index'获取索引值，从1开始，label显示的标题，prop数据字段名，width列宽 -->
    <el-table-column type='index' label="序号" width="50"></el-table-column>
    <el-table-column prop="cardNum" label="会员卡号" width="180"></el-table-column>
    <el-table-column prop="name" label="会员姓名" ></el-table-column>
    <el-table-column prop="birthday" label="会员生日" width="100"></el-table-column>
    <el-table-column prop="phone" label="手机号码" width="120"></el-table-column>
    <el-table-column prop="integral" label="可用积分" ></el-table-column>
    <el-table-column prop="money" label="开卡余额" ></el-table-column>
    <el-table-column prop="payType" label="支付类型" >
       <template slot-scope="scope">
         <!-- 使用过滤器 -->
        <span>{{scope.row.payType | payTypeFilter }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="address" label="会员地址" ></el-table-column>

    <!-- 操作 -->
    <el-table-column label="操作" width='150'>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit( scope.row.id)">编辑</el-button> <!-- 根据后端返回该行的id进行编辑和删除 -->
        <el-button  
          size="mini"
          type="danger"
          @click="handleDelete( scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
    
  </el-table>

  <!-- 分页 -->
  <el-pagination
      @size-change="fetchData"
      @current-change="fetchData"
      :current-page="currenPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import memberApi from '@/api/member'

// 支付类型，不能写在data里面，会报错
const payTypeOptions = [
  {type: '1', name: '现金'},
  {type: '2', name: '微信'},
  {type: '3', name: '支付宝'},
  {type: '4', name: '银行卡'}
]

export default {
  data(){  
    return{
      list: [],    // 列表渲染的数据
      total: 0, // 总记录数
      currenPage: 1,  // 当前页码
      pageSize: 10,   // 每页显示的数据条数
      searchMap: {},   // 条件查询绑定的条件值
    }
  },

  created(){
    // 调接口请求数据，将调接口定义一个方法，在created里调用这个方法
    this.fetchData()
  },

  methods: {
    fetchData(){
      // 请求接口
      // memberApi.getList().then(response=>{
        // 调用分页的接口
      memberApi.search(this.currenPage,this.pageSize,this.searchMap).then(response=>{
        const res = response.data
        this.list = res.data.rows  // 只要data里的数据
        console.log(res)
        this.total = res.data.total  // 总数
        console.log('总数',this.total)
      })
    },
    handleEdit(id){  // id是后端返回的id
      console.log('编辑',id)
    },
    handleDelete(id){
      console.log('删除',id)
    }
  },
  filters:{
    // 过滤器，转换支付类型
    payTypeFilter(type){
      const payObj = payTypeOptions.find(obj =>{
        return obj.type === type
      })
      return payObj ? payObj.name:null  // 没找到类型返回null，找到了返回payObj.name
    }
  }
  
}
</script>