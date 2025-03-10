// Détection du mode sombre
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

// Logique de l'application TODO
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('todo-form');
    const todoList = document.getElementById('todo-list');
    const addBtn = document.getElementById('add-btn');
    const updateBtn = document.getElementById('update-btn');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentEditId = null;

    // Afficher les TODOs existants
    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const tr = document.createElement('tr');
            const date = new Date(todo.date);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            
            tr.innerHTML = `
                <td>${todo.title}</td>
                <td>${todo.description}</td>
                <td>${formattedDate}</td>
                <td class="actions">
                    <button class="btn-primary btn-action edit" data-id="${index}">Éditer</button>
                    <button class="btn-danger btn-action delete" data-id="${index}">Supprimer</button>
                </td>
            `;
            todoList.appendChild(tr);
        });

        // Ajouter les écouteurs d'événements pour les boutons d'édition et de suppression
        document.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', editTodo);
        });
        document.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', deleteTodo);
        });
    }

    // Ajouter un TODO
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;

        if (currentEditId !== null) {
            // Mode édition
            todos[currentEditId] = { title, description, date };
            currentEditId = null;
            addBtn.style.display = 'inline-block';
            updateBtn.disabled = true;
        } else {
            // Mode ajout
            todos.push({ title, description, date });
        }

        // Sauvegarder et rafraîchir
        localStorage.setItem('todos', JSON.stringify(todos));
        form.reset();
        renderTodos();
    });

    // Éditer un TODO
    function editTodo(e) {
        const id = parseInt(e.target.dataset.id);
        const todo = todos[id];
        
        document.getElementById('title').value = todo.title;
        document.getElementById('description').value = todo.description;
        document.getElementById('date').value = todo.date;
        
        currentEditId = id;
        addBtn.style.display = 'none';
        updateBtn.disabled = false;
        updateBtn.onclick = function() {
            form.dispatchEvent(new Event('submit'));
        };
    }

    // Supprimer un TODO
    function deleteTodo(e) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
            const id = parseInt(e.target.dataset.id);
            todos.splice(id, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
        }
    }

    // Initialisation
    renderTodos();
});