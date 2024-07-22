'use strict';

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const issueSchema = new mongoose.Schema({
  issue_title: {type: String, require: true},
  issue_text: {type: String, require: true},
  created_by: {type: String, require: true},
  assigned_to: {type: String, default: ''},
  open: {type: Boolean, default: true},
  status_text: {type: String, default: ''}}, {
  timestamps: {createdAt: 'created_on', updatedAt: 'updated_on'},
  versionKey: false,
  }
);

const IssueTracker = mongoose.model('IssueTracker', issueSchema);

const routes = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let input = {};
      
      if (Object.keys(req.query).length > 0) {
        input = req.query;
      }      

      IssueTracker.find(input, (err, elements) => {
        if (elements) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.json(elements);
        }
      });
    })
    
    .post(function (req, res){
      const {issue_title, issue_text, created_by, assigned_to, status_text} = req.body;
      
      if (issue_title == null || issue_text == null || created_by == null) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({error: 'required field(s) missing'});
        return;
      }
      
      const result = new IssueTracker({
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        open: true,
        status_text
      });

      result.save((err, issue) => {
        if (issue) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.send(issue);
        }
      });
    })
    
    .put(function (req, res){
      const id = req.body._id;

      if (!id) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({ error: 'missing _id' });
        return;
      }

      let input = {};
      for (let key in req.body) {
        if (key != '_id' && req.body[key]) {
          input[key] = req.body[key];
        }
      }
      console.log("input", input);

      if (Object.keys(input).length === 0) {
        console.log("no update fields sent");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({ error: 'no update field(s) sent', '_id': id });
        return;
      }

      res.setHeader("Access-Control-Allow-Origin", "*");
      IssueTracker.findByIdAndUpdate(id, input, (err, elem) => {
        if (err || !elem) {
          console.log("could not update");
          res.json({ error: 'could not update', '_id': id });
          return;
        }
        console.log("updated succesfully");
        res.json({ result: 'successfully updated', '_id': id });
      });
    })
    
    .delete(function (req, res){
      const id = req.body._id;

      if (!id) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({ error: 'missing _id' });
        return;
      }

      res.setHeader("Access-Control-Allow-Origin", "*");
      IssueTracker.findByIdAndDelete(id, (err, elem) => {
        if (err || !elem) {
          res.json({ error: 'could not delete', '_id': id });
        } else {
          res.json({ result: 'successfully deleted', '_id': id });
        }
      })
    });
};

module.exports.routes = routes;
module.exports.IssueTracker = IssueTracker;