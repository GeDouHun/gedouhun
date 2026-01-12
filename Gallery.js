//通过js注入图鉴中网格项目的内容

/* 数据区 */
const galleryData = [
  {
    img: "img/1.jpg",				//图片引入路径
    imgClass: "cover-top hero-img", //给图片添加的类名
    title: "第一张图"				//图片的标题
  },
  {
    img: "img/2.jpg",
    imgClass: "dark-img",
    title: "第二张图"
  },
  {
    img: "img/3.jpg",
    imgClass: "zoom-img",
    title: "第三张图"
  }
];
const gallery = document.querySelector(".gallery");
gallery.innerHTML = "";
galleryData.forEach(item => {
  const box = document.createElement("div");
  box.className = "gallery-items";
	// 引入图片
  const img = document.createElement("img");
  img.src = item.img;
	// 给图片添加类名
  if (item.imgClass) {
    item.imgClass.split(" ").forEach(cls => {
      img.classList.add(cls);
    });
  }
	// 标题
  if (item.title) {
    const h3 = document.createElement("h3");
    h3.textContent = item.title;
    box.appendChild(h3);
  }
  box.appendChild(img);
  gallery.appendChild(box);
});
