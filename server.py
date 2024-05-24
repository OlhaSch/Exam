from flask import Flask, request, redirect, url_for, flash, Blueprint, jsonify
import psycopg2
import mysql.connector

post_routes = Blueprint('post_routes', __name__)


def get_db_connection():
    conn = None
    try:
        conn = psycopg2.connect(
            dbname='afikyvbw',
            user='afikyvbw',
            password='Ikyv32pHZyeY6uhOHOuQk0xULTNbjqVG',
            host='isilo.db.elephantsql.com'
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
    cursor = conn.cursor()
    try:
        cursor.execute('Select * From users WHERE login = %s AND password = %s', (email, password))
        user = cursor.fetchone()
        if user:
            print(f"Користувача {email} знайдено")
            return redirect(url_for('admin_panel'))
        else:
            flash("Не вірні дані, спробуйте ще раз.", "error")
            return redirect(url_for('admin_panel_auth'))
    except psycopg2.Error as e:
        flash(f"Помилка при виконанні запиту {e}", "error")
        return redirect(url_for('admin_panel_auth'))
    finally:
        conn.close()


@post_routes.route('/auth', methods=['POST'])
def auth():
    login = request.form['email']
    password = request.form['password']
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('Select * From users WHERE login = %s AND password = %s', (login, password))
        users = cursor.fetchone()
        if users:
            print(f"User {login} was found")
            return redirect(url_for('test'))
        else:
            flash("Не вірні дані, спробуйте ще раз.", "error")
            return redirect(url_for('user_auth'))
    except psycopg2.Error as e:
        flash(f"Помилка при виконанні запиту {e}", "error")
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
        test['add_url'] = '/static/images/add.png'
        tests.append(test)
    conn.close()
    print("Fetched tests:", tests)
    return jsonify(tests)

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
        theory['add_url'] = '/static/images/add.png'
        theorys.append(theory)
    conn.close()
    print("Fetched tests:", theorys)
    return jsonify(theorys)
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
        conn.close()
        cursor.close()
        return '', 204
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@post_routes.route('/addSubject/<int:item_id>', methods=['POST'])
def addSubject(item_id):
    try:
        new_text = request.json['text']
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(id) FROM section")
        max_id = cursor.fetchone()[0]
        new_id = (max_id + 1) if max_id else 1
        cursor.execute('INSERT INTO section (id, section, id_subject) VALUES (%s, %s, %s)', (new_id, new_text, item_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Subject added successfully"}), 200
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
