<template>
    <div class="forget">
        <el-form
        :model="forget"
        status-icon
        :rules="rules"
        ref="forget"
        :label-position="labelPosition"
        label-width="120px"
        size="mini"
        >
        <el-form-item label="您父亲的名字" prop="qustionForReset">
            <el-input v-model="forget.questionforReset" autocomplete="off">
            </el-input>
        </el-form-item>
        <el-form-item label="账号" prop="accountUser">
            <el-input  v-model="forget.accountUser" autocomplete="off">
            </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
            <el-input v-model="forget.password" autocomplete="off">
            </el-input>
        </el-form-item>
        <div>
            <el-button class="submit" type="primary" size="medium" @click="submitForm('forget')">提交</el-button>
        </div>
        <div class="foot">
            <span class="footSpan" @click="jump()">返回</span>
        </div>
        </el-form>
    </div>
</template>
<script>
export default {
    data(){
        return {
            labelPosition:'left',
            forget:{
                questionforReset:"",
                accountUser	:"",
                password : ""
            },
            rules: {
                questionforReset: [{ required: true,  trigger: "blur" }],
                accountUser: [{ required: true,  trigger: "blur" }],
                password: [{ required: true,  trigger: "blur" }]
            }
        }
    },
    methods:{
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                
             this.axios
            .post("http://47.102.198.100:9999/api/system/forgetPassword", {
              questionforReset: this.forget.questionforReset,
              accountUser: this.forget.accountUser,
              password:  this.forget.password
            })
            .then(res => {
              if ((res.data.status+'') == "true") {
                alert("重置成功");
              }
            })
            .catch(res => {
              console.log(res);
            });
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        jump(){
             this.$router.push({path:'/login'});
        }
    }
}
</script>
<style scoped>
.forget{
    background: rgb(70,55,95);
    display: inline-block;
    border-radius: 4px;
    position: absolute;
    width: 300px;
    padding: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.submit{
    width: 100%;
}
.footSpan{
    cursor: pointer;
    font-size: 12px;
    float: right;
    margin-left: 10px;
    color: #409EFF;
    text-decoration: underline;
}
.foot{
    margin-top: 10px;
}
</style>
