<template>
  <div>
    {{ name }}
    <!-- abc -->
    <el-tooltip class="item" effect="dark" content="退出" placement="a">
      <el-button type="text" @click="open"
        ><i class="el-icon-switch-button"></i
      ></el-button>
    </el-tooltip>
    <!-- <router-link class="MenuData" to="/login"><i class="el-icon-switch-button"></i></router-link> -->
  </div>
</template>

<script>
export default {
  name: "HeaderArea",
  data() {
    return {};
  },
  computed: {
    name() {
      return window.localStorage.name || "";
    },
  },
  methods: {
    open() {
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.localStorage.clear();
          this.$router.replace({ path: "/login" });
          this.$message({
            type: "success",
            message: "退出成功!",
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.el-icon-user,
.el-button {
  width: 30px;
  font-size: 20px;
}
</style>
