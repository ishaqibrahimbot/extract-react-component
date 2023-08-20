import { Project } from "ts-morph";
import { extractComponent } from "./extractComponent";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  skipAddingFilesFromTsConfig: true,
});

const sourceFile = project.addSourceFileAtPath("src/Component.tsx");

const newSourceFile = project.createSourceFile("src/NewComponent.tsx", "", {
  overwrite: true,
});

const offset = 381;

extractComponent(sourceFile, newSourceFile, offset);

project.save();
