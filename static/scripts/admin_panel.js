function loadItems() {
            fetch('/test_structure/items')
                .then(response => response.json())
                .then(data => {
                    const ul = document.getElementById('items-list');
                    ul.innerHTML = ''; // Очистити список перед оновленням
                    data.forEach(item => {
                        const li = document.createElement('li');

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
                        ul.appendChild(li);

                        imgDelete.addEventListener('click', function() {
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

                        imgEdit.addEventListener('click', function() {
                            // Викликати функцію для створення модального вікна
                            createModal(item.id);
                        });
                    });
                })
                .catch(error => console.error('Error:', error));
        }

        document.getElementById('addSubjectButton').addEventListener('click', function(event) {
            event.preventDefault(); // Забороняємо стандартну поведінку кнопки

            // Виконуємо POST-запит за допомогою fetch
            fetch('/addSubject', {
                method: 'POST',
            })
            .then(response => {
                if (response.ok) {
                    console.log('POST-запит виконано успішно');
                    loadItems(); // Оновлюємо список після успішного додавання
                } else {
                    console.error('Помилка виконання POST-запиту');
                }
            })
            .catch(error => {
                console.error('Помилка:', error);
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            loadItems(); // Завантажуємо список предметів при завантаженні сторінки
        });

        function createModal(itemId) {
            // Створення модального вікна
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

            // Обробники подій для кнопок OK та Відмінити
            const okButton = modal.querySelector('#ok-button');
            const cancelButton = modal.querySelector('#cancel-button');

            okButton.addEventListener('click', function() {
                const editText = document.getElementById('edit-text').value;
                // Відправити текст на сервер
                fetch(`/edit/${itemId}`, {
                    method: 'POST',
                    body: JSON.stringify({ text: editText }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        // Якщо успішно, закрити модальне вікно та оновити сторінку
                        modal.remove();
                        loadItems(); // Оновлюємо список після успішного редагування
                    } else {
                        console.error('Failed to edit item');
                    }
                }).catch(error => console.error('Error:', error));
            });

            cancelButton.addEventListener('click', function() {
                // Закрити модальне вікно
                modal.remove();
            });
        }