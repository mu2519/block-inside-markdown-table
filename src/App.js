import './App.css';
import "github-markdown-css";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function App() {
  // States
  const [data, setData] = useState([
    ["```javascript\nlet x = 3;\nconcole.log(x);\n```", "- apple\n- banana\n- pen", "My favorite food:\n1. sushi\n   1. maguro\n   2. ebi\n2. steak"],
    ["", "", ""]
  ]);

  const [rowHeight, setRowHeight] = useState(10);
  const [columnWidth, setColumnWidth] = useState(20);

  const [rowNum, setRowNum] = useState(2);
  const [colNum, setColNum] = useState(3);

  // Event hanlders

  function handleRowNum(e) {
    const nextRowNum = Math.max(e.target.value, 1);
    setRowNum(nextRowNum);
    if (nextRowNum > rowNum) {
      const nextData = [];
      for (let i = 0; i < rowNum; i++) {
        nextData[i] = [];
        for (let j = 0; j < colNum; j++) {
          nextData[i][j] = data[i][j];
        }
      }
      for (let i = rowNum; i < nextRowNum; i++) {
        nextData[i] = [];
        for (let j = 0; j < colNum; j++) {
          nextData[i][j] = "";
        }
      }
      setData(nextData);
    } else if (nextRowNum < rowNum) {
      const nextData = [];
      for (let i = 0; i < nextRowNum; i++) {
        nextData[i] = [];
        for (let j = 0; j < colNum; j++) {
          nextData[i][j] = data[i][j];
        }
      }
      setData(nextData);
    }
  }

  function handleColNum(e) {
    const nextColNum = Math.max(e.target.value, 1);
    setColNum(nextColNum);
    if (nextColNum > colNum) {
      const nextData = [];
      for (let i = 0; i < rowNum; i++) {
        nextData[i] = [];
        for (let j = 0; j < colNum; j++) {
          nextData[i][j] = data[i][j];
        }
        for (let j = colNum; j < nextColNum; j++) {
          nextData[i][j] = "";
        }
      }
      setData(nextData);
    } else if (nextColNum < colNum) {
      const nextData = [];
      for (let i = 0; i < rowNum; i++) {
        nextData[i] = [];
        for (let j = 0; j < nextColNum; j++) {
          nextData[i][j] = data[i][j];
        }
      }
      setData(nextData);
    }
  }

  function makeHandler(rowIdx, colIdx) {
    return function (e) {
      const nextData = [];
      for (let i = 0; i < rowNum; i++) {
        nextData[i] = [];
        for (let j = 0; j < colNum; j++) {
          nextData[i][j] =
            i === rowIdx && j === colIdx ? e.target.value : data[i][j];
        }
      }
      setData(nextData);
    };
  }

  let code = "";
  code += "<table>";
  code += data.reduce(
    (acc, row) =>
      acc +
      "\n<tr>" +
      row.reduce((acc2, cell) => acc2 + "\n<td>\n\n" + cell + "\n\n</td>", "") +
      "\n</tr>\n\n",
    ""
  );
  code = code.slice(0, -1);
  code += "</table>";

  return (
    <div className="App">
      <div>
        <div className='centered'>
          <div id="container">
            <div id="item1">
              <label>
                The number of rows: <input type="number" value={rowNum} onChange={handleRowNum} />
              </label>
            </div>
            <div id="item2">
              <label>
                The number of columns: <input type="number" value={colNum} onChange={handleColNum} />
              </label>
            </div>
            <div id="item3">
              <label>
                The height of a row: <input type="number" value={rowHeight} onChange={(e) => setRowHeight(e.target.value)} />
              </label>
            </div>
            <div id="item4">
              <label>
                The width of a column: <input type="number" value={columnWidth} onChange={(e) => setColumnWidth(e.target.value)} />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className='centered'>
          <table>
            <tbody>
              {data.map((row, rowIdx) => (
                <tr>
                  {row.map((cell, colIdx) => (
                    <td>
                      <textarea
                        rows={rowHeight}
                        cols={columnWidth}
                        value={cell}
                        onChange={makeHandler(rowIdx, colIdx)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='markdown-body'>
        <div className='centered'>
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <Prism
                    {...props}
                    children={String(children).replace(/\n$/, "")}
                    style={dark}
                    language={match[1]}
                    PreTag="div"
                  />
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {code}
          </ReactMarkdown>
        </div>
      </div>
      <div>
        <div className='centered'>
          <div>
            <textarea rows={10} cols={20} value={code} readOnly />
          </div>
          <div>
            <button
              onClick={() =>
                navigator.clipboard.writeText(code).then(
                  () => alert("Successfully copied"),
                  () => alert("Failed to copy")
                )
              }
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
