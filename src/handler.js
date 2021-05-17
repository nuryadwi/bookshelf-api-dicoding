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

const getAllBooksHandler = (request,h) => {

   const {name, reading, finished} = request.query;
   if(name !== undefined) {
      const stringFormat = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase() ));
      return h.response({
         status: 'success',
         data: {
            books: stringFormat.map((book) => ({
               id: book.id,
               name: book.name,
               publisher: book.publisher
            })),
         }
      })
   } else if(reading !== undefined) {
      const readStatus = books.filter((book) => book.reading === (reading === '1')).map((book) => ({
         id: book.id,
         name: book.name,
         publisher: book.publisher,
      }));

      const response = h.response({
         status:'success',
         data:{
            books: readStatus
         }
      });
      response.code(200);
      return response;
   } else if(finished !== undefined) {
      const finishStatus = books.filter((book) => book.reading === (finished === '1')).map((book) => ({
         id: book.id,
         name: book.name,
         publisher: book.publisher,
      }));

      const response = h.response({
         status:'success',
         data:{
            books: finishStatus
         }
      });
      response.code(200);
      return response;
   }else {
      const booksData = books.map((book) => ({
         id: book.id,
         name: book.name,
         publisher:book.publisher
      }));
      if(booksData !== undefined) {
         return {
            status: 'success',
            data: {
               books:booksData,
            },
         }
      }
   }

}

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

const editBookByIdHandler = (request, h) => {
   const { id } = request.params;

   const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
   const updatedAt = new Date().toISOString();

   if(!name) {
      const response = h.response({
         status:'fail',
         message: 'Gagal memperbarui buku. Mohon isi nama buku'
      });
      response.code(400)
      return response;
   }
   if(readPage > pageCount){
      const response = h.response({
         status: 'fail',
         message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      });
      response.code(400);
      return response;
   }

   const index = books.findIndex((book) => book.id === id);
   if(index !== -1) {
      books[index] ={
         ...books[index],
         name,
         year,
         author,
         summary,
         publisher,
         pageCount,
         readPage,
         reading,
         updatedAt,
      };

      const response = h.response({
         status: 'success',
         message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
   }

   const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
   });
   response.code(404);
   return response;
}

const deleteBookByIdHanlder = (request, h) => {
   const { id } = request.params;
   const index = books.findIndex((book) => book.id === id);

   if(index !== -1) {
      books.splice(index, 1);
      const response = h.response({
         status: 'success',
         message: 'Buku berhasil dihapus',
      });
      response.code(200)
      return response;
   }

   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
   });
   response.code(404);
   return response;
}

module.exports = {
   addBookHandler,
   getAllBooksHandler,
   getBookByIdHandler,
   editBookByIdHandler,
   deleteBookByIdHanlder
};