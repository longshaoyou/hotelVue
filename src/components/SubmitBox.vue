<template>
  <div class="box">
    <div class="submitDiv">
      <span class="submitTitel">住户信息登记</span>
      <el-form :inline="true" label-position="left" :model="formInline" class="demo-form-inline" label-width="80px" :rules="rules" ref="ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formInline.name" placeholder="姓名" :rules="[{ required: true, message: '姓名不能为空' }]"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="id">
          <el-input v-model="formInline.id" placeholder="身份证" :show-word-limit="true"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formInline.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="formInline.sex" label="男">男</el-radio>
          <el-radio v-model="formInline.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="房间号">
          <el-select v-model="formInline.room" placeholder="请选择">
            <el-option v-for="item in selectRoom" :key="item.id" :label="item.id" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="liveTime">
          <el-date-picker v-model="formInline.liveTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="[getNow(), '12:00:00']"> </el-date-picker>
        </el-form-item>
        <el-form-item class="btnDiv">
          <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div @click="close" class="bg"></div>
  </div>
</template>

<script>
import { checkIn, updateRoomState } from "../api";
export default {
  data() {
    return {
      formInline: {
        name: "",
        phone: "",
        id: "",
        sex: "",
        room: this.$store.state.isOpenSubmit.roomId,
        liveTime: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { type: "string", message: "身份证必须为文字" },
        ],
        id: [
          { required: true, message: "请输入身份证", trigger: "blur" },
          { len: 18, message: "请输入18位身份证", trigger: "blur" },
          {
            validator(rule, value, callback, source, options) {
              if ((source.id | 0) === 0) {
                callback("身份证必须为数字切长度必须为18");
              }
              callback();
            },
          },
        ],
        phone: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { len: 11, message: "请输入11位电话", trigger: "blur" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        liveTime: [{ required: true, message: "请选择日期", trigger: "blur" }],
      },
    };
  },
  mounted() {
    // this.formInline.room = selectRoom[0];
  },
  computed: {
    selectRoom() {
      return this.$store.state.roomStateList.filter((v) => v.state);
    },
  },
  mounted() {},
  methods: {
    close() {
      this.$store.commit("closeSubmit");
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //校验成功
          // alert("submit!");
          // this.$store.commit("roomCheckIn", this.formInline.room);
          let result = await checkIn(
            { token: window.localStorage.token, resident: this.formInline },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          // console.log(result);
          if (!this.checkAxios(result)) return;
          this.$store.commit("closeSubmit");
          this.$message({
            type: "success",
            message: "入住成功!",
          });
          this.updateRoomStateList();
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    getNow() {
      const now = new Date();
      return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    },
    async updateRoomStateList(times = 0) {
      let roomStateList = await updateRoomState(window.localStorage.token);
      if (!this.checkAxios(roomStateList)) {
        if (times === 3) {
          this.$message.error("重连失败");
        } else {
          setTimeout(() => {
            this.updateRoomStateList(times + 1);
          }, 3000);
        }
        return;
      }
      this.$store.commit("updateRoomStateList", roomStateList.data.data);
      this.$message({
        message: "获取成功",
        type: "success",
      });
    },
  },
};
</script>

<style scoped>
.bg {
  z-index: 1600;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
}
/* .box {
  width: 100%;
  height: 100%;
} */
.submitDiv {
  z-index: 1601;
  position: fixed;
  left: 50%;
  top: 50%;
  width: 30vw;
  min-width: 430px;
  height: 60vh;
  background: white;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  border: 1px solid #ebebeb;
}
.el-select-dropdown {
  z-index: 2008;
}
.el-form {
  display: grid;
}
.submitTitel {
  font-size: 20px;
  margin-bottom: 20px;
}
.btnDiv {
  display: flex;
  justify-content: center;
}
</style>
