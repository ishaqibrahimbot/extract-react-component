import { Project } from "ts-morph";
import * as temp from "temp";
import * as fs from "fs";
import * as path from "path";
import { extractComponent } from "../extractComponent";
import {
  compareContents,
  createTempFileWith,
  getFileContent,
  stripWhiteSpace,
} from "./testUtils";

temp.track();

const tsConfigPath = path.resolve(__dirname, "../..", "tsconfig.json");

afterAll(() => {
  temp.cleanupSync();
});

test("Extracts component correctly", () => {
  const project = new Project({
    tsConfigFilePath: tsConfigPath,
    skipAddingFilesFromTsConfig: true,
  });

  const testComponentContents = getFileContent(
    path.resolve(__dirname, "TestComponent.tsx")
  );

  const sourceFilePath = createTempFileWith(
    testComponentContents,
    "TestComponent.tsx",
    ".tsx"
  );
  const newSourceFilePath = createTempFileWith("", "NewComponent.tsx", ".tsx");

  const sourceFile = project.addSourceFileAtPath(sourceFilePath);
  const newSourceFile = project.addSourceFileAtPath(newSourceFilePath);

  extractComponent(sourceFile, newSourceFile, 381);

  project.saveSync();

  const referenceTestComponentPath = path.resolve(
    __dirname,
    "TestComponent-modified.tsx"
  );
  const referenceNewComponentPath = path.resolve(__dirname, "NewComponent.tsx");

  const sourceFileContents = getFileContent(sourceFilePath);
  const newSourceFileContents = getFileContent(newSourceFilePath);

  const referenceTestContents = getFileContent(referenceTestComponentPath);
  const referenceNewContents = getFileContent(referenceNewComponentPath);

  expect(stripWhiteSpace(sourceFileContents.toString())).toEqual(
    stripWhiteSpace(referenceTestContents.toString())
  );
  expect(stripWhiteSpace(newSourceFileContents.toString())).toEqual(
    stripWhiteSpace(referenceNewContents.toString())
  );
});
