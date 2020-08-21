// Book Class: Represents the BluePrint for creating a Book
class Book {
    constructor (title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}



// Store Class: Stores Book in localStorage
class Storage {
    // Get Books from localStorage
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse( localStorage.getItem('books') );
        }

        return books;
    }

    // Add Book to localStorage
    static addBookToLocalStorage(book) {
        // This returns an empty books array if nothing has been added to localStorage
        // or returns an array containing books if it has been added to localStorage
        const books = Storage.getBooks();

        // Adds the book to the books array gotten from the getBooks()
        books.push(book);

        // This adds or sets the new books array to the localStorage
        localStorage.setItem('books', JSON.stringify(books) );
    }

    // Remove Book from localStorage
    static removeBookFromLocalStorage(isbn) {
        const books = Storage.getBooks();

        // Loops through the books array to find the book object containing the isbn
        // passed into the removeBookFromLocalStorage() and remove it
        books.forEach(function(book, index) {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        // Update the localStorage with the most recent version of the books array
        localStorage.setItem('books', JSON.stringify(books) );
    }
}




// UI Class: Displays the Book 
class UI {
    static displayBooks() {
        // Remember getBooks() returns an array of books stored in localStorage or an
        // empty array if nothing has been put in local storage yet
        const books = Storage.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Clear the Alert Message after 3seconds
        setTimeout(function() {
            document.querySelector('.alert').remove();
        }, 2000);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete') ) {
            el.parentElement.parentElement.remove();
        }
    }

    static clearInputField() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}



// Event: Display Books from the localStorage
document.addEventListener('DOMContentLoaded', UI.displayBooks());

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', function(e) {
    // Prevent the Normal Action of the Submit Form
    e.preventDefault();

    // Get the Input Fields
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please Fill In All The Fields', 'danger');
    } else {
        // Instantiate a Book object
        const book = new Book(title, author, isbn);

        // Add Book To UI
        UI.addBookToList(book);

        // Add Book to localStorage
        Storage.addBookToLocalStorage(book);

        // Show Success Alert
        UI.showAlert('Book Has Been Successfuly Added', 'success');

        // Clear the Input Fields
        UI.clearInputField();
    }
});

// Event: Remove a Book
const list = document.querySelector('#book-list');

list.addEventListener('click', function(e) {
    // Remove Book When Cancel Button is Clicked
    UI.deleteBook(e.target);

    // Show Success Message After Deleting Book
    UI.showAlert('Book Has Been Deleted Successfully', 'success');

    // Remove Book from localStorage
    // The long string attached to e.target, targets the td content containing the
    // isbn from the delete button that was clicked
    Storage.removeBookFromLocalStorage(e.target.parentElement.previousElementSibling.textContent);
});