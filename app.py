from flask import Flask, request, jsonify, render_template
import json
import os
from datetime import datetime

app = Flask(__name__)

DATA_DIR = 'data'
BOOKS_FILE = os.path.join(DATA_DIR, 'books.json')
STUDENTS_FILE = os.path.join(DATA_DIR, 'students.json')

def load_data(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            return json.load(file)
    return []

def save_data(filename, data):
    with open(filename, 'w') as file:
        json.dump(data, file)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/books', methods=['GET'])
def get_books():
    books = load_data(BOOKS_FILE)
    return jsonify(books)

@app.route('/students', methods=['GET'])
def get_students():
    students = load_data(STUDENTS_FILE)
    return jsonify(students)

@app.route('/add_book', methods=['POST'])
def add_book():
    book = request.json
    books = load_data(BOOKS_FILE)
    books.append({**book, 'status': 'available'})
    save_data(BOOKS_FILE, books)
    return '', 200

@app.route('/remove_book', methods=['POST'])
def remove_book():
    data = request.json
    book_id = data['id']
    books = load_data(BOOKS_FILE)
    books = [book for book in books if book['id'] != book_id]
    save_data(BOOKS_FILE, books)
    return '', 200

@app.route('/issue_book', methods=['POST'])
def issue_book():
    data = request.json
    book_id = data['id']
    books = load_data(BOOKS_FILE)
    for book in books:
        if book['id'] == book_id and book['status'] == 'available':
            book['status'] = 'issued'
            book['issued_to'] = data['student']
            save_data(BOOKS_FILE, books)
            return '', 200
    return 'Book not available', 400

@app.route('/return_book', methods=['POST'])
def return_book():
    data = request.json
    book_id = data['id']
    books = load_data(BOOKS_FILE)
    for book in books:
        if book['id'] == book_id and book['status'] == 'issued':
            book['status'] = 'available'
            book.pop('issued_to', None)
            save_data(BOOKS_FILE, books)
            return '', 200
    return 'Book not found or not issued', 400

@app.route('/add_student', methods=['POST'])
def add_student():
    data = request.json
    students = load_data(STUDENTS_FILE)
    students.append(data['name'])
    save_data(STUDENTS_FILE, students)
    return '', 200

@app.route('/remove_student', methods=['POST'])
def remove_student():
    data = request.json
    name = data['name']
    students = load_data(STUDENTS_FILE)
    students = [student for student in students if student != name]
    save_data(STUDENTS_FILE, students)
    return '', 200

@app.route('/current_time', methods=['GET'])
def current_time():
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    return jsonify({'current_time': now})

if __name__ == '__main__':
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    app.run(debug=True)
