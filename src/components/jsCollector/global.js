// 添加全局函数的js
import {createParameter} from '../function/queryParameter.js';
import jsonexport from 'jsonexport'; // 将JSON转换为CSV
import json from 'format-json';
import moment from "moment"//时间格式化

exports.install = function (Vue, options) {
    /*
       * 删除或者添加一个元素到数组中
       * array想要添加或者删除元素的数组，必须传入的参数
       * index，将元素插入或者删除到数组的位置，没有默认在数组最后，非必须传入的参数
       * element如果有证明是添加元素到数组，undefined就是删除数组元素，非必须传入的参数
       * */
    Vue.prototype.arrayAddOrRemoreElement = function (array, index, element) {
        //如果没有传入数组或者传入的不是数组直接结束
        if (!array || !(Array.prototype.isPrototypeOf(array))) {
            return;
        }
        var i = index == undefined ? array.length : index;
        if (element == undefined) {
            //删除数组元素
            array.splice(i, 1);
        } else {
            //添加元素
            array.splice(i + 1, 0, element);
        }
        return array;
    }

    // 根据o2的value更新o1的数据，o1的key不变
    Vue.prototype.copyObject = function (o1, o2) {
        var arr = new Array();
        arr = Object.keys(o1);
        for (var i = 0; i < arr.length; i++) {
            if (o2[arr[i]] !== undefined) {
                o1[arr[i]] = o2[arr[i]];
            }
        }
        return o1;
    }

    //小数处理
    Vue.prototype.handleDecimal = function (args) {
        var scale = args[0] ? args[0] : 0;
        var precision = args[1] ? args[1] : 0;
        var type = "decimal";
        if (precision === 0) {
            if (scale === 1) {
                type = 'boolean';
            } else if (scale < 4) {
                type = 'byte';
            } else if (scale < 6) {
                type = 'short';
            } else if (scale < 11) {
                type = 'int';
            } else if (scale < 39) {
                type = 'bigint';
            }
        } else {
            if (scale < 20 && precision < 5) {
                type = 'double';
            } else {
                type = 'decimal(' + scale + ',' + precision + ')';
            }
        }
        return type;
    }

    //数据库基本数据类型转换
    Vue.prototype.databaseTypeTransform = function (db, type) {
        //db是指数据库的类型
        //type指的是数据类型
        var dbType = '';
        var types = {
            mysqlTypeMap: {
                "TINYINT": "int",
                "SMALLINT": "int",
                "MEDIUMINT": "int",
                "INT": "int",
                "INTEGER": "int",
                "BIGINT": "bigint",
                "FLOAT": "float",
                "DOUBLE": "double",
                "DECIMAL": this.handleDecimal,
                "CHAR": "string",
                "VARCHAR": "string",
                "TINYBLOB": "binary",
                "TINYTEXT": "string",
                "BLOB": "binary",
                "BIT": "string",
                "TEXT": "string",
                "MEDIUMBLOB": "binary",
                "MEDIUMTEXT": "string",
                "LONGBLOB": "binary",
                "LONGTEXT": "string",
                "DATE": "date",
                "TIME": "timestamp",
                "YEAR": "date",
                "DATETIME": "timestamp",
                "TIMESTAMP": "timestamp",
                "ENUM": "string"
            },
            oracleTypeMap: {
                "CHAR": "string",
                "VARCHAR": "string",
                "VARCHAR2": "string",
                "LONGVARCHAR": "string",
                "NUMERIC": "decimal",
                "NUMBER": this.handleDecimal,
                "DECIMAL": this.handleDecimal,
                "BIT": "string",
                "TINYINT": "int",
                "SMALLINT": "int",
                "INTEGER": "int",
                "LONG": "bigint",
                "BIGINT": "bigint",
                "REAL": "float",
                "FLOAT": "double",
                "BINARY_FLOAT": "double",
                "DOUBLE": "double",
                "BINARY_DOUBLE": "double",
                "BINARY": "binary",
                "VARBINARY": "binary",
                "LONGVARBINARY": "binary",
                "DATE": "date",
                "TIME": "timestamp",
                "TIMESTAMP": "timestamp",
                "BLOB": "binary",
                "CLOB": "string"
            },
            msSqlTypeMap: {
                "INT": "int",
                "INT IDENTITY": "int",
                "TINYINT": "int",
                "SMALLINT": "int",
                "LONG": "bigint",
                "BIGINT": "bigint",
                "REAL": "float",
                "FLOAT": "double",
                "BINARY_FLOAT": "double",
                "DOUBLE": "double",
                "BINARY_DOUBLE": "double",
                "BINARY": "binary",
                "VARBINARY": "binary",
                "IMAGE": "binary",
                "LONGVARBINARY": "binary",
                "BIT": "string",
                "DATE": "date",
                "DATETIME": "date",
                "TIME": "timestamp",
                "TIMESTAMP": "timestamp",
                "CHAR": "string",
                "VARCHAR": "string",
                "VARCHAR2": "string",
                "LONGVARCHAR": "string",
                "NUMERIC": "decimal",
                "NUMBER": this.handleDecimal,
                "DECIMAL": this.handleDecimal,
                "BLOB": "binary",
                "CLOB": "string"
            },
            dboneTypeMap: {
                "BIGINT": "bigint",
                "BIGSERIAL": "bigint",
                "BIT": "string",
                "BIT VARYING": "string",
                "BOOLEAN": "byte",
                "BYTEA": "binary",
                "CHAR": "string",
                "DATE": "date",
                "NUMERIC": "decimal",
                "DOUBLE PRECIESION": "double",
                "FLOAT": "float",
                "INTEGER": "int",
                "REAL": "float",
                "SERIAL": "int",
                "SMALLINT": "short",
                "SMALLSERIAL": "short",
                "TEXT": "string",
                "TIME": "timestamp",
                "TIMESTAMP": "timestamp",
                "UUID": "string",
                "VARCHAR": "string",
                "XML": "string",
                "varchar": "string",
                "int4": "int",
                "int8": "bigint",
                "int16": "bigint",
            },
            db2TypeMap: {
                "BIGINT": "bigint",
                "SMALLINT": "short",
                "INTEGER": "int",
                "DOUBLE": "double",
                "NUMERIC": "decimal",
                "DATE": "date",
                "REAL": "float",
                "TIME": "timestamp",
                "TIMESTAMP": "timestamp",
                "CHAR": "string",
                "VARCHAR": "string",
                "LONG VARCHAR": "string",
                "CLOB": "string",
                "GRAPHIC": "string",
                "VARGRAPHIC": "string",
                "LONG VARGRAPHIC": "string",
                "DBCLOB": "string",
                "BLOB": "binary",
            },
            snowBallTypeMap: {
                "FIXEDSTRING": "string",
                "STRING": "string",
                "UINT8": "int",
                "UINT16": "int",
                "UINT32": "int",
                "UINT64": "int",
                "INT8": "int",
                "INT16": "int",
                "INT32": "int",
                "INT64": "int",
                "FLOAT32": "float",
                "FLOAT64": "float",
                "DATE": "date",
                "DATETIME": "timestamp",
                "DECIMAL": "decimal",
                "DECIMAL32": "decimal",
                "DECIMAL64": "decimal",
                "DECIMAL128": "decimal"
            },
            defaultTypeMap: {
                "TINYINT": "int",
                "SMALLINT": "int",
                "MEDIUMINT": "int",
                "INT": "int",
                "INTEGER": "int",
                "BIGINT": "bigint",
                "FLOAT": "float",
                "DOUBLE": "double",
                "DECIMAL": "decimal",
                "CHAR": "string",
                "VARCHAR": "string",
                "TINYBLOB": "binary",
                "TINYTEXT": "string",
                "TEXT": "string",
                "MEDIUMBLOB": "binary",
                "MEDIUMTEXT": "string",
                "LONGBLOB": "binary",
                "LONGTEXT": "string",
                "DATE": "date",
                "TIME": "timestamp",
                "YEAR": "date",
                "DATETIME": "timestamp",
                "TIMESTAMP": "timestamp",
                "ENUM": "string",
                "BLOB": "binary",
                "CLOB": "string",
            }
        }
        var map = types.defaultTypeMap;
        //判断用什么数据库类型对应类型
        if (db.toLowerCase().indexOf("mysql") > -1) {
            map = types.mysqlTypeMap;
        } else if (db.toLowerCase().indexOf("oracle") > -1) {
            map = types.oracleTypeMap;
        } else if (db.indexOf("Microsoft SQL Server (Microsoft Driver)") > -1) {
            map = types.msSqlTypeMap;
            type = type.toUpperCase();
        } else if (db.toLowerCase().indexOf("dbone") > -1) {
            map = types.dboneTypeMap;
        } else if (db.toLowerCase().indexOf("snowball") > -1) {
            map = types.snowBallTypeMap;
        } else if (db.toLowerCase().indexOf("db2") > -1) {
            map = types.db2TypeMap;
        }
        //如果是mysql的decimal或者oracle的decimal和number那就切换样式
        if (db.toLowerCase().indexOf("mysql") > -1 && 'decimal' == type.substr(0, type.indexOf('(')).toLowerCase()
            || db.toLowerCase().indexOf("oracle") > -1 && 'decimal' == type.substr(0, type.indexOf('(')).toLowerCase()
            || db.toLowerCase().indexOf("snowball") > -1 && 'decimal' == type.substr(0, type.indexOf('(')).toLowerCase()) {
            var para = type.substring(type.indexOf('(') + 1, type.indexOf(')')).split(',')
            type = this.handleDecimal(para)
            dbType = type;
        } else if (db.toLowerCase().indexOf("oracle") > -1 && 'NUMBER' === type.substr(0, type.indexOf('(')).toUpperCase()) {
            var para = type.substring(type.indexOf('(') + 1, type.indexOf(')')).split(',');
            //返回数据库对应的本产品的类型
            type = this.handleDecimal(para)
            dbType = type;
        } else if (type.indexOf('(') > -1) {
            type = type = type.substr(0, type.indexOf('(')).toUpperCase()
            dbType = map[type];
        } else {
            type = type.toUpperCase()
            if (map[type]) {
                dbType = map[type];
            } else {
                dbType = 'string';
            }
        }
        return dbType;
    }

    //列表页所有参数的集合
    Vue.prototype.buildParameters = function (pagesize, currentPage, startTime, endTime, searchInput, fieldList) {

        var limit = pagesize ? pagesize : 8;
        var offset = currentPage ? (currentPage - 1) * limit : 0;
        var query = searchInput && searchInput.length > 0 ? '%' + searchInput + '%' : '%';
        var parameter = createParameter().Limit(limit).Offset(offset).Build();
        if (fieldList) {
            parameter.fieldList = fieldList;
        }
        if (query !== '%') {
            parameter = createParameter('name', query, "LIKE").Build(parameter);
        }
        if (startTime && endTime) {
            parameter = createParameter('lastModifiedTime', Number(startTime), 'GREATER_THAN').And('lastModifiedTime', Number(endTime), 'LESS_THAN').Build(parameter);
        }
        return parameter;
    }

    //时间格式化
    Vue.prototype.dateFormat = function (row, column) {
        var date = row[column.property];
        if (date === undefined) {
            return "";
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }

    //过期时间由其他的转换成秒
    Vue.prototype.second2Other = function (second) {
        var time;
        var unit;
        if (null !== second && "" !== second) {
            //如果能够整除成天
            if (second >= 200000000000) {
                time = 0;
                unit = '天';
            } else if (second >= 60 * 60 * 24 && second % ( 60 * 60 * 24) === 0) {
                time = second / 3600 / 24;
                unit = '天';
            } else if (second >= 60 * 60 && second % ( 60 * 60 ) === 0) {
                // 如果能够整除成小时
                time = second / 3600;
                unit = '小时';
            } else if (second >= 60 && second % 60 === 0) {
                // 如果能够整除成分钟
                time = second / 60;
                unit = '分钟';
            } else {
                time = second;
                unit = '秒';
            }
        }
        var res = {}
        res.time = time;
        res.unit = unit;
        return res;
    }

    //过期时间由秒转换成
    Vue.prototype.other2Second = function (time, unit) {
        var second;
        if (null !== time && "" !== time && unit) {
            //如果单位是天
            if (unit === '天') {
                second = time * 60 * 60 * 24;
            } else if (unit === '小时') {
                //如果单位是小时
                second = time * 60 * 60;
            } else if (unit === '分钟') {
                //如果单位是分钟
                second = time * 60;
            } else {
                second = time;
            }
        }
        return second;
    };

    //数组去重去空
    Vue.prototype.unique = function (arr) {
        var tmp = new Array();
        for (var i in arr) {
            if (tmp.indexOf(arr[i]) === -1 && arr[i] !== "" && arr[i] !== undefined) {
                tmp.push(arr[i]);
            }
        }
        tmp.unshift("");
        return tmp;
    }

    //查询对象某元素在对象数组的索引
    Vue.prototype.indexObjectArray = function (arr, ele) {
        var keys = Object.keys(arr);
        for (var i = 0; i < arr.length; i++) {
            if (keys[i] === Object.keys(ele)[0] && arr[keys[i]] === ele[Object.keys(ele)[0]]) {
                return i;
            }
        }
        return -1;
    }

    //将一个数组转换成一个tree数据
    /*
     list item is like {code: "", parentCode:"", name:"",...}
     tree is a blank array : []
     */
    Vue.prototype.listToTree = function (list, tree) {
        var remains = [];
        var leafMap = [];
        list.forEach(function (e) {
            if (!e.parentCode) {
                tree.push(e)
                leafMap[e.code] = e;
            } else {
                remains.push(e);
            }
        })

        function orgnize(leafMap, remains) {
            var remains2 = [];
            var leafMap2 = []
            remains.forEach(function (e) {
                var s = leafMap[e.parentCode];
                if (s) {
                    if (!s.children) {
                        s.children = [];
                    }
                    s.children.push(e);
                    leafMap2[e.code] = e;
                } else {
                    remains2.push(e);
                }
            })

            if (remains2.length) {
                orgnize(leafMap2, remains2);
            }
        }

        orgnize(leafMap, remains);
    };


    Vue.prototype.buildTree = function (data, config) {
        var code = config.code
        var parentCode = config.parentCode
        var children = config.children
        var idMap = {};
        var jsonTree = [];
        data.forEach(function (v) {
            idMap[v[code]] = v;
        });
        data.forEach(function (v) {
            var parent = idMap[v[parentCode]];
            if (parent) {
                !parent[children] && (parent[children] = []);
                parent[children].push(v);
            }
            else {
                jsonTree.push(v);
            }
        });
        return jsonTree;
    };

    Vue.prototype.buildArray = function (data, c) {
        if (!Array.isArray(data)) {
            throw new TypeError('array-unique expects an array.');
        }


        let config = {
            needDelete: c.needDelete ? c.needDelete : false,
            childrenList: c.childrenList ? c.childrenList : "childrenList"
        };

        let array = [];

        function convert(data) {
            let n = Object.assign({}, data);
            config.needDelete && delete n[config.childrenList];
            array.push(n);

            if (data[config.childrenList]) {
                for (let c of data[config.childrenList]) {
                    convert(c);
                }
            }
        }

        for (let d of data) {
            convert(d);
        }

        return array;
    }

    // 下载 csv
    Vue.prototype.exportCSV = function (data) {
        jsonexport(data, (err, csv) => {
            const blob = new Blob([csv])
            if (window.navigator.msSaveOrOpenBlob) {
            // 兼容IE10
            navigator.msSaveBlob(blob, 'data.csv')
        } else {
            //  chrome/firefox
            let aTag = document.createElement('a')
            aTag.download = 'data.csv'
            aTag.href = URL.createObjectURL(blob)
            aTag.click()
            URL.revokeObjectURL(aTag.href)
        }
    });
    }

    // 下载 JSON
    Vue.prototype.exportJSON = function (data) {
        const blob = new Blob([json.plain(data)])
        if (window.navigator.msSaveOrOpenBlob) {
            // 兼容IE10
            navigator.msSaveBlob(blob, 'data.json')
        } else {
            //  chrome/firefox
            let aTag = document.createElement('a')
            aTag.download = 'data.json'
            aTag.href = URL.createObjectURL(blob)
            aTag.click()
            URL.revokeObjectURL(aTag.href)
        }
    }


    Vue.prototype.treeWalk = function (obj, fn, functionIncluded) {
        if ('object' !== typeof obj) {
            return;
        }

        var exit = -1;

        // when exit == true, don't dig into; if exit == 1,quit
        var treeWalk = function (obj, name, path, parent, parentKey) {
            if (exit === false || exit === 'break') {
                return;
            }
            if (!path) {
                path = "";
            }
            if (!('object' === typeof obj)) {
                return;
            }
            if (fn) {
                // if want to stop this loop, fn return true
                exit = fn(name, obj, path, parent, parentKey)
                if (exit === false || exit === 'break') {
                    return;
                }
                if (exit === true || exit === 'continue') {
                    exit = -1;
                    return;
                }
            }

            if (name !== undefined)
                path = path + "." + name;
            var isArray = $.isArray(obj);
            for (var key in obj) {
                if (isArray) {
                    key = parseInt(key);
                }
                if (!functionIncluded && typeof obj[key] === 'function') {
                    continue;
                }

                if ('object' === typeof obj[key]) {
                    treeWalk(obj[key], key, path, obj, name);
                } else if (fn) {
                    // if want to stop this loop, fn return true
                    exit = fn(key, obj[key], path, obj)
                    if (exit === false || exit === 'break') {
                        return;
                    }
                    if (exit === true || exit === 'continue') {
                        exit = -1;
                        return;
                    }
                }
            }
        };
        treeWalk(obj);
    };

    // 基本的数据集类型，根据不同类型初始化字段
    Vue.prototype.dict = {
        "HDFS": {
            storage: "HDFS",
            storageConfigurations: {
                format: "csv",
                path: "",
                relativePath: "",
                pathMode: "exact",
                header: "false",
                separator: ",",
                quoteChar: "\"",
                escapeChar: "\\",
                encryptKey: "",// csv的加密密钥
                encryptColumns: []//csv的加密字段列表
            },
            expiredPeriod: 0
        },
        "HIVE": {
            storage: "HIVE",
            storageConfigurations: {sql: "", table: "", partitionColumns: ""},
            expiredPeriod: 0
        },
        "JDBC": {
            storage: "JDBC",
            storageConfigurations: {driver: "", url: "", sql: "", table: "", user: "", password: ""},
            expiredPeriod: 0
        },
        "KAFKA": {
            storage: "KAFKA",
            storageConfigurations: {
                format: "csv",
                zookeeper: "",
                brokers: "",
                topic: "",
                groupId: "",
                version: "",
                reader: "",
                separator: ",",
                header: "false",
                quoteChar: "\"",
                escapeChar: "\\",
                encryptKey: "",// 加密密钥
                encryptColumns: []//加密字段列表
            },
            expiredPeriod: 0
        },
        "HBASE": {
            storage: "HBASE",
            storageConfigurations: {
                table: "",
                namespace: "",
                columns: "",
                columnsKey: "",
                columnsColumns: "columns",
                isSingle: true, columnsItems: 0
            },
            expiredPeriod: 0
        },
        "FTP": {
            storage: "FTP",
            storageConfigurations: {
                user: "",
                password: "",
                format: "csv",
                path: "",
                relativePath: "",
                header: "false",
                separator: ",",
                quoteChar: "\"",
                escapeChar: "\\"
            },
            expiredPeriod: 0
        },
        "REDIS": {
            storage: "REDIS",
            storageConfigurations: {"url": "", "keyColumn": "", "password": "", "table": ""},
            expiredPeriod: 0
        },
        "IGNITE": {
            storage: "IGNITE",
            storageConfigurations: {
                url: "",
                cacheName: "",
                format: "cache",
                keySchema: "",
                valueSchema: ""
            },
            expiredPeriod: 0
        },
        "MapDB": {
            storage: "MapDB",
            storageConfigurations: {
                path: "",
                relativePath: "",
                format: "cache",
                keySchema: "",
                valueSchema: "",
                separator: ",",
                mapName: ""
            },
            expiredPeriod: 0
        },
        "ElasticSearch": {
            storage: "ElasticSearch",
            storageConfigurations: {clusterName: "", ipAddresses: "", index: "", indexType: ""},
            expiredPeriod: 0
        },
        "SearchOne": {
            storage: "SearchOne",
            storageConfigurations: {clusterName: "", ipAddresses: "", index: "", indexType: ""},
            expiredPeriod: 0
        },
        "Neo4j": {
            storage: "Neo4j",
            storageConfigurations: {
                url: "",
                user: "",
                password: "",
                src: "",
                edge: "",
                target: "",
                sourceFields: [],
                edgeFields: [],
                targetFields: []
            },
            expiredPeriod: 0
        },
        "S3A": {
            storage: "S3A",
            storageConfigurations: {
                format: "csv",
                path: "",
                relativePath: "",
                accessKey: "",
                secretKey: "",
                endpoint: "",
                header: "false",
                separator: ",",
                quoteChar: "\"",
                escapeChar: "\\"
            },
            expiredPeriod: 0
        },
        "SFTP": {
            storage: "HDFS",
            storageConfigurations: {
                format: "csv",
                path: "",
                user: "",
                password: "",
                relativePath: "",
                pathMode: "exact",
                header: "false",
                separator: ",",
                quoteChar: "\"",
                escapeChar: "\\"
            },
            expiredPeriod: 0
        },
    }
};
