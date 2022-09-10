window.addEventListener("load", () => {
  const menus = document.getElementById("menus");
  const text = document.getElementById("text");
  // 注册指定元素菜单事件
  text.addEventListener("contextmenu", (e) => {
    // 禁用默认菜单显示（contextmenu事件是冒泡的，所以要禁用默认行为）
    e.preventDefault();
    let left = e.clientX + "px";
    let top = e.clientY + "px";
    menus.style.cssText = `left:${left};top:${top};visibility:visible;`;
  });
  // 隐藏菜单项
  window.addEventListener("click", () => {
    menus.style.cssText = "visibility:hiddle";
  });
  // 利用事件委托获取点击的菜单项
  menus.addEventListener("click", (e) => {
    console.log(e.target.innerHTML);
  });

  // 注册浏览器的全局的上下文菜单
  // document.documentElement.addEventListener("contextmenu",(e)=>{
  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    let left = e.clientX + "px";
    let top = e.clientY + "px";
    menus.style.cssText = `left:${left};top:${top};visibility:visible;`;
  });
});
