<template>
  <div>
    <input type="file" @change="handleChange" />
    <div>
      <div v-for="(item, index) in fileChunkList" :key="item.name">
        <span>第{{ index + 1 }}个文件。</span>
        <span>当前进度：{{ item.percentage || 0 }}%</span>
      </div>
    </div>
    <div>总文件上传进度：{{ totalPercentage }}%</div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SparkMd5 from "spark-md5";
import { uploadFile, mergeChunks } from "./utils/request.js";

let currFile = ref(null);
const DefualtChunkSize = 5 * 1024 * 1024;

// 切片集合
let fileChunkList = ref([]);

// 获取文件
const handleChange = (e) => {
  console.log(e);
  currFile.value = e.target.files[0];
  fileChunkList.value = [];
  getFileChunk(currFile.value).then((res) => {
    console.log("res", res);
    console.log("fileChunkList", fileChunkList.value);
    console.log("currFile", currFile.value);
    uploadChunks(res);
  });
};

// 获取分片
const getFileChunk = (file, chunkSize = DefualtChunkSize) => {
  return new Promise((resolve, reject) => {
    // 兼容获取slice方法
    let blobSlice =
      File.prototype.slice ||
      File.prototype.mozSlice ||
      File.prototype.webkitSlice;
    // 获取切片数量
    let chunks = Math.ceil(file.size / chunkSize);
    // 设置当前切片位置
    let currentChunk = 0;
    // 获取spark，处理文件hash值
    const spark = new SparkMd5.ArrayBuffer();

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(`当前加载到第${currentChunk}个切片`);
      currentChunk++;
      const chunk = e.target.result;
      spark.append(chunk);
      if (currentChunk < chunks) {
        loadNext();
      } else {
        let fileHash = spark.end();
        console.log("切片读取完成");
        resolve({ fileHash });
      }
    };
    // 加载切片
    function loadNext() {
      // 获取首尾文件切片位置
      let start = currentChunk * chunkSize;
      let end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      console.log(start, end);
      let chunk = blobSlice.call(file, start, end);
      fileChunkList.value.push({
        chunk,
        size: chunk.size,
        name: currFile.value.name,
      });
      fileReader.readAsArrayBuffer(chunk);
    }
    loadNext();
  });
};

// 上传文件
const uploadChunks = ({ fileHash }) => {
  console.log("fileHash", fileHash);
  const requests = fileChunkList.value.map((item, index) => {
    const formData = new FormData();
    formData.append("filename", currFile.value.name);
    formData.append(`${currFile.value.name}-${fileHash}-${index}`, item.chunk);
    formData.append("hash", `${fileHash}-${index}`);
    formData.append("fileHash", fileHash);
    return uploadFile("/upload", formData, onUploadProgress(item));
  });
  Promise.all(requests).then((res) => {
    mergeChunks("/mergeChunks", {
      size: DefualtChunkSize,
      filename: currFile.value.name,
    });
  });
};

// 分块进度条
const onUploadProgress = (item) => (e) => {
  console.log(e, e.loaded, e.total);
  item.percentage = parseInt(String((e.loaded / e.total) * 100));
};
// 总进度条
const totalPercentage = computed(() => {
  if (!fileChunkList.value.length) return 0;
  const loaded = fileChunkList.value
    .map((item) => item.size * item.percentage || 0)
    .reduce((pre, cur) => {
      return pre + cur;
    }, 0);
  return parseInt((loaded / currFile.value.size).toFixed(2));
});
</script>

<style lang="scss" scoped></style>
