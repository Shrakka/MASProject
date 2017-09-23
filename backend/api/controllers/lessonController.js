'use strict'

var mongoose = require('mongoose'),
    Lesson = mongoose.model('Lesson');


export default function getLesons(req, res) {
    Lesson.find({}, (err, lessons) => {
        res.send(users);
    })
}


exports.postLesson = function(req, res) {
  var lesson = new Lesson(req.body)
  lesson.save()
    .then(item => {
        res.send(req.body)
    })
    .catch(err => {
        res.status(400).send("Error wile adding lesson (POST)")
    })
}

exports.deleteLesson = function(req, res) {
  /*  User.remove({_id: req.params.id}, (err, user) => {
        if(err) {
            res.send(err);
        } else {
            res.send("User deleted")
        }
    }) */
}

exports.getLesson = function(req, res) {
 /*   User.findById(req.params.id, (err, user) => {
        if(err) {
            res.send(err);
        } else {
            res.send(user);
        }
    }) */
}

exports.populate = function(req, res) {
    var lessons = require('../data/populateLessons')
    lessons.map( lesson => {
        new Lesson(lesson).save();
    })
    res.send("Populate OK")
}
