import React from 'react'

export default function Input({ label, placeholder, value, onChange }) {
    return (
        <>
            {label && <label for="inputField" class="form-label px-1">{label}</label>}
            <input
                type="text"
                class="form-control"
                id="inputField"
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                style={styles.promptCard} />
        </>
    )
}

const styles = {
    promptCard: {
        backgroundColor: '#1a1a1a',
        borderColor: '#D11EE5',
        borderWidth: '1px',
        borderStyle: 'solid',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        textAlign: 'left',
        padding: '4px 8px',
        borderRadius: '8px',
        color: 'white'
    },
}