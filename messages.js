// messages.js - 留言板功能
$(document).ready(function() {
    console.log('留言板JS加载完成');
    const edgeFunctionUrl = 'https://npplqwrqxystsvnxopoq.supabase.co/functions/v1/swift-worker';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wcGxxd3JxeHlzdHN2bnhvcG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NTQ4MzYsImV4cCI6MjA1MTQzMDgzNn0.YIuiWQq-YQNl1lLTQ_wtCkrygYsKvWSnSge7s6PjgjQ';
    const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey
    };
    const messageCache = {
        data: null,
        timestamp: 0,
        ttl: 60000, //缓存60秒
        get: function() {
            const now = Date.now();
            if (this.data && (now - this.timestamp) < this.ttl) {
                return this.data;
            }
            return null;
        },
        set: function(data) {
            this.data = data;
            this.timestamp = Date.now();
        },
        clear: function() {
            this.data = null;
            this.timestamp = 0;
        }
    };
    const usernameInput = $('#username');
    const messageInput = $('#message');
    const submitBtn = $('#allright');
    const messStore = $('#mess-store');
    messStore.empty();
    function formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1) return '刚刚';
        if (diffMins < 60) return `${diffMins}分钟前`;
        if (diffHours < 24) return `${diffHours}小时前`;
        if (diffDays < 7) return `${diffDays}天前`;
        return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    function createMessageElement(message) {
        const safeName = message.name || '匿名用户';
        const safeMessage = message.message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/\n/g, '<br>');
        const messageElement = $(`
            <div class="message-item">
                <h4 class="recieve-name">用户：<span>(${safeName})</span></h4>
                <p class="recieve">${safeMessage}</p>
                <hr class="split" color="#55aaff"/>
                <div class="message-time" style="
                    color: #888;
                    font-size: 12px;
                    text-align: right;
                    margin-right: 15px;
                    margin-bottom: 10px;
                ">${formatTime(message.created_at)}</div>
            </div>
        `);
        return messageElement;
    }
    function addMessageToPage(message) {
        const messageElement = createMessageElement(message);
        messStore.prepend(messageElement);
    }
    function renderMessages(messages) {
        messStore.empty();
        if (!messages || messages.length === 0) {
            messStore.html('<div style="text-align:center;color:#888;padding:40px;font-style:italic;">还没有留言，快来第一个留言吧！</div>');
            return;
        }
        messages.forEach(message => {
            addMessageToPage(message);
        });
    }
    let isLoading = false;
    async function loadMessages() {
        if (isLoading) return;
        const cached = messageCache.get();
        if (cached) {
            renderMessages(cached);
            return;
        }
        isLoading = true;
        try {
            messStore.html('<div style="text-align:center;color:#aaa;padding:40px;">加载留言中...</div>');
            const response = await fetch(edgeFunctionUrl, {
                method: 'POST',
                headers: requestHeaders,
                body: JSON.stringify({
                    action: 'get_messages'
                }),
                mode: 'cors'
            });
            if (!response.ok) {
                throw new Error(`HTTP 错误! 状态码: ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                messageCache.set(result.data);
                renderMessages(result.data);
            } else {
                throw new Error(result.error || '加载留言失败');
            }
        } catch (error) {
            console.error('加载留言失败:', error);
            messStore.html(`<div style="text-align:center;color:#ff6b6b;padding:40px;">加载留言失败: ${error.message}</div>`);
        } finally {
            isLoading = false;
        }
    }
    async function submitMessage() {
        const username = usernameInput.val().trim();
        const message = messageInput.val().trim();
        if (!message) {
            alert('请输入留言内容');
            messageInput.focus();
            return;
        }
        if (message.length > 500) {
            alert('留言内容不能超过500字');
            return;
        }
        if (username.length > 20) {
            alert('昵称不能超过20字');
            return;
        }
        submitBtn.prop('disabled', true).text('提交中...');
        try {
            let ipAddress = '未知';
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json', {timeout: 2000});
                if (ipResponse.ok) {
                    const ipData = await ipResponse.json();
                    ipAddress = ipData.ip;
                }
            } catch (ipError) {
                try {
                    const backupResponse = await fetch('https://api64.ipify.org?format=json', {timeout: 2000});
                    if (backupResponse.ok) {
                        const backupData = await backupResponse.json();
                        ipAddress = backupData.ip;
                    }
                } catch (backupError) {
                    console.log('获取IP失败，使用默认值');
                }
            }
            const response = await fetch(edgeFunctionUrl, {
                method: 'POST',
                headers: requestHeaders,
                body: JSON.stringify({
                    action: 'add_message',
                    data: {
                        name: username,
                        message: message,
                        ip_address: ipAddress
                    }
                }),
                mode: 'cors'
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                usernameInput.val('');
                messageInput.val('');
                alert('留言发布成功！');
                messageCache.clear();
                await loadMessages();
            } else {
                throw new Error(result.error || '发布失败');
            }
        } catch (error) {
            console.error('发布留言失败:', error);
            alert('发布留言失败: ' + error.message);
        } finally {
            submitBtn.prop('disabled', false).text('提交');
        }
    }
    submitBtn.on('click', submitMessage);
    messageInput.on('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            submitMessage();
        }
    });
    usernameInput.on('keydown', function(e) {
        if (e.altKey && e.key === 'Enter') {
            submitMessage();
        }
    });
    async function initLoadMessages() {
        console.time('loadMessages_time');
        await loadMessages();
        console.timeEnd('loadMessages_time');
    }
    initLoadMessages();
    setInterval(async () => {
        console.time('autoRefresh_time');
        await loadMessages();
        console.timeEnd('autoRefresh_time');
    }, 300000);
    $('<style>').text(`
        .message-item {
            margin-bottom: 15px;
            padding-bottom: 10px;
            animation: fadeIn 0.5s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .mess-store {
            overflow-y: auto;
        }
        .mess-store::-webkit-scrollbar {
            width: 8px;
        }
        .mess-store::-webkit-scrollbar-track {
            background: rgba(85, 170, 255, 0.1);
            border-radius: 4px;
        }
        .mess-store::-webkit-scrollbar-thumb {
            background: #55aaff;
            border-radius: 4px;
        }
        .mess-store::-webkit-scrollbar-thumb:hover {
            background: #66ccff;
        }
    `).appendTo('head');
});