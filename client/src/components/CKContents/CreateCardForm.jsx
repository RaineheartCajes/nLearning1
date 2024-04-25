import React, { useState, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AddIcon from '@mui/icons-material/Add';


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
<div>
  <h4 style={{ fontSize: "16px", fontFamily: "Arial, sans-serif", color: "#555", marginBottom: "8px" }}>Title</h4>
</div>
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
      <div className="create-media" style={{width: "300px"}}>
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
      <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
  <h4 style={{ fontSize: "16px", fontFamily: "Arial, sans-serif", color: "#555", margin: "0", marginRight: "10px" }}>Description</h4>
  <label style={{ fontSize: "13px", fontFamily: "Arial, sans-serif", color: "#333", margin: "0" }}>(max 200 words)</label>
</div>


        <CKEditor
          editor={ClassicEditor}
          data={description}
          onChange={(event, editor) => {
            const data = editor.getData();
            setDescription(data);
          }}
        />
      </div>
      <button type="submit" style={{backgroundColor: '#e11d48', borderRadius: '5px', color: 'white', width: '150px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderStyle: "none"}}>
  <AddIcon style={{ marginRight: '0.5em' }} /> Add Slide
</button>






    </form>
  );
}

export default CreateCardForm;
