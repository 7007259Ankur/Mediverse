from flask import Flask
from flask_cors import CORS
from flask_ai import init_health_module

app = Flask(__name__)
CORS(app)

# Initialize health prediction module
init_health_module(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)