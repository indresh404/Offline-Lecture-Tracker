from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS  
import os

app = Flask(__name__, static_folder="../public")
CORS(app)  

LECTURES_DIR = "../public/lectures"

def get_days():
    days = []
    for day_name in sorted(os.listdir(LECTURES_DIR)):
        day_path = os.path.join(LECTURES_DIR, day_name)
        if os.path.isdir(day_path):
            files = sorted(os.listdir(day_path))
            days.append({"day": day_name, "files": files})
    return days

@app.route("/api/lectures")
def lectures():
    return jsonify({
        "course": "AIML Apna College",
        "days": get_days()
    })

# Optional: serve videos/PDFs through Flask
@app.route("/lectures/<day>/<filename>")
def serve_file(day, filename):
    return send_from_directory(os.path.join(LECTURES_DIR, day), filename)

if __name__ == "__main__":
    app.run(debug=True)
