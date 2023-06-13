import { Project, SyntaxKind } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  skipAddingFilesFromTsConfig: true,
});

project.addSourceFileAtPath("Component.tsx");

const sourceFile = project.getSourceFile("Component.tsx");

for (const JSXElement of sourceFile.getDescendantsOfKind(
  SyntaxKind.JsxElement
)) {
  JSXElement.forEachDescendant((descendant, traversal) => {
    if (descendant.getKind() == SyntaxKind.JsxAttribute) {
      for (const identifier of descendant.getDescendantsOfKind(
        SyntaxKind.Identifier
      )) {
        console.log(identifier.getText());
      }
      for (const value of descendant.getDescendantsOfKind(
        SyntaxKind.StringLiteral
      )) {
        console.log(value.getText());
        value.setLiteralValue("old-style");
      }
    }
  });
}

project.save();
