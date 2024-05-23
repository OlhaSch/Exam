function loadItems() {
    fetch('/test_structure/items')
        .then(response => response.json())
        .then(data => {
            const ul = document.getElementById('items-list');
            ul.innerHTML = ''; // Очистити список перед оновленням
            data.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('subject-item'); // Додавання класу для стилізації
                li.style.fontSize = '23px';

                const imgDelete = document.createElement('img');
                imgDelete.src = item.image_url;
                imgDelete.alt = 'Delete';
                imgDelete.width = 15;
                imgDelete.height = 15;
                imgDelete.style.cursor = 'pointer';

                const imgEdit = document.createElement('img');
                imgEdit.src = item.edit_url;
                imgEdit.alt = 'Edit';
                imgEdit.width = 15;
                imgEdit.height = 15;
                imgEdit.style.cursor = 'pointer';

                const imgAdd = document.createElement('img');
                imgAdd.src = item.add_url;
                imgAdd.alt = 'Add';
                imgAdd.width = 15;
                imgAdd.height = 15;
                imgAdd.style.cursor = 'pointer';

                li.textContent = item.subject;
                li.appendChild(imgDelete);
                li.appendChild(imgEdit);
                li.appendChild(imgAdd);
                li.style.cursor = 'pointer'; // Зміна курсору при наведенні на текст
                ul.appendChild(li);

                li.addEventListener('click', function() {
                    loadSections(item.id, li);
                });

                imgDelete.addEventListener('click', function(event) {
                    event.stopPropagation();
                    fetch(`/delete/${item.id}`, { method: 'POST' })
                        .then(response => {
                            if (response.ok) {
                                li.remove();
                            } else {
                                console.error('Failed to delete item');
                            }
                        })
                        .catch(error => console.error('Error:', error));
                });

                imgEdit.addEventListener('click', function(event) {
                    event.stopPropagation();
                    createModal(item.id);
                });

                imgAdd.addEventListener('click', function(event) {
                    event.stopPropagation();
                    addSubject(item.id);
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

function loadSections(itemId, parentLi) {
    if (parentLi.classList.contains('loaded')) {
        return;
    }

    fetch(`/test_structure/section/${itemId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Sections data:", data);
            const ul = document.createElement('ul');
            ul.classList.add('section-list');
            data.forEach(section => {
                const li = document.createElement('li');
                li.textContent = section.section; // Використовувати поле 'section'
                li.style.cursor = 'pointer';

                const imgDelete = document.createElement('img');
                imgDelete.src = section.image_url;
                imgDelete.alt = 'Delete';
                imgDelete.width = 15;
                imgDelete.height = 15;
                imgDelete.style.cursor = 'pointer';

                const imgEdit = document.createElement('img');
                imgEdit.src = section.edit_url;
                imgEdit.alt = 'Edit';
                imgEdit.width = 15;
                imgEdit.height = 15;
                imgEdit.style.cursor = 'pointer';

                const imgAdd = document.createElement('img');
                imgAdd.src = section.add_url;
                imgAdd.alt = 'Add';
                imgAdd.width = 15;
                imgAdd.height = 15;
                imgAdd.style.cursor = 'pointer';

                li.appendChild(imgDelete);
                li.appendChild(imgEdit);
                li.appendChild(imgAdd);

                ul.appendChild(li);
            });
            parentLi.appendChild(ul);
            parentLi.classList.add('loaded');
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('addSubjectButton').addEventListener('click', function(event) {
    event.preventDefault();
    fetch('/addSubject', {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            console.log('POST-запит виконано успішно');
            loadItems();
        } else {
            console.error('Помилка виконання POST-запиту');
        }
    })
    .catch(error => {
        console.error('Помилка:', error);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    loadItems();
});


function createModal(itemId) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <textarea id="edit-text" rows="4" cols="50"></textarea>
            <button id="ok-button">OK</button>
            <button id="cancel-button">Відмінити</button>
        </div>
    `;
    document.body.appendChild(modal);

    const okButton = modal.querySelector('#ok-button');
    const cancelButton = modal.querySelector('#cancel-button');

    okButton.addEventListener('click', function() {
        const editText = document.getElementById('edit-text').value;
        fetch(`/edit/${itemId}`, {
            method: 'POST',
            body: JSON.stringify({ text: editText }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                modal.remove();
                loadItems();
            } else {
                console.error('Failed to edit item');
            }
        }).catch(error => console.error('Error:', error));
    });

    cancelButton.addEventListener('click', function() {
        modal.remove();
    });
}

function addSubject(itemId) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <textarea id="add-text" rows="4" cols="50"></textarea>
            <button id="add-ok-button">OK</button>
            <button id="add-cancel-button">Відмінити</button>
        </div>
    `;
    document.body.appendChild(modal);

    const okButton = modal.querySelector('#add-ok-button');
    const cancelButton = modal.querySelector('#add-cancel-button');

    okButton.addEventListener('click', function() {
        const addText = document.getElementById('add-text').value;
        fetch(`/addSubject/${itemId}`, {
            method: 'POST',
            body: JSON.stringify({ text: addText }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                modal.remove();
                loadItems();
            } else {
                console.error('Failed to add subject');
            }
        }).catch(error => console.error('Error:', error));
    });

    cancelButton.addEventListener('click', function() {
        modal.remove();
    });
}
