'use strict'

module.exports = function(app) {
    var lessonController = require('../controllers/lessonController');

    app.route('/lesson')
        .get(lessonController.getLessons)
        .post(lessonController.postLesson)

    app.route('/lesson/populate')
        .get(lessonController.populate)

    app.route('/lesson/:id')
         .get(lessonController.getLesson)
         .delete(lessonController.deleteLesson)
}