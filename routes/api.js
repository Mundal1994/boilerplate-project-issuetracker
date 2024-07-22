'use strict';

module.exports = function (app) {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useFindAndModify: false });
  
  const Schema = mongoose.Schema;
  const issueSchema = new Schema({
    project: String,
    issue_title: String,
    issue_text: String,
    created_by: String,
    assigned_to: String,
    open: Boolean,
    status_text: String,
    created_on: String,
    updated_on: String
    }
  );
  
  const IssueTracker = mongoose.model('IssueTracker', issueSchema);
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let input = getInput(req.query, req.params.project, false);

      if (Object.keys(req.query).length > 0) {
        input = req.query;
      }      

      IssueTracker.find(input)
        .then(issues => {
          res.send(issues);
      });
    })
    
    .post(function (req, res){
      let project = req.params.project;
      const {issue_title, issue_text, created_by, assigned_to, status_text} = getParams(req.body);

      if (issue_title == "" || issue_text == "" || created_by == "") {
        res.send({error: 'required field(s) missing'});
        return;
      }

      const result = new IssueTracker({
        project: project == undefined ? "apitest" : project,
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to == "" ? "" : assigned_to,
        open: true,
        status_text: status_text == "" ? "" : status_text,
        created_on: getDate(),
        updated_on: getDate()
      });

      result.save(function(err, issue) {
        if (err) {
          return;
        }
      });
      res.send(result);
    })

    .put(function (req, res){
      let project = req.params.project;
      const id = req.body._id;

      if (!id) {
        res.send({ error: 'missing _id' });
        return;
      }

      let input = getInput(req.body, project, true);
      if (Object.keys(input).length === 0) {
        res.send({ error: 'no update field(s) sent', '_id': id });
        return;
      }

      input.project = project;
      input.updated_on = getDate();
      IssueTracker.findByIdAndUpdate(id, input, (err, elem) => {
        if (err || !elem) {
          res.send({ error: 'could not update', '_id': id });
        } else {
          res.send({ result: 'successfully updated', '_id': id });
        }
      });
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      const id = req.body._id;

      if (!id) {
        res.send({ error: 'missing _id' });
        return;
      }

      if (Object.keys(req.body).length > 1) {
        res.send({ error: 'could not delete', '_id': id });
        return;
      }

      IssueTracker.findByIdAndDelete(id, (err, elem) => {
        if (err || !elem) {
          res.send({ error: 'could not delete', '_id': id });
        } else {
          res.send({ result: 'successfully deleted', '_id': id });
        }
      })
    });
};

function getDate() {
  const currentDate = new Date();
  return currentDate.toISOString();
}

function getParams(body) {
  const issue_title = body.issue_title == null ? '' : body.issue_title;
  const issue_text = body.issue_text == null ? '' : body.issue_text;
  const created_by = body.created_by == null ? '' : body.created_by;
  const assigned_to = body.assigned_to == null ? '' : body.assigned_to;
  const status_text = body.status_text == null ? '' : body.status_text;

  return {issue_title, issue_text, created_by, assigned_to, status_text};
}

function getInput(query, initProject, put) {
  let input = {};
  if (!put) {
    input.project = initProject == undefined ? "apitest" : initProject;
  }
  if (query.issue_title!==undefined) {
    input.issue_title=query.issue_title;
  }
  if (query.issue_text!==undefined) {
    input.issue_text=query.issue_text;
  }
  if (query._id!==undefined && !put) {
    input._id=query._id;
  }
  if (query.created_by!==undefined) {
    input.created_by=query.created_by;
  }
  if (query.assigned_to!==undefined) {
    input.assigned_to=query.assigned_to;
  }
  if (query.status_text!==undefined) {
    input.status_text=query.status_text;
  }
  if (query.open!==undefined && put) {
    input.open=false;
  }
  return input;
}