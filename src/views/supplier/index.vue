  <template>
  <div>
     <!-- 搜索框 -->
    <!-- :inline="true" 表单一行显示 -->
    <!-- :model="searchMap" 绑定到这个参数上 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
      <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
      <el-form-item prop="name">
        <!-- placeholder背景文案 -->
        <el-input v-model="searchMap.name" placeholder="供应商名称" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="linkMan">
        <el-input v-model="searchMap.linkMan" placeholder="联系人" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="searchMap.mobile" placeholder="联系电话" style="width: 200px"></el-input>
      </el-form-item>
    

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <!-- <el-button type="primary" @click="handleAdd">新增</el-button>-->
        <el-button @click="resetForm('searchForm')">重置</el-button> 
      </el-form-item>
    </el-form>
    <!-- 搜索框结束 -->   



    <!-- 列表数据
      :data绑定渲染的数据
      border 表格边框
      height 表格高度
    -->
    <el-table :data="list" height="380" border style="width: 100%">
      <!-- type='index'获取索引值，从1开始，label显示的标题，prop数据字段名，width列宽 -->
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="供应商名称" width="180"></el-table-column>
      <el-table-column prop="linkman" label="联系人" width='100'></el-table-column>
      <el-table-column prop="mobile" label="联系电话" width="180"></el-table-column>
      <el-table-column prop="remark" label="备注" ></el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit( scope.row.id)">编辑</el-button>
          <!-- 根据后端返回该行的id进行编辑和删除 -->
          <el-button size="mini" type="danger" @click="handleDelete( scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表数据结束 -->

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
    <!-- 分页完成 -->
  </div>
</template>

<script>
import supplierApi from '@/api/supplier'

export default {
  data(){
    return{
      list:[],
      pageSize: 10, // 每页显示的条数
      currenPage: 1,  // 当前的页码
      total: 0, // 总条数
      searchMap:{
        name:'',
        linkMan:'',
        mobile:''
      }   // 条件查询绑定的字段
    }
  },
  created(){
    this.fetchData()
    
  },
  methods:{
    fetchData(){  // 获取数据
      // supplierApi.getList().then(response=>{
        // 调用分页的接口，不用getList接口
      supplierApi.search(this.currenPage,this.pageSize,this.searchMap).then(response=>{
        console.log(response.data.data.rows)
        const res = response.data.data
        this.list=res.rows
        this.total=res.total
      })
    },
    handleEdit(id){  // 编辑
        console.log('编辑',id)
    },
    handleDelete(id){  // 删除
        console.log('删除',id)

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
     // 重置功能,element ui 提供的功能
    resetForm(formName){
       this.$refs[formName].resetFields();
    },
  }
  }
  
</script>