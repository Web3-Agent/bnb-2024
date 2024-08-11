import React from 'react'
import Loader from '../ui/Loader'

export default function LoaderComponent({ show }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // height: '320px',
            minHeight:"600px"
            // backgroundImage: 'linear-gradient(to top, #09203f 0%, #537895 100%)'
        }}
            className='rounded border-gradient'
        >
            <Loader show={show} />
        </div>
    )
}
