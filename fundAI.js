class FundAIChat {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.userEmail = this.getUserEmail();
        this.transactions = [];
        this.chatHistory = [];
        this.localStorageKey = this.userEmail ? `fundai_chat_${this.userEmail}` : null;
        
        this.initializeEventListeners();
        this.loadUserTransactions();
        this.loadChatHistory();
        this.clearChatButton = document.getElementById('clearChatButton');
        if (this.clearChatButton) {
            this.clearChatButton.addEventListener('click', () => this.clearChat());
        }

        // Example question buttons logic
        const exampleQuestionsList = [
            "How much did I spend this month?",
            "How much did I receive this month?",
            "How many transactions this week?",
            "What's my largest transaction this month?",
            "What's my smallest transaction this month?",
            "How much did I spend yesterday?",
            "How much did I spend today?",
            "How much did I spend last week?",
            "How much did I spend this week?",
            "How much did I spend last month?",
            "How much on groceries this month?",
            "How much on entertainment this month?",
            "How much on transportation this month?",
            "How much on shopping this month?",
            "How much on restaurants this month?",
            "How much did I save this month?",
            "How many deposits this month?",
            "How many withdrawals this month?",
            "What's my average transaction this month?"
        ];
        
        // Randomly pick 2 unique questions
        function getTwoRandomQuestions(list) {
            const idx1 = Math.floor(Math.random() * list.length);
            let idx2;
            do {
                idx2 = Math.floor(Math.random() * list.length);
            } while (idx2 === idx1);
            return [list[idx1], list[idx2]];
        }
        
        const exampleBtns = document.querySelectorAll('.example-question-btn');
        const [q1, q2] = getTwoRandomQuestions(exampleQuestionsList);
        if (exampleBtns[0]) {
            exampleBtns[0].value = q1;
            exampleBtns[0].textContent = q1;
            exampleBtns[0].addEventListener('click', () => {
                this.chatInput.value = q1;
                this.chatInput.dispatchEvent(new Event('input'));
                this.chatInput.focus();
            });
        }
        if (exampleBtns[1]) {
            exampleBtns[1].value = q2;
            exampleBtns[1].textContent = q2;
            exampleBtns[1].addEventListener('click', () => {
                this.chatInput.value = q2;
                this.chatInput.dispatchEvent(new Event('input'));
                this.chatInput.focus();
            });
        }
    }

    getUserEmail() {
        // Get user email from localStorage (set during login)
        return localStorage.getItem('fundify_user_email');
    }

    initializeEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key to send (Shift+Enter for new line)
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize textarea
        this.chatInput.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.updateSendButton();
        });
        
        // Focus input on page load
        this.chatInput.focus();
    }

    autoResizeTextarea() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
    }

    updateSendButton() {
        const hasText = this.chatInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText;
    }

    async loadUserTransactions() {
        if (!this.userEmail) {
            this.addMessage('Please log in to use FundAI.', 'ai');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/transactions?email=${encodeURIComponent(this.userEmail)}`);
            const data = await response.json();
            
            if (data.success) {
                this.transactions = data.transactions;
            } else {
                console.error('Failed to load transactions:', data.error);
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    loadChatHistory() {
        if (!this.localStorageKey) {
            this.addMessage('Please log in to use FundAI.', 'ai');
            return;
        }
        const saved = localStorage.getItem(this.localStorageKey);
        this.chatMessages.innerHTML = '';
        if (saved) {
            try {
                this.chatHistory = JSON.parse(saved);
                for (const msg of this.chatHistory) {
                    this.renderMessage(msg.content, msg.sender);
                }
            } catch (e) {
                this.chatHistory = [];
            }
        }
        if (this.chatHistory.length === 0) {
            // Add welcome message if no history
            this.addMessage(
                "Hello! I'm FundAI, your personal financial assistant. I can help you analyze your transactions, answer questions about your spending patterns, and provide financial insights. What would you like to know about your finances?",
                'ai'
            );
        }
    }

    saveChatHistory() {
        if (this.localStorageKey) {
            localStorage.setItem(this.localStorageKey, JSON.stringify(this.chatHistory));
        }
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input and reset
        this.chatInput.value = '';
        this.autoResizeTextarea();
        this.updateSendButton();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
            console.error('Error getting AI response:', error);
        }
    }

    async getAIResponse(userMessage) {
        if (!this.userEmail) {
            return 'Please log in to use FundAI.';
        }

        const response = await fetch('http://localhost:8000/fundai-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                email: this.userEmail,
                transactions: this.transactions
            })
        });

        const data = await response.json();
        
        if (data.success) {
            return data.response;
        } else {
            throw new Error(data.error || 'Failed to get AI response');
        }
    }

    addMessage(content, sender) {
        // Save to chat history and localStorage
        this.chatHistory.push({ content, sender });
        this.saveChatHistory();
        this.renderMessage(content, sender);
    }

    renderMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        if (sender === 'ai') {
            avatar.innerHTML = `<img src="fundifyIcon.png" alt="FundAI" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border);">`;
        } else {
            avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#235FD6"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>`;
        }
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${this.escapeHtml(content)}</p>`;
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-message';
        typingDiv.id = 'typingIndicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = `
            <img src="fundifyIcon.png" alt="FundAI" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border);">
        `;
        
        const typingContent = document.createElement('div');
        typingContent.className = 'message-content';
        typingContent.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingContent);
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearChat() {
        this.chatHistory = [];
        this.saveChatHistory();
        this.loadChatHistory();
    }
}

// Initialize the chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FundAIChat();
});
