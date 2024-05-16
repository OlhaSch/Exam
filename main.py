from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/admin_panel')
def admin_panel():
    return render_template('admin_panel.html')

if __name__ == "__main__":
    app.run()