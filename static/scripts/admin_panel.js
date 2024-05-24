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



// Виправлено назву параметру на sectionId, оскільки це ідентифікатор секції
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
                li.textContent = section.section;
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

                li.addEventListener('click', function() {
                    loadUnits(section.id, li); // Використано section.id
                    console.log('loading Units success');
                });

                // Додамо обробники подій для кнопок видалення, редагування та додавання
                imgDelete.addEventListener('click', function(event) {
                    event.stopPropagation();
                    fetch(`/deleteSection/${section.id}`, { method: 'POST' })
                        .then(response => {
                            if (response.ok) {
                                li.remove();
                            } else {
                                console.error('Failed to delete section');
                            }
                        })
                        .catch(error => console.error('Error:', error));
                });

                imgEdit.addEventListener('click', function(event) {
                    event.stopPropagation();
                    editSection(section.id);
                });

                imgAdd.addEventListener('click', function(event) {
                    event.stopPropagation();
                    addUnits(section.id);
                });
            });
            parentLi.appendChild(ul);
            parentLi.classList.add('loaded');
        })
        .catch(error => console.error('Error:', error));
}




function loadUnits(sectionId, parentUl) {
    if (parentUl.classList.contains('loaded')) {
        return;
    }

    fetch(`/test_structure/units/${sectionId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Unit data:", data);
            const ul = document.createElement('ul');
            ul.classList.add('unit-list');
            data.forEach(unit => {
                const li = document.createElement('li');
                li.textContent = unit.unit;
                li.style.cursor = 'pointer';

                const imgDelete = document.createElement('img');
                imgDelete.src = unit.image_url;
                imgDelete.alt = 'Delete';
                imgDelete.width = 15;
                imgDelete.height = 15;
                imgDelete.style.cursor = 'pointer';

                const imgEdit = document.createElement('img');
                imgEdit.src = unit.edit_url;
                imgEdit.alt = 'Edit';
                imgEdit.width = 15;
                imgEdit.height = 15;
                imgEdit.style.cursor = 'pointer';

                const imgAdd = document.createElement('img');
                imgAdd.src = unit.add_url;
                imgAdd.alt = 'Add';
                imgAdd.width = 15;
                imgAdd.height = 15;
                imgAdd.style.cursor = 'pointer';

                li.appendChild(imgDelete);
                li.appendChild(imgEdit);
                li.appendChild(imgAdd);

                ul.appendChild(li);

                li.addEventListener('click', function() {
                    loadMaterial(unit.id, li); // Використано unit.id
                    console.log('Loading Materials is success');
                });
            });
            parentUl.appendChild(ul);
            parentUl.classList.add('loaded');
        })
        .catch(error => console.error('Error:', error));
}




function loadMaterial(unitId, parentLi) {
    if (parentLi.classList.contains('loaded')) {
        return;
    }

    // Створюємо варіанти "тест" і "матеріали"
    const options = ['Тест', 'Матеріали'];

    // Створюємо список для варіантів
    const ul = document.createElement('ul');
    ul.classList.add('material-list');

    // Додаємо кожен варіант до списку
    options.forEach((option, index) => {
        const li = document.createElement('li');
        li.textContent = option;
        li.style.cursor = 'pointer';

        // Додамо обробник події для вибору варіанту
        li.addEventListener('click', function(event) {
            event.stopPropagation(); // Зупиняємо подію відповідно до кліка, щоб не впливати на батьківський елемент

            // Перевіряємо, який варіант було обрано
            if (index === 0) {
                // Обрано "тест"
                console.log('Тест обраний');
                // Тут можна викликати функцію, яка завантажить тестові дані
                loadTest(unitId, parentLi);
                console.log('loading Tests is success');
            } else if (index === 1) {
                // Обрано "матеріали"
                console.log('Матеріали обрані');
                // Тут можна викликати функцію, яка завантажить матеріали
            }
        });

        ul.appendChild(li);
    });

    parentLi.appendChild(ul);
    parentLi.classList.add('loaded');
}

document.addEventListener('DOMContentLoaded', function() {
    loadItems();
});

function loadTest(unitId, parentLi) {
    console.log('loadTest works');

    // Fetch tests data for the given unit ID
    fetch(`/units_structure/test/${unitId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Test data:", data);

            // Create a new unordered list element for tests
            const ul = document.createElement('ul');
            ul.classList.add('test-list');

            // Iterate through the received test data
            data.forEach(test => {
                const li = document.createElement('li');
                li.textContent = `Test ID: ${test.id}`;
                li.style.cursor = 'pointer';

                const imgDelete = document.createElement('img');
                imgDelete.src = test.image_url;
                imgDelete.alt = 'Delete';
                imgDelete.width = 15;
                imgDelete.height = 15;
                imgDelete.style.cursor = 'pointer';

                const imgEdit = document.createElement('img');
                imgEdit.src = test.edit_url;
                imgEdit.alt = 'Edit';
                imgEdit.width = 15;
                imgEdit.height = 15;
                imgEdit.style.cursor = 'pointer';

                const imgAdd = document.createElement('img');
                imgAdd.src = test.add_url;
                imgAdd.alt = 'Add';
                imgAdd.width = 15;
                imgAdd.height = 15;
                imgAdd.style.cursor = 'pointer';

                li.appendChild(imgDelete);
                li.appendChild(imgEdit);
                li.appendChild(imgAdd);

                ul.appendChild(li);

                // Add event listeners for the images
                imgDelete.addEventListener('click', function(event) {
                    event.stopPropagation();
                    fetch(`/deleteTest/${test.id}`, { method: 'POST' })
                        .then(response => {
                            if (response.ok) {
                                li.remove();
                            } else {
                                console.error('Failed to delete test');
                            }
                        })
                        .catch(error => console.error('Error:', error));
                });

                imgEdit.addEventListener('click', function(event) {
                    event.stopPropagation();
                    editTest(test.id);
                });

                imgAdd.addEventListener('click', function(event) {
                    event.stopPropagation();
                    addSections(test.id);
                });
            });

            // Find the test container within parentLi
            let testContainer = parentLi.querySelector('.test-container');
            if (!testContainer) {
                testContainer = document.createElement('div');
                testContainer.classList.add('test-container');
                parentLi.appendChild(testContainer);
            }

            // Append the tests list to the test container
            testContainer.appendChild(ul);
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
function createSubjectModal(itemId) {
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

