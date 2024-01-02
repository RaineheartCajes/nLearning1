import mongoose from "mongoose";

const slideSchema = new mongoose.Schema({
  header: String,
  bodyText: mongoose.Schema.Types.Mixed,
  image: String,
});

const questionSchema = new mongoose.Schema({
  type: String,
  question: String,
  choices: [String],
  correctAnswer: Number,
  explanation: String,
});

const examSchema = new mongoose.Schema({
  id: String,
  title: String,
  logo: String,
  description: String,
  status: String,
  createdAt: Date,
  reviewerContent: {
    slides: [slideSchema],
  },
  instructions: String,
  questions: [questionSchema],
});

const Exam = mongoose.model("exams", examSchema);

module.exports = Exam;