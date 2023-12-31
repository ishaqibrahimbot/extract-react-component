import React from "react";
import { toUpperCase } from "@utils";

// const name = "Ishaq";

function helloWorld() {
  console.log("HELLO WORLD");
}

const greeting = "Hello";

const data = {
  user: {
    name: "Ishaq",
  },
};

const words = ["What's", "up"];

export const TestComponent = ({ prop, somethingElse, yetAnotherThing }) => {
  return (
    <section>
      <div className="old-style">
        {greeting} {data?.user?.name} {toUpperCase(prop)}
      </div>
      ;<p>Some text over here</p>
    </section>
  );
};
