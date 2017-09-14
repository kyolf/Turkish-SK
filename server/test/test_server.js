'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const faker = require('faker');

const mongoose = require('mongoose');

const {closeServer, runServer, app} = require('../index');

const {User} = require('../models/models_user');
const {Vocab} = require('../models/models_vocab');

const {TEST_DATABASE_URL} = require('../secret');

const should = chai.should();
chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection
    .dropDatabase()
    .then(result => {
      return resolve(result);
    })
    .catch(err => {
      return reject(err);
    });
  });
}

function seedVocab(){
  const seedData = [];
  for(let i = 0; i < 10; i++) {
    seedData.push({
      turkWord: faker.name.firstName(),
      engWord: faker.name.lastName(),
      questId: i
    });
  }
  return Vocab.insertMany(seedData);
}

describe('Vocab API Testing', () => {
  before(function() {
    return runServer(undefined, TEST_DATABASE_URL);
  });

  beforeEach(() =>{
    return seedVocab();
  });

  afterEach(() => {
    return tearDownDb();
  });

  after(function(){
    return closeServer();
  });

  describe('Get Endpoint', () => {
    it('get all vocabs', () => {
      let vocab;

      return chai.request(app)
        .get('/api/vocab/')
        .then(res => {
          res.should.be.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.be.at.least(1);
          res.body.forEach(_vocab => {
            _vocab.should.be.a('object');
            _vocab.should.include.key('id', 'turkWord', 'engWord', 'questId');
          });
          vocab = res.body[0];
          return Vocab
            .findById(vocab.id)
            .exec();
        })
        .then(vocabPair => {
          vocabPair.turkWord.should.equal(vocab.turkWord);
          vocabPair.engWord.should.equal(vocab.engWord);
          vocabPair.questId.should.equal(vocab.questId);
        });
    });
  });

  describe('Post Endpoint', () => {
    it('allow us to post vocabs', () => {
      let vocab;
      const newVocab = {
        turkWord:'su',
        engWord:'water',
        questId: 11
      };

      return chai.request(app)
        .post('/api/vocab/')
        .send(newVocab)
        .then(res => {
          res.should.be.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(['engWord', 'turkWord', 'questId']);
          res.body.engWord.should.equal(newVocab.engWord);
          res.body.turkWord.should.equal(newVocab.turkWord);
          res.body.questId.should.equal(newVocab.questId);
          vocab = res.body;
          return Vocab
            .findById(vocab.id)
            .exec();
        })
        .then(vocabPair => {
          vocabPair.turkWord.should.equal(vocab.turkWord);
          vocabPair.engWord.should.equal(vocab.engWord);
          vocabPair.questId.should.equal(vocab.questId);
        });
    });

    it('should not allow to post if turkWord is not a string', ()=>{
      const newVocab = {
        turkWord: 11,
        engWord: 'water',
        questId: 11
      };

      return chai.request(app)
      .post('/api/vocab/')
      .send(newVocab)
      .catch(res => {
        res.should.have.status(422);
      });
    });

    it('should not allow to post if engWord is not a string', ()=>{
      const newVocab = {
        turkWord: 'su',
        engWord: 11,
        questId: 11
      };

      return chai.request(app)
      .post('/api/vocab/')
      .send(newVocab)
      .catch(res => {
        res.should.have.status(422);
      });
    });

    it('should not allow to post if questId is not a number', ()=>{
      const newVocab = {
        turkWord: 'su',
        engWord: '11',
        questId: '11'
      };

      return chai.request(app)
      .post('/api/vocab/')
      .send(newVocab)
      .catch(res => {
        res.should.have.status(422);
      });
    });

    it('should not allow to post if turkWord is not there', ()=>{
      const newVocab = {
        engWord: '11',
        questId: 11
      };

      return chai.request(app)
      .post('/api/vocab/')
      .send(newVocab)
      .catch(res => {
        res.should.have.status(400);
      });
    });

    it('should not allow to post if engWord is not there', ()=>{
      const newVocab = {
        turkWord: 'su',
        questId: 11
      };

      return chai.request(app)
      .post('/api/vocab/')
      .send(newVocab)
      .catch(res => {
        res.should.have.status(400);
      });
    });

    it('should not allow to post if questId is not there', ()=>{
      const newVocab = {
        turkWord: 'su',
        engWord: '11',
      };
      return chai.request(app)
      .post('/api/vocab/')
      .send(newVocab)
      .catch(res => {
        res.should.have.status(400);
      });
    });
  });

  describe('Put Endpoint', () => {
    it('allow us to update a entry', () => {
      let vocab;
      const updVocab = {
        turkWord: 'kahve',
        engWord: 'coffee'
      };

      return Vocab
        .findOne()
        .exec()
        .then(res => {
          updVocab.id = res.id;
          return chai
            .request(app)
            .put(`/api/vocab/${updVocab.id}`)
            .send(updVocab);
        })
        .then(res => {
          res.should.be.json;
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.include.keys(['id', 'turkWord', 'engWord', 'questId']);
          res.body.id.should.not.be.null;
          res.body.turkWord.should.equal(updVocab.turkWord);
          res.body.engWord.should.equal(updVocab.engWord);
          vocab = res.body;
          return Vocab
            .findById(vocab.id)
            .exec();
        })
        .then(vocabDB => {
          vocabDB.id.should.equal(vocab.id);
          vocabDB.turkWord.should.equal(vocab.turkWord);
          vocabDB.engWord.should.equal(vocab.engWord);
          vocabDB.questId.should.equal(vocab.questId);
        });
    });

    it('should not allow us to update when turkWord is not a string', () => {
      const updVocab = {
        turkWord: 11,
        engWord: 'coffee'
      };

      return Vocab
      .findOne()
      .exec()
      .then(res => {
        updVocab.id = res.id;
        return chai
          .request(app)
          .put(`/api/vocab/${updVocab.id}`)
          .send(updVocab);
      })
      .catch(res => {
        res.should.have.status(422);
      });
    });

    it('should not allow us to update when engWord is not a string', () => {
      const updVocab = {
        turkWord: '11',
        engWord: 11
      };

      return Vocab
      .findOne()
      .exec()
      .then(res => {
        updVocab.id = res.id;
        return chai
          .request(app)
          .put(`/api/vocab/${updVocab.id}`)
          .send(updVocab);
      })
      .catch(res => {
        res.should.have.status(422);
      });
    });

    it('should not allow us to update when res.body id != req.param.id', () => {
      const updVocab = {
        turkWord: 11,
        engWord: 'coffee'
      };

      return Vocab
      .findOne()
      .exec()
      .then(res => {
        updVocab.id = res.id;
        return chai
          .request(app)
          .put('/api/vocab/abc')
          .send(updVocab);
      })
      .catch(res => {
        res.should.have.status(400);
      });
    });
  });

  describe('Delete Endpoint', () => {
    it('will delete vocab from database', () =>{
      let vocab;

      return Vocab
        .findOne()
        .exec()
        .then(res => {
          vocab = res;
          return chai.request(app)
            .delete(`/api/vocab/${res.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Vocab
          .findById(vocab.id)
          .exec();
        })
        .then(deleted => {
          should.not.exist(deleted);
        });
    });
  });
});

describe('User API Testing', () => {
  before(() => {
    return runServer();
  });

  after(() => {
    return closeServer();
  });

  describe('Get All Users Endpoint', () => {
    it('should', ()=>{
      let user;
      return chai.request(app)
        .get('/api/users/')
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);
          res.body.forEach(users=>{
            users.should.be.a('object');
            users.should.include.key('id', 'googleId', 'accessToken', 'numCorrect', 'numQuestAns', 'questTracker');
          });
          user = res.body[0];
          return User
            .findById(user.id)
            .exec();
        })
        .then(userDB => {
          userDB.googleId.should.equal(user.googleId);
          userDB.accessToken.should.equal(user.accessToken);
          userDB.numCorrect.should.equal(user.numCorrect);
          userDB.numQuestAns.should.equal(user.numQuestAns);
        });
    });
  });
});