document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const booksContainer = document.getElementById('booksContainer');

    function searchBooks() {
        const query = searchInput.value.trim();
        if (!query) return;

        fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const books = data.items || []; 
                
                booksContainer.innerHTML = ''; // Clear previous results
                if (books.length === 0) {
                    booksContainer.innerHTML = '<p>No books found for this search query.</p>';
                    return;
                }

                books.forEach(book => {
                    const bookInfo = book.volumeInfo;

                    // Create the book card
                    const bookCard = document.createElement('div');
                    bookCard.classList.add('book-card');
                    bookCard.innerHTML = `
                        <img src="${bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150'}" alt="${bookInfo.title}">
                        <h3>${bookInfo.title || 'No Title Available'}</h3>
                        <p>Author: ${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown'}</p>
                        <a href="${bookInfo.previewLink || '#'}" target="_blank">Preview</a>
                    `;
                    booksContainer.appendChild(bookCard);
                });
            })
            .catch(error => {
                console.error('Search error:', error);
                booksContainer.innerHTML = '<p>Error finding books. Please try again later.</p>';
            });
    }

    searchButton.addEventListener('click', searchBooks);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBooks();
    });
});
