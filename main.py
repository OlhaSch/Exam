<<<<<<< HEAD
from flask import Flask, render_template
=======
from flask import Flask
>>>>>>> 2f5c70a006a5e683ea996b0b8dc35e0b0f98c2e2

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

<<<<<<< HEAD
@app.route('/admin_panel')
def admin_panel():
    return render_template('admin_panel.html')

if __name__ == "__main__":
    app.run()
=======
if __name__ == "__main__":
    app.run()
>>>>>>> 2f5c70a006a5e683ea996b0b8dc35e0b0f98c2e2
