import React, { useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';

const Form = ({ input, setInput, onSendMessage }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Scrolls to the bottom of the container when component mounts or updates
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  });

  const handleMessageChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (input?.trim() !== '') {
      onSendMessage(input);
      setInput('');
    } else {
      alert('Please enter a message.');
    }
  };

  const handleKeyPress = (event) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <>
      <div ref={containerRef} onKeyDown={handleKeyPress}>
        <Tooltip id='my-tooltip' className='custom-tooltip tooltip-inner' />

        <div className='new-chat-form border-gradient'>
          <div className='left-icons'>
            <button
              className='form-icon icon-send'
              data-bs-toggle='modal'
              data-bs-target='#promptModal'
              data-tooltip-content=''
              style={{
                cursor: 'pointer',
              }}
              onClick={() => console.log('helloworld')}
            >
              <i className='feather-command'></i>
            </button>
          </div>
          <textarea
            rows='1'
            placeholder='Send a message...'
            value={input}
            onChange={(e) => handleMessageChange(e)}
            onKeyDown={handleKeyPress}
          />
          <div className='right-icons'>
            <button
              onClick={handleSubmit}
              // type='submit'
              className='form-icon icon-send'
              data-tooltip-id='my-tooltip'
              data-tooltip-content='Send message'
            >
              <i className='feather-send'></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
