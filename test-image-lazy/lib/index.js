class ImgLoad {
  constructor(doms, options, callback) {
    this.doms = doms;
    this.options = options;
    this.callback = callback;
  }
  lazyLoad() {
    let observer = this.createObserve();
    if (this.options.lazy) {
      this.doms.forEach((dom) => {
        observer.observe(dom);
      });
    } else {
      this.doms.forEach(this.loadImage, this);
    }
  }
  createObserve() {
    const { root = null, rootMargin = "0px" } = this.options;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((item) => {
          if (item.isIntersecting) {
            observer.unobserve(item.target);
            this.loadImage(item.target);
          }
        });
      },
      {
        root,
        rootMargin,
      }
    );
    return observer;
  }
  loadImage(dom) {
    const image = new Image();
    image.src = dom.dataset.src;
    image.addEventListener("load", (e) => {
      this.onload(dom, image.src);
    });
    image.addEventListener("error", (e) => {
      this.onerror(e);
    });
  }
  onload(img, src) {
    img.src = src;
    this.callback?.(true);
  }
  onerror(e) {
    this.callback?.(false);
  }
}

export default ImgLoad;
export { ImgLoad };
