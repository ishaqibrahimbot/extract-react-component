import React from "react";
import { toUpperCase } from "@utils";
import { NewComponent } from "./NewComponent";

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
      <NewComponent greeting={greeting} name={data?.user?.name} prop={prop} />;
      <p>Some text over here</p>
    </section>
  );
};
