import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import {PhotoLibrary, CameraAlt} from '@material-ui/icons';
import Camera from '../../components/Camera/Camera'

export default function Profile() {
  const [user, setUser] = useState({});
  const [isCam, setIsCam] = useState(false);
  const [avt, setAvt] = useState('');
  const [fileInputState, setFileInputState] = useState('');
  const [fileUpload, setFileUpload] = useState(null);
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setFileInputState(e.target.value);
    previewFile(file);
    setFileUpload(file)
  }

  const handleFileInputCameraChange = (file) => {
    console.log(file)
    setAvt(file);
    setFileUpload(file)
  }

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAvt(reader.result);
    };
  };

  const cancelAvtBtn = () => {
    setFileUpload(null)
    setFileInputState("");
    setAvt("");
  }

  const confirmAvtBtn = async () => {
    try {
      const formData = new FormData()
      formData.append('file', fileUpload)
      formData.append('upload_preset', 'tohsay97')
      const cloud = await axios.post('https://api.cloudinary.com/v1_1/ddqomjz02/image/upload', formData)

      const res = await axios.put(`/posts/avt/${user._id}`, {profilePicture: cloud.data.url});
      
      const resUser = await axios.get(`/users?username=${username}`);
      localStorage.setItem("user", JSON.stringify(resUser.data))

      const resUpdateAvt = await axios.post(`/posts`, {
        userId: user._id,
        desc: `${user.username} vừa cập nhật ảnh đại diện`,
        img: cloud.data.url}
      );

      window.location.reload();

      setFileInputState(null);
      setFileUpload(null)
    } catch (err) {
      console.log(err)
      setFileInputState("");
      setAvt("");
      // toastError("Cập nhật Avatar thất bại")
    }
  }

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src="https://res.cloudinary.com/ddqomjz02/image/upload/v1657286731/xtpmixlvrmhiy9q7e3jw.png"
                alt=""
              />
              {avt ? <></> : <>
                <img
                  className="profileUserImg"
                  src={
                    user.profilePicture
                  }
                  alt=""
                />
              </>}
              {avt && (
                <img
                  src={avt}
                  alt="chosen"
                  className="profileUserImg"
                />
              )}

            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
              <br />
              <h3 className="updateAvtLabel">Cập nhật ảnh đại diện</h3>
              <div className="labelAvt" onClick={() => setIsCam(true)}>
                <CameraAlt />
                Chụp ảnh tử Camera
              </div>
              <label className="labelAvt" for="updateAvt">
                <PhotoLibrary />
                Chọn ảnh từ thư viện
                <input onChange={handleFileInputChange}
                  value={fileInputState} className="inputAvt" id="updateAvt" type="file" />
              </label>
              {isCam && <Camera handleFileInputCameraChange={handleFileInputCameraChange} setIsCam={setIsCam} />}
              {fileInputState || fileUpload ? <div className="confirmAvt">
                <button onClick={cancelAvtBtn} className="cancelAvtBtn">Hủy</button>
                <button onClick={confirmAvtBtn} className="confirmAvtBtn">Cập nhật</button>
              </div> : <></>}
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
