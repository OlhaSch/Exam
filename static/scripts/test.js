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

                li.appendChild(textSpan);
                li.style.cursor = 'pointer'; // Зміна курсору при наведенні на текст
                ul.appendChild(li);

                li.addEventListener('click', function() {
                    li.classList.toggle('open');
                    loadSections(item.id, li);
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
                ul.appendChild(li);
                li.addEventListener('click', function() {
                    loadUnits(section.id, li);
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
                li.appendChild(textSpan);
                ul.appendChild(li);

                li.addEventListener('click', function(event) {
                    event.stopPropagation(); // Stop event propagation to avoid conflicts
                    loadMaterial(unit.id, li);
                    console.log('Loading Materials is success');
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

    const options = [
        { name: 'Тест'},
        { name: 'Матеріали'}
    ];
    const ul = document.createElement('ul');
    ul.classList.add('material-list');

    options.forEach((option) => {
        const li = document.createElement('li');
        li.classList.add('material-item');
        li.textContent = option.name;

        li.addEventListener('click', function(event) {
            event.stopPropagation();

            if (option.name === 'Тест') {
                console.log('Тест обраний');
                editTest(unitId);
            } else if (option.name === 'Матеріали') {
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
            const ul = document.createElement('ul');
            ul.classList.add('test-list');

            data.forEach(test => {
                const li = document.createElement('li');
                li.classList.add('test-item');
                li.textContent = `Test ID: ${test.id}`;

                ul.appendChild(li);
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
    if (parentLi.classList.contains('loaded')) {
        return;
    }
    fetch(`/units_structure/theory/${unitId}`)
        .then(response => response.json())
        .then(data => {
            const ul = document.createElement('ul');
            ul.classList.add('theory-list');

            data.forEach(theory => {
                const li = document.createElement('li');
                li.classList.add('theory-item');
                li.textContent = `${theory.title}`;

                ul.appendChild(li);
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

// Helper function to create image elements
function createImageElement(src, alt, onClick) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.width = 15;
    img.height = 15;
    img.style.cursor = 'pointer';
    img.addEventListener('click', function(event) {
        event.stopPropagation();
        onClick();
    });
    return img;
}

document.addEventListener('DOMContentLoaded', function() {
    loadItems();
});

document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('subject-item')) {
        event.target.querySelector('.expandable-content').classList.toggle('open');
    }
});

function editTest(itemId) {
    fetch(`/units_structure/test/${itemId}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                console.error('No test data found for itemId:', itemId);
                return;
            }

            const modal = document.createElement('div');
            modal.classList.add('modal');
            let modalContent = `
                <div class="modal-content">
                    <h2>Проходження тестування</h2>
                    <div class="tests-container">
            `;

data.forEach((test, index) => {
                modalContent += `
                    <div class="test-item" data-id="${test.id}">
                        <label for="question-${index}">Питання: <br>${test.question.replace(/\n/g, '<br>')}</label>
                        <div class="answer-boxes">
                            <div class="answer-option">
                                <input type="radio" id="option1-${index}" name="answer-${test.id}" value="${test.choice1}">
                                <label for="option1-${index}">${test.choice1}</label>
                            </div>
                        </div>
                        <div class="answer-boxes">
                            <div class="answer-option">
                                <input type="radio" id="option2-${index}" name="answer-${test.id}" value="${test.choice2}">
                                <label for="option2-${index}">${test.choice2}</label>
                            </div>
                        </div>
                        <div class="answer-boxes">
                            <div class="answer-option">
                                <input type="radio" id="option3-${index}" name="answer-${test.id}" value="${test.choice3}">
                                <label for="option3-${index}">${test.choice3}</label>
                            </div>
                        </div>
                        <div class="answer-boxes">
                            <div class="answer-option">
                                <input type="radio" id="option4-${index}" name="answer-${test.id}" value="${test.choice4}">
                                <label for="option4-${index}">${test.choice4}</label>
                            </div>
                        </div>
                        <br>
                    </div>
                `;
            });


            modalContent += `
                    </div>
                    <div class="modal-buttons">
                        <button id="ok-button" class="button">OK</button>
                        <button id="cancel-button" class="button cancel">Відмінити</button>
                    </div>
                </div>
            `;

            modal.innerHTML = modalContent;
            document.body.appendChild(modal);

            const okButton = modal.querySelector('#ok-button');
            const cancelButton = modal.querySelector('#cancel-button');
            const answerBoxes = modal.querySelectorAll('.answer-option input[type="radio"]');
            let answersSubmitted = false;

            okButton.addEventListener('click', function () {
                if (answersSubmitted) {
                    return;
                }

                const userAnswers = [];

                data.forEach((test, index) => {
                    const selectedOption = modal.querySelector(`input[name="answer-${test.id}"]:checked`);
                    const userAnswer = selectedOption ? selectedOption.value : '';

                    userAnswers.push({
                        id: test.id,
                        user_answer: userAnswer
                    });

                    console.log(`Test ID: ${test.id}, User Answer: ${userAnswer}`);  // Відладкове повідомлення
                });

                fetch(`/checkAnswers`, {
                    method: 'POST',
                    body: JSON.stringify(userAnswers),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json())
                .then(results => {
                    results.forEach(result => {
                        const testItem = modal.querySelector(`.test-item[data-id="${result.id}"]`);
                        if (result.is_correct) {
                            testItem.classList.add('correct');
                        } else {
                            testItem.classList.add('incorrect');
                        }
                    });
                }).catch(error => console.error('Error:', error));

                // Деактивуємо можливість зміни відповідей
                answerBoxes.forEach(box => {
                    box.disabled = true;
                });

                // Деактивуємо кнопку OK, щоб вона не могла бути натиснута знову
                okButton.disabled = true;

                answersSubmitted = true; // Встановлюємо флаг, що відповіді вже відправлені
            });

            cancelButton.addEventListener('click', function () {
                modal.remove();
            });
        })
        .catch(error => console.error('Error:', error));
}
