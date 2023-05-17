import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from 'react-router-dom'

export default function Topbar(props) {
  const { user } = useContext(AuthContext);
  let history = useHistory();
  const inputRef = useRef(null);

  const navigateToSearchPage = () => {
    history.push({
      pathname: "/search",
      state: {searchValue: inputRef.current.value},
    });
    window.location.href = window.location.pathname;

  }

  useEffect(() => {if(props.searchValue) {
    inputRef.current.value = props.searchValue
  }}, [props.searchValue])
  
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Lamasocial</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search onClick={navigateToSearchPage} className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            ref={inputRef}
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <Link  className="topbarIconItem" to="/timeline"><span className="topbarLink">Timeline</span></Link>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <Link to="/messenger" className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </Link>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}

