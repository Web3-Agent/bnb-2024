import React from 'react'

export default function ChatLoader() {
    return (
        <div class="d-flex justify-content-center p-4 ">
            <div class="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}
