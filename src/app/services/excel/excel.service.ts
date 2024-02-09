import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  public async exportAsExcelFile(workbookData: any[], excelFileName: string) {
    const workbook = new ExcelJS.Workbook();

    workbookData.forEach(({ workSheet, rows }) => {
      const sheet: any = workbook.addWorksheet(workSheet);
      const uniqueHeaders = [
        ...new Set(
          rows.reduce(
            (prev: any, next: {}) => [...prev, ...Object.keys(next)],
            []
          )
        ),
      ];
      sheet.columns = uniqueHeaders.map((x) => ({ header: x, key: x }));

      rows.forEach((jsonRow: any, i: any) => {
        let cellValues = { ...jsonRow };

        uniqueHeaders.forEach((header: any, j) => {
          if (Array.isArray(jsonRow[header])) {
            cellValues[header] = '';
          }
        });
        sheet.addRow(cellValues);
        uniqueHeaders.forEach((header: any, j) => {
          if (Array.isArray(jsonRow[header])) {
            const jsonDropdown = jsonRow[header];
            sheet.getCell(
              this.getSpreadSheetCellNumber(i + 1, j)
            ).dataValidation = {
              type: 'list',
              formulae: [`"${jsonDropdown.join(',')}"`],
            };
          }
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    this.saveAsExcelFile(buffer, excelFileName);
  }

  private getSpreadSheetCellNumber(row: any, column: any) {
    let result = '';
    let n = column;
    while (n >= 0) {
      result = String.fromCharCode((n % 26) + 65) + result;
      n = Math.floor(n / 26) - 1;
    }
    result += `${row + 1}`;
    return result;
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
