// Haupt-Initialisierung der App
class WGTaskManager {
    constructor() {
        this.currentView = 'dashboard';
        this.currentTaskId = null;
        this.currentRoommateId = null;
        this.init();
    }

    init() {
        // Initialisiere Storage
        this.initStorage();

        // Lade Initialdaten
        this.loadData();

        // Event-Listener einrichten
        this.setupEventListeners();

        // Zeige erste View
        this.showView(this.currentView);

        console.log('WG TaskManager initialized successfully');
    }

    initStorage() {
        // Initialisiere Standarddaten, falls nicht vorhanden
        if (!localStorage.getItem('wg_tasks')) {
            this.resetData();
        }
    }

    resetData() {
        // Standardaufgaben
        const defaultTasks = [
            {
                id: '1',
                title: 'Küche putzen',
                description: 'Küche komplett reinigen, inklusive Boden wischen',
                category: 'cleaning',
                priority: 'medium',
                assignee: '1',
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Wochenendeinkauf',
                description: 'Einkaufsliste liegt auf dem Kühlschrank',
                category: 'shopping',
                priority: 'high',
                assignee: '2',
                dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                completed: false,
                createdAt: new Date().toISOString()
            }
        ];

        // Standard-Mitbewohner
        const defaultRoommates = [
            {
                id: '1',
                name: 'Max Thomson',
                email: 'max@example.com',
                phone: '0123 456789',
                avatar: 'https://ui-avatars.com/api/?name=Max+Mustermann&background=8e0b76&color=fff'
            },
            {
                id: '2',
                name: 'Anna Jefferson',
                email: 'anna@example.com',
                phone: '0987 654321',
                avatar: 'https://ui-avatars.com/api/?name=Anna+Beispiel&background=8e0b76&color=fff'
            }
        ];

        // Standard-Einstellungen
        const defaultSettings = {
            notifications: true,
            reminderTime: 1
        };

        localStorage.setItem('wg_tasks', JSON.stringify(defaultTasks));
        localStorage.setItem('wg_roommates', JSON.stringify(defaultRoommates));
        localStorage.setItem('wg_settings', JSON.stringify(defaultSettings));
    }

    getTasks() {
        return JSON.parse(localStorage.getItem('wg_tasks') || '[]');
    }

    saveTasks(tasks) {
        localStorage.setItem('wg_tasks', JSON.stringify(tasks));
    }

    getTask(id) {
        const tasks = this.getTasks();
        return tasks.find(task => task.id === id);
    }

    saveTask(taskData) {
        const tasks = this.getTasks();

        if (taskData.id) {
            // Vorhandene Aufgabe aktualisieren
            const index = tasks.findIndex(task => task.id === taskData.id);
            if (index !== -1) {
                tasks[index] = { ...tasks[index], ...taskData };
            }
        } else {
            // Neue Aufgabe erstellen
            taskData.id = Date.now().toString();
            taskData.createdAt = new Date().toISOString();
            taskData.completed = false;
            tasks.push(taskData);
        }

        this.saveTasks(tasks);
        return taskData;
    }

    deleteTask(id) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        this.saveTasks(filteredTasks);
    }

    toggleTaskCompletion(id) {
        const tasks = this.getTasks();
        const task = tasks.find(task => task.id === id);

        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks(tasks);
        }
    }

    getRoommates() {
        return JSON.parse(localStorage.getItem('wg_roommates') || '[]');
    }

    saveRoommates(roommates) {
        localStorage.setItem('wg_roommates', JSON.stringify(roommates));
    }

    getRoommate(id) {
        const roommates = this.getRoommates();
        return roommates.find(roommate => roommate.id === id);
    }

    saveRoommate(roommateData) {
        const roommates = this.getRoommates();

        if (roommateData.id) {
            // Vorhandenen Mitbewohner aktualisieren
            const index = roommates.findIndex(roommate => roommate.id === roommateData.id);
            if (index !== -1) {
                roommates[index] = { ...roommates[index], ...roommateData };
            }
        } else {
            // Neuen Mitbewohner erstellen
            roommateData.id = Date.now().toString();
            roommateData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(roommateData.name)}&background=8e0b76&color=fff`;
            roommates.push(roommateData);
        }

        this.saveRoommates(roommates);
        return roommateData;
    }

    deleteRoommate(id) {
        const roommates = this.getRoommates();
        const filteredRoommates = roommates.filter(roommate => roommate.id !== id);
        this.saveRoommates(filteredRoommates);

        // Entferne Zuordnungen in Aufgaben
        const tasks = this.getTasks();
        const updatedTasks = tasks.map(task => {
            if (task.assignee === id) {
                return { ...task, assignee: null };
            }
            return task;
        });
        this.saveTasks(updatedTasks);
    }

    getSettings() {
        const defaultSettings = {
            notifications: true,
            reminderTime: 1 // Tage
        };

        return JSON.parse(localStorage.getItem('wg_settings') || JSON.stringify(defaultSettings));
    }

    saveSettings(settings) {
        localStorage.setItem('wg_settings', JSON.stringify(settings));
    }

    loadData() {
        // Lade Aufgaben und Mitbewohner
        const tasks = this.getTasks();
        const roommates = this.getRoommates();

        // Fülle Filter-Dropdowns
        this.populateAssigneeFilter(roommates);
        this.updateDashboardStats(tasks, roommates);
    }

    populateAssigneeFilter(roommates) {
        const assigneeFilter = document.getElementById('assignee-filter');
        assigneeFilter.innerHTML = '<option value="all">Alle</option>';

        roommates.forEach(roommate => {
            const option = document.createElement('option');
            option.value = roommate.id;
            option.textContent = roommate.name;
            assigneeFilter.appendChild(option);
        });
    }

    updateDashboardStats(tasks, roommates) {
        const pendingTasks = tasks.filter(task => !task.completed && !this.isOverdue(task)).length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const overdueTasks = tasks.filter(task => !task.completed && this.isOverdue(task)).length;

        document.getElementById('pending-tasks').textContent = pendingTasks;
        document.getElementById('completed-tasks').textContent = completedTasks;
        document.getElementById('roommates-count').textContent = roommates.length;
        document.getElementById('overdue-tasks').textContent = overdueTasks;

        // Zeige heute fällige Aufgaben an
        this.renderTodayTasks(tasks);

        // Zeige kommende Aufgaben an
        this.renderUpcomingTasks(tasks);
    }

    isOverdue(task) {
        if (task.completed) return false;
        if (!task.dueDate) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.dueDate);

        return dueDate < today;
    }

    renderTodayTasks(tasks) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayTasks = tasks.filter(task => {
            if (task.completed) return false;
            if (!task.dueDate) return false;

            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            return dueDate.getTime() === today.getTime();
        });

        const container = document.getElementById('today-tasks-container');

        if (todayTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <p>Keine Aufgaben für heute fällig</p>
                </div>
            `;
        } else {
            container.innerHTML = todayTasks.map(task => `
                <div class="task-item">
                    <div class="task-content">
                        <div class="task-title">
                            <span>${task.title}</span>
                            <span class="task-priority priority-${task.priority}">${this.getPriorityLabel(task.priority)}</span>
                        </div>
                        <div class="task-meta">
                            <span class="task-assignee">
                                <img src="${this.getRoommateAvatar(task.assignee)}" alt="">
                                ${this.getRoommateName(task.assignee)}
                            </span>
                            <span class="task-category">
                                <i class="fas ${this.getCategoryIcon(task.category)}"></i>
                                ${this.getCategoryLabel(task.category)}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    renderUpcomingTasks(tasks) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const upcomingTasks = tasks.filter(task => {
            if (task.completed || !task.dueDate) return false;

            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            return dueDate > today && dueDate <= nextWeek;
        }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        const container = document.getElementById('upcoming-tasks-container');

        if (upcomingTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-check"></i>
                    <p>Keine kommenden Aufgaben in der nächsten Woche</p>
                </div>
            `;
        } else {
            container.innerHTML = upcomingTasks.map(task => `
                <div class="task-item">
                    <div class="task-content">
                        <div class="task-title">
                            <span>${task.title}</span>
                            <span class="task-priority priority-${task.priority}">${this.getPriorityLabel(task.priority)}</span>
                        </div>
                        <div class="task-meta">
                            <span class="task-assignee">
                                <img src="${this.getRoommateAvatar(task.assignee)}" alt="">
                                ${this.getRoommateName(task.assignee)}
                            </span>
                            <span class="task-category">
                                <i class="fas ${this.getCategoryIcon(task.category)}"></i>
                                ${this.getCategoryLabel(task.category)}
                            </span>
                            <span class="task-due">
                                <i class="fas fa-calendar"></i>
                                ${this.formatDate(task.dueDate)}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'Kein Datum';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Ungültiges Datum';

        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    getPriorityLabel(priority) {
        const labels = {
            'low': 'Niedrig',
            'medium': 'Mittel',
            'high': 'Hoch'
        };
        return labels[priority] || priority;
    }

    getCategoryLabel(category) {
        const labels = {
            'cleaning': 'Putzen',
            'shopping': 'Einkaufen',
            'cooking': 'Kochen',
            'maintenance': 'Wartung',
            'other': 'Sonstiges'
        };
        return labels[category] || category;
    }

    getCategoryIcon(category) {
        const icons = {
            'cleaning': 'fa-broom',
            'shopping': 'fa-shopping-cart',
            'cooking': 'fa-utensils',
            'maintenance': 'fa-tools',
            'other': 'fa-star'
        };
        return icons[category] || 'fa-star';
    }

    getRoommateName(roommateId) {
        const roommate = this.getRoommate(roommateId);
        return roommate ? roommate.name : 'Unbekannt';
    }

    getRoommateAvatar(roommateId) {
        const roommate = this.getRoommate(roommateId);
        return roommate ? roommate.avatar : 'https://ui-avatars.com/api/?name=Unbekannt&background=ccc&color=fff';
    }

    setupEventListeners() {
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.getAttribute('data-view');
                this.showView(view);

                // Aktiven Zustand aktualisieren
                navItems.forEach(navItem => navItem.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Event-Listener für Filter
        document.getElementById('status-filter').addEventListener('change', () => {
            this.renderTasks();
        });

        document.getElementById('assignee-filter').addEventListener('change', () => {
            this.renderTasks();
        });

        document.getElementById('category-filter').addEventListener('change', () => {
            this.renderTasks();
        });

        // Event-Listener für Buttons
        document.getElementById('add-task-btn').addEventListener('click', () => {
            this.openTaskForm();
        });

        document.getElementById('add-roommate-btn').addEventListener('click', () => {
            this.openRoommateForm();
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('reset-data').addEventListener('click', () => {
            this.showResetConfirm();
        });

        // Event-Listener für Modals
        this.setupModalEventListeners();
    }

    setupModalEventListeners() {
        // Task Modal
        const taskModal = document.getElementById('task-modal');
        const taskForm = document.getElementById('task-form');
        const cancelTaskBtn = document.getElementById('cancel-task');

        taskModal.querySelector('.close-btn').addEventListener('click', () => {
            this.closeTaskForm();
        });

        cancelTaskBtn.addEventListener('click', () => {
            this.closeTaskForm();
        });

        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTaskFromForm();
        });

        // Roommate Modal
        const roommateModal = document.getElementById('roommate-modal');
        const roommateForm = document.getElementById('roommate-form');
        const cancelRoommateBtn = document.getElementById('cancel-roommate');

        roommateModal.querySelector('.close-btn').addEventListener('click', () => {
            this.closeRoommateForm();
        });

        cancelRoommateBtn.addEventListener('click', () => {
            this.closeRoommateForm();
        });

        roommateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveRoommateFromForm();
        });

        // Confirm Modal
        const confirmModal = document.getElementById('confirm-modal');
        const confirmCancelBtn = document.getElementById('confirm-cancel');
        const confirmOkBtn = document.getElementById('confirm-ok');

        confirmModal.querySelector('.close-btn').addEventListener('click', () => {
            this.closeConfirmModal();
        });

        confirmCancelBtn.addEventListener('click', () => {
            this.closeConfirmModal();
        });

        confirmOkBtn.addEventListener('click', () => {
            if (this.confirmCallback) {
                this.confirmCallback();
            }
            this.closeConfirmModal();
        });
    }

    showView(viewName) {
        // Verstecke alle Views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Zeige die gewählte View
        const viewElement = document.getElementById(`${viewName}-view`);
        if (viewElement) {
            viewElement.classList.add('active');
            this.currentView = viewName;

            // Aktualisiere den Seitentitel
            document.getElementById('page-title').textContent = this.getViewTitle(viewName);

            // View-spezifische Initialisierung
            this.initView(viewName);
        }
    }

    getViewTitle(viewName) {
        const titles = {
            'dashboard': 'Dashboard',
            'tasks': 'Aufgaben',
            'roommates': 'Mitbewohner',
            'settings': 'Einstellungen'
        };

        return titles[viewName] || 'WG TaskManager';
    }

    initView(viewName) {
        switch (viewName) {
            case 'tasks':
                this.renderTasks();
                break;
            case 'roommates':
                this.renderRoommates();
                break;
            case 'settings':
                this.loadSettingsToForm();
                break;
        }
    }

    loadSettingsToForm() {
        const settings = this.getSettings();

        document.getElementById('notifications').checked = settings.notifications;
        document.getElementById('reminder-time').value = settings.reminderTime.toString();
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        const container = document.getElementById('tasks-container');

        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>Keine Aufgaben gefunden</p>
                    <button class="btn btn-primary" id="create-first-task">Erste Aufgabe erstellen</button>
                </div>
            `;

            document.getElementById('create-first-task').addEventListener('click', () => {
                this.openTaskForm();
            });

            return;
        }

        container.innerHTML = filteredTasks.map(task => this.renderTaskItem(task)).join('');

        // Event-Listener für Checkboxen
        container.querySelectorAll('.task-checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                this.toggleTaskCompletion(taskId);
                this.renderTasks();
                this.loadData();

                // Animation für erledigte Aufgabe
                if (e.target.checked) {
                    e.target.closest('.task-item').classList.add('task-completed');
                }
            });
        });

        // Event-Listener für Bearbeiten-Buttons
        container.querySelectorAll('.task-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                this.openTaskForm(taskId);
            });
        });

        // Event-Listener für Löschen-Buttons
        container.querySelectorAll('.task-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                const task = this.getTask(taskId);

                this.openConfirmModal(
                    'Aufgabe löschen',
                    `Sind Sie sicher, dass Sie die Aufgabe "${task.title}" löschen möchten?`,
                    () => {
                        this.deleteTask(taskId);
                        this.renderTasks();
                        this.loadData();
                        this.showNotification('Aufgabe gelöscht', 'success');
                    }
                );
            });
        });
    }

    getFilteredTasks() {
        const allTasks = this.getTasks();
        const statusFilter = document.getElementById('status-filter').value;
        const assigneeFilter = document.getElementById('assignee-filter').value;
        const categoryFilter = document.getElementById('category-filter').value;

        return allTasks.filter(task => {
            // Status-Filter
            if (statusFilter === 'pending' && task.completed) return false;
            if (statusFilter === 'completed' && !task.completed) return false;
            if (statusFilter === 'overdue' && (!this.isOverdue(task) || task.completed)) return false;

            // Assignee-Filter
            if (assigneeFilter !== 'all' && task.assignee !== assigneeFilter) return false;

            // Kategorie-Filter
            if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

            return true;
        });
    }

    renderTaskItem(task) {
        const isOverdue = this.isOverdue(task);
        const roommate = this.getRoommate(task.assignee);

        return `
            <div class="task-item" data-task-id="${task.id}">
                <div class="task-checkbox">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                </div>
                <div class="task-content">
                    <div class="task-title">
                        <span>${task.title}</span>
                        <span class="task-priority priority-${task.priority}">
                            ${this.getPriorityLabel(task.priority)}
                        </span>
                    </div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                    <div class="task-meta">
                        <span class="task-assignee">
                            <img src="${roommate ? roommate.avatar : 'https://ui-avatars.com/api/?name=Unbekannt&background=ccc&color=fff'}" alt="">
                            ${roommate ? roommate.name : 'Unbekannt'}
                        </span>
                        <span class="task-category">
                            <i class="fas ${this.getCategoryIcon(task.category)}"></i>
                            ${this.getCategoryLabel(task.category)}
                        </span>
                        ${task.dueDate ? `
                            <span class="task-due ${isOverdue ? 'overdue' : ''}">
                                <i class="fas fa-calendar"></i>
                                ${this.formatDate(task.dueDate)}
                                ${isOverdue ? ' (Überfällig)' : ''}
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit"><i class="fas fa-edit"></i></button>
                    <button class="task-btn delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }

    renderRoommates() {
        const roommates = this.getRoommates();
        const container = document.getElementById('roommates-container');

        if (roommates.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>Keine Mitbewohner vorhanden</p>
                    <button class="btn btn-primary" id="create-first-roommate">Ersten Mitbewohner hinzufügen</button>
                </div>
            `;

            document.getElementById('create-first-roommate').addEventListener('click', () => {
                this.openRoommateForm();
            });

            return;
        }

        container.innerHTML = roommates.map(roommate => this.renderRoommateItem(roommate)).join('');

        // Event-Listener für Bearbeiten-Buttons
        container.querySelectorAll('.roommate-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const roommateId = e.target.closest('.roommate-card').dataset.roommateId;
                this.openRoommateForm(roommateId);
            });
        });

        // Event-Listener für Löschen-Buttons
        container.querySelectorAll('.roommate-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const roommateId = e.target.closest('.roommate-card').dataset.roommateId;
                const roommate = this.getRoommate(roommateId);

                this.openConfirmModal(
                    'Mitbewohner löschen',
                    `Sind Sie sicher, dass Sie ${roommate.name} löschen möchten? Alle zugewiesenen Aufgaben werden freigegeben.`,
                    () => {
                        this.deleteRoommate(roommateId);
                        this.renderRoommates();
                        this.loadData();
                        this.showNotification('Mitbewohner gelöscht', 'success');
                    }
                );
            });
        });
    }

    getRoommateStats(roommateId) {
        const allTasks = this.getTasks();
        const roommateTasks = allTasks.filter(task => task.assignee === roommateId);
        const completedTasks = roommateTasks.filter(task => task.completed).length;
        const pendingTasks = roommateTasks.filter(task => !task.completed).length;
        const overdueTasks = roommateTasks.filter(task => !task.completed && this.isOverdue(task)).length;

        return {
            total: roommateTasks.length,
            completed: completedTasks,
            pending: pendingTasks,
            overdue: overdueTasks
        };
    }

    renderRoommateItem(roommate) {
        const stats = this.getRoommateStats(roommate.id);

        return `
            <div class="roommate-card" data-roommate-id="${roommate.id}">
                <img src="${roommate.avatar}" alt="${roommate.name}" class="roommate-avatar">
                <h3 class="roommate-name">${roommate.name}</h3>
                <div class="roommate-contact">
                    ${roommate.email ? `<div><i class="fas fa-envelope"></i> ${roommate.email}</div>` : ''}
                    ${roommate.phone ? `<div><i class="fas fa-phone"></i> ${roommate.phone}</div>` : ''}
                </div>
                <div class="roommate-stats">
                    <div class="stat">
                        <div class="stat-value">${stats.total}</div>
                        <div class="stat-label">Aufgaben</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${stats.completed}</div>
                        <div class="stat-label">Erledigt</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${stats.pending}</div>
                        <div class="stat-label">Ausstehend</div>
                    </div>
                </div>
                <div class="roommate-actions">
                    <button class="btn btn-secondary roommate-btn edit"><i class="fas fa-edit"></i> Bearbeiten</button>
                    <button class="btn btn-danger roommate-btn delete"><i class="fas fa-trash"></i> Löschen</button>
                </div>
            </div>
        `;
    }

    openTaskForm(taskId = null) {
        this.currentTaskId = taskId;
        const modal = document.getElementById('task-modal');
        const title = document.getElementById('task-modal-title');
        const form = document.getElementById('task-form');

        // Formular zurücksetzen
        form.reset();

        // Titel setzen
        title.textContent = taskId ? 'Aufgabe bearbeiten' : 'Neue Aufgabe';

        // Mitbewohner-Dropdown füllen
        this.populateTaskAssignees();

        // Wenn taskId vorhanden, Formular mit Daten füllen
        if (taskId) {
            this.fillTaskForm(taskId);
        }

        // Modal anzeigen
        modal.classList.add('active');
    }

    populateTaskAssignees() {
        const assigneeSelect = document.getElementById('task-assignee');
        const roommates = this.getRoommates();

        assigneeSelect.innerHTML = '';

        roommates.forEach(roommate => {
            const option = document.createElement('option');
            option.value = roommate.id;
            option.textContent = roommate.name;
            assigneeSelect.appendChild(option);
        });

        // Leere Option falls keine Mitbewohner vorhanden
        if (roommates.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Keine Mitbewohner vorhanden';
            option.disabled = true;
            assigneeSelect.appendChild(option);
        }
    }

    fillTaskForm(taskId) {
        const task = this.getTask(taskId);

        if (task) {
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description || '';
            document.getElementById('task-category').value = task.category;
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-assignee').value = task.assignee;
            document.getElementById('task-due-date').value = task.dueDate;
        }
    }

    closeTaskForm() {
        const modal = document.getElementById('task-modal');
        modal.classList.remove('active');
    }

    saveTaskFromForm() {
        const formData = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            category: document.getElementById('task-category').value,
            priority: document.getElementById('task-priority').value,
            assignee: document.getElementById('task-assignee').value,
            dueDate: document.getElementById('task-due-date').value
        };

        // Validierung
        if (!formData.title || !formData.category || !formData.priority || !formData.assignee || !formData.dueDate) {
            this.showNotification('Bitte füllen Sie alle Pflichtfelder aus', 'error');
            return;
        }

        // Speichern
        if (this.currentTaskId) {
            formData.id = this.currentTaskId;
        }

        this.saveTask(formData);

        // UI aktualisieren
        this.renderTasks();
        this.loadData();

        // Modal schließen
        this.closeTaskForm();

        // Erfolgsmeldung
        this.showNotification(
            `Aufgabe ${this.currentTaskId ? 'aktualisiert' : 'erstellt'}`,
            'success'
        );
    }

    openRoommateForm(roommateId = null) {
        this.currentRoommateId = roommateId;
        const modal = document.getElementById('roommate-modal');
        const title = document.getElementById('roommate-modal-title');
        const form = document.getElementById('roommate-form');

        // Formular zurücksetzen
        form.reset();

        // Titel setzen
        title.textContent = roommateId ? 'Mitbewohner bearbeiten' : 'Mitbewohner hinzufügen';

        // Wenn roommateId vorhanden, Formular mit Daten füllen
        if (roommateId) {
            this.fillRoommateForm(roommateId);
        }

        // Modal anzeigen
        modal.classList.add('active');
    }

    closeRoommateForm() {
        const modal = document.getElementById('roommate-modal');
        modal.classList.remove('active');
    }

    fillRoommateForm(roommateId) {
        const roommate = this.getRoommate(roommateId);

        if (roommate) {
            document.getElementById('roommate-name').value = roommate.name;
            document.getElementById('roommate-email').value = roommate.email || '';
            document.getElementById('roommate-phone').value = roommate.phone || '';
        }
    }

    saveRoommateFromForm() {
        const formData = {
            name: document.getElementById('roommate-name').value,
            email: document.getElementById('roommate-email').value,
            phone: document.getElementById('roommate-phone').value
        };

        // Validierung
        if (!formData.name) {
            this.showNotification('Bitte geben Sie einen Namen ein', 'error');
            return;
        }

        // Speichern
        if (this.currentRoommateId) {
            formData.id = this.currentRoommateId;
        }

        this.saveRoommate(formData);

        // UI aktualisieren
        this.renderRoommates();
        this.loadData();

        // Modal schließen
        this.closeRoommateForm();

        // Erfolgsmeldung
        this.showNotification(
            `Mitbewohner ${this.currentRoommateId ? 'aktualisiert' : 'hinzugefügt'}`,
            'success'
        );
    }

    openConfirmModal(title, message, callback) {
        const modal = document.getElementById('confirm-modal');
        const titleElement = document.getElementById('confirm-modal-title');
        const messageElement = document.getElementById('confirm-message');

        // Setze Titel und Nachricht
        titleElement.textContent = title;
        messageElement.textContent = message;

        // Speichere Callback
        this.confirmCallback = callback;

        // Zeige Modal
        modal.classList.add('active');
    }

    closeConfirmModal() {
        const modal = document.getElementById('confirm-modal');
        modal.classList.remove('active');
        this.confirmCallback = null;
    }

    saveSettings() {
        const notificationsEnabled = document.getElementById('notifications').checked;
        const reminderTime = document.getElementById('reminder-time').value;

        this.saveSettings({
            notifications: notificationsEnabled,
            reminderTime: parseInt(reminderTime)
        });

        this.showNotification('Einstellungen gespeichert', 'success');
    }

    exportData() {
        const data = {
            tasks: this.getTasks(),
            roommates: this.getRoommates(),
            settings: this.getSettings(),
            exportedAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = 'wg-taskmanager-backup.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        this.showNotification('Daten exportiert', 'success');
    }

    showResetConfirm() {
        this.openConfirmModal(
            'Daten zurücksetzen',
            'Sind Sie sicher, dass Sie alle Daten zurücksetzen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
            () => {
                this.resetData();
                this.loadData();
                this.renderTasks();
                this.renderRoommates();
                this.showNotification('Daten wurden zurückgesetzt', 'success');
            }
        );
    }

    showNotification(message, type = 'info') {
        // Erstelle Notification Element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Styling
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.background = this.getNotificationColor(type);
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        notification.style.zIndex = '1000';
        notification.style.minWidth = '300px';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';

        // Schließen-Button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.marginLeft = '15px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '18px';

        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Füge Notification zum DOM hinzu
        document.body.appendChild(notification);

        // Entferne Notification nach 5 Sekunden
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            'success': '#4caf50',
            'error': '#f44336',
            'warning': '#ff9800',
            'info': '#2196f3'
        };
        return colors[type] || '#2196f3';
    }

    refreshData() {
        this.loadData();
        this.renderTasks();
        this.renderRoommates();
    }
}

// Initialisiere die App wenn das DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WGTaskManager();
});