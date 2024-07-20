'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let result = req.body;
      const input = req.query;
      if (Object.keys(input).length === 0 && input.constructor === Object) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json(result);
        return;
      }

      for (let key in input) {
        let filtered = [];
        
        for (let i = 0; i < result.length; i++) {
          if (result[i][key].toString() == input[key]) {
            filtered.push(result[i]);
          }
        }
        
        result = filtered;
      }
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(result);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      
      if (req.body.issue_title == null || req.body.issue_text == null || req.body.created_by == null) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({error: 'required field(s) missing'});
        return;
      }

      let id = "";
      const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 24; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      const currentDate = new Date().toISOString();
      const result = {
        "_id": id,
        "issue_title": req.body.issue_title,
        "issue_text": req.body.issue_text,
        "created_on": currentDate,
        "updated_on": currentDate,
        "created_by": req.body.created_by,
        "assigned_to": req.body.assigned_to == null ? '' : req.body.assigned_to,
        "open": true,
        "status_text": req.body.status_text == null ? '' : req.body.status_text
      };
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

      let result = req.body;
      for (let key in input) {
        if (key == '_id') {
          continue;
        }
        result[key] = input[key];
      }
      result['updated_on'] = new Date().toISOString();
      
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json({ result: 'successfully updated', '_id': id });
    })
    
    .delete(function (req, res){
      let project = req.params.project;

    });
    
};
