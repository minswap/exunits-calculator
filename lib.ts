import * as fs from "fs";
import * as cbor from "cbor";

type Row = {
  exMem: string;
  exCPU: string;
  script: string;
};

export function printExUnitsFromTxBody(filename: string): void {
  const file = fs.readFileSync(filename, "utf-8");
  const json = JSON.parse(file);
  if (json.type !== "TxBodyAlonzo") {
    throw new Error(`Expect file type TxBodyAlonzo, get ${json.type}`);
  }
  const tx = cbor.decodeAllSync(json.cborHex);

  let totalMem = 0,
    totalCPU = 0;
  const rows: Row[] = tx[0][3].map((a: any, i: number): Row => {
    const exMem = a[3][0];
    const exCPU = a[3][1];
    totalMem += exMem;
    totalCPU += exCPU;
    return {
      exMem: exMem.toLocaleString(),
      exCPU: exCPU.toLocaleString(),
      script: `${tx[0][1][i][1].length} bytes`,
    };
  });
  rows.push({
    exMem: totalMem.toLocaleString(),
    exCPU: totalCPU.toLocaleString(),
    script: "Total",
  });
  console.table(rows);
}
