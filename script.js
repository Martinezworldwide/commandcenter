// Utility functions for UI interactions and navigation
let actionMenuVisible = false;

// Create UI elements
function createUI() {
    // Create menu button
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '+';
    menuBtn.addEventListener('click', toggleActionMenu);
    document.body.appendChild(menuBtn);
    
    // Create action menu
    const actionMenu = document.createElement('div');
    actionMenu.className = 'action-menu';
    actionMenu.style.opacity = '0';
    actionMenu.style.transform = 'translateY(20px)';
    document.body.appendChild(actionMenu);
    
    // Add action buttons
    const actions = [
        { name: 'Engineering', icon: '🔧' },
        { name: 'Finance', icon: '💰' },
        { name: 'Operations', icon: '⚙️' },
        { name: 'HR', icon: '👥' },
        { name: 'Analytics', icon: '📊' }
    ];
    
    actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.innerHTML = `${action.icon} ${action.name}`;
        btn.addEventListener('click', () => navigate(action.name));
        actionMenu.appendChild(btn);
    });
}

// Toggle action menu visibility
function toggleActionMenu() {
    const actionMenu = document.querySelector('.action-menu');
    const menuBtn = document.querySelector('.menu-btn');
    
    if (actionMenuVisible) {
        actionMenu.style.opacity = '0';
        actionMenu.style.transform = 'translateY(20px)';
        menuBtn.innerHTML = '+';
    } else {
        actionMenu.style.opacity = '1';
        actionMenu.style.transform = 'translateY(0)';
        menuBtn.innerHTML = '×';
    }
    
    actionMenuVisible = !actionMenuVisible;
}

// Navigate to different sections
function navigate(section) {
    console.log(`Navigating to ${section}...`);
    
    // Find the appropriate section node in the 3D space
    const targetPosition = getPositionForSection(section);
    
    // Animate camera movement
    moveCamera(targetPosition);
    
    // Show section-specific info
    showSectionInfo(section);
}

// Get position for specific section
function getPositionForSection(section) {
    const positions = {
        'Engineering': { x: -5, y: 2, z: -10 },
        'Finance': { x: 5, y: 2, z: -10 },
        'Operations': { x: 0, y: 5, z: -15 },
        'HR': { x: -5, y: -2, z: -10 },
        'Analytics': { x: 5, y: -2, z: -10 }
    };
    
    return positions[section] || { x: 0, y: 0, z: 20 };
}

// Move camera to target position
function moveCamera(position) {
    // This function will be called from app.js
    if (window.cameraNavigation) {
        window.cameraNavigation(position);
    }
}

// Show section-specific information
function showSectionInfo(section) {
    const infoPanel = document.createElement('div');
    infoPanel.className = 'panel';
    infoPanel.style.top = '100px';
    infoPanel.style.right = '20px';
    infoPanel.style.width = '300px';
    
    infoPanel.innerHTML = `
        <div class="panel-header">
            <div class="panel-title">${section} Dashboard</div>
            <button class="close-btn">×</button>
        </div>
        <div class="panel-content">
            <p>This is the ${section} management dashboard.</p>
            <p>Status: Operational</p>
            <p>Last updated: ${new Date().toLocaleString()}</p>
        </div>
    `;
    
    document.body.appendChild(infoPanel);
    
    // Add close button functionality
    const closeBtn = infoPanel.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(infoPanel);
    });
}

// Initialize UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', createUI);

// Export functions for app.js to use
window.navigate = navigate;
