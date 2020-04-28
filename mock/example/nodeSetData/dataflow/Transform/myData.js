module.exports = {
    "newName": "标准转换",
    "inputData": {
        "id": "input",
        "fields": [
            {
                "id": "output",
                "fields": [
                    {
                        "column": "MZBZXX0101",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0102",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0104",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0105",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0106",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0107",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0109",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0110",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0111",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0112",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0114",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0115",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0116",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0117",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0118",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0119",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0120",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0121",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0122",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0124",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0125",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0126",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0127",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0128",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0129",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0130",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0131",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0132",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0133",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0134",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0135",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0136",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0137",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0138",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0139",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0140",
                        "alias": ""
                    },
                    {
                        "column": "inserttime",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0103",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0108",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0113",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0123",
                        "alias": ""
                    }
                ]
            }
        ]
    },
    "outputData": [],
    "nodeSetTab": [
        {
            "title": "输入（标准转换）",
            "name": "input",
            "icon": "fa fa-sign-in"
        },
        {
            "title": "参数",
            "name": "parameter",
            "icon": "fa fa-gear"
        },
        {
            "title": "输出",
            "name": "output",
            "icon": "fa fa-sign-out"
        }
    ],
    "thisNodeData": {
        "id": "transform_1",
        "name": "标准转换",
        "type": "transform",
        "x": 854,
        "y": 123,
        "otherConfigurations": {
            "sessionCache": "",
            "interceptor": "",
            "expressions": [
                "lookupInStandard('证件类别_殡葬信息系统',MZBZXX0102,'') as MZBZXX0103",
                "lookupInStandard('性别__殡葬信息系统',MZBZXX0107,'') as MZBZXX0108",
                "lookupInStandard('民族_社会救助管理平台',MZBZXX0112,'') as MZBZXX0113",
                "lookupInStandard('区县_殡葬信息系统',MZBZXX0122,'') as MZBZXX0123"
            ]
        },
        "inputConfigurations": [
            {
                "id": "input",
                "fields": [
                    {
                        "column": "MZBZXX0101",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0102",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0104",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0105",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0106",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0107",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0109",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0110",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0111",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0112",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0114",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0115",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0116",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0117",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0118",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0119",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0120",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0121",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0122",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0124",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0125",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0126",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0127",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0128",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0129",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0130",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0131",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0132",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0133",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0134",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0135",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0136",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0137",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0138",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0139",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0140",
                        "alias": ""
                    },
                    {
                        "column": "inserttime",
                        "alias": ""
                    }
                ]
            }
        ],
        "outputConfigurations": [
            {
                "id": "output",
                "fields": [
                    {
                        "column": "MZBZXX0101",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0102",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0104",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0105",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0106",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0107",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0109",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0110",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0111",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0112",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0114",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0115",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0116",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0117",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0118",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0119",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0120",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0121",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0122",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0124",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0125",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0126",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0127",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0128",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0129",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0130",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0131",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0132",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0133",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0134",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0135",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0136",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0137",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0138",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0139",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0140",
                        "alias": ""
                    },
                    {
                        "column": "inserttime",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0103",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0108",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0113",
                        "alias": ""
                    },
                    {
                        "column": "MZBZXX0123",
                        "alias": ""
                    }
                ]
            }
        ]
    },
    "nodeLine": {
        "inputLine": [],
        "outputLine": []
    },
    "datasetType": "",
    "flowData": {
        "stepsOutput": [
            "transform_1"
        ],
        "stepsInput": [
            "transform_7"
        ],
        "changeStepsArr": [
            {
                "id": "transform_7",
                "name": "类型转换和新增字段",
                "type": "transform",
                "x": 604,
                "y": 72,
                "otherConfigurations": {
                    "sessionCache": "",
                    "interceptor": "",
                    "expressions": [
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
                "inputConfigurations": [
                    {
                        "id": "input",
                        "fields": [
                            {
                                "column": "CREMATORID",
                                "alias": ""
                            },
                            {
                                "column": "INCINERATEMAN",
                                "alias": ""
                            },
                            {
                                "column": "WHEINTUITION",
                                "alias": ""
                            },
                            {
                                "column": "WHEPICKASH",
                                "alias": ""
                            },
                            {
                                "column": "WHEADVANCE",
                                "alias": ""
                            },
                            {
                                "column": "TAKEGRAYTIME",
                                "alias": ""
                            },
                            {
                                "column": "ASHGOTO",
                                "alias": ""
                            },
                            {
                                "column": "FAMILYSIGN",
                                "alias": ""
                            },
                            {
                                "column": "left_RELATIONSHIP",
                                "alias": ""
                            },
                            {
                                "column": "SIGNERTEL",
                                "alias": ""
                            },
                            {
                                "column": "SIGNERCAEDID",
                                "alias": ""
                            },
                            {
                                "column": "MANAGER",
                                "alias": ""
                            },
                            {
                                "column": "left_FUNERALID",
                                "alias": ""
                            },
                            {
                                "column": "left_FUNERALNAME",
                                "alias": ""
                            },
                            {
                                "column": "left_REMARKS",
                                "alias": ""
                            },
                            {
                                "column": "left_ADDER",
                                "alias": ""
                            },
                            {
                                "column": "left_ADDERID",
                                "alias": ""
                            },
                            {
                                "column": "left_ADDUNIT",
                                "alias": ""
                            },
                            {
                                "column": "left_ADDUNITID",
                                "alias": ""
                            },
                            {
                                "column": "left_ADDTIME",
                                "alias": ""
                            },
                            {
                                "column": "left_DELFLAG",
                                "alias": ""
                            },
                            {
                                "column": "INCINERATECERTTIME",
                                "alias": ""
                            },
                            {
                                "column": "SIGNERCARDTYPE",
                                "alias": ""
                            },
                            {
                                "column": "ID",
                                "alias": ""
                            },
                            {
                                "column": "INCINERATENO",
                                "alias": ""
                            },
                            {
                                "column": "INCINERATETIME",
                                "alias": ""
                            },
                            {
                                "column": "left_BUSINESSID",
                                "alias": ""
                            },
                            {
                                "column": "right_BUSINESSID",
                                "alias": ""
                            },
                            {
                                "column": "FUNERALID",
                                "alias": ""
                            },
                            {
                                "column": "FUNERALNAME",
                                "alias": ""
                            },
                            {
                                "column": "DEADNO",
                                "alias": ""
                            },
                            {
                                "column": "CORPSETYPR",
                                "alias": ""
                            },
                            {
                                "column": "DEADNAME",
                                "alias": ""
                            },
                            {
                                "column": "CARDTYPE",
                                "alias": ""
                            },
                            {
                                "column": "CARDNO",
                                "alias": ""
                            },
                            {
                                "column": "GENDER",
                                "alias": ""
                            },
                            {
                                "column": "AGE",
                                "alias": ""
                            },
                            {
                                "column": "NATION",
                                "alias": ""
                            },
                            {
                                "column": "DEATHTYPE",
                                "alias": ""
                            },
                            {
                                "column": "DEADSTATE",
                                "alias": ""
                            },
                            {
                                "column": "DEADTIME",
                                "alias": ""
                            },
                            {
                                "column": "DEADPLACE",
                                "alias": ""
                            },
                            {
                                "column": "ADDRESS",
                                "alias": ""
                            },
                            {
                                "column": "DEATHCERTIFYNO",
                                "alias": ""
                            },
                            {
                                "column": "ISSUEUNIT",
                                "alias": ""
                            },
                            {
                                "column": "DEATHCERTIFYTYPE",
                                "alias": ""
                            },
                            {
                                "column": "DEATHCERTIFYANNEX",
                                "alias": ""
                            },
                            {
                                "column": "CREMCERTIFYNO",
                                "alias": ""
                            },
                            {
                                "column": "CREMCERTIFYANNEX",
                                "alias": ""
                            },
                            {
                                "column": "CONTACTNAME",
                                "alias": ""
                            },
                            {
                                "column": "RELATIONSHIP",
                                "alias": ""
                            },
                            {
                                "column": "CONTACTPHONE",
                                "alias": ""
                            },
                            {
                                "column": "CONTACTTEL",
                                "alias": ""
                            },
                            {
                                "column": "CONTACTADDRESS",
                                "alias": ""
                            },
                            {
                                "column": "CONTACTID",
                                "alias": ""
                            },
                            {
                                "column": "COPYIDANNEX",
                                "alias": ""
                            },
                            {
                                "column": "UNITNAME",
                                "alias": ""
                            },
                            {
                                "column": "UNITPHONE",
                                "alias": ""
                            },
                            {
                                "column": "UNITADDRESS",
                                "alias": ""
                            },
                            {
                                "column": "REMARKS",
                                "alias": ""
                            },
                            {
                                "column": "ADDER",
                                "alias": ""
                            },
                            {
                                "column": "ADDERID",
                                "alias": ""
                            },
                            {
                                "column": "ADDUNIT",
                                "alias": ""
                            },
                            {
                                "column": "ADDUNITID",
                                "alias": ""
                            },
                            {
                                "column": "ADDTIME",
                                "alias": ""
                            },
                            {
                                "column": "DELFLAG",
                                "alias": ""
                            },
                            {
                                "column": "STREET",
                                "alias": ""
                            },
                            {
                                "column": "COUNTY",
                                "alias": ""
                            },
                            {
                                "column": "REGISTERFLAG",
                                "alias": ""
                            },
                            {
                                "column": "COUNTRY",
                                "alias": ""
                            },
                            {
                                "column": "PROVINCE",
                                "alias": ""
                            },
                            {
                                "column": "CITY",
                                "alias": ""
                            },
                            {
                                "column": "ARRIVE",
                                "alias": ""
                            },
                            {
                                "column": "HOUSEPROVINCE",
                                "alias": ""
                            },
                            {
                                "column": "HOUSECITY",
                                "alias": ""
                            },
                            {
                                "column": "HOUSECOUNTY",
                                "alias": ""
                            },
                            {
                                "column": "CARDNOINSTRUCTION",
                                "alias": ""
                            },
                            {
                                "column": "BIRTHDATE",
                                "alias": ""
                            },
                            {
                                "column": "ISSUEDATE",
                                "alias": ""
                            },
                            {
                                "column": "PREFERENTIALTYPE",
                                "alias": ""
                            },
                            {
                                "column": "ISMEMBER",
                                "alias": ""
                            },
                            {
                                "column": "CONTACTCARDTYPE",
                                "alias": ""
                            },
                            {
                                "column": "DEADPIC",
                                "alias": ""
                            }
                        ]
                    }
                ],
                "outputConfigurations": [
                    {
                        "id": "output",
                        "fields": [
                            {
                                "column": "MZBZXX0101",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0102",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0104",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0105",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0106",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0107",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0109",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0110",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0111",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0112",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0114",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0115",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0116",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0117",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0118",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0119",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0120",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0121",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0122",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0124",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0125",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0126",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0127",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0128",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0129",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0130",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0131",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0132",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0133",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0134",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0135",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0136",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0137",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0138",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0139",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0140",
                                "alias": ""
                            },
                            {
                                "column": "inserttime",
                                "alias": ""
                            }
                        ]
                    }
                ]
            },
            {
                "id": "transform_1",
                "name": "标准转换",
                "type": "transform",
                "x": 854,
                "y": 123,
                "otherConfigurations": {
                    "sessionCache": "",
                    "interceptor": "",
                    "expressions": [
                        "lookupInStandard('证件类别_殡葬信息系统',MZBZXX0102,'') as MZBZXX0103",
                        "lookupInStandard('性别__殡葬信息系统',MZBZXX0107,'') as MZBZXX0108",
                        "lookupInStandard('民族_社会救助管理平台',MZBZXX0112,'') as MZBZXX0113",
                        "lookupInStandard('区县_殡葬信息系统',MZBZXX0122,'') as MZBZXX0123"
                    ]
                },
                "inputConfigurations": [
                    {
                        "id": "input",
                        "fields": [
                            {
                                "column": "MZBZXX0101",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0102",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0104",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0105",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0106",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0107",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0109",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0110",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0111",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0112",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0114",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0115",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0116",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0117",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0118",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0119",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0120",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0121",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0122",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0124",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0125",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0126",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0127",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0128",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0129",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0130",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0131",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0132",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0133",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0134",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0135",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0136",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0137",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0138",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0139",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0140",
                                "alias": ""
                            },
                            {
                                "column": "inserttime",
                                "alias": ""
                            }
                        ]
                    }
                ],
                "outputConfigurations": [
                    {
                        "id": "output",
                        "fields": [
                            {
                                "column": "MZBZXX0101",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0102",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0104",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0105",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0106",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0107",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0109",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0110",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0111",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0112",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0114",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0115",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0116",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0117",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0118",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0119",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0120",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0121",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0122",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0124",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0125",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0126",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0127",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0128",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0129",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0130",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0131",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0132",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0133",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0134",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0135",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0136",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0137",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0138",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0139",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0140",
                                "alias": ""
                            },
                            {
                                "column": "inserttime",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0103",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0108",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0113",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0123",
                                "alias": ""
                            }
                        ]
                    }
                ]
            }
        ],
        "regard": {},
        "name": "CUSTOME-STEPS-012",
        "stepsArr": [
            "transform_7",
            "transform_1"
        ],
        "id": "62e6fb1c-1d40-447a-94bf-c426d3090284",
        "type": "define",
        "changeLinksArr": [
            {
                "name": "con_52",
                "source": "transform_7",
                "sourceOutput": "output",
                "target": "transform_1",
                "targetInput": "input",
                "input": "input"
            }
        ],
        "flowtype": "dataflow",
        "tenant": {
            "id": "2d7ad891-41c5-4fba-9ff2-03aef3c729e5",
            "name": "default",
            "creator": "root",
            "createTime": 1532942318000,
            "lastModifier": "root",
            "lastModifiedTime": 1544078372000,
            "owner": "f8aff341-9303-4135-b393-1d322e4638e2",
            "version": 0,
            "moduleVersion": 0,
            "enabled": 1,
            "resourceQueues": [
                "default"
            ],
            "hdfsSpaceQuota": 0,
            "zid": "",
            "expiredPeriod": 0
        },
        "links": [
            {
                "name": "con_52",
                "source": "transform_7",
                "sourceOutput": "output",
                "target": "transform_1",
                "targetInput": "input",
                "input": "input"
            }
        ],
        "steps": [
            {
                "id": "transform_7",
                "name": "类型转换和新增字段",
                "type": "transform",
                "x": 604,
                "y": 72,
                "otherConfigurations": {
                    "sessionCache": "",
                    "interceptor": "",
                    "expressions": [
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
                "inputConfigurations": [
                    {
                        "id": "input",
                        "fields": [
                            {
                                "column": "CREMATORID",
                                "alias": ""
                            },
                            {
                                "column": "INCINERATEMAN",
                                "alias": ""
                            },
                            {
                                "column": "WHEINTUITION",
                                "alias": ""
                            },
                            {
                                "column": "WHEPICKASH",
                                "alias": ""
                            },
                            {
                                "column": "WHEADVANCE",
                                "alias": ""
                            },
                            {
                                "column": "TAKEGRAYTIME",
                                "alias": ""
                            },
                            {
                                "column": "ASHGOTO",
                                "alias": ""
                            },
                            {
                                "column": "FAMILYSIGN",
                                "alias": ""
                            },
                            {
                                "column": "left_RELATIONSHIP",
                                "alias": ""
                            },
                            {
                                "column": "SIGNERTEL",
                                "alias": ""
                            },
                            {
                                "column": "SIGNERCAEDID",
                                "alias": ""
                            },
                            {
                                "column": "MANAGER",
                                "alias": ""
                            },
                            {
                                "column": "left_FUNERALID",
                                "alias": ""
                            },
                            {
                                "column": "left_FUNERALNAME",
                                "alias": ""
                            },
                            {
                                "column": "left_REMARKS",
                                "alias": ""
                            },
                            {
                                "column": "left_ADDER",
                                "alias": ""
                            },
                            {
                                "column": "left_ADDERID",
                                "alias": ""
                            },
                            {
                                "column": "left_ADDUNIT",
                                "alias": ""
                            },
                            {
                                "column": "left_ADDUNITID",
                                "alias": ""
                            },
                            {
                                "column": "left_ADDTIME",
                                "alias": ""
                            },
                            {
                                "column": "left_DELFLAG",
                                "alias": ""
                            },
                            {
                                "column": "INCINERATECERTTIME",
                                "alias": ""
                            },
                            {
                                "column": "SIGNERCARDTYPE",
                                "alias": ""
                            },
                            {
                                "column": "ID",
                                "alias": ""
                            },
                            {
                                "column": "INCINERATENO",
                                "alias": ""
                            },
                            {
                                "column": "INCINERATETIME",
                                "alias": ""
                            },
                            {
                                "column": "left_BUSINESSID",
                                "alias": ""
                            },
                            {
                                "column": "right_BUSINESSID",
                                "alias": ""
                            },
                            {
                                "column": "FUNERALID",
                                "alias": ""
                            },
                            {
                                "column": "FUNERALNAME",
                                "alias": ""
                            },
                            {
                                "column": "DEADNO",
                                "alias": ""
                            },
                            {
                                "column": "CORPSETYPR",
                                "alias": ""
                            },
                            {
                                "column": "DEADNAME",
                                "alias": ""
                            },
                            {
                                "column": "CARDTYPE",
                                "alias": ""
                            },
                            {
                                "column": "CARDNO",
                                "alias": ""
                            },
                            {
                                "column": "GENDER",
                                "alias": ""
                            },
                            {
                                "column": "AGE",
                                "alias": ""
                            },
                            {
                                "column": "NATION",
                                "alias": ""
                            },
                            {
                                "column": "DEATHTYPE",
                                "alias": ""
                            },
                            {
                                "column": "DEADSTATE",
                                "alias": ""
                            },
                            {
                                "column": "DEADTIME",
                                "alias": ""
                            },
                            {
                                "column": "DEADPLACE",
                                "alias": ""
                            },
                            {
                                "column": "ADDRESS",
                                "alias": ""
                            },
                            {
                                "column": "DEATHCERTIFYNO",
                                "alias": ""
                            },
                            {
                                "column": "ISSUEUNIT",
                                "alias": ""
                            },
                            {
                                "column": "DEATHCERTIFYTYPE",
                                "alias": ""
                            },
                            {
                                "column": "DEATHCERTIFYANNEX",
                                "alias": ""
                            },
                            {
                                "column": "CREMCERTIFYNO",
                                "alias": ""
                            },
                            {
                                "column": "CREMCERTIFYANNEX",
                                "alias": ""
                            },
                            {
                                "column": "CONTACTNAME",
                                "alias": ""
                            },
                            {
                                "column": "RELATIONSHIP",
                                "alias": ""
                            },
                            {
                                "column": "CONTACTPHONE",
                                "alias": ""
                            },
                            {
                                "column": "CONTACTTEL",
                                "alias": ""
                            },
                            {
                                "column": "CONTACTADDRESS",
                                "alias": ""
                            },
                            {
                                "column": "CONTACTID",
                                "alias": ""
                            },
                            {
                                "column": "COPYIDANNEX",
                                "alias": ""
                            },
                            {
                                "column": "UNITNAME",
                                "alias": ""
                            },
                            {
                                "column": "UNITPHONE",
                                "alias": ""
                            },
                            {
                                "column": "UNITADDRESS",
                                "alias": ""
                            },
                            {
                                "column": "REMARKS",
                                "alias": ""
                            },
                            {
                                "column": "ADDER",
                                "alias": ""
                            },
                            {
                                "column": "ADDERID",
                                "alias": ""
                            },
                            {
                                "column": "ADDUNIT",
                                "alias": ""
                            },
                            {
                                "column": "ADDUNITID",
                                "alias": ""
                            },
                            {
                                "column": "ADDTIME",
                                "alias": ""
                            },
                            {
                                "column": "DELFLAG",
                                "alias": ""
                            },
                            {
                                "column": "STREET",
                                "alias": ""
                            },
                            {
                                "column": "COUNTY",
                                "alias": ""
                            },
                            {
                                "column": "REGISTERFLAG",
                                "alias": ""
                            },
                            {
                                "column": "COUNTRY",
                                "alias": ""
                            },
                            {
                                "column": "PROVINCE",
                                "alias": ""
                            },
                            {
                                "column": "CITY",
                                "alias": ""
                            },
                            {
                                "column": "ARRIVE",
                                "alias": ""
                            },
                            {
                                "column": "HOUSEPROVINCE",
                                "alias": ""
                            },
                            {
                                "column": "HOUSECITY",
                                "alias": ""
                            },
                            {
                                "column": "HOUSECOUNTY",
                                "alias": ""
                            },
                            {
                                "column": "CARDNOINSTRUCTION",
                                "alias": ""
                            },
                            {
                                "column": "BIRTHDATE",
                                "alias": ""
                            },
                            {
                                "column": "ISSUEDATE",
                                "alias": ""
                            },
                            {
                                "column": "PREFERENTIALTYPE",
                                "alias": ""
                            },
                            {
                                "column": "ISMEMBER",
                                "alias": ""
                            },
                            {
                                "column": "CONTACTCARDTYPE",
                                "alias": ""
                            },
                            {
                                "column": "DEADPIC",
                                "alias": ""
                            }
                        ]
                    }
                ],
                "outputConfigurations": [
                    {
                        "id": "output",
                        "fields": [
                            {
                                "column": "MZBZXX0101",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0102",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0104",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0105",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0106",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0107",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0109",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0110",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0111",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0112",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0114",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0115",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0116",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0117",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0118",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0119",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0120",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0121",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0122",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0124",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0125",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0126",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0127",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0128",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0129",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0130",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0131",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0132",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0133",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0134",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0135",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0136",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0137",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0138",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0139",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0140",
                                "alias": ""
                            },
                            {
                                "column": "inserttime",
                                "alias": ""
                            }
                        ]
                    }
                ]
            },
            {
                "id": "transform_1",
                "name": "标准转换",
                "type": "transform",
                "x": 854,
                "y": 123,
                "otherConfigurations": {
                    "sessionCache": "",
                    "interceptor": "",
                    "expressions": [
                        "lookupInStandard('证件类别_殡葬信息系统',MZBZXX0102,'') as MZBZXX0103",
                        "lookupInStandard('性别__殡葬信息系统',MZBZXX0107,'') as MZBZXX0108",
                        "lookupInStandard('民族_社会救助管理平台',MZBZXX0112,'') as MZBZXX0113",
                        "lookupInStandard('区县_殡葬信息系统',MZBZXX0122,'') as MZBZXX0123"
                    ]
                },
                "inputConfigurations": [
                    {
                        "id": "input",
                        "fields": [
                            {
                                "column": "MZBZXX0101",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0102",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0104",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0105",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0106",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0107",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0109",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0110",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0111",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0112",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0114",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0115",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0116",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0117",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0118",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0119",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0120",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0121",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0122",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0124",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0125",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0126",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0127",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0128",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0129",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0130",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0131",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0132",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0133",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0134",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0135",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0136",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0137",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0138",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0139",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0140",
                                "alias": ""
                            },
                            {
                                "column": "inserttime",
                                "alias": ""
                            }
                        ]
                    }
                ],
                "outputConfigurations": [
                    {
                        "id": "output",
                        "fields": [
                            {
                                "column": "MZBZXX0101",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0102",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0104",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0105",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0106",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0107",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0109",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0110",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0111",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0112",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0114",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0115",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0116",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0117",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0118",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0119",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0120",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0121",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0122",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0124",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0125",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0126",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0127",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0128",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0129",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0130",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0131",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0132",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0133",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0134",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0135",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0136",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0137",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0138",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0139",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0140",
                                "alias": ""
                            },
                            {
                                "column": "inserttime",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0103",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0108",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0113",
                                "alias": ""
                            },
                            {
                                "column": "MZBZXX0123",
                                "alias": ""
                            }
                        ]
                    }
                ]
            }
        ]
    },
    "nodeSetVisible": true,
    "dbStatus": "1",
    "oldName": "标准转换",
    "btnStatus": false
}