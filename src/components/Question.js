import Option from "./Option";
import { useQuiz } from "../context/QuizContext";

export default function Question() {
  const { questions, index } = useQuiz();
  const question = questions.at(index);
  return (
    <div>
      <h4> {question.question}</h4>
      <Option question={question} />
    </div>
  );
}
