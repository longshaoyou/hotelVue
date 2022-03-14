<template>
  <div>
    <el-container>
      <el-aside width="200px"><Menu /></el-aside>
      <el-container>
        <el-header height="40px"><HeaderArea /></el-header>
        <!-- <el-main><RoomInquire /></el-main> -->
        <!-- <el-main><ResidentInfo /></el-main> -->
        <!-- <el-main><RoomManage /></el-main> -->
        <!-- <el-main><StaffManagement /></el-main> -->
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
    <transition name="el-fade-in"> <SubmitBox v-if="$store.state.isOpenSubmit.state" />`` </transition>
  </div>
</template>

<script>
import SubmitBox from "/src/components/SubmitBox";
import HeaderArea from "/src/components/HeaderArea";
import Menu from "/src/components/Menu";
export default {
  name: "BackstageApp",
  components: {
    SubmitBox,
    HeaderArea,
    Menu,
  },
};
</script>

<style scoped>
.el-header {
  line-height: 30px;
  display: flex;
  justify-content: end;
  /* border-bottom: 1px solid black; */
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04); */
  border-bottom: 1px solid #d9e3ea;
  background: rgba(218, 227, 234, 0.24);
}
</style>
