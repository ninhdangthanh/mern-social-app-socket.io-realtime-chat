import React, { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import ConversationsHomepage from "../../components/conversationsHomepage/ConversationsHomepage";
import Rightbar from "../../components/rightbar/Rightbar";
import RightbarSearch from "../../components/rightbarsearch/Rightbarsearch";
import "./search.css"

export default function Search() {
  let searchValue = useRef(null);
  let location = useLocation();

  useEffect(() => {
  }, [])

  return (
    <>
      <Topbar searchValue={location.state.searchValue} />
      <div className="homeContainer">
        <Sidebar />
        <div className="search">
          <h1 className='searchpeople'>Search people</h1>
        <ConversationsHomepage searchValue={location.state.searchValue} />
        </div>
        {/* <Rightbar/> */}
        <RightbarSearch/>
      </div>
    </>
  );
}
