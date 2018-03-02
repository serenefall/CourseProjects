/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";
import Log from "../Util";
import {isNullOrUndefined, isNumber, isString} from "util";
import JSZip = require('jszip');
import fs = require('fs');
import parse5 = require('parse5');
import http = require('http');
import {urlEncodedBodyParser} from "restify";
import filter = require("core-js/fn/array/filter");

const RAW_COURSE_KEYS = ['Subject', 'Course', 'Avg', 'Professor', 'Title', 'Pass', 'Fail', 'Audit', 'id', 'Year'];
const COURSE_QUERY_KEYS = ['courses_dept', 'courses_id', 'courses_avg', 'courses_instructor',
    'courses_title', 'courses_pass', 'courses_fail', 'courses_audit', 'courses_uuid', 'courses_year'];

const LOGIC = ['AND', 'OR'];
const MCOMPARISON = ['LT', 'GT', 'EQ'];
const S_KEY = [['courses_dept', 'courses_id', 'courses_instructor', 'courses_title', 'courses_uuid'],
    ['rooms_fullname', 'rooms_shortname', 'rooms_number', 'rooms_name', 'rooms_address', 'rooms_type', 'rooms_furniture', 'rooms_href']];
const M_KEY = [['courses_avg', 'courses_pass', 'courses_fail', 'courses_audit', 'courses_year'],
    ['rooms_lat', 'rooms_lon', 'rooms_seats']];
const SCOMPARISON = 'IS';
const NEGATION = 'NOT';

const APPLYTOKEN = ['MAX', 'MIN', 'AVG', 'COUNT', 'SUM'];

const DIRECTION = ['UP', 'DOWN'];

const COURSE = 0;
const ROOM = 1;

const FOLDERPATH = './src/controller/';
const FILETYPE = '.json';

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    static DataSet: any = {};

    addDataset(id: string, content: string): Promise<InsightResponse> {

        if (id === "rooms") {
            return new Promise(function (fulfill, reject) {
                let addressArr: string[] = [];
                let zip: JSZip = new JSZip();
                let pArr: Promise<any>[] = [];
                let indexArr: any[] = [];
                let roomArr: any[] = [];
                let rooms: any[] = [];
                zip.loadAsync(content, {base64: true})
                    .then(function (validZip: JSZip) {
                        validZip.forEach(function (relativePath, file) {
                            if (file.dir === false && !relativePath.includes('.DS_Store') && !relativePath.includes("index.htm")) {
                                pArr.push(file.async('string'));
                            } else if (relativePath.includes("index.htm")) {
                                file.async('string').then(function (indexFile) {
                                    for (let obj of getTBody(parse5.parse(indexFile))['childNodes']) {
                                        if ('attrs' in obj) {
                                            indexArr.push(getBuildingIndex(obj));
                                        }
                                    }
                                    for (let building of indexArr) {
                                        addressArr.push(building['rooms_address']);
                                    }
                                }).catch(function () {
                                    reject({
                                        code: 400,
                                        body: {error: "invalid index.htm"}
                                    });
                                });
                            }
                        });
                        Promise.all(pArr).then(function (files) {
                            if (files.length === 0) {
                                reject({
                                    code: 400,
                                    body: {error: "valid ZIP but contains not data"}
                                });
                            }
                            for (let file of files) {
                                let buildingFile = parse5.parse(file);
                                let tBody = getTBody(buildingFile);
                                if (tBody !== null) {
                                    let roomsBuilding: any = {};
                                    let building: any = {};
                                    roomsBuilding = getRooms(tBody);
                                    building = getBuildingInfo(searchBuilding(buildingFile));
                                    for (let room of roomsBuilding) {
                                        room['rooms_fullname'] = building['rooms_fullname'];
                                        room['rooms_address'] = building['rooms_address'];
                                    }
                                    Array.prototype.push.apply(rooms, roomsBuilding);
                                }
                            }
                            for (let room of rooms) {
                                for (let building of indexArr) {
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
                                    body: {error: "valid ZIP contains data but no valid room"}
                                });
                            }
                            extractLatLon(addressArr).then(function (latlonData) {
                                for (let latlonPair of latlonData) {
                                    for (let room of roomArr) {
                                        let address = Object.keys(latlonPair)[0];
                                        if (room['rooms_address'] === address) {
                                            let latlonKeys = Object.keys(latlonPair[address]);
                                            for (let key of latlonKeys) {
                                                room["rooms_" + key] = latlonPair[address][key];
                                            }
                                        }
                                    }
                                }
                                if (Object.keys(InsightFacade.DataSet).includes(id)) {
                                    InsightFacade.DataSet[id] = roomArr;
                                    fs.writeFile(
                                        id,
                                        JSON.stringify(InsightFacade.DataSet[id]),
                                        function (err: string) {
                                            if (err) console.error("Failed writing to disk");
                                            fulfill({
                                                code: 201,
                                                body: "the operation was successful and the id already existed"
                                            });
                                        }
                                    );
                                } else {
                                    InsightFacade.DataSet[id] = roomArr;
                                    fs.writeFile(
                                        id,
                                        JSON.stringify(InsightFacade.DataSet[id]),
                                        function (err: string) {
                                            if (err) console.error("Failed writing to disk");
                                            fulfill({
                                                code: 204,
                                                body: "the operation was successful and the id was new"
                                            });
                                        }
                                    );
                                }
                            });
                        });
                    }).catch(function (e) {
                    reject({
                        code: 400,
                        body: {error: "invalid ZIP"}
                    });
                });
                // nothing doing Async
            });

        } else if (id === "courses") {
            return new Promise(function (fulfill, reject) {
                let zip: JSZip = new JSZip();
                let pArr: Promise<any>[] = [];
                let courseArr: JSON[] = [];
                zip.loadAsync(content, {base64: true})
                    .then(function (validZip: JSZip) {
                        validZip.forEach(function (relativePath, file) {
                            if (file.dir === false) {
                                pArr.push(file.async("string"));
                            }
                        });
                        Promise.all(pArr).then(function (files) {
                            if (files.length === 0) {
                                reject({
                                    code: 400,
                                    body: {error: "valid ZIP but contain not data"}
                                });
                            }

                            for (let file of files) {
                                try {
                                    let js = JSON.parse(file);
                                    let rst: Array<any> = js['result'];

                                    for (let i = 0; i < rst.length; i++) {
                                        let course = rst[i];
                                        let c: any = {};
                                        let courseKeys = Object.keys(course);
                                        let valid = false;
                                        for (let j = 0; j < RAW_COURSE_KEYS.length; j++) {
                                            if (courseKeys.includes(RAW_COURSE_KEYS[j]))
                                                valid = true;
                                        }

                                        if (valid) {
                                            for (let j = 0; j < 8; j++) { // not including number string doesn't match
                                                c[COURSE_QUERY_KEYS[j]] = course[RAW_COURSE_KEYS[j]];
                                            }
                                            c[COURSE_QUERY_KEYS[8]] = String(course[RAW_COURSE_KEYS[8]]);
                                            if (course['Section'] === 'overall') {
                                                c[COURSE_QUERY_KEYS[9]] = 1900;
                                            } else {
                                                c[COURSE_QUERY_KEYS[9]] = Number(course[RAW_COURSE_KEYS[9]]);
                                            }
                                            courseArr.push(c);
                                        }
                                    }
                                } catch (err) {}
                            }
                            if (courseArr.length === 0) {
                                reject({
                                    code: 400,
                                    body: {error: "valid ZIP contain data but not course"}
                                });
                            }
                            if (Object.keys(InsightFacade.DataSet).includes(id)) {
                                InsightFacade.DataSet[id] = courseArr;
                                fs.writeFile(
                                    id,
                                    JSON.stringify(InsightFacade.DataSet[id]),
                                    function (err: string) {
                                        if (err) console.error("Failed writing to disk");
                                        fulfill({
                                            code: 201,
                                            body: "the operation was successful and the id already existed"
                                        });
                                    }
                                );
                            } else {
                                InsightFacade.DataSet[id] = courseArr;
                                fs.writeFile(
                                    id,
                                    JSON.stringify(InsightFacade.DataSet[id]),
                                    function (err: string) {
                                        if (err) console.error("Failed writing to disk");
                                        fulfill({
                                            code: 204,
                                            body: "the operation was successful and the id was new"
                                        });
                                    }
                                );
                            }
                        }).catch();
                    }).catch(function () {
                    reject({
                        code: 400,
                        body: {error: "invalid ZIP"}
                    });
                });
            });
        } else {
            return new Promise(function (fulfill, reject) {
                reject({
                    code: 400,
                    body: {error: "invalid ID"}
                });
            });
        }

        // below helper functions for rooms
        function getTBody(obj: any): any {
            if (obj['nodeName'] === 'tbody') {
                return obj;
            } else if ('childNodes' in obj) {
                for (let childObj of obj['childNodes']) {
                    let result = getTBody(childObj);
                    if (result !== null) {
                        return result;
                    }
                }
            }
            return null;
        }

        function extractLatLon(addressArr: string[]): Promise<any> {
            return new Promise(function (fulfill, reject) {
                let pArr: Promise<any>[] = [];
                for (let x of addressArr) {
                    pArr.push(new Promise(function (fulfill, reject) {
                        let addLatLon: any = {};
                        let URL = "http://skaha.cs.ubc.ca:11316/api/v1/team51/" + x.replace(/ /g, "%20");
                        http.get(URL, function (resp: any) {
                            let data = '';
                            resp.on('data', function (chunk: any) {
                                data += chunk;
                            });
                            resp.on('end', function () {
                                addLatLon[x] = JSON.parse(data);
                                fulfill(addLatLon);
                            });
                        }).on("error", function (err: any) {
                            addLatLon[x] = "Error: " + err.message;
                            reject(addLatLon);
                        });
                    }));
                }
                Promise.all(pArr).then(function (result) {
                    fulfill(result);
                }).catch(function (err) {
                    reject(err);
                })
            });
        }



        function getBuildingIndex(obj: any): any {
            let index: any = {};
            for (let childObj of obj['childNodes']) {
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

        function getRooms(tBody: any): any {
            let rooms: any[] = [];
            for (let tr of tBody['childNodes']) {
                if ('childNodes' in tr) {
                    let room: any = {};
                    for (let td of tr['childNodes']) {
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

        function searchBuilding(buildingFile: any): any {
            if (buildingFile['nodeName'] === 'div' && buildingFile['attrs'][0]['value'] === 'building-info') {
                return buildingFile;
            } else if ('childNodes' in buildingFile) {
                for (let childObj of buildingFile['childNodes']) {
                    let result = searchBuilding(childObj);
                    if (result !== null) {
                        return result;
                    }
                }
            }
            return null;
        }

        function getBuildingInfo(building: any): any {
            let buildingInfo: any = {};
            buildingInfo['rooms_fullname'] = building['childNodes'][1]['childNodes'][0]['childNodes'][0]['value'];
            buildingInfo['rooms_address'] = building['childNodes'][3]['childNodes'][0]['childNodes'][0]['value'];
            return buildingInfo;
        }
    }

    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            if (Object.keys(InsightFacade.DataSet).includes(id))
                delete InsightFacade.DataSet[id];
            fs.readFile(id, (err: any, data: any) => {
                if (err) {
                    reject({
                        code: 404,
                        body: {error: "Invalid ID"}
                    });
                } else {
                    fs.unlink(id);
                    fulfill({
                        code: 204,
                        body: "the operation was successful"

                    });
                }
            });
        });
    }


    performQuery(query: any): Promise<InsightResponse> {
        return new Promise(function (fulfill, reject) {
            if ('WHERE' in query && 'OPTIONS' in query){
                let filter = query['WHERE'];
                let optionQ = query['OPTIONS'];
                if ((Object.keys(filter).length === 1) && ('TRANSFORMATIONS' in query)){
                    let trans = query['TRANSFORMATIONS'];
                    if (!(filterValidation(filter, COURSE) && optionValidation(optionQ, COURSE)&&transformationValidation(trans, COURSE)) &&
                        !(filterValidation(filter, ROOM) && optionValidation(optionQ, ROOM)&&transformationValidation(trans,ROOM))) {
                        reject({
                            code: 400,
                            body: {}
                        });
                    }
                }
                else if ((Object.keys(filter).length === 0) && ('TRANSFORMATIONS' in query)){
                    let trans = query['TRANSFORMATIONS'];
                    if (!(optionValidation(optionQ, COURSE)&&transformationValidation(trans, COURSE)) &&
                        !(optionValidation(optionQ, ROOM)&&transformationValidation(trans,ROOM))) {
                        reject({
                            code: 400,
                            body: {}
                        });
                    }
                }
                else if ((Object.keys(filter).length === 1) && !('TRANSFORMATIONS' in query)){
                    let filter = query['WHERE'];
                    if (!(filterValidation(filter, COURSE) && optionValidation(optionQ, COURSE)) &&
                        !(filterValidation(filter, ROOM) && optionValidation(optionQ, ROOM))) {
                        reject({
                            code: 400,
                            body: {}
                        });
                    }
                }
                else if ((Object.keys(filter).length === 0) && !('TRANSFORMATIONS' in query)){
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

                let tempResult: any[] = [];
                let columns: Array<any> = optionQ['COLUMNS'];
                let column: string = columns[0];
                let datasetName: string = column.substr(0, column.indexOf('_')); // datasetName is 'rooms' or 'courses'
                let kArr: any[];
                if (datasetName === 'courses') {
                    kArr = InsightFacade.DataSet['courses'];
                }
                else if (datasetName === 'rooms') {
                    kArr = InsightFacade.DataSet['rooms'];
                }
                if (typeof kArr === 'undefined') {
                    reject({
                        code: 424,
                        body: {err: "miss data"}
                    });
                }
                if (datasetName === 'courses') {
                    if (Object.keys(filter).length === 1){
                        for (let course of kArr) {
                            if (courseCheck(filter, course)){
                                if (('courses_uuid' in course)&&(typeof course['courses_uuid']!=='string'))
                                    course['courses_uuid'] = course['courses_uuid'].toString();
                                tempResult.push(course);
                            }
                        }
                    }
                    else {
                        for (let course of kArr) {
                            if (('courses_uuid' in course)&&(typeof course['courses_uuid']!=='string'))
                                course['courses_uuid'] = course['courses_uuid'].toString();
                            tempResult.push(course);
                        }
                    }
                    //tempResult = kArr.slice();
                }
                else if (datasetName === 'rooms') {
                    if (Object.keys(filter).length === 1){
                        for (let room of kArr) {
                            if (courseCheck(filter, room))
                                tempResult.push(room);
                        }
                    }
                    else
                        tempResult = kArr.slice();
                }
                let result: any[] = orderResult(tempResult,optionQ,columns);
                fulfill({
                    code: 200,
                    body: {result: result}
                });
            }
            else {
                reject({
                    code: 400,
                    body: {}
                });
            }
        });

        function orderResult (tempResult:any[],optionQ: any, columns:any): any{
            let result : any[] = [];
            let order = optionQ['ORDER'];
            let appliedResult:any[] = [];

            if ('TRANSFORMATIONS' in query){//we should group tempResult first, and then to sort the grouped result
                let groupedResult = toGroupUp(tempResult);//when we used named indexes,
                // JavaScript will redefine the array to a standard object. So groupedResult should be an Object
                appliedResult = doApply(groupedResult);
            }
            else{
                appliedResult = tempResult.slice();
            }

            if (typeof order === 'string')//simply to sort as before
                appliedResult = toSortResult(appliedResult, order);
            else{
                let direction = order['dir'];
                let orderKeys = order['keys'];
                appliedResult = toSortResultByDir(appliedResult,direction,orderKeys);
            }

            //this is for getting the columns that we need
            for (let i = 0; i < appliedResult.length; i++) {
                let temp = appliedResult[i];
                let c: any = {};
                for (let j in temp) {
                    if (columns.includes(j)) {
                        c[j] = temp[j];
                    }
                }
                result.push(c);
            }

            return result;
        }

        function toSortResult(result:any[], order:any):any{
            result = result.sort(function (a, b) {
                let tmpA : any = a;
                let tmpB : any = b;
                if (tmpA[order] > tmpB[order])
                    return 1;
                if (tmpA[order] < tmpB[order])
                    return -1;
                return 0;
            });
            return result;
        }

        function toSortResultByDir(result:any[],direction:string,orderKeys:any[]):any{
            if (direction === "DOWN"){
                result = result.sort(function (a,b) {
                    let tmpA : any = a;
                    let tmpB : any = b;
                    if (tmpA[orderKeys[0]] > tmpB[orderKeys[0]])
                        return -1;
                    if (tmpA[orderKeys[0]] < tmpB[orderKeys[0]])
                        return 1;
                    if (tmpA[orderKeys[0]] === tmpB[orderKeys[0]]){
                        for (let i = 1; i < orderKeys.length; ++i){
                            if (tmpA[orderKeys[i]] > tmpB[orderKeys[i]])
                                return -1;
                            if (tmpA[orderKeys[i]] < tmpB[orderKeys[i]])
                                return 1;
                        }
                    }
                    return 0;
                });
            }
            else {//dir === 'UP'
                result = result.sort(function (a,b) {
                    let tmpA : any = a;
                    let tmpB : any = b;
                    if (tmpA[orderKeys[0]] > tmpB[orderKeys[0]])
                        return 1;
                    if (tmpA[orderKeys[0]] < tmpB[orderKeys[0]])
                        return -1;
                    if (tmpA[orderKeys[0]] === tmpB[orderKeys[0]]){
                        for (let i = 1; i < orderKeys.length; ++i){
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

        function toGroupUp (rawResult:any[]):any{
            // let groupedData = new Object();
            let groupedData:{[key:string] : any;}= {};
            let tempResult = rawResult.slice();
            let group:any[] = query['TRANSFORMATIONS']['GROUP'];
            //let v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11 = '';
            for (let i = 0; i < tempResult.length; i++){
                let v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11;
                v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = v9 = v10 = v11 = '';
                for (let j = 0; j < group.length; j++){
                    let oneGroupKey = group[j];
                    switch (j){
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
                let v = v1+v2+v3+v4+v5+v6+v7+v8+v9+v10+v11;
                if (groupedData[v] === undefined){
                    groupedData[v] = [];
                    groupedData[v].push(tempResult[i]);
                }
                else
                    groupedData[v].push(tempResult[i]);
            }
            return groupedData;


        }

        function doApply (groupedResult:any):any{
            let apply:any[] = query['TRANSFORMATIONS']['APPLY'];
            let tempGroupedResult:any = groupedResult;
            let finalResult : any[] = [];

            for (let i = 0; i < Object.keys(tempGroupedResult).length; i++){
                let oneGroup = tempGroupedResult[Object.keys(tempGroupedResult)[i]];//each group is an array of rooms or courses
                if (apply.length > 0){
                    for (let j = 0; j < apply.length; j++){
                        let applyKey = apply[j];//applyKey is an object (APPLYKEY)
                        let oneKey = Object.keys(applyKey)[0];//the key of each APPLYKEY
                        let applyObject = applyKey[oneKey];
                        let applyTOKEN = Object.keys(applyObject)[0];//applyToken is one of MAX, MIN, AVG, SUM and COUNT
                        let key_value = applyObject[applyTOKEN];
                        if (applyTOKEN === 'MAX'){
                            oneGroup[0][oneKey] = max(key_value, oneGroup);
                        }
                        else if (applyTOKEN === 'MIN'){
                            oneGroup[0][oneKey] = min(key_value, oneGroup);
                        }
                        else if (applyTOKEN === 'AVG'){
                            oneGroup[0][oneKey] = avg(key_value, oneGroup);
                        }
                        else if (applyTOKEN === 'SUM'){
                            oneGroup[0][oneKey] = sum(key_value, oneGroup);
                        }
                        else if (applyTOKEN === 'COUNT'){
                            oneGroup[0][oneKey] = count(key_value, oneGroup);
                        }
                    }
                }
                finalResult.push(oneGroup[0]);
            }
            return finalResult;
        }

        function avg(key : any, oneGroup:any[]) : any{
            let Decimal = require('decimal.js');
            let tempOneGroup = oneGroup.slice();
            let array: any[] = [];
            for(let i = 0; i < tempOneGroup.length; i++){
                array.push(tempOneGroup[i][key]);
            }
            return Number((array.map((val:number) => <any>new Decimal(val)).reduce((a,b) => a.plus(b)).toNumber() / array.length).toFixed(2));
        }

        function max(key : any, oneGroup:any[]) : any{
            let tempOneGroup = oneGroup.slice();
            let max:number = 0;
            let eachValue : number = 0;
            for (let i = 0; i < tempOneGroup.length; i++){
                eachValue = tempOneGroup[i][key];
                if (eachValue > max)
                    max = eachValue;
            }
            return max;
        }

        function min(key : any, oneGroup:any[]): any{
            let tempOneGroup = oneGroup.slice();
            let min:number = tempOneGroup[0][key];
            for (let i = 1; i < tempOneGroup.length; i++){
                let eachValue = tempOneGroup[i][key];
                if (eachValue < min)
                    min = eachValue
            }
            return min;
        }

        function sum(key : any, oneGroup:any[]): any{
            let Decimal = require('decimal.js');
            let tempOneGroup = oneGroup.slice();
            let array: any[] = [];
            for(let i = 0; i < tempOneGroup.length; i++){
                array.push(tempOneGroup[i][key]);
            }
            return Number(array.map((val:number) => new Decimal(val)).reduce((a,b) => a.plus(b)).toNumber().toFixed(2));
        }

        function count(key : any, oneGroup : any[]) : any{
            let tempOneGroup = oneGroup.slice();
            let array : any[] = [];
            for (let i = 0; i < tempOneGroup.length; i++){
                let eachValue = tempOneGroup[i][key];
                if (!array.includes(eachValue))
                    array.push(eachValue);
            }
            return array.length;
        }

        //do not need to change for D3
        function filterValidation(filter: any, index: number): boolean {
            if (Object.keys(filter).length !== 1)
                return false;

            let op = Object.keys(filter)[0];
            if (LOGIC.includes(op)) {
                let listOfFilters = filter[op];
                if (listOfFilters.length < 1) {
                    return false;
                }
                for (let i = 0; i < listOfFilters.length; i++) {
                    if (!filterValidation(listOfFilters[i],index)) {
                        return false;
                    }
                }
                return true;
            }
            if (NEGATION.includes(op)) {
                return filterValidation(filter[op], index);
            }

            if (MCOMPARISON.includes(op)) {
                let m_key = Object.keys(filter[op])[0];
                let m_value = filter[op][m_key];
                return M_KEY[index].includes(m_key) && isNumber(m_value);
            }
            if (SCOMPARISON.includes(op)) {
                let s_key = Object.keys(filter[op])[0];
                let s_value = filter[op][s_key];
                return S_KEY[index].includes(s_key) && isString(s_value);
            }
            return false;
        }

        function optionValidation(option: any, index: number): boolean {
            if (!('COLUMNS' in option)) {
                return false;
            } else {
                let columns = option['COLUMNS'];
                if ((typeof columns === 'undefined')||(columns.length < 1)) {
                    return false;
                }
                for (let i = 0; i < columns.length; i++) {
                    let key = columns[i];
                    //checkStringValidation() is a function to check if key is one of APPLYKEY
                    if ((typeof key !== 'string')||(!(S_KEY[index].includes(key) || M_KEY[index].includes(key) || checkStringValidation(key))))
                        return false;

                    //when query contains TRANSFORMATION, every key in COLUMNS should be contained in GROUP keys
                    if ((S_KEY[index].includes(key) || M_KEY[index].includes(key))&&('TRANSFORMATIONS' in query)){
                        if (!checkGroupKeys(key))
                            return false;
                    }

                }
                if ('ORDER' in option) {
                    let order = option['ORDER'];
                    if (typeof order === 'undefined')
                        return false;
                    if (typeof order === 'string'){
                        if (!(S_KEY[index].includes(order) || M_KEY[index].includes(order) || checkStringValidation(order)))
                            return false;
                        if (!columns.includes(order))
                            return false;
                    }
                    else if (Object.keys(order).includes('dir')&&Object.keys(order).includes('keys')){
                        if ((typeof order['dir'] === 'undefined')||(typeof order['keys'] ==='undefined'))
                            return false;
                        let direction = order['dir'];
                        let strs: any[] = order['keys'];

                        if ((typeof direction !== 'string') || (!DIRECTION.includes(direction)))
                            return false;
                        if (strs.length < 1)
                            return false;
                        for (let i = 0; i < strs.length; i++){
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

        function transformationValidation(trans: any, index: number): boolean{
            if (!(Object.keys(trans).includes('GROUP')))
                return false;
            if (!(Object.keys(trans).includes('APPLY')))
                return false;
            else{
                let group = trans['GROUP'];
                let apply = trans['APPLY'];
                if ((typeof group === 'undefined')||(group.length < 1)){
                    return false;
                }
                for (let i = 0; i < group.length; i++){
                    let key = group[i];
                    if (!(S_KEY[index].includes(key) || M_KEY[index].includes(key)))
                        return false;
                }
                if (typeof apply === 'undefined')
                    return false;
                if (apply.length === 0)
                    return true;
                for (let i = 0; i < apply.length; i++){
                    let applyKey = apply[i];//each APPLYKEY is an object

                    if ((typeof applyKey === "undefined")||(Object.keys(applyKey).length !== 1))//check if APPLYKEY has only one key
                        return false;
                    let oneKey = Object.keys(applyKey)[0];

                    if (typeof oneKey !== 'string')//check if the type of that key is string;
                        return false;
                    if (oneKey.indexOf('_') >= 0)//check if key contains '_'
                        return false;
                    let applyObject = applyKey[oneKey];

                    if ((typeof applyObject === "undefined")||(Object.keys(applyObject).length !== 1))//check if there is only one APPLYTOKEN
                        return false;
                    let applyToken = Object.keys(applyObject)[0];//applyToken is one of MAX, MIN, AVG, SUM and COUNT

                    if ((typeof applyToken !== 'string')||(!APPLYTOKEN.includes(applyToken)))//check if applyToken is one of MAX, MIN, AVG, SUM and COUNT
                        return false;
                    let key_value = applyObject[applyToken];
                    if (typeof key_value === 'undefined')
                        return false;
                    if (applyToken === 'COUNT'){//applyToken is COUNT
                        if (!(S_KEY[index].includes(key_value)||M_KEY[index].includes(key_value)))
                            return false;
                    }
                    else{ // applyToken is one of MAX, MIN, AVG and SUM
                        if (!M_KEY[index].includes(key_value))
                            return false;
                    }
                }
            }
            return true;
        }

        //when query contains TRANSFORMATION, every key in COLUMNS should be contained in GROUP keys
        function checkGroupKeys(str: any): boolean{
            if (!('TRANSFORMATIONS' in query))
                return false;
            let trans = query['TRANSFORMATIONS'];
            if (typeof trans === 'undefined')
                return false;
            if (!('GROUP' in trans))
                return false;
            let group:any[] = trans['GROUP'];
            if (typeof group === 'undefined')
                return false;
            return group.includes(str);
        }

        function checkStringValidation(str: any):boolean{
            if(!('TRANSFORMATIONS' in query))
                return false;
            let trans = query['TRANSFORMATIONS'];
            if (typeof trans === 'undefined')
                return false;
            let listOfStr : any[] = [];
            if (!('APPLY' in trans))
                return false;
            let apply = trans['APPLY'];
            if ((typeof apply === 'undefined')||(apply.length < 1))
                return false;
            for (let i = 0; i < apply.length; i++){
                let applyKey = apply[i];//each APPLYKEY
                if (Object.keys(applyKey).length !== 1)//check if APPLYKEY has only one key
                    return false;
                let oneKey = Object.keys(applyKey)[0];
                if ((typeof oneKey === 'undefined')||(typeof oneKey !== 'string'))//check if the type of that key is string;
                    return false;
                listOfStr.push(oneKey);
            }
            return listOfStr.includes(str);
        }

        function courseCheck(filter: any, courses: any): boolean {
            if (Object.keys(filter).length !== 1) {
                return false;
            }
            let op = Object.keys(filter)[0];
            if (LOGIC.includes(op)) {
                let listOfFilters = filter[op];
                if (op == 'AND') {
                    for (let i = 0; i < listOfFilters.length; i++) {
                        if (!courseCheck(listOfFilters[i], courses)) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    for (let i = 0; i < listOfFilters.length; i++) {
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
                let m_key = Object.keys(filter[op])[0];
                let m_value = filter[op][m_key];
                if (op == 'LT') {
                    return courses[m_key] < m_value;
                } else if (op == 'GT') {
                    return courses[m_key] > m_value;
                } else if (op == 'EQ') {
                    return courses[m_key] === m_value;
                }
            }
            if (SCOMPARISON.includes(op)) {
                let s_key = Object.keys(filter[op])[0];
                let s_value = filter[op][s_key]; // s_value maybe wildcard
                let start = false;
                let end = false;
                if (s_value.charAt(0) === '*') {
                    start = true;
                    s_value = s_value.substr(1);
                }
                if (s_value.charAt(s_value.length - 1) === '*') {
                    end = true;
                    s_value = s_value.substr(0, s_value.length - 1);
                }
                let cString: string = courses[s_key];

                let has = -1;
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

        // function orderResult (tempResult:any[],optionQ: any, columns:any): any{
        //     let result : any[] = [];
        //     let order = optionQ['ORDER'];
        //     if (!('TRANSFORMATIONS' in query)) {
        //         if ('ORDER' in optionQ)
        //             tempResult = toSortResult(tempResult, order);
        //         //this is for getting the columns that we need
        //         for (let i = 0; i < tempResult.length; i++) {
        //             let temp = tempResult[i];
        //             let c: any = {};
        //             for (let j in temp) {
        //                 if (columns.includes(j)) {
        //                     c[j] = temp[j];
        //                 }
        //             }
        //             result.push(c);
        //         }
        //     }
        //     else{//we should group tempResult first, and then to sort the grouped result
        //         let groupedResult = toGroupUp(tempResult);//when we used named indexes,
        //         // JavaScript will redefine the array to a standard object. So groupedResult should be an Object
        //
        //         let appliedResult:any[] = doApply(groupedResult);
        //         if (typeof order === 'string')//simply to sort as before
        //             appliedResult = toSortResult(appliedResult, order);
        //
        //         else{
        //             let direction = order['dir'];
        //             let orderKeys = order['keys'];
        //             appliedResult = toSortResultByDir(appliedResult,direction,orderKeys);
        //         }
        //
        //         //this is for getting the columns that we need
        //         for (let i = 0; i < appliedResult.length; i++) {
        //             let temp = appliedResult[i];
        //             let c: any = {};
        //             for (let j in temp) {
        //                 if (columns.includes(j)) {
        //                     c[j] = temp[j];
        //                 }
        //             }
        //             result.push(c);
        //         }
        //     }
        //     return result;
        // }
        //
        // function toSortResult(result:any[], order:any):any{
        //     result = result.sort(function (a, b) {
        //         let tmpA : any = a;
        //         let tmpB : any = b;
        //         if (tmpA[order] > tmpB[order])
        //             return 1;
        //         if (tmpA[order] < tmpB[order])
        //             return -1;
        //         return 0;
        //     });
        //     return result;
        // }
        //
        // function toSortResultByDir(result:any[],direction:string,orderKeys:any[]):any{
        //     if (direction === "DOWN"){
        //         result = result.sort(function (a,b) {
        //             let tmpA : any = a;
        //             let tmpB : any = b;
        //             if (tmpA[orderKeys[0]] > tmpB[orderKeys[0]])
        //                 return -1;
        //             if (tmpA[orderKeys[0]] < tmpB[orderKeys[0]])
        //                 return 1;
        //             if (tmpA[orderKeys[0]] === tmpB[orderKeys[0]]){
        //                 for (let i = 1; i < orderKeys.length; ++i){
        //                     if (tmpA[orderKeys[i]] > tmpB[orderKeys[i]])
        //                         return -1;
        //                     if (tmpA[orderKeys[i]] < tmpB[orderKeys[i]])
        //                         return 1;
        //                 }
        //             }
        //             return 0;
        //         });
        //     }
        //     else {//dir === 'UP'
        //         result = result.sort(function (a,b) {
        //             let tmpA : any = a;
        //             let tmpB : any = b;
        //             if (tmpA[orderKeys[0]] > tmpB[orderKeys[0]])
        //                 return 1;
        //             if (tmpA[orderKeys[0]] < tmpB[orderKeys[0]])
        //                 return -1;
        //             if (tmpA[orderKeys[0]] === tmpB[orderKeys[0]]){
        //                 for (let i = 1; i < orderKeys.length; ++i){
        //                     if (tmpA[orderKeys[i]] > tmpB[orderKeys[i]])
        //                         return 1;
        //                     if (tmpA[orderKeys[i]] < tmpB[orderKeys[i]])
        //                         return -1;
        //                 }
        //             }
        //             return 0;
        //         });
        //     }
        //     return result;
        // }
        //
        // function toGroupUp (rawResult:any[]):any{
        //     // let groupedData = new Object();
        //     let groupedData:{[key:string] : any;}= {};
        //     let tempResult = rawResult.slice();
        //     let group:any[] = query['TRANSFORMATIONS']['GROUP'];
        //     //let v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11 = '';
        //     for (let i = 0; i < tempResult.length; i++){
        //         let v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11;
        //         v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = v9 = v10 = v11 = '';
        //         for (let j = 0; j < group.length; j++){
        //             let oneGroupKey = group[j];
        //             switch (j){
        //                 case 0:
        //                     v1 = tempResult[i][oneGroupKey];
        //                     break;
        //                 case 1:
        //                     v2 = tempResult[i][oneGroupKey];
        //                     break;
        //                 case 2:
        //                     v3 = tempResult[i][oneGroupKey];
        //                     break;
        //                 case 3:
        //                     v4 = tempResult[i][oneGroupKey];
        //                     break;
        //                 case 4:
        //                     v5 = tempResult[i][oneGroupKey];
        //                     break;
        //                 case 5:
        //                     v6 = tempResult[i][oneGroupKey];
        //                     break;
        //                 case 6:
        //                     v7 = tempResult[i][oneGroupKey];
        //                     break;
        //                 case 7:
        //                     v8 = tempResult[i][oneGroupKey];
        //                     break;
        //                 case 8:
        //                     v9 = tempResult[i][oneGroupKey];
        //                     break;
        //                 case 9:
        //                     v10 = tempResult[i][oneGroupKey];
        //                     break;
        //                 case 10:
        //                     v11 = tempResult[i][oneGroupKey];
        //                     break;
        //             }
        //         }
        //         // if (groupedData[v1+v2+v3+v4+v5+v6+v7+v8+v9+v10+v11] === undefined){
        //         //     groupedData[v1+v2+v3+v4+v5+v6+v7+v8+v9+v10+v11]  = [];
        //         //     groupedData[v1+v2+v3+v4+v5+v6+v7+v8+v9+v10+v11].push(tempResult[i]);
        //         // }
        //         // else
        //         //     groupedData[v1+v2+v3+v4+v5+v6+v7+v8+v9+v10+v11].push(tempResult[i]);
        //         let v = v1+v2+v3+v4+v5+v6+v7+v8+v9+v10+v11;
        //         if (groupedData[v] === undefined){
        //             groupedData[v] = [];
        //             groupedData[v].push(tempResult[i]);
        //         }
        //         else
        //             groupedData[v].push(tempResult[i]);
        //     }
        //     return groupedData;
        //
        //
        // }
        //
        // function doApply (groupedResult:any):any{
        //     let apply:any[] = query['TRANSFORMATIONS']['APPLY'];
        //     let tempGroupedResult:any = groupedResult;
        //     let finalResult : any[] = [];
        //
        //     for (let i = 0; i < Object.keys(tempGroupedResult).length; i++){
        //         let oneGroup = tempGroupedResult[Object.keys(tempGroupedResult)[i]];//each group is an array of rooms or courses
        //         for (let j = 0; j < apply.length; j++){
        //             let applyKey = apply[j];//applyKey is an object (APPLYKEY)
        //             let oneKey = Object.keys(applyKey)[0];//the key of each APPLYKEY
        //             let applyObject = applyKey[oneKey];
        //             let applyTOKEN = Object.keys(applyObject)[0];//applyToken is one of MAX, MIN, AVG, SUM and COUNT
        //             let key_value = applyObject[applyTOKEN];
        //             if (applyTOKEN === 'MAX'){
        //                 oneGroup[0][oneKey] = max(key_value, oneGroup);
        //             }
        //             else if (applyTOKEN === 'MIN'){
        //                 oneGroup[0][oneKey] = min(key_value, oneGroup);
        //             }
        //             else if (applyTOKEN === 'AVG'){
        //                 oneGroup[0][oneKey] = avg(key_value, oneGroup);
        //             }
        //             else if (applyTOKEN === 'SUM'){
        //                 oneGroup[0][oneKey] = sum(key_value, oneGroup);
        //             }
        //             else if (applyTOKEN === 'COUNT'){
        //                 oneGroup[0][oneKey] = count(key_value, oneGroup);
        //             }
        //         }
        //         finalResult.push(oneGroup[0]);
        //     }
        //     return finalResult;
        // }
        //
        // function avg(key : any, oneGroup:any[]) : any{
        //     let Decimal = require('decimal.js');
        //     let tempOneGroup = oneGroup.slice();
        //     let array: any[] = [];
        //     for(let i = 0; i < tempOneGroup.length; i++){
        //         array.push(tempOneGroup[i][key]);
        //     }
        //     return Number((array.map(val => <any>new Decimal(val)).reduce((a,b) => a.plus(b)).toNumber() / array.length).toFixed(2));
        // }
        //
        // function max(key : any, oneGroup:any[]) : any{
        //     let tempOneGroup = oneGroup.slice();
        //     let max:number = 0;
        //     let eachValue : number = 0;
        //     for (let i = 0; i < tempOneGroup.length; i++){
        //         eachValue = tempOneGroup[i][key];
        //         if (eachValue > max)
        //             max = eachValue;
        //     }
        //     return max;
        // }
        //
        // function min(key : any, oneGroup:any[]): any{
        //     let tempOneGroup = oneGroup.slice();
        //     let min:number = tempOneGroup[0][key];
        //     for (let i = 1; i < tempOneGroup.length; i++){
        //         let eachValue = tempOneGroup[i][key];
        //         if (eachValue < min)
        //             min = eachValue
        //     }
        //     return min;
        // }
        //
        // function sum(key : any, oneGroup:any[]): any{
        //     let Decimal = require('decimal.js');
        //     let tempOneGroup = oneGroup.slice();
        //     let array: any[] = [];
        //     for(let i = 0; i < tempOneGroup.length; i++){
        //         array.push(tempOneGroup[i][key]);
        //     }
        //     return Number(array.map(val => new Decimal(val)).reduce((a,b) => a.plus(b)).toNumber().toFixed(2));
        // }
        //
        // function count(key : any, oneGroup : any[]) : any{
        //     let tempOneGroup = oneGroup.slice();
        //     let array : any[] = [];
        //     for (let i = 0; i < tempOneGroup.length; i++){
        //         let eachValue = tempOneGroup[i][key];
        //         if (!array.includes(eachValue))
        //             array.push(eachValue);
        //     }
        //     return array.length;
        // }
        //
        // //do not need to change for D3
        // function filterValidation(filter: any, index: number): boolean {
        //     if (Object.keys(filter).length !== 1)
        //         return false;
        //
        //     let op = Object.keys(filter)[0];
        //     if (LOGIC.includes(op)) {
        //         let listOfFilters = filter[op];
        //         if (listOfFilters.length < 1) {
        //             return false;
        //         }
        //         for (let i = 0; i < listOfFilters.length; i++) {
        //             if (!filterValidation(listOfFilters[i],index)) {
        //                 return false;
        //             }
        //         }
        //         return true;
        //     }
        //     if (NEGATION.includes(op)) {
        //         return filterValidation(filter[op], index);
        //     }
        //
        //     if (MCOMPARISON.includes(op)) {
        //         let m_key = Object.keys(filter[op])[0];
        //         let m_value = filter[op][m_key];
        //         return M_KEY[index].includes(m_key) && isNumber(m_value);
        //     }
        //     if (SCOMPARISON.includes(op)) {
        //         let s_key = Object.keys(filter[op])[0];
        //         let s_value = filter[op][s_key];
        //         return S_KEY[index].includes(s_key) && isString(s_value);
        //     }
        //     return false;
        // }
        //
        // function optionValidation(option: any, index: number): boolean {
        //     if (!('COLUMNS' in option)) {
        //         return false;
        //     } else {
        //         let columns = option['COLUMNS'];
        //         if (columns.length < 1) {
        //             return false;
        //         }
        //         for (let i = 0; i < columns.length; i++) {
        //             let key = columns[i];
        //             //checkStringValidation() is a function to check if key is one of APPLYKEY
        //             if (!(S_KEY[index].includes(key) || M_KEY[index].includes(key) || checkStringValidation(key)))
        //                 return false;
        //
        //             //when query contains TRANSFORMATION, every key in COLUMNS should be contained in GROUP keys
        //             if ((S_KEY[index].includes(key) || M_KEY[index].includes(key))&&('TRANSFORMATIONS' in query)){
        //                 if (!checkGroupKeys(key))
        //                     return false;
        //             }
        //
        //         }
        //         if ('ORDER' in option) {
        //             let order = option['ORDER'];
        //             if (typeof order === 'string'){
        //                 if (!(S_KEY[index].includes(order) || M_KEY[index].includes(order) || checkStringValidation(order)))
        //                     return false;
        //                 if (!columns.includes(order))
        //                     return false;
        //             }
        //
        //             else if (Object.keys(order).length === 2){
        //                 if (Object.keys(order)[0] !== 'dir')
        //                     return false;
        //                 if (Object.keys(order)[1]!== 'keys')
        //                     return false;
        //
        //                 let direction = order['dir'];
        //                 let strs: any[] = order['keys'];
        //
        //                 if (!DIRECTION.includes(direction))
        //                     return false;
        //                 if (strs.length < 1)
        //                     return false;
        //                 for (let i = 0; i < strs.length; i++){
        //                     if (!(S_KEY[index].includes(strs[i]) || M_KEY[index].includes(strs[i]) || checkStringValidation(strs[i])))
        //                         return false;
        //                     if (!columns.includes(strs[i]))
        //                         return false;
        //                 }
        //             }
        //         }
        //     }
        //     return true;
        // }
        //
        // function transformationValidation(trans: any, index: number): boolean{
        //     if (!('GROUP' in trans))
        //         return false;
        //     if (!('APPLY' in trans))
        //         return false;
        //     else{
        //         let group = trans['GROUP'];
        //         let apply = trans['APPLY'];
        //         if (group.length < 1){
        //             return false;
        //         }
        //         for (let i = 0; i < group.length; i++){
        //             let key = group[i];
        //             if (!(S_KEY[index].includes(key) || M_KEY[index].includes(key)))
        //                 return false;
        //         }
        //         if (apply.length === 0)
        //             return true;
        //         for (let i = 0; i < apply.length; i++){
        //             let applyKey = apply[i];//each APPLYKEY is an object
        //
        //             if (Object.keys(applyKey).length !== 1)//check if APPLYKEY has only one key
        //                 return false;
        //             let oneKey = Object.keys(applyKey)[0];
        //
        //             if (typeof oneKey !== 'string')//check if the type of that key is string;
        //                 return false;
        //             if (oneKey.indexOf('_') >= 0)//check if key contains '_'
        //                 return false;
        //             let applyObject = applyKey[oneKey];
        //
        //             if (Object.keys(applyObject).length !== 1)//check if there is only one APPLYTOKEN
        //                 return false;
        //             let applyToken = Object.keys(applyObject)[0];//applyToken is one of MAX, MIN, AVG, SUM and COUNT
        //
        //             if (!APPLYTOKEN.includes(applyToken))//check if applyToken is one of MAX, MIN, AVG, SUM and COUNT
        //                 return false;
        //             let key_value = applyObject[applyToken];
        //             if (applyToken === 'COUNT'){//applyToken is COUNT
        //                 if (!(S_KEY[index].includes(key_value)||M_KEY[index].includes(key_value)))
        //                     return false;
        //             }
        //             else{ // applyToken is one of MAX, MIN, AVG and SUM
        //                 if (!M_KEY[index].includes(key_value))
        //                     return false;
        //             }
        //         }
        //     }
        //     return true;
        // }
        //
        // //when query contains TRANSFORMATION, every key in COLUMNS should be contained in GROUP keys
        // function checkGroupKeys(str: any): boolean{
        //     let trans = query['TRANSFORMATIONS'];
        //     let group:any[] = trans['GROUP'];
        //     return group.includes(str);
        // }
        //
        // function checkStringValidation(str: any):boolean{
        //     if(!('TRANSFORMATIONS' in query))
        //         return false;
        //     let trans = query['TRANSFORMATIONS'];
        //     let listOfStr : any[] = [];
        //     if (!('APPLY' in trans))
        //         return false;
        //     let apply = trans['APPLY'];
        //     if (apply.length < 1)
        //         return false;
        //     for (let i = 0; i < apply.length; i++){
        //         let applyKey = apply[i];//each APPLYKEY
        //         if (Object.keys(applyKey).length !== 1)//check if APPLYKEY has only one key
        //             return false;
        //         let oneKey = Object.keys(applyKey)[0];
        //         if (typeof oneKey!== 'string')//check if the type of that key is string;
        //             return false;
        //         listOfStr.push(oneKey);
        //     }
        //     return listOfStr.includes(str);
        // }
        //
        // function courseCheck(filter: any, courses: any): boolean {
        //     if (Object.keys(filter).length !== 1) {
        //         return false;
        //     }
        //     let op = Object.keys(filter)[0];
        //     if (LOGIC.includes(op)) {
        //         let listOfFilters = filter[op];
        //         if (op == 'AND') {
        //             for (let i = 0; i < listOfFilters.length; i++) {
        //                 if (!courseCheck(listOfFilters[i], courses)) {
        //                     return false;
        //                 }
        //             }
        //             return true;
        //         } else {
        //             for (let i = 0; i < listOfFilters.length; i++) {
        //                 if (courseCheck(listOfFilters[i], courses)) {
        //                     return true;
        //                 }
        //             }
        //             return false;
        //         }
        //     }
        //
        //     if (NEGATION.includes(op)) {
        //         return !courseCheck(filter[op], courses);
        //     }
        //     if (MCOMPARISON.includes(op)) {
        //         let m_key = Object.keys(filter[op])[0];
        //         let m_value = filter[op][m_key];
        //         if (op == 'LT') {
        //             return courses[m_key] < m_value;
        //         } else if (op == 'GT') {
        //             return courses[m_key] > m_value;
        //         } else if (op == 'EQ') {
        //             return courses[m_key] === m_value;
        //         }
        //     }
        //     if (SCOMPARISON.includes(op)) {
        //         let s_key = Object.keys(filter[op])[0];
        //         let s_value = filter[op][s_key]; // s_value maybe wildcard
        //         let start = false;
        //         let end = false;
        //         if (s_value.charAt(0) === '*') {
        //             start = true;
        //             s_value = s_value.substr(1);
        //         }
        //         if (s_value.charAt(s_value.length - 1) === '*') {
        //             end = true;
        //             s_value = s_value.substr(0, s_value.length - 1);
        //         }
        //         let cString: string = courses[s_key];
        //
        //         let has = -1;
        //         while (has < cString.length) {
        //             has = cString.indexOf(s_value, has + 1);
        //             if (has < 0) {
        //                 return false;
        //             }
        //             if (has > 0 && start === false) {
        //                 return false;
        //             }
        //             if (has + s_value.length !== cString.length && !end) {
        //                 continue;
        //             }
        //             return true;
        //         }
        //         return false;
        //     }
        // }
    }
}