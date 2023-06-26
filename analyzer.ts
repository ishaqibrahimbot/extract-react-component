import {
  ArrowFunction,
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

  const importDeclarations = sourceFile.getImportDeclarations();
  const variableDeclarations = sourceFile.getVariableDeclarations();
  const functions = sourceFile.getFunctions();

  const defaultImports = {};
  const namedImports = {};

  importDeclarations.forEach((importDecl) => {
    const structure = importDecl.getStructure();
    if (structure?.defaultImport) {
      defaultImports[structure.defaultImport] = structure.moduleSpecifier;
    }
    if (
      Array.isArray(structure.namedImports) &&
      structure?.namedImports?.length > 0
    ) {
      console.log(structure.namedImports);
      structure.namedImports?.forEach((namedImport) => {
        namedImports[namedImport?.name] = structure.moduleSpecifier;
      });
    }
  });

  console.log(defaultImports);
  console.log(namedImports);

  const defaultImportKeys = Object.keys(defaultImports);
  const namedImportKeys = Object.keys(namedImports);

  const inputProps = [];

  const varDeclarations = [];
  const fileName = sourceFile.getBaseNameWithoutExtension();
  variableDeclarations.forEach((varDecl) => {
    if (varDecl.getName() !== fileName) varDeclarations.push(varDecl.getName());
    else {
      const initializer = varDecl.getInitializer();
      if (initializer.getKind() == SyntaxKind.ArrowFunction) {
        const arrowFunction = initializer as ArrowFunction;
        const params = arrowFunction.getParameters();
        params.forEach((param) =>
          param.forEachDescendant((desc) => {
            if (desc.getKind() == SyntaxKind.BindingElement) {
              inputProps.push(desc.getText());
            }
          })
        );
      }
    }
  });

  const functionDecs = [];

  console.log(varDeclarations);

  functions.forEach((func) => {
    if (func.getName() !== fileName) {
      functionDecs.push(func.getName());
    } else {
      // we've got the component
      const params = func.getParameters();
      params.forEach((param) =>
        param.forEachDescendant((desc) => {
          if (desc.getKind() == SyntaxKind.BindingElement) {
            inputProps.push(desc.getText());
          }
        })
      );
    }
  });

  inputProps;

  functionDecs;

  const descendant = sourceFile.getDescendantAtPos(341);

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
            // console.log(child.getText())
            childNode.getDefinitions().forEach((def) => {
              // if(childNode.getText() == "toUpperCase") {
              console.log(def.getSourceFile().getFilePath());
              // }
              if (!isInside(def.getNode())) {
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
            traversal.skip();
            return;
          }

          // case SyntaxKind.CallExpression: {
          //   let childNode = node as CallExpression;
          //   childNode.forEachDescendant(desc => {
          //     console.log(desc.getKindName())
          //     // console.log(callChild.getText())
          //     // let cChild = callChild as CallExpression
          //     // cChild.getArguments().forEach(arg => {
          //     //   console.log(arg.getText())
          //     // })
          //     // console.log(cChild.getExpression().getText())
          //     // const expression = cChild.getExpression()

          //     // console.log(JSXElement.containsRange(expression.getStart(), expression.getEnd()))
          //   })
          //   // console.log(childNode)
          //   // childNode.
          //   // console.log(childNode.getArguments().map(arg => arg))
          //   console.log(child.getText());
          //   traversal.skip();
          //   return;
          // }

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

  // project.save();
}

main();
