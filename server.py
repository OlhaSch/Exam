from flask import Flask,  request, redirect, url_for, flash, Blueprint
import psycopg2
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

@post_routes.route('/login_admin', methods =['POST'])
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
        cursor.close()
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
        cursor.close()