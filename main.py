from flask import Flask, render_template
import psycopg2

app = Flask(__name__)
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

def get_existing_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public';  -- Указываем схему таблиц (обычно 'public')
        """)
        tables = cursor.fetchall()
        return [table[0] for table in tables]  # Возвращаем список имен таблиц
    except psycopg2.Error as e:
        print(f"Ошибка при выполнении запроса: {e}")
    finally:
        cursor.close()
        conn.close()


@app.route('/users')
def show_users():
    existing_tables = get_existing_tables()
    if 'users' in existing_tables:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT login FROM users')
        users = cursor.fetchall()
        cursor.close()
        conn.close()
        return render_template('users.html', users=users)
    else:
        print("Таблица Users не существует")


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
