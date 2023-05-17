import React from 'react';
import "./news_card.css";

const NewsCard = ({ title, description, url, urlToImage, publishedAt, content }) => {
  return (
    <div className="news-card">
      <img src={urlToImage} alt={title} className="news-card__image" />
      <div className="news-card__content">
        <h2 className="news-card__title">{title}</h2>
        <p className="news-card__description">{description}</p>
        <p className="news-card__published">{publishedAt}</p>
        {/* <p className="news-card__content">{content}</p> */}
        <a href={url} target="_blank" rel="noopener noreferrer" className="news-card__link">
          Read More
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
