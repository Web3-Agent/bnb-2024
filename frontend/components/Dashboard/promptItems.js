import Image from 'next/image';

import ToolsData from '../../data/prompt.json';
import { useAppContext } from '@/context/Context';

const PromptItems = () => {
  const { inputs, setInputs } = useAppContext();
  console.log('🚀 ~ PromptItems ~ inputs:', inputs);
  const handleClick = (event, msg) => {
    console.log('🚀 ~ handleClick ~ msg:', msg);
    setInputs(msg);
    // const modalElement = document.getElementById('promptModal');
    // const modal = bootstrap.Modal.getInstance(modalElement); // Retrieve the modal instance
    // if (modal) {
    //   modal.hide(); // Hide the modal
    // }
  };
  return (
    <>
      {ToolsData &&
        ToolsData?.data?.map((data, index) => (
          <li key={index}>
            <div
              className={`genarator-card`}
              onClick={(e) => handleClick(e, data.msg)}
              data-bs-dismiss='modal'
            >
              <div className='inner'>
                <div className='left-align'>
                  {/* <div className='img-bar'>
                    <Image
                      src={data.img}
                      width={50}
                      height={50}
                      alt='AI Generator'
                    />
                  </div> */}
                  <h5 className='title'>{data.msg}</h5>
                </div>
                {/* <div className='right-align'>
                  {data.badge !== '' ? (
                    <span className='rainbow-badge-card'>{data.badge}</span>
                  ) : (
                    <div className='icon-bar'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='feather feather-arrow-right __web-inspector-hide-shortcut__'
                      >
                        <line x1='5' y1='12' x2='19' y2='12'></line>
                        <polyline points='12 5 19 12 12 19'></polyline>
                      </svg>
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </li>
        ))}
    </>
  );
};

export default PromptItems;
