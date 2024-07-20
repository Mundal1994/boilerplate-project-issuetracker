const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('POST /api/issues/:project calls', function () {
    test('Test POST /api/issues/apitest every field', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send({ 
            "issue_title": "Fix error in posting data",
            "issue_text": "When we post data it has an error.",
            "created_by": "Joe",
            "assigned_to": "Joe",
            "status_text": "In QA"
          })
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Fix error in posting data');
            assert.equal(res.body.issue_text, 'When we post data it has an error.');
            assert.equal(res.body.created_by, 'Joe');
            assert.equal(res.body.assigned_to, 'Joe');
            assert.equal(res.body.status_text, 'In QA');
            done();
        })
    });
    test('Test POST /api/issues/apitest every field2', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest')
          .send({ 
              "issue_title": "This is a test title",
              "issue_text": "This is a test text.",
              "created_by": "Me",
              "assigned_to": "Me",
              "status_text": "This is unknown status"
            })
          .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.issue_title, 'This is a test title');
              assert.equal(res.body.issue_text, 'This is a test text.');
              assert.equal(res.body.created_by, 'Me');
              assert.equal(res.body.assigned_to, 'Me');
              assert.equal(res.body.status_text, 'This is unknown status');
              done();
          })
      });
    test('Test POST /api/issues/apitest only required fields', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest')
          .send({ 
              "issue_title": "Fix error in posting data",
              "issue_text": "When we post data it has an error.",
              "created_by": "Joe"
            })
          .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.issue_title, 'Fix error in posting data');
              assert.equal(res.body.issue_text, 'When we post data it has an error.');
              assert.equal(res.body.created_by, 'Joe');
              assert.equal(res.body.assigned_to, '');
              assert.equal(res.body.status_text, '');
              done();
          })
      });
      test('Test POST /api/issues/apitest missing required fields', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest')
          .send({ 
            "assigned_to": "Joe",
            "status_text": "In QA"
            })
          .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'required field(s) missing');
              done();
          })
      });
  });
  const currentDatabase = [{
    '_id': 'bn0zdgznxzf7ozxxcfcvsbwa',
    'issue_title': 'Fix error in posting data',
    'issue_text': 'When we post data it has an error.',
    'created_on': '2024-07-20T15:21:11.838Z',
    'updated_on': '2024-07-20T15:21:11.838Z',
    'created_by': 'Joe',
    'assigned_to': 'Joe',
    'open': true,
    'status_text': 'In QA'
  },
  {
    '_id': 'q2zlh4076etyr5wezqtupb76',
    'issue_title': 'Fix error in posting data',
    'issue_text': 'When we post data it has an error.',
    'created_on': '2024-07-20T15:21:11.865Z',
    'updated_on': '2024-07-20T15:21:11.865Z',
    'created_by': 'Joe',
    'assigned_to': '',
    'open': true,
    'status_text': ''
  },
  {
    '_id': 'q2zlh4076etyr5we25tupb76',
    'issue_title': 'Guitar issue',
    'issue_text': 'Issues of missing guitar stand.',
    'created_on': '2024-07-20T15:22:11.865Z',
    'updated_on': '2024-07-20T15:22:11.865Z',
    'created_by': 'Ronan',
    'assigned_to': 'Me',
    'open': true,
    'status_text': ''
  }];
  suite('GET /api/issues/:project calls', function () {
    test('Test GET /api/issues/apitest', function(done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/apitest')
          .send(currentDatabase)
          .end(function(err, res) {
              assert.equal(res.status, 200);
              // add assert.equal
              done();
          })
      });
    test('Test GET /api/issues/apitest?open=true&assigned_to=Joe', function(done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/apitest?open=true&assigned_to=Joe')
          .send(currentDatabase)
          .end(function(err, res) {
              assert.equal(res.status, 200);
              // add assert.equal
              done();
          })
      });
  });
  suite('PUT /api/issues/:project calls', function () {
    //.put('/travellers) 
    //.send({"surname": "Colombo"})
  });
  suite('DELETE /api/issues/:project calls', function () {
  });
  // at least 14 tests has to be made. 4 tests in each suit
});
