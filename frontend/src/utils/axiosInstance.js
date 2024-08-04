import axios from "axios";
import store from "../redux/store";
import {
  clearToken,
  refreshAccessTokenAsync,
  setToken,
} from "../redux/slices/authSlice";

const API_LINK = import.meta.env.VITE_API_URL;

//axios 기본 베이스 설정
const axiosInstance = axios.create({
  baseURL: API_LINK,
});

//인터셉터 설정(요청)
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const { accessToken } = state.auth;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // accesstoken 이 없으면 거절
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  //응답이 있으면 응답을 보내고.
  (response) => {
    return response;
  },
  //에러가 발생하면.
  async (error) => {
    const originalRequest = error.config;
    const state = store.getState();

    //권한 없음 & 재시도 상황이 아니라면
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      //리프레시 토큰이 있고, 대기(로딩)중이면

        //재발급
        try {
            //axios 요청
            const response = await axios.post(`${API_LINK}/auth/refresh`, {}, { withCredentials: true });
            const newAccessToken = response.data.data.accessToken;
            store.dispatch(setToken({ accessToken: newAccessToken, refreshToken: state.auth.refreshToken }));
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
          store.dispatch(clearToken());
          return Promise.reject(refreshError);
        }
      }
    }
);

export default axiosInstance;
