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
                    <span slot="title">{{item.friendsnameuser}}</span>
                  </el-menu-item>
                </label>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-message"></i>常用功能
              </template>
              <el-menu-item-group>
                <el-menu-item v-on:click="lookHistoryShow()">浏览历史</el-menu-item>
                <!-- 浏览历史是指该医生参与回答问题的记录集  点击我的回答后，展示回答问题的方案-->
                <el-menu-item v-on:click="findFriendsShow()">添加好友</el-menu-item>
                <el-menu-item v-on:click="addTreatmentsShow()">我要回答</el-menu-item>
                <!-- 我要回答的设计逻辑   展示问题列表，点击后面的回答 进入回答界面 -->
                <!--  <el-menu-item v-on:click="historyQuestionShow()">历史咨询</el-menu-item> -->
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <div v-show="showStatus.lookData">
            <el-table :data="tableData" height="550">
              <el-table-column type="index" :index="indexAdd" label="序号" width="140"></el-table-column>
              <el-table-column prop="quscontent" label="咨询内容" width="140"></el-table-column>
              <el-table-column prop="qustitle" label="咨询标题" width="120"></el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <span
                    class="el-tag el-tag--mini"
                    style="cursor: pointer;"
                    @click="seeMyAnswer(scope.row.id)"
                  >我的回答</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.length"
            ></el-pagination>-->
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

          <div v-show="showStatus.addTreatment">
            <el-form
              :model="treatmentForm"
              status-icon
              :rules="rules"
              ref="treatmentForm"
              :label-position="labelPosition"
              label-width="120px"
              size="medium"
            >
              <el-form-item label="回复内容" prop="treatments">
                <el-input v-model="treatmentForm.treatments" autocomplete="off" placeholder="请输入内容"></el-input>
              </el-form-item>
              <div>
                <el-button
                  type="primary"
                  size="small"
                  @click="submittreatmentForm('treatmentForm')"
                >提交</el-button>
                <el-button size="small" @click="resettreatmentForm('treatmentForm')">重置</el-button>
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
          <div>
            <div v-show="showStatus.qusData">
              <el-table :data="qusTableData" height="550">
                <el-table-column type="index" :index="indexAdd" label="序号" width="140"></el-table-column>
                <el-table-column prop="quscontent" label="咨询内容" width="140"></el-table-column>
                <el-table-column prop="qustitle" label="咨询标题" width="120"></el-table-column>
                <el-table-column prop="userid" label="用户ID"></el-table-column>
                <el-table-column prop="id" label="咨询记录ID"></el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <span
                      class="el-tag el-tag--mini"
                      style="cursor: pointer;"
                      @click="addTreatmentRecord(scope.row.id)"
                    >回答此问题</span>
                  </template>
                </el-table-column>
              </el-table>

              <!-- <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.length"
              ></el-pagination>-->
            </div>
          </div>
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
  data() {
    return {
      showStatus: global_.showStatusDoc,
      userName: "xxx",
      userid: "",
      search: "",
      tableData: [],
      qusTableData: [],
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
      treatmentForm: {
        docid: global_.userid,
        treatments: "",
        consId: global_.consid
      },
      findFriendsForm: {
        userAccount: "",
        userid: global_.userid
      }
    };
  },
  methods: {
    searchItem() {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    indexAdd(index) {
      return index + 1;
    },
    handleSelect(key) {
      console.log(key);
      this.activeIndex = key;
    },
    showChat() {
      global_.showStatusDoc.Chat = true;
      global_.showStatusDoc.lookData = false;
      global_.showStatusDoc.addTreatment = false;
      global_.showStatusDoc.findFriends = false;
      global_.showStatusDoc.qusData = false;
      global_.showStatus.text = false;
    },
    findFriendsShow() {
      global_.showStatusDoc.findFriends = true;
      global_.showStatusDoc.Chat = false;
      global_.showStatusDoc.lookData = false;
      global_.showStatusDoc.addTreatment = false;
      global_.showStatusDoc.qusData = false;
      global_.showStatus.text = false;
    },
    lookHistoryShow() {
      global_.showStatusDoc.lookData = true;
      global_.showStatusDoc.findFriends = false;
      global_.showStatusDoc.Chat = false;
      global_.showStatusDoc.addTreatment = false;
      global_.showStatusDoc.qusData = false;
      global_.showStatus.text = false;

      this.axios
        .post("http://localhost:80/api/system/readHistory")
        .then(res => {
          this.tableData = res.data;
        })
        .catch(res => {
          console.log(res);
        });
    },
    addTreatmentsShow() {
      global_.showStatusDoc.qusData = true;
      global_.showStatusDoc.lookData = false;
      global_.showStatusDoc.findFriends = false;
      global_.showStatusDoc.Chat = false;
      global_.showStatusDoc.addTreatment = false;
      global_.showStatus.text = false;

      this.axios
        .post("http://localhost:80/api/system/lookQuestion")
        .then(res => {
          this.qusTableData = res.data;
        })
        .catch(res => {
          console.log(res);
        });
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
    submittreatmentForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.treatmentForm.consId = global_.consid;
          this.treatmentForm.docid = global_.userid;
          console.log();
          this.axios
            .post(
              "http://localhost:80/api/system/addTreatment",
              qs.stringify(this.treatmentForm)
            )
            .then(res => {
              if (res.data.status + "" == "true") {
                alert("提交成功");

                this.lookHistoryShow();
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
    resettreatmentForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitfindFriendsForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios
            .post("http://localhost:80/api/system/findPatient", {
              userAccount: this.findFriendsForm.userAccount
            })
            .then(res => {
              //console.log(res.data);
              if (res.data != "") {
                alert("此用户存在" + res.data);
              } else {
                alert("此用户不存在");
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
                this.getFriends();
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
    addTreatmentRecord(id) {
      console.log(id);
      global_.showStatusDoc.qusData = false;
      global_.showStatusDoc.lookData = false;
      global_.showStatusDoc.findFriends = false;
      global_.showStatusDoc.Chat = false;
      global_.showStatusDoc.addTreatment = true;
      global_.showStatus.text = false;
      global_.consid = id;
    },
    getUserInfo() {
      this.axios
        .post("http://localhost:80/api/system/getUserInfo")
        .then(res => {
          //  console.log(res.data.username); //获取属性的正确写法
          this.userName = res.data.username;
          this.userid = res.data.docid;
          global_.userid = res.data.docid;
          //  console.log(this.userName);
        })
        .catch(res => {
          console.log(res);
        });
    },
    readHistory() {
      this.axios
        .post("http://localhost:80/api/system/readHistory")
        .then(res => {
          this.tableData = res.data;
          //console.log(res.data.username); //获取属性的正确写法
          // this.userName = res.data.username;
          // console.log(this.userName);
        })
        .catch(res => {
          console.log(res);
        });
    },
    getFriends() {
      this.axios
        .post("http://localhost:80/api/system/getFriends")
        .then(res => {
          this.navData = res.data;
        })
        .catch(res => {
          console.log(res);
        });
    },
    seeMyAnswer(index) {
      this.axios
        .post("http://localhost:80/api/system/getMyTreatment", {
          consId: index
        })
        .then(res => {
          global_.showStatus.text = true;
          //  this.Readtextarea=res.data.treatments;
          alert(res.data.treatments);
        })
        .catch(res => {
          console.log(res);
        });
    }
  },
  mounted: function() {
    this.getUserInfo();

    this.getFriends();
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