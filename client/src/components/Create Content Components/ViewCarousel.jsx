import React, { useState } from "react";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ViewCarousel = ({ notes }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = notes.map((note) => ({
    header: note.title,
    body: note.description,
    visual: note.imageUrl,
  }));
  const CarouselItem = ({ item }) => {
    return (
      <div className="carousel-item">
        {item.visual && (
          <img
            className="carousel-visual"
            src={item.visual}
            alt="Carousel Visual"
          />
        )}
        <div className="carousel-item-head">{item.header}</div>
        <div className="carousel-item-body">{item.body}</div>
      </div>
    );
  };

  const updateIndex = (newIndex) => {
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= items.length) {
      newIndex = items.length - 1;
    }

    setActiveIndex(newIndex);
  };

  return (
    <div className="carousel">
      <div
        className="inner"
        style={{ transform: `translate(-${activeIndex * 100}%)` }}
      >
        {items.map((item, index) => {
          
          return <CarouselItem key={index} item={item} width={"100%"} />;
        })}
      </div>
      <div className="carousel-buttons">
      <Button
  className="button-arrow"
  onClick={() => {
    updateIndex(activeIndex - 1);
  }}
  startIcon={<ArrowBackIosIcon />}
>
  Back
</Button>
        <div className="indicators">
          {items.map((_, index) => (
            <button
              key={index}
              className="indicator-buttons"
              onClick={() => {
                updateIndex(index);
              }}
            >
              <span
                className={`material-symbols-outlined ${
                  index === activeIndex
                    ? "indicator-symbol-active"
                    : "indicator-symbol"
                }`}
              >
                radio_button_checked
              </span>
            </button>
          ))}
        </div>
        <Button
  className="button-arrow"
  onClick={() => {
    updateIndex(activeIndex + 1);
  }}
  endIcon={<ArrowForwardIosIcon />}
>
  Next
</Button>
      </div>
    </div>
  );
};
export default ViewCarousel;
