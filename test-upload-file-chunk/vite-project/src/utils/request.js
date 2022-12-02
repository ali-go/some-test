import axios from "axios";

const baseURL = "http://localhost:3001";

// 上传接口
export const uploadFile = (url, formData, onUploadProgress = () => {}) => {
  console.log(url, formData);
  return axios({
    method: "post",
    url,
    baseURL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
    onUploadProgress,
  });
};
// 合并接口
export const mergeChunks = (url, data) => {
  return axios({
    method: "post",
    url,
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
};
