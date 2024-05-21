from flask import Flask, render_template, request, redirect, url_for, flash
import psycopg2

app = Flask(__name__)
app.secret_key = 'key'
def get_db_connection():
    conn = None
    try:
        conn = psycopg2.connect(
            dbname='afikyvbw',
            user='afikyvbw',
            password='Ikyv32pHZyeY6uhOHOuQk0xULTNbjqVG',
            host='isilo.db.elephantsql.com'
        )
        print("Соединение с базой данных установлено успешно.")
    except psycopg2.Error as e:
        print(f"Ошибка при соединении с базой данных: {e}")
    return conn

@app.route('/login_admin', methods =['POST'])
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
    return redirect(url_for('admin_panel_auth'))
@app.route('/admin_panel_auth')
def admin_panel_auth():
    return render_template('admin_panel_auth.html')

@app.route('/registration')
def registration():
    return render_template('registration.html')

@app.route('/admin_panel')
def admin_panel():
    return render_template('admin_panel.html')

@app.route('/test')
def test():
    return render_template('test.html')

if __name__ == "__main__":
    app.run()
