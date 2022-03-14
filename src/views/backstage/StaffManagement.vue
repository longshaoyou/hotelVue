<template>
  <div>
    <el-table
      ref="filterTable"
      :data="$store.state.staffList"
      style="width: 100%"
      height="90vh"
      :highlight-current-row="true"
    >
      <el-table-column
        prop="id"
        label="员工号"
        sortable
        width="200"
        column-key="id"
      ></el-table-column>
      <el-table-column prop="name" label="姓名" width="200" column-key="name">
      </el-table-column>
      <el-table-column
        prop="personalId"
        label="身份证"
        sortable
        width="200"
        column-key="personalId"
      ></el-table-column>
      <el-table-column prop="sex" label="性别" min-width="100" column-key="sex">
      </el-table-column>
      <el-table-column
        prop="jobName"
        label="工作职位"
        width="200"
        column-key="jobName"
      ></el-table-column>
      <el-table-column width="250" header-align="center">
        <template slot-scope="scope">
          <el-button @click="checkStaffInfo(scope.row.id)" type="primary"
            >修改信息</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改信息" :visible.sync="dialogTableVisible">
      <el-form
        :inline="true"
        label-position="left"
        :model="dialogData"
        class="demo-form-inline"
        label-width="80px"
        ref="ruleForm"
      >
        <el-form-item label="员工号" prop="id">
          <el-input v-model="dialogData.id" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dialogData.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="personalId">
          <el-input
            v-model="dialogData.personalId"
            placeholder="身份证"
            :show-word-limit="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="dialogData.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item
          v-if="dialogData.wage !== undefined"
          label="工资"
          prop="wage"
        >
          <el-input v-model="dialogData.wage" placeholder="工资"></el-input>
        </el-form-item>
        <el-form-item label="权限等级" prop="level">
          <el-input v-model="dialogData.level" placeholder="权限"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="jobName">
          <el-input v-model="dialogData.jobName" placeholder="职位"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="dialogData.sex" label="男">男</el-radio>
          <el-radio v-model="dialogData.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item class="btnDiv">
          <el-button type="primary" @click="submitForm">确认</el-button>
          <el-button @click="close">取消</el-button>
          <el-popconfirm title="确认注销此人？" @confirm="resign">
            <el-button class="resignBtn" slot="reference" type="danger"
              >注销</el-button
            >
          </el-popconfirm>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { updateStaff, getStaffInfo, setStaffInfo } from "../../api";
export default {
  name: "StaffManagement",
  data() {
    return {
      dialogTableVisible: false,
      dialogData: {
        id: "",
        name: "",
        personalId: "",
        sex: "",
        phone: "",
        level: "",
        jobName: "",
      },
    };
  },
  methods: {
    async checkStaffInfo(id) {
      // 发包判断权限,并且获取data
      let staffInfo = await getStaffInfo({
        token: window.localStorage.token,
        id,
      });
      if (!this.checkAxios(staffInfo)) return;
      this.dialogData = staffInfo.data.data;
      this.dialogTableVisible = true;
    },
    close() {
      this.dialogTableVisible = false;
      this.dialogData = {
        id: "",
        name: "",
        personalId: "",
        sex: "",
        phone: "",
        level: "",
        jobName: "",
      };
    },
    async submitForm() {
      const setResult = await setStaffInfo(
        { token: window.localStorage.token, data: this.dialogData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!this.checkAxios(setResult)) return;
      this.$message({
        message: "成功修改",
        type: "success",
      });
      this.dialogTableVisible = false;
      this.dialogData = {
        id: "",
        name: "",
        personalId: "",
        sex: "",
        phone: "",
        level: "",
        jobName: "",
      };
    },
    async resign() {
      this.$message({
        message: "成功辞职",
        type: "success",
      });
      this.dialogTableVisible = false;
      this.dialogData = {
        id: "",
        name: "",
        personalId: "",
        sex: "",
        phone: "",
        level: "",
        jobName: "",
      };
    },
    async updateStaffInfo() {
      let staffData = await updateStaff(window.localStorage.token);
      if (!this.checkAxios(staffData)) return;
      this.$store.commit("updateStaffList", staffData.data.data);
      this.$message({
        message: "获取成功",
        type: "success",
      });
    },
  },
  created() {
    this.updateRoomStateList();
    // 5分钟更新一次数据
    this.timer = esetInterval(() => this.updateRoomStateList(), 300000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.btnDiv {
  width: 100%;
  display: flex;
  justify-content: center;
}
.resignBtn {
  margin-left: 10px;
}
</style>
