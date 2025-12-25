$(document).ready(function() {
		// 箭头旋转动画+箭头折叠菜单淡入淡出动画
	    // 给箭头添加类
	    $('span:contains("▶")').addClass('arrow-icon');
	    // 点击箭头：旋转箭头 + 显示/隐藏菜单
	    $(document).on('click', 'span.arrow-icon', function(e) {
	        e.stopPropagation();
	        // 旋转箭头
	        $(this).toggleClass('rotated');
	        // 获取对应的折叠菜单
	        var $menu = $(this).closest('li').find('.arrow-toggle-down');
	        if ($menu.css('display') === 'none') {
	            // 显示菜单并执行淡入动画
	            $menu.show();
	            animateFadeIn($menu);
	        } else {
	            // 执行淡出动画
	            animateFadeOut($menu);
	        }
	    });
	    // 点击页面其他地方：隐藏菜单并恢复箭头
	    $(document).on('click', function(e) {
	        if (!$(e.target).closest('span.arrow-icon, .arrow-toggle-down').length) {
	            $('.arrow-toggle-down').each(function() {
	                if ($(this).css('display') !== 'none') {
	                    animateFadeOut($(this));
	                }
	            });
	            $('span.arrow-icon').removeClass('rotated');
	        }
	    });
	    // 淡入动画函数
	    function animateFadeIn($menu) {
	        var $items = $menu.find('li');
	        $items.css('opacity', 0);
	        // 依次淡入
	        $items.each(function(index) {
	            $(this).delay(index * 100).animate({opacity: 0.7}, 200);
	        });
	    }
	    // 淡出动画函数
	    function animateFadeOut($menu) {
	        var $items = $menu.find('li');
	        var count = $items.length;
	        // 依次淡出（从最后一个开始）
	        for (var i = count - 1; i >= 0; i--) {
	            $items.eq(i).delay((count - 1 - i) * 100).animate({opacity: 0}, 200);
	        }
	        // 全部淡出后隐藏菜单
	        setTimeout(function() {
	            $menu.hide();
	        }, 200 + (count * 100));
	    }
		// 汉堡菜单隐藏
		 // 更新显示状态
		     function updateDisplay() {
		         if ($(window).width() < 960) {
		             // 小屏幕：隐藏导航条，显示汉堡菜单
		             $('.nav-main').hide();
		             $('.hamburger-menu').css('display', 'block');
		         } else {
		             // 大屏幕：显示导航条，隐藏汉堡菜单
		             $('.nav-main').show();
		             $('.hamburger-menu').css('display', 'none');
		         }
		     }
		     // 初始执行
		     updateDisplay();
		     // 监听窗口大小变化
		     $(window).resize(updateDisplay);
			 //汉堡菜单鼠标悬停小手样式
			 $('.hamburger').mouseover(function() {
			     $(this).css({
			         'cursor': 'pointer'
			     });
			 });
			 // 当鼠标进入汉堡折叠导航条时，阻止伪类生效
			 $('.hamburger-toggle').mouseover(function(e) {
			     e.stopPropagation();
			     $('.hamburger').css({
			         'cursor': 'default'
			     });
			     $('.hamburger > li').css('background-color', '#f7f7f7');
			 });
			 // 当鼠标离开汉堡折叠导航条时，恢复伪类效果
			 $('.hamburger-toggle').mouseleave(function() {
			     $('.hamburger > li').css('background-color', '');
			 });
			 // 点击切换汉堡折叠导航条显示状态
			$('.hamburger').click(function(e) {
			    $('.hamburger-toggle').toggle(); // 使用 toggle 方法切换显示/隐藏
				e.stopPropagation(); // 阻止事件冒泡，避免立即触发document的点击事件
			});
			// 点击页面其他地方时隐藏汉堡折叠导航条
			$(document).click(function() {
			    $('.hamburger-toggle').hide();
			});
			$('.hamburger-toggle').click(function(e) {
			    e.stopPropagation();
			});
	});