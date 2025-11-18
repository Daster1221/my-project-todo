let tasks = [];
let editId = null;

const elements = {
    taskInput: document.getElementById('note_text'),
    addButton: document.getElementById('add_note'),
    taskList: document.getElementById('note_list'),
    search: document.getElementById('search'),
    filter: document.getElementById('filterSelect'),
    modal: document.getElementById('modalOverlay'),
    modalTitle: document.getElementById('modalTitle')
};

// Тема
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
});

// Модальное окно
document.getElementById('openModal').addEventListener('click', openModal);
document.getElementById('closeModal').addEventListener('click', closeModal);


function openModal() {
    elements.modal.classList.add('active');
}

function closeModal() {
    elements.modal.classList.remove('active');
}

// Добавить/Сохранить
elements.addButton.addEventListener('click', () => {
    const text = elements.taskInput.value.trim();

    if (editId) {
        // Редактируем
        const task = tasks.find(t => t.id === editId);
        if (task) task.text = text;
    } else {
        // Добавляем
        tasks.push({
            id: Date.now(),
            text: text,
            completed: false
        });
    }

    closeModal();
    showTasks();
});

// Показать задачи
function showTasks() {
    const searchText = elements.search.value.toLowerCase();
    const filterType = elements.filter.value;

    let visibleTasks = tasks.filter(task => {
        const matchSearch = task.text.toLowerCase().includes(searchText);
        const matchFilter = 
            filterType === 'all' ||
            (filterType === 'completed' && task.completed) ||
            (filterType === 'active' && !task.completed);
        
        return matchSearch && matchFilter;
    });

    elements.taskList.innerHTML = '';

    if (visibleTasks.length === 0) {
        elements.taskList.innerHTML = '<div class="empty-state">Задач пока нет</div>';
        return;
    }

    visibleTasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.className = `todo-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="todo-text">${task.text}</span>
            <div>
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">×</button>
            </div>
        `;
        elements.taskList.appendChild(taskElement);

        // Чекбокс
        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            taskElement.classList.toggle('completed', task.completed);
        });

        // Удалить
        const deleteBtn = taskElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            showTasks();
        });

        // Редактировать
        const editBtn = taskElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            elements.taskInput.value = task.text;
            editId = task.id;
            elements.modalTitle.textContent = 'Редактировать задачу';
            elements.addButton.textContent = 'Сохранить';
            openModal();
        });
    });
}

// Поиск и фильтр
elements.search.addEventListener('input', showTasks);
elements.filter.addEventListener('change', showTasks);

// Enter
// elements.taskInput.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') elements.addButton.click();
// });

// Запуск
showTasks();