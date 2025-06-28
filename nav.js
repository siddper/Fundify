// nav.js - Navigation functionality for Fundify
// This file handles sidebar footer user name display

// Add event listener to DOMContentLoaded (nav.html)
document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch user info from backend
    async function fetchUserInfo() {
        const email = localStorage.getItem('fundify_user_email');
        if (!email) return null;
        
        try {
            const res = await fetch(`http://localhost:8000/user-info?email=${encodeURIComponent(email)}`);
            if (!res.ok) return null;
            const data = await res.json();
            if (data.success) return data.user;
            return null;
        } catch {
            return null;
        }
    }

    // Function to update sidebar footer with user name (nav.html)
    async function updateSidebarFooter() {
        const sidebarFooter = document.querySelector('.sidebar-footer span');
        if (!sidebarFooter) return;

        const user = await fetchUserInfo();
        if (user && user.name) {
            sidebarFooter.textContent = user.name;
        } else {
            // Fallback to "Fundify" if user info not available
            sidebarFooter.textContent = 'Fundify';
        }
    }

    // Update the sidebar footer when page loads
    updateSidebarFooter();
});
