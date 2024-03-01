import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const QuizSummary = () => {
  const location = useLocation();
  const { score, numberOfQuestions, numberOfAnsweredQuestions, correctAnswers, wrongAnswers, fiftyFiftyUsed, hintsUsed } = location.state;

  let remark;

  // Determine remark based on score
  if (score <= 30) {
    remark = 'You need more practice!';
  } else if (score > 30 && score <= 50) {
    remark = 'Better luck next time!';
  } else if (score <= 70 && score > 50) {
    remark = 'You can do better!';
  } else if (score >= 71 && score <= 84) {
    remark = 'You did great!';
  } else {
    remark = 'You\'re an absolute genius!';
  }

  return (
    <div className="quiz-summary">
      <Helmet><title>Quiz App - Summary</title></Helmet>
      <div style={{ textAlign: 'center' }}>
        <span className="mdi mdi-check-circle-outline success-icon"></span>
      </div>
      <h1>Quiz has ended</h1>
      <div className="container stats">
        <h4>{remark}</h4>
        <h2>Your Score: {score.toFixed(0)}%</h2>
        <span className="stat left">Total number of questions: </span>
        <span className="right">{numberOfQuestions}</span><br />
        <span className="stat left">Number of attempted questions: </span>
        <span className="right">{numberOfAnsweredQuestions}</span><br />
        <span className="stat left">Number of Correct Answers: </span>
        <span className="right">{correctAnswers}</span><br />
        <span className="stat left">Number of Wrong Answers: </span>
        <span className="right">{wrongAnswers}</span><br />
        <span className="stat left">Hints Used: </span>
        <span className="right">{hintsUsed}</span><br />
        <span className="stat left">50-50 Used: </span>
        <span className="right">{fiftyFiftyUsed}</span>
      </div>
      <div className='end-button'>
        <ul>
          <li>
            <Link to="/play/quiz">Play Again</Link>
          </li>
          <li>
            <Link to="/">Back to Home</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QuizSummary;