'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let result = req.body;
      const input = req.query;
      if (Object.keys(input).length === 0 && input.constructor === Object) {
        return (result);
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
      return (result);
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

      const currentDate = new Date().toISOString();
      
      // with an _id and one or more fields to update. On success, the updated_on field should be updated, and returned should be {  result: 'successfully updated', '_id': _id }.
      // error handling: does not include an _id, the return value is { error: 'missing _id' }.
      // does not include update fields, the return value is { error: 'no update field(s) sent', '_id': _id }. On any other error, the return value is { error: 'could not update', '_id': _id }.
    })
    
    .delete(function (req, res){
      let project = req.params.project;

      //You can send a DELETE request to /api/issues/{projectname} with an _id to delete an issue. If no _id is sent, the return value is { error: 'missing _id' }. On success, the return value is { result: 'successfully deleted', '_id': _id }. On failure, the return value is { error: 'could not delete', '_id': _id }.
      
    });
    
};
