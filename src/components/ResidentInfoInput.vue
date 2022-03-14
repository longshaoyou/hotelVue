<template>
  <div style="margin-top: 15px">
    <el-input
      placeholder="请输入搜索内容"
      v-model="inputText"
      class="input-with-select"
      @keyup.enter.native="findInfo"
      :clearable="true"
    >
      <el-select
        class="change"
        v-model="select"
        slot="prepend"
        placeholder="请选择"
      >
        <el-option label="房间号" value="1"></el-option>
        <el-option label="姓名" value="2"></el-option>
        <el-option label="身份证" value="3"></el-option>
      </el-select>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="findInfo"
      ></el-button>
    </el-input>
    <el-dialog title="住户信息" :visible.sync="dialogTableVisible">
      <el-descriptions
        v-for="info in infoList"
        :key="info.roomId"
        :title="'房间号：' + info.roomId"
        :column="1"
      >
        <el-descriptions-item label="姓名">{{
          info.resident.name
        }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{
          info.resident.phone
        }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{
          info.resident.sex
        }}</el-descriptions-item>
        <el-descriptions-item label="身份证">{{
          info.resident.id
        }}</el-descriptions-item>
        <hr />
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { getRoomInfo } from "../api";
export default {
  name: "ResidentInfoInput",
  data() {
    return {
      select: "1",
      inputText: "",
      dialogTableVisible: false,
      infoList: [],
    };
  },
  methods: {
    async findInfo() {
      let InfoList = [];
      if (this.select === "1")
        InfoList = (
          await getRoomInfo({
            roomId: this.inputText,
            token: window.localStorage.token,
          })
        ).data;
      else if (this.select === "2")
        InfoList = (
          await getRoomInfo({
            name: this.inputText,
            token: window.localStorage.token,
          })
        ).data;
      else if (this.select === "3")
        InfoList = (
          await getRoomInfo({
            id: this.inputText,
            token: window.localStorage.token,
          })
        ).data;
      if (InfoList.data.length) {
        this.dialogTableVisible = true;
        this.infoList = InfoList.data;
      } else {
        this.$message.error("未找到信息");
      }

      // console.log(InfoList);
    },
  },
};
</script>
<style scoped>
.change {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-descriptions {
  width: 90%;
  margin: auto;
  padding: 10px;
  /* border: 1px solid #ebeef5; */
  margin-bottom: 10px;
}
</style>
