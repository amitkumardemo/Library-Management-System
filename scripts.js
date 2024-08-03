document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    loadStudents();
    fetchCurrentTime();
});

const addBookForm = document.getElementById('addBookForm');
const bookList = document.getElementById('bookList');
const searchButton = document.getElementById('searchButton');
const searchQuery = document.getElementById('searchQuery');
const enterStudentForm = document.getElementById('enterStudentForm');
const leaveStudentForm = document.getElementById('leaveStudentForm');
const studentList = document.getElementById('studentList');
const issueBookForm = document.getElementById('issueBookForm');
const returnBookForm = document.getElementById('returnBookForm');
const currentTimeElement = document.getElementById('currentTime');

addBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('bookName').value;
    const author = document.getElementById('authorName').value;
    const id = document.getElementById('bookId').value;
    fetch('/add_book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, author, id })
    }).then(() => {
        addBookForm.reset();
        loadBooks();
    });
});

function loadBooks() {
    fetch('/books')
        .then(response => response.json())
        .then(books => {
            bookList.innerHTML = '';
            books.forEach(book => {
                const li = document.createElement('li');
                li.textContent = `${book.name} by ${book.author} (ID: ${book.id}, Status: ${book.status})`;
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', () => {
                    removeBook(book.id);
                });
                li.appendChild(removeButton);
                bookList.appendChild(li);
            });
        });
}

function removeBook(id) {
    fetch('/remove_book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    }).then(() => {
        loadBooks();
    });
}

searchButton.addEventListener('click', () => {
    const query = searchQuery.value.toLowerCase();
    fetch('/books')
        .then(response => response.json())
        .then(books => {
            bookList.innerHTML = '';
            books.forEach(book => {
                if (book.name.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)) {
                    const li = document.createElement('li');
                    li.textContent = `${book.name} by ${book.author} (ID: ${book.id}, Status: ${book.status})`;
                    bookList.appendChild(li);
                }
            });
        });
});

enterStudentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('studentName').value;
    fetch('/add_student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    }).then(() => {
        enterStudentForm.reset();
        loadStudents();
    });
});

leaveStudentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('studentNameLeave').value;
    fetch('/remove_student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    }).then(() => {
        leaveStudentForm.reset();
        loadStudents();
    });
});

function loadStudents() {
    fetch('/students')
        .then(response => response.json())
        .then(students => {
            studentList.innerHTML = '';
            students.forEach(student => {
                const li = document.createElement('li');
                li.textContent = student;
                studentList.appendChild(li);
            });
        });
}

issueBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('issueBookId').value;
    const student = document.getElementById('issueStudentName').value;
    fetch('/issue_book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, student })
    }).then(() => {
        issueBookForm.reset();
        loadBooks();
    });
});

returnBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('returnBookId').value;
    fetch('/return_book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    }).then(() => {
        returnBookForm.reset();
        loadBooks();
    });
});

function fetchCurrentTime() {
    fetch('/current_time')
        .then(response => response.json())
        .then(data => {
            currentTimeElement.textContent = `Current Time: ${data.current_time}`;
        });
}
