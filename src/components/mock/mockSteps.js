export let steps =  [{
    "id": "source_1",
    "name": "source_1",
    "type": "source",
    "x": 201,
    "y": 240,
    "otherConfigurations": {
        "schema": "shiy_student_schema",
        "schemaId": "ef0aa6f1-559a-465f-b1e7-730ffc68248d",
        "sessionCache": "",
        "datasetId": "a6b37fab-22f7-4b21-b1de-2e631ff854cb",
        "interceptor": "",
        "dataset": "shiy_student_dataset"
    },
    "outputConfigurations": [{
        "id": "output",
        "fields": [{
            "type": "string",
            "alias": "",
            "description": "",
            "column": "sId"
        },
        {
            "type": "string",
            "alias": "",
            "description": "",
            "column": "sName"
        },
        {
            "type": "string",
            "alias": "",
            "description": "",
            "column": "sex"
        },
        {
            "type": "int",
            "alias": "",
            "description": "",
            "column": "age"
        },
        {
            "type": "string",
            "alias": "",
            "description": "",
            "column": "class"
        }]
    }]
},
{
    "id": "sink_2",
    "name": "sink_2",
    "type": "sink",
    "x": 871,
    "y": 272,
    "otherConfigurations": {
        "schema": "shiy_test_transform",
        "resourceId": "444e1f95-5c12-4df8-8225-b80fae5b67d8",
        "brokers": "",
        "columns": "",
        "groupId": "",
        "description": "",
        "sessionCache": "",
        "interceptor": "",
        "type": "HDFS",
        "nullValue": "",
        "mode": "overwrite",
        "path": "/tmp/shiy/output20190130",
        "password": "",
        "datasetId": "a6d26042-1638-4e74-8067-ad69de95b735",
        "table": "",
        "dataResource": "outputs",
        "quoteChar": "\"",
        "escapeChar": "\\",
        "sliceTimeColumn": "",
        "partitionColumns": "",
        "format": "csv",
        "maxFileSize": "",
        "maxFileNumber": "",
        "separator": ",",
        "url": "",
        "expiredTime": "0",
        "driver": "",
        "schemaId": "8c4febac-e1f2-41d5-809d-61a3bd7cb4fa",
        "namespace": "",
        "topic": "",
        "dataset": "shiy_test_transform_output",
        "user": "",
        "sliceType": "",
        "specifiedStringColumnTypes": []
    },
    "inputConfigurations": [{
        "id": "input",
        "fields": [{
            "column": "sId",
            "alias": ""
        },
        {
            "column": "sName",
            "alias": ""
        },
        {
            "column": "sex",
            "alias": ""
        },
        {
            "column": "age",
            "alias": ""
        },
        {
            "column": "class",
            "alias": ""
        },
        {
            "column": "flag",
            "alias": ""
        }]
    }],
    "outputConfigurations": [{
        "id": "output",
        "fields": []
    }]
},
{
    "id": "transform_3",
    "name": "transform_3",
    "type": "transform",
    "x": 637,
    "y": 239,
    "otherConfigurations": {
        "sessionCache": "",
        "interceptor": "",
        "expressions": ["case when age > #{tAgeParam:2} then 1 else 0 end as flag"]
    },
    "inputConfigurations": [{
        "id": "input",
        "fields": [{
            "type": "string",
            "alias": "",
            "description": "",
            "column": "sId"
        },
        {
            "type": "string",
            "alias": "",
            "description": "",
            "column": "sName"
        },
        {
            "type": "string",
            "alias": "",
            "description": "",
            "column": "sex"
        },
        {
            "type": "int",
            "alias": "",
            "description": "",
            "column": "age"
        },
        {
            "type": "string",
            "alias": "",
            "description": "",
            "column": "class"
        }]
    }],
    "outputConfigurations": [{
        "id": "output",
        "fields": [{
            "column": "sId",
            "alias": ""
        },
        {
            "column": "sName",
            "alias": ""
        },
        {
            "column": "sex",
            "alias": ""
        },
        {
            "column": "age",
            "alias": ""
        },
        {
            "column": "class",
            "alias": ""
        },
        {
            "column": "flag",
            "alias": ""
        }]
    }]
},
{
    "id": "filter_4",
    "name": "filter_4",
    "type": "filter",
    "x": 425,
    "y": 328,
    "otherConfigurations": {
        "condition": "age > #{varAge:1}",
        "sessionCache": "",
        "interceptor": ""
    },
    "inputConfigurations": [{
        "id": "input",
        "fields": [{
            "type": "string",
            "alias": "",
            "description": "",
            "column": "sId"
        },
        {
            "type": "string",
            "alias": "",
            "description": "",
            "column": "sName"
        },
        {
            "type": "string",
            "alias": "",
            "description": "",
            "column": "sex"
        },
        {
            "type": "int",
            "alias": "",
            "description": "",
            "column": "age"
        },
        {
            "type": "string",
            "alias": "",
            "description": "",
            "column": "class"
        }]
    }],
    "outputConfigurations": [{
        "id": "output",
        "fields": [{
            "column": "sId",
            "alias": ""
        },
        {
            "column": "sName",
            "alias": ""
        },
        {
            "column": "sex",
            "alias": ""
        },
        {
            "column": "age",
            "alias": ""
        },
        {
            "column": "class",
            "alias": ""
        }]
    }]
}]

export let links =  [{
    "name": "con_36",
    "source": "source_1",
    "sourceOutput": "output",
    "target": "filter_4",
    "targetInput": "input",
    "input": "input"
},
{
    "name": "con_37",
    "source": "transform_3",
    "sourceOutput": "output",
    "target": "sink_2",
    "targetInput": "input",
    "input": "input"
},
{
    "name": "con_38",
    "source": "filter_4",
    "sourceOutput": "output",
    "target": "transform_3",
    "targetInput": "input",
    "input": "input"
}]
export let json1 = [
    {"id":"2e5ca6b7-57ad-4970-9c75-eb5660fca1f5","name":"cs_bank_关键指标表-负债余额","flowType":"dataflow","steps":[{"id":"source_0","name":"source_0","type":"source","x":74,"y":40,"otherConfigurations":{"schema":"cs_bank_gjzbb","schemaId":"a2cae971-f19b-4195-9e67-4b876e86ee73","datasetId":"fb99ffbb-cbd0-4334-a5ba-fb8b69397685","dataset":"cs_bank_gjzbb"},"outputConfigurations":[{"id":"output","fields":[{"column":"sjrq","alias":""},{"column":"tjsj","alias":""},{"column":"zcye","alias":""},{"column":"fzye","alias":""},{"column":"ckye","alias":""},{"column":"dkye","alias":""},{"column":"jgbh","alias":""}]}]},{"id":"transform_3","name":"transform_3","type":"transform","x":831,"y":251,"otherConfigurations":{"expressions":["case when substr(tjsj,1,4)='2015' then abs(fzye-a)/a else abs(fzye-b)/b end as bnc1","case when bnc1 is null then 0 else bnc1 end as bnc2"]},"inputConfigurations":[{"id":"input","fields":[{"column":"sjrq"},{"column":"tjsj"},{"column":"zcye"},{"column":"fzye"},{"column":"ckye"},{"column":"dkye"},{"column":"jgbh"},{"column":"a"},{"column":"b"}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"sjrq","alias":""},{"column":"tjsj","alias":""},{"column":"bnc2","alias":"bnc_fzye"}]}]},{"id":"filter_0","name":"filter_0","type":"filter","x":300,"y":310,"otherConfigurations":{"condition":"tjsj = '20150101'"},"inputConfigurations":[{"id":"input","fields":[{"column":"sjrq","alias":""},{"column":"tjsj","alias":""},{"column":"zcye","alias":""},{"column":"fzye","alias":""},{"column":"ckye","alias":""},{"column":"dkye","alias":""},{"column":"jgbh","alias":""}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"fzye","alias":"a"},{"column":"jgbh","alias":""}]}]},{"id":"join_0","name":"join_0","type":"join","x":374,"y":160,"otherConfigurations":{"joinType":"inner","joinConditions":[{"leftColumn":"jgbh","rightColumn":"jgbh","op":"="}]},"inputConfigurations":[{"id":"left","fields":[{"column":"sjrq"},{"column":"tjsj"},{"column":"zcye"},{"column":"fzye"},{"column":"ckye"},{"column":"dkye"},{"column":"jgbh"}]},{"id":"right","fields":[{"column":"a"},{"column":"jgbh"}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"left_sjrq","alias":"sjrq"},{"column":"left_tjsj","alias":"tjsj"},{"column":"left_zcye","alias":"zcye"},{"column":"left_fzye","alias":"fzye"},{"column":"left_ckye","alias":"ckye"},{"column":"left_dkye","alias":"dkye"},{"column":"left_jgbh","alias":"left_jgbh"},{"column":"right_a","alias":"a"},{"column":"right_jgbh","alias":"right_jgbh"}]}]},{"id":"filter_1","name":"filter_1","type":"filter","x":520,"y":387,"otherConfigurations":{"condition":"tjsj = '20160101'"},"inputConfigurations":[{"id":"input","fields":[{"column":"sjrq"},{"column":"tjsj"},{"column":"zcye"},{"column":"fzye"},{"column":"ckye"},{"column":"dkye"},{"column":"left_jgbh"},{"column":"a"},{"column":"right_jgbh"}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"sjrq","alias":""},{"column":"tjsj","alias":""},{"column":"zcye","alias":""},{"column":"fzye","alias":"b"},{"column":"ckye","alias":""},{"column":"dkye","alias":""},{"column":"left_jgbh","alias":"jgbh"},{"column":"a","alias":""}]}]},{"id":"join_1","name":"join_1","type":"join","x":640,"y":250,"otherConfigurations":{"joinType":"inner","joinConditions":[{"leftColumn":"jgbh","rightColumn":"jgbh","op":"="}]},"inputConfigurations":[{"id":"left","fields":[{"column":"sjrq"},{"column":"tjsj"},{"column":"zcye"},{"column":"fzye"},{"column":"ckye"},{"column":"dkye"},{"column":"left_jgbh","alias":"jgbh"},{"column":"a"}]},{"id":"right","fields":[{"column":"b"},{"column":"jgbh"}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"left_sjrq","alias":"sjrq"},{"column":"left_tjsj","alias":"tjsj"},{"column":"left_zcye","alias":"zcye"},{"column":"left_fzye","alias":"fzye"},{"column":"left_ckye","alias":"ckye"},{"column":"left_dkye","alias":"dkye"},{"column":"left_jgbh","alias":"jgbh"},{"column":"left_a","alias":"a"},{"column":"right_b","alias":"b"}]}]},{"id":"sql_0","name":"sql_0","type":"sql","x":332,"y":40,"otherConfigurations":{"sql":"select * ,substr(tjsj,5,8) as date1 from input"},"inputConfigurations":[{"id":"input","fields":[{"column":"sjrq","alias":""},{"column":"tjsj","alias":""},{"column":"zcye","alias":""},{"column":"fzye","alias":""},{"column":"ckye","alias":""},{"column":"dkye","alias":""},{"column":"jgbh","alias":""}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"sjrq","alias":""},{"column":"fzye","alias":""},{"column":"tjsj","alias":""},{"column":"jgbh","alias":""},{"column":"date1","alias":""}]}]},{"id":"transform_7","name":"transform_7","type":"transform","x":834,"y":40,"otherConfigurations":{"expressions":["abs(fzye- fzye_new)/ fzye_new as tb_fzye1","case when tjsj=20160229 or tjsj like '2015%'  or tb_fzye1 is null then 0   else  tb_fzye1  end as tb_fzye"]},"inputConfigurations":[{"id":"input","fields":[{"column":"sjrq"},{"column":"tjsj"},{"column":"fzye"},{"column":"fzye_new"},{"column":"jgbh"}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"sjrq","alias":""},{"column":"tjsj","alias":""},{"column":"tb_fzye","alias":""}]}]},{"id":"sink_0","name":"sink_0","type":"sink","x":1280,"y":180,"otherConfigurations":{"schema":"cs_bank_gjzbb_fzye","brokers":"","columns":"","groupId":"","description":"","type":"HDFS","sql":"","mode":"overwrite","path":"/tmp/new_sxh/out/cs_bank_gjzbb_fzye1","password":"123456","datasetId":"5bf0ae39-4a2f-4db1-9795-7492dc680084","table":"gjzbb_fzye","quoteChar":"\"","escapeChar":"\\","sliceTimeColumn":"","partitionColumns":"","format":"csv","separator":",","url":"jdbc:mysql://192.168.1.75:3306/carpo","expiredTime":0,"driver":"com.mysql.jdbc.Driver","schemaId":"880cd2c9-342c-4c44-a0c9-8db044b50f7f","namespace":"","topic":"","dataset":"cs_bank_gjzbb_fzye","user":"root","sliceType":"H"},"inputConfigurations":[{"id":"input","fields":[{"column":"sjrq"},{"column":"tjsj"},{"column":"tb_fzye"},{"column":"bnc_fzye"}]}]},{"id":"top_0","name":"top_0","type":"top","x":526,"y":40,"otherConfigurations":{"limit":"1000","orderBy":["sjrq asc"],"groupBy":["date1"],"limitType":"ROW_COUNT"},"inputConfigurations":[{"id":"input","fields":[{"column":"sjrq","alias":""},{"column":"tjsj"},{"column":"fzye"},{"column":"date1"},{"column":"jgbh","alias":""}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"sjrq","alias":""},{"column":"tjsj","alias":""},{"column":"fzye","alias":""},{"column":"jgbh","alias":""}]}]},{"id":"sql_2","name":"sql_2","type":"sql","x":689,"y":40,"otherConfigurations":{"sql":"select * ,lag(fzye,1,0) over(order by sjrq) as fzye_new from input"},"inputConfigurations":[{"id":"input","fields":[{"column":"sjrq","alias":""},{"column":"tjsj"},{"column":"fzye"},{"column":"jgbh","alias":""}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"sjrq","alias":""},{"column":"tjsj","alias":""},{"column":"fzye","alias":""},{"column":"jgbh","alias":""},{"column":"fzye_new","alias":""}]}]},{"id":"join_2","name":"join_2","type":"join","x":1000,"y":180,"otherConfigurations":{"joinType":"inner","joinConditions":[{"leftColumn":"sjrq","rightColumn":"sjrq","op":"="},{"leftColumn":"tjsj","rightColumn":"tjsj","op":"="}]},"inputConfigurations":[{"id":"left","fields":[{"column":"sjrq","alias":""},{"column":"tjsj"},{"column":"tb_fzye"}]},{"id":"right","fields":[{"column":"sjrq","alias":""},{"column":"tjsj"},{"column":"bnc_fzye"}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"left_sjrq","alias":"sjrq"},{"column":"left_tjsj","alias":"tjsj"},{"column":"left_tb_fzye","alias":"tb_fzye"},{"column":"right_bnc_fzye","alias":"bnc_fzye"}]}]},{"id":"top_1","name":"top_1","type":"top","x":1020,"y":40,"otherConfigurations":{"limit":"1000","orderBy":["tjsj asc"],"groupBy":["sjrq"],"limitType":"ROW_COUNT"},"inputConfigurations":[{"id":"input","fields":[{"column":"sjrq","alias":""},{"column":"tjsj","alias":""},{"column":"tb_fzye","alias":""}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"sjrq","alias":""},{"column":"tjsj","alias":""},{"column":"tb_fzye","alias":""}]}]},{"id":"top_2","name":"top_2","type":"top","x":1140,"y":180,"otherConfigurations":{"limit":"1000","orderBy":["tjsj asc"],"groupBy":["sjrq"],"limitType":"ROW_COUNT"},"inputConfigurations":[{"id":"input","fields":[{"column":"sjrq"},{"column":"tjsj"},{"column":"tb_fzye"},{"column":"bnc_fzye"}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"sjrq","alias":""},{"column":"tjsj","alias":""},{"column":"tb_fzye","alias":""},{"column":"bnc_fzye","alias":""}]}]}],"links":[{"name":"","source":"source_0","sourceOutput":"output","target":"filter_0","targetInput":"input","input":"input"},{"name":"","source":"source_0","sourceOutput":"output","target":"join_0","targetInput":"left","input":"left"},{"name":"","source":"filter_0","sourceOutput":"output","target":"join_0","targetInput":"right","input":"right"},{"name":"","source":"join_0","sourceOutput":"output","target":"filter_1","targetInput":"input","input":"input"},{"name":"","source":"filter_1","sourceOutput":"output","target":"join_1","targetInput":"right","input":"right"},{"name":"","source":"join_0","sourceOutput":"output","target":"join_1","targetInput":"left","input":"left"},{"name":"","source":"join_1","sourceOutput":"output","target":"transform_3","targetInput":"input","input":"input"},{"name":"","source":"source_0","sourceOutput":"output","target":"sql_0","targetInput":"input","input":"input"},{"name":"","source":"sql_0","sourceOutput":"output","target":"top_0","targetInput":"input","input":"input"},{"name":"","source":"top_0","sourceOutput":"output","target":"sql_2","targetInput":"input","input":"input"},{"name":"","source":"sql_2","sourceOutput":"output","target":"transform_7","targetInput":"input","input":"input"},{"name":"","source":"transform_3","sourceOutput":"output","target":"join_2","targetInput":"right","input":"right"},{"name":"","source":"transform_7","sourceOutput":"output","target":"top_1","targetInput":"input","input":"input"},{"name":"","source":"top_1","sourceOutput":"output","target":"join_2","targetInput":"left","input":"left"},{"name":"","source":"join_2","sourceOutput":"output","target":"top_2","targetInput":"input","input":"input"},{"name":"","source":"top_2","sourceOutput":"output","target":"sink_0","targetInput":"input","input":"input"}],"oid":"$null","creator":"import","createTime":1498309078000,"lastModifier":"import","lastModifiedTime":1514885496000,"owner":"a9e241d3-0988-4bcf-9e90-4e44fad31d54","version":0,"enabled":1,"moduleVersion":161111,"tenant":{"id":"2d7ad891-41c5-4fba-9ff2-03aef3c729e5","name":"default","creator":"root","createTime":1532942318000,"lastModifier":"f8aff341-9303-4135-b393-1d322e4638e2","lastModifiedTime":1544078372000,"owner":"f8aff341-9303-4135-b393-1d322e4638e2","version":0,"moduleVersion":0,"enabled":1,"resourceQueues":["default","merce.normal"],"hdfsSpaceQuota":0,"zid":"","expiredPeriod":0},"tableName":"merce_flow","isHide":0,"expiredPeriod":0}
,{"id":"f6469bbd-7500-47ab-aae1-a5cddaefb78e","name":"gbj_transform_土葬数据_189","flowType":"dataflow","steps":[{"id":"source_1","name":"原始土葬数据","type":"source","x":61,"y":206,"otherConfigurations":{"schema":"gbj_use_土葬数据BURIAL_DEATH_189","schemaId":"8b2899fa-9f13-42b2-9180-2cbbfbae855f","sessionCache":"","datasetId":"d8d7116e-15eb-4269-ab56-5fe83b0c76c0","interceptor":"","dataset":"gbj_use _土葬数据_dataset"},"outputConfigurations":[{"id":"output","fields":[{"type":"string","alias":"","description":"","column":"NAME"},{"type":"string","alias":"","description":"","column":"SEX"},{"type":"string","alias":"","description":"","column":"AGE"},{"type":"string","alias":"","description":"","column":"CERTIFICATES_NUMBER"},{"type":"string","alias":"","description":"","column":"NATION"},{"type":"string","alias":"","description":"","column":"RESIDENCE_ADDRESS"},{"type":"date","alias":"","description":"","column":"DEATH_DATE"},{"type":"string","alias":"","description":"","column":"DEATH_SOURCE"},{"type":"date","alias":"","description":"","column":"BURIAL_TIME"},{"type":"string","alias":"","description":"","column":"REMARK"},{"type":"int","alias":"","description":"","column":"CHANGE_FLAG"},{"type":"string","alias":"","description":"","column":"AREA"},{"type":"string","alias":"","description":"","column":"ARRANGE"},{"type":"string","alias":"","description":"","column":"NUMNO"},{"type":"string","alias":"","description":"","column":"TOMBS_TYPE"},{"type":"string","alias":"","description":"","column":"APPLICANT_NAME"},{"type":"string","alias":"","description":"","column":"RELATIONSHIP_DEAD"},{"type":"date","alias":"","description":"","column":"CREATE_DATE"},{"type":"int","alias":"","description":"","column":"ID"}]}]},{"id":"transform_4","name":"姓名证件号码去空格","type":"transform","x":430,"y":206,"otherConfigurations":{"sessionCache":"","interceptor":"","expressions":["regexp_replace(NAME,' ', '') as NAME1","regexp_replace(CERTIFICATES_NUMBER,' ', '') as CERTIFICATES_NUMBER1"]},"inputConfigurations":[{"id":"input","fields":[{"column":"NAME","alias":""},{"column":"SEX","alias":""},{"column":"AGE","alias":""},{"column":"CERTIFICATES_NUMBER","alias":""},{"column":"NATION","alias":""},{"column":"RESIDENCE_ADDRESS","alias":""},{"column":"DEATH_DATE","alias":""},{"column":"DEATH_SOURCE","alias":""},{"column":"BURIAL_TIME","alias":""},{"column":"REMARK","alias":""},{"column":"CHANGE_FLAG","alias":""},{"column":"AREA","alias":""},{"column":"ARRANGE","alias":""},{"column":"NUMNO","alias":""},{"column":"TOMBS_TYPE","alias":""},{"column":"APPLICANT_NAME","alias":""},{"column":"RELATIONSHIP_DEAD","alias":""},{"column":"CREATE_DATE","alias":""},{"column":"ID","alias":""}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"NAME","alias":""},{"column":"SEX","alias":""},{"column":"AGE","alias":""},{"column":"CERTIFICATES_NUMBER","alias":""},{"column":"NATION","alias":""},{"column":"RESIDENCE_ADDRESS","alias":""},{"column":"DEATH_DATE","alias":""},{"column":"DEATH_SOURCE","alias":""},{"column":"BURIAL_TIME","alias":""},{"column":"REMARK","alias":""},{"column":"CHANGE_FLAG","alias":""},{"column":"AREA","alias":""},{"column":"ARRANGE","alias":""},{"column":"NUMNO","alias":""},{"column":"TOMBS_TYPE","alias":""},{"column":"APPLICANT_NAME","alias":""},{"column":"RELATIONSHIP_DEAD","alias":""},{"column":"CREATE_DATE","alias":""},{"column":"ID","alias":""},{"column":"NAME1","alias":"姓名(去空格)"},{"column":"CERTIFICATES_NUMBER1","alias":"证件号(去空格)"}]}]},{"id":"sink_1","name":"sink_1","type":"sink","x":814,"y":205,"otherConfigurations":{"schema":"土葬数据_schema","brokers":"","columns":"","groupId":"","description":"","sessionCache":"","interceptor":"","type":"HDFS","nullValue":"","mode":"overwrite","path":"/tmp/gbj/output/gbj_use_土葬数据_output_not_exist_189","password":"","datasetId":"42e0132d-ad45-4aa6-8257-9264b32273d4","table":"","quoteChar":"\"","escapeChar":"\\","sliceTimeColumn":"","partitionColumns":"","format":"csv","maxFileSize":"","maxFileNumber":"","separator":",","url":"","expiredTime":"0","driver":"","schemaId":"d51fb1f6-6daa-49dc-9d5e-6fc46ce3f74b","namespace":"","topic":"","dataset":"gbj_use_土葬数据_output_not_exist_189","user":"","sliceType":"","specifiedStringColumnTypes":[]},"inputConfigurations":[{"id":"input","fields":[{"column":"NAME","alias":""},{"column":"SEX","alias":""},{"column":"AGE","alias":""},{"column":"CERTIFICATES_NUMBER","alias":""},{"column":"NATION","alias":""},{"column":"RESIDENCE_ADDRESS","alias":""},{"column":"DEATH_DATE","alias":""},{"column":"DEATH_SOURCE","alias":""},{"column":"BURIAL_TIME","alias":""},{"column":"REMARK","alias":""},{"column":"CHANGE_FLAG","alias":""},{"column":"AREA","alias":""},{"column":"ARRANGE","alias":""},{"column":"NUMNO","alias":""},{"column":"TOMBS_TYPE","alias":""},{"column":"APPLICANT_NAME","alias":""},{"column":"RELATIONSHIP_DEAD","alias":""},{"column":"CREATE_DATE","alias":""},{"column":"ID","alias":""},{"column":"姓名(去空格)","alias":""},{"column":"证件号(去空格)","alias":""}]}],"outputConfigurations":[{"id":"output","fields":[]}]}],"links":[{"name":"con_12","source":"source_1","sourceOutput":"output","target":"transform_4","targetInput":"input","input":"input"},{"name":"con_13","source":"transform_4","sourceOutput":"output","target":"sink_1","targetInput":"input","input":"input"}],"inputs":[],"outputs":[],"dependencies":[],"oid":"$null","creator":"admin","createTime":1550024628000,"lastModifier":"admin","lastModifiedTime":1557214243000,"owner":"2059750c-a300-4b64-84a6-e8b086dbfd42","version":18,"enabled":1,"moduleVersion":0,"tenant":{"id":"2d7ad891-41c5-4fba-9ff2-03aef3c729e5","name":"default","creator":"root","createTime":1532942318000,"lastModifier":"f8aff341-9303-4135-b393-1d322e4638e2","lastModifiedTime":1544078372000,"owner":"f8aff341-9303-4135-b393-1d322e4638e2","version":0,"moduleVersion":0,"enabled":1,"resourceQueues":["default","merce.normal"],"hdfsSpaceQuota":0,"zid":"","expiredPeriod":0},"tableName":"merce_flow","isHide":0,"parameters":[],"expiredPeriod":0}
] 
export let json = {"id":"f6469bbd-7500-47ab-aae1-a5cddaefb78e","name":"gbj_transform_土葬数据_189","flowType":"dataflow","steps":[{"id":"source_1","name":"原始土葬数据","type":"source","x":61,"y":206,"otherConfigurations":{"schema":"gbj_use_土葬数据BURIAL_DEATH_189","schemaId":"8b2899fa-9f13-42b2-9180-2cbbfbae855f","sessionCache":"","datasetId":"d8d7116e-15eb-4269-ab56-5fe83b0c76c0","interceptor":"","dataset":"gbj_use _土葬数据_dataset"},"outputConfigurations":[{"id":"output","fields":[{"type":"string","alias":"","description":"","column":"NAME"},{"type":"string","alias":"","description":"","column":"SEX"},{"type":"string","alias":"","description":"","column":"AGE"},{"type":"string","alias":"","description":"","column":"CERTIFICATES_NUMBER"},{"type":"string","alias":"","description":"","column":"NATION"},{"type":"string","alias":"","description":"","column":"RESIDENCE_ADDRESS"},{"type":"date","alias":"","description":"","column":"DEATH_DATE"},{"type":"string","alias":"","description":"","column":"DEATH_SOURCE"},{"type":"date","alias":"","description":"","column":"BURIAL_TIME"},{"type":"string","alias":"","description":"","column":"REMARK"},{"type":"int","alias":"","description":"","column":"CHANGE_FLAG"},{"type":"string","alias":"","description":"","column":"AREA"},{"type":"string","alias":"","description":"","column":"ARRANGE"},{"type":"string","alias":"","description":"","column":"NUMNO"},{"type":"string","alias":"","description":"","column":"TOMBS_TYPE"},{"type":"string","alias":"","description":"","column":"APPLICANT_NAME"},{"type":"string","alias":"","description":"","column":"RELATIONSHIP_DEAD"},{"type":"date","alias":"","description":"","column":"CREATE_DATE"},{"type":"int","alias":"","description":"","column":"ID"}]}]},{"id":"transform_4","name":"姓名证件号码去空格","type":"transform","x":430,"y":206,"otherConfigurations":{"sessionCache":"","interceptor":"","expressions":["regexp_replace(NAME,' ', '') as NAME1","regexp_replace(CERTIFICATES_NUMBER,' ', '') as CERTIFICATES_NUMBER1"]},"inputConfigurations":[{"id":"input","fields":[{"column":"NAME","alias":""},{"column":"SEX","alias":""},{"column":"AGE","alias":""},{"column":"CERTIFICATES_NUMBER","alias":""},{"column":"NATION","alias":""},{"column":"RESIDENCE_ADDRESS","alias":""},{"column":"DEATH_DATE","alias":""},{"column":"DEATH_SOURCE","alias":""},{"column":"BURIAL_TIME","alias":""},{"column":"REMARK","alias":""},{"column":"CHANGE_FLAG","alias":""},{"column":"AREA","alias":""},{"column":"ARRANGE","alias":""},{"column":"NUMNO","alias":""},{"column":"TOMBS_TYPE","alias":""},{"column":"APPLICANT_NAME","alias":""},{"column":"RELATIONSHIP_DEAD","alias":""},{"column":"CREATE_DATE","alias":""},{"column":"ID","alias":""}]}],"outputConfigurations":[{"id":"output","fields":[{"column":"NAME","alias":""},{"column":"SEX","alias":""},{"column":"AGE","alias":""},{"column":"CERTIFICATES_NUMBER","alias":""},{"column":"NATION","alias":""},{"column":"RESIDENCE_ADDRESS","alias":""},{"column":"DEATH_DATE","alias":""},{"column":"DEATH_SOURCE","alias":""},{"column":"BURIAL_TIME","alias":""},{"column":"REMARK","alias":""},{"column":"CHANGE_FLAG","alias":""},{"column":"AREA","alias":""},{"column":"ARRANGE","alias":""},{"column":"NUMNO","alias":""},{"column":"TOMBS_TYPE","alias":""},{"column":"APPLICANT_NAME","alias":""},{"column":"RELATIONSHIP_DEAD","alias":""},{"column":"CREATE_DATE","alias":""},{"column":"ID","alias":""},{"column":"NAME1","alias":"姓名(去空格)"},{"column":"CERTIFICATES_NUMBER1","alias":"证件号(去空格)"}]}]},{"id":"sink_1","name":"sink_1","type":"sink","x":814,"y":205,"otherConfigurations":{"schema":"土葬数据_schema","brokers":"","columns":"","groupId":"","description":"","sessionCache":"","interceptor":"","type":"HDFS","nullValue":"","mode":"overwrite","path":"/tmp/gbj/output/gbj_use_土葬数据_output_not_exist_189","password":"","datasetId":"42e0132d-ad45-4aa6-8257-9264b32273d4","table":"","quoteChar":"\"","escapeChar":"\\","sliceTimeColumn":"","partitionColumns":"","format":"csv","maxFileSize":"","maxFileNumber":"","separator":",","url":"","expiredTime":"0","driver":"","schemaId":"d51fb1f6-6daa-49dc-9d5e-6fc46ce3f74b","namespace":"","topic":"","dataset":"gbj_use_土葬数据_output_not_exist_189","user":"","sliceType":"","specifiedStringColumnTypes":[]},"inputConfigurations":[{"id":"input","fields":[{"column":"NAME","alias":""},{"column":"SEX","alias":""},{"column":"AGE","alias":""},{"column":"CERTIFICATES_NUMBER","alias":""},{"column":"NATION","alias":""},{"column":"RESIDENCE_ADDRESS","alias":""},{"column":"DEATH_DATE","alias":""},{"column":"DEATH_SOURCE","alias":""},{"column":"BURIAL_TIME","alias":""},{"column":"REMARK","alias":""},{"column":"CHANGE_FLAG","alias":""},{"column":"AREA","alias":""},{"column":"ARRANGE","alias":""},{"column":"NUMNO","alias":""},{"column":"TOMBS_TYPE","alias":""},{"column":"APPLICANT_NAME","alias":""},{"column":"RELATIONSHIP_DEAD","alias":""},{"column":"CREATE_DATE","alias":""},{"column":"ID","alias":""},{"column":"姓名(去空格)","alias":""},{"column":"证件号(去空格)","alias":""}]}],"outputConfigurations":[{"id":"output","fields":[]}]}],"links":[{"name":"con_12","source":"source_1","sourceOutput":"output","target":"transform_4","targetInput":"input","input":"input"},{"name":"con_13","source":"transform_4","sourceOutput":"output","target":"sink_1","targetInput":"input","input":"input"}],"inputs":[],"outputs":[],"dependencies":[],"oid":"$null","creator":"admin","createTime":1550024628000,"lastModifier":"admin","lastModifiedTime":1557214243000,"owner":"2059750c-a300-4b64-84a6-e8b086dbfd42","version":18,"enabled":1,"moduleVersion":0,"tenant":{"id":"2d7ad891-41c5-4fba-9ff2-03aef3c729e5","name":"default","creator":"root","createTime":1532942318000,"lastModifier":"f8aff341-9303-4135-b393-1d322e4638e2","lastModifiedTime":1544078372000,"owner":"f8aff341-9303-4135-b393-1d322e4638e2","version":0,"moduleVersion":0,"enabled":1,"resourceQueues":["default","merce.normal"],"hdfsSpaceQuota":0,"zid":"","expiredPeriod":0},"tableName":"merce_flow","isHide":0,"parameters":[],"expiredPeriod":0}
export let stepsJson = {
                            "id": "custom", 
                            "tags": [
                                "custom", 
                                "dataflow"
                            ], 
                            "type": "custom", 
                            "name":"custom",
                            "inputConfigurations": [
                                {
                                    "id": "", 
                                    "fields": []
                                }
                            ], 
                            "outputConfigurations": [
                                {
                                    "id": "", 
                                    "fields": []
                                }
                            ], 
                            "otherConfigurations": {
                                "expressions": [],
                                "interceptor":"",
                                "sessionCache":""
                            }
                        }
export let list = 
{
    "content": [
        {

        "id": "aa27486d-4886-4408-8058-08695011c85a",
        "name": "自然人基础信息_new",
        "flowType": "dataflow",
        "steps": [
            {
            "id": "source_1",
            "name": "PO_TRANSIENT_POPULATION_130_公安库_暂住",
            "type": "source",
            "x": 0,
            "y": 0,
            "otherConfigurations": {
                "schema": "PO_TRANSIENT_POPULATION_130_公安库",
                "schemaId": "3b1bd20d-dabe-43b0-b1ca-fb5ac7c93eb0",
                "sessionCache": "",
                "ignoreMissingPath": false,
                "datasetId": "1e1fe5fa-29a5-4f89-a8ce-3eb3dd4cace5",
                "interceptor": "",
                "dataset": "PO_TRANSIENT_POPULATION_130_公安库"
            },
            "outputConfigurations": [{
                "id": "output",
                "fields": [{
                    "column": "NAME",
                    "alias": ""
                },
                {
                    "column": "IDENTITY_CARD_NUMBER",
                    "alias": ""
                },
                {
                    "column": "SEX",
                    "alias": ""
                },
                {
                    "column": "NATION",
                    "alias": ""
                },
                {
                    "column": "BIRTHDATE",
                    "alias": ""
                },
                {
                    "column": "NATIVE_PLACE",
                    "alias": ""
                },
                {
                    "column": "ID",
                    "alias": ""
                },
                {
                    "column": "ADD_UNITS_CODE",
                    "alias": "SYN_TIME"
                }]
            }]
        },
        
        
        {
            "id": "sql_70",
            "name": "sql_70",
            "type": "sql",
            "x": 335,
            "y": 263,
            "otherConfigurations": {
                "sessionCache": "",
                "interceptor": "",
                "sql": "select distinct NAME_MAN\r\n,BIRTH_MAN\r\n,CERT_TYPE_MAN\r\n,CERT_NUM_MAN\r\n,NATION_MAN\r\n,FOLK_MAN\r\n,DEGREE_MAN\r\n,REG_SJ_MAN\r\n,REG_DS_MAN\r\n,REG_QX_MAN\r\n,REG_JX_MAN\r\n,ID\r\n from INPUT"
            },
            "inputConfigurations": [{
                "id": "input",
                "fields": [{
                    "column": "NAME_MAN",
                    "alias": ""
                },
                {
                    "column": "BIRTH_MAN",
                    "alias": ""
                },
                {
                    "column": "CERT_TYPE_MAN",
                    "alias": ""
                },
                {
                    "column": "CERT_NUM_MAN",
                    "alias": ""
                },
                {
                    "column": "NATION_MAN",
                    "alias": ""
                },
                {
                    "column": "FOLK_MAN",
                    "alias": ""
                },
                {
                    "column": "DEGREE_MAN",
                    "alias": ""
                },
                {
                    "column": "REG_SJ_MAN",
                    "alias": ""
                },
                {
                    "column": "REG_DS_MAN",
                    "alias": ""
                },
                {
                    "column": "REG_QX_MAN",
                    "alias": ""
                },
                {
                    "column": "REG_JX_MAN",
                    "alias": ""
                },
                {
                    "column": "ID",
                    "alias": ""
                },
                {
                    "column": "OP_DATE",
                    "alias": ""
                },
                {
                    "column": "resultInt",
                    "alias": ""
                }]
            }],
            "outputConfigurations": [{
                "id": "output",
                "fields": [{
                    "column": "NAME_MAN",
                    "alias": ""
                },
                {
                    "column": "BIRTH_MAN",
                    "alias": ""
                },
                {
                    "column": "CERT_TYPE_MAN",
                    "alias": ""
                },
                {
                    "column": "CERT_NUM_MAN",
                    "alias": ""
                },
                {
                    "column": "NATION_MAN",
                    "alias": ""
                },
                {
                    "column": "FOLK_MAN",
                    "alias": ""
                },
                {
                    "column": "DEGREE_MAN",
                    "alias": ""
                },
                {
                    "column": "REG_SJ_MAN",
                    "alias": ""
                },
                {
                    "column": "REG_DS_MAN",
                    "alias": ""
                },
                {
                    "column": "REG_QX_MAN",
                    "alias": ""
                },
                {
                    "column": "REG_JX_MAN",
                    "alias": ""
                },
                {
                    "column": "ID",
                    "alias": ""
                }]
            }]
        },
        {
            "id": "sink_13",
            "name": "sink_13",
            "type": "sink",
            "x": 1395,
            "y": 656,
            "otherConfigurations": {
                "schema": "sink_new_001",
                "brokers": "",
                "columns": "",
                "groupId": "",
                "description": "",
                "sessionCache": "",
                "interceptor": "",
                "type": "HDFS",
                "nullValue": "",
                "mode": "overwrite",
                "path": "/tmp/stest/sinko/111",
                "password": "",
                "datasetId": "ccc988cb-8004-432f-9f87-2d6063466823",
                "table": "",
                "schemaResourceId": "",
                "dataResource": "",
                "quoteChar": "\"",
                "escapeChar": "\\",
                "schemaResource": "",
                "datasetResourceId": "",
                "sliceTimeColumn": "",
                "partitionColumns": "",
                "format": "csv",
                "maxFileSize": "",
                "maxFileNumber": "",
                "separator": ",",
                "url": "",
                "expiredTime": "0",
                "driver": "",
                "schemaId": "8fc11356-15d1-4dbc-825a-0edba89d8c83",
                "namespace": "",
                "topic": "",
                "dataset": "sink_new_001",
                "user": "",
                "sliceType": "",
                "specifiedStringColumnTypes": []
            },
            "inputConfigurations": [{
                "id": "input",
                "fields": [{
                    "column": "MZJCK310102_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310105_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310112_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310113_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310108_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310110_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310101_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310103_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310104_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310106_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310107_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310114_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310115_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310116_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310117_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310118_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310119_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310120_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310121_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310122_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310123_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310124_GAZZ",
                    "alias": ""
                },
                {
                    "column": "GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310102_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310105_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310112_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310113_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310118_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310108_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310110_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310101_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310103_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310104_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310106_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310107_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310114_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310115_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310116_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310117_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310119_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310120_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310121_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310122_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310123_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310124_GACZ",
                    "alias": ""
                },
                {
                    "column": "GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310109_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310111_GAZZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310109_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310111_GACZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310102_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310105_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310112_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310118_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310110_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310116_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310120_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310101_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310103_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310113_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310114_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310115_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310119_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310122_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310123_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310124_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310106_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310107_SHJZ",
                    "alias": ""
                },
                {
                    "column": "SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310111_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310117_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310121_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310109_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310104_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310108_SHJZ",
                    "alias": ""
                },
                {
                    "column": "MZJCK310102_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310112_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310105_HDMAN",
                    "alias": ""
                },
                {
                    "column": "REG_SJ_MAN_HDMAN",
                    "alias": ""
                },
                {
                    "column": "REG_DS_MAN_HDMAN",
                    "alias": ""
                },
                {
                    "column": "REG_QX_MAN_HDMAN",
                    "alias": ""
                },
                {
                    "column": "REG_JX_MAN_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310103_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310110_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310114_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310120_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310101_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310106_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310107_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310113_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310116_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310117_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310119_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310124_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310122_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310123_HDMAN",
                    "alias": ""
                },
                {
                    "column": "HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310111_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310115_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310121_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310104_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310109_HDMAN",
                    "alias": ""
                },
                {
                    "column": "MZJCK310108_HDMAN",
                    "alias": ""
                },
                {
                    "column": "NAME_HDMAN",
                    "alias": ""
                },
                {
                    "column": "CARD_HDMAN",
                    "alias": ""
                }]
            }]
        }],
        "links": [{
            "name": "con_217",
            "source": "transform_4",
            "sourceOutput": "output",
            "target": "transform_5",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_218",
            "source": "transform_7",
            "sourceOutput": "output",
            "target": "transform_9",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_219",
            "source": "transform_6",
            "sourceOutput": "output",
            "target": "transform_11",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_220",
            "source": "transform_20",
            "sourceOutput": "output",
            "target": "transform_21",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_221",
            "source": "join_10",
            "sourceOutput": "output",
            "target": "transform_6",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_222",
            "source": "transform_5",
            "sourceOutput": "output",
            "target": "join_12",
            "targetInput": "left",
            "input": "left"
        },
        {
            "name": "con_223",
            "source": "transform_9",
            "sourceOutput": "output",
            "target": "join_12",
            "targetInput": "right",
            "input": "right"
        },
        {
            "name": "con_224",
            "source": "transform_35",
            "sourceOutput": "output",
            "target": "filter_34",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_225",
            "source": "filter_34",
            "sourceOutput": "output",
            "target": "transform_4",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_226",
            "source": "transform_36",
            "sourceOutput": "output",
            "target": "filter_38",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_227",
            "source": "filter_38",
            "sourceOutput": "output",
            "target": "transform_7",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_228",
            "source": "transform_39",
            "sourceOutput": "output",
            "target": "filter_43",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_229",
            "source": "filter_43",
            "sourceOutput": "output",
            "target": "join_10",
            "targetInput": "left",
            "input": "left"
        },
        {
            "name": "con_230",
            "source": "filter_47",
            "sourceOutput": "output",
            "target": "transform_20",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_231",
            "source": "transform_45",
            "sourceOutput": "output",
            "target": "filter_47",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_232",
            "source": "transform_11",
            "sourceOutput": "output",
            "target": "transform_40",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_233",
            "source": "transform_21",
            "sourceOutput": "output",
            "target": "transform_42",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_234",
            "source": "join_12",
            "sourceOutput": "output",
            "target": "transform_49",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_235",
            "source": "transform_49",
            "sourceOutput": "output",
            "target": "join_33",
            "targetInput": "left",
            "input": "left"
        },
        {
            "name": "con_236",
            "source": "transform_40",
            "sourceOutput": "output",
            "target": "join_33",
            "targetInput": "right",
            "input": "right"
        },
        {
            "name": "con_237",
            "source": "join_33",
            "sourceOutput": "output",
            "target": "transform_51",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_238",
            "source": "transform_51",
            "sourceOutput": "output",
            "target": "join_53",
            "targetInput": "left",
            "input": "left"
        },
        {
            "name": "con_239",
            "source": "transform_42",
            "sourceOutput": "output",
            "target": "join_53",
            "targetInput": "right",
            "input": "right"
        },
        {
            "name": "con_240",
            "source": "join_53",
            "sourceOutput": "output",
            "target": "transform_54",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_241",
            "source": "source_1",
            "sourceOutput": "output",
            "target": "transform_52",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_242",
            "source": "source_2",
            "sourceOutput": "output",
            "target": "transform_61",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_243",
            "source": "source_3",
            "sourceOutput": "output",
            "target": "transform_65",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_244",
            "source": "source_8",
            "sourceOutput": "output",
            "target": "transform_67",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_245",
            "source": "source_19",
            "sourceOutput": "output",
            "target": "transform_69",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_246",
            "source": "transform_52",
            "sourceOutput": "output",
            "target": "sql_56",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_247",
            "source": "sql_56",
            "sourceOutput": "output",
            "target": "transform_35",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_248",
            "source": "transform_61",
            "sourceOutput": "output",
            "target": "sql_64",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_249",
            "source": "sql_64",
            "sourceOutput": "output",
            "target": "transform_36",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_250",
            "source": "transform_65",
            "sourceOutput": "output",
            "target": "sql_66",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_251",
            "source": "sql_66",
            "sourceOutput": "output",
            "target": "transform_39",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_252",
            "source": "transform_67",
            "sourceOutput": "output",
            "target": "sql_68",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_253",
            "source": "sql_68",
            "sourceOutput": "output",
            "target": "join_10",
            "targetInput": "right",
            "input": "right"
        },
        {
            "name": "con_254",
            "source": "transform_69",
            "sourceOutput": "output",
            "target": "sql_70",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_255",
            "source": "sql_70",
            "sourceOutput": "output",
            "target": "transform_45",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_256",
            "source": "transform_54",
            "sourceOutput": "output",
            "target": "sink_13",
            "targetInput": "input",
            "input": "input"
        }],
        "oid": "$null",
        "creator": "admin",
        "createTime": 1565338201000,
        "lastModifier": "admin",
        "lastModifiedTime": 1565948271000,
        "owner": "601a71e6-d6af-491c-ae3c-f70a939385de",
        "version": 3,
        "enabled": 1,
        "moduleVersion": 0,
        "tenant": {
            "id": "55f7f910-b1c9-41d2-9771-e734e6b8285f",
            "name": "default",
            "creator": "root",
            "createTime": 1559138723000,
            "lastModifier": "root",
            "lastModifiedTime": 1559731815000,
            "owner": "af9b0954-51ef-40c9-aac6-39390b91bcc9",
            "version": 1,
            "moduleVersion": 0,
            "enabled": 1,
            "resourceQueues": ["default"],
            "hdfsSpaceQuota": 0,
            "zid": "",
            "expiredPeriod": 0
        },
        "tableName": "merce_flow",
        "isHide": 0,
        "expiredPeriod": 0
    },
    
    {
        "id": "2c272e77-ea1a-4da4-9d5b-d4d4746ec053",
        "name": "wyk_flow1",
        "flowType": "dataflow",
        "steps": [{
            "id": "source_1",
            "name": "source_1",
            "type": "source",
            "x": 380,
            "y": 222,
            "otherConfigurations": {
                "schema": "hdfs_csv_sink_fliter_>",
                "schemaId": "19d4f3c6-15fd-44a7-81e1-bf1915e42336",
                "sessionCache": "",
                "ignoreMissingPath": false,
                "datasetId": "edb25e10-b5aa-43ab-98aa-28d8766f67bc",
                "interceptor": "",
                "dataset": "hdfs_csv_sink_fliter_>"
            },
            "outputConfigurations": [{
                "id": "output",
                "fields": [{
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "NAME"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "JOB"
                },
                {
                    "type": "double",
                    "alias": "",
                    "description": "",
                    "column": "SALARY"
                },
                {
                    "type": "double",
                    "alias": "",
                    "description": "",
                    "column": "AGE"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "GENDER"
                },
                {
                    "type": "date",
                    "alias": "",
                    "description": "",
                    "column": "TIME"
                }]
            }]
        },
        {
            "id": "sink_2",
            "name": "sink_2",
            "type": "sink",
            "x": 883,
            "y": 246,
            "otherConfigurations": {
                "schema": "mysql_sink_fliter_==",
                "description": "",
                "sessionCache": "",
                "interceptor": "",
                "type": "HDFS",
                "nullValue": "",
                "mode": "",
                "path": "/tmp/merce_57/mysql_sink_fliter",
                "datasetId": "a3e0f240-ecff-4811-afcc-37549927fcee",
                "schemaResourceId": "",
                "dataResource": "",
                "quoteChar": "\"",
                "escapeChar": "\\",
                "schemaResource": "",
                "datasetResourceId": "",
                "sliceTimeColumn": "",
                "jarPath": "/app/flowconfig/jarUploadPath/save/5279b372-175a-488a-b5ac-8dac768baac9_mysql-connector-java-5.1.38.jar",
                "format": "csv",
                "maxFileSize": "",
                "maxFileNumber": "",
                "separator": ",",
                "expiredTime": "0",
                "schemaId": "2ef3fc94-a559-47b5-930e-7e60f6c89e79",
                "dataset": "mysql_sink_fliter_==_new",
                "specifiedStringColumnTypes": []
            },
            "inputConfigurations": [{
                "id": "input",
                "fields": [{
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "NAME"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "JOB"
                },
                {
                    "type": "double",
                    "alias": "",
                    "description": "",
                    "column": "SALARY"
                },
                {
                    "type": "double",
                    "alias": "",
                    "description": "",
                    "column": "AGE"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "GENDER"
                },
                {
                    "type": "date",
                    "alias": "",
                    "description": "",
                    "column": "TIME"
                }]
            }],
            "outputConfigurations": [{
                "id": "output",
                "fields": []
            }]
        }],
        "links": [{
            "name": "con_24",
            "source": "source_1",
            "sourceOutput": "output",
            "target": "sink_2",
            "targetInput": "input",
            "input": "input"
        }],
        "oid": "$null",
        "creator": "admin",
        "createTime": 1565229079000,
        "lastModifier": "admin",
        "lastModifiedTime": 1565230423000,
        "owner": "601a71e6-d6af-491c-ae3c-f70a939385de",
        "version": 3,
        "enabled": 0,
        "moduleVersion": 0,
        "tenant": {
            "id": "55f7f910-b1c9-41d2-9771-e734e6b8285f",
            "name": "default",
            "creator": "root",
            "createTime": 1559138723000,
            "lastModifier": "root",
            "lastModifiedTime": 1559731815000,
            "owner": "af9b0954-51ef-40c9-aac6-39390b91bcc9",
            "version": 1,
            "moduleVersion": 0,
            "enabled": 1,
            "resourceQueues": ["default"],
            "hdfsSpaceQuota": 0,
            "zid": "",
            "expiredPeriod": 0
        },
        "tableName": "merce_flow",
        "isHide": 0,
        "expiredPeriod": 0
    },
    {
        "id": "736049ea-b33c-4861-9498-06b93b04e58f",
        "name": "parquet2csv",
        "flowType": "dataflow",
        "steps": [{
            "id": "source_1",
            "name": "source_1",
            "type": "source",
            "x": 416,
            "y": 260,
            "otherConfigurations": {
                "schema": "sink_parquet_0807",
                "schemaId": "a2b39727-d01d-451f-b396-c45c8f0e5624",
                "sessionCache": "",
                "ignoreMissingPath": false,
                "datasetId": "7a0e5114-525f-4175-af4c-bb06ab3381c5",
                "interceptor": "",
                "dataset": "sink_parquet_0807"
            },
            "outputConfigurations": [{
                "id": "output",
                "fields": [{
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "NAME"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "JOB"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "SALARY"
                },
                {
                    "type": "bigint",
                    "alias": "",
                    "description": "",
                    "column": "AGE"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "GENDER"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "TIME1"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "TIME2"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "TIME5"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "TEST"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "TIME"
                }]
            }]
        },
        {
            "id": "sink_2",
            "name": "sink_2",
            "type": "sink",
            "x": 822,
            "y": 264,
            "otherConfigurations": {
                "schema": "csv_test",
                "brokers": "",
                "columns": "",
                "groupId": "",
                "description": "",
                "sessionCache": "",
                "interceptor": "",
                "type": "HDFS",
                "nullValue": "",
                "mode": "overwrite",
                "path": "/tmp/wgf/parquet2csv",
                "password": "",
                "edge": "",
                "datasetId": "f6344ef8-c646-4158-8292-4fddda95cce2",
                "edgeFields": [],
                "targetFields": [],
                "table": "",
                "schemaResourceId": "",
                "dataResource": "",
                "quoteChar": "\"",
                "escapeChar": "\\",
                "sourceFields": [],
                "schemaResource": "",
                "datasetResourceId": "",
                "sliceTimeColumn": "",
                "src": "",
                "partitionColumns": "",
                "format": "csv",
                "maxFileSize": "",
                "maxFileNumber": "",
                "separator": ",",
                "url": "",
                "expiredTime": "0",
                "target": "",
                "driver": "",
                "schemaId": "4761faeb-e9f1-4360-b783-d1c4b457648b",
                "namespace": "",
                "topic": "",
                "dataset": "csv_test",
                "user": "",
                "sliceType": "",
                "specifiedStringColumnTypes": []
            },
            "inputConfigurations": [{
                "id": "input",
                "fields": [{
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "NAME"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "JOB"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "SALARY"
                },
                {
                    "type": "bigint",
                    "alias": "",
                    "description": "",
                    "column": "AGE"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "GENDER"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "TIME1"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "TIME2"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "TIME5"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "TEST"
                },
                {
                    "type": "string",
                    "alias": "",
                    "description": "",
                    "column": "TIME"
                }]
            }],
            "outputConfigurations": [{
                "id": "output",
                "fields": []
            }]
        }],
        "links": [{
            "name": "con_28",
            "source": "source_1",
            "sourceOutput": "output",
            "target": "sink_2",
            "targetInput": "input",
            "input": "input"
        },
        {
            "name": "con_35",
            "source": "source_1",
            "sourceOutput": "output",
            "target": "sink_3",
            "targetInput": "input",
            "input": "input"
        }],
        "oid": "$null",
        "creator": "admin",
        "createTime": 1565168835000,
        "lastModifier": "admin",
        "lastModifiedTime": 1565172153000,
        "owner": "601a71e6-d6af-491c-ae3c-f70a939385de",
        "version": 2,
        "enabled": 0,
        "moduleVersion": 0,
        "tenant": {
            "id": "55f7f910-b1c9-41d2-9771-e734e6b8285f",
            "name": "default",
            "creator": "root",
            "createTime": 1559138723000,
            "lastModifier": "root",
            "lastModifiedTime": 1559731815000,
            "owner": "af9b0954-51ef-40c9-aac6-39390b91bcc9",
            "version": 1,
            "moduleVersion": 0,
            "enabled": 1,
            "resourceQueues": ["default"],
            "hdfsSpaceQuota": 0,
            "zid": "",
            "expiredPeriod": 0
        },
        "tableName": "merce_flow",
        "isHide": 0,
        "expiredPeriod": 0
    }],
    "pageable": "INSTANCE",
    "totalElements": 432,
    "last": true,
    "totalPages": 1,
    "first": true,
    "sort": {
        "sorted": false,
        "unsorted": true,
        "empty": true
    },
    "numberOfElements": 50,
    "size": 0,
    "number": 0,
    "empty": false
}

