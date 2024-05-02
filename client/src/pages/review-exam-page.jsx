import React, { useEffect, useMemo, useState } from "react";
import CarouselItem from "./CarouselItem";
import "../assets/styles/review-exam-page.css";
import Navbar from "../components/Navbar";
import { useLocation, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import QuizIcon from "@mui/icons-material/Quiz";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ReviewExamPage = () => {
  const location = useLocation();
  const { examId } = useParams();
  const reviewState = location.state;
  const [activeIndex, setActiveIndex] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      if (location.state?.details?.reviewerContent?.slides) {
        const slides = location.state.details.reviewerContent.slides;

        const data = slides.map((slide) => ({
          header: slide.title,
          body: slide.description,
          // Assuming media is an array with at least one object with a url property
          visual: slide.media.length > 0 ? slide.media[0].url : null,
        }));
        setItems(data);
      } else {
        throw new Error("Invalid or missing data in location.state");
      }
    } catch (error) {
      console.error("Error in useEffect:", error.message);
    }
  }, [location.state]);

  const isLastSlide = activeIndex === items.length - 1;

  const updateIndex = (newIndex) => {
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= items.length) {
      newIndex = items.length - 1;
    }

    setActiveIndex(newIndex);
  };
  
  return (
    <>
      <Navbar />
      <div
        className="return--wrapper"
        style={{
          backgroundColor: "#ddd",
          boxShadow: "0 0 10px black",
        }}
      ></div>

      <div className="review-page--wrapper">
        <div
          className="carousel"
          style={{ width: "100%", display: "flex", height: "100%" }}
        >
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
            />
            <div className="indicators">
              {items.map((item, index) => {
                return (
                  <button
                    key={index}
                    className="indicator-buttons"
                    onClick={() => {
                      if (index !== activeIndex) {
                        updateIndex(index);
                      }
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
                );
              })}
            </div>
            <Button
              className="button-arrow"
              onClick={() => {
                updateIndex(activeIndex + 1);
              }}
              endIcon={<ArrowForwardIosIcon />}
            />
            <div className="take-exam-button">
          <Button
            href={isLastSlide ? `/dashboard/exams/${examId}/take-exam` : "#"}
            className={`brand-red-bg ${!isLastSlide && "disabled"}`}
            sx={{
              textTransform: "capitalize",
              px: 3,
              py: 2,
              position: "absolute",
              //marginTop: "550px",
              opacity: isLastSlide ? 1 : 0.5,
              cursor: isLastSlide ? "pointer" : "not-allowed",
            }}
            disabled={!isLastSlide}
            startIcon={<QuizIcon />}
          >
            Take Exams
          </Button>
        </div>
          </div>
        </div>
      </div>
      {/* Take Exam button */}
      
    </>
  );
};

export default ReviewExamPage;
  