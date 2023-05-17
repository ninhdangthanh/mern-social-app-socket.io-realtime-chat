import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import RightbarSearch from "../../components/rightbarsearch/Rightbarsearch";
import NewsCard from "../../components/news_card/NewsCard"
import axios from 'axios'
import "./timeline.css"

export default function TimeLine() {
    const [news, setNews] = useState([])

  useEffect(() => {
    const getNews = async () => {
        let res = await axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=83a32fae29fd489dac79132a1228b852')
        setNews(res.data.articles)
    }
    getNews()
  }, [])

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <div className="search">
          <h1 className='searchpeople'>Timeline</h1>
          <br />
        
          {news?.map(item => {
            return <NewsCard
            title={item.title}
            description={item.description}
            url={item.url}
            urlToImage={item.urlToImage}
            publishedAt={item.publishedAt.substring(0, 10)}
            content={item.content}
            />
          }) }  

        </div>
        <div className='rightbarfixao'></div>
        <div className='rightbarfix'><RightbarSearch/></div>
      </div>
    </>
  );
}
