const book = require('./book');
const {nanoid} = require('nanoid');

const addBookHandler = (request, h) => {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
  
    // Validate the 'name' field
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'GAGAL TAMBAH BUKU, ISI NAMA BUKU',
      });
      response.code(400);
      return response;
    }
  
    // Validate that readPage is not greater than pageCount
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'GAGAL TAMBAH BUKU READ PAGE TDIAK BOLEH LEBIH BESAR DARI PAGE COUNT',
      });
      response.code(400);
      return response;
    }
  
    // Create a new book object
    const id = nanoid(16);
    const timestamp = new Date().toISOString();
    const finished = pageCount === readPage;
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt: timestamp,
      updatedAt: timestamp,
    };
  
    // Add the new book to the book array
    book.push(newBook);
  
    // Verify if the book was successfully added
    const wasAdded = book.some((b) => b.id === id);
  
    if (wasAdded) {
      const response = h.response({
        status: 'success',
        message: 'BUKU SUKSES DITAMBAH',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  
    // Handle the case where the book was not added
    const response = h.response({
      status: 'fail',
      message: 'BUKU GAGAL DITAMBAH',
    });
    response.code(500);
    return response;
  };
  
  module.exports = { addBookHandler };

  const getAllBooksHandler = (request, h) => {
    const { query } = request;
  
    // Make a copy of the book array to filter
    let selectedBooks = Array.from(book);
  
    // Filter books by name if provided (case insensitive)
    if (query.name) {
      const searchName = query.name.toLowerCase();
      selectedBooks = selectedBooks.filter(b => 
        b.name.toLowerCase().includes(searchName)
      );
    }
  
    // Filter books by reading status if provided
    if (query.reading !== undefined) {
      const isReading = query.reading === '1';
      selectedBooks = selectedBooks.filter(b => 
        b.reading === isReading
      );
    }
  
    // Filter books by finished status if provided
    if (query.finished !== undefined) {
      const isFinished = query.finished === '1';
      selectedBooks = selectedBooks.filter(b => 
        b.finished === isFinished
      );
    }
  
    // Construct response data
    const responseData = {
      status: 'success',
      data: {
        books: selectedBooks.map(b => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    };
  
    // Return response with status code 200
    return h.response(responseData).code(200);
  };
  
  module.exports = { getAllBooksHandler };
  
  const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
  
    // Find the book by ID
    const foundBook = book.find(b => b.id === id);
  
    // Check if the book was found
    if (foundBook) {
      return {
        status: 'success',
        data: {
          book: foundBook,
        },
      };
    }
  
    // If the book is not found, return a 404 response
    const response = h.response({
      status: 'fail',
      message: 'BUKU NOT FOUND',
    });
    response.code(404);
    return response;
  };
  
  module.exports = { getBookByIdHandler };

  const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
  
    // Validate the 'name' field
    if (!name) {
      return h.response({
        status: 'fail',
        message: 'GAGAL UPDATE BUKU, ISI NAMA BUKU',
      }).code(400);
    }
  
    // Validate that readPage is not greater than pageCount
    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message: 'GAGAL UDPATE BUKU, REDAD PAGE TODAK BOLEH LEBIH BESAR DARI PAGE CAONT',
      }).code(400);
    }
  
    // Find the index of the book to be updated
    const index = book.findIndex(b => b.id === id);
  
    // Update the book if it exists
    if (index !== -1) {
      const updatedAt = new Date().toISOString();
      book[index] = {
        ...book[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: pageCount === readPage,
        reading,
        updatedAt,
      };
  
      const response = h.response({
        status: 'success',
        message: 'BUKU BERHASIL DI YUPDATE',
      });
      response.code(200);
      return response;
    }
  
    // Handle the case where the book ID was not found
    const response = h.response({
      status: 'fail',
      message: 'GAGAL UPDATE BUKU, ID TIDAK KETEMU',
    });
    response.code(404);
    return response;
  };
  
  module.exports = { editBookByIdHandler };

  const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
  
    // Find the index of the book to be deleted
    const index = book.findIndex(b => b.id === id);
  
    // Check if the book exists and delete if found
    if (index !== -1) {
      book.splice(index, 1);
  
      // Respond with success message
      return h.response({
        status: 'success',
        message: 'BUKU BERHASIL DI DELETE',
      }).code(200);
    }
  
    // Respond with failure message if book not found
    return h.response({
      status: 'fail',
      message: 'BUKU GAGAL DI HAPUS, ID NOT FOUND',
    }).code(404);
  };
  
  module.exports = {
    getAllBooksHandler,
    getBookByIdHandler,
    addBookHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
  };
  
  
  