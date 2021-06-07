import React from "react";
import "./TextContainer.css";
import onlineIcon from "../assets/onlineIcon.png";

const TextContainer = ({ users }) => (
  <div className="textContainer">
   
    {users ? (
      <div>
        <h1>People currently chatting:</h1>
        <div className="activeContainer">
          <h2>
            {users.map(({ name }) => (
              <div key={name} className="activeItem">
                <img alt="Online Icon" src={onlineIcon} style={{padding:"15px"}} />
                {name}
              </div>
            ))}
          </h2>
        </div>
      </div>
    ) : null}
  </div>
);

export default TextContainer;
