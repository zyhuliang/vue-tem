module.exports = {
  newName: "标准转换",
  inputData: [
    {
      id: "input",
      fields: [
        {
          column: "MZBZXX0101",
          alias: ""
        },
        {
          column: "MZBZXX0102",
          alias: ""
        },
        {
          column: "MZBZXX0104",
          alias: ""
        },
        {
          column: "MZBZXX0105",
          alias: ""
        },
        {
          column: "MZBZXX0106",
          alias: ""
        },
        {
          column: "MZBZXX0107",
          alias: ""
        },
        {
          column: "MZBZXX0109",
          alias: ""
        },
        {
          column: "MZBZXX0110",
          alias: ""
        },
        {
          column: "MZBZXX0111",
          alias: ""
        },
        {
          column: "MZBZXX0112",
          alias: ""
        },
        {
          column: "MZBZXX0114",
          alias: ""
        },
        {
          column: "MZBZXX0115",
          alias: ""
        },
        {
          column: "MZBZXX0116",
          alias: ""
        },
        {
          column: "MZBZXX0117",
          alias: ""
        },
        {
          column: "MZBZXX0118",
          alias: ""
        },
        {
          column: "MZBZXX0119",
          alias: ""
        },
        {
          column: "MZBZXX0120",
          alias: ""
        },
        {
          column: "MZBZXX0121",
          alias: ""
        },
        {
          column: "MZBZXX0122",
          alias: ""
        },
        {
          column: "MZBZXX0124",
          alias: ""
        },
        {
          column: "MZBZXX0125",
          alias: ""
        },
        {
          column: "MZBZXX0126",
          alias: ""
        },
        {
          column: "MZBZXX0127",
          alias: ""
        },
        {
          column: "MZBZXX0128",
          alias: ""
        },
        {
          column: "MZBZXX0129",
          alias: ""
        },
        {
          column: "MZBZXX0130",
          alias: ""
        },
        {
          column: "MZBZXX0131",
          alias: ""
        },
        {
          column: "MZBZXX0132",
          alias: ""
        },
        {
          column: "MZBZXX0133",
          alias: ""
        },
        {
          column: "MZBZXX0134",
          alias: ""
        },
        {
          column: "MZBZXX0135",
          alias: ""
        },
        {
          column: "MZBZXX0136",
          alias: ""
        },
        {
          column: "MZBZXX0137",
          alias: ""
        },
        {
          column: "MZBZXX0138",
          alias: ""
        },
        {
          column: "MZBZXX0139",
          alias: ""
        },
        {
          column: "MZBZXX0140",
          alias: ""
        },
        {
          column: "inserttime",
          alias: ""
        }
      ]
    }
  ],
  outputData: [],
  nodeSetTab: [
    {
      title: "输入（类型转换和新增字段）",
      name: "input",
      icon: "fa fa-sign-in"
    },
    {
      title: "参数",
      name: "parameter",
      icon: "fa fa-gear"
    },
    {
      title: "输出",
      name: "output",
      icon: "fa fa-sign-out"
    }
  ],
  thisNodeData: {
    id: "transform_1",
    name: "标准转换",
    type: "transform",
    x: 856,
    y: 123,
    otherConfigurations: {
      sessionCache: "",
      interceptor: "",
      expressions: [
        "lookupInStandard('证件类别_殡葬信息系统',MZBZXX0102,'') as MZBZXX0103",
        "lookupInStandard('性别__殡葬信息系统',MZBZXX0107,'') as MZBZXX0108",
        "lookupInStandard('民族_社会救助管理平台',MZBZXX0112,'') as MZBZXX0113",
        "lookupInStandard('区县_殡葬信息系统',MZBZXX0122,'') as MZBZXX0123"
      ]
    },
    inputConfigurations: [
      {
        id: "input",
        fields: [
          {
            column: "MZBZXX0101",
            alias: ""
          },
          {
            column: "MZBZXX0102",
            alias: ""
          },
          {
            column: "MZBZXX0104",
            alias: ""
          },
          {
            column: "MZBZXX0105",
            alias: ""
          },
          {
            column: "MZBZXX0106",
            alias: ""
          },
          {
            column: "MZBZXX0107",
            alias: ""
          },
          {
            column: "MZBZXX0109",
            alias: ""
          },
          {
            column: "MZBZXX0110",
            alias: ""
          },
          {
            column: "MZBZXX0111",
            alias: ""
          },
          {
            column: "MZBZXX0112",
            alias: ""
          },
          {
            column: "MZBZXX0114",
            alias: ""
          },
          {
            column: "MZBZXX0115",
            alias: ""
          },
          {
            column: "MZBZXX0116",
            alias: ""
          },
          {
            column: "MZBZXX0117",
            alias: ""
          },
          {
            column: "MZBZXX0118",
            alias: ""
          },
          {
            column: "MZBZXX0119",
            alias: ""
          },
          {
            column: "MZBZXX0120",
            alias: ""
          },
          {
            column: "MZBZXX0121",
            alias: ""
          },
          {
            column: "MZBZXX0122",
            alias: ""
          },
          {
            column: "MZBZXX0124",
            alias: ""
          },
          {
            column: "MZBZXX0125",
            alias: ""
          },
          {
            column: "MZBZXX0126",
            alias: ""
          },
          {
            column: "MZBZXX0127",
            alias: ""
          },
          {
            column: "MZBZXX0128",
            alias: ""
          },
          {
            column: "MZBZXX0129",
            alias: ""
          },
          {
            column: "MZBZXX0130",
            alias: ""
          },
          {
            column: "MZBZXX0131",
            alias: ""
          },
          {
            column: "MZBZXX0132",
            alias: ""
          },
          {
            column: "MZBZXX0133",
            alias: ""
          },
          {
            column: "MZBZXX0134",
            alias: ""
          },
          {
            column: "MZBZXX0135",
            alias: ""
          },
          {
            column: "MZBZXX0136",
            alias: ""
          },
          {
            column: "MZBZXX0137",
            alias: ""
          },
          {
            column: "MZBZXX0138",
            alias: ""
          },
          {
            column: "MZBZXX0139",
            alias: ""
          },
          {
            column: "MZBZXX0140",
            alias: ""
          },
          {
            column: "inserttime",
            alias: ""
          }
        ]
      }
    ],
    outputConfigurations: [
      {
        id: "output",
        fields: [
          {
            column: "MZBZXX0101",
            alias: ""
          },
          {
            column: "MZBZXX0102",
            alias: ""
          },
          {
            column: "MZBZXX0104",
            alias: ""
          },
          {
            column: "MZBZXX0105",
            alias: ""
          },
          {
            column: "MZBZXX0106",
            alias: ""
          },
          {
            column: "MZBZXX0107",
            alias: ""
          },
          {
            column: "MZBZXX0109",
            alias: ""
          },
          {
            column: "MZBZXX0110",
            alias: ""
          },
          {
            column: "MZBZXX0111",
            alias: ""
          },
          {
            column: "MZBZXX0112",
            alias: ""
          },
          {
            column: "MZBZXX0114",
            alias: ""
          },
          {
            column: "MZBZXX0115",
            alias: ""
          },
          {
            column: "MZBZXX0116",
            alias: ""
          },
          {
            column: "MZBZXX0117",
            alias: ""
          },
          {
            column: "MZBZXX0118",
            alias: ""
          },
          {
            column: "MZBZXX0119",
            alias: ""
          },
          {
            column: "MZBZXX0120",
            alias: ""
          },
          {
            column: "MZBZXX0121",
            alias: ""
          },
          {
            column: "MZBZXX0122",
            alias: ""
          },
          {
            column: "MZBZXX0124",
            alias: ""
          },
          {
            column: "MZBZXX0125",
            alias: ""
          },
          {
            column: "MZBZXX0126",
            alias: ""
          },
          {
            column: "MZBZXX0127",
            alias: ""
          },
          {
            column: "MZBZXX0128",
            alias: ""
          },
          {
            column: "MZBZXX0129",
            alias: ""
          },
          {
            column: "MZBZXX0130",
            alias: ""
          },
          {
            column: "MZBZXX0131",
            alias: ""
          },
          {
            column: "MZBZXX0132",
            alias: ""
          },
          {
            column: "MZBZXX0133",
            alias: ""
          },
          {
            column: "MZBZXX0134",
            alias: ""
          },
          {
            column: "MZBZXX0135",
            alias: ""
          },
          {
            column: "MZBZXX0136",
            alias: ""
          },
          {
            column: "MZBZXX0137",
            alias: ""
          },
          {
            column: "MZBZXX0138",
            alias: ""
          },
          {
            column: "MZBZXX0139",
            alias: ""
          },
          {
            column: "MZBZXX0140",
            alias: ""
          },
          {
            column: "inserttime",
            alias: ""
          },
          {
            column: "MZBZXX0103",
            alias: ""
          },
          {
            column: "MZBZXX0108",
            alias: ""
          },
          {
            column: "MZBZXX0113",
            alias: ""
          },
          {
            column: "MZBZXX0123",
            alias: ""
          }
        ]
      }
    ]
  },
  nodeLine: {
    inputLine: [
      {
        lineNameSource: "transform_7"
      }
    ],
    outputLine: [
      {
        lineNameTarget: "transform_10"
      },
      {
        lineNameTarget: "sink_8"
      }
    ]
  },
  datasetType: "",
  flowData: {
    id: "0ae8236f-5f77-4788-b462-3e966090f786",
    name: "殡仪服务数据融合",
    flowType: "dataflow",
    steps: [
      {
        id: "join_6",
        name: "join_6",
        type: "join",
        x: 260,
        y: 166,
        otherConfigurations: {
          joinType: "left_outer",
          sessionCache: "",
          interceptor: "",
          joinConditions: [
            {
              leftColumn: "BUSINESSID",
              op: "=",
              rightColumn: "BUSINESSID"
            }
          ]
        },
        inputConfigurations: [
          {
            id: "left",
            fields: [
              {
                column: "CREMATORID",
                alias: ""
              },
              {
                column: "INCINERATEMAN",
                alias: ""
              },
              {
                column: "WHEINTUITION",
                alias: ""
              },
              {
                column: "WHEPICKASH",
                alias: ""
              },
              {
                column: "WHEADVANCE",
                alias: ""
              },
              {
                column: "TAKEGRAYTIME",
                alias: ""
              },
              {
                column: "ASHGOTO",
                alias: ""
              },
              {
                column: "FAMILYSIGN",
                alias: ""
              },
              {
                column: "RELATIONSHIP",
                alias: ""
              },
              {
                column: "SIGNERTEL",
                alias: ""
              },
              {
                column: "SIGNERCAEDID",
                alias: ""
              },
              {
                column: "MANAGER",
                alias: ""
              },
              {
                column: "FUNERALID",
                alias: ""
              },
              {
                column: "FUNERALNAME",
                alias: ""
              },
              {
                column: "REMARKS",
                alias: ""
              },
              {
                column: "ADDER",
                alias: ""
              },
              {
                column: "ADDERID",
                alias: ""
              },
              {
                column: "ADDUNIT",
                alias: ""
              },
              {
                column: "ADDUNITID",
                alias: ""
              },
              {
                column: "ADDTIME",
                alias: ""
              },
              {
                column: "DELFLAG",
                alias: ""
              },
              {
                column: "INCINERATECERTTIME",
                alias: ""
              },
              {
                column: "SIGNERCARDTYPE",
                alias: ""
              },
              {
                column: "ID",
                alias: ""
              },
              {
                column: "INCINERATENO",
                alias: ""
              },
              {
                column: "INCINERATETIME",
                alias: ""
              },
              {
                column: "BUSINESSID",
                alias: ""
              }
            ]
          },
          {
            id: "right",
            fields: [
              {
                column: "BUSINESSID",
                alias: ""
              },
              {
                column: "FUNERALID",
                alias: ""
              },
              {
                column: "FUNERALNAME",
                alias: ""
              },
              {
                column: "DEADNO",
                alias: ""
              },
              {
                column: "CORPSETYPR",
                alias: ""
              },
              {
                column: "DEADNAME",
                alias: ""
              },
              {
                column: "CARDTYPE",
                alias: ""
              },
              {
                column: "CARDNO",
                alias: ""
              },
              {
                column: "GENDER",
                alias: ""
              },
              {
                column: "AGE",
                alias: ""
              },
              {
                column: "NATION",
                alias: ""
              },
              {
                column: "DEATHTYPE",
                alias: ""
              },
              {
                column: "DEADSTATE",
                alias: ""
              },
              {
                column: "DEADTIME",
                alias: ""
              },
              {
                column: "DEADPLACE",
                alias: ""
              },
              {
                column: "ADDRESS",
                alias: ""
              },
              {
                column: "DEATHCERTIFYNO",
                alias: ""
              },
              {
                column: "ISSUEUNIT",
                alias: ""
              },
              {
                column: "DEATHCERTIFYTYPE",
                alias: ""
              },
              {
                column: "DEATHCERTIFYANNEX",
                alias: ""
              },
              {
                column: "CREMCERTIFYNO",
                alias: ""
              },
              {
                column: "CREMCERTIFYANNEX",
                alias: ""
              },
              {
                column: "CONTACTNAME",
                alias: ""
              },
              {
                column: "RELATIONSHIP",
                alias: ""
              },
              {
                column: "CONTACTPHONE",
                alias: ""
              },
              {
                column: "CONTACTTEL",
                alias: ""
              },
              {
                column: "CONTACTADDRESS",
                alias: ""
              },
              {
                column: "CONTACTID",
                alias: ""
              },
              {
                column: "COPYIDANNEX",
                alias: ""
              },
              {
                column: "UNITNAME",
                alias: ""
              },
              {
                column: "UNITPHONE",
                alias: ""
              },
              {
                column: "UNITADDRESS",
                alias: ""
              },
              {
                column: "REMARKS",
                alias: ""
              },
              {
                column: "ADDER",
                alias: ""
              },
              {
                column: "ADDERID",
                alias: ""
              },
              {
                column: "ADDUNIT",
                alias: ""
              },
              {
                column: "ADDUNITID",
                alias: ""
              },
              {
                column: "ADDTIME",
                alias: ""
              },
              {
                column: "DELFLAG",
                alias: ""
              },
              {
                column: "STREET",
                alias: ""
              },
              {
                column: "COUNTY",
                alias: ""
              },
              {
                column: "REGISTERFLAG",
                alias: ""
              },
              {
                column: "COUNTRY",
                alias: ""
              },
              {
                column: "PROVINCE",
                alias: ""
              },
              {
                column: "CITY",
                alias: ""
              },
              {
                column: "ARRIVE",
                alias: ""
              },
              {
                column: "HOUSEPROVINCE",
                alias: ""
              },
              {
                column: "HOUSECITY",
                alias: ""
              },
              {
                column: "HOUSECOUNTY",
                alias: ""
              },
              {
                column: "CARDNOINSTRUCTION",
                alias: ""
              },
              {
                column: "BIRTHDATE",
                alias: ""
              },
              {
                column: "ISSUEDATE",
                alias: ""
              },
              {
                column: "PREFERENTIALTYPE",
                alias: ""
              },
              {
                column: "ISMEMBER",
                alias: ""
              },
              {
                column: "CONTACTCARDTYPE",
                alias: ""
              },
              {
                column: "DEADPIC",
                alias: ""
              }
            ]
          }
        ],
        outputConfigurations: [
          {
            id: "output",
            fields: [
              {
                column: "left_CREMATORID",
                alias: "CREMATORID"
              },
              {
                column: "left_INCINERATEMAN",
                alias: "INCINERATEMAN"
              },
              {
                column: "left_WHEINTUITION",
                alias: "WHEINTUITION"
              },
              {
                column: "left_WHEPICKASH",
                alias: "WHEPICKASH"
              },
              {
                column: "left_WHEADVANCE",
                alias: "WHEADVANCE"
              },
              {
                column: "left_TAKEGRAYTIME",
                alias: "TAKEGRAYTIME"
              },
              {
                column: "left_ASHGOTO",
                alias: "ASHGOTO"
              },
              {
                column: "left_FAMILYSIGN",
                alias: "FAMILYSIGN"
              },
              {
                column: "left_RELATIONSHIP",
                alias: "left_RELATIONSHIP"
              },
              {
                column: "left_SIGNERTEL",
                alias: "SIGNERTEL"
              },
              {
                column: "left_SIGNERCAEDID",
                alias: "SIGNERCAEDID"
              },
              {
                column: "left_MANAGER",
                alias: "MANAGER"
              },
              {
                column: "left_FUNERALID",
                alias: "left_FUNERALID"
              },
              {
                column: "left_FUNERALNAME",
                alias: "left_FUNERALNAME"
              },
              {
                column: "left_REMARKS",
                alias: "left_REMARKS"
              },
              {
                column: "left_ADDER",
                alias: "left_ADDER"
              },
              {
                column: "left_ADDERID",
                alias: "left_ADDERID"
              },
              {
                column: "left_ADDUNIT",
                alias: "left_ADDUNIT"
              },
              {
                column: "left_ADDUNITID",
                alias: "left_ADDUNITID"
              },
              {
                column: "left_ADDTIME",
                alias: "left_ADDTIME"
              },
              {
                column: "left_DELFLAG",
                alias: "left_DELFLAG"
              },
              {
                column: "left_INCINERATECERTTIME",
                alias: "INCINERATECERTTIME"
              },
              {
                column: "left_SIGNERCARDTYPE",
                alias: "SIGNERCARDTYPE"
              },
              {
                column: "left_ID",
                alias: "ID"
              },
              {
                column: "left_INCINERATENO",
                alias: "INCINERATENO"
              },
              {
                column: "left_INCINERATETIME",
                alias: "INCINERATETIME"
              },
              {
                column: "left_BUSINESSID",
                alias: "left_BUSINESSID"
              },
              {
                column: "right_BUSINESSID",
                alias: "right_BUSINESSID"
              },
              {
                column: "right_FUNERALID",
                alias: "FUNERALID"
              },
              {
                column: "right_FUNERALNAME",
                alias: "FUNERALNAME"
              },
              {
                column: "right_DEADNO",
                alias: "DEADNO"
              },
              {
                column: "right_CORPSETYPR",
                alias: "CORPSETYPR"
              },
              {
                column: "right_DEADNAME",
                alias: "DEADNAME"
              },
              {
                column: "right_CARDTYPE",
                alias: "CARDTYPE"
              },
              {
                column: "right_CARDNO",
                alias: "CARDNO"
              },
              {
                column: "right_GENDER",
                alias: "GENDER"
              },
              {
                column: "right_AGE",
                alias: "AGE"
              },
              {
                column: "right_NATION",
                alias: "NATION"
              },
              {
                column: "right_DEATHTYPE",
                alias: "DEATHTYPE"
              },
              {
                column: "right_DEADSTATE",
                alias: "DEADSTATE"
              },
              {
                column: "right_DEADTIME",
                alias: "DEADTIME"
              },
              {
                column: "right_DEADPLACE",
                alias: "DEADPLACE"
              },
              {
                column: "right_ADDRESS",
                alias: "ADDRESS"
              },
              {
                column: "right_DEATHCERTIFYNO",
                alias: "DEATHCERTIFYNO"
              },
              {
                column: "right_ISSUEUNIT",
                alias: "ISSUEUNIT"
              },
              {
                column: "right_DEATHCERTIFYTYPE",
                alias: "DEATHCERTIFYTYPE"
              },
              {
                column: "right_DEATHCERTIFYANNEX",
                alias: "DEATHCERTIFYANNEX"
              },
              {
                column: "right_CREMCERTIFYNO",
                alias: "CREMCERTIFYNO"
              },
              {
                column: "right_CREMCERTIFYANNEX",
                alias: "CREMCERTIFYANNEX"
              },
              {
                column: "right_CONTACTNAME",
                alias: "CONTACTNAME"
              },
              {
                column: "right_RELATIONSHIP",
                alias: "RELATIONSHIP"
              },
              {
                column: "right_CONTACTPHONE",
                alias: "CONTACTPHONE"
              },
              {
                column: "right_CONTACTTEL",
                alias: "CONTACTTEL"
              },
              {
                column: "right_CONTACTADDRESS",
                alias: "CONTACTADDRESS"
              },
              {
                column: "right_CONTACTID",
                alias: "CONTACTID"
              },
              {
                column: "right_COPYIDANNEX",
                alias: "COPYIDANNEX"
              },
              {
                column: "right_UNITNAME",
                alias: "UNITNAME"
              },
              {
                column: "right_UNITPHONE",
                alias: "UNITPHONE"
              },
              {
                column: "right_UNITADDRESS",
                alias: "UNITADDRESS"
              },
              {
                column: "right_REMARKS",
                alias: "REMARKS"
              },
              {
                column: "right_ADDER",
                alias: "ADDER"
              },
              {
                column: "right_ADDERID",
                alias: "ADDERID"
              },
              {
                column: "right_ADDUNIT",
                alias: "ADDUNIT"
              },
              {
                column: "right_ADDUNITID",
                alias: "ADDUNITID"
              },
              {
                column: "right_ADDTIME",
                alias: "ADDTIME"
              },
              {
                column: "right_DELFLAG",
                alias: "DELFLAG"
              },
              {
                column: "right_STREET",
                alias: "STREET"
              },
              {
                column: "right_COUNTY",
                alias: "COUNTY"
              },
              {
                column: "right_REGISTERFLAG",
                alias: "REGISTERFLAG"
              },
              {
                column: "right_COUNTRY",
                alias: "COUNTRY"
              },
              {
                column: "right_PROVINCE",
                alias: "PROVINCE"
              },
              {
                column: "right_CITY",
                alias: "CITY"
              },
              {
                column: "right_ARRIVE",
                alias: "ARRIVE"
              },
              {
                column: "right_HOUSEPROVINCE",
                alias: "HOUSEPROVINCE"
              },
              {
                column: "right_HOUSECITY",
                alias: "HOUSECITY"
              },
              {
                column: "right_HOUSECOUNTY",
                alias: "HOUSECOUNTY"
              },
              {
                column: "right_CARDNOINSTRUCTION",
                alias: "CARDNOINSTRUCTION"
              },
              {
                column: "right_BIRTHDATE",
                alias: "BIRTHDATE"
              },
              {
                column: "right_ISSUEDATE",
                alias: "ISSUEDATE"
              },
              {
                column: "right_PREFERENTIALTYPE",
                alias: "PREFERENTIALTYPE"
              },
              {
                column: "right_ISMEMBER",
                alias: "ISMEMBER"
              },
              {
                column: "right_CONTACTCARDTYPE",
                alias: "CONTACTCARDTYPE"
              },
              {
                column: "right_DEADPIC",
                alias: "DEADPIC"
              }
            ]
          }
        ]
      },
      {
        id: "transform_7",
        name: "类型转换和新增字段",
        type: "transform",
        x: 604,
        y: 72,
        otherConfigurations: {
          sessionCache: "",
          interceptor: "",
          expressions: [
            "cast(CARDTYPE as string) as MZBZXX0102",
            "case CARDTYPE when '1' then MZBZXX0104 else '' end as MZBZXX0105",
            "cast(GENDER as string) as MZBZXX0107",
            "cast(NATION as string) as MZBZXX0112",
            "'' as MZBZXX0116",
            "cast(CITY as string) as MZBZXX0122",
            "'' as MZBZXX0124",
            "'' as MZBZXX0125",
            "'' as MZBZXX0126",
            "'' as MZBZXX0127",
            "MZBZXX0121 as MZBZXX0128",
            "'' as MZBZXX0130",
            "'' as MZBZXX0131",
            "'' as MZBZXX0132",
            "'' as MZBZXX0133",
            "'' as MZBZXX0134",
            "'' as MZBZXX0135",
            "'' as MZBZXX0136",
            "'' as MZBZXX0137",
            "'' as MZBZXX0138",
            "'' as MZBZXX0139",
            "current_timestamp() as inserttime"
          ]
        },
        inputConfigurations: [
          {
            id: "input",
            fields: [
              {
                column: "CREMATORID",
                alias: ""
              },
              {
                column: "INCINERATEMAN",
                alias: ""
              },
              {
                column: "WHEINTUITION",
                alias: ""
              },
              {
                column: "WHEPICKASH",
                alias: ""
              },
              {
                column: "WHEADVANCE",
                alias: ""
              },
              {
                column: "TAKEGRAYTIME",
                alias: ""
              },
              {
                column: "ASHGOTO",
                alias: ""
              },
              {
                column: "FAMILYSIGN",
                alias: ""
              },
              {
                column: "left_RELATIONSHIP",
                alias: ""
              },
              {
                column: "SIGNERTEL",
                alias: ""
              },
              {
                column: "SIGNERCAEDID",
                alias: ""
              },
              {
                column: "MANAGER",
                alias: ""
              },
              {
                column: "left_FUNERALID",
                alias: ""
              },
              {
                column: "left_FUNERALNAME",
                alias: ""
              },
              {
                column: "left_REMARKS",
                alias: ""
              },
              {
                column: "left_ADDER",
                alias: ""
              },
              {
                column: "left_ADDERID",
                alias: ""
              },
              {
                column: "left_ADDUNIT",
                alias: ""
              },
              {
                column: "left_ADDUNITID",
                alias: ""
              },
              {
                column: "left_ADDTIME",
                alias: ""
              },
              {
                column: "left_DELFLAG",
                alias: ""
              },
              {
                column: "INCINERATECERTTIME",
                alias: ""
              },
              {
                column: "SIGNERCARDTYPE",
                alias: ""
              },
              {
                column: "ID",
                alias: ""
              },
              {
                column: "INCINERATENO",
                alias: ""
              },
              {
                column: "INCINERATETIME",
                alias: ""
              },
              {
                column: "left_BUSINESSID",
                alias: ""
              },
              {
                column: "right_BUSINESSID",
                alias: ""
              },
              {
                column: "FUNERALID",
                alias: ""
              },
              {
                column: "FUNERALNAME",
                alias: ""
              },
              {
                column: "DEADNO",
                alias: ""
              },
              {
                column: "CORPSETYPR",
                alias: ""
              },
              {
                column: "DEADNAME",
                alias: ""
              },
              {
                column: "CARDTYPE",
                alias: ""
              },
              {
                column: "CARDNO",
                alias: ""
              },
              {
                column: "GENDER",
                alias: ""
              },
              {
                column: "AGE",
                alias: ""
              },
              {
                column: "NATION",
                alias: ""
              },
              {
                column: "DEATHTYPE",
                alias: ""
              },
              {
                column: "DEADSTATE",
                alias: ""
              },
              {
                column: "DEADTIME",
                alias: ""
              },
              {
                column: "DEADPLACE",
                alias: ""
              },
              {
                column: "ADDRESS",
                alias: ""
              },
              {
                column: "DEATHCERTIFYNO",
                alias: ""
              },
              {
                column: "ISSUEUNIT",
                alias: ""
              },
              {
                column: "DEATHCERTIFYTYPE",
                alias: ""
              },
              {
                column: "DEATHCERTIFYANNEX",
                alias: ""
              },
              {
                column: "CREMCERTIFYNO",
                alias: ""
              },
              {
                column: "CREMCERTIFYANNEX",
                alias: ""
              },
              {
                column: "CONTACTNAME",
                alias: ""
              },
              {
                column: "RELATIONSHIP",
                alias: ""
              },
              {
                column: "CONTACTPHONE",
                alias: ""
              },
              {
                column: "CONTACTTEL",
                alias: ""
              },
              {
                column: "CONTACTADDRESS",
                alias: ""
              },
              {
                column: "CONTACTID",
                alias: ""
              },
              {
                column: "COPYIDANNEX",
                alias: ""
              },
              {
                column: "UNITNAME",
                alias: ""
              },
              {
                column: "UNITPHONE",
                alias: ""
              },
              {
                column: "UNITADDRESS",
                alias: ""
              },
              {
                column: "REMARKS",
                alias: ""
              },
              {
                column: "ADDER",
                alias: ""
              },
              {
                column: "ADDERID",
                alias: ""
              },
              {
                column: "ADDUNIT",
                alias: ""
              },
              {
                column: "ADDUNITID",
                alias: ""
              },
              {
                column: "ADDTIME",
                alias: ""
              },
              {
                column: "DELFLAG",
                alias: ""
              },
              {
                column: "STREET",
                alias: ""
              },
              {
                column: "COUNTY",
                alias: ""
              },
              {
                column: "REGISTERFLAG",
                alias: ""
              },
              {
                column: "COUNTRY",
                alias: ""
              },
              {
                column: "PROVINCE",
                alias: ""
              },
              {
                column: "CITY",
                alias: ""
              },
              {
                column: "ARRIVE",
                alias: ""
              },
              {
                column: "HOUSEPROVINCE",
                alias: ""
              },
              {
                column: "HOUSECITY",
                alias: ""
              },
              {
                column: "HOUSECOUNTY",
                alias: ""
              },
              {
                column: "CARDNOINSTRUCTION",
                alias: ""
              },
              {
                column: "BIRTHDATE",
                alias: ""
              },
              {
                column: "ISSUEDATE",
                alias: ""
              },
              {
                column: "PREFERENTIALTYPE",
                alias: ""
              },
              {
                column: "ISMEMBER",
                alias: ""
              },
              {
                column: "CONTACTCARDTYPE",
                alias: ""
              },
              {
                column: "DEADPIC",
                alias: ""
              }
            ]
          }
        ],
        outputConfigurations: [
          {
            id: "output",
            fields: [
              {
                column: "MZBZXX0101",
                alias: ""
              },
              {
                column: "MZBZXX0102",
                alias: ""
              },
              {
                column: "MZBZXX0104",
                alias: ""
              },
              {
                column: "MZBZXX0105",
                alias: ""
              },
              {
                column: "MZBZXX0106",
                alias: ""
              },
              {
                column: "MZBZXX0107",
                alias: ""
              },
              {
                column: "MZBZXX0109",
                alias: ""
              },
              {
                column: "MZBZXX0110",
                alias: ""
              },
              {
                column: "MZBZXX0111",
                alias: ""
              },
              {
                column: "MZBZXX0112",
                alias: ""
              },
              {
                column: "MZBZXX0114",
                alias: ""
              },
              {
                column: "MZBZXX0115",
                alias: ""
              },
              {
                column: "MZBZXX0116",
                alias: ""
              },
              {
                column: "MZBZXX0117",
                alias: ""
              },
              {
                column: "MZBZXX0118",
                alias: ""
              },
              {
                column: "MZBZXX0119",
                alias: ""
              },
              {
                column: "MZBZXX0120",
                alias: ""
              },
              {
                column: "MZBZXX0121",
                alias: ""
              },
              {
                column: "MZBZXX0122",
                alias: ""
              },
              {
                column: "MZBZXX0124",
                alias: ""
              },
              {
                column: "MZBZXX0125",
                alias: ""
              },
              {
                column: "MZBZXX0126",
                alias: ""
              },
              {
                column: "MZBZXX0127",
                alias: ""
              },
              {
                column: "MZBZXX0128",
                alias: ""
              },
              {
                column: "MZBZXX0129",
                alias: ""
              },
              {
                column: "MZBZXX0130",
                alias: ""
              },
              {
                column: "MZBZXX0131",
                alias: ""
              },
              {
                column: "MZBZXX0132",
                alias: ""
              },
              {
                column: "MZBZXX0133",
                alias: ""
              },
              {
                column: "MZBZXX0134",
                alias: ""
              },
              {
                column: "MZBZXX0135",
                alias: ""
              },
              {
                column: "MZBZXX0136",
                alias: ""
              },
              {
                column: "MZBZXX0137",
                alias: ""
              },
              {
                column: "MZBZXX0138",
                alias: ""
              },
              {
                column: "MZBZXX0139",
                alias: ""
              },
              {
                column: "MZBZXX0140",
                alias: ""
              },
              {
                column: "inserttime",
                alias: ""
              }
            ]
          }
        ]
      },
      {
        id: "sink_8",
        name: "殡葬信息融合",
        type: "sink",
        x: 1189,
        y: 386,
        otherConfigurations: {
          schema: "殡葬信息融合",
          columns:
            "rowKey:key,info1:MZBZXX0102,info1:MZBZXX0103,info1:MZBZXX0104,info1:MZBZXX0105,info1:MZBZXX0106,info1:MZBZXX0107,info1:MZBZXX0108,info1:MZBZXX0109,info1:MZBZXX0110,info1:MZBZXX0111,info1:MZBZXX0112,info1:MZBZXX0113,info1:MZBZXX0114,info1:MZBZXX0115,info1:MZBZXX0116,info1:MZBZXX0117,info1:MZBZXX0118,info1:MZBZXX0119,info1:MZBZXX0120,info1:MZBZXX0121,info1:MZBZXX0122,info1:MZBZXX0123,info1:MZBZXX0124,info1:MZBZXX0125,info1:MZBZXX0126,info1:MZBZXX0127,info1:MZBZXX0128,info1:MZBZXX0129,info1:MZBZXX0130,info1:MZBZXX0131,info1:MZBZXX0132,info1:MZBZXX0133,info1:MZBZXX0134,info1:MZBZXX0135,info1:MZBZXX0136,info1:MZBZXX0137,info1:MZBZXX0138,info1:MZBZXX0139,info1:MZBZXX0140,info1:inserttime",
          description: "",
          sessionCache: "",
          interceptor: "",
          type: "HBASE",
          columnsKey: "MZBZXX0101",
          nullValue: "",
          mode: "append",
          datasetId: "499848dc-31fb-4495-980d-cd0d3dda86bf",
          table: "MZBZXX01",
          schemaResourceId: "",
          dataResource: "",
          quoteChar: '"',
          escapeChar: "\\",
          schemaResource: "",
          datasetResourceId: "",
          sliceTimeColumn: "",
          format: "csv",
          maxFileSize: "",
          maxFileNumber: "",
          separator: ",",
          expiredTime: "0",
          columnsColumns: "info1",
          schemaId: "b94ca73b-7b3a-4e8e-8c9b-ba485e58de37",
          namespace: "default",
          dataset: "殡葬信息融合",
          sliceType: "H",
          specifiedStringColumnTypes: []
        },
        inputConfigurations: [
          {
            id: "input",
            fields: [
              {
                column: "MZBZXX0101",
                alias: ""
              },
              {
                column: "MZBZXX0120",
                alias: ""
              },
              {
                column: "MZBZXX0128",
                alias: ""
              },
              {
                column: "MZBZXX0129",
                alias: ""
              },
              {
                column: "MZBZXX0106",
                alias: ""
              },
              {
                column: "MZBZXX0104",
                alias: ""
              },
              {
                column: "MZBZXX0111",
                alias: ""
              },
              {
                column: "MZBZXX0114",
                alias: ""
              },
              {
                column: "MZBZXX0115",
                alias: ""
              },
              {
                column: "MZBZXX0110",
                alias: ""
              },
              {
                column: "MZBZXX0118",
                alias: ""
              },
              {
                column: "MZBZXX0119",
                alias: ""
              },
              {
                column: "MZBZXX0117",
                alias: ""
              },
              {
                column: "MZBZXX0109",
                alias: ""
              },
              {
                column: "MZBZXX0140",
                alias: ""
              },
              {
                column: "MZBZXX0105",
                alias: ""
              },
              {
                column: "MZBZXX0102",
                alias: ""
              },
              {
                column: "MZBZXX0107",
                alias: ""
              },
              {
                column: "MZBZXX0112",
                alias: ""
              },
              {
                column: "MZBZXX0122",
                alias: ""
              },
              {
                column: "MZBZXX0121",
                alias: ""
              },
              {
                column: "MZBZXX0116",
                alias: ""
              },
              {
                column: "MZBZXX0124",
                alias: ""
              },
              {
                column: "MZBZXX0125",
                alias: ""
              },
              {
                column: "MZBZXX0126",
                alias: ""
              },
              {
                column: "MZBZXX0127",
                alias: ""
              },
              {
                column: "MZBZXX0130",
                alias: ""
              },
              {
                column: "MZBZXX0131",
                alias: ""
              },
              {
                column: "MZBZXX0132",
                alias: ""
              },
              {
                column: "MZBZXX0133",
                alias: ""
              },
              {
                column: "MZBZXX0134",
                alias: ""
              },
              {
                column: "MZBZXX0135",
                alias: ""
              },
              {
                column: "MZBZXX0136",
                alias: ""
              },
              {
                column: "MZBZXX0137",
                alias: ""
              },
              {
                column: "MZBZXX0138",
                alias: ""
              },
              {
                column: "MZBZXX0139",
                alias: ""
              },
              {
                column: "inserttime",
                alias: ""
              },
              {
                column: "MZBZXX0103",
                alias: ""
              },
              {
                column: "MZBZXX0108",
                alias: ""
              },
              {
                column: "MZBZXX0113",
                alias: ""
              },
              {
                column: "MZBZXX0123",
                alias: ""
              }
            ]
          }
        ]
      },
      {
        id: "transform_10",
        name: "二级索引",
        type: "transform",
        x: 348,
        y: 424,
        otherConfigurations: {
          sessionCache: "",
          interceptor: "",
          expressions: [
            "CONCAT(MZBZXX0102,'-', MZBZXX0103,'-',MZBZXX0104,'-',MZBZXX0106) as tmprowkey",
            "'MZBZXX0102-MZBZXX0103-MZBZXX0104-MZBZXX0106' as rowkeyname"
          ]
        },
        inputConfigurations: [
          {
            id: "input",
            fields: [
              {
                column: "MZBZXX0101",
                alias: ""
              },
              {
                column: "MZBZXX0120",
                alias: ""
              },
              {
                column: "MZBZXX0128",
                alias: ""
              },
              {
                column: "MZBZXX0129",
                alias: ""
              },
              {
                column: "MZBZXX0106",
                alias: ""
              },
              {
                column: "MZBZXX0104",
                alias: ""
              },
              {
                column: "MZBZXX0111",
                alias: ""
              },
              {
                column: "MZBZXX0114",
                alias: ""
              },
              {
                column: "MZBZXX0115",
                alias: ""
              },
              {
                column: "MZBZXX0110",
                alias: ""
              },
              {
                column: "MZBZXX0118",
                alias: ""
              },
              {
                column: "MZBZXX0119",
                alias: ""
              },
              {
                column: "MZBZXX0117",
                alias: ""
              },
              {
                column: "MZBZXX0109",
                alias: ""
              },
              {
                column: "MZBZXX0140",
                alias: ""
              },
              {
                column: "MZBZXX0105",
                alias: ""
              },
              {
                column: "MZBZXX0102",
                alias: ""
              },
              {
                column: "MZBZXX0107",
                alias: ""
              },
              {
                column: "MZBZXX0112",
                alias: ""
              },
              {
                column: "MZBZXX0122",
                alias: ""
              },
              {
                column: "MZBZXX0121",
                alias: ""
              },
              {
                column: "MZBZXX0116",
                alias: ""
              },
              {
                column: "MZBZXX0124",
                alias: ""
              },
              {
                column: "MZBZXX0125",
                alias: ""
              },
              {
                column: "MZBZXX0126",
                alias: ""
              },
              {
                column: "MZBZXX0127",
                alias: ""
              },
              {
                column: "MZBZXX0130",
                alias: ""
              },
              {
                column: "MZBZXX0131",
                alias: ""
              },
              {
                column: "MZBZXX0132",
                alias: ""
              },
              {
                column: "MZBZXX0133",
                alias: ""
              },
              {
                column: "MZBZXX0134",
                alias: ""
              },
              {
                column: "MZBZXX0135",
                alias: ""
              },
              {
                column: "MZBZXX0136",
                alias: ""
              },
              {
                column: "MZBZXX0137",
                alias: ""
              },
              {
                column: "MZBZXX0138",
                alias: ""
              },
              {
                column: "MZBZXX0139",
                alias: ""
              },
              {
                column: "MZBZXX0103",
                alias: ""
              },
              {
                column: "MZBZXX0108",
                alias: ""
              },
              {
                column: "MZBZXX0113",
                alias: ""
              },
              {
                column: "MZBZXX0123",
                alias: ""
              }
            ]
          }
        ],
        outputConfigurations: [
          {
            id: "output",
            fields: [
              {
                column: "MZBZXX0101",
                alias: ""
              },
              {
                column: "MZBZXX0120",
                alias: ""
              },
              {
                column: "MZBZXX0128",
                alias: ""
              },
              {
                column: "MZBZXX0129",
                alias: ""
              },
              {
                column: "MZBZXX0106",
                alias: ""
              },
              {
                column: "MZBZXX0104",
                alias: ""
              },
              {
                column: "MZBZXX0111",
                alias: ""
              },
              {
                column: "MZBZXX0114",
                alias: ""
              },
              {
                column: "MZBZXX0115",
                alias: ""
              },
              {
                column: "MZBZXX0110",
                alias: ""
              },
              {
                column: "MZBZXX0118",
                alias: ""
              },
              {
                column: "MZBZXX0119",
                alias: ""
              },
              {
                column: "MZBZXX0117",
                alias: ""
              },
              {
                column: "MZBZXX0109",
                alias: ""
              },
              {
                column: "MZBZXX0140",
                alias: ""
              },
              {
                column: "MZBZXX0105",
                alias: ""
              },
              {
                column: "MZBZXX0102",
                alias: ""
              },
              {
                column: "MZBZXX0107",
                alias: ""
              },
              {
                column: "MZBZXX0112",
                alias: ""
              },
              {
                column: "MZBZXX0122",
                alias: ""
              },
              {
                column: "MZBZXX0121",
                alias: ""
              },
              {
                column: "MZBZXX0116",
                alias: ""
              },
              {
                column: "MZBZXX0124",
                alias: ""
              },
              {
                column: "MZBZXX0125",
                alias: ""
              },
              {
                column: "MZBZXX0126",
                alias: ""
              },
              {
                column: "MZBZXX0127",
                alias: ""
              },
              {
                column: "MZBZXX0130",
                alias: ""
              },
              {
                column: "MZBZXX0131",
                alias: ""
              },
              {
                column: "MZBZXX0132",
                alias: ""
              },
              {
                column: "MZBZXX0133",
                alias: ""
              },
              {
                column: "MZBZXX0134",
                alias: ""
              },
              {
                column: "MZBZXX0135",
                alias: ""
              },
              {
                column: "MZBZXX0136",
                alias: ""
              },
              {
                column: "MZBZXX0137",
                alias: ""
              },
              {
                column: "MZBZXX0138",
                alias: ""
              },
              {
                column: "MZBZXX0139",
                alias: ""
              },
              {
                column: "MZBZXX0103",
                alias: ""
              },
              {
                column: "MZBZXX0108",
                alias: ""
              },
              {
                column: "MZBZXX0113",
                alias: ""
              },
              {
                column: "MZBZXX0123",
                alias: ""
              },
              {
                column: "tmprowkey",
                alias: ""
              },
              {
                column: "rowkeyname",
                alias: ""
              }
            ]
          }
        ]
      },
      {
        id: "sink_11",
        name: "殡葬信息_二级索引",
        type: "sink",
        x: 873,
        y: 485,
        otherConfigurations: {
          schema: "殡葬信息_二级索引",
          brokers: "",
          columns: "info1:index,rowKey:key",
          groupId: "",
          description: "",
          sessionCache: "",
          interceptor: "",
          type: "HBASE",
          columnsKey: "key",
          nullValue: "",
          mode: "append",
          path: "",
          password: "",
          datasetId: "e100e7a2-3cb5-46a5-bc4c-43d45a6852e1",
          table: "MZBZXX01_INDEX",
          schemaResourceId: "76b66a68-ece9-441c-946c-52bb824aa63b",
          dataResource: "Datasets;共享数据集;专项社会事务;殡葬信息;",
          quoteChar: '"',
          escapeChar: "\\",
          schemaResource: "Schemas;共享元数据;共享目录;专项社会事务;殡葬信息;",
          datasetResourceId: "8f0ac960-c0cb-4188-a2fd-ce6d04e6adcd",
          sliceTimeColumn: "",
          partitionColumns: "",
          format: "csv",
          maxFileSize: "",
          maxFileNumber: "",
          separator: ",",
          url: "",
          expiredTime: "0",
          driver: "",
          columnsColumns: "info1",
          schemaId: "c9ac0177-3bb8-4ca2-b03d-d3d52ce6cba6",
          namespace: "default",
          topic: "",
          dataset: "殡葬信息_二级索引",
          user: "",
          sliceType: "",
          specifiedStringColumnTypes: []
        },
        inputConfigurations: [
          {
            id: "input",
            fields: [
              {
                column: "MZBZXX0101",
                alias: "index"
              },
              {
                column: "tmprowkey",
                alias: "key"
              }
            ]
          }
        ]
      },
      {
        id: "transform_1",
        name: "标准转换",
        type: "transform",
        x: 856,
        y: 123,
        otherConfigurations: {
          sessionCache: "",
          interceptor: "",
          expressions: [
            "lookupInStandard('证件类别_殡葬信息系统',MZBZXX0102,'') as MZBZXX0103",
            "lookupInStandard('性别__殡葬信息系统',MZBZXX0107,'') as MZBZXX0108",
            "lookupInStandard('民族_社会救助管理平台',MZBZXX0112,'') as MZBZXX0113",
            "lookupInStandard('区县_殡葬信息系统',MZBZXX0122,'') as MZBZXX0123"
          ]
        },
        inputConfigurations: [
          {
            id: "input",
            fields: [
              {
                column: "MZBZXX0101",
                alias: ""
              },
              {
                column: "MZBZXX0102",
                alias: ""
              },
              {
                column: "MZBZXX0104",
                alias: ""
              },
              {
                column: "MZBZXX0105",
                alias: ""
              },
              {
                column: "MZBZXX0106",
                alias: ""
              },
              {
                column: "MZBZXX0107",
                alias: ""
              },
              {
                column: "MZBZXX0109",
                alias: ""
              },
              {
                column: "MZBZXX0110",
                alias: ""
              },
              {
                column: "MZBZXX0111",
                alias: ""
              },
              {
                column: "MZBZXX0112",
                alias: ""
              },
              {
                column: "MZBZXX0114",
                alias: ""
              },
              {
                column: "MZBZXX0115",
                alias: ""
              },
              {
                column: "MZBZXX0116",
                alias: ""
              },
              {
                column: "MZBZXX0117",
                alias: ""
              },
              {
                column: "MZBZXX0118",
                alias: ""
              },
              {
                column: "MZBZXX0119",
                alias: ""
              },
              {
                column: "MZBZXX0120",
                alias: ""
              },
              {
                column: "MZBZXX0121",
                alias: ""
              },
              {
                column: "MZBZXX0122",
                alias: ""
              },
              {
                column: "MZBZXX0124",
                alias: ""
              },
              {
                column: "MZBZXX0125",
                alias: ""
              },
              {
                column: "MZBZXX0126",
                alias: ""
              },
              {
                column: "MZBZXX0127",
                alias: ""
              },
              {
                column: "MZBZXX0128",
                alias: ""
              },
              {
                column: "MZBZXX0129",
                alias: ""
              },
              {
                column: "MZBZXX0130",
                alias: ""
              },
              {
                column: "MZBZXX0131",
                alias: ""
              },
              {
                column: "MZBZXX0132",
                alias: ""
              },
              {
                column: "MZBZXX0133",
                alias: ""
              },
              {
                column: "MZBZXX0134",
                alias: ""
              },
              {
                column: "MZBZXX0135",
                alias: ""
              },
              {
                column: "MZBZXX0136",
                alias: ""
              },
              {
                column: "MZBZXX0137",
                alias: ""
              },
              {
                column: "MZBZXX0138",
                alias: ""
              },
              {
                column: "MZBZXX0139",
                alias: ""
              },
              {
                column: "MZBZXX0140",
                alias: ""
              },
              {
                column: "inserttime",
                alias: ""
              }
            ]
          }
        ],
        outputConfigurations: [
          {
            id: "output",
            fields: [
              {
                column: "MZBZXX0101",
                alias: ""
              },
              {
                column: "MZBZXX0102",
                alias: ""
              },
              {
                column: "MZBZXX0104",
                alias: ""
              },
              {
                column: "MZBZXX0105",
                alias: ""
              },
              {
                column: "MZBZXX0106",
                alias: ""
              },
              {
                column: "MZBZXX0107",
                alias: ""
              },
              {
                column: "MZBZXX0109",
                alias: ""
              },
              {
                column: "MZBZXX0110",
                alias: ""
              },
              {
                column: "MZBZXX0111",
                alias: ""
              },
              {
                column: "MZBZXX0112",
                alias: ""
              },
              {
                column: "MZBZXX0114",
                alias: ""
              },
              {
                column: "MZBZXX0115",
                alias: ""
              },
              {
                column: "MZBZXX0116",
                alias: ""
              },
              {
                column: "MZBZXX0117",
                alias: ""
              },
              {
                column: "MZBZXX0118",
                alias: ""
              },
              {
                column: "MZBZXX0119",
                alias: ""
              },
              {
                column: "MZBZXX0120",
                alias: ""
              },
              {
                column: "MZBZXX0121",
                alias: ""
              },
              {
                column: "MZBZXX0122",
                alias: ""
              },
              {
                column: "MZBZXX0124",
                alias: ""
              },
              {
                column: "MZBZXX0125",
                alias: ""
              },
              {
                column: "MZBZXX0126",
                alias: ""
              },
              {
                column: "MZBZXX0127",
                alias: ""
              },
              {
                column: "MZBZXX0128",
                alias: ""
              },
              {
                column: "MZBZXX0129",
                alias: ""
              },
              {
                column: "MZBZXX0130",
                alias: ""
              },
              {
                column: "MZBZXX0131",
                alias: ""
              },
              {
                column: "MZBZXX0132",
                alias: ""
              },
              {
                column: "MZBZXX0133",
                alias: ""
              },
              {
                column: "MZBZXX0134",
                alias: ""
              },
              {
                column: "MZBZXX0135",
                alias: ""
              },
              {
                column: "MZBZXX0136",
                alias: ""
              },
              {
                column: "MZBZXX0137",
                alias: ""
              },
              {
                column: "MZBZXX0138",
                alias: ""
              },
              {
                column: "MZBZXX0139",
                alias: ""
              },
              {
                column: "MZBZXX0140",
                alias: ""
              },
              {
                column: "inserttime",
                alias: ""
              },
              {
                column: "MZBZXX0103",
                alias: ""
              },
              {
                column: "MZBZXX0108",
                alias: ""
              },
              {
                column: "MZBZXX0113",
                alias: ""
              },
              {
                column: "MZBZXX0123",
                alias: ""
              }
            ]
          }
        ]
      },
      {
        id: "source_9",
        name: "WORK_BUSSINCINERATE_殡仪服务管理系统",
        type: "source",
        x: 27,
        y: 84,
        otherConfigurations: {
          schema: "WORK_BUSSINCINERATE_殡仪服务管理系统",
          schemaId: "e4da8850-8472-4035-bcc8-c86a497f96b2",
          sessionCache: "",
          datasetId: "61a2545c-91fb-4d00-9948-158e97df5adb",
          ignoreMissingPath: false,
          interceptor: "",
          dataset: "WORK_BUSSINCINERATE_殡仪服务管理系统"
        },
        outputConfigurations: [
          {
            id: "output",
            fields: [
              {
                type: "string",
                alias: "",
                description: "",
                column: "ID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "BUSINESSID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CREMATORID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "INCINERATENO"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "INCINERATETIME"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "INCINERATEMAN"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "WHEINTUITION"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "WHEPICKASH"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "WHEADVANCE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "TAKEGRAYTIME"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ASHGOTO"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "FAMILYSIGN"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "RELATIONSHIP"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "SIGNERTEL"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "SIGNERCAEDID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "MANAGER"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "FUNERALID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "FUNERALNAME"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "REMARKS"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ADDER"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ADDERID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ADDUNIT"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ADDUNITID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ADDTIME"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "DELFLAG"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "INCINERATECERTTIME"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "SIGNERCARDTYPE"
              }
            ]
          }
        ]
      },
      {
        id: "source_12",
        name: "WORK_DEADINFO_殡仪服务管理系统",
        type: "source",
        x: 27,
        y: 186,
        otherConfigurations: {
          schema: "WORK_DEADINFO_殡仪服务管理系统",
          schemaId: "d10cbb58-f363-4843-a105-245d537488b1",
          sessionCache: "",
          datasetId: "53fd06dd-137c-4185-ad96-339b68c24c40",
          interceptor: "",
          dataset: "WORK_DEADINFO_殡仪服务管理系统"
        },
        outputConfigurations: [
          {
            id: "output",
            fields: [
              {
                type: "string",
                alias: "",
                description: "",
                column: "ID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "BUSINESSID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "FUNERALID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "FUNERALNAME"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "DEADNO"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CORPSETYPR"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "DEADNAME"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CARDTYPE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CARDNO"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "GENDER"
              },
              {
                type: "short",
                alias: "",
                description: "",
                column: "AGE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "NATION"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "DEATHTYPE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "DEADSTATE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "DEADTIME"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "DEADPLACE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ADDRESS"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "DEATHCERTIFYNO"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ISSUEUNIT"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "DEATHCERTIFYTYPE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "DEATHCERTIFYANNEX"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CREMCERTIFYNO"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CREMCERTIFYANNEX"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CONTACTNAME"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "RELATIONSHIP"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CONTACTPHONE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CONTACTTEL"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CONTACTADDRESS"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CONTACTID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "COPYIDANNEX"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "UNITNAME"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "UNITPHONE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "UNITADDRESS"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "REMARKS"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ADDER"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ADDERID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ADDUNIT"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ADDUNITID"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ADDTIME"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "DELFLAG"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "STREET"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "COUNTY"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "REGISTERFLAG"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "COUNTRY"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "PROVINCE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CITY"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ARRIVE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "HOUSEPROVINCE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "HOUSECITY"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "HOUSECOUNTY"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CARDNOINSTRUCTION"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "BIRTHDATE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ISSUEDATE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "PREFERENTIALTYPE"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "ISMEMBER"
              },
              {
                type: "string",
                alias: "",
                description: "",
                column: "CONTACTCARDTYPE"
              },
              {
                type: "binary",
                alias: "",
                description: "",
                column: "DEADPIC"
              }
            ]
          }
        ]
      }
    ],
    links: [
      {
        name: "con_37",
        source: "join_6",
        sourceOutput: "output",
        target: "transform_7",
        targetInput: "input",
        input: "input"
      },
      {
        name: "con_38",
        source: "transform_10",
        sourceOutput: "output",
        target: "sink_11",
        targetInput: "input",
        input: "input"
      },
      {
        name: "con_39",
        source: "transform_7",
        sourceOutput: "output",
        target: "transform_1",
        targetInput: "input",
        input: "input"
      },
      {
        name: "con_40",
        source: "transform_1",
        sourceOutput: "output",
        target: "transform_10",
        targetInput: "input",
        input: "input"
      },
      {
        name: "con_41",
        source: "transform_1",
        sourceOutput: "output",
        target: "sink_8",
        targetInput: "input",
        input: "input"
      },
      {
        name: "con_42",
        source: "source_9",
        sourceOutput: "output",
        target: "join_6",
        targetInput: "left",
        input: "left"
      },
      {
        name: "con_43",
        source: "source_12",
        sourceOutput: "output",
        target: "join_6",
        targetInput: "right",
        input: "right"
      }
    ],
    inputs: [],
    outputs: [],
    oid: "$null",
    creator: "admin",
    createTime: 1554601428000,
    lastModifier: "admin",
    lastModifiedTime: 1564019236000,
    owner: "2059750c-a300-4b64-84a6-e8b086dbfd42",
    version: 16,
    enabled: 1,
    moduleVersion: 0,
    tenant: {
      id: "2d7ad891-41c5-4fba-9ff2-03aef3c729e5",
      name: "default",
      creator: "root",
      createTime: 1532942318000,
      lastModifier: "root",
      lastModifiedTime: 1544078372000,
      owner: "f8aff341-9303-4135-b393-1d322e4638e2",
      version: 0,
      moduleVersion: 0,
      enabled: 1,
      resourceQueues: ["default"],
      hdfsSpaceQuota: 0,
      zid: "",
      expiredPeriod: 0
    },
    tableName: "merce_flow",
    isHide: 0,
    parameters: [],
    expiredPeriod: 0
  },
  nodeSetVisible: true,
  dbStatus: "1",
  oldName: "标准转换"
};
