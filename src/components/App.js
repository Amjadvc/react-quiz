import React, { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextQustion from "./NextQustion";
import Progress from "./Progress";
import FinisheScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SEC_PER_QUS = 30;

const initalState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscoor: 0,
  secondsRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    default:
      throw new Error("action is not vaild");
    case "dataReceved":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SEC_PER_QUS,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: (state.answer = null),
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscoor:
          state.points > state.highscoor ? state.points : state.highscoor,
      };
    case "restart":
      return {
        ...initalState,
        questions: state.questions,
        status: "ready",
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
  }
}

export default function App() {
  const [
    { status, questions, index, answer, points, highscoor, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initalState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (acc, curr) => acc + curr.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceved", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />

            <Question
              questions={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />

            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextQustion
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinisheScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscoor={highscoor}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
