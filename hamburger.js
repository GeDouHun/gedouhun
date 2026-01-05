$(document).ready(function() {
    console.log('hamburger.js loaded'); 
    // 汉堡菜单隐藏
    // 更新显示状态
    function updateDisplay() {
        if ($(window).width() < 1080) {
            $('.nav-main').hide();
            $('.hamburger-menu').css('display', 'block');
        } else {
            $('.nav-main').show();
            $('.hamburger-menu').css('display', 'none');
        }
    }
    updateDisplay();
    $(window).resize(updateDisplay);
    $('.hamburger').mouseover(function() {
        $(this).css({
            'cursor': 'pointer'
        });
    });
    $('.hamburger-toggle').mouseover(function(e) {
        e.stopPropagation();
        $('.hamburger').css({
            'cursor': 'default'
        });
        $('.hamburger > li').css('background-color', '#f7f7f7');
    });
    $('.hamburger-toggle').mouseleave(function() {
        $('.hamburger > li').css('background-color', '');
    });
    $('.hamburger').click(function(e) {
        $('.hamburger-toggle').toggle();
        e.stopPropagation();
    });
    $(document).click(function() {
        $('.hamburger-toggle').hide();
    });
    $('.hamburger-toggle').click(function(e) {
        e.stopPropagation();
    });
});