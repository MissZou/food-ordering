var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
 //if you do an HTTP GET to /users/userlist, our server will return JSON that lists all of the users in the database. 

//因为在数据库中 用了db.userlist.insert(),所以这里用db.get('userlist');
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: "" } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */

 //so the URI we'll be referencing will be /deleteuser/12345 for example, and we reference it in the code with req.params.id

router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});


module.exports = router;
