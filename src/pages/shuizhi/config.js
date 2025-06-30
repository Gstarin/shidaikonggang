// 氨氮报表配置
export const ammoniaConfig = {
  factoryName: '污水处理厂',
  reportName: '氨氮',
  storagePrefix: 'andan',
  tableHeaders: ['位置', 'A420', '数值（mg/L）'],
  tableFields: [
    { key: 'location', editable: false },
    { key: 'a420', editable: true },
    { key: 'value', editable: true }
  ],
  defaultItems: [
    { location: "空白", a420: "", value: "" },
    { location: "厌氧池", a420: "", value: "" },
    { location: "好氧池", a420: "", value: "" },
    { location: "二沉池", a420: "", value: "" },
    { location: "出水", a420: "", value: "" },
    { location: "出水混合", a420: "", value: "" },
    { location: "进水混合", a420: "", value: "" }
  ]
};

// 出厂水报表配置
export const waterPacConfig = {
  factoryName: '地表水厂',
  reportName: '出厂水日',
  storagePrefix: 'chuchangshui',
  tableHeaders: ['序号', '项目', '单位', '检测值', '国标要求GB/T5749-2022', '评价结果'],
  tableFields: [
    { key: 'id', editable: false },
    { key: 'project', editable: false,},
    { key: 'unit', editable: false },
    { key: 'value', editable: true },
    { key: 'require', editable: false },
    { key: 'result', editable: true }
  ],
  defaultItems: [
    {id:"1",project:"浑浊度",unit:"NTU",value:"",require:"<=1",result:""},
    {id:"2",project:"色度",unit:"度",value:"",require:"<=15",result:""},
    {id:"3",project:"臭和味",unit:"-",value:"",require:"无异臭异味",result:""},
    {id:"4",project:"肉眼可见物",unit:"-",value:"",require:"无",result:""},
    {id:"5",project:"COD",unit:"mg/L",value:"",require:"<=3",result:""},
    {id:"6",project:"余氯",unit:"mg/L",value:"",require:">=0.3;<=2.0",result:""},
    {id:"7",project:"PH",unit:"-",value:"",require:">=6.5;<=8.5",result:""},
    {id:"8",project:"细菌总数",unit:"CFU/ml",value:"",require:"<=100",result:""},
    {id:"9",project:"总大肠菌群",unit:"CFU/ml",value:"",require:"不得检出",result:""},
    {id:"10",project:"耐热大肠菌群",unit:"CFU/ml",value:"",require:"不得检出",result:""}
  ]
};

// COD报表配置
export const codConfig = {
  factoryName: '污水处理厂',
  reportName: 'COD',
  storagePrefix: 'cod',
  tableHeaders: ['位置', '药剂消耗量', '数值（mg/L）'],
  tableFields: [
    { key: 'location', editable: false },
    { key: 'dosage', editable: true },
    { key: 'value', editable: true }
  ],
  defaultItems: [
    { location: "标定", dosage: "", value: "" },
    { location: "空白", dosage: "", value: "" },
    { location: "缺氧池进", dosage: "", value: "" },
    { location: "缺氧池出", dosage: "", value: "" },
    { location: "厌氧池", dosage: "", value: "" },
    { location: "二沉池", dosage: "", value: "" },
    { location: "出水", dosage: "", value: "" },
    { location: "出水混合", dosage: "", value: "" },
    { location: "标定", dosage: "", value: "" },
    { location: "空白", dosage: "", value: "" },
    { location: "进水混合", dosage: "", value: "" }
  ]
};

// MLSS 报表配置
export const mlssConfig = {
  factoryName: '污水处理厂',
  reportName: 'MLSS',
  storagePrefix: 'mlss',
  tableHeaders: ['位置', '数值'],
  tableFields: [
    { key: 'name', editable: false },
    { key: 'value', editable: true }
  ],
  defaultItems: [
    { name: "缺氧池", value: "" },
    { name: "好氧池", value: "" },
    { name: "好氧池SV30", value: "" },
    { name: "好氧池SVI", value: "" }
  ]
};

// pH 报表配置
export const phConfig = {
  factoryName: '污水处理厂',
  reportName: 'pH',
  storagePrefix: 'ph',
  tableHeaders: ['位置', '数值'],
  tableFields: [
    { key: 'location', editable: false },
    { key: 'value', editable: true }
  ],
  defaultItems: [
    { location: "进水", value: "" },
    { location: "出水", value: "" }
  ]
};

export const otherTableConfig = {
    factoryName: '污水处理厂',
    reportName: '其他报表',
    storagePrefix: 'qita',
    tableHeaders: ['位置', '氨氮（mg/L）', '硝态氮（mg/L）', '总磷（mg/L）', '总氮（mg/L）'],
    tableFields: [
        { key: 'location', editable: false },
        { key: 'a220', editable: true },
        { key: 'a275', editable: true },
        { key: 'value', editable: true },
        { key: 'dan', editable: true }
    ],
    defaultItems: [
        { location: '缺氧池进', a220: '', a275: '', value: '', dan: '' },
        { location: '缺氧池出', a220: '', a275: '', value: '', dan: '' },
        { location: '厌氧池', a220: '', a275: '', value: '', dan: '' },
        { location: '好氧池', a220: '', a275: '', value: '', dan: '' },
        { location: '二沉池', a220: '', a275: '', value: '', dan: '' },
        { location: '出水', a220: '', a275: '', value: '', dan: '' },
        { location: '进水', a220: '', a275: '', value: '', dan: '' }
    ],
};

export const nitrateNitrogenTableConfig = {
    factoryName: '污水处理厂',
    reportName: '硝态氮报表',
    storagePrefix: 'xiaotaidan',
    tableHeaders: ['位置', 'A220', 'A275', '数值（mg/L）'],
    tableFields: [
        { key: 'location', editable: false },
        { key: 'a220', editable: true },
        { key: 'a275', editable: true },
        { key: 'value', editable: true }
    ],
    defaultItems: [
        { location: '空白', a220: '', a275: '', value: '' },
        { location: '缺氧池进', a220: '', a275: '', value: '' },
        { location: '缺氧池出', a220: '', a275: '', value: '' },
        { location: '厌氧池', a220: '', a275: '', value: '' },
        { location: '好氧池', a220: '', a275: '', value: '' },
        { location: '二沉池', a220: '', a275: '', value: '' },
        { location: '出水', a220: '', a275: '', value: '' },
        { location: '出水混合', a220: '', a275: '', value: '' },
        { location: '进水混合', a220: '', a275: '', value: '' }
    ]
};

export const yuanshuiConfig = {
    factoryName: '地表水厂',
    reportName: '原水日报表',
    storagePrefix: 'yuanshui',
    tableHeaders: ['序号', '项目', '单位', '检测值'],
    tableFields: [
        { key: 'id', editable: false },
        { key: 'project', editable: false, specialDisplay: (value) => value === 'COD' ? '<span>COD</span><span class="small-text">Mn</span>' : value },
        { key: 'unit', editable: false },
        { key: 'value', editable: true }
    ],
    defaultItems: [
        { id: "1", project: "浑浊度", unit: "NTU", value: "" },
        { id: "2", project: "色度", unit: "度", value: "" },
        { id: "3", project: "臭和味", unit: "-", value: "" },
        { id: "4", project: "肉眼可见物", unit: "-", value: "" },
        { id: "5", project: "COD", unit: "mg/L", value: "" },
        { id: "6", project: "余氯", unit: "mg/L", value: "" },
        { id: "7", project: "PH", unit: "-", value: "" },
        { id: "8", project: "细菌总数", unit: "CFU/ml", value: "" },
        { id: "9", project: "总大肠菌群", unit: "CFU/ml", value: "" }
    ]
};
export const zongdanConfig = {
    factoryName: '污水处理厂',
    reportName: '总氮 报表',
    storagePrefix: 'zongdan',
    tableHeaders: ['位置', 'A220', 'A275', '数值（mg/L）'],
    tableFields: [
        { key: 'location', editable: false },
        { key: 'a220', editable: true },
        { key: 'a275', editable: true },
        { key: 'value', editable: true }
    ],
    defaultItems: [
        { location: "空白", a220: "", a275: "", value: "" },
        { location: "缺氧池进", a220: "", a275: "", value: "" },
        { location: "缺氧池出", a220: "", a275: "", value: "" },
        { location: "厌氧池", a220: "", a275: "", value: "" },
        { location: "好氧池", a220: "", a275: "", value: "" },
        { location: "二沉池", a220: "", a275: "", value: "" },
        { location: "出水", a220: "", a275: "", value: "" },
        { location: "出水混合", a220: "", a275: "", value: "" },
        { location: "进水混合", a220: "", a275: "", value: "" }
    ]
};
export const zonglinConfig = {
    factoryName: '污水处理厂',
    reportName: '总磷 报表',
    storagePrefix: 'zonglin',
    tableHeaders: ['位置', 'A720', '数值（mg/L）'],
    tableFields: [
        { key: 'location', editable: false },
        { key: 'a720', editable: true },
        { key: 'value', editable: true }
    ],
    defaultItems: [
        { location: "空白", a720: "", value: "" },
        { location: "厌氧池", a720: "", value: "" },
        { location: "好氧池", a720: "", value: "" },
        { location: "二沉池", a720: "", value: "" },
        { location: "出水", a720: "", value: "" },
        { location: "出水混合", a720: "", value: "" },
        { location: "进水混合", a720: "", value: "" }
    ]
}
