import React from "react";
import { NewComponent } from "./NewComponent";

const name = "Ishaq";

const greeting = "Hello";

const data = {
  user: {
    name: "Ishaq",
  },
};

const words = ["What's", "up"];

export const Component = () => {
  return (
    <section>
      <NewComponent greeting={greeting} name={data?.user?.name} />;
      <p>Some text over here</p>
    </section>
  );
};
