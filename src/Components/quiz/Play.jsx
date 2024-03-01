import React, { Fragment, useEffect, useRef, useState,  } from 'react'
import {Helmet} from "react-helmet";
import questions from '../../questions.json';
import isEmpty from '../../utils/IsEmpty';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import correctNotification from '../../assets/audio/correct-answer-[AudioTrimmer.com].mp3';
import wrongNotification from '../../assets/audio/wrong-answer.mp3';
import buttonNotification from '../../assets/audio/button-sound.mp3';
import { useNavigate } from 'react-router-dom';
// import Audios from '../../assets/audio/Audios.jsx';
import classnames from 'classnames';

function Play() {
  
  let [state, setState] = useState(
    {
      questions,
      currentQuestion: {},
      nextQuestion: {},
      previousQuestion: {},
      answer: '',
      numberOfQuestions: 0,
      numberOfAnsweredQuestions: 0,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      hints: 5,
      fiftyFifty: 2,
      usedFiftyFifty: false,
      nextButtonDisabled: false,
      previousButtonDisabled: true,
      previousRandomNumbers: [],
      time: {}
  });

  let interval = useRef(null); // Define interval using useRef
  const correctSound = useRef(new Audio(correctNotification));
  const wrongSound = useRef(new Audio(wrongNotification));
  const buttonSoundRef = useRef(new Audio(buttonNotification));


  useEffect(() => {
    let { questions, currentQuestion, nextQuestion, previousQuestion } = state;
    displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
    startTimer()
    return () => clearInterval(interval.current);
}, []);


const handleOptionClick = (e) => {
  const selectedOption = e.target.innerHTML.trim().toLowerCase();
  const correctAnswer1 = state.currentQuestion.answer.toLowerCase();

  if (selectedOption === correctAnswer1) {
    setTimeout(()=>{
      correctSound.current.play();
    })
    correctAnswer();
  } else {
    setTimeout(()=>{
      wrongSound.current.play();
    },400)
    wrongAnswer();
  }
};
 
const handleNextButtonClick = ()=>{
  playButtonSound();
  if(state.nextQuestion !== undefined){
      setState(prevState =>({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1
      }))
  }
}

const handlePreviousButtonClick = ()=>{
  playButtonSound();
  if(state.previousQuestion !== undefined){
      setState(prevState =>({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex - 1
      }))
  }
}

const history = useNavigate();
const handleQuitButtonClick = ()=>{
  
  playButtonSound();
  if(window.confirm('Are you sure you want to quit?')){
    history('/');
  }
  
}


const handleButtonClick = (e)=>{
  switch(e.target.id){
    case 'next-button' : 
        handleNextButtonClick();
        break;

    case 'previous-button':
          handlePreviousButtonClick();
          break;
    case 'quit-button':
          handleQuitButtonClick();
          break;

         default:
          break;
  }
    playButtonSound();
}

const playButtonSound = ()=>{
  buttonSoundRef.current.play();
}

const showOptions = ()=>{
  const optioons =Array.from(document.querySelectorAll('.option'));
  
  optioons.forEach((option)=>{
    option.style.visibility = 'visible';
  });
  setState((prevState)=>({
      ...prevState,
      usedFiftyFifty: false
  }))
}
// handle the hints
const handleHints = ()=>{
  if(state.hints>0){
      const optioons =Array.from(document.querySelectorAll('.option'));
  let indexofAnswer;

  optioons.forEach((option, index)=>{
      if(option.innerHTML.toLocaleLowerCase()=== state.answer.toLocaleLowerCase()){
        indexofAnswer = index;
      }
  });

  while(true){
    const randomNumber =Math.round(Math.random()*3);
    if(randomNumber != indexofAnswer && !state.previousRandomNumbers.includes(randomNumber)){
      optioons.forEach((option,index)=>{
        if(index === randomNumber){
          option.style.visibility = 'hidden';
          setState((prevState)=>({
            ...prevState,
            hints: prevState.hints - 1,
            previousRandomNumbers: prevState.previousRandomNumbers.concat(randomNumber)
         }));
        }
        
      });
      break;
    }
    if(state.previousRandomNumbers.length >= 3)
    break;
  }
  }
  
}

// fifty fifty
const handleFiftyFifty = () => {
  if (state.fiftyFifty > 0 && state.usedFiftyFifty === false) {
      const options = document.querySelectorAll('.option');
      const randomNumbers = [];
      let indexOfAnswer;
      options.forEach((option, index) => {
          if (option.innerHTML.toLowerCase() === state.answer.toLowerCase()) {
              indexOfAnswer = index;
          }
      });
      let count = 0;
      do {
          const randomNumber = Math.round(Math.random() * 3);
          if (randomNumber !== indexOfAnswer) {
              if (randomNumbers.length < 2 && !randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                  randomNumbers.push(randomNumber);
                  count++;
              } else {
                  while (true) {
                      const newRandomNumber = Math.round(Math.random() * 3);
                      if (!randomNumbers.includes(newRandomNumber) && newRandomNumber !== indexOfAnswer) {
                          randomNumbers.push(newRandomNumber);
                          count++;
                          break;
                      }
                  }
              }
          }
      } while (count < 2);
      options.forEach((option, index) => {
          if (randomNumbers.includes(index)) {
              option.style.visibility = 'hidden';
          }
      });
      setState(prevState => ({
          ...prevState,
          fiftyFifty: prevState.fiftyFifty - 1,
          usedFiftyFifty: true
      }));
  }
};

// timer
const startTimer = ()=>{
  const countDownTime = Date.now() + (15 * 60 * 1000);
  interval = setInterval(()=>{
    const now = new Date();
    const distance = countDownTime - now;

    const minutes = Math.floor((distance % (1000*60*60))/(1000*60));
    const seconds = Math.floor((distance % (1000*60))/1000);
    if (distance < 0) {
                clearInterval(interval);
                setState((prevState)=>({
                    ...prevState,
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }), () => {
                    alert('quiz has ended');
                    history('/');
                    endGame();
                });
            }else {
                        setState((prevState)=>({
                          ...prevState,
                            time: {
                                minutes,
                                seconds,
                                distance
                            }
                        }));
                    }
  },1000)
}



// handle disabled button
const handleDisableButton = () => {
  setState(prevState => ({
    ...prevState,
    previousButtonDisabled: prevState.currentQuestionIndex === 0,
    nextButtonDisabled: prevState.currentQuestionIndex + 1 === prevState.numberOfQuestions
  }));
}

// endGame function

const endGame = () => {
  alert('Quiz has ended!');
  const playerStats = {
    score: (state.score / state.numberOfQuestions) * 100,
    numberOfQuestions: state.numberOfQuestions,
    numberOfAnsweredQuestions: state.correctAnswers + state.wrongAnswers,
    correctAnswers: state.correctAnswers,
    wrongAnswers: state.wrongAnswers,
    fiftyFiftyUsed: 2 - state.fiftyFifty,
    hintsUsed: 5 - state.hints
  };
  console.log(playerStats)
  setTimeout(() => {
    // history('/');
    history('/play/quizSummary', { state: playerStats });
  }, 1000);
}


// const endGame = () => {
//   alert('Quiz has eneded!');
//   const { state } = this;
//   const playerStats = {
//       score: state.score,
//       numberOfQuestions: state.numberOfQuestions,
//       numberOfAnsweredQuestions: state.correctAnswers + state.wrongAnswers,
//       correctAnswers: state.correctAnswers,
//       wrongAnswers: state.wrongAnswers,
//       fiftyFiftyUsed: 2 - state.fiftyFifty,
//       hintsUsed: 5 - state.hints
//   };
//       console.log(playerStats);
//   setTimeout(() => {
//       history('/');
//       // history('/play/quizSummary', playerStats);
//   }, 1000);
// }

const correctAnswer = () => {
  toast.success("Answer correct", {
        // position: toast.POSITION.TOP_RIGHT,
        className: "toast-valid",
      });
  // Increment score and correctAnswers
  setState(prevState => ({
    ...prevState,
    score: prevState.score + 1,
    correctAnswers: prevState.correctAnswers + 1,
    currentQuestionIndex: prevState.currentQuestionIndex + 1
  }))
};  
useEffect(() => {
  if(state.nextQuestion === undefined){
    endGame();
  }else{
    displayQuestions(state.questions, state.nextQuestion, state.previousQuestion, state.currentQuestion);
  }
  
}, [state.currentQuestionIndex]);

const wrongAnswer = () => {
  navigator.vibrate(1000);
    toast.error("Wrong Answer!", {
      // position: toast.POSITION.TOP_RIGHT,
      className: "toast-invalid",
    });
  // Increment wrongAnswers
  setState(prevState => ({
    ...prevState,
    wrongAnswers: prevState.wrongAnswers + 1,
    currentQuestionIndex: prevState.currentQuestionIndex + 1
  }))};

const displayQuestions = (questions = state.questions, currentQuestion, nextQuestion, previousQuestion) => {
    let { currentQuestionIndex } = state;
    if (!isEmpty(state.questions)) {
      questions = state.questions;
      currentQuestion = questions[currentQuestionIndex];
      nextQuestion = questions[currentQuestionIndex + 1];
      previousQuestion = questions[currentQuestionIndex - 1];
      const answer = currentQuestion.answer;
      setState(prevState => ({
        ...prevState,
        currentQuestion,
        nextQuestion,
        previousQuestion,
        numberOfQuestions: questions.length,
        answer,
        previousRandomNumbers: []
      }),showOptions(),
      handleDisableButton());
      
    }
   };
  
  const {
    currentQuestion,
    currentQuestionIndex, numberOfQuestions, hints,fiftyFifty, time} = state;

  return (
    <Fragment>
      <Helmet><title>Quiz Page</title></Helmet>
      <Fragment>
      <audio ref={correctSound} src={correctNotification}></audio>
      <audio ref={wrongSound} src={wrongNotification}></audio>
      <audio ref={buttonSoundRef} src={buttonNotification}></audio>
      </Fragment>
      <div className='questions'>
        <h2>Quiz Mode</h2>
        <div className='lifeline-container'>
          <p>
            <span onClick={handleFiftyFifty} className="mdi mdi-set-center mdi-24px lifeline-icon">
            <span className='lifeline'>{fiftyFifty}</span>
            </span>
          </p>
          <p>
            <span onClick={handleHints} className="mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon">
            <span  className='lifeline'>{hints}</span>
            </span>
            
          </p>
        </div>
        <div className='timer-container' >
          <p className='timer'>
            <span className='left' style={{float:'left'}} >{currentQuestionIndex+1} of {numberOfQuestions}</span>
            <span className='right'>{time.minutes}:{time.seconds}<span className="mdi mdi-clock-outline mdi-24px"></span></span>
          </p>
        </div>
        <h5>{currentQuestion.question}</h5>
            {/* Render options only if currentQuestion is defined */}
            <div className='options-container'>
              <p onClick={handleOptionClick} className='option'>{currentQuestion.optionA}</p>
              <p onClick={handleOptionClick} className='option'>{currentQuestion.optionB}</p>
            </div>
            <div className='options-container'>
              <p onClick={handleOptionClick} className='option'>{currentQuestion.optionC}</p>
              <p onClick={handleOptionClick} className='option'>{currentQuestion.optionD}</p>
            </div>
            <ToastContainer/> 
           
        <div className='button-container'>
        <button 
           className={classnames('', {'disable': state.previousButtonDisabled})}
            id="previous-button" 
            onClick={handleButtonClick}>
            Previous
         </button>
           <button 
               className={classnames('', {'disable': state.nextButtonDisabled})}
                id="next-button" 
                onClick={handleButtonClick}>
                Next
            </button>
          <button id='quit-button' onClick={handleButtonClick}>Quit</button>
        </div>
      </div>
      
    </Fragment>
  )
}

export default Play