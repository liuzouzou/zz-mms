<template>
  <div>
        <!-- 列表页面
      :data绑定渲染的数据
      border 表格边框
      height 表格高度
    -->
    <el-table :data="list" height="380" border style="width: 100%">
      <!-- type='index'获取索引值，从1开始，label显示的标题，prop数据字段名，width列宽 -->
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="spec" label="商品规格" width="100"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价" width="120"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" width='180'></el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit( scope.row.id)">编辑</el-button>
          <!-- 根据后端返回该行的id进行编辑和删除 -->
          <el-button size="mini" type="danger" @click="handleDelete( scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表页面结束 -->

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currenPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 分页结束 -->
  </div>
</template>


<script>
import goodsApi from "@/api/goods"

export default {
  data(){
    return {
      list: [],
      pageSize:10,
      currenPage:1,
      total:0,
      searchMap:{}
    }

  },
  created(){
    this.fetchData()
  },
  methods:{
      fetchData(){
          goodsApi.search(this.currenPage,this.pageSize,this.searchMap).then(response=>{
                const res = response.data.data
                console.log(res)
                this.total = res.total
                this.list = res.rows
          })
      },
         // 当每页显示条数改变后被触发，val是最新的每页显示条数
      handleSizeChange(val) {
        this.pageSize = val;
        this.fetchData();
      },
      // 当页码改变后被触发，val是最新的页码
      handleCurrentChange(val) {
        this.currenPage = val;
        this.fetchData();
    }
  },
}
</script>