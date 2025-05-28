document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const todoGrid = document.getElementById('todo-grid');
    const addTodoCard = document.getElementById('add-todo-card');
    const taskModal = document.getElementById('task-modal');
    const closeTaskModal = document.getElementById('close-task-modal');
    const modalTaskList = document.getElementById('modal-task-list');
    const newTaskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const modalListName = document.getElementById('modal-list-name');
    const modalListColor = document.getElementById('modal-list-color');
    const priorityOptions = document.querySelectorAll('.priority-option');
    const settingsModal = document.getElementById('settings-modal-todo');
    const closeSettingsModal = document.getElementById('close-settings-modal');
    const listSettingsForm = document.getElementById('list-settings-form');
    const listNameInput = document.getElementById('list-name');
    const favoriteToggle = document.getElementById('favorite-toggle');
    const colorPickerSettings = document.getElementById('color-picker-settings');
    const deleteListBtn = document.getElementById('delete-list-btn');
    const viewOptions = {
        all: document.getElementById('all-view'),
        favorites: document.getElementById('favorites-view'),
        sort: document.getElementById('sort-btn'),
        filter: document.getElementById('filter-btn')
    };

    // State variables
    let currentListId = null;
    let currentView = 'all';
    let selectedPriority = 'low';
    let selectedColor = '#6c5ce7';
    let lists = [];
    let tasks = [];

    // Color options
    const colors = [
        '#6c5ce7', '#00b894', '#0984e3', '#e17055', '#fd79a8',
        '#fdcb6e', '#00cec9', '#a29bfe', '#55efc4', '#74b9ff'
    ];

    // Initialize the app
    init();

    function init() {
        loadData();
        renderTodoLists();
        setupEventListeners();
        initColorPicker();
    }

    function setupEventListeners() {
        // Add new list card
        addTodoCard.addEventListener('click', openNewListModal);

        // Task modal
        closeTaskModal.addEventListener('click', () => toggleModal(taskModal, false));
        addTaskBtn.addEventListener('click', addNewTask);
        newTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addNewTask();
        });

        // Priority selection
        priorityOptions.forEach(option => {
            option.addEventListener('click', function() {
                priorityOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectedPriority = this.dataset.priority;
            });
        });

        // Settings modal
        closeSettingsModal.addEventListener('click', () => toggleModal(settingsModal, false));
        listSettingsForm.addEventListener('submit', saveListSettings);
        deleteListBtn.addEventListener('click', deleteCurrentList);

        // View options
        viewOptions.all.addEventListener('click', () => {
            currentView = 'all';
            updateViewButtons();
            renderTodoLists();
        });
        viewOptions.favorites.addEventListener('click', () => {
            currentView = 'favorites';
            updateViewButtons();
            renderTodoLists();
        });
        viewOptions.sort.addEventListener('click', showSortOptions);
        viewOptions.filter.addEventListener('click', showFilterOptions);
    }

    function initColorPicker() {
        colorPickerSettings.innerHTML = '';
        colors.forEach(color => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color;
            colorOption.dataset.color = color;
            
            if (color === selectedColor) {
                colorOption.classList.add('selected');
            }
            
            colorOption.addEventListener('click', function() {
                colorPickerSettings.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
                selectedColor = this.dataset.color;
            });
            
            colorPickerSettings.appendChild(colorOption);
        });
    }

    function loadData() {
        // Load lists from localStorage
        const savedLists = localStorage.getItem('todoLists');
        if (savedLists) {
            lists = JSON.parse(savedLists);
        } else {
            // Default lists if none exist
            lists = [
                {
                    id: generateId(),
                    name: 'Personal Tasks',
                    color: '#6c5ce7',
                    favorite: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: generateId(),
                    name: 'Work Projects',
                    color: '#0984e3',
                    favorite: true,
                    createdAt: new Date().toISOString()
                }
            ];
            saveLists();
        }

        // Load tasks from localStorage
        const savedTasks = localStorage.getItem('todoTasks');
        tasks = savedTasks ? JSON.parse(savedTasks) : [];
    }

    function saveLists() {
        localStorage.setItem('todoLists', JSON.stringify(lists));
    }

    function saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }

    function renderTodoLists() {
        todoGrid.innerHTML = '';
        
        // Filter lists based on current view
        const filteredLists = currentView === 'favorites' 
            ? lists.filter(list => list.favorite)
            : lists;

        if (filteredLists.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-tasks"></i>
                <h3>No ${currentView === 'favorites' ? 'favorite' : ''} lists yet</h3>
                <p>Create a new list to get started</p>
            `;
            todoGrid.appendChild(emptyState);
        } else {
            filteredLists.forEach(list => {
                const listCard = createListCard(list);
                todoGrid.appendChild(listCard);
            });
        }

        // Always show the add card at the end
        todoGrid.appendChild(addTodoCard);
    }

    function createListCard(list) {
        const card = document.createElement('div');
        card.className = 'todo-card';
        card.dataset.listId = list.id;
        
        // Count tasks for this list
        const taskCount = tasks.filter(task => task.listId === list.id).length;
        const completedCount = tasks.filter(task => task.listId === list.id && task.completed).length;

        card.innerHTML = `
            <div class="todo-card-header">
                <h3 class="todo-card-title">${list.name}</h3>
                <span class="todo-card-count">${completedCount}/${taskCount}</span>
            </div>
            <div class="todo-card-footer">
                <div class="todo-card-date">
                    <i class="far fa-calendar"></i>
                    ${formatDate(list.createdAt)}
                </div>
                <button class="task-btn settings-btn" data-action="settings">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
        `;

        // Set the color indicator
        card.style.borderLeft = `5px solid ${list.color}`;

        // Add event listeners
        card.addEventListener('click', (e) => {
            if (!e.target.closest('[data-action="settings"]')) {
                openTaskModal(list.id);
            }
        });

        const settingsBtn = card.querySelector('[data-action="settings"]');
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openSettingsModal(list.id);
        });

        return card;
    }

    function openTaskModal(listId) {
        currentListId = listId;
        const list = lists.find(l => l.id === listId);
    
        if (!list) return;
    
        // Update modal header with color
        modalListName.textContent = list.name;
        modalListColor.style.backgroundColor = list.color;
    
        // Set the banner color dynamically
        document.documentElement.style.setProperty('--selected-color', list.color);
    
        // Rest of the function remains the same...
        renderTasks(listId);
        newTaskInput.value = '';
        priorityOptions[0].click();
        toggleModal(taskModal, true);
    }

    function renderTasks(listId) {
        modalTaskList.innerHTML = '';
        
        const listTasks = tasks
            .filter(task => task.listId === listId)
            .sort((a, b) => {
                // Sort by priority (high first) then by creation date
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority] || 
                       new Date(a.createdAt) - new Date(b.createdAt);
            });
        
        if (listTasks.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-tasks"></i>
                <h3>No tasks yet</h3>
                <p>Add your first task to get started</p>
            `;
            modalTaskList.appendChild(emptyState);
            return;
        }
        
        listTasks.forEach(task => {
            const taskItem = createTaskItem(task);
            modalTaskList.appendChild(taskItem);
        });
    }

    function createTaskItem(task) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.dataset.taskId = task.id;
        
        const priorityClass = task.priority || 'low';
        const isCompleted = task.completed || false;
        
        taskItem.innerHTML = `
            <div class="task-check ${isCompleted ? 'checked' : ''}" data-action="toggle">
                <i class="fas fa-${isCompleted ? 'check-circle' : 'circle'}"></i>
            </div>
            <div class="task-content">
                <div class="task-text ${isCompleted ? 'completed' : ''}">${task.text}</div>
                ${task.priority ? `
                <div class="task-meta">
                    <span class="task-priority ${priorityClass}"></span>
                    ${task.priority}
                </div>
                ` : ''}
            </div>
            <div class="task-actions">
                <button class="task-btn" data-action="edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn" data-action="delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners
        const toggleBtn = taskItem.querySelector('[data-action="toggle"]');
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleTaskComplete(task.id);
        });
        
        const editBtn = taskItem.querySelector('[data-action="edit"]');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editTask(task.id);
        });
        
        const deleteBtn = taskItem.querySelector('[data-action="delete"]');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });
        
        return taskItem;
    }

    function addNewTask() {
        const taskText = newTaskInput.value.trim();
        if (!taskText || !currentListId) return;
        
        const newTask = {
            id: generateId(),
            listId: currentListId,
            text: taskText,
            priority: selectedPriority,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        saveTasks();
        
        // Render the new task
        renderTasks(currentListId);
        
        // Clear input
        newTaskInput.value = '';
        newTaskInput.focus();
        
        // Update the list cards
        renderTodoLists();
    }

    function toggleTaskComplete(taskId) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;
        
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks(currentListId);
        renderTodoLists();
    }

    function editTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks(currentListId);
        }
    }

    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(t => t.id !== taskId);
            saveTasks();
            renderTasks(currentListId);
            renderTodoLists();
        }
    }

    function openNewListModal() {
        currentListId = null;
        listNameInput.value = '';
        favoriteToggle.checked = false;
        selectedColor = '#6c5ce7';
        initColorPicker();
        toggleModal(settingsModal, true);
    }

    function openSettingsModal(listId) {
        currentListId = listId;
        const list = lists.find(l => l.id === listId);
        if (!list) return;
        
        listNameInput.value = list.name;
        favoriteToggle.checked = list.favorite || false;
        selectedColor = list.color;
        initColorPicker();
        toggleModal(settingsModal, true);
    }

    function saveListSettings(e) {
        e.preventDefault();
        
        const listName = listNameInput.value.trim();
        if (!listName) return;
        
        if (currentListId) {
            // Update existing list
            const listIndex = lists.findIndex(l => l.id === currentListId);
            if (listIndex !== -1) {
                lists[listIndex].name = listName;
                lists[listIndex].color = selectedColor;
                lists[listIndex].favorite = favoriteToggle.checked;
                saveLists();
            }
        } else {
            // Create new list
            const newList = {
                id: generateId(),
                name: listName,
                color: selectedColor,
                favorite: favoriteToggle.checked,
                createdAt: new Date().toISOString()
            };
            lists.push(newList);
            saveLists();
        }
        
        toggleModal(settingsModal, false);
        renderTodoLists();
    }

    function deleteCurrentList() {
        if (!currentListId) return;
        
        if (confirm('Are you sure you want to delete this list and all its tasks?')) {
            // Delete the list
            lists = lists.filter(l => l.id !== currentListId);
            saveLists();
            
            // Delete associated tasks
            tasks = tasks.filter(t => t.listId !== currentListId);
            saveTasks();
            
            toggleModal(settingsModal, false);
            toggleModal(taskModal, false);
            renderTodoLists();
        }
    }

    function updateViewButtons() {
        viewOptions.all.classList.toggle('active', currentView === 'all');
        viewOptions.favorites.classList.toggle('active', currentView === 'favorites');
    }

    function showSortOptions() {
        // In a real app, you would implement sorting logic
        alert('Sort options would appear here');
    }

    function showFilterOptions() {
        // In a real app, you would implement filtering logic
        alert('Filter options would appear here');
    }

    function toggleModal(modal, show) {
        if (show) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            // Reset the color when closing
            document.documentElement.style.removeProperty('--selected-color');
        }
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
});