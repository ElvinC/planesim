from flask import Flask, request
from flask import render_template
import random
import requests
app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')


if __name__ == "__main__":
	app.run(host="0.0.0.0", port=5000, debug=True)

