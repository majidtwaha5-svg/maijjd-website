/**
 * Maijd AI Software Hub - Main JavaScript File
 * Handles all interactive functionality, API calls, and real-time updates
 */

class MaijdAIHub {
    constructor() {
        this.projects = [];
        this.aiAssistants = [];
        this.teamMembers = [];
        this.socket = null;
        this.charts = {};
        
        this.init();
    }
    
    async init() {
        try {
            // Initialize Socket.IO connection
            this.initSocketIO();
            
            // Load initial data
            await this.loadAllData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize charts
            this.initCharts();
            
            console.log('Maijd AI Hub initialized successfully');
        } catch (error) {
            console.error('Failed to initialize AI Hub:', error);
            this.showNotification('Failed to initialize application', 'error');
        }
    }
    
    initSocketIO() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Connected to AI Hub server');
            this.showNotification('Connected to server', 'success');
        });
        
        this.socket.on('disconnect', () => {
            console.log('Disconnected from AI Hub server');
            this.showNotification('Disconnected from server', 'warning');
        });
        
        this.socket.on('project_updated', (data) => {
            this.handleProjectUpdate(data);
        });
        
        this.socket.on('project_created', (data) => {
            this.handleProjectCreated(data);
        });
        
        this.socket.on('ai_assistant_update', (data) => {
            this.handleAIAssistantUpdate(data);
        });
        
        this.socket.on('team_member_update', (data) => {
            this.handleTeamMemberUpdate(data);
        });
    }
    
    async loadAllData() {
        try {
            const [projects, assistants, team] = await Promise.all([
                this.fetchProjects(),
                this.fetchAIAssistants(),
                this.fetchTeamMembers()
            ]);
            
            this.projects = projects;
            this.aiAssistants = assistants;
            this.teamMembers = team;
            
            this.updateDashboard();
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }
    
    async fetchProjects() {
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) throw new Error('Failed to fetch projects');
            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    }
    
    async fetchAIAssistants() {
        try {
            const response = await fetch('/api/ai-assistants');
            if (!response.ok) throw new Error('Failed to fetch AI assistants');
            return await response.json();
        } catch (error) {
            console.error('Error fetching AI assistants:', error);
            return [];
        }
    }
    
    async fetchTeamMembers() {
        try {
            const response = await fetch('/api/team-members');
            if (!response.ok) throw new Error('Failed to fetch team members');
            return await response.json();
        } catch (error) {
            console.error('Error fetching team members:', error);
            return [];
        }
    }
    
    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('closed');
            });
        }
        
        // New project button
        const newProjectBtn = document.getElementById('new-project-btn');
        const newProjectModal = document.getElementById('new-project-modal');
        if (newProjectBtn && newProjectModal) {
            newProjectBtn.addEventListener('click', () => {
                newProjectModal.classList.add('show');
            });
        }
        
        // Close modal buttons
        const closeButtons = document.querySelectorAll('[id*="close"]');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) modal.classList.remove('show');
            });
        });
        
        // Cancel buttons
        const cancelButtons = document.querySelectorAll('[id*="cancel"]');
        cancelButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) modal.classList.remove('show');
            });
        });
        
        // AI chat toggle
        const aiChatToggle = document.getElementById('ai-chat-toggle');
        const aiChatModal = document.getElementById('ai-chat-modal');
        if (aiChatToggle && aiChatModal) {
            aiChatToggle.addEventListener('click', () => {
                aiChatModal.classList.add('show');
            });
        }
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
        
        // New project form
        const newProjectForm = document.getElementById('new-project-form');
        if (newProjectForm) {
            newProjectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewProject(e);
            });
        }
        
        // Chat form
        const chatForm = document.getElementById('chat-form');
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleChatMessage(e);
            });
        }
        
        // Start building button
        const startBuildingBtn = document.getElementById('start-building-btn');
        if (startBuildingBtn) {
            startBuildingBtn.addEventListener('click', () => {
                document.getElementById('new-project-modal').classList.add('show');
            });
        }
    }
    
    async handleNewProject(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        const projectData = {
            name: formData.get('project-name') || document.getElementById('project-name').value,
            description: formData.get('project-description') || document.getElementById('project-description').value,
            category: formData.get('project-category') || document.getElementById('project-category').value,
            timeline_days: parseInt(formData.get('project-timeline') || document.getElementById('project-timeline').value),
            budget: parseFloat(formData.get('project-budget') || document.getElementById('project-budget').value)
        };
        
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            });
            
            if (response.ok) {
                const newProject = await response.json();
                this.projects.push(newProject);
                this.updateDashboard();
                
                // Close modal and reset form
                document.getElementById('new-project-modal').classList.remove('show');
                form.reset();
                
                this.showNotification('Project created successfully!', 'success');
                
                // Emit socket event
                if (this.socket) {
                    this.socket.emit('project_created', newProject);
                }
            } else {
                throw new Error('Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            this.showNotification('Failed to create project. Please try again.', 'error');
        }
    }
    
    async handleChatMessage(e) {
        const form = e.target;
        const input = form.querySelector('input[type="text"]');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addChatMessage('user', message);
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Simulate AI response (replace with actual API call)
            setTimeout(() => {
                const aiResponse = this.generateAIResponse(message);
                this.addChatMessage('ai', aiResponse);
                this.hideTypingIndicator();
            }, 1500);
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.hideTypingIndicator();
            this.addChatMessage('ai', 'Sorry, I encountered an error. Please try again.');
        }
    }
    
    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-4 ${sender === 'user' ? 'text-right' : 'text-left'}`;
        
        const messageBubble = document.createElement('div');
        messageBubble.className = `inline-block p-3 rounded-lg max-w-xs ${
            sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-800 border border-gray-200'
        }`;
        messageBubble.textContent = message;
        
        messageDiv.appendChild(messageBubble);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    generateAIResponse(message) {
        const responses = [
            "I can help you with that! Let me analyze your requirements and provide guidance.",
            "That's a great question about software development. Here's what I recommend...",
            "Based on your project needs, I suggest implementing the following approach...",
            "I can assist you with the technical implementation. Let's break this down step by step.",
            "For optimal performance and scalability, consider these best practices...",
            "I'll help you design a robust architecture for your software project.",
            "Let me provide you with some code examples and implementation strategies.",
            "I can guide you through the development lifecycle and best practices.",
            "That's an interesting challenge! Here are some proven solutions...",
            "I can help optimize your development workflow and improve productivity."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.add('show');
        }
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.remove('show');
        }
    }
    
    updateDashboard() {
        this.updateStats();
        this.updateProjectsGrid();
        this.updateAIAssistants();
        this.updateTeam();
        this.updateCharts();
    }
    
    updateStats() {
        const totalProjects = document.getElementById('total-projects');
        const totalAssistants = document.getElementById('total-assistants');
        const totalTeam = document.getElementById('total-team');
        const activeProjects = document.getElementById('active-projects');
        
        if (totalProjects) totalProjects.textContent = this.projects.length;
        if (totalAssistants) totalAssistants.textContent = this.aiAssistants.length;
        if (totalTeam) totalTeam.textContent = this.teamMembers.length;
        if (activeProjects) activeProjects.textContent = this.projects.filter(p => p.status !== 'completed').length;
    }
    
    updateProjectsGrid() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;
        
        projectsGrid.innerHTML = '';
        
        this.projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    }
    
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer';
        card.onclick = () => this.showProjectDetails(project);
        
        const statusClass = `status-${project.status}`;
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-semibold text-gray-800">${project.name}</h3>
                <span class="status-badge ${statusClass}">${project.status}</span>
            </div>
            <p class="text-gray-600 mb-4">${project.description}</p>
            <div class="flex justify-between items-center mb-4">
                <span class="text-sm text-gray-500">${project.category}</span>
                <span class="text-sm text-gray-500">$${project.budget}</span>
            </div>
            <div class="mb-4">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>${project.progress_percentage}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${project.progress_percentage}%"></div>
                </div>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
                <span>${project.timeline_days} days</span>
                <span>${project.team_members.length} members</span>
            </div>
        `;
        
        return card;
    }
    
    updateAIAssistants() {
        const grid = document.getElementById('ai-assistants-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        this.aiAssistants.forEach(assistant => {
            const assistantCard = document.createElement('div');
            assistantCard.className = 'bg-white p-6 rounded-xl shadow-lg border border-gray-100';
            
            assistantCard.innerHTML = `
                <div class="text-center mb-4">
                    <i class="fas fa-robot text-4xl text-purple-600"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 text-center mb-2">${assistant.name}</h3>
                <p class="text-gray-600 text-center mb-4">${assistant.specialization}</p>
                <div class="text-center">
                    <span class="inline-block px-3 py-1 rounded-full text-sm ${
                        assistant.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }">
                        ${assistant.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            `;
            
            grid.appendChild(assistantCard);
        });
    }
    
    updateTeam() {
        const grid = document.getElementById('team-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        this.teamMembers.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center';
            
            memberCard.innerHTML = `
                <div class="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i class="fas fa-user text-2xl text-gray-600"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-1">${member.name}</h3>
                <p class="text-gray-600 mb-2">${member.role}</p>
                <p class="text-sm text-gray-500">$${member.hourly_rate}/hr</p>
            `;
            
            grid.appendChild(memberCard);
        });
    }
    
    initCharts() {
        this.updateCharts();
    }
    
    updateCharts() {
        this.updateProgressChart();
        this.updateStatusChart();
    }
    
    updateProgressChart() {
        const canvas = document.getElementById('progress-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.progress) {
            this.charts.progress.destroy();
        }
        
        this.charts.progress = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.projects.map(p => p.name),
                datasets: [{
                    label: 'Progress %',
                    data: this.projects.map(p => p.progress_percentage),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    updateStatusChart() {
        const canvas = document.getElementById('status-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.status) {
            this.charts.status.destroy();
        }
        
        const statusCounts = {};
        this.projects.forEach(p => {
            statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
        });
        
        this.charts.status = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#fbbf24',
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#8b5cf6',
                        '#059669'
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });
    }
    
    showProjectDetails(project) {
        const modal = document.getElementById('project-details-modal');
        const title = document.getElementById('project-details-title');
        const content = document.getElementById('project-details-content');
        
        if (!modal || !title || !content) return;
        
        title.textContent = project.name;
        
        content.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">Project Information</h4>
                    <div class="space-y-2">
                        <p><strong>Description:</strong> ${project.description}</p>
                        <p><strong>Category:</strong> ${project.category}</p>
                        <p><strong>Status:</strong> <span class="status-badge status-${project.status}">${project.status}</span></p>
                        <p><strong>Budget:</strong> $${project.budget}</p>
                        <p><strong>Timeline:</strong> ${project.timeline_days} days</p>
                        <p><strong>Progress:</strong> ${project.progress_percentage}%</p>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">Team & AI Assistants</h4>
                    <div class="space-y-2">
                        <p><strong>Team Members:</strong> ${project.team_members.length}</p>
                        <p><strong>AI Assistants:</strong> ${project.ai_assistants.length}</p>
                        <p><strong>Created:</strong> ${project.created_date}</p>
                        <p><strong>Updated:</strong> ${project.updated_date}</p>
                    </div>
                    
                    <h4 class="text-lg font-semibold text-gray-800 mb-2 mt-4">Tech Stack</h4>
                    <div class="flex flex-wrap gap-2">
                        ${(project.tech_stack || []).map(tech => `<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="mt-6">
                <h4 class="text-lg font-semibold text-gray-800 mb-2">Requirements</h4>
                <ul class="list-disc list-inside space-y-1 text-gray-600">
                    ${(project.requirements || []).map(req => `<li>${req}</li>`).join('')}
                </ul>
            </div>
        `;
        
        modal.classList.add('show');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            type === 'warning' ? 'bg-yellow-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Socket event handlers
    handleProjectUpdate(data) {
        const index = this.projects.findIndex(p => p.id === data.id);
        if (index !== -1) {
            this.projects[index] = data;
            this.updateDashboard();
        }
    }
    
    handleProjectCreated(data) {
        this.projects.push(data);
        this.updateDashboard();
    }
    
    handleAIAssistantUpdate(data) {
        const index = this.aiAssistants.findIndex(a => a.id === data.id);
        if (index !== -1) {
            this.aiAssistants[index] = data;
            this.updateAIAssistants();
        }
    }
    
    handleTeamMemberUpdate(data) {
        const index = this.teamMembers.findIndex(t => t.id === data.id);
        if (index !== -1) {
            this.teamMembers[index] = data;
            this.updateTeam();
        }
    }
}

// Initialize the AI Hub when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiHub = new MaijdAIHub();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaijdAIHub;
}
