document.addEventListener('DOMContentLoaded', () => {
    const tasksList = document.getElementById('tasks-list');
    const emptyState = document.getElementById('empty-state');
    const addTaskBtn = document.getElementById('add-task-btn');
    const addTaskModal = document.getElementById('add-task-modal');
    const deleteModal = document.getElementById('delete-modal');
    const taskForm = document.getElementById('task-form');
    const modalTitle = document.getElementById('modal-title');
    const taskIdInput = document.getElementById('task-id');
    const taskNameInput = document.getElementById('task-name');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskDueDateInput = document.getElementById('task-due-date');
    const taskPriorityInput = document.getElementById('task-priority');
    const cancelTaskBtn = document.getElementById('cancel-task');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksElement = document.getElementById('completed-tasks');
    const pendingTasksElement = document.getElementById('pending-tasks');
    const filterStatus = document.getElementById('filter-status');
    const filterPriority = document.getElementById('filter-priority');
    const sortBy = document.getElementById('sort-by');
    const searchInput = document.getElementById('search-task');
    const searchBtn = document.getElementById('search-btn');
    const closeButtons = document.querySelectorAll('.close');
    const currentUser = getCurrentUser();
    
    let taskToDelete = null;
    const today = new Date().toISOString().split('T')[0];
    if (taskDueDateInput) {
        taskDueDateInput.setAttribute('min', today);
    }
    initDashboard();
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', openAddTaskModal);
    }
     if (taskForm) {
        taskForm.addEventListener('submit', handleTaskFormSubmit);
    } 
    if (cancelTaskBtn) {
        cancelTaskBtn.addEventListener('click', closeTaskModal);
    }
     if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteTask);
    }
     if (filterStatus) {
        filterStatus.addEventListener('change', filterTasks);
    }
     if (filterPriority) {
        filterPriority.addEventListener('change', filterTasks);
    }
    if (sortBy) {
        sortBy.addEventListener('change', filterTasks);
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', filterTasks);
    }
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                filterTasks();
            }
        });
    }
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            if (modalId === 'add-task-modal') {
                closeTaskModal();
            } else if (modalId === 'delete-modal') {
                closeDeleteModal();
            }
        });
    });
    window.addEventListener('click', (e) => {
        if (e.target === addTaskModal) {
            closeTaskModal();
        } else if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
    function initDashboard() {
        renderTasks();
        updateTaskStats();
    }
    function renderTasks() {
        const tasks = getFilteredTasks();
        if (tasksList) {
            tasksList.innerHTML = '';
            if (tasks.length === 0) {
                if (emptyState) {
                    emptyState.style.display = 'block';
                }
                return;
            }
            if (emptyState) {
                emptyState.style.display = 'none';
            }
            tasks.forEach(task => {
                const taskElement = createTaskElement(task);
                tasksList.appendChild(taskElement);
            });
        }
    }
    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.dataset.id = task.id;
        
        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        
        const taskTitle = document.createElement('div');
        taskTitle.className = task.completed ? 'task-title completed' : 'task-title';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
        
        const titleText = document.createElement('span');
        titleText.textContent = task.name;
        
        taskTitle.appendChild(checkbox);
        taskTitle.appendChild(titleText);
        
        const taskDescription = document.createElement('div');
        taskDescription.className = 'task-description';
        taskDescription.textContent = task.description || 'No description';
        
        const taskMeta = document.createElement('div');
        taskMeta.className = 'task-meta';
        
        const dueDate = document.createElement('span');
        dueDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${formatDate(task.dueDate)}`;
        
        const priority = document.createElement('span');
        priority.className = `task-priority priority-${task.priority}`;
        priority.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
        
        taskMeta.appendChild(dueDate);
        taskMeta.appendChild(priority);
        
        taskInfo.appendChild(taskTitle);
        taskInfo.appendChild(taskDescription);
        taskInfo.appendChild(taskMeta);
        
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'task-action-btn edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', () => openEditTaskModal(task));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-action-btn delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', () => openDeleteModal(task));
        
        taskActions.appendChild(editBtn);
        taskActions.appendChild(deleteBtn);
        
        taskElement.appendChild(taskInfo);
        taskElement.appendChild(taskActions);
        
        return taskElement;
    }
    function openAddTaskModal() {
        taskForm.reset();
        taskIdInput.value = '';
        modalTitle.textContent = 'Add New Task';
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        taskDueDateInput.value = tomorrow.toISOString().split('T')[0];
        addTaskModal.style.display = 'block';
    }
    function openEditTaskModal(task) {
        taskIdInput.value = task.id;
        taskNameInput.value = task.name;
        taskDescriptionInput.value = task.description || '';
        taskDueDateInput.value = task.dueDate;
        taskPriorityInput.value = task.priority;
        modalTitle.textContent = 'Edit Task';
        addTaskModal.style.display = 'block';
    }
    function closeTaskModal() {
        addTaskModal.style.display = 'none';
    }
    function openDeleteModal(task) {
        taskToDelete = task;
        deleteModal.style.display = 'block';
    }
    function closeDeleteModal() {
        deleteModal.style.display = 'none';
        taskToDelete = null;
    }
    function handleTaskFormSubmit(e) {
        e.preventDefault();
        const taskId = taskIdInput.value;
        const name = taskNameInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const dueDate = taskDueDateInput.value;
        const priority = taskPriorityInput.value;
        if (!name) {
            alert('Task name is required');
            return;
        }
        if (!dueDate) {
            alert('Due date is required');
            return;
        }
        const task = {
            name,
            description,
            dueDate,
            priority,
            completed: false
        };
        if (taskId) {
            task.id = taskId;
            task.completed = getTaskById(taskId).completed;
            updateTask(task);
        } else {
            addTask(task);
        }
        closeTaskModal();
        renderTasks();
        updateTaskStats();
    }
    function confirmDeleteTask() {
        if (taskToDelete) {
            deleteTask(taskToDelete.id);
            closeDeleteModal();
            renderTasks();
            updateTaskStats();
        }
    }
    function toggleTaskStatus(taskId) {
        const task = getTaskById(taskId);
        if (task) {
            task.completed = !task.completed;
            updateTask(task);
            renderTasks();
            updateTaskStats();
        }
    }
    function filterTasks() {
        renderTasks();
    }
    function getFilteredTasks() {
        let tasks = getUserTasks();
        const statusFilter = filterStatus ? filterStatus.value : 'all';
        if (statusFilter !== 'all') {
            const isCompleted = statusFilter === 'completed';
            tasks = tasks.filter(task => task.completed === isCompleted);
        }
        const priorityFilter = filterPriority ? filterPriority.value : 'all';
        if (priorityFilter !== 'all') {
            tasks = tasks.filter(task => task.priority === priorityFilter);
        }
        const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
        if (searchQuery) {
            tasks = tasks.filter(task => 
                task.name.toLowerCase().includes(searchQuery) || 
                (task.description && task.description.toLowerCase().includes(searchQuery))
            );
        }
        const sortOption = sortBy ? sortBy.value : 'date-asc';
        
        switch (sortOption) {
            case 'date-asc':
                tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                break;
            case 'date-desc':
                tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
                break;
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
        }
        
        return tasks;
    }
    function updateTaskStats() {
        const tasks = getUserTasks();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        if (totalTasksElement) totalTasksElement.textContent = totalTasks;
        if (completedTasksElement) completedTasksElement.textContent = completedTasks;
        if (pendingTasksElement) pendingTasksElement.textContent = pendingTasks;
    }
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    function getUserTasks() {
        if (!currentUser) return [];
        
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        return allTasks[currentUser.id] || [];
    }
    function getTaskById(taskId) {
        const tasks = getUserTasks();
        return tasks.find(task => task.id === taskId) || null;
    }
    function addTask(task) {
        if (!currentUser) return;
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        const userTasks = allTasks[currentUser.id] || [];
        task.id = generateTaskId();
        task.createdAt = new Date().toISOString();
        userTasks.push(task);
        allTasks[currentUser.id] = userTasks;
        localStorage.setItem('tasks', JSON.stringify(allTasks));
    }
    function updateTask(updatedTask) {
        if (!currentUser) return;
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        const userTasks = allTasks[currentUser.id] || [];
        const taskIndex = userTasks.findIndex(task => task.id === updatedTask.id);
        
        if (taskIndex !== -1) {
            userTasks[taskIndex] = {
                ...userTasks[taskIndex],
                ...updatedTask,
                updatedAt: new Date().toISOString()
            };
            allTasks[currentUser.id] = userTasks;
            localStorage.setItem('tasks', JSON.stringify(allTasks));
        }
    }
    function deleteTask(taskId) {
        if (!currentUser) return;
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
        const userTasks = allTasks[currentUser.id] || [];
        const updatedTasks = userTasks.filter(task => task.id !== taskId);
        allTasks[currentUser.id] = updatedTasks;
        localStorage.setItem('tasks', JSON.stringify(allTasks));
    }
    function generateTaskId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}); 