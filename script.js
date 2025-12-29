let books = JSON.parse(localStorage.getItem("books")) || [];

const loadingText = document.getElementById("loading");
loadingText.style.display = "none";

function fetchBooks() {
    const query = document.getElementById("searchQuery").value || "programming";
    loadingText.style.display = "block";

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then(res => res.json())
        .then(data => {
            books = [];

            data.items.slice(0, 10).forEach(item => {
                books.push({
                    id: item.id.substring(0, 6),
                    name: item.volumeInfo.title || "N/A",
                    author: item.volumeInfo.authors
                        ? item.volumeInfo.authors.join(", ")
                        : "Unknown",
                    issued: false,
                    issueDate: "-",
                    returnDate: "-"
                });
            });

            localStorage.setItem("books", JSON.stringify(books));
            displayBooks();
            loadingText.style.display = "none";
        })
        .catch(() => {
            alert("Error loading books");
            loadingText.style.display = "none";
        });
}

function displayBooks() {
    const table = document.getElementById("bookList");
    table.innerHTML = "";

    books.forEach((book, index) => {
        table.innerHTML += `
            <tr>
                <td>${book.id}</td>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td class="${book.issued ? 'issued' : 'available'}">
                    ${book.issued ? "Issued" : "Available"}
                </td>
                <td>${book.issueDate}</td>
                <td>${book.returnDate}</td>
                <td>
                    <button class="${book.issued ? 'return' : 'issue'}"
                        onclick="toggleIssue(${index})">
                        ${book.issued ? "Return" : "Issue"}
                    </button>
                </td>
            </tr>
        `;
    });
}

function toggleIssue(index) {
    const today = new Date().toLocaleDateString();

    if (!books[index].issued) {
        books[index].issued = true;
        books[index].issueDate = today;
        books[index].returnDate = "-";
    } else {
        books[index].issued = false;
        books[index].returnDate = today;
        books[index].issueDate = "-";
    }

    localStorage.setItem("books", JSON.stringify(books));
    displayBooks();
}

displayBooks();
