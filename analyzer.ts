import ts, { Project, SyntaxKind } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  skipAddingFilesFromTsConfig: true,
});

const sourceFile = project.addSourceFileAtPath("Component.tsx");

for (const JSXElement of sourceFile.getDescendantsOfKind(
  SyntaxKind.JsxElement
)) {
  const structure = JSXElement.getStructure();

  if (structure.name == "div") {
    const newSourceFile = project.createSourceFile("NewComponent.tsx", "", {
      overwrite: true,
    });

    newSourceFile.addImportDeclaration({
      defaultImport: "React",
      moduleSpecifier: "react",
    });

    const props = [];

    JSXElement.forEachDescendant((node) => {
      if (node.getKind() == SyntaxKind.JsxExpression) {
        const expression = node.getFullText().replace("{", "").replace("}", "");
        props.push(expression);
      }
    });

    newSourceFile.addVariableStatement({
      declarationKind: ts.VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          name: "NewComponent",
          initializer: (writer) => {
            writer.writeLine(`({${props.join(", ")}}) => {`);
            writer.writeLine("return (");
            writer.write(JSXElement.getText());
            writer.writeLine(");");
            writer.writeLine("};");
          },
        },
      ],
    });

    JSXElement.replaceWithText((writer) => {
      writer.write(
        `<NewComponent ${props.map((prop) => `${prop}={${prop}}`).join(" ")} />`
      );
    });

    sourceFile.addImportDeclaration({
      moduleSpecifier: "./NewComponent",
      namedImports: ["NewComponent"],
    });
  }
}

project.save();
