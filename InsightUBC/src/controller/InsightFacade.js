"use strict";
var Util_1 = require("../Util");
var util_1 = require("util");
var JSZip = require("jszip");
var fs = require("fs");
var parse5 = require("parse5");
var http = require("http");
var RAW_COURSE_KEYS = ['Subject', 'Course', 'Avg', 'Professor', 'Title', 'Pass', 'Fail', 'Audit', 'id', 'Year'];
var COURSE_QUERY_KEYS = ['courses_dept', 'courses_id', 'courses_avg', 'courses_instructor',
    'courses_title', 'courses_pass', 'courses_fail', 'courses_audit', 'courses_uuid', 'courses_year'];
var LOGIC = ['AND', 'OR'];
var MCOMPARISON = ['LT', 'GT', 'EQ'];
var S_KEY = [['courses_dept', 'courses_id', 'courses_instructor', 'courses_title', 'courses_uuid'],
    ['rooms_fullname', 'rooms_shortname', 'rooms_number', 'rooms_name', 'rooms_address', 'rooms_type', 'rooms_furniture', 'rooms_href']];
var M_KEY = [['courses_avg', 'courses_pass', 'courses_fail', 'courses_audit', 'courses_year'],
    ['rooms_lat', 'rooms_lon', 'rooms_seats']];
var SCOMPARISON = 'IS';
var NEGATION = 'NOT';
var APPLYTOKEN = ['MAX', 'MIN', 'AVG', 'COUNT', 'SUM'];
var DIRECTION = ['UP', 'DOWN'];
var COURSE = 0;
var ROOM = 1;
var FOLDERPATH = './src/controller/';
var FILETYPE = '.json';
var InsightFacade = (function () {
    function InsightFacade() {
        Util_1.default.trace('InsightFacadeImpl::init()');
    }
    InsightFacade.prototype.addDataset = function (id, content) {
        if (id === "rooms") {
            return new Promise(function (fulfill, reject) {
                var addressArr = [];
                var zip = new JSZip();
                var pArr = [];
                var indexArr = [];
                var roomArr = [];
                var rooms = [];
                zip.loadAsync(content, { base64: true })
                    .then(function (validZip) {
                    validZip.forEach(function (relativePath, file) {
                        if (file.dir === false && !relativePath.includes('.DS_Store') && !relativePath.includes("index.htm")) {
                            pArr.push(file.async('string'));
                        }
                        else if (relativePath.includes("index.htm")) {
                            file.async('string').then(function (indexFile) {
                                for (var _i = 0, _a = getTBody(parse5.parse(indexFile))['childNodes']; _i < _a.length; _i++) {
                                    var obj = _a[_i];
                                    if ('attrs' in obj) {
                                        indexArr.push(getBuildingIndex(obj));
                                    }
                                }
                                for (var _b = 0, indexArr_1 = indexArr; _b < indexArr_1.length; _b++) {
                                    var building = indexArr_1[_b];
                                    addressArr.push(building['rooms_address']);
                                }
                            }).catch(function () {
                                reject({
                                    code: 400,
                                    body: { error: "invalid index.htm" }
                                });
                            });
                        }
                    });
                    Promise.all(pArr).then(function (files) {
                        if (files.length === 0) {
                            reject({
                                code: 400,
                                body: { error: "valid ZIP but contains not data" }
                            });
                        }
                        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                            var file = files_1[_i];
                            var buildingFile = parse5.parse(file);
                            var tBody = getTBody(buildingFile);
                            if (tBody !== null) {
                                var roomsBuilding = {};
                                var building = {};
                                roomsBuilding = getRooms(tBody);
                                building = getBuildingInfo(searchBuilding(buildingFile));
                                for (var _a = 0, roomsBuilding_1 = roomsBuilding; _a < roomsBuilding_1.length; _a++) {
                                    var room = roomsBuilding_1[_a];
                                    room['rooms_fullname'] = building['rooms_fullname'];
                                    room['rooms_address'] = building['rooms_address'];
                                }
                                Array.prototype.push.apply(rooms, roomsBuilding);
                            }
                        }
                        for (var _b = 0, rooms_1 = rooms; _b < rooms_1.length; _b++) {
                            var room = rooms_1[_b];
                            for (var _c = 0, indexArr_2 = indexArr; _c < indexArr_2.length; _c++) {
                                var building = indexArr_2[_c];
                                if (room['rooms_fullname'] === building['rooms_fullname'] && room['rooms_address'] === building['rooms_address']) {
                                    room['rooms_shortname'] = building['rooms_shortname'];
                                    room['rooms_name'] = room['rooms_shortname'] + "_" + room['rooms_number'];
                                }
                            }
                            if ('rooms_shortname' in room) {
                                roomArr.push(room);
                            }
                        }
                        if (roomArr.length === 0) {
                            reject({
                                code: 400,
                                body: { error: "valid ZIP contains data but no valid room" }
                            });
                        }
                        extractLatLon(addressArr).then(function (latlonData) {
                            for (var _i = 0, latlonData_1 = latlonData; _i < latlonData_1.length; _i++) {
                                var latlonPair = latlonData_1[_i];
                                for (var _a = 0, roomArr_1 = roomArr; _a < roomArr_1.length; _a++) {
                                    var room = roomArr_1[_a];
                                    var address = Object.keys(latlonPair)[0];
                                    if (room['rooms_address'] === address) {
                                        var latlonKeys = Object.keys(latlonPair[address]);
                                        for (var _b = 0, latlonKeys_1 = latlonKeys; _b < latlonKeys_1.length; _b++) {
                                            var key = latlonKeys_1[_b];
                                            room["rooms_" + key] = latlonPair[address][key];
                                        }
                                    }
                                }
                            }
                            if (Object.keys(InsightFacade.DataSet).includes(id)) {
                                InsightFacade.DataSet[id] = roomArr;
                                fs.writeFile(id, JSON.stringify(InsightFacade.DataSet[id]), function (err) {
                                    if (err)
                                        console.error("Failed writing to disk");
                                    fulfill({
                                        code: 201,
                                        body: "the operation was successful and the id already existed"
                                    });
                                });
                            }
                            else {
                                InsightFacade.DataSet[id] = roomArr;
                                fs.writeFile(id, JSON.stringify(InsightFacade.DataSet[id]), function (err) {
                                    if (err)
                                        console.error("Failed writing to disk");
                                    fulfill({
                                        code: 204,
                                        body: "the operation was successful and the id was new"
                                    });
                                });
                            }
                        });
                    });
                }).catch(function (e) {
                    reject({
                        code: 400,
                        body: { error: "invalid ZIP" }
                    });
                });
            });
        }
        else if (id === "courses") {
            return new Promise(function (fulfill, reject) {
                var zip = new JSZip();
                var pArr = [];
                var courseArr = [];
                zip.loadAsync(content, { base64: true })
                    .then(function (validZip) {
                    validZip.forEach(function (relativePath, file) {
                        if (file.dir === false) {
                            pArr.push(file.async("string"));
                        }
                    });
                    Promise.all(pArr).then(function (files) {
                        if (files.length === 0) {
                            reject({
                                code: 400,
                                body: { error: "valid ZIP but contain not data" }
                            });
                        }
                        for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
                            var file = files_2[_i];
                            try {
                                var js = JSON.parse(file);
                                var rst = js['result'];
                                for (var i = 0; i < rst.length; i++) {
                                    var course = rst[i];
                                    var c = {};
                                    var courseKeys = Object.keys(course);
                                    var valid = false;
                                    for (var j = 0; j < RAW_COURSE_KEYS.length; j++) {
                                        if (courseKeys.includes(RAW_COURSE_KEYS[j]))
                                            valid = true;
                                    }
                                    if (valid) {
                                        for (var j = 0; j < 8; j++) {
                                            c[COURSE_QUERY_KEYS[j]] = course[RAW_COURSE_KEYS[j]];
                                        }
                                        c[COURSE_QUERY_KEYS[8]] = String(course[RAW_COURSE_KEYS[8]]);
                                        if (course['Section'] === 'overall') {
                                            c[COURSE_QUERY_KEYS[9]] = 1900;
                                        }
                                        else {
                                            c[COURSE_QUERY_KEYS[9]] = Number(course[RAW_COURSE_KEYS[9]]);
                                        }
                                        courseArr.push(c);
                                    }
                                }
                            }
                            catch (err) { }
                        }
                        if (courseArr.length === 0) {
                            reject({
                                code: 400,
                                body: { error: "valid ZIP contain data but not course" }
                            });
                        }
                        if (Object.keys(InsightFacade.DataSet).includes(id)) {
                            InsightFacade.DataSet[id] = courseArr;
                            fs.writeFile(id, JSON.stringify(InsightFacade.DataSet[id]), function (err) {
                                if (err)
                                    console.error("Failed writing to disk");
                                fulfill({
                                    code: 201,
                                    body: "the operation was successful and the id already existed"
                                });
                            });
                        }
                        else {
                            InsightFacade.DataSet[id] = courseArr;
                            fs.writeFile(id, JSON.stringify(InsightFacade.DataSet[id]), function (err) {
                                if (err)
                                    console.error("Failed writing to disk");
                                fulfill({
                                    code: 204,
                                    body: "the operation was successful and the id was new"
                                });
                            });
                        }
                    }).catch();
                }).catch(function () {
                    reject({
                        code: 400,
                        body: { error: "invalid ZIP" }
                    });
                });
            });
        }
        else {
            return new Promise(function (fulfill, reject) {
                reject({
                    code: 400,
                    body: { error: "invalid ID" }
                });
            });
        }
        function getTBody(obj) {
            if (obj['nodeName'] === 'tbody') {
                return obj;
            }
            else if ('childNodes' in obj) {
                for (var _i = 0, _a = obj['childNodes']; _i < _a.length; _i++) {
                    var childObj = _a[_i];
                    var result = getTBody(childObj);
                    if (result !== null) {
                        return result;
                    }
                }
            }
            return null;
        }
        function extractLatLon(addressArr) {
            return new Promise(function (fulfill, reject) {
                var pArr = [];
                var _loop_1 = function (x) {
                    pArr.push(new Promise(function (fulfill, reject) {
                        var addLatLon = {};
                        var URL = "http://skaha.cs.ubc.ca:11316/api/v1/team51/" + x.replace(/ /g, "%20");
                        http.get(URL, function (resp) {
                            var data = '';
                            resp.on('data', function (chunk) {
                                data += chunk;
                            });
                            resp.on('end', function () {
                                addLatLon[x] = JSON.parse(data);
                                fulfill(addLatLon);
                            });
                        }).on("error", function (err) {
                            addLatLon[x] = "Error: " + err.message;
                            reject(addLatLon);
                        });
                    }));
                };
                for (var _i = 0, addressArr_1 = addressArr; _i < addressArr_1.length; _i++) {
                    var x = addressArr_1[_i];
                    _loop_1(x);
                }
                Promise.all(pArr).then(function (result) {
                    fulfill(result);
                }).catch(function (err) {
                    reject(err);
                });
            });
        }
        function getBuildingIndex(obj) {
            var index = {};
            for (var _i = 0, _a = obj['childNodes']; _i < _a.length; _i++) {
                var childObj = _a[_i];
                if ('attrs' in childObj) {
                    switch (childObj['attrs'][0]['value']) {
                        case 'views-field views-field-field-building-code':
                            index['rooms_shortname'] = childObj['childNodes'][0]['value'].trim();
                            break;
                        case 'views-field views-field-title':
                            index['rooms_fullname'] = childObj['childNodes'][1]['childNodes'][0]['value'];
                            break;
                        case 'views-field views-field-field-building-address':
                            index['rooms_address'] = childObj['childNodes'][0]['value'].trim();
                            break;
                        case 'views-field views-field-nothing':
                            index['rooms_href'] = childObj['childNodes'][1]['attrs'][0]['value'];
                            break;
                        default:
                    }
                }
            }
            return index;
        }
        function getRooms(tBody) {
            var rooms = [];
            for (var _i = 0, _a = tBody['childNodes']; _i < _a.length; _i++) {
                var tr = _a[_i];
                if ('childNodes' in tr) {
                    var room = {};
                    for (var _b = 0, _c = tr['childNodes']; _b < _c.length; _b++) {
                        var td = _c[_b];
                        if ('childNodes' in td) {
                            switch (td['attrs'][0]['value']) {
                                case 'views-field views-field-field-room-number':
                                    room['rooms_number'] = td['childNodes'][1]['childNodes'][0]['value'];
                                    break;
                                case 'views-field views-field-field-room-capacity':
                                    room['rooms_seats'] = Number(td['childNodes'][0]['value'].trim());
                                    break;
                                case 'views-field views-field-field-room-furniture':
                                    room['rooms_furniture'] = td['childNodes'][0]['value'].trim();
                                    break;
                                case 'views-field views-field-field-room-type':
                                    room['rooms_type'] = td['childNodes'][0]['value'].trim();
                                    break;
                                case 'views-field views-field-nothing':
                                    room['rooms_href'] = td['childNodes'][1]['attrs'][0]['value'];
                                    break;
                                default:
                            }
                        }
                    }
                    if (Object.keys(room).length === 5) {
                        rooms.push(room);
                    }
                }
            }
            return rooms;
        }
        function searchBuilding(buildingFile) {
            if (buildingFile['nodeName'] === 'div' && buildingFile['attrs'][0]['value'] === 'building-info') {
                return buildingFile;
            }
            else if ('childNodes' in buildingFile) {
                for (var _i = 0, _a = buildingFile['childNodes']; _i < _a.length; _i++) {
                    var childObj = _a[_i];
                    var result = searchBuilding(childObj);
                    if (result !== null) {
                        return result;
                    }
                }
            }
            return null;
        }
        function getBuildingInfo(building) {
            var buildingInfo = {};
            buildingInfo['rooms_fullname'] = building['childNodes'][1]['childNodes'][0]['childNodes'][0]['value'];
            buildingInfo['rooms_address'] = building['childNodes'][3]['childNodes'][0]['childNodes'][0]['value'];
            return buildingInfo;
        }
    };
    InsightFacade.prototype.removeDataset = function (id) {
        return new Promise(function (fulfill, reject) {
            if (Object.keys(InsightFacade.DataSet).includes(id))
                delete InsightFacade.DataSet[id];
            fs.readFile(id, function (err, data) {
                if (err) {
                    reject({
                        code: 404,
                        body: { error: "Invalid ID" }
                    });
                }
                else {
                    fs.unlink(id);
                    fulfill({
                        code: 204,
                        body: "the operation was successful"
                    });
                }
            });
        });
    };
    InsightFacade.prototype.performQuery = function (query) {
        return new Promise(function (fulfill, reject) {
            if ('WHERE' in query && 'OPTIONS' in query) {
                var filter_1 = query['WHERE'];
                var optionQ = query['OPTIONS'];
                if ((Object.keys(filter_1).length === 1) && ('TRANSFORMATIONS' in query)) {
                    var trans = query['TRANSFORMATIONS'];
                    if (!(filterValidation(filter_1, COURSE) && optionValidation(optionQ, COURSE) && transformationValidation(trans, COURSE)) &&
                        !(filterValidation(filter_1, ROOM) && optionValidation(optionQ, ROOM) && transformationValidation(trans, ROOM))) {
                        reject({
                            code: 400,
                            body: {}
                        });
                    }
                }
                else if ((Object.keys(filter_1).length === 0) && ('TRANSFORMATIONS' in query)) {
                    var trans = query['TRANSFORMATIONS'];
                    if (!(optionValidation(optionQ, COURSE) && transformationValidation(trans, COURSE)) &&
                        !(optionValidation(optionQ, ROOM) && transformationValidation(trans, ROOM))) {
                        reject({
                            code: 400,
                            body: {}
                        });
                    }
                }
                else if ((Object.keys(filter_1).length === 1) && !('TRANSFORMATIONS' in query)) {
                    var filter_2 = query['WHERE'];
                    if (!(filterValidation(filter_2, COURSE) && optionValidation(optionQ, COURSE)) &&
                        !(filterValidation(filter_2, ROOM) && optionValidation(optionQ, ROOM))) {
                        reject({
                            code: 400,
                            body: {}
                        });
                    }
                }
                else if ((Object.keys(filter_1).length === 0) && !('TRANSFORMATIONS' in query)) {
                    if (!optionValidation(optionQ, COURSE) && !optionValidation(optionQ, ROOM)) {
                        reject({
                            code: 400,
                            body: {}
                        });
                    }
                }
                else {
                    reject({
                        code: 400,
                        body: {}
                    });
                }
                var tempResult = [];
                var columns = optionQ['COLUMNS'];
                var column = columns[0];
                var datasetName = column.substr(0, column.indexOf('_'));
                var kArr = void 0;
                if (datasetName === 'courses') {
                    kArr = InsightFacade.DataSet['courses'];
                }
                else if (datasetName === 'rooms') {
                    kArr = InsightFacade.DataSet['rooms'];
                }
                if (typeof kArr === 'undefined') {
                    reject({
                        code: 424,
                        body: { err: "miss data" }
                    });
                }
                if (datasetName === 'courses') {
                    if (Object.keys(filter_1).length === 1) {
                        for (var _i = 0, kArr_1 = kArr; _i < kArr_1.length; _i++) {
                            var course = kArr_1[_i];
                            if (courseCheck(filter_1, course)) {
                                if (('courses_uuid' in course) && (typeof course['courses_uuid'] !== 'string'))
                                    course['courses_uuid'] = course['courses_uuid'].toString();
                                tempResult.push(course);
                            }
                        }
                    }
                    else {
                        for (var _a = 0, kArr_2 = kArr; _a < kArr_2.length; _a++) {
                            var course = kArr_2[_a];
                            if (('courses_uuid' in course) && (typeof course['courses_uuid'] !== 'string'))
                                course['courses_uuid'] = course['courses_uuid'].toString();
                            tempResult.push(course);
                        }
                    }
                }
                else if (datasetName === 'rooms') {
                    if (Object.keys(filter_1).length === 1) {
                        for (var _b = 0, kArr_3 = kArr; _b < kArr_3.length; _b++) {
                            var room = kArr_3[_b];
                            if (courseCheck(filter_1, room))
                                tempResult.push(room);
                        }
                    }
                    else
                        tempResult = kArr.slice();
                }
                var result = orderResult(tempResult, optionQ, columns);
                fulfill({
                    code: 200,
                    body: { result: result }
                });
            }
            else {
                reject({
                    code: 400,
                    body: {}
                });
            }
        });
        function orderResult(tempResult, optionQ, columns) {
            var result = [];
            var order = optionQ['ORDER'];
            var appliedResult = [];
            if ('TRANSFORMATIONS' in query) {
                var groupedResult = toGroupUp(tempResult);
                appliedResult = doApply(groupedResult);
            }
            else {
                appliedResult = tempResult.slice();
            }
            if (typeof order === 'string')
                appliedResult = toSortResult(appliedResult, order);
            else {
                var direction = order['dir'];
                var orderKeys = order['keys'];
                appliedResult = toSortResultByDir(appliedResult, direction, orderKeys);
            }
            for (var i = 0; i < appliedResult.length; i++) {
                var temp = appliedResult[i];
                var c = {};
                for (var j in temp) {
                    if (columns.includes(j)) {
                        c[j] = temp[j];
                    }
                }
                result.push(c);
            }
            return result;
        }
        function toSortResult(result, order) {
            result = result.sort(function (a, b) {
                var tmpA = a;
                var tmpB = b;
                if (tmpA[order] > tmpB[order])
                    return 1;
                if (tmpA[order] < tmpB[order])
                    return -1;
                return 0;
            });
            return result;
        }
        function toSortResultByDir(result, direction, orderKeys) {
            if (direction === "DOWN") {
                result = result.sort(function (a, b) {
                    var tmpA = a;
                    var tmpB = b;
                    if (tmpA[orderKeys[0]] > tmpB[orderKeys[0]])
                        return -1;
                    if (tmpA[orderKeys[0]] < tmpB[orderKeys[0]])
                        return 1;
                    if (tmpA[orderKeys[0]] === tmpB[orderKeys[0]]) {
                        for (var i = 1; i < orderKeys.length; ++i) {
                            if (tmpA[orderKeys[i]] > tmpB[orderKeys[i]])
                                return -1;
                            if (tmpA[orderKeys[i]] < tmpB[orderKeys[i]])
                                return 1;
                        }
                    }
                    return 0;
                });
            }
            else {
                result = result.sort(function (a, b) {
                    var tmpA = a;
                    var tmpB = b;
                    if (tmpA[orderKeys[0]] > tmpB[orderKeys[0]])
                        return 1;
                    if (tmpA[orderKeys[0]] < tmpB[orderKeys[0]])
                        return -1;
                    if (tmpA[orderKeys[0]] === tmpB[orderKeys[0]]) {
                        for (var i = 1; i < orderKeys.length; ++i) {
                            if (tmpA[orderKeys[i]] > tmpB[orderKeys[i]])
                                return 1;
                            if (tmpA[orderKeys[i]] < tmpB[orderKeys[i]])
                                return -1;
                        }
                    }
                    return 0;
                });
            }
            return result;
        }
        function toGroupUp(rawResult) {
            var groupedData = {};
            var tempResult = rawResult.slice();
            var group = query['TRANSFORMATIONS']['GROUP'];
            for (var i = 0; i < tempResult.length; i++) {
                var v1 = void 0, v2 = void 0, v3 = void 0, v4 = void 0, v5 = void 0, v6 = void 0, v7 = void 0, v8 = void 0, v9 = void 0, v10 = void 0, v11 = void 0;
                v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = v9 = v10 = v11 = '';
                for (var j = 0; j < group.length; j++) {
                    var oneGroupKey = group[j];
                    switch (j) {
                        case 0:
                            v1 = tempResult[i][oneGroupKey];
                            break;
                        case 1:
                            v2 = tempResult[i][oneGroupKey];
                            break;
                        case 2:
                            v3 = tempResult[i][oneGroupKey];
                            break;
                        case 3:
                            v4 = tempResult[i][oneGroupKey];
                            break;
                        case 4:
                            v5 = tempResult[i][oneGroupKey];
                            break;
                        case 5:
                            v6 = tempResult[i][oneGroupKey];
                            break;
                        case 6:
                            v7 = tempResult[i][oneGroupKey];
                            break;
                        case 7:
                            v8 = tempResult[i][oneGroupKey];
                            break;
                        case 8:
                            v9 = tempResult[i][oneGroupKey];
                            break;
                        case 9:
                            v10 = tempResult[i][oneGroupKey];
                            break;
                        case 10:
                            v11 = tempResult[i][oneGroupKey];
                            break;
                    }
                }
                var v = v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8 + v9 + v10 + v11;
                if (groupedData[v] === undefined) {
                    groupedData[v] = [];
                    groupedData[v].push(tempResult[i]);
                }
                else
                    groupedData[v].push(tempResult[i]);
            }
            return groupedData;
        }
        function doApply(groupedResult) {
            var apply = query['TRANSFORMATIONS']['APPLY'];
            var tempGroupedResult = groupedResult;
            var finalResult = [];
            for (var i = 0; i < Object.keys(tempGroupedResult).length; i++) {
                var oneGroup = tempGroupedResult[Object.keys(tempGroupedResult)[i]];
                if (apply.length > 0) {
                    for (var j = 0; j < apply.length; j++) {
                        var applyKey = apply[j];
                        var oneKey = Object.keys(applyKey)[0];
                        var applyObject = applyKey[oneKey];
                        var applyTOKEN = Object.keys(applyObject)[0];
                        var key_value = applyObject[applyTOKEN];
                        if (applyTOKEN === 'MAX') {
                            oneGroup[0][oneKey] = max(key_value, oneGroup);
                        }
                        else if (applyTOKEN === 'MIN') {
                            oneGroup[0][oneKey] = min(key_value, oneGroup);
                        }
                        else if (applyTOKEN === 'AVG') {
                            oneGroup[0][oneKey] = avg(key_value, oneGroup);
                        }
                        else if (applyTOKEN === 'SUM') {
                            oneGroup[0][oneKey] = sum(key_value, oneGroup);
                        }
                        else if (applyTOKEN === 'COUNT') {
                            oneGroup[0][oneKey] = count(key_value, oneGroup);
                        }
                    }
                }
                finalResult.push(oneGroup[0]);
            }
            return finalResult;
        }
        function avg(key, oneGroup) {
            var Decimal = require('decimal.js');
            var tempOneGroup = oneGroup.slice();
            var array = [];
            for (var i = 0; i < tempOneGroup.length; i++) {
                array.push(tempOneGroup[i][key]);
            }
            return Number((array.map(function (val) { return new Decimal(val); }).reduce(function (a, b) { return a.plus(b); }).toNumber() / array.length).toFixed(2));
        }
        function max(key, oneGroup) {
            var tempOneGroup = oneGroup.slice();
            var max = 0;
            var eachValue = 0;
            for (var i = 0; i < tempOneGroup.length; i++) {
                eachValue = tempOneGroup[i][key];
                if (eachValue > max)
                    max = eachValue;
            }
            return max;
        }
        function min(key, oneGroup) {
            var tempOneGroup = oneGroup.slice();
            var min = tempOneGroup[0][key];
            for (var i = 1; i < tempOneGroup.length; i++) {
                var eachValue = tempOneGroup[i][key];
                if (eachValue < min)
                    min = eachValue;
            }
            return min;
        }
        function sum(key, oneGroup) {
            var Decimal = require('decimal.js');
            var tempOneGroup = oneGroup.slice();
            var array = [];
            for (var i = 0; i < tempOneGroup.length; i++) {
                array.push(tempOneGroup[i][key]);
            }
            return Number(array.map(function (val) { return new Decimal(val); }).reduce(function (a, b) { return a.plus(b); }).toNumber().toFixed(2));
        }
        function count(key, oneGroup) {
            var tempOneGroup = oneGroup.slice();
            var array = [];
            for (var i = 0; i < tempOneGroup.length; i++) {
                var eachValue = tempOneGroup[i][key];
                if (!array.includes(eachValue))
                    array.push(eachValue);
            }
            return array.length;
        }
        function filterValidation(filter, index) {
            if (Object.keys(filter).length !== 1)
                return false;
            var op = Object.keys(filter)[0];
            if (LOGIC.includes(op)) {
                var listOfFilters = filter[op];
                if (listOfFilters.length < 1) {
                    return false;
                }
                for (var i = 0; i < listOfFilters.length; i++) {
                    if (!filterValidation(listOfFilters[i], index)) {
                        return false;
                    }
                }
                return true;
            }
            if (NEGATION.includes(op)) {
                return filterValidation(filter[op], index);
            }
            if (MCOMPARISON.includes(op)) {
                var m_key = Object.keys(filter[op])[0];
                var m_value = filter[op][m_key];
                return M_KEY[index].includes(m_key) && util_1.isNumber(m_value);
            }
            if (SCOMPARISON.includes(op)) {
                var s_key = Object.keys(filter[op])[0];
                var s_value = filter[op][s_key];
                return S_KEY[index].includes(s_key) && util_1.isString(s_value);
            }
            return false;
        }
        function optionValidation(option, index) {
            if (!('COLUMNS' in option)) {
                return false;
            }
            else {
                var columns = option['COLUMNS'];
                if ((typeof columns === 'undefined') || (columns.length < 1)) {
                    return false;
                }
                for (var i = 0; i < columns.length; i++) {
                    var key = columns[i];
                    if ((typeof key !== 'string') || (!(S_KEY[index].includes(key) || M_KEY[index].includes(key) || checkStringValidation(key))))
                        return false;
                    if ((S_KEY[index].includes(key) || M_KEY[index].includes(key)) && ('TRANSFORMATIONS' in query)) {
                        if (!checkGroupKeys(key))
                            return false;
                    }
                }
                if ('ORDER' in option) {
                    var order = option['ORDER'];
                    if (typeof order === 'undefined')
                        return false;
                    if (typeof order === 'string') {
                        if (!(S_KEY[index].includes(order) || M_KEY[index].includes(order) || checkStringValidation(order)))
                            return false;
                        if (!columns.includes(order))
                            return false;
                    }
                    else if (Object.keys(order).includes('dir') && Object.keys(order).includes('keys')) {
                        if ((typeof order['dir'] === 'undefined') || (typeof order['keys'] === 'undefined'))
                            return false;
                        var direction = order['dir'];
                        var strs = order['keys'];
                        if ((typeof direction !== 'string') || (!DIRECTION.includes(direction)))
                            return false;
                        if (strs.length < 1)
                            return false;
                        for (var i = 0; i < strs.length; i++) {
                            if (!(S_KEY[index].includes(strs[i]) || M_KEY[index].includes(strs[i]) || checkStringValidation(strs[i])))
                                return false;
                            if (!columns.includes(strs[i]))
                                return false;
                        }
                    }
                    else
                        return false;
                }
            }
            return true;
        }
        function transformationValidation(trans, index) {
            if (!(Object.keys(trans).includes('GROUP')))
                return false;
            if (!(Object.keys(trans).includes('APPLY')))
                return false;
            else {
                var group = trans['GROUP'];
                var apply = trans['APPLY'];
                if ((typeof group === 'undefined') || (group.length < 1)) {
                    return false;
                }
                for (var i = 0; i < group.length; i++) {
                    var key = group[i];
                    if (!(S_KEY[index].includes(key) || M_KEY[index].includes(key)))
                        return false;
                }
                if (typeof apply === 'undefined')
                    return false;
                if (apply.length === 0)
                    return true;
                for (var i = 0; i < apply.length; i++) {
                    var applyKey = apply[i];
                    if ((typeof applyKey === "undefined") || (Object.keys(applyKey).length !== 1))
                        return false;
                    var oneKey = Object.keys(applyKey)[0];
                    if (typeof oneKey !== 'string')
                        return false;
                    if (oneKey.indexOf('_') >= 0)
                        return false;
                    var applyObject = applyKey[oneKey];
                    if ((typeof applyObject === "undefined") || (Object.keys(applyObject).length !== 1))
                        return false;
                    var applyToken = Object.keys(applyObject)[0];
                    if ((typeof applyToken !== 'string') || (!APPLYTOKEN.includes(applyToken)))
                        return false;
                    var key_value = applyObject[applyToken];
                    if (typeof key_value === 'undefined')
                        return false;
                    if (applyToken === 'COUNT') {
                        if (!(S_KEY[index].includes(key_value) || M_KEY[index].includes(key_value)))
                            return false;
                    }
                    else {
                        if (!M_KEY[index].includes(key_value))
                            return false;
                    }
                }
            }
            return true;
        }
        function checkGroupKeys(str) {
            if (!('TRANSFORMATIONS' in query))
                return false;
            var trans = query['TRANSFORMATIONS'];
            if (typeof trans === 'undefined')
                return false;
            if (!('GROUP' in trans))
                return false;
            var group = trans['GROUP'];
            if (typeof group === 'undefined')
                return false;
            return group.includes(str);
        }
        function checkStringValidation(str) {
            if (!('TRANSFORMATIONS' in query))
                return false;
            var trans = query['TRANSFORMATIONS'];
            if (typeof trans === 'undefined')
                return false;
            var listOfStr = [];
            if (!('APPLY' in trans))
                return false;
            var apply = trans['APPLY'];
            if ((typeof apply === 'undefined') || (apply.length < 1))
                return false;
            for (var i = 0; i < apply.length; i++) {
                var applyKey = apply[i];
                if (Object.keys(applyKey).length !== 1)
                    return false;
                var oneKey = Object.keys(applyKey)[0];
                if ((typeof oneKey === 'undefined') || (typeof oneKey !== 'string'))
                    return false;
                listOfStr.push(oneKey);
            }
            return listOfStr.includes(str);
        }
        function courseCheck(filter, courses) {
            if (Object.keys(filter).length !== 1) {
                return false;
            }
            var op = Object.keys(filter)[0];
            if (LOGIC.includes(op)) {
                var listOfFilters = filter[op];
                if (op == 'AND') {
                    for (var i = 0; i < listOfFilters.length; i++) {
                        if (!courseCheck(listOfFilters[i], courses)) {
                            return false;
                        }
                    }
                    return true;
                }
                else {
                    for (var i = 0; i < listOfFilters.length; i++) {
                        if (courseCheck(listOfFilters[i], courses)) {
                            return true;
                        }
                    }
                    return false;
                }
            }
            if (NEGATION.includes(op)) {
                return !courseCheck(filter[op], courses);
            }
            if (MCOMPARISON.includes(op)) {
                var m_key = Object.keys(filter[op])[0];
                var m_value = filter[op][m_key];
                if (op == 'LT') {
                    return courses[m_key] < m_value;
                }
                else if (op == 'GT') {
                    return courses[m_key] > m_value;
                }
                else if (op == 'EQ') {
                    return courses[m_key] === m_value;
                }
            }
            if (SCOMPARISON.includes(op)) {
                var s_key = Object.keys(filter[op])[0];
                var s_value = filter[op][s_key];
                var start = false;
                var end = false;
                if (s_value.charAt(0) === '*') {
                    start = true;
                    s_value = s_value.substr(1);
                }
                if (s_value.charAt(s_value.length - 1) === '*') {
                    end = true;
                    s_value = s_value.substr(0, s_value.length - 1);
                }
                var cString = courses[s_key];
                var has = -1;
                while (has < cString.length) {
                    has = cString.indexOf(s_value, has + 1);
                    if (has < 0) {
                        return false;
                    }
                    if (has > 0 && start === false) {
                        return false;
                    }
                    if (has + s_value.length !== cString.length && !end) {
                        continue;
                    }
                    return true;
                }
                return false;
            }
        }
    };
    return InsightFacade;
}());
InsightFacade.DataSet = {};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map