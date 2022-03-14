<template>
  <div>
    <ResidentInfoInput />
    <el-table
      ref="filterTable"
      :data="stateData"
      style="width: 100%"
      height="80vh"
      :highlight-current-row="true"
    >
      <el-table-column
        prop="id"
        label="房间号"
        sortable
        width="200"
        column-key="id"
        :filters="[
          { text: '1楼', value: '1' },
          { text: '2楼', value: '2' },
          { text: '3楼', value: '3' },
        ]"
        :filter-method="filterId"
      ></el-table-column>
      <el-table-column
        prop="type"
        label="房间类型"
        width="200"
        column-key="type"
        :filters="[
          { text: '单人房', value: '单人房' },
          { text: '双人房', value: '双人房' },
        ]"
        :filter-method="filtertype"
      >
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        sortable
        width="200"
        column-key="price"
      ></el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        min-width="100"
        :filters="[
          { text: '有人', value: false },
          { text: '空房', value: true },
        ]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.state ? 'success' : 'danger'"
            disable-transitions
            >{{ scope.row.state ? "空房" : "有人" }}</el-tag
          > </template
        >scope
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="left"
        label="入住时间"
        min-width="200"
        column-key="startTime"
        :formatter="startTimeFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="left"
        label="退房时间"
        min-width="200"
        column-key="endTime"
        :formatter="endTimeFormatter"
      >
      </el-table-column>
      <el-table-column width="250" header-align="center">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.state"
            @click="checkRoomInfo(scope.row.id)"
            type="primary"
            >查看住户具体信息</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="pager"
      :total="$store.state.roomStateList.length"
      :current-page.sync="page"
    >
    </el-pagination>
    <el-dialog
      v-if="dialogTableVisible"
      title="住户信息"
      :visible.sync="dialogTableVisible"
    >
      <el-descriptions
        v-for="roomInfo of roomInfos"
        :key="roomInfo.roomId"
        :title="'房间号：' + roomInfo.roomId"
        :column="1"
      >
        <el-descriptions-item label="姓名">{{
          roomInfo.resident.name
        }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{
          roomInfo.resident.phone
        }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{
          roomInfo.resident.sex
        }}</el-descriptions-item>
        <el-descriptions-item label="身份证">{{
          roomInfo.resident.id
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import ResidentInfoInput from "/src/components/ResidentInfoInput.vue";
import { getRoomInfo } from "../../api";
export default {
  name: "ResdentInfo",
  data() {
    return {
      roomInfo: {},
      dialogTableVisible: false,
      roomInfos: {},
      page: 1,
    };
  },
  components: {
    ResidentInfoInput,
  },
  methods: {
    async checkRoomInfo(roomId) {
      //更新房间信息
      const roomInfo = await getRoomInfo({
        roomId: roomId,
        token: window.localStorage.token,
      });
      //用于判断返回信息是否错误（错误会有弹窗提醒）
      if (!this.checkAxios(roomInfo)) return;
      this.dialogTableVisible = true;
      this.roomInfos = roomInfo.data.data;
    },
    filterTag(value, row) {
      return value === row.state;
    },
    //筛选房间类型
    filtertype(value, row) {
      return value === row.type;
    },
    filterId(value, row) {
      return row.id[0] === value;
    },
    checkIn(roomId) {
      this.$store.commit("openSubmit", roomId);
    },
    checkOut(roomId) {
      this.$confirm("是否退房", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.commit("roomCheckOut", roomId);
          this.$message({
            type: "success",
            message: "退房成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退房",
          });
        });
    },
    startTimeFormatter(row) {
      if (row.startTime) {
        const date = new Date(row.startTime);
        return (
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate()
        );
      }
      return undefined;
    },
    endTimeFormatter(row) {
      if (row.endTime) {
        const date = new Date(row.endTime);
        return (
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate()
        );
      }
      return undefined;
    },
    async updateRoomStateList(times = 0) {
      let updateState = await this.$store.dispatch(
        "updateRoomStateList",
        window.localStorage.token
      );
      // console.log(updateState);
      if (updateState === "ok") {
        this.$message({
          message: "获取成功",
          type: "success",
        });
      } else if (times === 3) {
        this.$message.error("重连失败");
      } else {
        setTimeout(() => {
          this.updateRoomStateList(times + 1);
        }, 5000);
        "Network Error" === updateState &&
          (updateState = "网络错误，5s后将重试");
        this.$message.error(updateState);
      }
    },
  },
  computed: {
    stateData() {
      return this.$store.state.roomStateList.filter(
        (v, i) => i - this.page * 10 <= 0 && i - this.page * 10 > -10
      );
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

<style></style>
