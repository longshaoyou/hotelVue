import Vue from 'vue'
import Vuex from 'vuex'
import {
  updateRoomState,
  updateResidentInfo,
  updateStaff
} from '../api'
Vue.use(Vuex)

export default new Vuex.Store({
  state() {
    return {
      roomStateList: [],
      isOpenSubmit: {
        state: false,
        roomId: ''
      },
      ResidentInfoList: [],
      staffList: [],

    }
  },
  mutations: {
    changeRoomStateList(state, value) {
      state.roomStateList[value.index] = value.state
    },
    openSubmit(state, value) {
      state.isOpenSubmit.state = true;
      state.isOpenSubmit.roomId = value;
    },
    closeSubmit(state) {
      state.isOpenSubmit.state = false;
      state.isOpenSubmit.roomId = '';
    },
    updateRoomStateList(state, value) {
      state.roomStateList = value;
    },
    updateResidentInfoList(state, value) {
      state.ResidentInfoList = value;
    },
    updateStaffList(state, value) {
      state.staffList = value;
    }

  },
  actions: {
    async updateRoomStateList(context, token, times = 0) {
      //更新房间信息
      let roomStateList = null;
      try {
        roomStateList = await updateRoomState(token);
      } catch (err) {
        return err.message
      }
      if (roomStateList.status !== 200 || roomStateList.data.code !== 200) {
        //显示错误信息
        return roomStateList.data.data.msg
      }
      // const roomStateList = await updateRoomStateList('abc');
      //commit 修改
      context.commit('updateRoomStateList', roomStateList.data.data)
      return 'ok'
      // return roomStateList;
    },
    async updateResidentInfoList(context, token) {
      //更新房间信息
      const ResidentInfoList = await updateResidentInfo(token);
      if (ResidentInfoList.status !== 200 || ResidentInfoList.data.code !== 200) {
        //显示错误信息
        return ResidentInfoList.data.data.msg
      }
      // const roomStateList = await updateRoomStateList('abc');
      //commit 修改
      context.commit('updateResidentInfoList', ResidentInfoList.data.data)
      return 'ok'
      // return roomStateList;
    },
    async updateStaffList(context, token) {
      //更新房间信息
      const staffList = await updateStaff(token);
      if (staffList.status !== 200 || staffList.data.code !== 200) {
        //显示错误信息
        return staffList.data.data.msg
      }
      //commit 修改
      context.commit('updateStaffList', staffList.data.data)
      return 'ok'
    }
  },
  modules: {}
})