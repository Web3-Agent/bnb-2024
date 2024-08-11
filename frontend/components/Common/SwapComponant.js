import React from 'react';

const SwapComponent = ({ toAmount, toSymbol, fromAmount, fromSymbol, slippage }) => {
  const containerStyle = {
    backgroundColor: '#2d3748',
    color: 'white',
    padding: '3rem',
    borderRadius: '0.5rem',
    width: '100%',
    maxWidth: '48rem',
    margin: '2.5rem auto',
    display: 'flex',
    justifyContent: 'space-between'
  };

  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '30%',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem'
  };

  const inputStyle = {
    backgroundColor: '#4a5568',
    color: 'white',
    padding: '0.25rem',
    borderRadius: '0.5rem',
    width: '100%',
    textAlign: 'center'
  };

  const labelStyle = {
    fontSize: '0.875rem'
  };

  const unitStyle = {
    fontSize: '0.875rem',
    marginTop: '0.25rem'
  };

  return (
    <div style={containerStyle}>
      <div style={columnStyle}>
        <div style={labelStyle}>You pay</div>
        <input
          type="number"
          step="0.01"
          value={toAmount}
          style={inputStyle}
        />
        <div style={unitStyle}>{fromSymbol}</div>
      </div>
      <div style={columnStyle}>
        <div style={labelStyle}>You receive</div>
        <input
          type="number"
          step="0.0001"
          value={fromAmount}
          style={inputStyle}
        />
        <div style={unitStyle}>{toSymbol}</div>
      </div>
      <div style={columnStyle}>
        <div style={labelStyle}>Slippage</div>
        <input
          type="number"
          step="0.01"
          value={slippage}
          style={inputStyle}
        />
      </div>
    </div>
  );
};

export default SwapComponent;
