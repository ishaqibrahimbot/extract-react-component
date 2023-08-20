import * as temp from "temp";
import * as fs from "fs";
import * as path from "path";
import * as mkdirp from "mkdirp";

export function renameFileTo(oldPath, newFilename) {
  const projectPath = path.dirname(oldPath);
  const newPath = path.join(projectPath, newFilename);
  mkdirp.sync(path.dirname(newPath));
  fs.renameSync(oldPath, newPath);
  return newPath;
}

export function createTempFileWith(content, filename, extension) {
  // console.log("DIRRRR: ", __dirname);
  const info = temp.openSync({ suffix: extension });
  let filePath = info.path;
  fs.writeSync(info.fd, content);
  fs.closeSync(info.fd);
  if (filename) {
    filePath = renameFileTo(filePath, filename);
  }
  return filePath;
}

export function getFileContent(filePath) {
  return fs.readFileSync(filePath).toString();
}

export function stripWhiteSpace(content: string) {
  return content.replace(/\s*/g, "");
}

export function compareContents(
  testFilePath: string,
  referenceFilePath: string
) {
  const testFileContents = getFileContent(testFilePath);
  const referenceFileContents = getFileContent(referenceFilePath);

  return (
    stripWhiteSpace(testFileContents.toString()) ===
    stripWhiteSpace(referenceFileContents.toString())
  );
}
