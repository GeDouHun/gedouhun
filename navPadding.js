$(document).ready(function() {
    // 动态调整nav的padding-right
    let maxWidth = 0;
    
    // 初始化时尝试从localStorage读取最大宽度
    const savedMaxWidth = localStorage.getItem('nav_maxWidth');
    if (savedMaxWidth) {
        maxWidth = parseInt(savedMaxWidth);
    }
    
    // 更新最大宽度（取当前宽度和已记录的最大值中的较大者）
    const currentWidth = $(window).width();
    if (currentWidth > maxWidth) {
        maxWidth = currentWidth;
        // 保存到localStorage
        localStorage.setItem('nav_maxWidth', maxWidth);
    }
    
    function updateNavPadding() {
        const currentWidth = $(window).width();
        // 更新最大宽度（如果当前宽度更大）
        if (currentWidth > maxWidth) {
            maxWidth = currentWidth;
            localStorage.setItem('nav_maxWidth', maxWidth);
        }
        
        // 计算padding-right值
        const diff = maxWidth - currentWidth;
        let padding = 456 - diff;
        padding = padding < 0 ? 0 : padding; // 确保不为负
        
        // 应用样式
        $('nav').css('padding-right', padding + 'px');
    }
    
    // 调用一次，初始设置
    updateNavPadding();
    
    // 监听窗口大小变化
    $(window).resize(updateNavPadding);
    
    // 页面卸载前保存状态（可选）
    $(window).on('beforeunload', function() {
        localStorage.setItem('nav_maxWidth', maxWidth);
    });
});