// Mini FundAI Chatbot Widget
(function() {
    // --- CSS Injection ---
    const style = document.createElement('style');
    style.innerHTML = `
    .mini-fundai-arrow-btn {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 9999;
        background: var(--accent);
        border-radius: 8px 0 0 8px;
        border: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        padding: 15px 0;
        padding-left: 3px;
        cursor: pointer;
        transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-width: 26px;
        max-width: 26px;
        overflow: hidden;
        transform-origin: right center;
    }
    .mini-fundai-arrow-btn:hover {
        background: #1c4daf;
        width: 140px;
        min-width: 56px;
        max-width: 180px;
        padding-right: 18px;
        padding-left: 18px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.18);
        transform: translateY(-50%) scale(1.02);
    }
    .mini-fundai-arrow-btn .mini-fundai-text {
        display: none;
        color: #fff;
        font-weight: 600;
        font-size: 14px;
        white-space: nowrap;
        opacity: 0;
        transform: translateX(-8px) scale(0.9);
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        transition-delay: 0.1s;
    }
    .mini-fundai-arrow-btn:hover .mini-fundai-text {
        display: inline;
        opacity: 1;
        transform: translateX(0) scale(1);
        transition-delay: 0.05s;
    }
    .mini-fundai-panel {
        position: fixed;
        right: 0;
        top: 50%;
        width: 400px;
        height: 600px;
        background: var(--sidebar-bg);
        border-radius: 10px;
        margin-right: 10px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Inter', Arial, sans-serif;
        /* --- Enhanced Animation --- */
        opacity: 0;
        transform: translateY(-50%) scale(0.88) translateX(80px) rotateY(-8deg);
        transition: opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), 
                    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 8px 32px rgba(0,0,0,0.22);
        border: 1.5px solid var(--border);
        transform-origin: right center;
        perspective: 1000px;
    }
    .mini-fundai-panel.open {
        opacity: 1;
        transform: translateY(-50%) scale(1) translateX(0) rotateY(0deg);
        transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), 
                    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 12px 40px rgba(0,0,0,0.28);
    }
    .mini-fundai-panel.closing {
        opacity: 0;
        transform: translateY(-50%) scale(0.88) translateX(80px) rotateY(-8deg);
        transition: opacity 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19), 
                    transform 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19);
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }
    .mini-fundai-header {
        background: var(--sidebar-bg);
        color: var(--text);
        font-weight: 600;
        padding: 14px;
        padding-left: 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1.15rem;
        letter-spacing: -0.5px;
        border-bottom: 1.5px solid var(--border);
    }
    .mini-fundai-close-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 2rem;
        cursor: pointer;
        padding: 0 4px;
        line-height: 1;
        border-radius: 50%;
        transition: background 0.18s, color 0.18s;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .mini-fundai-close-btn:hover {
        color: #ff4d4f;
    }
    .mini-fundai-messages {
        flex: 1;
        padding: 22px 20px 0 20px;
        overflow-y: auto;
        background: transparent;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
        scroll-behavior: smooth;
    }
    .mini-fundai-messages::-webkit-scrollbar {
        display: none;
    }
    .mini-fundai-input-container {
        padding: 18px 20px 20px 20px;
        background: transparent;
        border-top: 1.5px solid var(--border);
        display: flex;
        gap: 0;
        margin-bottom: 2px;
    }
    .mini-fundai-input {
        flex: 1;
        border-radius: 8px;
        border: 1.5px solid var(--border);
        background: var(--main-bg);
        color: var(--text);
        padding: 14px;
        font-size: 1rem;
        font-family: 'Inter', Arial, sans-serif;
        resize: none;
        min-height: 50.5px;
        height: 50.5px;
        outline: none;
        box-shadow: 0 1px 4px rgba(35,95,214,0.04);
        transition: border 0.18s, box-shadow 0.18s;
        width: 100%;
    }
    .mini-fundai-input:focus {
        border: 1.5px solid var(--accent);
        box-shadow: 0 0 0 2px #235fd633;
    }
    .mini-fundai-message {
        margin-bottom: 18px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        opacity: 0;
        transform: translateY(16px);
        animation: mini-fundai-msg-fadein 0.32s cubic-bezier(.4,1.4,.6,1) forwards;
    }
    @keyframes mini-fundai-msg-fadein {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .mini-fundai-avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: var(--card-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        flex-shrink: 0;
        box-shadow: 0 1px 4px rgba(35,95,214,0.07);
    }
    .mini-fundai-message-content {
        background: var(--card-bg);
        color: var(--text);
        border-radius: 8px;
        padding: 12px;
        font-size: 1rem;
        max-width: 250px;
        word-break: break-word;
        box-shadow: 0 2px 8px rgba(35,95,214,0.06);
        transition: background 0.18s;
        font-family: 'Inter', Arial, sans-serif;
        line-height: 1.4;
    }
    .mini-fundai-message-content p {
        margin: 0;
    }
    .mini-fundai-message.user .mini-fundai-message-content {
        background: var(--accent);
        color: #fff;
        align-self: flex-end;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(35,95,214,0.10);
    }
    /* User's messages are at the right */
    .mini-fundai-message.user {
        justify-content: flex-end;
    }
    .mini-fundai-typing {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
    }
    .mini-fundai-typing-dot {
        width: 7px;
        height: 7px;
        background: var(--text);
        border-radius: 50%;
        opacity: 0.5;
        animation: mini-fundai-dot-blink 1.2s infinite both;
    }
    .mini-fundai-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .mini-fundai-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes mini-fundai-dot-blink {
        0%, 80%, 100% { opacity: 0.5; }
        40% { opacity: 1; }
    }
    .mini-fundai-fundai-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 1.2rem;
        cursor: pointer;
        border-radius: 50%;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.18s, color 0.18s;
    }
    .mini-fundai-fundai-btn:hover {
        background: #23262a;
        color: var(--accent);
    }
    .mini-fundai-close-btn:hover svg {
        color: #ff4d4f;
        fill: #ff4d4f;
    }
    .mini-fundai-arrow-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 16px;
        min-height: 16px;
    }
    `;
    document.head.appendChild(style);

    // --- HTML Injection ---
    const arrowBtn = document.createElement('button');
    arrowBtn.className = 'mini-fundai-arrow-btn';
    const icon = '<span class="mini-fundai-arrow-icon" style="display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#fff"><path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Z"/></svg></span>';
    arrowBtn.innerHTML = icon + '<span class="mini-fundai-text">FundAI</span>';
    document.body.appendChild(arrowBtn);

    let panel = null;
    let isOpen = false;

    function openPanel() {
        if (isOpen) return;
        isOpen = true;
        arrowBtn.style.display = 'none';
        panel = document.createElement('div');
        panel.className = 'mini-fundai-panel';
        panel.innerHTML = `
            <div class="mini-fundai-header">
                <span>FundAI</span>
                <div style="display: flex; align-items: center; gap: 0;">
                    <button class="mini-fundai-fundai-btn" title="Open full FundAI" style="margin-right: 2px; background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; transition: background 0.18s, color 0.18s;"><svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20px\" viewBox=\"0 -960 960 960\" width=\"20px\" fill=\"#fff\"><path d=\"M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h264v72H216v528h528v-264h72v264q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm171-192-51-51 357-357H576v-72h240v240h-72v-117L387-336Z\"/></svg></button>
                    <button class="mini-fundai-close-btn" title="Close"><svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 -960 960 960\" width=\"24px\" fill=\"currentColor\"><path d=\"m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z\"/></svg></button>
                </div>
            </div>
            <div class="mini-fundai-messages" id="miniFundAIMessages"></div>
            <form class="mini-fundai-input-container" autocomplete="off">
                <textarea class="mini-fundai-input" id="miniFundAIInput" rows="1" placeholder="Ask FundAI..."></textarea>
            </form>
        `;
        document.body.appendChild(panel);
        // Animate in
        setTimeout(() => {
            panel.classList.add('open');
        }, 10);
        document.querySelector('.mini-fundai-close-btn').onclick = closePanel;
        document.querySelector('.mini-fundai-fundai-btn').onclick = () => { window.location.href = 'fundAI.html'; };
        setupChat();
    }

    function closePanel() {
        if (!isOpen) return;
        isOpen = false;
        if (panel) {
            panel.classList.remove('open');
            panel.classList.add('closing');
            setTimeout(() => {
                if (panel) {
                    panel.remove();
                    panel = null;
                }
                arrowBtn.style.display = '';
            }, 400); // match closing transition duration
        }
    }

    arrowBtn.onclick = openPanel;

    // --- Chat Logic (shares with FundAI) ---
    function setupChat() {
        const chatMessages = document.getElementById('miniFundAIMessages');
        const chatInput = document.getElementById('miniFundAIInput');
        const userEmail = localStorage.getItem('fundify_user_email');
        const localStorageKey = userEmail ? `fundai_chat_${userEmail}` : null;
        let chatHistory = [];
        let transactions = [];

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function renderMessage(content, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `mini-fundai-message ${sender}`;
            const avatar = document.createElement('div');
            avatar.className = 'mini-fundai-avatar';
            if (sender === 'ai') {
                avatar.innerHTML = `<img src="fundifyIcon.png" alt="AI" style="width: 28px; height: 28px;">`;
            } else {
                avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22" fill="#235FD6"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>`;
            }
            const contentDiv = document.createElement('div');
            contentDiv.className = 'mini-fundai-message-content';
            contentDiv.innerHTML = `<p>${escapeHtml(content)}</p>`;
            if (sender === 'user') {
                msgDiv.appendChild(contentDiv);
                msgDiv.appendChild(avatar);
            } else {
                msgDiv.appendChild(avatar);
                msgDiv.appendChild(contentDiv);
            }
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'mini-fundai-typing';
            typingDiv.id = 'miniFundAITyping';
            typingDiv.innerHTML = `
                <div class="mini-fundai-avatar"><img src="fundifyIcon.png" alt="AI" style="width: 18px; height: 18px;"></div>
                <div class="mini-fundai-typing-dot"></div>
                <div class="mini-fundai-typing-dot"></div>
                <div class="mini-fundai-typing-dot"></div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        function hideTyping() {
            const typing = document.getElementById('miniFundAITyping');
            if (typing) typing.remove();
        }

        function saveHistory() {
            if (localStorageKey) {
                localStorage.setItem(localStorageKey, JSON.stringify(chatHistory));
            }
        }
        function loadHistory() {
            chatMessages.innerHTML = '';
            if (!userEmail) {
                renderMessage('Please log in to use FundAI.', 'ai');
                chatInput.disabled = true;
                return;
            }
            const saved = localStorage.getItem(localStorageKey);
            if (saved) {
                try {
                    chatHistory = JSON.parse(saved);
                    for (const msg of chatHistory) {
                        renderMessage(msg.content, msg.sender);
                    }
                } catch {
                    chatHistory = [];
                }
            }
            if (chatHistory.length === 0) {
                renderMessage("Hello! I'm FundAI, your personal financial assistant. What would you like to know about your finances?", 'ai');
            }
        }

        async function loadTransactions() {
            if (!userEmail) return;
            try {
                const res = await fetch(`http://localhost:8000/transactions?email=${encodeURIComponent(userEmail)}`);
                const data = await res.json();
                if (data.success) transactions = data.transactions;
            } catch {}
        }

        async function sendMessage(e) {
            e.preventDefault();
            const msg = chatInput.value.trim();
            if (!msg) return;
            renderMessage(msg, 'user');
            chatHistory.push({ content: msg, sender: 'user' });
            saveHistory();
            chatInput.value = '';
            showTyping();
            try {
                const response = await fetch('http://localhost:8000/fundai-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: msg, email: userEmail, transactions })
                });
                const data = await response.json();
                hideTyping();
                if (data.success) {
                    renderMessage(data.response, 'ai');
                    chatHistory.push({ content: data.response, sender: 'ai' });
                    saveHistory();
                } else {
                    renderMessage('Sorry, I encountered an error. Please try again.', 'ai');
                }
            } catch {
                hideTyping();
                renderMessage('Sorry, I encountered an error. Please try again.', 'ai');
            }
        }

        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto';
            chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
        });
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
            }
        });
        document.querySelector('.mini-fundai-input-container').addEventListener('submit', sendMessage);

        // Load on open
        loadHistory();
        loadTransactions();
        chatInput.focus();
    }
})();
