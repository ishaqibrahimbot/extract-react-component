import React from "react";
import { toUpperCase } from "@utils";

const greeting = "Hello";

const data = {
  user: {
    name: "Ishaq",
  },
};

export const Component = ({ prop, someOtherProp, yetAnotherProp }) => {
  return (
    <section>
      <div className="old-style">
        {greeting} {data?.user?.name} {toUpperCase(prop)}
      </div>
      ;<p>Some text over here</p>
    </section>
  );
};
