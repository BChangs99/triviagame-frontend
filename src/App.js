import './App.css';
import { useState, useEffect, Fragment } from 'react';
 
// This is needed for our trivia answers to be shuffled around each time
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

//Todo:
// 1. Add a timer
// 2. Add a score
// 3. Fix next button styles
// 4. Add a start button
// 5. Add a restart button
// 6. Add a question theme picker (use carousel from mantine)
function App() {
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [nextButton, setNextButton] = useState(false);
  const [hideSolution, setHideSolution] = useState("hidden");
  const [dataBank, setDataBank] = useState([]);

  const handleAnswerClick = (e) => {
    setHideSolution("")

    if (e.target.textContent === decodeURIComponent(dataBank[questionIndex].answer)) {
      setScore(score + 1);
    }

    setNextButton(true);
  }

  const handleNextClick = (e) => {
    setHideSolution("hidden")
    setQuestionIndex(questionIndex + 1);
    setNextButton(false);
  }

  useEffect(() => {
    fetch("http://localhost:8082/api/questions/test")
    .then(res => res.json())
    .then(data => data.results)
    .then((data) => {
      let triviaData = data.map((question) => {
        return {
          "question": question.question,
          "options": [
            question.correct_answer,
            ...question.incorrect_answers
          ],
          "answer": question.correct_answer,
          "answerIndex": 0,
        }
      })
      setDataBank(...dataBank, triviaData)
    })
    .catch((err) => {
      console.log(err)
    })
  }, [])

  useEffect(() => {
    if (questionIndex === dataBank.length && dataBank.length !== 0) {
      alert(`You got ${score} out of ${dataBank.length} correct!`)
    }
  }, [questionIndex])

  return (
    <div className="App">
      <div className='App-left'></div>
        <div className='App-middle'>
          {dataBank.length !== 0 && questionIndex !== dataBank.length && 
            <Fragment>
                <h1 className='App-title'>
                  Trivia Thots!
                </h1>
                <h2 className='App-question-title'>
                  Question {questionIndex + 1}:
                </h2>
                <h3 className='App-question'>{decodeURIComponent(dataBank[questionIndex].question)}</h3>
                <div className='App-question-options'>
                  {shuffleArray(dataBank[questionIndex].options).map((option, index) => { 
                      return (
                        <div 
                          className={`App-question-option ${hideSolution} ${option === dataBank[questionIndex].answer ? 'correct' : 'incorrect'}`}
                          onClick={handleAnswerClick}
                          key={index}>
                            {decodeURIComponent(option)}
                        </div>
                      )
                    })}
                </div>
                {nextButton ? <div className='App-next-button' onClick={handleNextClick}>Next</div> : null}
            </Fragment>
          }
        </div>
      <div className='App-right'></div>
    </div>
  );
}

export default App;
