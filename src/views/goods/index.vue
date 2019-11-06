<template>
  <div>
     <!-- 搜索框 -->
    <!-- :inline="true" 表单一行显示 -->
    <!-- :model="searchMap" 绑定到这个参数上 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
      <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
      <el-form-item prop="name">
        <!-- placeholder背景文案 -->
        <el-input v-model="searchMap.name" placeholder="商品名称" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">

        <!-- readonly只读，不可点击 -->
        <!-- 注意： el-input 是组件，要在组件元素监听原生事件，需要使用  v-on:原生事件名.native="处理函数" -->
        <!-- dialogSupplierVisible在data里定义的为false，点击后变为了true，选择供应商对话框就成了true，就会弹出 -->
        <el-input readonly
        v-model="searchMap.supplierName" @click.native='dialogSupplierVisible = true' placeholder="选择供应商" style="width: 200px"></el-input>
      </el-form-item>
    

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <!-- <el-button type="primary" @click="handleAdd">新增</el-button> -->
        <el-button @click="resetForm('searchForm')">重置</el-button> 
      </el-form-item>
    </el-form>
    <!-- 搜索框结束 -->   


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


    <!-- 选择供应商对话框 -->
    <!-- :visible.sync异步的，不加.sync则弹出的框关不掉 -->
    <el-dialog title="选择供应商" :visible.sync='dialogSupplierVisible' width=500px>
      <!-- :isDialog='true' 父组件向子组件supplier传值，需要props接收 -->
      <!-- @option-supplier='optionSupplier'，子组件点击时会触发optionSupplier方法 -->
      <supplier :isDialog='true' @option-supplier='optionSupplier'></supplier> <!-- 使用子组件  -->
    </el-dialog>




  </div>
</template>



<script>
import goodsApi from "@/api/goods"
import Supplier from "@/views/supplier"  // 导入组件，做为这里的子组件，导入之后要注册

export default {
  // 注册Supplier为子组件
  components: {Supplier},


  data(){
    return {
      list: [],
      pageSize:10,
      currenPage:1,
      total:0,
      searchMap:{  // 不写会导致清空不了或输入不了的问题
        name: '',
        code: '',
        supplierName: ''

      },
      dialogSupplierVisible: false // 弹出选择供应商对话框
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
    },
    optionSupplier(currentRow){
        console.log('parent', currentRow)
        this.searchMap.supplierName = currentRow.name  //  供应商名称，supplierName传给后台
        this.searchMap.supplierId = currentRow.id // 供应商的id，supplierId传给后台
        this.dialogSupplierVisible = false  // 关闭窗口
    },
    // 重置功能,element ui 提供的功能
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>