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
  timestamps: {createdAt: 'created_on', updated_on: 'updated_on'}
  }
);

const IssueTracker = mongoose.model('IssueTracker', issueSchema);

const routes = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const input = req.query;

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

      result.save((err, res) => {
        if (res) {
          result.save();
        }
      });
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(result);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      const input = req.query;
      const id = input._id;

      if (id == null) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({ error: 'missing _id' });
        return;
      }

      if (Object.keys(input).length === 1) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({ error: 'no update field(s) sent', '_id': id });
        return;
      }
      
      IssueTracker.findByIdAndUpdate(id, input, (err, elem) => {
        if (err) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.json({ result: 'could not update', '_id': id });
          return;
        }
      
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({ result: 'successfully updated', '_id': id });
      });
    })
    
    .delete(function (req, res){
      const id = input._id;

      if (id == null) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({ error: 'missing _id' });
      }

      db.findOne({'_id': id}, (err, elem) => {
        if (err) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.json({ error: 'could not delete', '_id': _id });
        } else {
          res.$(elem).remove();
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.json({ result: 'successfully deleted', '_id': _id });
        }
      })
    });
};

module.exports.routes = routes;
module.exports.IssueTracker = IssueTracker;