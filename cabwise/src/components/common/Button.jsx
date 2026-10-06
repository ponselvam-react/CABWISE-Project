function Button({ children, variant = "primary", onClick }) {
  return (
    <button
      className={`cabwise-button ${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;