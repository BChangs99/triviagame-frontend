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

// Mapping trivia cateogry with api call
// Ty Copilot for having all these mapped out already
const categories = [
  { "name": "Any Category", "value": 0 },
  { "name": "General Knowledge", "value": 9 },
  { "name": "Entertainment: Books", "value": 10 },
  { "name": "Entertainment: Film", "value": 11 },
  { "name": "Entertainment: Music", "value": 12 },
  { "name": "Entertainment: Musicals & Theatres", "value": 13 },
  { "name": "Entertainment: Television", "value": 14 },
  { "name": "Entertainment: Video Games", "value": 15 },
  { "name": "Entertainment: Board Games", "value": 16 },
  { "name": "Science & Nature", "value": 17 },
  { "name": "Science: Computers", "value": 18 },
  { "name": "Science: Mathematics", "value": 19 },
  { "name": "Mythology", "value": 20 },
  { "name": "Sports", "value": 21 },
  { "name": "Geography", "value": 22 },
  { "name": "History", "value": 23 },
  { "name": "Politics", "value": 24 },
  { "name": "Art", "value": 25 },
  { "name": "Celebrities", "value": 26 },
  { "name": "Animals", "value": 27 },
  { "name": "Vehicles", "value": 28 },
  { "name": "Entertainment: Comics", "value": 29 },
  { "name": "Science: Gadgets", "value": 30 },
  { "name": "Entertainment: Japanese Anime & Manga", "value": 31 },
  { "name": "Entertainment: Cartoon & Animations", "value": 32 }
]

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

  const handleCategoryClick = (category) => {
    fetch(`http://localhost:8082/api/questions/?category=${category.value}`)
    .then(res => res.json())
    .then(data => data.results)
    .then((data) => {
      let triviaData = data.map((question) => {
        return {
          "question": decodeURIComponent(question.question),
          "options": [
            decodeURIComponent(question.correct_answer),
            ...question.incorrect_answers.map((answer) => decodeURIComponent(answer))
          ],
          "answer": decodeURIComponent(question.correct_answer),
          "answerIndex": 0,
        }
      })
      setDataBank(triviaData)
    })
  }


  const handleNextClick = (e) => {
    setHideSolution("hidden")
    setQuestionIndex(questionIndex + 1);
    setNextButton(false);
  }

  // useEffect(() => {
  //   fetch("http://localhost:8082/api/questions")
  //   .then(res => res.json())
  //   .then(data => data.results)
  //   .then((data) => {
  //     let triviaData = data.map((question) => {
  //       return {
  //         "question": question.question,
  //         "options": [
  //           question.correct_answer,
  //           ...question.incorrect_answers
  //         ],
  //         "answer": question.correct_answer,
  //         "answerIndex": 0,
  //       }
  //     })
  //     setDataBank(...dataBank, triviaData)
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
  // }, [])

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
          {
            (questionIndex === dataBank.length || dataBank.length == 0) &&
            <div>
                <h1>Howdy!</h1>
                <h2>Select a category below to get going on some trivia</h2>
                <div className='App-category-holder'>
                 <div className='App-categories-left'>
                    {categories.splice(0, Math.ceil(categories.length/2)).map((category, index) => {
                      let categorySelected = category
                        return (
                          <div key={index} className='App-category' onClick={() => {handleCategoryClick(categorySelected)}}>{category.name}</div>
                        )
                    })}
                 </div>
                  <div className='App-categories-right'>
                    {categories.splice(Math.ceil(categories.length/2), categories.length).map((category, index) => {
                      let categorySelected = category
                        return (
                          <div key={index} className='App-category' onClick={() => {handleCategoryClick(categorySelected)}}>{category.name}</div>
                        )
                    })}
                  </div>
                </div>
            </div>
          }
        </div>
      <div className='App-right'></div>
    </div>
  );
}

export default App;
