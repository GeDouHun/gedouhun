// main.js - 箭头菜单功能
$(document).ready(function() {
console.log('main.js loaded - 箭头菜单');
// 箭头点击事件
$(document).on('click', 'span.arrow-icon', function(e) {
e.preventDefault();
e.stopPropagation();
$(this).toggleClass('rotated');
var $menu = $(this).closest('li').find('.arrow-toggle-down');
if ($menu.css('display') === 'none') {
$menu.show();
animateFadeIn($menu);
} else {
animateFadeOut($menu);
}
});
// 点击页面其他地方关闭菜单
$(document).on('click', function(e) {
if (!$(e.target).closest('span.arrow-icon, .arrow-toggle-down').length) {
$('.arrow-toggle-down').each(function() {
if ($(this).css('display') !== 'none') {
animateFadeOut($this);
}
});
$('span.arrow-icon').removeClass('rotated');
}
});
// 淡入动画
function animateFadeIn($menu) {
var $items = $menu.find('li');
$items.css('opacity', 0);
$items.each(function(index) {
$(this).delay(index * 100).animate({opacity: 1}, 200);
});
}
// 淡出动画
function animateFadeOut($menu) {
var $items = $menu.find('li');
var count = $items.length;
for (var i = count - 1; i >= 0; i--) {
$items.eq(i).delay((count - 1 - i) * 100).animate({opacity: 0}, 200);
}
setTimeout(function() {
$menu.hide();
}, 200 + (count * 100));
}
});