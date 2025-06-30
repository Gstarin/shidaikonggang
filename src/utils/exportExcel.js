import FileSaver from 'file-saver'
import * as XLSX from 'xlsx/xlsx.mjs'

export function export_excel(table_id){
    // 设置导出的内容是否只做解析，不进行格式转换     false：要解析， true:不解析
    const xlsxParam = { raw: false }
     const wb = XLSX.utils.table_to_book(document.querySelector('#'+table_id), xlsxParam)
  
    // 导出excel文件名
    let fileName = table_id + new Date().getTime() + '.xlsx'

    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'array' })
    try {
        // 下载保存文件
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName)
    } catch (e) {
        if (typeof console !== 'undefined') {
            console.log(e, wbout)
        }
    }
    return wbout
}

