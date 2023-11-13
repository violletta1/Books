const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const expect = chai.expect;


chai.use(chaiHttp);

describe("Books API Test", () => {
    let bookId;

    it('should POST a book', (done) => {
        const book = { id: "1", title: "Test Book", author: "Test Author" };
        chai.request(server)
            .post('/books')
            .send(book)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                bookId = res.body.id; // corrected to res.body.id
                done();
            });
    });

    it('should GET all books', (done) => {
        chai.request(server)
            .get('/books')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    it('should verify getting a single book', (done) => {
        chai
          .request(server)
          .get(`/books/${bookId}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('title');
            expect(res.body).to.have.property('author');
            done();
          });
    });

    it('should verify updating a book', (done) => {
        const updatedBook = {
            id: bookId,
          title: 'Updated Title',
          author: 'Updated Author',
        };
    
        chai
          .request(server)
          .put(`/books/${bookId}`)
          .send(updatedBook)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.title).to.equal(updatedBook.title);
            expect(res.body.author).to.equal(updatedBook.author);
            done();
          });
      });
    
      it('should verify deleting a book', (done) => {
        chai
          .request(server)
          .delete(`/books/${bookId}`)
          .end((err, res) => {
            expect(res).to.have.status(204);
            done();
          });
      });
    
      it('should verify non-existing book operations', (done) => {
        chai
          .request(server)
          .get('/books/9999')
          .end((err, res) => {
            expect(res).to.have.status(404);
      
            chai
              .request(server)
              .put('/books/9999')
              .send({ title: 'Updated Title', author: 'Updated Author' })
              .end((err, res) => {
                expect(res).to.have.status(404);
      
                chai
                  .request(server)
                  .delete('/books/9999')
                  .end((err, res) => {
                    expect(res).to.have.status(404);
                    done(); // Call done() once all checks are completed.
                  });
              });
          });
      });
      

});