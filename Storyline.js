$(document).ready(function() {
    console.log("分页脚本已加载");
    // ========== 主线剧情分页功能 ==========
    const storyList = $('.Story .text-container li');
    let storyCurrentPage = -1; // -1表示目录页，0表示第1页内容
    const storyTotalPages = storyList.length; // 总页数（包括目录，但目录不算页码）
    console.log("主线剧情li数量:", storyList.length);
    // 获取元素
    const storyPageSpan = $('.Story .text-container .pages span'); // 页码显示span
    const storyPagesContainer = $('.Story .text-container .pages'); // 整个页码容器
    const storyChapterIndex = $('.Story .chapter-index span'); // 目录标题
    // 初始化：显示第一个li（目录页），隐藏页码显示
    storyList.hide(); // 隐藏所有li
    $(storyList[0]).show(); // 显示第一个li（目录页）
    storyPagesContainer.hide(); // 隐藏页码
    storyChapterIndex.text(''); // 清空目录标题内容
    updateStoryDisplay();
    // 更新主线显示
    function updateStoryDisplay() {
        if (storyCurrentPage === -1) {
            // 目录页
            storyChapterIndex.text(''); // 目录标题不显示内容
            storyPagesContainer.hide(); // 隐藏页码显示
        } else {
            // 内容页
            storyChapterIndex.text(`目录 (${storyCurrentPage + 1}/${storyTotalPages - 1})`);
            storyPagesContainer.show(); // 显示页码
            storyPageSpan.text(storyCurrentPage + 1); // 更新页码数字
        }
    }
    // 主线上一页点击事件
    $('.Story .revious, .Story .left-page').click(function() {
        console.log("上一页点击，当前页:", storyCurrentPage);
        if (storyCurrentPage === -1) {
            // 已经在目录页，不能往前翻
            return;
        }
        // 隐藏当前内容页
        storyList.hide();
        if (storyCurrentPage === 0) {
            // 从第1页回到目录页
            storyCurrentPage = -1;
            $(storyList[0]).show(); // 显示第一个li（目录页）
        } else {
            // 翻到前一页内容
            storyCurrentPage--;
            $(storyList[storyCurrentPage + 1]).show(); // 显示对应li（+1是因为第一个li是目录）
        }
        updateStoryDisplay();
    });
    // 主线下一页点击事件
    $('.Story .next, .Story .right-page').click(function() {
        console.log("下一页点击，当前页:", storyCurrentPage);
        if (storyCurrentPage === -1) {
            // 从目录到第一页
            storyList.hide();
            storyCurrentPage = 0;
            $(storyList[1]).show(); // 显示第二个li（第1页内容）
        } else if (storyCurrentPage < storyTotalPages - 2) {
            // 翻到下一页内容
            storyList.hide();
            storyCurrentPage++;
            $(storyList[storyCurrentPage + 1]).show(); // 显示对应li（+1是因为第一个li是目录）
        } else {
            // 已经是最后一页
            console.log("已经是最后一页");
            return;
        }
        updateStoryDisplay();
    });
    // 主线目录标题点击事件：回到目录页
    $('.Story .chapter-index').click(function() {
        console.log("目录标题点击");
        storyList.hide();
        storyCurrentPage = -1;
        $(storyList[0]).show(); // 显示第一个li（目录页）
        updateStoryDisplay();
    });
    // 键盘翻页支持
    $(document).keydown(function(e) {
        const isStoryHovered = $('.Story').is(':hover');
        if (isStoryHovered) {
            if (e.keyCode === 37) { // 左箭头翻页
                $('.Story .revious').click();
            } else if (e.keyCode === 39) { // 右箭头翻页
                $('.Story .next').click();
            }
        }
    });
    // 初始显示状态
    console.log("初始化完成，当前状态：目录页");
});
