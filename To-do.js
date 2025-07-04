let tasks = [];
        let currentFilter = 'all';

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            loadTasks();
            loadTheme();
            updateStats();
            renderTasks();
        });

        function toggleTheme() {
            const body = document.body;
            const isDark = body.classList.contains('dark-mode');
            
            if (isDark) {
                body.classList.remove('dark-mode');
                saveTheme('light');
            } else {
                body.classList.add('dark-mode');
                saveTheme('dark');
            }
        }

        function saveTheme(theme) {
            // In a real app, this would save to localStorage
            // For this demo, we'll just store in memory
            window.currentTheme = theme;
        }

        function loadTheme() {
            // In a real app, this would load from localStorage
            // For this demo, we'll start with light theme
            const savedTheme = window.currentTheme || 'light';
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
            }
        }

        // Add task on Enter key press
        document.getElementById('taskInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        function addTask() {
            const taskInput = document.getElementById('taskInput');
            const prioritySelect = document.getElementById('prioritySelect');
            const taskText = taskInput.value.trim();

            if (taskText === '') {
                taskInput.focus();
                return;
            }

            const newTask = {
                id: Date.now(),
                text: taskText,
                priority: prioritySelect.value,
                completed: false,
                createdAt: new Date().toISOString()
            };

            tasks.push(newTask);
            saveTasks();
            updateStats();
            renderTasks();

            // Clear input and focus
            taskInput.value = '';
            taskInput.focus();
        }

        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                saveTasks();
                updateStats();
                renderTasks();
            }
        }

        function deleteTask(id) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            updateStats();
            renderTasks();
        }

        function filterTasks(filter) {
            currentFilter = filter;
            
            // Update active filter button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            renderTasks();
        }

        function renderTasks() {
            const todoList = document.getElementById('todoList');
            let filteredTasks = tasks;

            // Apply filter
            switch (currentFilter) {
                case 'pending':
                    filteredTasks = tasks.filter(t => !t.completed);
                    break;
                case 'completed':
                    filteredTasks = tasks.filter(t => t.completed);
                    break;
                case 'high':
                    filteredTasks = tasks.filter(t => t.priority === 'high');
                    break;
                case 'medium':
                    filteredTasks = tasks.filter(t => t.priority === 'medium');
                    break;
                case 'low':
                    filteredTasks = tasks.filter(t => t.priority === 'low');
                    break;
            }

            // Sort by priority (high -> medium -> low) and then by creation date
            filteredTasks.sort((a, b) => {
                const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            if (filteredTasks.length === 0) {
                todoList.innerHTML = `
                    <div class="empty-state">
                        <div style="font-size: 4rem; margin-bottom: 20px;">📝</div>
                        <h3>No tasks found!</h3>
                        <p>${currentFilter === 'all' ? 'Add your first task above to get started.' : `No ${currentFilter} tasks available.`}</p>
                    </div>
                `;
                return;
            }

            todoList.innerHTML = filteredTasks.map(task => `
                <div class="todo-item ${task.completed ? 'completed' : ''}">
                    <div class="todo-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
                    <div class="todo-text">${task.text}</div>
                    <div class="priority-badge priority-${task.priority}">${task.priority}</div>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `).join('');
        }

        function updateStats() {
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => t.completed).length;
            const pendingTasks = totalTasks - completedTasks;

            document.getElementById('totalTasks').textContent = totalTasks;
            document.getElementById('completedTasks').textContent = completedTasks;
            document.getElementById('pendingTasks').textContent = pendingTasks;
        }

        function saveTasks() {
            // In a real app, this would save to localStorage or a database
            // For this demo, we'll just store in memory
        }

        function loadTasks() {
            // In a real app, this would load from localStorage or a database
            // For this demo, we'll start with empty tasks
        }