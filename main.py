from flask import Flask, render_template
from server import post_routes

app = Flask(__name__)
app.secret_key = 'key'
app.register_blueprint(post_routes)

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

@app.route('/user_auth')
def user_auth():
    return render_template('auth.html')

if __name__ == "__main__":
    app.run()
