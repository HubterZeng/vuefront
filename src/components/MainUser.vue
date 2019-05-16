<template>
  <div>
    <el-container>
      <el-header>
        <div
          style="display: inline-block;position: absolute;left: 70px;color:#fff;"
        >你的姓名：{{userName}},您的id:{{userid}}</div>
        <div style="width: 200px;position: absolute; right: 20px;display: inline-block;">
          <el-input placeholder="请输入内容" v-model="search" size="medium">
            <el-button slot="append" icon="el-icon-search" @click="searchItem()"></el-button>
          </el-input>
        </div>
      </el-header>
      <el-container style>
        <el-aside width="200px" style="padding:20px 0;">
          <el-menu :default-openeds="['1','2']" @select="handleSelect">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-message"></i>通讯录
              </template>
              <el-menu-item-group>
                <label v-for="(item,index) in navData" :key="index">
                  <el-menu-item v-on:click="showChat()">
                    <span slot="title">{{item.friendsnamedoc}}</span>
                  </el-menu-item>
                </label>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-message"></i>常用功能
              </template>
              <el-menu-item-group>
                <el-menu-item v-on:click="historyQuestionShow()">历史咨询</el-menu-item>
                <el-menu-item v-on:click="addConsuleShow()">我要提问</el-menu-item>
                <el-menu-item v-on:click="findfriendsShow()">添加好友</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <div v-show="showStatus.Data">
            <el-table
              height="550"
              ref="multipleTable"
              :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="index" :index="indexAdd" label="序号" width="140"></el-table-column>
              <el-table-column prop="quscontent" label="咨询内容" width="140"></el-table-column>
              <el-table-column prop="qustitle" label="咨询标题" width="120"></el-table-column>
            </el-table>
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              @current-change="current_change"
            ></el-pagination>
          </div>
          <div v-show="showStatus.Chat">
            <div style="height:650px;background-color:#fff;font-size:25px">
              聊天室
              <div class="main">
                <ul class="content">
                  <li v-for="todo in todos" :key="todo.key" :class="todo.position">
                    <p :class="todo.class">{{todo.text}}</p>
                  </li>
                </ul>
                <div style="text-align:left;padding-left: 15px;">
                  <i class="el-icon-upload2"></i>
                  <i class="el-icon-phone-outline"></i>
                  <i class="el-icon-picture"></i>
                </div>
                <el-input
                  type="textarea"
                  :rows="3"
                  style="font-size:25px"
                  placeholder="输入聊天内容"
                  v-model="textarea"
                ></el-input>
                <div style="position: absolute;right: 30px; margin-top: 5px;">
                  <el-button type="primary" size="medium" @click="sendMessage()" plain>发送</el-button>
                </div>
              </div>
            </div>
          </div>

          <div v-show="showStatus.addQuestion">
            <el-form
              :model="questionForm"
              status-icon
              :rules="rules"
              ref="questionForm"
              :label-position="labelPosition"
              label-width="120px"
              size="medium"
            >
              <el-form-item label="标题" prop="qustitle">
                <el-input v-model.number="questionForm.qustitle" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item label="内容" prop="quscontent">
                <el-input v-model="questionForm.quscontent" autocomplete="off" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="您的ID" prop="userid">
                <el-input v-model="questionForm.userid" autocomplete="off" placeholder="请输入您的用户ID"></el-input>
              </el-form-item>
              <div>
                <el-button
                  type="primary"
                  size="small"
                  @click="submitquestionForm('questionForm')"
                >提交</el-button>
                <el-button size="small" @click="resetquestionForm('questionForm')">重置</el-button>
              </div>
            </el-form>
          </div>
          <div v-show="showStatus.findFriends">
            <el-form
              :model="findFriendsForm"
              status-icon
              :rules="rules"
              ref="findFriendsForm"
              :label-position="labelPosition"
              label-width="120px"
              size="medium"
            >
              <el-form-item label="要添加的好友的帐号" prop="qustitle">
                <el-input v-model="findFriendsForm.userAccount" placeholder="请输入帐号"></el-input>
              </el-form-item>
              <div>
                <el-button
                  type="primary"
                  size="small"
                  @click="submitfindFriendsForm('findFriendsForm')"
                >查询</el-button>
                <el-button size="small" @click="addFriends('findFriendsForm')">添加好友</el-button>
              </div>
            </el-form>
          </div>
          <!-- <div v-show="this.activeIndex=='2-2'">
            <div style="height:500px;background-color:#fff">历史咨询</div>
          </div>-->
          <!-- <div v-show="this.activeIndex=='2-3'">
            <div style="height:500px;background-color:#fff">添加好友</div>
          </div>-->
        </el-main>
        <!-- </el-container> -->
      </el-container>
    </el-container>
  </div>
</template>

<script>
import qs from "qs";
import global_ from "../components/Global";
export default {
  // props:['showStatus'],
  data() {
    return {
      total: 0,
      pagesize:10,
      currentPage:1,
      showStatus: global_.showStatus,
      userName: "xxx",
      userid: "",
      search: "",
      tableData: [],
      activeIndex: "",
      textarea: "",
      todos: [
        {
          key: "1",
          text: "你好啊",
          position: "left",
          class: "leftP"
        },
        {
          key: "2",
          text: "你好",
          position: "right",
          class: "rightP"
        },
        {
          key: "3",
          text: "再见",
          position: "left",
          class: "leftP"
        }
      ],
      navData: [],
      questionForm: {
        qustitle: "",
        quscontent: ""
      },
      findFriendsForm: {
        userAccount: "",
        userid: global_.userid
      }
    };
  },
  methods: {
    // searchItem() {},
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`);
    // },
    indexAdd(index) {
      return index+(this.currentPage-1)*10+ 1;
    },
    handleSelect(key) {
      console.log(key);
      this.activeIndex = key;
    },
    showChat: function() {
      global_.showStatus.Chat = true;
      global_.showStatus.Data = false;
      global_.showStatus.addQuestion = false;
      global_.showStatus.findFriends = false;
      // changeshowStatus(this.showStatus);
    },
    findfriendsShow() {
      //添加好友展示
      global_.showStatus.Chat = false;
      global_.showStatus.Data = false;
      global_.showStatus.addQuestion = false;
      global_.showStatus.findFriends = true;
    },
    historyQuestionShow() {
      global_.showStatus.Chat = false;
      global_.showStatus.Data = true;
      global_.showStatus.addQuestion = false;
      global_.showStatus.findFriends = false;

      this.axios
        .post("http://localhost:80/api/system/consuleHistory")
        .then(res => {
          this.tableData = res.data;
          this.total=this.tableData.length;
        })
        .catch(res => {
          console.log(res);
        });
    },
    addConsuleShow() {
      global_.showStatus.Chat = false;
      global_.showStatus.Data = false;
      global_.showStatus.addQuestion = true;
      global_.showStatus.findFriends = false;
    },
    sendMessage() {
      this.todos.push({
        key: "",
        text: this.textarea,
        position: "right",
        class: "rightP"
      });
      this.textarea = "";
    },
    submitquestionForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios
            .post(
              "http://localhost:80/api/system/addConsule",
              qs.stringify(this.questionForm)
            )
            .then(res => {
              if (res.data.status + "" == "true") {
                alert("提交成功");
              }
            })
            .catch(res => {
              console.log(res);
            });
        } else {
          return false;
        }
      });
    },
    resetquestionForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitfindFriendsForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios
            .post("http://localhost:80/api/system/findDoctor", {
              userAccount: this.findFriendsForm.userAccount
            })
            .then(res => {
              console.log(res.data);
              if (res.data.id + "" != "") {
                alert("此用户存在" + res.data);
              }
            })
            .catch(res => {
              console.log(res);
            });
        } else {
          return false;
        }
      });
    },
    addFriends(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(global_.userid);
          this.axios
            .post("http://localhost:80/api/system/addFriends", {
              userAccount: this.findFriendsForm.userAccount,
              userid: global_.userid
            })
            .then(res => {
              if (res.data.status + "" == "true") {
                alert("添加成功");
                this.axios
                  .post("http://localhost:80/api/system/getFriends")
                  .then(res => {
                    this.navData = res.data;
                  })
                  .catch(res => {
                    console.log(res);
                  });
              }
            })
            .catch(res => {
              console.log(res);
            });
        } else {
          return false;
        }
      });
    },
    current_change:function(currentPage){
        this.currentPage = currentPage;
      }
  },
  mounted: function() {
    //   console.log("userName  Created");
    //  console.log(global_.Data+'xxxxxxxxxxxxx');
    this.axios
      .post("http://localhost:80/api/system/getUserInfo")
      .then(res => {
        console.log(res.data.username); //获取属性的正确写法
        this.userName = res.data.username;
        this.userid = res.data.userid;
        global_.userid = res.data.userid;
        console.log(this.userName);
      })
      .catch(res => {
        console.log(res);
      });
    this.axios
      .post("http://localhost:80/api/system/getFriends")
      .then(res => {
        this.navData = res.data;
      })
      .catch(res => {
        console.log(res);
      });
  }
};
</script>

<style scoped>
.el-header {
  line-height: 60px;
}
.el-pagination {
  margin-top: 10px;
}
.content {
  list-style: none;
  height: 400px;
  border: 2px solid #d1d3d6;
  overflow-y: scroll;
  padding: 0 10px;
  margin: 0;
}
.left {
  text-align: left;
}
.leftP {
  background-color: lightgrey;
  width: auto;
  max-width: 500px;
  height: auto;
  word-break: break-all;
  margin: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
}
.right {
  text-align: right;
}
.rightP {
  background-color: yellowgreen;
  width: auto;
  max-width: 500px;
  height: auto;
  word-break: break-all;
  margin: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
}
</style>