import {
  CallExpression,
  Identifier,
  JsxExpression,
  Node,
  Project,
  PropertyAccessExpression,
  SyntaxKind,
  VariableDeclarationKind,
  ts,
} from "ts-morph";

function getInsideChecker(start, end) {
  return (node: Node) => {
    const nodeStart = node.getStart();
    const nodeEnd = node.getEnd();
    console.log(nodeStart, nodeEnd);
    return nodeStart >= start && nodeEnd <= end;
  };
}

function main() {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    skipAddingFilesFromTsConfig: true,
  });

  const sourceFile = project.addSourceFileAtPath("Component.tsx");

  const descendant = sourceFile.getDescendantAtPos(284);

  const ancestor = descendant.getFirstAncestorByKind(SyntaxKind.JsxElement);

  if (!ancestor) return;

  const JSXElement = ancestor;

  const structure = JSXElement.getStructure();

  const newSourceFile = project.createSourceFile("NewComponent.tsx", "", {
    overwrite: true,
  });

  newSourceFile.addImportDeclaration({
    defaultImport: "React",
    moduleSpecifier: "react",
  });

  const props: {
    name: string;
    value: string;
  }[] = [];

  const isInside = getInsideChecker(JSXElement.getStart(), JSXElement.getEnd());

  JSXElement.forEachDescendant((node) => {
    if (node.getKind() == SyntaxKind.JsxExpression) {
      (node as JsxExpression).forEachDescendant((child, traversal) => {
        console.log(child.getText(), child.getKindName());
        switch (child.getKind()) {
          case SyntaxKind.Identifier: {
            let isNodeInside = true;
            let childNode = child as Identifier;
            childNode.getDefinitionNodes().forEach((def) => {
              if (!isInside(def)) {
                isNodeInside = false;
              }
            });
            // console.log(child.getDefinitions());
            // childNode.getDefinitions().forEach(def => console.log(def.getDeclarationNode().getText()))
            // childNode.findReferencesAsNodes().forEach(node => console.log(node.getText()))
            // const declarationName = child
            //   .getSymbol()
            //   .getValueDeclaration()
            //   .getKind();

            // console.log(
            //   child.getText(),
            //   child.getSymbol().getValueDeclaration().getKindName()
            // );

            // const potentialSymbolValueKinds = [
            //   SyntaxKind.VariableDeclaration,
            //   SyntaxKind.BindingElement,
            // ];

            if (!isNodeInside) {
              props.push({
                name: child.getText(),
                value: child.getText(),
              });
              console.log(props);
            }
            return;
          }

          case SyntaxKind.PropertyAccessExpression: {
            let childNode = child as PropertyAccessExpression;
            let startingIdentifierNode: Identifier;
            childNode
              .getDescendantsOfKind(SyntaxKind.Identifier)
              .forEach((descendant) => {
                const descendantText = descendant.getText();
                if (childNode.getText().startsWith(descendantText)) {
                  startingIdentifierNode = descendant;
                }
              });
            let isNodeInside = true;
            startingIdentifierNode.getDefinitionNodes().forEach((def) => {
              console.log(def.getText());
              console.log(isInside(def));
              if (!isInside(def)) {
                isNodeInside = false;
              }
            });

            if (!isNodeInside) {
              props.push({
                name: child.getSymbol().getName(),
                value: child.getText(),
              });
            }
            traversal.stop();
            return;
          }

          case SyntaxKind.CallExpression: {
            let childNode = node as CallExpression;
            // childNode.
            console.log(child.getText());
            return;
          }

          default: {
            return;
          }
        }
      });
    }
  });

  console.log(props);

  newSourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
    declarations: [
      {
        name: "NewComponent",
        initializer: (writer) => {
          writer.writeLine(
            `({${props.map((prop) => prop.name).join(", ")}}) => {`
          );
          writer.writeLine("return (");
          let JSX = JSXElement.getText();

          props.forEach((prop) => {
            JSX = JSX.replace(prop.value, prop.name);
          });
          writer.write(JSX);
          writer.writeLine(");");
          writer.writeLine("};");
        },
      },
    ],
  });

  JSXElement.replaceWithText((writer) => {
    writer.write(
      `<NewComponent ${props
        .map((prop) => `${prop.name}={${prop.value}}`)
        .join(" ")} />`
    );
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: "./NewComponent",
    namedImports: ["NewComponent"],
  });

  project.save();
}

main();
