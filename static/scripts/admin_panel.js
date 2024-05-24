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

                const textSpan = document.createElement('span');
                textSpan.textContent = item.subject;

                const imgContainer = document.createElement('div');
                imgContainer.classList.add('img-container');

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

                imgContainer.appendChild(imgDelete);
                imgContainer.appendChild(imgEdit);
                imgContainer.appendChild(imgAdd);

                li.appendChild(textSpan);
                li.appendChild(imgContainer);
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
            let sectionContainer = parentLi.querySelector('.section-container');
            if (sectionContainer) {
                sectionContainer.innerHTML = ''; // Clear container before adding new sections
            } else {
                sectionContainer = document.createElement('div');
                sectionContainer.classList.add('section-container');
                parentLi.appendChild(sectionContainer);
            }

            const ul = document.createElement('ul');
            ul.classList.add('section-list');
            data.forEach(section => {
                const li = document.createElement('li');
                li.classList.add('section-item');
                li.textContent = section.section;

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
                    loadUnits(section.id, li);
                });

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
            sectionContainer.appendChild(ul);
            parentLi.classList.add('loaded');
        })
        .catch(error => console.error('Error:', error));
}

function loadUnits(sectionId, parentLi) {
    if (parentLi.classList.contains('loaded')) {
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
                li.classList.add('unit-item'); // Add class for styling
                li.style.fontSize = '16px'; // Set font size

                const textSpan = document.createElement('span');
                textSpan.textContent = unit.unit;

                const imgContainer = document.createElement('div');
                imgContainer.classList.add('img-container');

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

                imgContainer.appendChild(imgDelete);
                imgContainer.appendChild(imgEdit);
                imgContainer.appendChild(imgAdd);

                li.appendChild(textSpan);
                li.appendChild(imgContainer); // Додаємо контейнер зображень після тексту

                ul.appendChild(li);

                li.addEventListener('click', function(event) {
                    event.stopPropagation(); // Stop event propagation to avoid conflicts
                    loadMaterial(unit.id, li);
                    console.log('Loading Materials is success');
                });

                imgDelete.addEventListener('click', function(event) {
                    event.stopPropagation();
                    fetch(`/deleteUnit/${unit.id}`, { method: 'POST' })
                        .then(response => {
                            if (response.ok) {
                                li.remove();
                            } else {
                                console.error('Failed to delete unit');
                            }
                        })
                        .catch(error => console.error('Error:', error));
                });

                imgEdit.addEventListener('click', function(event) {
                    event.stopPropagation();
                    editUnit(unit.id);
                });

                imgAdd.addEventListener('click', function(event) {
                    event.stopPropagation();
                    addMaterial(unit.id);
                });
            });
            parentLi.appendChild(ul);
            parentLi.classList.add('loaded');
        })
        .catch(error => console.error('Error:', error));
}




function loadMaterial(unitId, parentLi) {
    if (parentLi.classList.contains('loaded')) {
        return;
    }

    const options = ['Тест', 'Матеріали'];
    const ul = document.createElement('ul');
    ul.classList.add('material-list');

    options.forEach((option, index) => {
        const li = document.createElement('li');
        li.classList.add('material-item'); // Add class for styling
        li.textContent = option;
        li.style.cursor = 'pointer';

        li.addEventListener('click', function(event) {
            event.stopPropagation();

            if (index === 0) {
                console.log('Тест обраний');
                loadTest(unitId, li);
                console.log('loading Tests is success');
            } else if (index === 1) {
                console.log('Матеріали обрані');
                loadTheory(unitId, li);
            }
        });

        ul.appendChild(li);
    });

    parentLi.appendChild(ul);
    parentLi.classList.add('loaded');
}

function loadTest(unitId, parentLi) {
    if (parentLi.classList.contains('loaded')) {
        return;
    }
    fetch(`/units_structure/test/${unitId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Test data:", data);

            const ul = document.createElement('ul');
            ul.classList.add('test-list');

            data.forEach(test => {
                const li = document.createElement('li');
                li.classList.add('test-item'); // Add class for styling
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

            let testContainer = parentLi.querySelector('.test-container');
            if (testContainer) {
                testContainer.innerHTML = '';
            } else {
                testContainer = document.createElement('div');
                testContainer.classList.add('test-container');
                parentLi.appendChild(testContainer);
            }

            testContainer.appendChild(ul);
            parentLi.classList.add('loaded');
        })
        .catch(error => console.error('Error:', error));
}

function loadTheory(unitId, parentLi) {
    console.log('Load Theory');
    if (parentLi.classList.contains('loaded')) {
        return;
    }
    fetch(`/units_structure/theory/${unitId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Theory data:", data);

            const ul = document.createElement('ul');
            ul.classList.add('theory-list'); // Changed class for clarity

            data.forEach(theory => {
                const li = document.createElement('li');
                li.classList.add('theory-item'); // Add class for styling
                li.textContent = `Material ID: ${theory.id}`;
                li.style.cursor = 'pointer';

                const imgDelete = document.createElement('img');
                imgDelete.src = theory.image_url;
                imgDelete.alt = 'Delete';
                imgDelete.width = 15;
                imgDelete.height = 15;
                imgDelete.style.cursor = 'pointer';

                const imgEdit = document.createElement('img');
                imgEdit.src = theory.edit_url;
                imgEdit.alt = 'Edit';
                imgEdit.width = 15;
                imgEdit.height = 15;
                imgEdit.style.cursor = 'pointer';

                const imgAdd = document.createElement('img');
                imgAdd.src = theory.add_url;
                imgAdd.alt = 'Add';
                imgAdd.width = 15;
                imgAdd.height = 15;
                imgAdd.style.cursor = 'pointer';

                li.appendChild(imgDelete);
                li.appendChild(imgEdit);
                li.appendChild(imgAdd);

                ul.appendChild(li);

                imgDelete.addEventListener('click', function(event) {
                    event.stopPropagation();
                    fetch(`/deleteTheory/${theory.id}`, { method: 'POST' })
                        .then(response => {
                            if (response.ok) {
                                li.remove();
                            } else {
                                console.error('Failed to delete theory');
                            }
                        })
                        .catch(error => console.error('Error:', error));
                });

                imgEdit.addEventListener('click', function(event) {
                    event.stopPropagation();
                    editTheory(theory.id);
                });

                imgAdd.addEventListener('click', function(event) {
                    event.stopPropagation();
                    addSections(theory.id);
                });
            });

            let theoryContainer = parentLi.querySelector('.theory-container');
            if (theoryContainer) {
                theoryContainer.innerHTML = '';
            } else {
                theoryContainer = document.createElement('div');
                theoryContainer.classList.add('theory-container');
                parentLi.appendChild(theoryContainer);
            }

            theoryContainer.appendChild(ul);
            parentLi.classList.add('loaded');
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    loadItems();
});















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

