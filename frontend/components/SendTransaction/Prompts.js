import React from 'react';
import Image from 'next/image';
import { FaLaptopCode } from 'react-icons/fa6';

const Prompts = ({ data, onPromptClick }) => {
  const handleClick = (e, prompt) => {
    e.preventDefault();
    onPromptClick(prompt);
  };

  return (
    <ul style={styles.cards} >
      {data.map((card, index) => (
        <li className='border-gradient' key={index} style={styles.cardItem}>
          <a
            href="#"
            className="card-link"
            onClick={(e) => handleClick(e, card.prompt)}
            style={styles.cardLink}
          >
            <div className="card-content" style={styles.cardContent}>
              <div className="img-container" style={styles.imgContainer}>
                 {/* <div className="border-gradient"> */}
                     <FaLaptopCode className=" text-gradient" />
                  {/* </div> */}
              </div>
              <div className="text-container" style={styles.textContainer}>
                <h5 className="card-title" style={styles.cardTitle}>{card.title}</h5>
                <p className="card-description" style={styles.cardDescription}>{card.description}</p>
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};

const styles = {
  cards: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: "center"
  
  },
  cardItem: {
    width: '25%',
    margin: '2.5%',
    backgroundColor: '#1a1a1a',
    borderRadius: '10px',
    overflow: 'hidden',
    textAlign: 'left',
    
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
  },
  imgContainer: {
    marginRight: '15px',
  },
  img: {
    borderRadius: '5px',
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: '1.5rem',
    margin: '0 0 5px 0',
    color: '#fff',
  },
  cardDescription: {
    fontSize: '1rem',
    margin: 0,
   
  },
};

export default Prompts;
