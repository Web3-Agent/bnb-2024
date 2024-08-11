import React from 'react';

const ReactionBot = ({ copyText, sendTransaction, txInfo }) => {
  return (
    <>
      <div className='reaction-section'>
        <div className='btn-grp'>
          <div className='left-side-btn dropup'>
            {/* <button
              data-bs-toggle='modal'
              data-bs-target='#likeModal'
              className='react-btn btn-default btn-small btn-border me-2'
            >
              <i className='feather-thumbs-up'></i>
            </button>
            <button
              data-bs-toggle='modal'
              data-bs-target='#dislikeModal'
              className='react-btn btn-default btn-small btn-border me-2'
            >
              <i className='feather-thumbs-down'></i>
            </button> */}
            {/* <button
              data-bs-toggle='modal'
              data-bs-target='#shareModal'
              className='react-btn btn-default btn-small btn-border me-2'
              onClick={copyText}
            >
              <i className='feather-share'></i>
              <i className='feather-copy'></i>
            </button> */}
            {/* <button
              type='button'
              className='react-btn btn-default btn-small btn-border dropdown-toggle me-2'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              <i className='feather-more-vertical'></i>
            </button> */}
            {/* <ul className='dropdown-menu'>
              <li onClick={copyText}>
                <a className='dropdown-item' href='#'>
                  <i className='feather-copy'></i> Copy
                </a>
              </li>
              <li>
                <a className='dropdown-item' href='#'>
                  <i className='feather-tag'></i> Pin Chat
                </a>
              </li>
              <li>
                <a className='dropdown-item' href='#'>
                  <i className='feather-file-text'></i> Rename
                </a>
              </li>
              <li>
                <a className='dropdown-item delete-item' href='#'>
                  <i className='feather-trash-2'></i> Delete Chat
                </a>
              </li>
            </ul> */}
            {/* <ul className='dropdown-menu'>
              <li>action: {txInfo?.txnData?.action}</li>
              <li>amount: {txInfo?.txnData?.amount}</li>
              <li>from: {txInfo?.txnData?.from}</li>
              <li>interactedWith: {txInfo?.txnData?.interactedWith}</li>
            </ul> */}
          </div>
          <div className='right-side-btn'>
            <button
              type='button'
              className='react-btn btn-default btn-small btn-border dropdown-toggle me-2'
              data-bs-toggle='dropdown'
              aria-expanded='false'
            >
              <i className='feather-more-vertical'></i>
            </button>
            {/* <ul className='dropdown-menu'>
              <li onClick={copyText}>
                <a className='dropdown-item' href='#'>
                  <i className='feather-copy'></i> Copy
                </a>
              </li>
              <li>
                <a className='dropdown-item' href='#'>
                  <i className='feather-tag'></i> Pin Chat
                </a>
              </li>
              <li>
                <a className='dropdown-item' href='#'>
                  <i className='feather-file-text'></i> Rename
                </a>
              </li>
              <li>
                <a className='dropdown-item delete-item' href='#'>
                  <i className='feather-trash-2'></i> Delete Chat
                </a>
              </li>
            </ul> */}
            <ul className='dropdown-menu'>
              <li>action: {txInfo?.txnData?.action}</li>
              <li>amount: {txInfo?.txnData?.amount}</li>
              <li>from: {txInfo?.txnData?.from}</li>
              <li>interactedWith: {txInfo?.txnData?.interactedWith}</li>
            </ul>
            <button
              className='react-btn btn-default btn-small btn-border'
              onClick={sendTransaction}
            >
              <i className='feather-thumbs-up'></i>
              {/* <i className='feather-repeat'></i> */}
              <span>Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReactionBot;
