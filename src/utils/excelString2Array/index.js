const regUniversalNewLine = /^(\r\n|\n\r|\r|\n)/;
const regNextCellNoQuotes = /^[^\t\r\n]+/;
const regNextEmptyCell = /^\t/;

export const excelString2Array = (str) => {
  str = str.trim();
  const arr = [[""]];
  if (str.length === 0) {
    return arr;
  }
  let column = 0;
  let row = 0;
  let lastLength;
  while (str.length > 0) {
    if (lastLength === str.length) {
      break;
    }
    lastLength = str.length;
    if (str.match(regNextEmptyCell)) {
      str = str.replace(regNextEmptyCell, "");
      column += 1;
      arr[row][column] = "";
    } else if (str.match(regUniversalNewLine)) {
      str = str.replace(regUniversalNewLine, "");
      column = 0;
      row += 1;
      arr[row] = [""];
    } else {
      let nextCell = "";
      if (str.startsWith('"')) {
        let quoteNo = 0;
        let isStillCell = true;
        while (isStillCell) {
          const nextChar = str.slice(0, 1);
          if (nextChar === '"') {
            quoteNo += 1;
          }
          nextCell += nextChar;
          str = str.slice(1);
          if (
            str.length === 0 ||
            (str.match(/^[\t\r\n]/) && quoteNo % 2 === 0)
          ) {
            isStillCell = false;
          }
        }
        nextCell = nextCell
          .replace(/^"/, "")
          .replace(/"$/, "")
          .replace(/["]*/g, (match) =>
            new Array(Math.floor(match.length / 2)).fill('"').join("")
          );
      } else {
        const matchedText = str.match(regNextCellNoQuotes);
        nextCell = matchedText ? matchedText[0] : "";
        str = str.slice(nextCell.length);
      }
      arr[row][column] = nextCell;
    }
  }
  return arr;
  /* let tableText = str;
    if (tableText.match(/"((?!")(.|\n|\t))+"/g)) {
      if (tableText.match(/"((?!")(.|\t))+\t+(^\S)*"/g)) {
        for (
          let i = 0;
          i < tableText.match(/"((?!")(.|\t))+\t+(^\S)*"/g).length;
          i++
        ) {
          tableText = tableText.replace(
            tableText.match(/"((?!")(.|\t))+\t+(^\S)*"/g)[i],
            tableText
              .match(/"((?!")(.|\t))+\t+(^\S)*"/g)
              [i].replace(/\t|\n/, "")
          );
          if (!tableText.match(/"((?!")(.|\t))+\t+(^\S)*"/g)) break;
        }
      }
      for (let i = 0; i < tableText.match(/"((?!")(.|\n))+"/g).length; i++) {
        tableText = tableText.replace(
          tableText.match(/"((?!")(.|\n))+"/g)[i],
          tableText.match(/"((?!")(.|\n))+"/g)[i].replace(/\n/g, "<br>")
        );
      }
      tableText = tableText.split("\n");
    } else {
      tableText = tableText.split("\n");
    }
    for (let i = 0; i < tableText.length; i++) {
      if (tableText[i].match(/<br>/)) {
        tableText[i] = tableText[i].replace(/<br>/g, "\n");
        tableText[i] = tableText[i].split("\t");
        for (let j = 0; j < tableText[i].length; j++) {
          if (tableText[i][j].match(/^["|'](.[\s\S]*)["|']$/g)) {
            tableText[i][j] = tableText[i][j].replace(
              /^["|'](.[\s\S]*)["|']$/g,
              "$1"
            );
          }
        }
      } else {
        tableText[i] = tableText[i].split("\t");
        for (let j = 0; j < tableText[i].length; j++) {
          if (tableText[i][j].match(/^["|'](.[\s\S]*)["|']$/g)) {
            tableText[i][j] = tableText[i][j].replace(
              /^["|'](.[\s\S]*)["|']$/g,
              "$1"
            );
          }
        }
      }
    }
    let tableArray = [...tableText];
    return tableArray; */
};
