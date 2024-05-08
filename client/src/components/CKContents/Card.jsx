import React, { useState } from "react";
import Modal from "./Modal";
import DOMPurify from "dompurify";

function Card({ card, editCard, deleteCard }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const renderMediaPreview = (mediaArray) => {
    return mediaArray.map((mediaItem, index) => {
      const mediaType = mediaItem.type.split("/")[0];

      switch (mediaType) {
        case "image":
          return (
            <img
              key={index}
              src={mediaItem.url}
              alt={`Media content ${index}`}
              className="card-media-image"
            />
          );
        case "video":
          return (
            <video
              key={index}
              src={mediaItem.url}
              controls
              className="card-media-video"
            >
              Your browser does not support the video tag.
            </video>
          );
        case "application":
          return (
            <div key={index} className="card-media-ppt">
              <img
                src="/public/ppt-icon.png"
                alt={`PowerPoint content ${index}`}
                className="card-ppt-preview"
              />
              <span className="card-ppt-filename">{mediaItem.fileName}</span>
            </div>
          );
        default:
          return <div key={index}>Unsupported media type</div>;
      }
    });
  };

  return (
    <>
      <div className="card-container" style={{ width: "600px", height: "auto", backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
  <h3
    className="card-title"
    dangerouslySetInnerHTML={createMarkup(card.title)}
    style={{ margin: 0, paddingBottom: "10px", borderBottom: "1px solid #e0e0e0" }}
  ></h3>
  {Array.isArray(card.media) && card.media.length ? (
    renderMediaPreview(card.media)
  ) : (
    <div style={{ margin: '0 auto', color: "#757575", paddingBottom: "10px" }}>No Media Provided</div>
  )}
  <div
    className="card-description"
    dangerouslySetInnerHTML={createMarkup(card.description)}
    style={{ color: "#424242", paddingBottom: "20px" }}
  ></div>
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <button onClick={toggleModal} className="card-button" style={{ backgroundColor: "#2196f3", color: "#ffffff", borderRadius: "4px", padding: "10px 20px", fontSize: "14px", border: "none", cursor: "pointer", transition: "background-color 0.3s" }}>
      View Details
    </button>

    <button onClick={() => editCard(card.id)} className="card-button card-button-edit" style={{ backgroundColor: "#4caf50", color: "#ffffff", borderRadius: "4px", padding: "10px 20px", fontSize: "14px", border: "none", cursor: "pointer", transition: "background-color 0.3s" }}>
      Edit
    </button>

    <button onClick={() => deleteCard(card.id)} className="card-button" style={{ backgroundColor: "#f44336", color: "#ffffff", borderRadius: "4px", padding: "10px 20px", fontSize: "14px", border: "none", cursor: "pointer", transition: "background-color 0.3s" }}>
      Delete
    </button>
  </div>
</div>


      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <h2 dangerouslySetInnerHTML={createMarkup(card.title)}></h2>
        {Array.isArray(card.media) && card.media.length ? (
          renderMediaPreview(card.media)
        ) : (
          <div>No Media Provided</div>
        )}
        <div dangerouslySetInnerHTML={createMarkup(card.description)}></div>
      </Modal>
    </>
  );
}

export default Card;
