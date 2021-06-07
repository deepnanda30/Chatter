import React from "react";
import "./Input.css";

const Input = ({ setMessage, sendMessage, message }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
    />
    <button
      className="sendButton"
      onClick={(e) => sendMessage(e)}
      style={{ cursor: "pointer" }}
    >
      Send
    </button>
  </form>
);

export default Input;
