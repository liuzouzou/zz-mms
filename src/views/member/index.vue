<template>
  <div>
    <!-- 搜索框 -->
    <!-- :inline="true" 表单一行显示 -->
    <!-- :model="searchMap" 绑定到这个参数上 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
      <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
      <el-form-item prop="cardNum">
        <!--prop需要在data里指定，不指定会出现重置不了的问题， placeholder背景文案 -->
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名字" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型" style="width: 110px">
          <!-- 不要忘记 payTypeOptions 绑定到data中 -->
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 日期搜索框 -->
      <el-form-item prop="birthday">
        <!-- value-format 是指定绑定值的格式 -->
        <el-date-picker
          style="width: 200px"
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="出生日期"
        ></el-date-picker>
      </el-form-item>
      <!-- 日期搜索框结束 -->

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
      <el-table-column prop="cardNum" label="会员卡号" width="180"></el-table-column>
      <el-table-column prop="name" label="会员姓名"></el-table-column>
      <el-table-column prop="birthday" label="会员生日" width="100"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="120"></el-table-column>
      <el-table-column prop="integral" label="可用积分"></el-table-column>
      <el-table-column prop="money" label="开卡余额"></el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <!-- 使用过滤器 -->
          <span>{{scope.row.payType | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址" width='180'></el-table-column>

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

    <!-- 弹出新增窗口 
        title 窗口的标题
        :visible.sync 当它true的时候，窗口会被弹出
    -->
    <!-- :rules="rules"校验，需要在校验的字段上指定prop -->
    <!-- 这里都要绑定prop，并且在data里声明，要不然弹框里的数据不会清空或者不能输入 -->
    <!-- :closeOnClickModal=false 点击空白区域不关闭弹框，默认为true -->
    <el-dialog title="会员编辑" :closeOnClickModal=false :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :model="pojo"
      >
        <el-form-item label="会员卡号"  prop="cardNum">
          <el-input v-model="pojo.cardNum" placeholder="请输入会员卡号"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名"  prop="name">
          <el-input v-model="pojo.name" placeholder="请输入会员姓名"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <!-- value-format 是指定绑定值的格式 -->
          <el-date-picker
            style="width: 200px"
            value-format="yyyy-MM-dd"
            v-model="pojo.birthday"
            type="date"
            placeholder="会员生日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额"  prop="money">
          <el-input v-model="pojo.money" placeholder="请输入开卡金额"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral" placeholder="请输入可用积分"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="支付类型" style="width: 110px">
            <!-- 不要忘记 payTypeOptions 绑定到data中 -->
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input type="textarea" v-model="pojo.address" placeholder="请输入会员地址"></el-input>
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
import memberApi from "@/api/member";

// 支付类型，不能写在data里面，会报错
const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];

export default {
  data() {
    return {
      list: [], // 列表渲染的数据
      total: 0, // 总记录数
      currenPage: 1, // 当前页码
      pageSize: 10, // 每页显示的数据条数
      searchMap: {
        // 条件查询绑定的条件值,搜索字段有四个
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      },
      payTypeOptions, // 这里要申明，要不然搜索框里使用的时候会报错
      payTypeOptions, // payTypeOptions: payTypeOptions
      dialogFormVisible: false, //控制对话框，默认不弹出
      pojo: {
        // 提交的数据，不写有时候会导致输入框输入不了
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        money: 0, // 输入框里的默认值
        integral: 0,
        payType: "",
        address: ""
      },
      rules: {
        // 校验规则
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "支付类型不能为空", trigger: "change" }
        ]
      }
    };
  },

  created() {
    // 调接口请求数据，将调接口定义一个方法，在created里调用这个方法
    this.fetchData();
  },

  methods: {
    fetchData() {
      // 请求接口
      // memberApi.getList().then(response=>{
      // 调用分页的接口，不使用getList接口
      memberApi.search(this.currenPage, this.pageSize, this.searchMap).then(response => {
          const res = response.data;
          this.list = res.data.rows; // 只要data里的数据
          console.log(res);
          this.total = res.data.total; // 总数
          console.log("总数", this.total);
        });
    },
    // 打开编辑窗口
    handleEdit(id) {
      console.log("编辑", id);
      this.handleAdd();  // 要打开窗口，清除数据，直接复用handleAdd就可以了
      memberApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;  // 将数据赋值给pojo显示在输入框里
          console.log(this.pojo);  
        }
      });
    },
    // 更新接口
    updateData(formName) {
      console.log("updateData");
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交更新
          memberApi.update(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              // 刷新列表
              this.fetchData();
              this.dialogFormVisible = false; // 关闭弹窗
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {  // 没有校验通过，返回false
          return false;
        }
      });
    },
    // 删除会员
    handleDelete(id) {
      console.log('删除', id)
            this.$confirm('确认删除这条记录吗？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
            }).then(() => {
                // 确认
                console.log('确认')
                memberApi.deleteById(id).then(response => {
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

    // 重置功能,element ui 提供的功能
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 提交新增数据,formName就是传过来的pojoForm
    addData(formName) {
      // console.log('数据',formName)
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          console.log("addData");
          // pojo才是提交到后台的数据，不是formName
          memberApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              //新增成功，刷新列表数据
              this.fetchData();
              this.dialogFormVisible = false; // 关闭窗口
            } else {
              // 失败，来点提示信息
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {  // 没有校验通过，返回false
          return false;
        }
      });
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
  filters: {
    // 过滤器，转换支付类型
    payTypeFilter(type) {
      const payObj = payTypeOptions.find(obj => {
        return obj.type === type;
      });
      return payObj ? payObj.name : null; // 没找到类型返回null，找到了返回payObj.name
    }
  }
};
</script>