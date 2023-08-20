import React from "react";
import { toUpperCase } from "@utils";

export const NewComponent = ({ greeting, name, prop }) => {
  return (
    <div className="old-style">
      {greeting} {name} {toUpperCase(prop)}
    </div>
  );
};
