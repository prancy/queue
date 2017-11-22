var Quiz = require('./../models/Quiz');

function index(req, res) {
  Quiz.find({}, (err,quizzes) => {
    res.render('./quizzes/index', {quizzes});
  });
}

function show(req, res) {
  Quiz.findById(req.params.id, (err, quiz) => {
    res.render('./quizzes/show', {quiz})
  });
}

function getQuiz(req, res) {
  res.redirect(`/quizzes/${req.body.quizName}`);
}

function newQuiz(req, res) {
  res.render('./quizzes/new');
}

function create(req, res) {
  var quiz = new Quiz(req.body);
  if (quiz.save()) {
    res.redirect(`/quizzes/${quiz.id}`);
  } else {
    res.render('./quizzes/new', {quiz});
  }
}

function deleteQuiz(req, res) {
  Quiz.findById(req.params.id, (err, quiz) => {
    quiz.remove();
    res.redirect('/quizzes');
  });
}

function results(req, res) {
  res.send('results page')
}

module.exports = {
  index,
  show,
  newQuiz,
  create,
  deleteQuiz,
  getQuiz,
  results
}
