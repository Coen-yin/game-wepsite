// Application State
let currentUser = null;
let isAuthMode = 'login'; // 'login' or 'signup'
let games = [];
let users = [];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadData();
    checkAuthState();
});

// Initialize the application
function initializeApp() {
    // Create admin user if it doesn't exist
    createAdminUser();
    
    // Load sample games if none exist
    if (getGames().length === 0) {
        createSampleGames();
    }
    
    loadGames();
    updateNavigation();
}

// Setup event listeners
function setupEventListeners() {
    // Auth form submission
    document.getElementById('auth-form').addEventListener('submit', handleAuthSubmit);
    
    // Upload form submission
    document.getElementById('upload-form').addEventListener('submit', handleGameUpload);
    
    // Search functionality
    document.getElementById('search-input').addEventListener('input', searchGames);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('game-modal');
        if (event.target === modal) {
            closeGameModal();
        }
    });
}

// Data Management Functions
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function getUsers() {
    return getFromStorage('gameHub_users') || [];
}

function saveUsers(users) {
    saveToStorage('gameHub_users', users);
}

function getGames() {
    return getFromStorage('gameHub_games') || [];
}

function saveGames(games) {
    saveToStorage('gameHub_games', games);
}

function getCurrentUser() {
    return getFromStorage('gameHub_currentUser');
}

function saveCurrentUser(user) {
    saveToStorage('gameHub_currentUser', user);
}

// Create admin user
function createAdminUser() {
    const users = getUsers();
    const adminExists = users.find(user => user.username === 'Coen3111');
    
    if (!adminExists) {
        const adminUser = {
            id: generateId(),
            username: 'Coen3111',
            email: 'admin@gamehub.com',
            password: 'Carronshore93',
            isAdmin: true,
            createdAt: new Date().toISOString()
        };
        users.push(adminUser);
        saveUsers(users);
    }
}

// Create sample games
function createSampleGames() {
    const sampleGames = [
        {
            id: generateId(),
            title: 'Space Adventure',
            description: 'An exciting space exploration game where you navigate through asteroids and collect power-ups.',
            link: 'https://example.com/space-game',
            thumbnail: 'https://via.placeholder.com/300x200/4a90e2/ffffff?text=Space+Adventure',
            uploader: 'Coen3111',
            uploadDate: new Date().toISOString(),
            approved: true
        },
        {
            id: generateId(),
            title: 'Puzzle Master',
            description: 'Challenge your mind with this collection of brain-teasing puzzles and logic games.',
            link: 'https://example.com/puzzle-game',
            thumbnail: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Puzzle+Master',
            uploader: 'Coen3111',
            uploadDate: new Date().toISOString(),
            approved: true
        },
        {
            id: generateId(),
            title: 'Racing Thunder',
            description: 'High-speed racing action with multiple tracks and customizable vehicles.',
            link: 'https://example.com/racing-game',
            thumbnail: 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Racing+Thunder',
            uploader: 'Coen3111',
            uploadDate: new Date().toISOString(),
            approved: true
        }
    ];
    
    saveGames(sampleGames);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Load application data
function loadData() {
    games = getGames();
    users = getUsers();
}

// Check authentication state
function checkAuthState() {
    currentUser = getCurrentUser();
    if (currentUser) {
        updateNavigation();
        showHome();
    }
}

// Navigation Functions
function updateNavigation() {
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const uploadLink = document.getElementById('upload-link');
    const profileLink = document.getElementById('profile-link');
    const adminLink = document.getElementById('admin-link');
    
    if (currentUser) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
        uploadLink.style.display = 'block';
        profileLink.style.display = 'block';
        
        // Show admin link only for admin users
        if (currentUser.isAdmin) {
            adminLink.style.display = 'block';
        } else {
            adminLink.style.display = 'none';
        }
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
        uploadLink.style.display = 'none';
        profileLink.style.display = 'none';
        adminLink.style.display = 'none';
    }
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
}

function showHome() {
    showSection('home-section');
    loadGames();
}

function showLogin() {
    showSection('login-section');
}

function showUpload() {
    if (!currentUser) {
        alert('Please login to upload games.');
        showLogin();
        return;
    }
    showSection('upload-section');
}

function showProfile() {
    if (!currentUser) {
        alert('Please login to view your profile.');
        showLogin();
        return;
    }
    showSection('profile-section');
    loadUserProfile();
}

function showAdmin() {
    if (!currentUser || !currentUser.isAdmin) {
        alert('Access denied. Admin privileges required.');
        showHome();
        return;
    }
    showSection('admin-section');
    loadAdminData();
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active');
}

// Authentication Functions
function toggleAuthMode() {
    isAuthMode = isAuthMode === 'login' ? 'signup' : 'login';
    
    const authTitle = document.getElementById('auth-title');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const signupFields = document.getElementById('signup-fields');
    const authSwitchText = document.getElementById('auth-switch-text');
    const authSwitchLink = document.getElementById('auth-switch-link');
    
    if (isAuthMode === 'signup') {
        authTitle.textContent = 'Sign Up';
        authSubmitBtn.textContent = 'Sign Up';
        signupFields.style.display = 'block';
        authSwitchText.textContent = 'Already have an account?';
        authSwitchLink.textContent = 'Login';
    } else {
        authTitle.textContent = 'Login';
        authSubmitBtn.textContent = 'Login';
        signupFields.style.display = 'none';
        authSwitchText.textContent = "Don't have an account?";
        authSwitchLink.textContent = 'Sign Up';
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    
    if (isAuthMode === 'login') {
        handleLogin();
    } else {
        handleSignup();
    }
}

function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        saveCurrentUser(user);
        updateNavigation();
        showHome();
        showSuccessMessage('Login successful!');
        
        // Clear form
        document.getElementById('auth-form').reset();
    } else {
        showErrorMessage('Invalid username or password.');
    }
}

function handleSignup() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('login-password').value;
    
    // Validation
    if (!username || !email || !password) {
        showErrorMessage('Please fill in all fields.');
        return;
    }
    
    if (password.length < 6) {
        showErrorMessage('Password must be at least 6 characters long.');
        return;
    }
    
    const users = getUsers();
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
        showErrorMessage('Username already exists.');
        return;
    }
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showErrorMessage('Email already exists.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateId(),
        username: username,
        email: email,
        password: password,
        isAdmin: false,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    showSuccessMessage('Account created successfully! Please login.');
    
    // Switch to login mode
    toggleAuthMode();
    document.getElementById('auth-form').reset();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('gameHub_currentUser');
    updateNavigation();
    showHome();
    showSuccessMessage('Logged out successfully!');
}

// Game Functions
function loadGames() {
    const games = getGames().filter(game => game.approved);
    displayGames(games);
}

function displayGames(gamesToDisplay) {
    const gamesGrid = document.getElementById('games-grid');
    
    if (gamesToDisplay.length === 0) {
        gamesGrid.innerHTML = '<div class="loading">No games found</div>';
        return;
    }
    
    gamesGrid.innerHTML = gamesToDisplay.map(game => `
        <div class="game-card" onclick="playGame('${game.id}')">
            <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail" 
                 onerror="this.src='https://via.placeholder.com/300x200/cccccc/666666?text=Game+Image'">
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <div class="game-meta">
                    <div class="game-uploader">
                        <i class="fas fa-user"></i>
                        ${game.uploader}
                    </div>
                    <span>${formatDate(game.uploadDate)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function searchGames() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const games = getGames().filter(game => game.approved);
    
    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm) ||
        game.uploader.toLowerCase().includes(searchTerm)
    );
    
    displayGames(filteredGames);
}

function playGame(gameId) {
    const game = getGames().find(g => g.id === gameId);
    if (!game) return;
    
    const modal = document.getElementById('game-modal');
    const gamePlayer = document.getElementById('game-player');
    
    gamePlayer.innerHTML = `
        <div style="text-align: center;">
            <h3>${game.title}</h3>
            <p style="margin: 1rem 0; color: #666;">${game.description}</p>
            <p style="margin-bottom: 1rem;">
                <strong>Created by:</strong> ${game.uploader}
            </p>
            <iframe src="${game.link}" 
                    title="${game.title}"
                    style="width: 100%; height: 400px; border: none; border-radius: 10px;"
                    onerror="this.innerHTML='<p>Unable to load game. Please check the game link.</p>'">
            </iframe>
            <p style="margin-top: 1rem;">
                <a href="${game.link}" target="_blank" class="btn-small" style="display: inline-block; padding: 0.5rem 1rem; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">
                    <i class="fas fa-external-link-alt"></i> Open in New Tab
                </a>
            </p>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeGameModal() {
    document.getElementById('game-modal').style.display = 'none';
}

function handleGameUpload(e) {
    e.preventDefault();
    
    const title = document.getElementById('game-title').value;
    const description = document.getElementById('game-description').value;
    const link = document.getElementById('game-link').value;
    const thumbnail = document.getElementById('game-thumbnail').value;
    
    // Validation
    if (!title || !description || !link || !thumbnail) {
        showErrorMessage('Please fill in all fields.');
        return;
    }
    
    // Create new game
    const newGame = {
        id: generateId(),
        title: title,
        description: description,
        link: link,
        thumbnail: thumbnail,
        uploader: currentUser.username,
        uploadDate: new Date().toISOString(),
        approved: !currentUser.isAdmin // Auto-approve admin uploads, others need approval
    };
    
    const games = getGames();
    games.push(newGame);
    saveGames(games);
    
    showSuccessMessage('Game uploaded successfully! ' + 
        (!newGame.approved ? 'It will be visible after admin approval.' : ''));
    
    // Clear form
    document.getElementById('upload-form').reset();
    
    // Refresh games if approved
    if (newGame.approved) {
        loadGames();
    }
}

// Profile Functions
function loadUserProfile() {
    document.getElementById('profile-username').textContent = currentUser.username;
    document.getElementById('profile-email').textContent = currentUser.email;
    
    const userGames = getGames().filter(game => game.uploader === currentUser.username);
    displayUserGames(userGames);
}

function displayUserGames(userGames) {
    const userGamesGrid = document.getElementById('user-games-grid');
    
    if (userGames.length === 0) {
        userGamesGrid.innerHTML = '<div class="loading">You haven\'t uploaded any games yet.</div>';
        return;
    }
    
    userGamesGrid.innerHTML = userGames.map(game => `
        <div class="game-card">
            <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail"
                 onerror="this.src='https://via.placeholder.com/300x200/cccccc/666666?text=Game+Image'">
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <div class="game-meta">
                    <span class="${game.approved ? 'text-success' : 'text-warning'}">
                        <i class="fas fa-${game.approved ? 'check-circle' : 'clock'}"></i>
                        ${game.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                    <div class="game-actions">
                        <button class="btn-small btn-edit" onclick="editGame('${game.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-small btn-delete" onclick="deleteGame('${game.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function editGame(gameId) {
    const game = getGames().find(g => g.id === gameId);
    if (!game) return;
    
    // Populate upload form with game data
    document.getElementById('game-title').value = game.title;
    document.getElementById('game-description').value = game.description;
    document.getElementById('game-link').value = game.link;
    document.getElementById('game-thumbnail').value = game.thumbnail;
    
    // Remove the old game
    deleteGame(gameId, false);
    
    // Show upload section
    showUpload();
    showSuccessMessage('Game loaded for editing. Make your changes and upload again.');
}

function deleteGame(gameId, showConfirm = true) {
    if (showConfirm && !confirm('Are you sure you want to delete this game?')) {
        return;
    }
    
    const games = getGames();
    const updatedGames = games.filter(game => game.id !== gameId);
    saveGames(updatedGames);
    
    if (showConfirm) {
        showSuccessMessage('Game deleted successfully.');
    }
    
    // Refresh current view
    if (document.getElementById('profile-section').classList.contains('active')) {
        loadUserProfile();
    } else if (document.getElementById('admin-section').classList.contains('active')) {
        loadAdminData();
    } else {
        loadGames();
    }
}

// Admin Functions
function loadAdminData() {
    loadAdminGames();
    loadAdminUsers();
}

function showAdminTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide tab content
    const tabContents = document.querySelectorAll('.admin-tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(`admin-${tabName}`).classList.add('active');
    
    // Load appropriate data
    if (tabName === 'games') {
        loadAdminGames();
    } else if (tabName === 'users') {
        loadAdminUsers();
    }
}

function loadAdminGames() {
    const games = getGames();
    const adminGamesList = document.getElementById('admin-games-list');
    
    if (games.length === 0) {
        adminGamesList.innerHTML = '<div class="loading">No games found.</div>';
        return;
    }
    
    adminGamesList.innerHTML = games.map(game => `
        <div class="admin-item">
            <div class="admin-item-info">
                <h4>${game.title}</h4>
                <p><strong>Uploader:</strong> ${game.uploader}</p>
                <p><strong>Status:</strong> 
                    <span class="${game.approved ? 'text-success' : 'text-warning'}">
                        ${game.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                </p>
                <p><strong>Upload Date:</strong> ${formatDate(game.uploadDate)}</p>
                <p><strong>Description:</strong> ${game.description}</p>
            </div>
            <div class="admin-actions">
                ${!game.approved ? `
                    <button class="btn-small" style="background: #28a745; color: white;" onclick="approveGame('${game.id}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                ` : ''}
                <button class="btn-small btn-delete" onclick="deleteGame('${game.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
                <button class="btn-small" style="background: #6c757d; color: white;" onclick="playGame('${game.id}')">
                    <i class="fas fa-play"></i> Preview
                </button>
            </div>
        </div>
    `).join('');
}

function loadAdminUsers() {
    const users = getUsers();
    const adminUsersList = document.getElementById('admin-users-list');
    
    adminUsersList.innerHTML = users.map(user => `
        <div class="admin-item">
            <div class="admin-item-info">
                <h4>${user.username}</h4>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.isAdmin ? 'Admin' : 'User'}</p>
                <p><strong>Joined:</strong> ${formatDate(user.createdAt)}</p>
                <p><strong>Games Uploaded:</strong> ${getGames().filter(g => g.uploader === user.username).length}</p>
            </div>
            <div class="admin-actions">
                ${!user.isAdmin && user.username !== currentUser.username ? `
                    <button class="btn-small btn-delete" onclick="deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i> Delete User
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function approveGame(gameId) {
    const games = getGames();
    const game = games.find(g => g.id === gameId);
    if (game) {
        game.approved = true;
        saveGames(games);
        loadAdminGames();
        showSuccessMessage('Game approved successfully!');
    }
}

function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their games.')) {
        return;
    }
    
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Delete user's games
    const games = getGames();
    const updatedGames = games.filter(game => game.uploader !== user.username);
    saveGames(updatedGames);
    
    // Delete user
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
    
    loadAdminData();
    showSuccessMessage('User and their games deleted successfully.');
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function showSuccessMessage(message) {
    // Create and show a temporary success message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function showErrorMessage(message) {
    // Create and show a temporary error message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Add CSS for message animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
