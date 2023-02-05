import './App.css';
import { useState, useEffect, Fragment } from 'react';
import CategorySelection from './components/organisms/CategorySelection';
import { Layout, Button, Card, Progress } from 'antd';

const { Content } = Layout;
 
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
  
      setDataBank(triviaData.map(item => {
        item.options = shuffleArray(item.options);
        return item;
      }));
    })
  }

  // To reset the game after the last question
  useEffect(() => {
    if (dataBank.length !== 0 && questionIndex === dataBank.length) {
      setQuestionIndex(0);
      setScore(0);
    }

    }, [dataBank])


  const handleNextClick = (e) => {
    setHideSolution("hidden")
    setQuestionIndex(questionIndex + 1);
    setNextButton(false);
  }

  useEffect(() => {
    if (questionIndex === dataBank.length && dataBank.length !== 0) {
      alert(`You got ${score} out of ${dataBank.length} correct!`)
    }
  }, [questionIndex])

  const handleAbortGame = () => {
    setQuestionIndex(0);
    setScore(0);
    setDataBank([]);
  }

  return (
    <Layout>
      <Content>
        <div className="App">
          <div className='App-left'></div>
            <div className='App-middle'>
              <h1 className='App-title'>
                Trivia Thots!
              </h1>
              {dataBank.length !== 0 && questionIndex !== dataBank.length && 
                <Fragment>
                    <div className='App-game'>
                      <div className='App-game-header'>
                        <Button className='App-abort-game' onClick={handleAbortGame}>Abort Game</Button>
                        <div className='App-game-score'>Score: {score}</div>
                      </div>
                      <Card title={`Question ${questionIndex + 1}`}>
                        <h3 className='App-question'>{decodeURIComponent(dataBank[questionIndex].question)}</h3>
                        <div>
                          {dataBank[questionIndex].options.map((option, index) => { 
                            return (
                              <Button 
                              size="middle"
                              className={`App-question-option ${hideSolution} ${option === dataBank[questionIndex].answer ? 'correct' : 'incorrect'}`}
                              onClick={handleAnswerClick}
                              key={index}>
                                    {decodeURIComponent(option)}
                                </Button>
                              )
                            })}
                        </div>
                      </Card>
                    </div>
                    <div style={{width: "15vw"}}><Progress size="small" percent={(questionIndex + 1) / dataBank.length * 100} /></div>
                    {nextButton ? <div className='App-next-button' onClick={handleNextClick}>Next</div> : null}
                </Fragment>
              }
              {(questionIndex === dataBank.length || dataBank.length == 0) && <CategorySelection handleCategoryClick={handleCategoryClick}/>}
            </div>
          <div className='App-right'></div>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
