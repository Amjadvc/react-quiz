import { createContext, useContext, useEffect, useReducer } from "react";
//create context
const QuizContext = createContext();

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

function QuizProvider({ children }) {
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
    fetch("https://amjadvc.github.io/react-quiz/questions.json")
      .then((res) => res.json())
      .then((data) =>
        dispatch({ type: "dataReceved", payload: data.questions })
      )
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  //give a value
  return (
    <QuizContext.Provider
      value={{
        numQuestions,
        index,
        points,
        maxPossiblePoints,
        answer,
        questions,
        secondsRemaining,
        status,
        highscoor,

        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  //consume context
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("You use context outside the provider");
  } else return context;
}

export { QuizProvider, useQuiz };
