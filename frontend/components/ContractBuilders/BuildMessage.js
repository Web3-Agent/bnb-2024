import React from 'react'

export default function BuildMessage() {
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
            <div className='h3 text-white'>Lets build something cool 😎
            </div>
        </div>
    )
}