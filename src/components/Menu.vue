<template>
  <el-row class="tac">
    <el-col :span="12">
      <el-menu default-active="2" class="el-menu-vertical-demo" :router="true">
        <img class="logoSvg" src="../../public/favicon.svg" alt="logo" />
        <img class="logoWord" src="../../public/logo.png" alt="logo文字" srcset="" />
        <el-menu-item v-for="data of MenuList" :key="data.path" :index="data.path">
          <router-link class="MenuData" :to="data.path">{{ data.title }}</router-link>
          <!-- <span class="MenuData" slot="title">{{ data.title }}</span> -->
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
//    @open="handleOpen"
// @close="handleClose"
export default {
  name: "Menu",
  data() {
    return {
      MenuList: [
        {
          path: "/room/inquire",
          title: "房间信息查询",
        },
        {
          path: "/resident/inquire",
          title: "住户信息查询",
        },
        {
          path: "/room/manage",
          title: "房间信息管理",
        },
        {
          path: "/staff/manage",
          title: "内部人员管理",
        },
      ],
    };
  },
  mounted() {
    // console.log(MenuList);
  },
};
</script>

<style scoped>
.el-menu {
  width: 199px;
}
.el-menu {
  height: 100vh;
  text-align: center;
}
.MenuData {
  font-size: 20px;
  color: black;

  text-decoration: none;
}

.logoSvg {
  margin-top: 20px;
  width: 100px;
  margin-bottom: 30px;
}
.logoWord {
  width: 150px;
  margin-bottom: 30px;
}
* {
  font-weight: bold;
}
</style>
