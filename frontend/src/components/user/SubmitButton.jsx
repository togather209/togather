function SubmitButton({ type = "button", onClick, className, children, disabled }) {
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default SubmitButton;
