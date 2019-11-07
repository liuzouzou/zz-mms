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
     <!-- v-if='!isDialog',isDialog为true，!isDialog为false，列表展示，弹框不展示 -->
        <el-input v-model="searchMap.linkMan"  v-if='!isDialog' placeholder="联系人" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="searchMap.mobile" v-if='!isDialog' placeholder="联系电话" style="width: 200px"></el-input>
      </el-form-item>
    

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" v-if='!isDialog' @click="handleAdd">新增</el-button>
        <el-button v-if='!isDialog' @click="resetForm('searchForm')">重置</el-button> 
      </el-form-item>
    </el-form>
    <!-- 搜索框结束 -->   



    <!-- 列表数据
      :data绑定渲染的数据
      border 表格边框
      height 表格高度
    -->
    <!-- Table 组件提供了单选的支持，只需要配置highlight-current-row属性即可实现单选。
    之后由current-change事件来管理选中时触发的事件，它会传入currentRow，oldCurrentRow。
    如果需要显示索引，可以增加一列el-table-column，设置type属性为index即可显示从 1 开始的索引号。 -->
    <!-- 当点击时调用clickCurrentChange这个方法 -->
    <!-- 供应商的列表也会选中，如果不想选中，将下面的highlight-current-row改为 :highlight-current-row='isDialog' -->
    <el-table  highlight-current-row @current-change="clickCurrentChange"
    :data="list" height="380" border style="width: 100%">
      <!-- type='index'获取索引值，从1开始，label显示的标题，prop数据字段名，width列宽 -->
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="供应商名称" width="180"></el-table-column>
      <!-- v-if='!isDialog',isDialog为true，!isDialog为false，列表展示，弹框不展示 -->
      <el-table-column prop="linkman" label="联系人" width='100'></el-table-column>
      <el-table-column prop="mobile"  v-if='!isDialog' label="联系电话" width="180"></el-table-column>
      <el-table-column prop="remark"  v-if='!isDialog' label="备注" ></el-table-column>

      <!-- 操作 -->
      <el-table-column v-if='!isDialog' label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit( scope.row.id)">编辑</el-button>
          <!-- 根据后端返回该行的id进行编辑和删除 -->
          <el-button size="mini" type="danger" @click="handleDelete( scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表数据结束 -->

   <!-- 分页 -->
   <!-- :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper': 'prev, pager, next'"
      为true时，显示所有，为false时，显示 prev, pager, next
    -->
    <el-pagination
      :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper': 'prev, pager, next'"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currenPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      
      :total="total"
    ></el-pagination>
    <!-- 分页完成 -->

        <!-- 弹出新增窗口 
        title 窗口的标题
        :visible.sync 当它true的时候，窗口会被弹出
    -->
    <!-- :rules="rules"校验，需要在校验的字段上指定prop -->
    <!-- 这里都要绑定prop，并且在data里声明，要不然弹框里的数据不会清空或者不能输入 -->
    <el-dialog title="供应商编辑" :closeOnClickModal=false :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :model="pojo"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name" placeholder="请输入供应商名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="pojo.remark" placeholder="请输入备注"></el-input>
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
  // 接收父组件传递过来的数据，通过isDialog判断是否为弹框
  // 如果为true，就是弹框，false就是列表，传递过来的为true
  props: {
    isDialog: Boolean
  },
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
    
    // 当点击某一行时，会调用这个函数进行处理，子组件向父组件传值
    clickCurrentChange(currentRow){
      console.log(currentRow)
      // 点击后，要将点击的数据传递给父组件（商品管理中）
      //  则可以通过触发父组件的option-supplier，触发之后，父组件可以在option-supplier这个事件对应的
      // 处理函数中进行接收数据
      // 第一个参数是父组件的点击事件，第二个是要传递的数据
      this.$emit('option-supplier', currentRow)

    },
  }
  }
  
</script>