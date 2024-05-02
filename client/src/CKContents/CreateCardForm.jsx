import React, { useState, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SearchIcon from '@mui/icons-material/Search';

function CreateCardForm({ addCard }) {
  const [title, setTitle] = useState("");
  const [media, setMedia] = useState([]);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef();

  const editorConfiguration = {
    toolbar: ["Undo", "Redo", "Heading", "bold", "italic"],
  };

  const handleMediaChange = (e) => {
    
    const fileURLs = Array.from(e.target.files).map((file) =>
      Object.assign(file, {
        url: URL.createObjectURL(file),
      })
    );
    setMedia(fileURLs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cardData = {
      title,
      media, 
      description,
    };

    addCard(cardData);
   
    setTitle("");
    setMedia([]);
    setDescription("");
    fileInputRef.current.value = ""; 
  };

  return (
    <form onSubmit={handleSubmit} className="create-card-form">
      <div className="create-title">
        <label style={{ fontSize: "13px" }}>Title</label>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          data={title}
          onChange={(event, editor) => {
            const data = editor.getData();
            setTitle(data);
          }}
        />
      </div>
      <div className="create-media">
        <label>Media (images, videos, PPT)</label>
        <input
          type="file"
          onChange={handleMediaChange}
          accept="image/*,video/*,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          multiple
          ref={fileInputRef}
        />
      </div>
      <div className="create-description">
        <label style={{ fontSize: "13px" }}>Description (max 200 words)</label>
        <CKEditor
          editor={ClassicEditor}
          data={description}
          onChange={(event, editor) => {
            const data = editor.getData();
            setDescription(data);
          }}
        />
      </div>
      <button type="submit">Add Slide</button>
    </form>
  );
}

export default CreateCardForm;
