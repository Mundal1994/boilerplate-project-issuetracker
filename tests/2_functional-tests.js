const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const apiRoutes = require('../routes/api');
const IssueTracker = apiRoutes.IssueTracker;

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
  suite('GET /api/issues/:project calls', function () {
    const currentDatabase = [new IssueTracker({
      'issue_title': 'First Issue',
      'issue_text': 'When we post data it has an error.',
      'created_on': new Date(),
      'updated_on': new Date(),
      'created_by': 'Joe',
      'assigned_to': 'Joe',
      'open': true,
      'status_text': 'In QA'
    }),
    new IssueTracker({
      'issue_title': 'Second Issue',
      'issue_text': 'When we post data it has an error.',
      'created_on': new Date(),
      'updated_on': new Date(),
      'created_by': 'Joe',
      'assigned_to': '',
      'open': true,
      'status_text': ''
    }),
    new IssueTracker({
      'issue_title': 'Third guitar Issue',
      'issue_text': 'Issues of missing guitar stand.',
      'created_on': new Date(),
      'updated_on': new Date(),
      'created_by': 'Ronan',
      'assigned_to': 'Me',
      'open': true,
      'status_text': ''
    })];
    test('Test GET /api/issues/apitest', function(done) {
      IssueTracker.deleteMany({}, (err, info) => {});
      IssueTracker.create(currentDatabase, (err, res) => {});
      chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest')
      .end(function(err, res) {
        const json = JSON.parse(res.text);
        assert.equal(res.status, 200);
        assert.equal(Object.keys(json).length, 3);
        let i = 0;
        while (i < Object.keys(json).length) {
          if (json[i].issue_title == 'First Issue') {
            assert.equal(json[i].issue_title, 'First Issue');
          } else if (json[i].issue_title == 'Second Issue') {
            assert.equal(json[i].issue_title, 'Second Issue');
          } else if (json[i].issue_title == 'Third guitar Issue') {
            assert.equal(json[i].issue_title, 'Third guitar Issue');
          } else {
            console.log("didn't match anything");
          }
          ++i;
        }
        done();
      })
    });
    test('Test GET /api/issues/apitest?open=true&created_by=Joe', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/apitest?open=true&created_by=Joe')
        .end(function(err, res) {
          const json = JSON.parse(res.text);
          assert.equal(res.status, 200);
          assert.equal(Object.keys(json).length, 2);
          assert.equal(json[0].created_by, 'Joe');
          assert.equal(json[1].created_by, 'Joe');
          done();
        })
      });
    test('Test GET /api/issues/apitest?open=false', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/apitest?open=false')
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 0);
            done();
        })
      });
  });
  suite('PUT /api/issues/:project calls', function () {
    test('Test PUT /api/issues/apitest?_id=xxx.', function(done) {
      const currentDB = new IssueTracker({
        'issue_title': 'First Issue',
        'issue_text': 'When we post data it has an error.',
        'created_on': new Date(),
        'updated_on': new Date(),
        'created_by': 'Joe',
        'assigned_to': 'Joe',
        'open': true,
        'status_text': 'In QA'
      });
      currentDB.save((err, info) => {
        if (info) {
          const id = currentDB._id.toString();
          chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest?_id=' + id)
          .end(function(err, res) {
            const json = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.equal(json.error, 'no update field(s) sent');
            done();
          })
        }
      })
    });
    test('Test PUT /api/issues/apitest?_id=xxx&issue_title=Error&issue_text=Errors', function(done) {
      const currentDB = new IssueTracker({
        'issue_title': 'First Issue',
        'issue_text': 'When we post data it has an error.',
        'created_on': new Date(),
        'updated_on': new Date(),
        'created_by': 'Joe',
        'assigned_to': 'Joe',
        'open': true,
        'status_text': 'In QA'
      });
      currentDB.save((err, info) => {
        if (info) {
          const id = currentDB._id.toString();
          chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest?_id=' + id + '&issue_title=Error&issue_text=Errors')
          .end(function(err, res) {
            const json = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.equal(json.result, 'successfully updated');
            assert.equal(json._id, id);
            done();
          })
        }
      })
    });
    test('Test PUT /api/issues/apitest', function(done) {
      chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest')
          .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'missing _id');
              done();
          })
      });
  });
  suite('DELETE /api/issues/:project calls', function () {
    test('Test Delete /api/issues/apitest', function(done) {
      chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/apitest')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'missing _id');
            done();
          })
    });
    test('Test Delete /api/issues/apitest?_id=xxx', function(done) {
      const currentDB = new IssueTracker({
        'issue_title': 'First Issue',
        'issue_text': 'When we post data it has an error.',
        'created_on': new Date(),
        'updated_on': new Date(),
        'created_by': 'Joe',
        'assigned_to': 'Joe',
        'open': true,
        'status_text': 'In QA'
      });
      currentDB.save((err, info) => {
        if (info) {
          const id = currentDB._id.toString();
          chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/apitest?_id=' + id)
          .end(function(err, res) {
            const json = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.equal(json.result, 'successfully deleted');
            assert.equal(json._id, id);
            done();
          })
        }})
      });
    test('Test Delete /api/issues/apitest?_id=xxx1234', function(done) {
      const currentDB = new IssueTracker({
        'issue_title': 'First Issue',
        'issue_text': 'When we post data it has an error.',
        'created_on': new Date(),
        'updated_on': new Date(),
        'created_by': 'Joe',
        'assigned_to': 'Joe',
        'open': true,
        'status_text': 'In QA'
      });
      currentDB.save((err, info) => {
        if (info) {
          const id = currentDB._id.toString();
          chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/apitest?_id=' + id + '1234')
          .end(function(err, res) {
            const json = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.equal(json.error, 'could not delete');
            assert.equal(json._id, id + '1234');
            done();
          })
        }})
      });
  });
});
