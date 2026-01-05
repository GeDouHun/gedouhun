$(document).ready(function() {
    // 为所有输入框添加自定义placeholder功能
    $('.mess-name, .mess-mess').each(function() {
        const $input = $(this);
        const placeholderText = $input.attr('placeholder') || '请输入内容';
        
        // 保存原始placeholder并清空
        $input.data('original-placeholder', placeholderText);
        $input.attr('placeholder', '');
        
        // 创建自定义placeholder元素
        const $customPlaceholder = $('<span class="custom-placeholder"></span>')
            .text(placeholderText)
            .css({
                'position': 'absolute',
                'left': '5px',
                'top': '55px',
                'color': 'rgba(255, 255, 255, 0.6)',
                'font-size': '16px',
                'pointer-events': 'none',
                'opacity': '0',
                'z-index': '2'
            });
        
        // 包裹输入框
        $input.wrap('<div class="input-wrapper" style="position:relative;"></div>');
        $input.parent().append($customPlaceholder);
        
        // 事件处理
        $input.on('focus', function() {
            if ($input.val().trim() === '') {
                $customPlaceholder.css('opacity', '1');
            }
        });
        
        $input.on('blur', function() {
            $customPlaceholder.css('opacity', '0');
        });
        
        $input.on('input', function() {
            if ($input.val().trim() !== '') {
                $customPlaceholder.css('opacity', '0');
            } else if ($input.is(':focus')) {
                $customPlaceholder.css('opacity', '1');
            }
        });
        
        $input.on('mousedown', function() {
            if ($input.val().trim() === '') {
                $customPlaceholder.css('opacity', '1');
            }
        });
    });
    
    // 点击页面其他地方隐藏所有placeholder
    $(document).on('click', function(e) {
        if (!$(e.target).is('.mess-name, .mess-mess') && 
            !$(e.target).closest('.input-wrapper').length) {
            $('.custom-placeholder').css('opacity', '0');
        }
    });
});