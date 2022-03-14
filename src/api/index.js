import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.interceptors.response.use(
    response => {
        return Promise.resolve(response);
    },
    // 服务器状态码不是2开头的的情况
    error => {
        return Promise.resolve({
            data: {
                code: 0,
                msg: error.message
            }
        });
    }
);
export const login = (data, config) => axios.post('/api/login', data, config);


export const updateRoomState = (token) => axios.get('/api/get/roomStateList?token=' + token);

export const updateResidentInfo = (token) => axios.get('/api/get/residentInfoList?token=' + token);

export const updateStaff = (token) => axios.get('/api/get/staffList?token=' + token);

export const getRoomInfo = (data, config) => axios.post('/api/get/roomInfo', data, config);

export const getStaffInfo = (data, config) => axios.post('/api/get/staffInfo', data, config);
// '/api/set/staffInfo'
export const setStaffInfo = (data, config) => axios.post('/api/set/staffInfo', data, config);
export const checkIn = (data, config) => axios.post('/api/set/checkIn', data, config);
export const checkOut = (data, config) => axios.post('/api/set/checkOut', data, config);