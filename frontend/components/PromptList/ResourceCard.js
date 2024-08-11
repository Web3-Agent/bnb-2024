import React from 'react';
import styles from './ResourceCard.module.css';

const ResourceCard = ({ title, description }) => {

  const resourceCard = {
      borderRadius: "10px",
      padding:" 20px",
      margin: "10px",
      width: "320px ",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "left",
      color:" #fff",
      transition: "transform 0.2s",
      height : "250px"
  }

  return (
    <>
    <div style={{display:"flex" , flexDirection:"column"}}>
    <div style={resourceCard} className='border-gradient'>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    </div>
    </>
  );
};

export default ResourceCard;
