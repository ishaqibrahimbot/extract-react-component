import React from "react";

export const NewComponent = ({ greeting, name }) => {
  return (
    <div className="old-style">
      {greeting} {name}
    </div>
  );
};
