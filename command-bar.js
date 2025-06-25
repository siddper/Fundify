(function() {
// Command bar popup opens when user clicks on Command/Ctrl + K
const COMMANDS = [
    { name: 'Go to Dashboard', action: () => window.location.href = 'dashboard.html' },
    { name: 'Open Settings', action: () => window.location.href = 'settings.html' },
    { name: 'View Plan', action: () => window.location.href = 'plan.html' },
    { name: 'Reminders', action: () => window.location.href = 'reminders.html' },
    { name: 'Summary', action: () => window.location.href = 'summary.html' },
    { name: 'Help', action: () => window.location.href = 'help.html' },
    { name: 'FundAI', action: () => window.location.href = 'fundAI.html' },
    { name: 'Score', action: () => window.location.href = 'score.html' },
    // Add more commands as needed
];

let commandBarModal = null;
let searchBarInput = null;
let resultsList = null;
let selectedIdx = 0;

function createCommandBar() {
    if (commandBarModal) return;
    commandBarModal = document.createElement('div');
    commandBarModal.id = 'command-bar-modal';
    commandBarModal.innerHTML = `
        <div id="command-bar-overlay"></div>
        <div id="command-bar-container">
            <input id="command-bar-input" type="text" placeholder="Search commands..." autocomplete="off" autofocus />
            <ul id="command-bar-results"></ul>
        </div>
    `;
    document.body.appendChild(commandBarModal);
    
    // Basic styles (inline for now)
    const style = document.createElement('style');
    style.textContent = `
        #command-bar-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; display: flex; align-items: center; justify-content: center; }
        #command-bar-overlay { position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); }
        #command-bar-container { position: relative; z-index: 10000; background: #222; border-radius: 12px; box-shadow: 0 4px 32px rgba(0,0,0,0.4); width: 420px; max-width: 90vw; padding: 24px 0 8px 0; display: flex; flex-direction: column; }
        #command-bar-input { width: 90%; margin: 0 auto 12px auto; padding: 10px 14px; border-radius: 8px; border: none; font-size: 1.1rem; background: #333; color: #fff; outline: none; }
        #command-bar-results { list-style: none; margin: 0; padding: 0; max-height: 260px; overflow-y: auto; }
        #command-bar-results li { padding: 10px 24px; cursor: pointer; color: #eee; font-size: 1rem; border-radius: 6px; }
        #command-bar-results li.selected, #command-bar-results li:hover { background: #444; color: #fff; }
    `;
    document.head.appendChild(style);

    searchBarInput = document.getElementById('command-bar-input');
    resultsList = document.getElementById('command-bar-results');

    searchBarInput.addEventListener('input', updateResults);
    searchBarInput.addEventListener('keydown', handleInputKeyDown);
    commandBarModal.addEventListener('mousedown', (e) => {
        if (e.target === commandBarModal || e.target.id === 'command-bar-overlay') closeCommandBar();
    });
    updateResults();
    setTimeout(() => searchBarInput.focus(), 10);
}

function closeCommandBar() {
    if (commandBarModal) {
        commandBarModal.remove();
        commandBarModal = null;
        searchBarInput = null;
        resultsList = null;
        selectedIdx = 0;
    }
}

function updateResults() {
    if (!resultsList) return;
    const query = (searchBarInput.value || '').trim().toLowerCase();
    const filtered = searchCommands(query);
    resultsList.innerHTML = '';
    filtered.forEach((cmd, idx) => {
        const li = document.createElement('li');
        li.textContent = cmd.name;
        if (idx === selectedIdx) li.classList.add('selected');
        li.addEventListener('mousedown', (e) => {
            e.preventDefault();
            cmd.action();
            closeCommandBar();
        });
        resultsList.appendChild(li);
    });
    if (filtered.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No commands found.';
        li.style.color = '#888';
        resultsList.appendChild(li);
    }
}

function handleInputKeyDown(e) {
    const filtered = searchCommands(searchBarInput.value.trim().toLowerCase());
    if (e.key === 'ArrowDown') {
        selectedIdx = Math.min(selectedIdx + 1, filtered.length - 1);
        updateResults();
        e.preventDefault();
    } else if (e.key === 'ArrowUp') {
        selectedIdx = Math.max(selectedIdx - 1, 0);
        updateResults();
        e.preventDefault();
    } else if (e.key === 'Enter') {
        if (filtered[selectedIdx]) {
            filtered[selectedIdx].action();
            closeCommandBar();
        }
        e.preventDefault();
    } else if (e.key === 'Escape') {
        closeCommandBar();
        e.preventDefault();
    }
}

// Simple fuzzy search: substring, then word match, then Levenshtein distance
function searchCommands(query) {
    if (!query) return COMMANDS;
    // 1. Substring match
    let matches = COMMANDS.filter(cmd => cmd.name.toLowerCase().includes(query));
    // 2. Word match (split query into words)
    if (matches.length === 0 && query.includes(' ')) {
        const words = query.split(' ');
        matches = COMMANDS.filter(cmd => words.every(w => cmd.name.toLowerCase().includes(w)));
    }
    // 3. Fuzzy match (Levenshtein distance <= 2)
    if (matches.length === 0) {
        matches = COMMANDS.filter(cmd => levenshtein(cmd.name.toLowerCase(), query) <= 2);
    }
    return matches;
}

// Levenshtein distance for fuzzy search
function levenshtein(a, b) {
    const dp = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[a.length][b.length];
}

window.addEventListener('keydown', function(event) {
    if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (commandBarModal) {
            closeCommandBar();
        } else {
            createCommandBar();
        }
    }
});
})();