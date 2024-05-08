import React, { useState, useRef } from "react";
import CreateCardForm from "./CreateCardForm";
import CardsGrid from "./CardsGrid";
import { Card, Button } from "@mui/material";
import "./ck-create-content.css";
import { useParams } from "react-router-dom";

function CKCreateContent() {
  const [cards, setCards] = useState([]);
  const topOfPageRef = useRef(null);
  const { examId } = useParams();

  const saveContent = async () => {
    for (const card of cards) {
      const formData = new FormData();
      formData.append("title", card.title);
      formData.append("description", card.description);
      // Handle multiple media files
      card.media.forEach((file, index) => {
        formData.append(`media${index}`, file, file.name); // This must match multerFields
      });

      try {
        const response = await fetch(
          `http://localhost:3001/create-content/slides/${examId}`,
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
      } catch (error) {
        console.error("Error saving content:", error);
      }
    }
  };

  const scrollToTop = () => {
    topOfPageRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const addCard = (card) => {
    setCards([...cards, { ...card, id: Date.now() }]);
    scrollToTop();
  };

  const editCard = (id, updatedCard) => {
    setCards(
      cards.map((card) => (card.id === id ? { ...updatedCard, id } : card))
    );
  };

  const deleteCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  return (
    <>
      <Card ref={topOfPageRef} className="create-content-app">
        <h1 className="top-title">Create Content</h1>
        <CreateCardForm addCard={addCard} />
        <CardsGrid cards={cards} editCard={editCard} deleteCard={deleteCard} />
        <Button
          variant="contained"
          sx={{ display: "flex", margin: "auto" }}
          onClick={saveContent}
        >
          Save
        </Button>
      </Card>
    </>
  );
}

export default CKCreateContent;
