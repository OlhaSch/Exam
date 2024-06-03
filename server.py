from flask import Flask, request, redirect, url_for, flash, Blueprint, jsonify, session
import psycopg2
import mysql.connector
import os

post_routes = Blueprint('post_routes', __name__)


def get_db_connection():
    conn = None
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST')
        )
        print("Connection with database: success")
    except psycopg2.Error as e:
        print(f"Connection with database: error {e}")
    return conn


@post_routes.route('/login_admin', methods=['POST'])
def login_admin():
    email = request.form['email']
    password = request.form['password']
    conn = get_db_connection()

    if not conn:
        flash("Не вдалося підключитися до бази даних", "error")
        return redirect(url_for('admin_panel_auth'))

    cursor = conn.cursor()
    try:
        cursor.execute('SELECT * FROM users WHERE login = %s AND password = %s', (email, password))
        user = cursor.fetchone()
        if user:
            session['admin'] = email
            print(f"Користувача {email} знайдено")
            return redirect(url_for('admin_panel'))
        else:
            flash("Невірні дані, спробуйте ще раз.", "error")
            return redirect(url_for('admin_panel_auth'))
    except psycopg2.Error as e:
        flash(f"Помилка при виконанні запиту: {e}", "error")
        return redirect(url_for('admin_panel_auth'))
    finally:
        conn.close()


@post_routes.route('/auth', methods=['POST'])
def auth():
    login = request.form['email']
    password = request.form['password']
    conn = get_db_connection()

    if not conn:
        flash("Не вдалося підключитися до бази даних", "error")
        return redirect(url_for('user_auth'))

    cursor = conn.cursor()
    try:
        cursor.execute('SELECT * FROM users WHERE login = %s AND password = %s', (login, password))
        user = cursor.fetchone()
        if user:
            session['user'] = login
            print(f"User {login} was found")
            return redirect(url_for('test'))
        else:
            flash("Невірні дані, спробуйте ще раз.", "error")
            return redirect(url_for('user_auth'))
    except psycopg2.Error as e:
        flash(f"Помилка при виконанні запиту: {e}", "error")
        return redirect(url_for('user_auth'))
    finally:
        conn.close()


def fetch_items():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, subject FROM subject")  # Додали поле id до запиту
    columns = [column[0] for column in cursor.description]
    items = []
    for row in cursor.fetchall():
        item = dict(zip(columns, row))
        # Додаємо URL-адресу зображення до кожного елемента
        item['image_url'] = '/static/images/delete.png'  # URL-адреса першого зображення
        item['edit_url'] = '/static/images/pen.png'
        item['add_url'] = '/static/images/add.png'
        items.append(item)
    conn.close()
    cursor.close()
    return items
@post_routes.route('/test_structure/items', methods=['GET'])
def get_items():
    items = fetch_items()
    return jsonify(items)

@post_routes.route('/test_structure/section/<int:item_id>', methods=['GET'])
def get_section(item_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM section WHERE id_subject = %s", (item_id,))
    columns = [column[0] for column in cursor.description]
    sections = []
    for row in cursor.fetchall():
        section = dict(zip(columns, row))
        section['image_url'] = '/static/images/delete.png'  # URL-адреса першого зображення
        section['edit_url'] = '/static/images/pen.png'
        section['add_url'] = '/static/images/add.png'
        sections.append(section)
    conn.close()
    print("Fetched sections:", sections)
    return jsonify(sections)

@post_routes.route('/test_structure/units/<int:item_id>', methods=['GET'])
def get_unit(item_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM unit WHERE id_section = %s", (item_id,))
    columns = [column[0] for column in cursor.description]
    units = []
    for row in cursor.fetchall():
        unit = dict(zip(columns, row))
        unit['image_url'] = '/static/images/delete.png'  # URL-адреса першого зображення
        unit['edit_url'] = '/static/images/pen.png'
        unit['add_url'] = '/static/images/add.png'
        units.append(unit)
    conn.close()
    print("Fetched units:", units)
    return jsonify(units)

@post_routes.route('/units_structure/test/<int:item_id>')
def get_test(item_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM test WHERE id_unit = %s", (item_id,))
    columns = [column[0] for column in cursor.description]
    tests = []
    print('get_test')
    for row in cursor.fetchall():
        test = dict(zip(columns, row))
        test['image_url'] = '/static/images/delete.png'  # URL-адреса першого зображення
        test['edit_url'] = '/static/images/pen.png'
        tests.append(test)
    conn.close()
    print("Fetched tests:", tests)
    return jsonify(tests)


@post_routes.route('/units_structure/test_by_id/<int:item_id>', methods=['GET'])
def get_test_one(item_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM test WHERE id = %s", (item_id,))
    columns = [column[0] for column in cursor.description]
    test = cursor.fetchone()
    conn.close()

    if test is None:
        return jsonify([])  # Повернути порожній список, якщо тест не знайдено

    test_dict = dict(zip(columns, test))
    test_dict['image_url'] = '/static/images/delete.png'  # URL-адреса першого зображення
    test_dict['edit_url'] = '/static/images/pen.png'

    return jsonify([test_dict])


@post_routes.route('/units_structure/theory/<int:item_id>')
def get_theory(item_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM materials WHERE id_unit = %s", (item_id,))
    columns = [column[0] for column in cursor.description]
    theorys = []
    print('get_test')
    for row in cursor.fetchall():
        theory = dict(zip(columns, row))
        theory['image_url'] = '/static/images/delete.png'  # URL-адреса першого зображення
        theory['edit_url'] = '/static/images/pen.png'
        theorys.append(theory)
    conn.close()
    print("Fetched tests:", theorys)
    return jsonify(theorys)

@post_routes.route('/getMaterialById/<int:item_id>', methods=['GET'])
def getMaterialById(item_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT title, description FROM materials WHERE id = %s', (item_id,))
        material = cursor.fetchone()
        conn.close()

        if material:
            return jsonify({"title": material[0], "description": material[1]}), 200
        else:
            return jsonify({"error": "Material not found"}), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@post_routes.route('/delete/<int:item_id>', methods=['POST'])
def delete_item(item_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM subject WHERE id = %s", (item_id,))
        item = cursor.fetchone()
        if item is None:
            cursor.close()
            conn.close()
            return jsonify({"error": "Item not found"}), 404

        cursor.execute("DELETE FROM subject WHERE id = %s", (item_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return '', 204
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@post_routes.route('/edit/<int:item_id>', methods=['POST'])
def edit(item_id):
    try:
        new_text = request.json['text']
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE subject SET subject = %s WHERE id = %s", (new_text, item_id))
        conn.commit()
        cursor.close()
        conn.close()
        return '', 204
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@post_routes.route('/addSubject', methods=['POST'])
def add_subject():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(id) FROM subject")
        max_id = cursor.fetchone()[0]  # Отримуємо максимальний id
        new_id = (max_id + 1) if max_id else 1
        cursor.execute("INSERT INTO subject (id, subject) VALUES (%s, %s)", (new_id, 'Новий розділ'))
        conn.commit()
        conn.close()
        cursor.close()
        print("max ind:", max_id)
        return jsonify({"message": "Subject added successfully"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@post_routes.route('/deleteSection/<int:item_id>', methods=['POST'])
def deleteSection(item_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM section WHERE id = %s", (item_id,))
        item = cursor.fetchone()
        if item is None:
            cursor.close()
            conn.close()
            return jsonify({"error": "Item not found"}), 404

        cursor.execute("DELETE FROM section WHERE id = %s", (item_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return '', 204
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
@post_routes.route('/editSection/<int:item_id>', methods=['POST'])
def editSection(item_id):
    try:
        new_text = request.json['text']
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE section SET section = %s WHERE id = %s", (new_text, item_id))
        conn.commit()
        conn.close()
        cursor.close()
        return '', 204
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@post_routes.route('/addSection/<int:item_id>', methods=['POST'])
def addSection(item_id):
    try:
        new_text = request.json['text']
        conn = get_db_connection()
        cursor = conn.cursor()

        # Перевірка на дублювання секції
        cursor.execute('SELECT COUNT(*) FROM section WHERE section = %s AND id_subject = %s', (new_text, item_id))
        if cursor.fetchone()[0] > 0:
            return jsonify({"error": "Section already exists"}), 409

        cursor.execute("SELECT MAX(id) FROM section")
        max_id = cursor.fetchone()[0]
        new_id = (max_id + 1) if max_id else 1
        cursor.execute('INSERT INTO section (id, section, id_subject) VALUES (%s, %s, %s)', (new_id, new_text, item_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Section added successfully"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@post_routes.route('/addUnit/<int:item_id>', methods=['POST'])
def addUnit(item_id):
    try:
        new_text = request.json['text']
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(id) FROM unit")
        max_id = cursor.fetchone()[0]
        new_id = (max_id + 1) if max_id else 1
        cursor.execute('INSERT INTO unit (id, unit, id_section) VALUES (%s, %s, %s)', (new_id, new_text, item_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Unit added successfully"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@post_routes.route('/editUnit/<int:item_id>', methods=['POST'])
def editUnit(item_id):
    try:
        new_text = request.json['text']
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE unit SET unit = %s WHERE id = %s", (new_text, item_id))
        conn.commit()
        conn.close()
        cursor.close()
        return '', 204
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@post_routes.route('/deleteUnit/<int:item_id>', methods=['POST'])
def deleteUnit(item_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM unit WHERE id = %s", (item_id,))
        item = cursor.fetchone()
        if item is None:
            cursor.close()
            conn.close()
            return jsonify({"error": "Item not found"}), 404

        cursor.execute("DELETE FROM unit WHERE id = %s", (item_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return '', 204
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@post_routes.route('/addTest/<int:item_id>', methods=['POST'])
def addTest(item_id):
    try:
        data = request.json
        question = data['question']
        option1 = data['option1']
        option2 = data['option2']
        option3 = data['option3']
        option4 = data['option4']
        answer = data['correct-answer']
        solution = data['solution']

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(id) FROM test")
        max_id = cursor.fetchone()[0]
        new_id = (max_id + 1) if max_id else 1

        cursor.execute(
            'INSERT INTO test (id, id_unit, question, answer, choice1, choice2, choice3, choice4, description) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)',
            (new_id, item_id, question, answer, option1, option2, option3, option4, solution))

        conn.commit()
        conn.close()

        return jsonify({"message": "Test added successfully"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@post_routes.route('/editTest/<int:item_id>', methods=['POST'])
def editTest(item_id):
    try:
        data = request.json
        question = data['question']
        option1 = data['option1']
        option2 = data['option2']
        option3 = data['option3']
        option4 = data['option4']
        answer = data['correct_answer']
        solution = data['solution']

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            'UPDATE test SET question = %s, answer = %s, choice1 = %s, choice2 = %s, choice3 = %s, choice4 = %s, description = %s WHERE id = %s',
            (question, answer, option1, option2, option3, option4, solution, item_id))

        conn.commit()
        conn.close()

        return jsonify({"message": "Test updated successfully"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@post_routes.route('/deleteTest/<int:item_id>', methods=['POST'])
def deleteTest(item_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM test WHERE id = %s", (item_id,))
        item = cursor.fetchone()
        if item is None:
            cursor.close()
            conn.close()
            return jsonify({"error": "Item not found"}), 404

        cursor.execute("DELETE FROM test WHERE id = %s", (item_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return '', 204
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@post_routes.route('/addMaterial/<int:item_id>', methods=['POST'])
def addMaterial(item_id):
    try:
        data = request.json
        title = data['title']
        description = data['description']

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(id) FROM test")
        max_id = cursor.fetchone()[0]
        new_id = (max_id + 1) if max_id else 1
        cursor.execute(
            'INSERT INTO materials (id, id_unit, title, description) VALUES (%s, %s, %s, %s)',
            (new_id, item_id, title, description))

        conn.commit()
        conn.close()

        return jsonify({"message": "Material added successfully"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@post_routes.route('/editMaterial/<int:item_id>', methods=['POST'])
def editMaterial(item_id):
    try:
        data = request.json
        title = data['title']
        description = data['description']

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('UPDATE materials SET title = %s, description = %s WHERE id = %s', (title, description, item_id))

        conn.commit()
        conn.close()
        return jsonify({"message": "Test updated successfully"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@post_routes.route('/deleteMaterial/<int:item_id>', methods=['POST'])
def deleteMaterial(item_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM materials WHERE id = %s", (item_id,))
        item = cursor.fetchone()
        if item is None:
            cursor.close()
            conn.close()
            return jsonify({"error": "Item not found"}), 404

        cursor.execute("DELETE FROM materials WHERE id = %s", (item_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return '', 204
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@post_routes.route('/checkAnswers', methods=['POST'])
def check_answers():
    answers = request.json  # Отримуємо масив відповідей від користувача
    conn = get_db_connection()
    cursor = conn.cursor()

    results = []

    print("check_answers")
    try:
        for answer in answers:
            cursor.execute("SELECT answer FROM test WHERE id = %s", (answer['id'],))
            correct_answer = cursor.fetchone()
            if correct_answer:
                correct_answer_text = correct_answer[0].strip().lower() if correct_answer[0] else ''
                user_answer_text = answer['user_answer'].strip().lower()
                is_correct = correct_answer_text == user_answer_text
                results.append({
                    'id': answer['id'],
                    'is_correct': is_correct
                })
                print(f"Test ID: {answer['id']}, User Answer: {answer['user_answer']}, Correct Answer: {correct_answer_text}, Result: {is_correct}")
        return jsonify(results)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})
    finally:
        cursor.close()
        conn.close()
