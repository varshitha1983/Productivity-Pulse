document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        themeSystem: 'bootstrap',
        events: [],
        editable: true,
        selectable: true,
        select: function(info) {
            // Show form with pre-filled date
            document.getElementById('task-date').value = info.startStr.substring(0, 16);
            document.getElementById('task-title').focus();
        },
        eventClick: function(info) {
            // Show task details
            showTaskDetails(info.event);
        },
        eventDrop: function(info) {
            // Update task date when dragged
            updateTaskInStorage(info.event);
        },
        eventResize: function(info) {
            // Update task duration when resized
            updateTaskInStorage(info.event);
        }
    });
    
    calendar.render();
    
    // View buttons
    const viewButtons = {
        'day-view': 'timeGridDay',
        'week-view': 'timeGridWeek',
        'month-view': 'dayGridMonth',
        'agenda-view': 'listWeek'
    };
    
    Object.keys(viewButtons).forEach(btnId => {
        document.getElementById(btnId).addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Change calendar view
            calendar.changeView(viewButtons[btnId]);
        });
    });
    
    // Task form elements
    const taskForm = document.getElementById('add-task-form');
    const taskTitle = document.getElementById('task-title');
    const taskDate = document.getElementById('task-date');
    const taskDescription = document.getElementById('task-description');
    const cancelBtn = document.getElementById('cancel-task');
    const priorityOptions = document.querySelectorAll('.priority-option');
    let currentPriority = 'low';
    
    // Priority selection
    priorityOptions.forEach(option => {
        option.addEventListener('click', function() {
            priorityOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            currentPriority = this.getAttribute('data-priority');
        });
    });
    
    // Form submission
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const task = {
            id: generateId(),
            title: taskTitle.value,
            start: taskDate.value,
            end: calculateEndTime(taskDate.value),
            description: taskDescription.value,
            priority: currentPriority,
            completed: false
        };
        
        // Add to calendar
        calendar.addEvent({
            id: task.id,
            title: task.title,
            start: task.start,
            end: task.end,
            extendedProps: {
                description: task.description,
                priority: task.priority
            },
            backgroundColor: getPriorityColor(task.priority),
            borderColor: getPriorityColor(task.priority)
        });
        
        // Save to storage
        saveTask(task);
        
        // Update upcoming tasks
        updateUpcomingTasks();
        
        // Reset form
        taskForm.reset();
        priorityOptions[0].click(); // Reset to low priority
        
        // Show notification
        showNotification('Task Added', `${task.title} has been added to your calendar`);
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', function() {
        taskForm.reset();
        priorityOptions[0].click(); // Reset to low priority
    });
    
    // Upcoming tasks
    const upcomingTasksList = document.getElementById('upcoming-tasks');
    
    // Load tasks from storage
    loadTasks();
    
    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Calculate end time (default 1 hour)
    function calculateEndTime(startTime) {
        const start = new Date(startTime);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour
        return end.toISOString();
    }
    
    // Get priority color
    function getPriorityColor(priority) {
        const colors = {
            low: '#00b894',
            medium: '#fdcb6e',
            high: '#e17055'
        };
        return colors[priority] || '#6c5ce7';
    }
    
    // Save task to localStorage
    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Update task in localStorage
    function updateTaskInStorage(event) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const index = tasks.findIndex(t => t.id === event.id);
        
        if (index !== -1) {
            tasks[index].start = event.startStr;
            tasks[index].end = event.endStr;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
    
    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        // Add to calendar
        tasks.forEach(task => {
            if (!task.completed) {
                calendar.addEvent({
                    id: task.id,
                    title: task.title,
                    start: task.start,
                    end: task.end,
                    extendedProps: {
                        description: task.description,
                        priority: task.priority
                    },
                    backgroundColor: getPriorityColor(task.priority),
                    borderColor: getPriorityColor(task.priority)
                });
            }
        });
        
        // Update upcoming tasks
        updateUpcomingTasks();
    }
    
    // Update upcoming tasks list
    function updateUpcomingTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const now = new Date();
        const upcoming = tasks
            .filter(task => !task.completed && new Date(task.start) > now)
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 5); // Show next 5 tasks
        
        upcomingTasksList.innerHTML = '';
        
        if (upcoming.length === 0) {
            upcomingTasksList.innerHTML = '<p>No upcoming tasks</p>';
            return;
        }
        
        upcoming.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = 'task-item';
            taskEl.innerHTML = `
                <div class="task-check" data-id="${task.id}">
                    <i class="far fa-circle"></i>
                </div>
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div class="task-time">${formatTaskTime(task.start)}</div>
                </div>
                <div class="task-actions">
                    <button class="task-btn" data-id="${task.id}">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            `;
            upcomingTasksList.appendChild(taskEl);
        });
        
        // Add event listeners
        document.querySelectorAll('.task-check').forEach(btn => {
            btn.addEventListener('click', function() {
                const taskId = this.getAttribute('data-id');
                markTaskComplete(taskId);
            });
        });
        
        document.querySelectorAll('.task-actions .task-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const taskId = this.getAttribute('data-id');
                showTaskOptions(taskId);
            });
        });
    }
    
    // Format task time
    function formatTaskTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Mark task as complete
    function markTaskComplete(taskId) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const index = tasks.findIndex(t => t.id === taskId);
        
        if (index !== -1) {
            tasks[index].completed = true;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Remove from calendar
            const event = calendar.getEventById(taskId);
            if (event) event.remove();
            
            // Update upcoming tasks
            updateUpcomingTasks();
            
            // Show notification
            showNotification('Task Completed', `${tasks[index].title} has been marked as complete`);
        }
    }
    
    // Show task options
    function showTaskOptions(taskId) {
        // In a real app, you would show a dropdown menu with options
        // For now, we'll just show an alert
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            const options = [
                'Edit Task',
                'Mark Complete',
                'Delete Task',
                'Set Reminder'
            ];
            
            // Create a simple modal with options
            const modal = document.createElement('div');
            modal.className = 'task-options-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h4>${task.title}</h4>
                    <ul>
                        ${options.map(opt => `<li>${opt}</li>`).join('')}
                    </ul>
                    <button class="close-modal">Close</button>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal
            modal.querySelector('.close-modal').addEventListener('click', function() {
                modal.remove();
            });
        }
    }
    
    // Show task details
    function showTaskDetails(event) {
        const modal = document.createElement('div');
        modal.className = 'task-details-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${event.title}</h3>
                <p><strong>When:</strong> ${event.start.toLocaleString()}</p>
                ${event.extendedProps.description ? `<p><strong>Description:</strong> ${event.extendedProps.description}</p>` : ''}
                <p><strong>Priority:</strong> <span style="color: ${getPriorityColor(event.extendedProps.priority)}">${event.extendedProps.priority}</span></p>
                <div class="modal-actions">
                    <button class="btn btn-primary complete-btn">Mark Complete</button>
                    <button class="btn btn-outline close-btn">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Mark complete button
        modal.querySelector('.complete-btn').addEventListener('click', function() {
            markTaskComplete(event.id);
            modal.remove();
        });
        
        // Close button
        modal.querySelector('.close-btn').addEventListener('click', function() {
            modal.remove();
        });
    }
    
    // Notification function
    function showNotification(title, message) {
        // In a real app, you would use the Notifications API
        console.log(`${title}: ${message}`);
        // Or create a custom notification element
        const notification = document.createElement('div');
        notification.className = 'custom-notification slide-in';
        notification.innerHTML = `
            <h4>${title}</h4>
            <p>${message}</p>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});