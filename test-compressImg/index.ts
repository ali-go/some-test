// 对图片进行尺寸压缩处理：

const originBox = document.querySelector("#old-box");
const newBox = document.querySelector("#new-box");
// 上传事件
const handleChangeFile = async (e) => {
  let file = e.target.files[0];
  // console.log(file, "原始file对象");
  const img = await readImg(file);
  // 页面插入原img
  showOriginImg(img);
  // console.log([img], "img标签对象");
  const result = await compressImg(img, "image/jpg", 500, 500, 1);
  // console.log(result, "最终压缩图片blob对象");
  // 页面插入压缩后img
  showPressImg(result);
};

// 注册上传事件
let uploadDom = document.querySelector("#upload-input");
uploadDom?.addEventListener("change", handleChangeFile);

// 获取img对象
const readImg = (file: File) => {
  return new Promise((resolve: (HTMLImageElement) => void, reject) => {
    const img = new Image();
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      img.src = e.target.result;
    };
    fileReader.onerror = (e) => {
      reject(e);
    };
    fileReader.readAsDataURL(file);

    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      reject(e);
    };
  });
};

// 设置图片文件的类型
type imageType = "image/png" | "image/jpg";
// 获取压缩后的文件
/**
 *
 * @param img 原图
 * @param type 转换的图片类型
 * @param mw 最大宽度
 * @param mh 最大高度
 * @param quality 质量度0-1之间
 * @returns
 */
const compressImg = (img: any, type: imageType = "image/png", mw: number, mh: number, quality: number = 1) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    // 原始图尺寸
    const { width: originWidth, height: originHeight } = img;

    // 最大尺寸
    let maxWidth = mw;
    let maxHeight = mh;

    // 实际目标尺寸（默认先赋值原图尺寸）
    let targetWidth = originWidth;
    let targetHeight = originHeight;

    // 最大尺寸小于原图则压缩，否则不压缩
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth > originHeight) {
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
      } else {
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
      }
    }

    // canvas绘制图像并转成blob
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx?.clearRect(0, 0, targetWidth, targetHeight);
    ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      type,
      quality
    );
  });
};

// 展示原图
const showOriginImg = (element) => {
  originBox?.appendChild(element);
};
// 展示压缩图
const showPressImg = async (blob) => {
  const element = await readImg(blob);
  newBox?.appendChild(element);
};
