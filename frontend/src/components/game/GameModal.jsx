import React from 'react';

function Modal({ 
  isOpen, onClose, onConfirm, newParticipant, setNewParticipant 
}) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h2>참여 인원 추가</h2>
                <input
                    type="text"
                    placeholder="이름 입력"
                    value={newParticipant}
                    onChange={e => setNewParticipant(e.target.value)}
                    style={{ padding: 10, marginBottom: 20, borderRadius: 5, border: '1px solid #ccc' }}
                />
                <button onClick={onConfirm} style={{
                    padding: '10px 20px',
                    borderRadius: 5,
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                }}>
                    확인
                </button>
                <button onClick={onClose} style={{
                    padding: '10px 20px',
                    borderRadius: 5,
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: 10
                }}>
                    취소
                </button>
            </div>
        </div>
    );
}

export default Modal;
