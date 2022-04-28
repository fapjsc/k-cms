import XLSX from "xlsx-js-style";

// function getFirstSheet(workbook) {
//   return workbook.Sheets[workbook.SheetNames[0]];
// }

function createHeaderStyle() {
  return {
    fill: {
      fgColor: { rgb: "FF996633" },
    },
    font: {
      color: { rgb: "FFFFEECC" },
      bold: "true",
      sz: 16,
    },
    alignment: {
      vertical: "center",
      horizontal: "center",
    },
    border: {
      top: {
        style: "thin",
        color: { rgb: "00000000" },
      },
      left: {
        style: "thin",
        color: { rgb: "00000000" },
      },
      bottom: {
        style: "thin",
        color: { rgb: "00000000" },
      },
      right: {
        style: "thin",
        color: { rgb: "00000000" },
      },
    },
  };
}

function createStyle() {
  return {
    font: {
      sz: 14,
    },
    border: {
      top: {
        style: "thin",
        color: { rgb: "00000000" },
      },
      left: {
        style: "thin",
        color: { rgb: "00000000" },
      },
      bottom: {
        style: "thin",
        color: { rgb: "00000000" },
      },
      right: {
        style: "thin",
        color: { rgb: "00000000" },
      },
    },
  };
}

function createStyle2() {
  return {
    font: {
      sz: 14,
    },
    fill: {
      fgColor: { rgb: "FFF5F0EB" },
    },
    border: {
      top: {
        style: "thin",
        color: { rgb: "00000000" },
      },
      left: {
        style: "thin",
        color: { rgb: "00000000" },
      },
      bottom: {
        style: "thin",
        color: { rgb: "00000000" },
      },
      right: {
        style: "thin",
        color: { rgb: "00000000" },
      },
    },
  };
}

function createCol(text, style) {
  return { v: text, s: style };
}

const HEADER_SAMPLE = [
  { dataIndex: "Date", text: "時間" },
  { dataIndex: "D1", text: "匯率" },
  { dataIndex: "D2", text: "總價" },
  { dataIndex: "MasterType", text: "交易類型" },
  { dataIndex: "Balance", text: "USDT" },
  { dataIndex: "Balance", text: "Balance" },
  { dataIndex: "token", text: "TOKEN" },
  { dataIndex: "Tx_HASH", text: "HASH" },
];

function createHeader(rowNo) {
  var header = HEADER_SAMPLE;
  var obj = {};
  header.forEach(function (element, i) {
    obj[c(i, rowNo)] = createCol(element.text, createHeaderStyle());
  }, this);
  return obj;
}

function fromSample(data) {
  var out = [];
  HEADER_SAMPLE.forEach(function (item, i) {
    let c;

    if (item.dataIndex === "MasterType") {
      if (data[item.dataIndex] === 0) {
        c = "買入";
      }
      if (data[item.dataIndex] === 1) {
        c = "賣出";
      }
      if (data[item.dataIndex] === 2) {
        c = "轉出";
      }
      if (data[item.dataIndex] === 3) {
        c = "轉入";
      }
    } else {
      c = data[item.dataIndex];
    }

    out.push(c);
  });
  return out;
}

function createRow(rowNo, data) {
  var out = {};
  data.forEach(function (item, i) {
    if (rowNo % 2 === 0) {
      out[c(i, rowNo)] = createCol(item, createStyle2());
    } else {
      out[c(i, rowNo)] = createCol(item, createStyle());
    }
  });
  return out;
}

function extend(target) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function (source) {
    for (var prop in source) {
      target[prop] = source[prop];
    }
  });
  return target;
}

function c(C, R) {
  return XLSX.utils.encode_cell({ c: C, r: R });
}

function createSheet(dataList) {
  var out = {};
  var header = createHeader(0);

  out = extend(out, header);

  for (var i = 0; i < dataList.length; i++) {
    out = extend(out, createRow(i + 1, fromSample(dataList[i])));
  }

  //    var range = { s: { c: 0, r: 0 }, e: { c: width, r: 10 } };
  //    out["!ref"] = XLSX.utils.encode_range(range);
  var range = { s: { c: 0, r: 0 }, e: { c: 10, r: dataList.length } };
  out["!ref"] = XLSX.utils.encode_range(range);
  out["!cols"] = [];
  //   const mini = 40;
  const small = 100;
  const middle = 160;
  const large = 300;
  const huge = 480;
  var sizes = [
    middle, // date
    small, // rate
    small, // cny
    small, // master type
    middle, // usdt
    middle, // balance
    large, // token
    huge, // hash
  ];

  sizes.forEach(function (element, i) {
    out["!cols"][i] = { wpx: element };
  }, this);
  return out;
}

function createBook(data, sheetName) {
  return {
    SheetNames: [sheetName],
    Sheets: {
      [`${sheetName}`]: createSheet(data),
    },
  };
}

//スタイルの書き方は下記参照
//https://github.com/protobi/js-xlsx

function writeData(filename, data, sheetName) {
  var workbook = createBook(data, sheetName);
  //var defaultCellStyle = { font: { name: "Verdana", sz: 11, color: "FF00FF88"}, fill: {fgColor: {rgb: "FFFFAA00"}}};
  var defaultCellStyle = {};
  var options = {
    defaultCellStyle: defaultCellStyle,
    bookType: "xlsx",
    bookSST: false,
  };

  XLSX.writeFile(workbook, filename, options);
}

// function readData(fileName) {
//   var options = {
//     cellStyles: true,
//   };
//   var workbook = XLSX.readFile(fileName, options);
//   return XLSX.utils.sheet_to_json(getFirstSheet(workbook));
// }

//writeData("out.xlsx");
//fs.writeFileSync("out.json", JSON.stringify(data), "utf-8");

// module.exports = {
//   readData: readData,
//   writeData: writeData,
// };

export default writeData;
