import React from 'react'
import {  Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import QuizInstruction from './Components/quiz/QuizInstruction';
import Play from './Components/quiz/Play';
import QuizSummary from './Components/quiz/QuizSummary';
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/play/instructions' element={<QuizInstruction/>}/>
        <Route path='/play/quiz' element={<Play/>}/>
        <Route path='/play/quizSummary' element={<QuizSummary/>}/>
      </Routes>
    </div>
  )
}

export default App