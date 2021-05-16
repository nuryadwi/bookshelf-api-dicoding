const books = require('./books');
const { nanoid } = require('nanoid');

const addBookHandler = (request, h) => {
   const { name, year, author, summary, publisher, pageCount,readPage,reading } = request.payload;

   const id = nanoid(16);
   const insertedAt = new Date().toISOString();
   const updatedAt = insertedAt;
   const finished = pageCount === readPage ? true : false;
   const newBook = {
      id,name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt,
   };
   books.push(newBook);

   if(!name) {
      const response = h.response({
         status:'fail',
         message: 'Gagal menambahkan buku. Mohon isi nama buku'
      });
      response.code(400)
      return response;
   }
   if(readPage > pageCount){
      const response = h.response({
         status: 'fail',
         message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      });
      response.code(400);
      return response;
   }
   const isSuccess = books.filter((book) => book.id === id).length > 0;

   if(isSuccess) {
      const response = h.response({
         status: 'success',
         message: 'Buku berhasil ditambahkan',
         data: {
            bookId: id,
         },
      });
      response.code(201);
      return response;
   }

   const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan'
   });
   response.code(500);
   return response;
};

const getAllBooksHandler = () => ({
   status: 'success',
   data: {
      books: books.map((book) => ({
         id: book.id,
         name: book.name,
         publisher: book.publisher
      })),
   },
});

const getBookByIdHandler = (request, h) => {
   const { id } = request.params;

   const book = books.filter((n) => n.id === id)[0];
   if(book !== undefined) {
      return {
         status: 'success',
         data: {
            book,
         },
      };
   }
   
   const response = h.response({
      status:'fail',
      message: 'Buku tidak ditemukan'
   });
   response.code(404);
   return response;
};

module.exports = {
   addBookHandler,
   getAllBooksHandler,
   getBookByIdHandler
};