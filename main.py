from flask import Flask, render_template


app = Flask(__name__)

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
