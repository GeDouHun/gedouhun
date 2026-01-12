/*  -剧情页面js功能 
	-json自动化注入剧情数据 */
// 主线剧情数据
const storyBookLore = {
  chapters: {
    ch1: { title: "第一章 军团", plannedTotal: 64 },
	ch2: { title: "第二章 王朝", plannedTotal: 68 },
	ch3: { title: "第三章 先锋", plannedTotal: 70 },
	ch4: { title: "第四章 后果", plannedTotal: 69 },
	ch5: { title: "第五章 军团要塞", plannedTotal: 75 },
	ch6: { title: "第六章 暗影岛", plannedTotal: 62 },
	ch7Ⅰ: { title: "第七章第Ⅰ部分 忘记过去", plannedTotal: 66 },
	ch7Ⅱ: { title: "第七章第Ⅱ部分 展望未来", plannedTotal: 63 },
	qcⅠ: { title: "变形：琼的层面Ⅰ", plannedTotal: 63 },
	qcⅡ: { title: "琼的层面Ⅱ", plannedTotal: 63 },
	qcⅢ: { title: "琼的层面Ⅲ", plannedTotal: 63 },
	ytcⅠ: { title: "变形：伊图的层面Ⅰ", plannedTotal: 63 },
	ytcⅡ: { title: "伊图的层面Ⅱ", plannedTotal: 63 },
	ytcⅢ: { title: "伊图的层面Ⅲ", plannedTotal: 63 },
	mcⅠ: { title: "变形：马库斯的层面Ⅰ", plannedTotal: 63 },
	mcⅡ: { title: "马库斯的层面Ⅱ", plannedTotal: 63 },
	mcⅢ: { title: "马库斯的层面Ⅲ", plannedTotal: 63 },
  },
  pages: [
    { chapterId: "ch1", type: "normal", text: "萨奇：欢迎来到暗影小队。" },
    { chapterId: "ch1", type: "normal", text: "奇士摩：准备好战斗了吗？" },
  ],
};
// 冒险剧情数据
const storyBookAdventure = {
  chapters: {
    a1: { title: "法则之战", plannedTotal: 46 },
	a2: { title: "炽热血液", plannedTotal: 50 },
	a3: { title: "饲喂恶魔", plannedTotal: 62 },
	a4: { title: "王朝之魂", plannedTotal: 62 },
	a5: { title: "王朝遗产", plannedTotal: 62 },
  },
  pages: [
    { chapterId: "a1", type: "normal", text: "【冒险剧情】" },
    { chapterId: "a1", type: "normal", text: "【冒险剧情】" },
  ],
};
// 填充数据的工具 
function getChapterMeta(book, chapterId) {
  return (
    book.chapters[chapterId] || {
      title: chapterId,
      plannedTotal: null,
    }
  );
}
function expandPlannedPages(rawBook) {
  const book = JSON.parse(JSON.stringify(rawBook));
  const byChapter = new Map();
  Object.keys(book.chapters).forEach((id) => byChapter.set(id, []));
  book.pages.forEach((p) => byChapter.get(p.chapterId).push(p));
  const expanded = [];
  Object.keys(book.chapters).forEach((chapterId) => {
    const meta = getChapterMeta(book, chapterId);
    const list = byChapter.get(chapterId);
    const total = Math.max(list.length, meta.plannedTotal ?? list.length);
    list.forEach((p) => expanded.push(p));
    for (let i = list.length; i < total; i++) {
      expanded.push({
        chapterId,
        type: "placeholder",
        text: `（内容待补充：${meta.title} 第${i + 1}页）`,
      });
    }
  });
  book.pages = expanded;
  return book;
}
function buildChapterInfo(book) {
  const order = [];
  const map = new Map();
  book.pages.forEach((p, i) => {
    if (!map.has(p.chapterId)) {
      order.push(p.chapterId);
      const meta = getChapterMeta(book, p.chapterId);
      map.set(p.chapterId, {
        title: meta.title,
        start: i,
        count: 0,
      });
    }
    map.get(p.chapterId).count++;
  });
  return { order, map };
}
// 引擎
function StorylineEngine({ root, storagePrefix }) {
  this.$root = $(root);
  const isStory = this.$root.hasClass("Story");
  const isAdventure = this.$root.hasClass("Adventure");
  this.state = {
    mode: "chapterIndex",   // chapterIndex | pageIndex | page
    pageIndex: null,        // number | null
    chapterId: null,        // string | null
  };
  this.storagePrefix = storagePrefix;
  this.chapterInfo = null;
  this.book = null;
// DOM 构建
  this.ensurePageIndexContainer = function () {
    if (!this.$root || !this.$root.length) return;
    if (!this.$root.find(".page-index-container").length) {
      this.$root.find(".story-index").after(
        `<div class="page-index-container"></div>`
      );
    }
  };
  this.renderStory = function () {
	  /* 创建用于特殊文本颜色的符号规则 以后可补充
		示例：【？@1】=<span class="text-special">？@1</span>
		【+？@1】=<span class="text-special">？@1</span>
	  */
	this.renderText = function (text) {
	  return text
	    .replace(/【\+(.+?)】/g, "<span class=\"text-special\">$1</span>")
	    .replace(/【(.+?)】/g, "<span>$1</span>");
	};
    const $box = this.$root.find(".story-pages").empty();
    if (!this.book || !this.book.pages) return;
    this.book.pages.forEach((p) => {
      const meta = getChapterMeta(this.book, p.chapterId);
      $box.append(`
        <section class="story-page" chapter-id="${p.chapterId}">
          <h4 class="chapter-title">${meta.title}</h4>
          <p>${this.renderText(p.text)}</p>
        </section>
      `);
    });
  };
// 创建章节目录的函数
  this.buildStoryIndex = function () {
    if (!this.chapterInfo) return;
    const $index = this.$root.find(".story-index").empty();
    this.chapterInfo.order.forEach((id) => {
      const info = this.chapterInfo.map.get(id);
      if (!info) return;
      const $item = $(`<div class="index-item" chapter-id="${id}">
		<span>${info.title}</span>
	  </div>`);
      if (id === this.state.chapterId) $item.addClass("active");
      $item.on("click", () => {
        this.jumpToChapterById(id);
      });
      $index.append($item);
    });
  };
//创建页码目录的函数
  this.buildPageIndex = function () {
    if (!this.chapterInfo || !this.state.chapterId) return;
    const info = this.chapterInfo.map.get(this.state.chapterId);
    if (!info) return;
    const $box = this.$root.find(".page-index-container").empty();
    for (let i = 0; i < info.count; i++) {
      const page = info.start + i;
      const $p = $(`<div class="page-index-item">第${i + 1}页</div>`);
      if (page === this.state.pageIndex) $p.addClass("active");
      $p.on("click", () => {
        this.enterPage(page);
      });
      $box.append($p);
    }
  };
  // 处理翻页边界的实例方法
  this.turnPage = function (delta) {
    if (!this.book || !this.book.pages) return;
    if (this.state.mode !== "page") return;
    const maxPage = this.book.pages.length - 1;
    const nextPage = this.state.pageIndex + delta;
    if (nextPage < 0 || nextPage > maxPage) return;
    this.enterPage(nextPage);
  };
  this.jumpToChapterById = function (chapterId) {
    if (!this.book || !this.book.pages) return;
    const firstPageIndex = this.book.pages.findIndex(
      (p) => p.chapterId === chapterId
    );
    if (firstPageIndex === -1) return;
    this.state.mode = "page";
    this.state.chapterId = chapterId;
    this.state.pageIndex = firstPageIndex;
    this.updateDisplay();
  };
  this.updatePageNumber = function () {
    const $pagination = this.$root.find(".story-pagination");
    const $num = this.$root.find(".page-number");
    const $prev = this.$root.find(".left-page, .revious");
    const $next = this.$root.find(".right-page, .next");
    if (this.state.mode === "page" && typeof this.state.pageIndex === "number") {
      const max = this.book.pages.length - 1;
      $num.text(this.state.pageIndex + 1);
      $pagination.show();
      $prev.toggleClass("disabled", this.state.pageIndex === 0);
      $next.toggleClass("disabled", this.state.pageIndex === max);
    } else {
      $pagination.hide();
    }
  };
  this.enterChapterIndex = function () {
    this.state.mode = "chapterIndex";
    this.state.pageIndex = null;
    this.state.chapterId = null;
    this.updateDisplay();
  };
  this.enterPageIndex = function (chapterId) {
    this.state.mode = "pageIndex";
    this.state.chapterId = chapterId;
    this.state.pageIndex = null;
    this.updateDisplay();
  };
  this.enterPage = function (pageIndex) {
    this.state.mode = "page";
    this.state.pageIndex = pageIndex;
    this.state.chapterId = this.book.pages[pageIndex].chapterId;
    this.updateDisplay();
  };
// 显示控制
  this.updateDisplay = function () {
    if (!this.$root || !this.$root.length) return;
    const $pages = this.$root.find(".story-page");
    this.$root
      .find(".story-index, .page-index-container, .story-pages")
      .hide();
    $pages.hide();
    switch (this.state.mode) {
      case "chapterIndex":
        this.buildStoryIndex();
        this.$root.find(".story-index").show();
        break;
      case "pageIndex":
        this.buildPageIndex();
        this.$root.find(".page-index-container").show();
        break;
      case "page":
        this.$root.find(".story-pages").show();
        if (typeof this.state.pageIndex === "number") {
          $pages.eq(this.state.pageIndex).show();
        }
        break;
    }
    this.updatePageNumber();//更新正文页码
     this.updateTitle();//更新标题
	this.updateButtonVisibility(); // 控制翻页按钮的可见性
  };
  // 更新标题的实例方法
  /*chapterIndex（章节目录页）  → 显示「章节目录」
	pageIndex（页码目录页）     → 显示「章节标题」，并加 is-back
	page （正文页）         → 显示「章节标题」，并加 is-drill*/
  this.updateTitle = function () {
    const $t = this.$root.find(".chapter-index");
    $t.removeClass("is-back is-drill");
    if (this.state.mode === "chapterIndex") {
	  $t.text(isStory ? "章节目录" : "冒险目录");
      $t.text(isAdventure ? "冒险目录" : "章节目录");
    } else if (this.state.mode === "pageIndex") {
      // 页码目录：显示对应章节名
      const title = this.chapterInfo.map.get(this.state.chapterId)?.title || "";
      $t.text(title);
      $t.addClass("is-back");
    } else if (this.state.mode === "page") {
      // 正文页：显示“进入本章页码目录”
      $t.text("进入本章页码目录");
      $t.addClass("is-drill");
    }
  };
  // 控制翻页按钮的可见性
 this.updateButtonVisibility = function () {
   const isPageMode = this.state.mode === "page";
   this.$root.find(".left-page, .right-page").css(
     "visibility",
     isPageMode ? "visible" : "hidden"
   );
   this.$root.find(".revious, .next").css(
     "visibility",
     isPageMode ? "visible" : "hidden"
   );
 };
// 初始化
  this.init = function (data) {
    this.book = expandPlannedPages(data);
    this.chapterInfo = buildChapterInfo(this.book);
    this.ensurePageIndexContainer();
    this.renderStory();
    this.buildStoryIndex();
    this.enterChapterIndex();
    this.$root.find(".left-page, .revious").on("click", () => {
      this.turnPage(-1);
    });
    this.$root.find(".right-page, .next").on("click", () => {
      this.turnPage(1);
    });
    this.$root.find(".chapter-index").on("click", () => {
      if (this.state.mode === "page") {
        this.enterPageIndex(this.state.chapterId);
      } else if (this.state.mode === "pageIndex") {
        this.enterChapterIndex();
      }
    });
    $(document).on("keydown.storyline_" + this.storagePrefix, (e) => {
      if (!this.$root.is(":hover")) return;
      if (e.key === "ArrowLeft") this.turnPage(-1);
      if (e.key === "ArrowRight") this.turnPage(1);
    });
  };
}
// 启动
$(function () {
  new StorylineEngine({
    root: ".Story",
    storagePrefix: "story",
  }).init(storyBookLore);
  new StorylineEngine({
    root: ".Adventure",
    storagePrefix: "adventure",
  }).init(storyBookAdventure);
});
