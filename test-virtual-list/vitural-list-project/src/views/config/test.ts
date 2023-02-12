type objType = {
  id: number;
  value: number;
  height?: number;
};

// 测试造数据
export const handleData = (n: number, flag?: boolean): objType[] => {
  let arr = [];
  for (let i = 0; i < n; i++) {
    let obj: objType = {
      id: i,
      value: i,
    };
		// height为测试的定义dom元素的高度的属性
    if (flag) {
      obj.height = 20 + Math.random() * 50;
    }
    arr.push(obj);
  }
  return arr;
};
