$(document).ready(function() {
// 使用CountAPI统计访问人数
	async function updateVisitCounter() {
		try {
			// 命名空间和键，用于唯一标识您的网站
			const namespace = 'your-website-name'; // 改为您的网站名称或标识
			const key = 'total-visits';
			// 1. 尝试获取现有计数
			const getResponse = await fetch(`https://api.countapi.xyz/get/${namespace}/${key}`);
			// 2. 如果不存在则创建，存在则递增
			let hitResponse;
			if (getResponse.ok) {
				// 存在，递增计数
				hitResponse = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`);
			} else {
				// 不存在，创建并设置为1
				hitResponse = await fetch(
					`https://api.countapi.xyz/create?namespace=${namespace}&key=${key}&value=1&enable_reset=1`
					);
			}
			// 3. 获取最终数据并显示
			const data = await hitResponse.json();
			// 4. 显示在页面上
			$('.visiters').text(data.value.toLocaleString());
			// 5. 添加更新时间戳
			localStorage.setItem('countapi_last_update', new Date().toISOString());
		} catch (error) {
			console.error('CountAPI 统计失败:', error);
			// 降级方案：使用本地存储
			const localCount = parseInt(localStorage.getItem('local_visit_count') || '0') + 1;
			localStorage.setItem('local_visit_count', localCount.toString());
			$('.visiters').text(localCount);
			// 显示降级提示
			$('.visiters').after(
				'<span class="api-fallback" style="font-size:12px;color:#888;">(使用本地计数)</span>');
		}
	}
	// 调用函数
	updateVisitCounter();
	});