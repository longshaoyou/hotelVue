<template>
  <div class="sideInfo" ref="sideInfo" :class="{ fold: isFold }">
    <button>
      <i @click="isFold = !isFold" v-if="isFold" class="el-icon-arrow-left"></i>
      <i @click="isFold = !isFold" v-else class="el-icon-arrow-right"></i>
    </button>
    <el-descriptions direction="margin-top" :column="1" border>
      <el-descriptions-item label="空房">{{ emptyRoom }}间</el-descriptions-item>
      <el-descriptions-item label="已入住">{{ livingRoom }}间</el-descriptions-item>
      <el-descriptions-item label="总房间数">{{ allRoom }}间</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
export default {
  name: "SideInfo",
  data() {
    return {
      isFold: false,
    };
  },
  computed: {
    emptyRoom() {
      let empty = 0;
      this.$store.state.roomStateList.forEach((e) => {
        if (e.state) empty++;
      });
      return empty;
    },
    livingRoom() {
      let living = 0;
      this.$store.state.roomStateList.forEach((e) => {
        if (!e.state) living++;
      });
      return living;
    },
    allRoom() {
      return this.$store.state.roomStateList.length;
    },
  },
  mounted() {},
};
</script>

<style scoped>
.sideInfo {
  width: 10vw;
  position: fixed;
  right: 0;
  top: 40%;
  display: flex;
  justify-content: end;
  align-items: center;
  transition: 1s ease;
}
.fold {
  transform: translateX(9vw);
}
button {
  border: 0;
  height: 20px;
  width: 1vw;
  font-size: 20px;
}
.el-descriptions {
  width: 9vw;
  margin: 0;
  padding: 0;
}
</style>
