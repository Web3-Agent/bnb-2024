
import React from 'react'

export default function ImageRender({ data }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // height: '320px',
            height: "520px"
            // backgroundImage: 'linear-gradient(to top, #09203f 0%, #537895 100%)'
        }}
            className='rounded border-gradient'
        >
            {/* {JSON.stringify(data)} */}
            {data?.url?.length ? <img src={data?.url} style={{ width: '100%', height: '100%' }} /> : <div className='h3 text-white'>Lets build something cool 😎</div>}

        </div>
    )
}