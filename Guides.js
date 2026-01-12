//js注入数据
const guideData = [
  {
    title: "第一章：BOSS",
    tip: "新手章节，难度较低",
    bosses: [
      { name: "邓饶", href: "邓饶.html", level: "easy" },
      { name: "奇士摩", href: "奇士摩1..html", level: "middle", disabled: true }
    ]
  },
  {
    title: "第四章：BOSS",
    tip: "存在并列 Boss",
    bosses: [
      [
        { name: "暗影琼", href: "暗影琼.html", level: "easy" },
        { name: "暗影伊图", href: "暗影伊图.html", level: "middle" },
        { name: "暗影马库斯", href: "暗影马库斯.html", level: "nightmare", disabled: true }
      ],
      { name: "约卡", href: "约卡.html", level: "middle" }
    ]
  }
];

const container = document.getElementById("story-container");
container.innerHTML = "";

guideData.forEach(section => {
  const wrap = document.createElement("div");
  wrap.className = "guides-text";

  // h4 + 注释
  const h4 = document.createElement("h4");
  h4.innerHTML = `
    ${section.title}
    <span class="attention" data-tip="${section.tip}">注</span>
  `;
  wrap.appendChild(h4);

  section.bosses.forEach(item => {
    const p = document.createElement("p");

    const renderBoss = boss => {
      const a = document.createElement("a");
      a.href = boss.href || "javascript:void(0)";
      a.className = boss.level + (boss.disabled ? " active" : "");
      a.innerHTML = `<i>${boss.name}</i>`;
      p.appendChild(a);
    };

    if (Array.isArray(item)) {
      item.forEach((boss, i) => {
        renderBoss(boss);
        if (i < item.length - 1) {
          p.insertAdjacentHTML("beforeend", "&ensp;|&ensp;");
        }
      });
    } else {
      renderBoss(item);
    }

    wrap.appendChild(p);
  });

  container.appendChild(wrap);
});
/*注意：悬浮提示框 */
$('.attention').attr(
  'title',
  '用括号括住的BOSS并非正式BOSS，只是与BOSS同样是三局两胜制'
);
