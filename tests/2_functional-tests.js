const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const everyField={ 
  "issue_title": "First Issue",
  "issue_text": "When we post data it has an error.",
  "created_by": "Joe",
  "assigned_to": "Joe",
  "status_text": "In QA"
}
const everyField2={ 
  "issue_title": "Second Issue",
  "issue_text": "This is a test text.",
  "created_by": "Me",
  "assigned_to": "Me",
  "status_text": "This is unknown status"
}
const required={ 
  "issue_title": "Third guitar Issue",
  "issue_text": "When we post data it has an error.",
  "created_by": "Joe"
}

let id = '';

suite('Functional Tests', function() {
  suite('POST /api/issues/:project calls', function () {
    test('Test POST /api/issues/apitest every field', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/apitest')
        .send(everyField)
        .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'First Issue');
            assert.equal(res.body.issue_text, 'When we post data it has an error.');
            assert.equal(res.body.created_by, 'Joe');
            assert.equal(res.body.assigned_to, 'Joe');
            assert.equal(res.body.status_text, 'In QA');
            id = res.body._id;
            done();
        })
    });
    test('Test POST /api/issues/apitest every field2', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest')
          .send(everyField2)
          .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.issue_title, 'Second Issue');
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
          .send(required)
          .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.issue_title, 'Third guitar Issue');
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
      test('Test POST /api/issues/apitest missing required fields', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest')
          .send({})
          .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'required field(s) missing');
              done();
          })
      });
  });
  suite('GET /api/issues/:project calls', function () {
    test('Test GET /api/issues/apitest', function(done) {
      chai
      .request(server)
      .keepOpen()
      .get('/api/issues/apitest')
      .query()
      .end(function(err, res) {
        const json = JSON.parse(res.text);
        assert.equal(res.status, 200);
        assert.equal(Object.keys(json).length, 3);
        let i = 0;
        while (i < Object.keys(json).length) {
          if (json[i].issue_title == 'First Issue') {
            assert.equal(json[i].issue_title, 'First Issue');
            assert.hasAllKeys(json[i], ["_id", "issue_title", "issue_text", "created_on", "updated_on", "created_by", "assigned_to", "open", "status_text", "project"]);
          } else if (json[i].issue_title == 'Second Issue') {
            assert.equal(json[i].issue_title, 'Second Issue');
          } else if (json[i].issue_title == 'Third guitar Issue') {
            assert.equal(json[i].issue_title, 'Third guitar Issue');
          } else {
            assert.fail("didn't match anything");
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
        .get('/api/issues/apitest')
        .query({"open": true, "created_by": "Joe"})
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
    test('Test PUT /api/issues/apitest?_id=' + id, function(done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/apitest')
        .send({"_id": id})
        .end(function(err, res) {
          const json = JSON.parse(res.text);
          assert.equal(res.status, 200);
          assert.equal(json.error, 'no update field(s) sent');
          done();
        })
    });
    test('Test PUT /api/issues/apitest?_id=' + id + '&issue_title=Error&issue_text=Errors', function(done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/apitest')
        .send({ 
          _id: id,
          issue_title: "Faux Issue Title"
          })
        .end(function(err, res) {
          const json = JSON.parse(res.text);
          assert.equal(res.status, 200);
          assert.equal(json.result, 'successfully updated');
          assert.equal(json._id, id);
          done();
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
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/apitest')
        .send({ 
          _id: id
        })
        .end(function(err, res) {
          const json = JSON.parse(res.text);
          assert.equal(res.status, 200);
          assert.equal(json.result, 'successfully deleted');
          assert.equal(json._id, id);
          done();
        })
      });
    test('Test Delete /api/issues/apitest?_id=xxxx1234', function(done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/apitest')
        .send({ 
          _id: id + '1234'
          })
        .end(function(err, res) {
          const json = JSON.parse(res.text);
          assert.equal(res.status, 200);
          assert.equal(json.error, 'could not delete');
          assert.equal(json._id, id + '1234');
          done();
        })
      });
  });
});
