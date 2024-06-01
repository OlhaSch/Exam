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
    fetch(`/units_structure/test_by_id/${itemId}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                console.error('No test data found for itemId:', itemId);
                return;
            }
            const test = data[0];

            const modal = document.createElement('div');
            modal.classList.add('modal');
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>Проходження тестування</h2>
                    <label for="question">Питання: <br> ${test.question}</label>
                    <div><label for="option1" style="margin-top: 10px;">А: ${test.choice1}</label></div>
                    <div><label for="option2">Б: ${test.choice2}</label></div>
                    <div><label for="option3">В: ${test.choice3}</label></div>
                    <div><label for="option4">Г: ${test.choice4}</label></div>

                     <div class="answer-boxes">
                        <div class="correct-answer-box" data-option="1"></div> <br>
                        <div class="correct-answer-box" data-option="2"></div> <br>
                        <div class="correct-answer-box" data-option="3"></div> <br>
                        <div class="correct-answer-box" data-option="4"></div> <br>
                    </div><br>

                    <div class="modal-buttons">
                        <button id="ok-button" class="button">OK</button>
                        <button id="cancel-button" class="button cancel">Відмінити</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Позначення правильної відповіді
            const correctAnswer = test.answer;
            const correctAnswerBoxes = modal.querySelectorAll('.correct-answer-box');
            correctAnswerBoxes.forEach(box => {
                if (box.dataset.option === correctAnswer) {
                    box.classList.add('selected');
                }

                box.addEventListener('click', function() {
                    correctAnswerBoxes.forEach(b => b.classList.remove('selected'));
                    box.classList.add('selected');
                });
            });

            const okButton = modal.querySelector('#ok-button');
            const cancelButton = modal.querySelector('#cancel-button');

            okButton.addEventListener('click', function() {
                const questionValue = document.getElementById('question').value;
                const option1Value = document.getElementById('option1').value;
                const option2Value = document.getElementById('option2').value;
                const option3Value = document.getElementById('option3').value;
                const option4Value = document.getElementById('option4').value;
                const selectedBox = modal.querySelector('.correct-answer-box.selected');
                const correctAnswerValue = selectedBox ? selectedBox.dataset.option : '';
                const solutionValue = document.getElementById('solution').value;

                fetch(`/editTest/${itemId}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        question: questionValue,
                        option1: option1Value,
                        option2: option2Value,
                        option3: option3Value,
                        option4: option4Value,
                        correct_answer: correctAnswerValue,
                        solution: solutionValue
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        modal.remove();
                        // Завантажити оновлені дані
                        loadTest(itemId, document.querySelector(`[data-item-id="${itemId}"]`));
                    } else {
                        console.error('Failed to edit test');
                    }
                }).catch(error => console.error('Error:', error));
            });

            cancelButton.addEventListener('click', function() {
                modal.remove();
            });
        })
        .catch(error => console.error('Error:', error));
}
