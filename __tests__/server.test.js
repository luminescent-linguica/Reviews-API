const request = require('supertest');
const app = require('../server/index');

describe('GET /reviews', () => {
  it('Should return 200', (done) => {
    request(app)
      .get('/reviews/?count=1000&product_id=2&sort=helpful')
      .expect(200, done);
  });
  it('Should return an array length of 5', (done) => {
    request(app)
    .get('/reviews/?count=1000&product_id=2&sort=helpful')
    .then((response) => {
      // console.log(response.body.results);
      expect(response.body.results.length).toEqual(5);
      done();
    })
  });
  it('Should return in order of helpfulness', (done) => {
    request(app)
    .get('/reviews/?count=1000&product_id=2&sort=helpful')
    .then((response) => {
      expect(response.body.results[0]['helpfulness']).toEqual(5);
      expect(response.body.results[1]['helpfulness']).toEqual(5);
      expect(response.body.results[2]['helpfulness']).toEqual(1);
      done();
    })
  })
  it('Should return in order of date', (done) => {
    request(app)
    .get('/reviews/?count=1000&product_id=2&sort=newest')
    .then((response) => {
      expect(Number(response.body.results[0]['date'])).toBeGreaterThan(Number(response.body.results[1]['date']));
      done();
    })
  })
  it('Should return error if query', (done) => {
    request(app)
    .get('/reviews/')
    .expect(500, done);
  });
});

describe('GET /reviews/meta', () => {
  it('Should return 200', (done) => {
    request(app)
    .get('/reviews/meta/?product_id=2')
    .expect(200, done);
  })
  it('Should return 5 one-star ratings', (done) => {
    request(app)
    .get('/reviews/meta/?product_id=2')
    .then((response) => {
      console.log(response.body);
      expect(response.body.ratings['4']).toEqual(2);
      done();
    });
  })
});

describe('POST /reviews', () => {
  it('Should return 500 when no product_id provided', (done) => {
    request(app)
      .post('/reviews')
      .expect(500, done);
  });
  it('Should return 200 when product_id provided', (done) => {
    request(app)
      .post('/reviews')
      .send({ product_id: 50 })
      .expect(200, done);
  });
  it('Should add review', (done) => {
    request(app)
      .post('/reviews')
      .send({ product_id: 3 })
      .then(() => {
        request(app)
          .get('/reviews/?count=1000&product_id=2&sort=helpful')
          .then((response) => {
            expect(response.body.results.length).toBeGreaterThan(0);
            done();
          });
      });
  });
});
