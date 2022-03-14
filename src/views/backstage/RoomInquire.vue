<template>
  <div>
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
        :filters="roomIdfilters"
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
        width="200"
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
            v-if="scope.row.state"
            @click="checkIn(scope.row.id)"
            type="success"
            >入住</el-button
          >
          <el-button v-else @click="checkOut(scope.row.id)" type="danger"
            >退房</el-button
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
    <SideInfo />
    <!-- <div class="bg"></div> -->
  </div>
</template>

<script>
import SideInfo from "/src/components/SideInfo";
import { updateRoomState, checkOut as checkOutReq } from "../../api";
export default {
  name: "RoomInquire",
  data() {
    return { page: 1 };
  },
  methods: {
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
    checkOut(roomId) {
      this.$confirm("是否退房", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // this.$store.commit("roomCheckOut", roomId);
          const result = await checkOutReq({
            token: window.localStorage.token,
            id: roomId,
          });
          if (!this.checkAxios(result)) return;
          this.updateRoomStateList();
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
  },
  components: {
    SideInfo,
  },
  computed: {
    roomIdfilters() {
      let arr = [],
        floorSet = new Set();
      this.$store.state.roomStateList.forEach((v) => {
        floorSet.add(v.id.substring(0, v.id.length - 2));
      });
      floorSet.forEach((v) => {
        arr.push({ text: v + "楼", value: v.toString() });
      });
      return arr;
    },
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
