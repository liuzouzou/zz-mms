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
        <el-button type="primary" @click="handleAdd">新增</el-button>
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


    <!-- 弹出新增窗口 -->
    <el-dialog title="编辑商品" :visible.sync='dialogFormVisible' width=500px>
     <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :model="pojo"
      >

        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code" placeholder="请输入商品编码"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
           <el-input v-model="pojo.spec" placeholder="请输入商品规格"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice" placeholder="请输入零售价"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice" placeholder="请输入进货价"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum" placeholder="请输入库存数量"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <!-- readonly只读， -->
          <el-input readonly @click.native = 'editOptionSupplier' v-model="pojo.supplierName" placeholder="请选择供应商"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData('pojoForm')">确 定</el-button>
        <!-- 当pojo.id === null时，调用新增接口addData，当不为null，表示有id，则调更新接口updateData -->
        <!-- <el-button type="primary" @click="pojo.id === null ? addData('pojoForm'): updateData('pojoForm')">确 定</el-button> -->
        
      </div>
    </el-dialog>
    <!-- 新增窗口结束 -->



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
      dialogSupplierVisible: false, // 弹出选择供应商对话框
      dialogFormVisible: false,   // 弹出新增商品窗口
      rules: {
        name: [{required: true, message: '商品名称不能为空', trigger: 'blur'}],
        code: [{required: true, message: '商品编码不能为空', trigger: 'blur'}]
      },
      pojo:{
        name: '',
        code: '',
        spec: '',
        retailPrice:'',
        purchasePrice: '',
        storageNum: '',
        supplierName: '',
        supplierId: null

      },
      isEdit: false   // 是否为编辑窗口,是编辑窗口，选中供应商后显示在新增弹框里。不是，显示在搜素框里
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
        if(this.isEdit){
        this.pojo.supplierName = currentRow.name  //  供应商名称，supplierName传给后台
        this.pojo.supplierId = currentRow.id // 供应商的id，supplierId传给后台
        }else{
        this.searchMap.supplierName = currentRow.name  //  供应商名称，supplierName传给后台
        this.searchMap.supplierId = currentRow.id // 供应商的id，supplierId传给后台
        }
        this.isEdit = false  //还原默认值
        this.dialogSupplierVisible = false  // 关闭窗口
    },
    // 重置功能,element ui 提供的功能
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 弹出新增窗口
    handleAdd() {
      console.log(this.pojo);
      // this.pojo = {}
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
        // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 提交新增数据,formName就是传过来的pojoForm
    addData(formName) {
      // console.log('数据',formName)
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          console.log("addData");
          // pojo才是提交到后台的数据，不是formName
          goodsApi.add(this.pojo).then(response => {
            const res = response.data;
            if (res.flag) {
              //新增成功，刷新列表数据
              this.fetchData();
              this.dialogFormVisible = false; // 关闭窗口
            } else {
              // 失败，来点提示信息
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
        } else {  // 没有校验通过，返回false
          return false;
        }
      });
    },
    editOptionSupplier(){
      this.isEdit = true,   //  当前是通过编辑窗口的选中供应商打开的窗口
      this.dialogSupplierVisible = true
    }
  }
}
</script>