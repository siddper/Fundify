// Modal logic
const openBtn = document.getElementById('openAddModal');
const closeBtn = document.getElementById('closeAddModal');
const modalBg = document.getElementById('addModal');
if (openBtn && closeBtn && modalBg) {
  openBtn.addEventListener('click', () => {
    modalBg.classList.add('active');
  });
  closeBtn.addEventListener('click', () => {
    modalBg.classList.remove('active');
  });
  modalBg.addEventListener('click', (e) => {
    if (e.target === modalBg) {
      modalBg.classList.remove('active');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBg.classList.remove('active');
    }
  });
}

// Sidebar manual resizing only, min width 100px
const sidebar = document.querySelector('.sidebar');
const resizeHandle = document.querySelector('.sidebar-resize-handle');
let isResizing = false;
let startX = 0;
let startWidth = 0;
const minSidebarWidth = 200;
const maxSidebarWidth = 400;
const SIDEBAR_WIDTH_KEY = 'fundify_sidebar_width';

// Load sidebar width from localStorage on page load
const savedWidth = parseInt(localStorage.getItem(SIDEBAR_WIDTH_KEY), 10);
if (!isNaN(savedWidth) && savedWidth >= minSidebarWidth && savedWidth <= maxSidebarWidth) {
  sidebar.style.width = savedWidth + 'px';
  sidebar.style.minWidth = savedWidth + 'px';
  sidebar.style.maxWidth = savedWidth + 'px';
}

if (resizeHandle && sidebar) {
  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = sidebar.offsetWidth;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    let newWidth = startWidth + (e.clientX - startX);
    if (newWidth < minSidebarWidth) newWidth = minSidebarWidth;
    if (newWidth > maxSidebarWidth) newWidth = maxSidebarWidth;
    sidebar.style.width = newWidth + 'px';
    sidebar.style.minWidth = newWidth + 'px';
    sidebar.style.maxWidth = newWidth + 'px';
    // Save to localStorage
    localStorage.setItem(SIDEBAR_WIDTH_KEY, newWidth);
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}

// Filter chip removal
const filterChips = document.querySelectorAll('.chip-close');
filterChips.forEach(chip => {
  chip.addEventListener('click', (e) => {
    e.target.parentElement.remove();
  });
});

// Filter add button stub
const filterAddBtn = document.querySelector('.filter-add-btn');
if (filterAddBtn) {
  filterAddBtn.addEventListener('click', () => {
    alert('Show filter add popup (to be implemented)');
  });
}

// Sort dropdown stub
const sortDropdown = document.querySelector('.sort-dropdown');
if (sortDropdown) {
  sortDropdown.addEventListener('change', (e) => {
    // Implement sorting logic here
    // e.target.value
  });
} 