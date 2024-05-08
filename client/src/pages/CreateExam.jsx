import React, { useState } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { RiCloseFill, RiLoopRightFill } from "react-icons/ri";
import { Card, Button, CardContent } from "@mui/material";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import "../assets/styles/create-exam.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { IoMdAddCircleOutline } from "react-icons/io";
import Swal from "sweetalert2";

const CreateExam = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newChoice, setNewChoice] = useState("");
  const [choices, setChoices] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingChoiceIndex, setEditingChoiceIndex] = useState(null);
  const [editingChoiceText, setEditingChoiceText] = useState("");
  const [attemptLimits, setAttemptLimits] = useState("");
  const [passingScore, setPassingScore] = useState("");
  const [showAssignParticipantsModal, setShowAssignParticipantsModal] =
    useState(false);

  const handleAddQuestion = () => {
    setShowInput(true);
  };

  const saveExam = async () => {
    const backendApiUrl = `http://localhost:3001/exam/create-exam/${examId}/questions`;

    try {
      const response = await axios.post(backendApiUrl, {
        questions,
        attemptLimits,
        passingScore,
      });

      console.log("Exam saved successfully:", response.data);
      navigate(`/dashboard/create-content/${examId}`);
    } catch (error) {
      console.error("Error saving exam:", error);
    }
  };

  const handleQuestionChange = (e) => {
    setNewQuestion(e.target.value);
  };

  const handleChoiceChange = (e) => {
    setEditingChoiceText(e.target.value);
    setErrorMessage("");
  };

  const handleAddChoice = () => {
    if (editingChoiceIndex !== null) {
      const updatedChoices = choices.map((choice, index) =>
        index === editingChoiceIndex ? { text: editingChoiceText } : choice
      );

      setChoices(updatedChoices);
      setEditingChoiceIndex(null);
      setEditingChoiceText("");
    } else if (newChoice.trim() !== "") {
      setChoices([...choices, { text: newChoice }]);
      setNewChoice("");
    }
  };

  const handleSaveQuestion = () => {
    if (
      newQuestion.trim() !== "" &&
      choices.length > 0 &&
      selectedChoice !== null
    ) {
      setQuestions([
        ...questions,
        {
          question: newQuestion,
          choices,
          correctAnswer: selectedChoice,
        },
      ]);
      setNewQuestion("");
      setChoices([]);
      setShowInput(false);
      setSelectedChoice(null);
      setErrorMessage("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a question, choices, and select a correct answer before saving.",
      });
    }
  };

  const handleSelectChoice = (index) => {
    setSelectedChoice(index);
  };

  const handleEditQuestion = (index) => {
    setEditingIndex(index);
    setShowInput(true);
    setNewQuestion(questions[index].question);
    setChoices([...questions[index].choices]);
    setSelectedChoice(questions[index].correctAnswer);
  };

  const handleUpdateQuestion = () => {
    if (
      newQuestion.trim() !== "" &&
      choices.length > 0 &&
      selectedChoice !== null
    ) {
      const updatedQuestions = questions.map((q, idx) =>
        idx === editingIndex
          ? { question: newQuestion, choices, correctAnswer: selectedChoice }
          : q
      );

      setQuestions(updatedQuestions);
      setNewQuestion("");
      setChoices([]);
      setShowInput(false);
      setSelectedChoice(null);
      setEditingIndex(null);
      setErrorMessage("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a question, choices, and select a correct answer before updating.",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setShowInput(false);
    setNewQuestion("");
    setChoices([]);
    setSelectedChoice(null);
    setErrorMessage("");
  };

  const handleEditChoice = (index) => {
    setEditingChoiceIndex(index);
    setEditingChoiceText(choices[index].text);
  };

  const handleDeleteChoice = (index) => {
    const updatedChoices = choices.filter((_, i) => i !== index);
    if (selectedChoice === index) {
      setSelectedChoice(null);
    } else if (selectedChoice > index) {
      setSelectedChoice(selectedChoice - 1);
    }
    setChoices(updatedChoices);
  };

  const handleCancelEditChoice = () => {
    setEditingChoiceIndex(null);
    setEditingChoiceText("");
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((q, i) => i !== index);
    setQuestions(updatedQuestions);
    setEditingIndex(null);
    setShowInput(false);
    setNewQuestion("");
    setChoices([]);
    setSelectedChoice(null);
    setErrorMessage("");
  };

  const AssignParticipantsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <div className="modal-header">
            <h2>
              <AiOutlineUsergroupAdd />
            </h2>
            <button className="modal-close-btn" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="modal-body">
            {/* Participant assignment logic goes here */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card sx={{ m: 5, width: "800px" }}>
      <CardContent>
        <h2 className="create-exam-title">Create Exam</h2>
        <div className="create-exam-container">
        {editingIndex === null && (
          <div className="exam-settings" >
            <input
              type="number"
              placeholder="Attempt Limits"
              value={attemptLimits}
              onChange={(e) => setAttemptLimits(e.target.value)}
            />
            <input
              type="number"
              placeholder="Passing Score"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
            />
            <button
              className="assign-button"
              onClick={() => setShowAssignParticipantsModal(true)}
              style={{
                fontSize: "14px",
                alignItems: "center",
              }}
            >
              <AiOutlineUsergroupAdd
                style={{
                  height: "18px",
                  width: "18px",
                }}
              />
              Assign Participants
            </button>
          </div>
          
        )}
          <AssignParticipantsModal
            isOpen={showAssignParticipantsModal}
            onClose={() => setShowAssignParticipantsModal(false)}
          />
          <button
            onClick={handleAddQuestion}
            className="exam-button"
            style={{
              padding: "8px 23px",
              width: "160px",
              display: "flex",
              alignItems: "center", // Aligns icon and text vertically
              fontSize: "13px",
              // marginLeft: "25px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <IoMdAddCircleOutline
              style={{
                height: "20px",
                width: "20px",
              }}
            />{" "}
            {/* Icon before text */}
            Add Question
          </button>
        
          {showInput && (
            <div className="question-input">
              Question:
              <div
                className="input-div"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <textarea
                  className="input-effect"
                  type="text"
                  value={newQuestion}
                  onChange={handleQuestionChange}
                  placeholder="  Type your question..."
                  style={{
                    height: "50px",
                    width: "500px",
                    borderRadius: "1px",
                    border: "1px inset black",
                  }}
                />
                <span className="focus-border"></span>
              </div>
              <hr3>Choices:</hr3>
              <div className="choices-container">
                {choices.map((choice, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectChoice(index)}
                    className={`choice-item ${
                      selectedChoice === index ? "selected" : ""
                    }`}
                  >
                    {/* inside submitted choices */}
                    {editingChoiceIndex === index ? (
                      <div className="editing-container">
                        {/* inside edit question */}
                        <p className="editingText">Editing..</p>
                        <div className="input-div">
                          <textarea
                            className="input-effect"
                            type="text"
                            value={editingChoiceText}
                            onChange={handleChoiceChange}
                            placeholder="Type a choice..."
                            style={{
                              height: "50px",
                              width: "500px",
                              borderRadius: "10px",
                            }}
                          />
                          <span className="focus-border"></span>
                        </div>
                        <div className="button-group">
                          <button
                            className="exam-button"
                            onClick={() => handleDeleteChoice(index)}
                          >
                            <FiTrash2 />
                          </button>
                          <button
                            className="exam-button"
                            onClick={handleAddChoice}
                          >
                            {editingChoiceIndex !== null ? <FiEdit /> : "Add"}
                          </button>
                          <button onClick={handleCancelEditChoice}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="submitted-container">
                        <input
                          type="checkbox"
                          checked={choice.isCorrect}
                          onChange={() => handleMarkAsCorrect(index)}
                          style={{
                            marginRight: "8px",
                          }}
                        />
                        <label htmlFor={`choice-${index}`}>{choice.text}</label>
                        <div className="icon-group">
                          <FiEdit
                            onClick={() => handleEditChoice(index)}
                            style={{ marginRight: "5px" }}
                          />
                          |
                          <FiTrash2
                            onClick={() => handleDeleteChoice(index)}
                            style={{ marginLeft: "5px" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* choice text area */}
              <div
                className="input-div"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <textarea
                  className="input-effect"
                  type="text"
                  value={newChoice}
                  onChange={(e) => setNewChoice(e.target.value)}
                  placeholder="   Type choice..."
                  style={{
                    height: "50px",
                    width: "500px",
                    borderRadius: "1px",
                    marginTop: "15px",
                    border: "1px inset black",
                  }}
                />
                <span className="focus-border"></span>
              </div>
              <button
                className="exam-button"
                onClick={handleAddChoice}
                disabled={newChoice.trim() === ""}
                style={{
                  // backgroundColor: "transparent",
                  border: "none",
                }}
              >
                {/* Add icon on add question */}
                <AddIcon style={{ fontSize: "16px" }} />
              </button>
              {errorMessage && (
                <p className="error-message" style={{ color: "red" }}>
                  {errorMessage}
                </p>
              )}
              {editingIndex !== null ? (
                <div className="edit-questionbtn">
                  <button
                    className="exam-button"
                    onClick={handleUpdateQuestion}
                    style={{
                      marginLeft: "Auto",
                    }}
                  >
                    <RiLoopRightFill />
                    Update
                  </button>
                  {/* <button
                    className="exam-button"
                    onClick={() => handleDeleteQuestion(editingIndex)}
                  >
                    Delete
                  </button> */}
                  {/* big ass button */}
                  <button
                    className="cancel-button"
                    onClick={() => handleCancelEdit(editingIndex)}
                    style={{
                      ":hover": {
                        backgroundColor: "#ed2618",
                      },
                    }}
                  >
                    <RiCloseFill />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="exam-button"
                  onClick={handleSaveQuestion}
                  disabled={newQuestion.trim() === "" && choices.length === 0}
                  style={{
                    border: "none", // Removed border
                    // backgroundColor: "transparent",
                  }}
                >
                  {/* SAVE ICON IN ADD QUESTION */}
                  <SaveIcon style={{ fontSize: "16px" }} />{" "}
                </button>
              )}
            </div>
          )}
          <div className="display-questions">
            {questions.map((q, index) => (
              <div key={index}>
                <div className="line-border"></div>
                <div className="question-header">
                  <strong>Question #{index + 1}. </strong> {q.question}
                </div>

                {q.choices.map((choice, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectChoice(i)}
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      marginBottom: "5px",
                      marginTop: "10px",
                      backgroundColor:
                        selectedChoice === i ? "#e0e0e0" : "white",
                      borderRadius: "5px",
                    }}
                  >
                    {choice.isCorrect && (
                      <span style={{ color: "green", marginRight: "5px" }}>
                        Correct
                      </span>
                    )}
                    {editingIndex !== null && editingChoiceIndex === i ? (
                      <div>
                        <div className="input-div">
                          <textarea
                            className="input-effect"
                            type="text"
                            value={editingChoiceText}
                            onChange={handleChoiceChange}
                            placeholder="Type a choice..."
                          />
                          <span className="focus-border"></span>
                        </div>

                        <button onClick={handleAddChoice}>
                          {editingChoiceIndex !== null ? "Update" : "Add"}{" "}
                          Choice
                        </button>
                        <button
                          className="exam-button"
                          onClick={handleDeleteChoice}
                        >
                          Delete
                        </button>
                        <button
                          className="exam-button"
                          onClick={handleCancelEditChoice}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <label htmlFor={`choice-${i}`}>{choice.text}</label>
                    )}
                  </div>
                ))}
                {editingIndex === null && (
                  <div className="question-buttons" key={index}>
                    <button
                      className="edit-button"
                      onClick={() => handleEditQuestion(index)}
                    >
                      <FiEdit style={{ fontSize: "15px" }} />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteQuestion(index)}
                    >
                      <FiTrash2 style={{ fontSize: "15px" }} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="contained"
            style={{
              backgroundColor: "#e71e4a",
              color: "white",
              // marginLeft: "auto", // Align to the right
              marginTop: "75px",
              alignItems: "center",
            }}
            onClick={() => saveExam(examId, questions)}
            startIcon={<SaveIcon />}
          >
            Save Exam
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateExam;
