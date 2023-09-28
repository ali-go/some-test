// 非常重要：src 是播多媒体文件的地址；srcObject 是实时流（类似直播的实时，不支持URL.createObjectURL转）
let mediaStreamTrack; // 媒体流
let mediaRecorder; // 录制流
let mediaRecorderBlobUrl; // 录制内容bloburl
const video = document.getElementById("video");
const text = document.getElementById("text");
const canvas = document.getElementById("canvas");
// const context = canvas.getContext("2d");

// 获取兼容的getUsersMedia
const getUserMedia = (constraints, success, error) => {
  if (navigator.mediaDevices.getUserMedia) {
    // 新版
    navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
  } else if (navigator.webkitGetUserMedia) {
    // webkit核心浏览器
    navigator.webkitGetUserMedia(constraints, success, error);
  } else if (navigator.mozGetUserMedia) {
    // firefox浏览器
    navigator.mozGetUserMedia(constraints, success, error);
  } else if (navigator.getUserMedia) {
    // 旧版
    navigator.getUserMedia(constraints, success, error);
  } else {
    alert("您的浏览器不支持访问用户媒体设备！");
  }
};
// 限制条件（配置）：注意，经测试发现pc端有效，移动端视频两边会有白边，即用的默认的分辨率尺寸，没有用此处设置的，暂时不知道如何解决。
const constraints = { video: { width: video.width, height: video.height }, audio: false };
// 成功时渲染到页面video上
const success = (stream) => {
  // mediaStreamTrack = stream;  // 暂时没用到，当然也可以根据媒体流的api获取媒体流各个指定的流信息，比如视频流和音频流等
  // 媒体流赋值给video的实时视频流，展示实时视频
  video.srcObject = stream;
  // 自动播放（也可以直接标签加autoplay）
  video.onloadeddata = () => video.play();
  // 设置当前网页支持的设备录制视频的MIME的type：判断是否支持vp9，支持就用，不支持就只用webm
  // MediaRecorder:录制媒体的构造器
  const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video=webm";
  // 实例化:根据媒体流，创建录制流.
  // 注意：MediaRecorder实例化参数stream可以是上面我们根据 navigator.mediaDevices.getUserMedia返回的，也可以是video、audio、canvas等元素
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: mime,
  });
  let chunks = []; //录制资源数组
  // 注册dataavailable事件：录制媒体资源
  mediaRecorder.addEventListener("dataavailable", (e) => {
    chunks.push(e.data);
  });
  // 监听录制结束：执行mediaRecorder.stop()时停止录制
  mediaRecorder.addEventListener("stop", () => {
    // 把blob对象数组根据指定格式转成一个blob文件
    let blob = new Blob(chunks, {
      type: chunks[0].type,
    });
    const compatiableURL = window.URL || window.webkitURL;
    mediaRecorderBlobUrl = compatiableURL.createObjectURL(blob);
    video.srcObject = null;
    video.src = mediaRecorderBlobUrl;
    video.onloadeddata = () => video.play();
  });
  // 必须手动启动录制：
  // 1.注意如果不传参指定时间间隔，则会在stop时才执行dataavailable回调，把录制的媒体数据对象传递过去，只有一个文件对象
  // 2.如果设置了时差，则指定时间间隔就会触发dataavailable时间，返回数据（经测试，此时的话如果video有controls时，按暂停依旧会返回，故应该监听暂停并手动暂停录制）
  // mediaRecorder.start(1000);
  mediaRecorder.start();
};
// 失败时
const error = (err) => {
  console.log("访问用户媒体设备失败", err);
};
// 处理录制文字标识
const showText = (label) => {
  text.innerText = label;
};
// 开始录制
const startRecorder = () => {
  if (mediaRecorder) return;
  getUserMedia(constraints, success, error);
  showText("录制中：");
};
// 暂停录制
const pauseRecoder = () => {
  mediaRecorder.pause();
  showText("暂停录制：");
};
// 停止录制
const stopRecorder = () => {
  if (!mediaRecorder) return;
  mediaRecorder.stop();
  mediaRecorder = null;
};
// 导出录屏
const exportRecorder = () => {
  if (mediaRecorderBlobUrl) {
    const a = document.createElement("a");
    a.download = "video.mp4";
    a.href = mediaRecorderBlobUrl;
    a.click();
  } else {
    alert("当前无录制视频!");
  }
};
// 监听暂停播放/暂停录屏
video.addEventListener("pause", () => {
  if (!mediaRecorder) {
    showText("回放暂停：");
    return;
  }
  pauseRecoder();
});
// 监听播放/继续录制
video.addEventListener("play", () => {
  if (!mediaRecorder) {
    showText("回放中：");
    return;
  }
  showText("录制中：");
  mediaRecorder.resume();
});
// 播放结束
video.addEventListener("ended", () => {
  showText("");
});

// 截取图片
const clipPhoto = () => {
  console.log("video", [video]);
  const { width, height } = video;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, width, height);
};

// 导出图片（不使用上面截图的canvas，不渲染）
const exportPhoto = () => {
  const canvasExp = document.createElement("canvas");
  const { width, height } = video;
  canvasExp.width = width;
  canvasExp.height = height;
  const ctx = canvasExp.getContext("2d");
  ctx.drawImage(video, 0, 0, width, height);
  const a = document.createElement("a");
  a.download = "截图";
  a.href = canvasExp.toDataURL("image/png");
  a.click();
};
