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
        <el-button type="primary" @click="handleAdd">新增</el-button>
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

        <!-- 弹出新增窗口 
        title 窗口的标题
        :visible.sync 当它true的时候，窗口会被弹出
    -->
    <!-- :rules="rules"校验，需要在校验的字段上指定prop -->
    <!-- 这里都要绑定prop，并且在data里声明，要不然弹框里的数据不会清空或者不能输入 -->
    <el-dialog title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :model="pojo"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="pojo.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <!-- 当pojo.id === null时，调用新增接口addData，当不为null，表示有id，则调更新接口updateData -->
        <el-button type="primary" @click="pojo.id === null ? addData('pojoForm'): updateData('pojoForm')">确 定</el-button>
        
      </div>
    </el-dialog>
    <!-- 弹出窗口结束 -->
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
      },   // 条件查询绑定的字段
      dialogFormVisible: false,
      pojo:{
        id: null,
        name:'',
        linkman:'',
        mobile: '',
        remark:''
      },
      rules:{
        name:[{required: true, message:'供应商不能为空',trigger:'blur'}],
        linkman:[{required: true, message:'联系人不能为空',trigger:'blur'}]
      }
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
        // console.log(response.data.data.rows)
        const res = response.data.data
        this.list=res.rows
        this.total=res.total
      })
    },
    handleEdit(id){  // 编辑弹框，获取数据
        console.log('编辑',id)
        // 清除原来的表单数据和校验结果
        this.handleAdd()
        supplierApi.getById(id).then(response=>{
          const res = response.data
          if(res.flag){
            this.pojo = res.data
          }else{
            // 提示获取数据失败
            this.$message({
              message:res.message,
              type:'warning'
            })
          }
        })
    },
    // 编辑，更新数据
    updateData(formName){
      this.$refs[formName].validate(valid=>{
        if(valid){
          supplierApi.update(this.pojo).then(response=>{
            const res = response.data
            if(res.flag){
              // 更新成功，刷新数据，关闭窗口
              this.fetchData()
              this.dialogFormVisible = false
            }else{
              // 提示更新失败
              this.$message({
              message:res.message,
              type:'warning'
          })
        }
      })
    }else{  // 没有校验通过，返回false
      return false
    }})
      },
    
    handleDelete(id){  // 删除
        console.log('删除', id)
            this.$confirm('确认删除这条记录吗？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            }).then(() => {
                // 确认
                console.log('确认')
                supplierApi.deleteById(id).then(response => {
                    // console.log(response)
                    const resp = response.data

                    // 删除成功或失败的提示信息
                    this.$message({
                        message: resp.message,
                        type: resp.flag ? 'success': 'error'
                    })

                    if(resp.flag) {
                        // 删除成功，刷新列表数据
                        this.fetchData()
                    }
                })
            }).catch(() => {
                // 取消，不用理会
                console.log('取消')
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
     // 重置功能,element ui 提供的功能
    resetForm(formName){
       this.$refs[formName].resetFields();
    },
    // 弹出新增窗口
    handleAdd() {
      
      // this.pojo = {}
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
        // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 新增数据
    addData(formName){
      // console.log('数据',formName)
        this.$refs[formName].validate(valid =>{
          if(valid){
            // 校验通过，提交表单
            // pojo才是提交到后台的数据，不是formName
            supplierApi.add(this.pojo).then(response=>{
              const res = response.data
              if (res.flag){
                this.fetchData()
                this.dialogFormVisible = false
              }else{
                this.$message({
                  message: res.message,
                  type: 'warning'
                })
              }
            })
          }else{
            return false
          }
        })
    },
  }
  }
  
</script>