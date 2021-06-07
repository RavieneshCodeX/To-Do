const todoList = document.querySelector('#todo-list');
const form = document.querySelector('#add-todo-form');

function renderCafe(doc){
    let li = document.createElement('li');
    let task = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    task.textContent = doc.data().task;
    cross.textContent = 'x';

    li.appendChild(task);
    li.appendChild(cross);

    todoList.appendChild(li);

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('todos').doc(id).delete();
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('todos').add({
        task: form.task.value,
    });
    form.task.value = '';
});

// real-time listener
db.collection('todos').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = todoList.querySelector('[data-id=' + change.doc.id + ']');
            todoList.removeChild(li);
        }
    });
});