import React, { useState } from 'react';
import Link from "next/link";

const DiscoverCard = ({ CardData }) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <div style={styles.filterSection}>
        {CardData.categories.map((category, index) => (
          <div
            key={index}
            style={{
              ...styles.filterStyle,
              backgroundColor: selectedCategory === category ? "#4CAF50" : "#333",
            }}
            onClick={() => handleCategoryClick(category)}
            className="border-gradient"
          >
            <div>{category}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <input
          type="text"
          placeholder="Search for contract"
          className='border-gradient'
          style={styles.inputStyle}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button style={styles.btnStyle} className='btn-default btn-small'>
          <i className="feather-search"></i>
        </button>
      </div>

      <div style={styles.container}>
        <div style={styles.cards}>
          {CardData.contract
            .filter((data) => {
              // Filter by category if selectedCategory is not null
              if (selectedCategory) {
                return data.category.toLowerCase() === selectedCategory.toLowerCase();
              }
              // Otherwise, return all data
              return true;
            })
            .filter((data) =>
              search.toLowerCase() === '' ? true : data.desc.toLowerCase().includes(search)
            )
            .map((data, index) => (
              <Link href="discover-detail" key={index}>
                <div style={styles.card} className='border-gradient'>
                  <h3 style={styles.title}>{data.title}</h3>
                  <p style={styles.subtitle}>{data.desc}</p>
                  <div style={styles.iconDiv}>
                    <p className='mb--0'>{data.poweredBy}</p>
                    <i className={`feather-${data.icon}`} style={{ alignContent: "center" }}></i>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}

const styles = {

  container: {
    maxWidth: '1200px',
    margin: '10px 0 0px 0',
    padding: '20px',
    color: 'white',
  },
  title: {
    fontSize: '1.5rem',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '15px',
    // textAlign: 'center',
    // marginBottom: '40px',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: "repeat(3, minmax(300px,1fr))",
    gap: "1rem",

  },
  card: {
    height: "100%",
    backgroundColor: '#000',
    padding: '10px',
    borderRadius: '10px',
    // marginBottom: '15px',
    // width: '30%',
    // height:"20%",
    // border: '1px solid #333',

  },
  iconDiv: {
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
    marginBottom: "0"
  },
  inputStyle: {
    padding: "5px 20px",
    borderRadius: "10px",
  },
  btnStyle: {
    position: "relative",
    border: "none",
    padding: "0px 10px",
    borderRadius: "10px",
    alignContent: "center",
    right: "36px"
  },
  filterSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "24px"
  },
  filterStyle: {

    fontSize: "15px",
    fontWeight: "400",
    padding: "3px 10px",
    borderRadius: "5px",
    // border: "1px solid #333",
    cursor: "pointer",
    color: "white",
  }



};

export default DiscoverCard;
