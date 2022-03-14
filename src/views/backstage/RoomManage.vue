<template>
  <div>
    <el-table
      ref="roomManageTable"
      :data="manageData"
      style="width: 100%"
      height="80vh"
      :highlight-current-row="true"
      @selection-change="handleCurrentChange"
    >
      <el-table-column type="selection" width="55" show-overflow-tooltip>
      </el-table-column>
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
      <el-table-column width="250" header-align="left">
        <template slot="header">
          <el-button @click="openBox()" type="primary">批量修改信息</el-button>
        </template>
        <template slot-scope="scope">
          <el-button @click="openBox(scope.row)" type="primary"
            >修改信息</el-button
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
    <el-dialog title="修改房间信息" :visible.sync="dialogTableVisible">
      <el-form ref="form" :model="dialogData" label-width="80px" :rules="rules">
        <el-form-item label="房间类型" prop="type">
          <el-select
            class="change"
            v-model="dialogData.type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roomTypeList"
              :key="item.no"
              :label="item.value"
              :value="item.value"
            >
            </el-option> </el-select
        ></el-form-item>
        <el-form-item label="房间价格" prop="price">
          <el-input placeholder="价格" v-model.number="dialogData.price">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeRoomInfo">确认修改</el-button>
          <el-button @click="closeBox">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import SideInfo from "/src/components/SideInfo";
import { updateRoomState } from "../../api";
export default {
  name: "RoomMange",
  data() {
    return {
      currentRow: [],
      dialogTableVisible: false,
      roomTypeList: [
        { no: 0, value: "单人间" },
        { no: 1, value: "双人间" },
      ],
      dialogData: {
        type: "",
        price: "",
      },
      form: {},
      page: 1,
      rules: {
        type: [
          { required: true, message: "请选择房间类型", trigger: "change" },
        ],
        price: [
          { required: true, message: "请输入房间价格", trigger: "blur" },
          { type: "number", message: "请输入数字" },
        ],
      },
    };
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
    openBox(room) {
      if (room) {
        this.currentRow = [room];
        this.dialogTableVisible = !this.dialogTableVisible;
      } else {
        if (this.currentRow.length) {
          this.dialogTableVisible = true;
        } else {
          this.$message.error("你没有勾选");
        }
      }
    },
    changeRoomInfo() {
      // console.log(this.dialogData, this.currentRow);
      this.$refs.form.validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    closeBox() {
      this.dialogData = {
        type: "",
        price: "",
      };
      this.dialogTableVisible = false;
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
  computed: {
    manageData() {
      return this.$store.state.roomStateList.filter(
        (v, i) => i - this.page * 10 <= 0 && i - this.page * 10 > -10
      );
    },
  },
  components: {
    SideInfo,
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
.change {
  width: 100%;
}
</style>
