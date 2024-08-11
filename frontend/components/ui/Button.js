import React from 'react'

export default function Button({ btnClass, type = "button", title, icon: Icon, iconClass, onClick, loading = false, disabled = false, style }) {
    return (
        <button className={btnClass} type={type} onClick={onClick} disabled={disabled} style={style}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                {
                    loading && (
                        <span className="spinner-border spinner-border-md" aria-hidden="true"></span>
                    )
                }
                {Icon && <div>
                    <Icon className={iconClass} /></div>}
                <div>{title}</div>
            </div>
        </button >
    )
}
