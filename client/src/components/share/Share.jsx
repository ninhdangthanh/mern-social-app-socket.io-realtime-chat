import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const { user } = useContext(AuthContext);
  const desc = useRef();
  const [fileInputState, setFileInputState] = useState('');
  const [fileUpload, setFileUpload] = useState(null);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setFileInputState(e.target.value);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFileUpload(reader.result);
    };
  }
  
  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (fileUpload) {
      const data = new FormData();
      const fileName = Date.now() + fileInputState.name;
      data.append("name", fileName);
      data.append("file", fileUpload);
      data.append('upload_preset', 'tohsay97')
      newPost.img = fileName;
      try {
        const cloud = await axios.post('https://api.cloudinary.com/v1_1/ddqomjz02/image/upload', data)

        const res = await axios.post("/posts", {...newPost, img: cloud.data.url});
        window.location.reload();
      } catch (err) {}
    }
    try {
    } catch (err) {}
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture 
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.username + "?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {fileUpload && (
          <div className="shareImgContainer">
            <img className="shareImg" src={fileUpload} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFileInputState(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={handleFileInputChange}
                value={fileInputState}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
