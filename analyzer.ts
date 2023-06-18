import ts, { Project, SyntaxKind } from "ts-morph";

function main() {
  const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    skipAddingFilesFromTsConfig: true,
  });

  const sourceFile = project.addSourceFileAtPath("Component.tsx");

  const descendant = sourceFile.getDescendantAtPos(230);

  const ancestor = descendant.getFirstAncestorByKind(SyntaxKind.JsxElement);

  if (!ancestor) return;

  const JSXElement = ancestor as ts.JsxElement;

  const structure = JSXElement.getStructure();

  if (structure.name == "div") {
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

    JSXElement.forEachDescendant((node) => {
      if (node.getKind() == SyntaxKind.JsxExpression) {
        node.forEachChild((child) => {
          switch (child.getKind()) {
            case SyntaxKind.Identifier: {
              const declarationName = child
                .getSymbol()
                .getValueDeclaration()
                .getKind();

              if (declarationName == SyntaxKind.VariableDeclaration) {
                props.push({
                  name: child.getText(),
                  value: child.getText(),
                });
              }
              return;
            }

            case SyntaxKind.PropertyAccessExpression: {
              // console.log(child.getText());
              // console.log(child.getSymbol().getName())
              props.push({
                name: child.getSymbol().getName(),
                value: child.getText(),
              });
              return;
            }

            case SyntaxKind.CallExpression: {
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

    newSourceFile.addVariableStatement({
      declarationKind: ts.VariableDeclarationKind.Const,
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
  }

  project.save();
}

main();
