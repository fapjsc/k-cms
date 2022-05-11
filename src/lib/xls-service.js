import XLSX from "xlsx-js-style";

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

function createStyle(item) {
  let color;

  switch (item) {
    case "賣出":
      color = "F54F2D";
      break;

    case "買入":
      color = "2152F5";
      break;

    case "轉入":
      color = "AF21F5";
      break;

    case "轉出":
      color = "AF21F5";
      break;

    default:
      break;
  }

  return {
    font: {
      sz: 14,
      color: { rgb: color },
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

function evenRowStyle(item) {
  const styles = createStyle(item);
  return {
    ...styles,
    fill: {
      fgColor: { rgb: "FFF5F0EB" },
    },
  };
}

function createCol(text, style) {
  return { v: text, s: style };
}

const HEADER_SAMPLE = [
  { dataIndex: "Date", text: "交易時間" },
  { dataIndex: "MasterType", text: "交易類型" },
  { dataIndex: "D1", text: "匯率" },
  { dataIndex: "D2", text: "RMB" },
  { dataIndex: "UsdtAmt", text: "USDT" },
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

    switch (item.dataIndex) {
      case "MasterType":
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
        break;

      case "UsdtAmt":
        c = data[item.dataIndex]?.toLocaleString();
        break;

      case "D2":
        c = data[item.dataIndex]?.toLocaleString();
        break;

      case "Balance":
        c = data[item.dataIndex]?.toLocaleString();
        break;

      default:
        c = data[item.dataIndex];
        break;
    }

    out.push(c);
  });
  return out;
}

function createRow(rowNo, data) {
  var out = {};
  data.forEach(function (item, i) {
    if (rowNo % 2 === 0) {
      out[c(i, rowNo)] = createCol(item, evenRowStyle(item));
    } else {
      out[c(i, rowNo)] = createCol(item, createStyle(item));
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

// 拿到單元格的值
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
    small, // master type
    small, // rate
    small, // cny
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

export default writeData;
