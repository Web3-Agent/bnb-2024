import React from 'react'

export default function Table({ renderThead, renderTbody }) {
    return (
        <table id="example" className="table table-striped table-dark">
            <thead style={{ position: "sticky", top: 0 }} className='border'>
                {renderThead}
            </thead >
            <tbody>
                {renderTbody}
            </tbody>
        </table>
    )
}
