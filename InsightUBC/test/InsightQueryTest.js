"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var chai_1 = require("chai");
var fs = require("fs");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var Util_1 = require("../src/Util");
describe("QueryTest", function () {
    this.timeout(10000);
    var test = null;
    var coursescont = { key: "" };
    var roomscont = { key: "" };
    function compareArrays(first, second) {
        if (first.length !== second.length) {
            chai_1.expect.fail();
        }
        chai_1.expect(first).to.deep.include.members(second);
    }
    function readFile(id) {
        return new Promise(function (fulfill, reject) {
            fs.readFile('./test/' + id + '.zip', 'base64', function (err, data) {
                if (err)
                    reject(err);
                if (id === "courses")
                    coursescont.key = data;
                else if (id === "rooms")
                    roomscont.key = data;
                fulfill(data);
            });
        });
    }
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                test = new InsightFacade_1.default();
                return [2 /*return*/];
            });
        });
    });
    after(function () {
        test = null;
    });
    it("First add courses.zip into dataset", function () {
        return __awaiter(this, void 0, void 0, function () {
            var c, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("courses")];
                    case 1:
                        c = _a.sent();
                        content = coursescont.key;
                        return [2 /*return*/, test.addDataset("courses", content).then(function () {
                                console.log("Added successfully.");
                            }).catch(function (e) {
                                console.log("Error Code : " + e.code + "  " + e.body.error);
                            })];
                }
            });
        });
    });
    it("First add rooms.zip into dataset", function () {
        return __awaiter(this, void 0, void 0, function () {
            var c, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("rooms")];
                    case 1:
                        c = _a.sent();
                        content = roomscont.key;
                        return [2 /*return*/, test.addDataset("rooms", content).then(function () {
                                console.log("Added successfully.");
                            }).catch(function (e) {
                                console.log("Error Code : " + e.code + "  " + e.body.error);
                            })];
                }
            });
        });
    });
    it("Should find sections have higher than 99 average", function () {
        var query = {
            "WHERE": {
                "GT": {
                    "courses_avg": 99
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [
            { "courses_dept": "cnps", "courses_avg": 99.19 },
            { "courses_dept": "math", "courses_avg": 99.78 },
            { "courses_dept": "math", "courses_avg": 99.78 }
        ];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("Should find sections have less than 99 average and more", function () {
        var query = {
            "WHERE": {
                "OR": [
                    {
                        "AND": [
                            {
                                "GT": {
                                    "courses_avg": 90
                                }
                            },
                            {
                                "IS": {
                                    "courses_dept": "adhe"
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 95
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [
            { courses_dept: 'adhe', courses_id: '329', courses_avg: 90.02 },
            { courses_dept: 'adhe', courses_id: '412', courses_avg: 90.16 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.17 },
            { courses_dept: 'adhe', courses_id: '412', courses_avg: 90.18 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.5 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.72 },
            { courses_dept: 'adhe', courses_id: '329', courses_avg: 90.82 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.85 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.29 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.48 },
            { courses_dept: 'adhe', courses_id: '329', courses_avg: 92.54 },
            { courses_dept: 'adhe', courses_id: '329', courses_avg: 93.33 },
            { courses_dept: 'rhsc', courses_id: '501', courses_avg: 95 },
            { courses_dept: 'bmeg', courses_id: '597', courses_avg: 95 },
            { courses_dept: 'bmeg', courses_id: '597', courses_avg: 95 },
            { courses_dept: 'cnps', courses_id: '535', courses_avg: 95 },
            { courses_dept: 'cnps', courses_id: '535', courses_avg: 95 },
            { courses_dept: 'cpsc', courses_id: '589', courses_avg: 95 },
            { courses_dept: 'cpsc', courses_id: '589', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'sowk', courses_id: '570', courses_avg: 95 },
            { courses_dept: 'econ', courses_id: '516', courses_avg: 95 },
            { courses_dept: 'edcp', courses_id: '473', courses_avg: 95 },
            { courses_dept: 'edcp', courses_id: '473', courses_avg: 95 },
            { courses_dept: 'epse', courses_id: '606', courses_avg: 95 },
            { courses_dept: 'epse', courses_id: '682', courses_avg: 95 },
            { courses_dept: 'epse', courses_id: '682', courses_avg: 95 },
            { courses_dept: 'kin', courses_id: '499', courses_avg: 95 },
            { courses_dept: 'kin', courses_id: '500', courses_avg: 95 },
            { courses_dept: 'kin', courses_id: '500', courses_avg: 95 },
            { courses_dept: 'math', courses_id: '532', courses_avg: 95 },
            { courses_dept: 'math', courses_id: '532', courses_avg: 95 },
            { courses_dept: 'mtrl', courses_id: '564', courses_avg: 95 },
            { courses_dept: 'mtrl', courses_id: '564', courses_avg: 95 },
            { courses_dept: 'mtrl', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
            { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
            { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
            { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
            { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
            { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
            { courses_dept: 'nurs', courses_id: '424', courses_avg: 95 },
            { courses_dept: 'nurs', courses_id: '424', courses_avg: 95 },
            { courses_dept: 'obst', courses_id: '549', courses_avg: 95 },
            { courses_dept: 'psyc', courses_id: '501', courses_avg: 95 },
            { courses_dept: 'psyc', courses_id: '501', courses_avg: 95 },
            { courses_dept: 'econ', courses_id: '516', courses_avg: 95 },
            { courses_dept: 'adhe', courses_id: '329', courses_avg: 96.11 }
        ];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("Should find sections taught by a specific person", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "courses_instructor": "*fred*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [{ "courses_dept": "lled", "courses_avg": 49.73 }, {
                "courses_dept": "medg",
                "courses_avg": 54.43
            }, { "courses_dept": "lled", "courses_avg": 55.67 }, {
                "courses_dept": "lled",
                "courses_avg": 57.33
            }, { "courses_dept": "engl", "courses_avg": 58.43 }, {
                "courses_dept": "lled",
                "courses_avg": 61.81
            }, { "courses_dept": "medg", "courses_avg": 62 }, {
                "courses_dept": "geog",
                "courses_avg": 62.22
            }, { "courses_dept": "geog", "courses_avg": 62.75 }, {
                "courses_dept": "econ",
                "courses_avg": 62.88
            }, { "courses_dept": "econ", "courses_avg": 63.13 }, {
                "courses_dept": "engl",
                "courses_avg": 63.37
            }, { "courses_dept": "geog", "courses_avg": 63.71 }, {
                "courses_dept": "engl",
                "courses_avg": 63.8
            }, { "courses_dept": "engl", "courses_avg": 64.09 }, {
                "courses_dept": "math",
                "courses_avg": 64.23
            }, { "courses_dept": "econ", "courses_avg": 64.75 }, {
                "courses_dept": "engl",
                "courses_avg": 64.76
            }, { "courses_dept": "geog", "courses_avg": 64.83 }, {
                "courses_dept": "engl",
                "courses_avg": 65.2
            }, { "courses_dept": "econ", "courses_avg": 65.21 }, {
                "courses_dept": "geog",
                "courses_avg": 65.26
            }, { "courses_dept": "econ", "courses_avg": 65.27 }, {
                "courses_dept": "geog",
                "courses_avg": 65.4
            }, { "courses_dept": "geog", "courses_avg": 65.51 }, {
                "courses_dept": "geog",
                "courses_avg": 65.72
            }, { "courses_dept": "geog", "courses_avg": 66.08 }, {
                "courses_dept": "medg",
                "courses_avg": 66.56
            }, { "courses_dept": "econ", "courses_avg": 67.28 }, {
                "courses_dept": "econ",
                "courses_avg": 67.45
            }, { "courses_dept": "econ", "courses_avg": 67.48 }, {
                "courses_dept": "biol",
                "courses_avg": 67.68
            }, { "courses_dept": "geog", "courses_avg": 67.7 }, {
                "courses_dept": "econ",
                "courses_avg": 68.11
            }, { "courses_dept": "econ", "courses_avg": 68.19 }, {
                "courses_dept": "geog",
                "courses_avg": 68.59
            }, { "courses_dept": "econ", "courses_avg": 68.61 }, {
                "courses_dept": "econ",
                "courses_avg": 68.62
            }, { "courses_dept": "biol", "courses_avg": 68.65 }, {
                "courses_dept": "econ",
                "courses_avg": 68.68
            }, { "courses_dept": "geog", "courses_avg": 68.73 }, {
                "courses_dept": "econ",
                "courses_avg": 68.74
            }, { "courses_dept": "geog", "courses_avg": 68.78 }, {
                "courses_dept": "engl",
                "courses_avg": 68.89
            }, { "courses_dept": "econ", "courses_avg": 69 }, {
                "courses_dept": "engl",
                "courses_avg": 69.13
            }, { "courses_dept": "econ", "courses_avg": 69.15 }, {
                "courses_dept": "econ",
                "courses_avg": 69.18
            }, { "courses_dept": "econ", "courses_avg": 69.51 }, {
                "courses_dept": "medg",
                "courses_avg": 69.75
            }, { "courses_dept": "mech", "courses_avg": 70.1 }, {
                "courses_dept": "econ",
                "courses_avg": 70.13
            }, { "courses_dept": "econ", "courses_avg": 70.15 }, {
                "courses_dept": "econ",
                "courses_avg": 70.21
            }, { "courses_dept": "mech", "courses_avg": 70.26 }, {
                "courses_dept": "mech",
                "courses_avg": 70.26
            }, { "courses_dept": "econ", "courses_avg": 70.67 }, {
                "courses_dept": "econ",
                "courses_avg": 70.69
            }, { "courses_dept": "biol", "courses_avg": 70.76 }, {
                "courses_dept": "econ",
                "courses_avg": 70.94
            }, { "courses_dept": "engl", "courses_avg": 70.94 }, {
                "courses_dept": "engl",
                "courses_avg": 71.08
            }, { "courses_dept": "geog", "courses_avg": 71.13 }, {
                "courses_dept": "engl",
                "courses_avg": 71.16
            }, { "courses_dept": "econ", "courses_avg": 71.59 }, {
                "courses_dept": "econ",
                "courses_avg": 71.68
            }, { "courses_dept": "mech", "courses_avg": 71.77 }, {
                "courses_dept": "engl",
                "courses_avg": 71.83
            }, { "courses_dept": "engl", "courses_avg": 72 }, {
                "courses_dept": "econ",
                "courses_avg": 72
            }, { "courses_dept": "medg", "courses_avg": 72.2 }, {
                "courses_dept": "econ",
                "courses_avg": 72.51
            }, { "courses_dept": "engl", "courses_avg": 72.58 }, {
                "courses_dept": "poli",
                "courses_avg": 72.69
            }, { "courses_dept": "poli", "courses_avg": 72.92 }, {
                "courses_dept": "econ",
                "courses_avg": 72.94
            }, { "courses_dept": "geog", "courses_avg": 73 }, {
                "courses_dept": "engl",
                "courses_avg": 73.1
            }, { "courses_dept": "econ", "courses_avg": 73.22 }, {
                "courses_dept": "engl",
                "courses_avg": 73.27
            }, { "courses_dept": "econ", "courses_avg": 73.73 }, {
                "courses_dept": "econ",
                "courses_avg": 73.8
            }, { "courses_dept": "econ", "courses_avg": 73.81 }, {
                "courses_dept": "cpsc",
                "courses_avg": 73.95
            }, { "courses_dept": "lled", "courses_avg": 74.1 }, {
                "courses_dept": "geog",
                "courses_avg": 74.14
            }, { "courses_dept": "econ", "courses_avg": 74.15 }, {
                "courses_dept": "hist",
                "courses_avg": 74.26
            }, { "courses_dept": "econ", "courses_avg": 74.29 }, {
                "courses_dept": "econ",
                "courses_avg": 74.33
            }, { "courses_dept": "lled", "courses_avg": 74.54 }, {
                "courses_dept": "econ",
                "courses_avg": 74.56
            }, { "courses_dept": "poli", "courses_avg": 74.69 }, {
                "courses_dept": "civl",
                "courses_avg": 74.78
            }, { "courses_dept": "econ", "courses_avg": 75 }, {
                "courses_dept": "mech",
                "courses_avg": 75.13
            }, { "courses_dept": "civl", "courses_avg": 75.39 }, {
                "courses_dept": "engl",
                "courses_avg": 75.5
            }, { "courses_dept": "comm", "courses_avg": 75.58 }, {
                "courses_dept": "geog",
                "courses_avg": 75.72
            }, { "courses_dept": "comm", "courses_avg": 75.8 }, {
                "courses_dept": "comm",
                "courses_avg": 75.85
            }, { "courses_dept": "comm", "courses_avg": 75.9 }, {
                "courses_dept": "comm",
                "courses_avg": 76.15
            }, { "courses_dept": "geog", "courses_avg": 76.22 }, {
                "courses_dept": "econ",
                "courses_avg": 76.24
            }, { "courses_dept": "comm", "courses_avg": 76.35 }, {
                "courses_dept": "comm",
                "courses_avg": 76.4
            }, { "courses_dept": "comm", "courses_avg": 76.4 }, {
                "courses_dept": "comm",
                "courses_avg": 76.46
            }, { "courses_dept": "poli", "courses_avg": 76.78 }, {
                "courses_dept": "comm",
                "courses_avg": 76.81
            }, { "courses_dept": "comm", "courses_avg": 77.11 }, {
                "courses_dept": "econ",
                "courses_avg": 77.21
            }, { "courses_dept": "comm", "courses_avg": 77.29 }, {
                "courses_dept": "engl",
                "courses_avg": 77.33
            }, { "courses_dept": "comm", "courses_avg": 77.61 }, {
                "courses_dept": "mech",
                "courses_avg": 77.63
            }, { "courses_dept": "comm", "courses_avg": 77.65 }, {
                "courses_dept": "econ",
                "courses_avg": 77.65
            }, { "courses_dept": "mech", "courses_avg": 77.67 }, {
                "courses_dept": "poli",
                "courses_avg": 77.74
            }, { "courses_dept": "comm", "courses_avg": 77.84 }, {
                "courses_dept": "comm",
                "courses_avg": 78.06
            }, { "courses_dept": "comm", "courses_avg": 78.2 }, {
                "courses_dept": "comm",
                "courses_avg": 78.37
            }, { "courses_dept": "biol", "courses_avg": 78.38 }, {
                "courses_dept": "comm",
                "courses_avg": 78.4
            }, { "courses_dept": "comm", "courses_avg": 78.5 }, {
                "courses_dept": "comm",
                "courses_avg": 78.8
            }, { "courses_dept": "geog", "courses_avg": 78.9 }, {
                "courses_dept": "comm",
                "courses_avg": 79
            }, { "courses_dept": "lled", "courses_avg": 79.29 }, {
                "courses_dept": "poli",
                "courses_avg": 79.42
            }, { "courses_dept": "comm", "courses_avg": 79.6 }, {
                "courses_dept": "comm",
                "courses_avg": 79.6
            }, { "courses_dept": "comm", "courses_avg": 79.63 }, {
                "courses_dept": "comm",
                "courses_avg": 79.75
            }, { "courses_dept": "comm", "courses_avg": 79.9 }, {
                "courses_dept": "musc",
                "courses_avg": 79.91
            }, { "courses_dept": "comm", "courses_avg": 80 }, {
                "courses_dept": "econ",
                "courses_avg": 80.11
            }, { "courses_dept": "mech", "courses_avg": 80.25 }, {
                "courses_dept": "econ",
                "courses_avg": 80.28
            }, { "courses_dept": "econ", "courses_avg": 80.39 }, {
                "courses_dept": "path",
                "courses_avg": 80.58
            }, { "courses_dept": "jrnl", "courses_avg": 80.63 }, {
                "courses_dept": "econ",
                "courses_avg": 80.64
            }, { "courses_dept": "lled", "courses_avg": 80.67 }, {
                "courses_dept": "comm",
                "courses_avg": 80.74
            }, { "courses_dept": "musc", "courses_avg": 80.95 }, {
                "courses_dept": "comm",
                "courses_avg": 81.28
            }, { "courses_dept": "path", "courses_avg": 82.21 }, {
                "courses_dept": "stat",
                "courses_avg": 82.6
            }, { "courses_dept": "path", "courses_avg": 82.81 }, {
                "courses_dept": "cnps",
                "courses_avg": 82.92
            }, { "courses_dept": "mech", "courses_avg": 83.64 }, {
                "courses_dept": "engl",
                "courses_avg": 84.12
            }, { "courses_dept": "geog", "courses_avg": 84.13 }, {
                "courses_dept": "math",
                "courses_avg": 84.85
            }, { "courses_dept": "path", "courses_avg": 85 }, {
                "courses_dept": "geog",
                "courses_avg": 85.22
            }, { "courses_dept": "geog", "courses_avg": 85.63 }, {
                "courses_dept": "musc",
                "courses_avg": 85.74
            }, { "courses_dept": "biol", "courses_avg": 85.75 }, {
                "courses_dept": "musc",
                "courses_avg": 86.23
            }, { "courses_dept": "path", "courses_avg": 86.39 }, {
                "courses_dept": "mech",
                "courses_avg": 86.42
            }, { "courses_dept": "mech", "courses_avg": 86.8 }, {
                "courses_dept": "geog",
                "courses_avg": 86.91
            }, { "courses_dept": "path", "courses_avg": 87 }, {
                "courses_dept": "path",
                "courses_avg": 87.06
            }, { "courses_dept": "musc", "courses_avg": 87.23 }, {
                "courses_dept": "path",
                "courses_avg": 87.35
            }, { "courses_dept": "musc", "courses_avg": 87.47 }, {
                "courses_dept": "mech",
                "courses_avg": 87.58
            }, { "courses_dept": "musc", "courses_avg": 87.63 }, {
                "courses_dept": "stat",
                "courses_avg": 87.67
            }, { "courses_dept": "musc", "courses_avg": 87.67 }, {
                "courses_dept": "path",
                "courses_avg": 87.86
            }, { "courses_dept": "musc", "courses_avg": 88.15 }, {
                "courses_dept": "musc",
                "courses_avg": 88.67
            }, { "courses_dept": "musc", "courses_avg": 88.89 }, {
                "courses_dept": "musc",
                "courses_avg": 89
            }, { "courses_dept": "musc", "courses_avg": 89 }, {
                "courses_dept": "musc",
                "courses_avg": 89.13
            }, { "courses_dept": "musc", "courses_avg": 89.27 }, {
                "courses_dept": "biol",
                "courses_avg": 89.3
            }, { "courses_dept": "musc", "courses_avg": 89.33 }, {
                "courses_dept": "musc",
                "courses_avg": 89.46
            }, { "courses_dept": "civl", "courses_avg": 90 }, {
                "courses_dept": "biol",
                "courses_avg": 90.17
            }, { "courses_dept": "musc", "courses_avg": 90.19 }, {
                "courses_dept": "biol",
                "courses_avg": 90.42
            }, { "courses_dept": "mech", "courses_avg": 91.16 }, { "courses_dept": "mech", "courses_avg": 92.59 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("find sections taught by a specific person3", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "courses_instructor": "fred"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("find sections taught by a specific person4", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "courses_instructor": "fred*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("find sections taught by a specific person5", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "courses_instructor": "*fred"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_instructor",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [{
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 62.88
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 63.13
            }, { "courses_dept": "engl", "courses_instructor": "bowers, fred", "courses_avg": 63.8 }, {
                "courses_dept": "engl",
                "courses_instructor": "bowers, fred",
                "courses_avg": 64.09
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 64.75
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 65.21
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 65.27
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 67.28
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 67.45
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 67.48
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 68.11
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 68.19
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 68.61
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 68.62
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 68.68
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 68.74
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 69
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 69.15
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 69.18
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 69.51
            }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 70.1
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 70.13
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 70.15
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 70.21
            }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 70.26
            }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 70.26
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 70.67
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 70.69
            }, {
                "courses_dept": "biol",
                "courses_instructor": "ellis, shona margaret;graham, sean;sack, fred",
                "courses_avg": 70.76
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 70.94
            }, {
                "courses_dept": "engl",
                "courses_instructor": "bowers, fred",
                "courses_avg": 70.94
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 71.59
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 71.68
            }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 71.77
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 72
            }, { "courses_dept": "engl", "courses_instructor": "bowers, fred", "courses_avg": 72 }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 72.51
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 72.94
            }, { "courses_dept": "engl", "courses_instructor": "bowers, fred", "courses_avg": 73.1 }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 73.22
            }, {
                "courses_dept": "engl",
                "courses_instructor": "bowers, fred",
                "courses_avg": 73.27
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 73.73
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 73.8
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 73.81
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 74.15
            }, {
                "courses_dept": "hist",
                "courses_instructor": "whitehead, cameron ean alfred",
                "courses_avg": 74.26
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 74.29
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 74.33
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 74.56
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 75
            }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 75.13
            }, { "courses_dept": "engl", "courses_instructor": "bowers, fred", "courses_avg": 75.5 }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 76.24
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 77.21
            }, {
                "courses_dept": "engl",
                "courses_instructor": "bowers, fred",
                "courses_avg": 77.33
            }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 77.63
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 77.65
            }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 77.67
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 80.11
            }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 80.25
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 80.28
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 80.39
            }, {
                "courses_dept": "jrnl",
                "courses_instructor": "fletcher, fred",
                "courses_avg": 80.63
            }, {
                "courses_dept": "econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 80.64
            }, { "courses_dept": "cnps", "courses_instructor": "chou, fred", "courses_avg": 82.92 }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 83.64
            }, {
                "courses_dept": "engl",
                "courses_instructor": "bowers, fred",
                "courses_avg": 84.12
            }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 86.42
            }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 86.8
            }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 87.58
            }, {
                "courses_dept": "mech",
                "courses_instructor": "de silva, clarence wilfred",
                "courses_avg": 91.16
            }, { "courses_dept": "mech", "courses_instructor": "de silva, clarence wilfred", "courses_avg": 92.59 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("Should find sections taught by a specific person6", function () {
        var query = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "courses_instructor": "*na"
                        }
                    },
                    {
                        "IS": {
                            "courses_dept": "cpsc"
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_instructor"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [{
                "courses_dept": "cpsc",
                "courses_avg": 67.48,
                "courses_instructor": "conati, cristina"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 68.84,
                "courses_instructor": "conati, cristina"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 70.38,
                "courses_instructor": "berg, celina"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 70.96,
                "courses_instructor": "conati, cristina"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 71.18,
                "courses_instructor": "mcgrenere, joanna"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 71.52,
                "courses_instructor": "conati, cristina"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 71.55,
                "courses_instructor": "conati, cristina"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 71.77,
                "courses_instructor": "conati, cristina"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 73.55,
                "courses_instructor": "conati, cristina"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 74.62,
                "courses_instructor": "conati, cristina"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 75.06,
                "courses_instructor": "berg, celina"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 76.94,
                "courses_instructor": "mcgrenere, joanna"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 78.42,
                "courses_instructor": "mcgrenere, joanna"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 78.48,
                "courses_instructor": "mcgrenere, joanna"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 79.24,
                "courses_instructor": "mcgrenere, joanna"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 80.62,
                "courses_instructor": "mcgrenere, joanna"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 81.06,
                "courses_instructor": "conati, cristina"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 82.32,
                "courses_instructor": "mcgrenere, joanna"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 83.41,
                "courses_instructor": "mcgrenere, joanna"
            }, { "courses_dept": "cpsc", "courses_avg": 83.43, "courses_instructor": "conati, cristina" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("Should find sections taught by a specific person7", function () {
        var query = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "courses_instructor": "*acton, donald*"
                        }
                    },
                    {
                        "IS": {
                            "courses_dept": "cpsc"
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg",
                    "courses_instructor"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [{
                "courses_dept": "cpsc",
                "courses_avg": 68.54,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 68.79,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 69.24,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 69.25,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 69.26,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 69.53,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 69.65,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 70.5,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 70.66,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 70.7,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 70.87,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 71.04,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 71.05,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 71.33,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 71.59,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 71.72,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 71.75,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 71.81,
                "courses_instructor": "acton, donald"
            }, { "courses_dept": "cpsc", "courses_avg": 72, "courses_instructor": "acton, donald" }, {
                "courses_dept": "cpsc",
                "courses_avg": 72,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 72.18,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 72.23,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 73.13,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 73.37,
                "courses_instructor": "acton, donald"
            }, {
                "courses_dept": "cpsc",
                "courses_avg": 73.45,
                "courses_instructor": "acton, donald"
            }, { "courses_dept": "cpsc", "courses_avg": 76.31, "courses_instructor": "acton, donald" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("Should be able to find sections with high averages", function () {
        var query = {
            "WHERE": {
                "GT": {
                    "courses_avg": 97
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [
            { "courses_dept": "epse", "courses_avg": 97.09 }, {
                "courses_dept": "math",
                "courses_avg": 97.09
            }, { "courses_dept": "math", "courses_avg": 97.09 }, {
                "courses_dept": "epse",
                "courses_avg": 97.09
            }, { "courses_dept": "math", "courses_avg": 97.25 }, {
                "courses_dept": "math",
                "courses_avg": 97.25
            }, { "courses_dept": "epse", "courses_avg": 97.29 }, {
                "courses_dept": "epse",
                "courses_avg": 97.29
            }, { "courses_dept": "nurs", "courses_avg": 97.33 }, {
                "courses_dept": "nurs",
                "courses_avg": 97.33
            }, { "courses_dept": "epse", "courses_avg": 97.41 }, {
                "courses_dept": "epse",
                "courses_avg": 97.41
            }, { "courses_dept": "cnps", "courses_avg": 97.47 }, {
                "courses_dept": "cnps",
                "courses_avg": 97.47
            }, { "courses_dept": "math", "courses_avg": 97.48 }, {
                "courses_dept": "math",
                "courses_avg": 97.48
            }, { "courses_dept": "educ", "courses_avg": 97.5 }, {
                "courses_dept": "nurs",
                "courses_avg": 97.53
            }, { "courses_dept": "nurs", "courses_avg": 97.53 }, {
                "courses_dept": "epse",
                "courses_avg": 97.67
            }, { "courses_dept": "epse", "courses_avg": 97.69 }, {
                "courses_dept": "epse",
                "courses_avg": 97.78
            }, { "courses_dept": "crwr", "courses_avg": 98 }, {
                "courses_dept": "crwr",
                "courses_avg": 98
            }, { "courses_dept": "epse", "courses_avg": 98.08 }, {
                "courses_dept": "nurs",
                "courses_avg": 98.21
            }, { "courses_dept": "nurs", "courses_avg": 98.21 }, {
                "courses_dept": "epse",
                "courses_avg": 98.36
            }, { "courses_dept": "epse", "courses_avg": 98.45 }, {
                "courses_dept": "epse",
                "courses_avg": 98.45
            }, { "courses_dept": "nurs", "courses_avg": 98.5 }, {
                "courses_dept": "nurs",
                "courses_avg": 98.5
            }, { "courses_dept": "epse", "courses_avg": 98.58 }, {
                "courses_dept": "nurs",
                "courses_avg": 98.58
            }, { "courses_dept": "nurs", "courses_avg": 98.58 }, {
                "courses_dept": "epse",
                "courses_avg": 98.58
            }, { "courses_dept": "epse", "courses_avg": 98.7 }, {
                "courses_dept": "nurs",
                "courses_avg": 98.71
            }, { "courses_dept": "nurs", "courses_avg": 98.71 }, {
                "courses_dept": "eece",
                "courses_avg": 98.75
            }, { "courses_dept": "eece", "courses_avg": 98.75 }, {
                "courses_dept": "epse",
                "courses_avg": 98.76
            }, { "courses_dept": "epse", "courses_avg": 98.76 }, {
                "courses_dept": "epse",
                "courses_avg": 98.8
            }, { "courses_dept": "spph", "courses_avg": 98.98 }, {
                "courses_dept": "spph",
                "courses_avg": 98.98
            }, { "courses_dept": "cnps", "courses_avg": 99.19 }, {
                "courses_dept": "math",
                "courses_avg": 99.78
            }, { "courses_dept": "math", "courses_avg": 99.78 }
        ];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("Should be able to find sections with high averages2", function () {
        var query = {
            "WHERE": {
                "GT": {
                    "courses_avg": 99
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [
            { "courses_dept": "cnps", "courses_avg": 99.19 }, {
                "courses_dept": "math",
                "courses_avg": 99.78
            }, { "courses_dept": "math", "courses_avg": 99.78 }
        ];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("Should be able to find sections with lots of auditors", function () {
        var query = {
            "WHERE": {
                "GT": {
                    "courses_audit": 4
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [
            { "courses_dept": "musc", "courses_avg": 60.04 }, {
                "courses_dept": "musc",
                "courses_avg": 60.04
            }, { "courses_dept": "phil", "courses_avg": 65.74 }, {
                "courses_dept": "econ",
                "courses_avg": 67.26
            }, { "courses_dept": "micb", "courses_avg": 67.66 }, {
                "courses_dept": "micb",
                "courses_avg": 67.66
            }, { "courses_dept": "geob", "courses_avg": 68.69 }, {
                "courses_dept": "frst",
                "courses_avg": 68.72
            }, { "courses_dept": "econ", "courses_avg": 68.98 }, {
                "courses_dept": "psyc",
                "courses_avg": 69.05
            }, { "courses_dept": "mine", "courses_avg": 69.36 }, {
                "courses_dept": "mine",
                "courses_avg": 69.36
            }, { "courses_dept": "biol", "courses_avg": 69.54 }, {
                "courses_dept": "ital",
                "courses_avg": 69.84
            }, { "courses_dept": "micb", "courses_avg": 69.97 }, {
                "courses_dept": "japn",
                "courses_avg": 70.12
            }, { "courses_dept": "span", "courses_avg": 70.38 }, {
                "courses_dept": "japn",
                "courses_avg": 70.66
            }, { "courses_dept": "comm", "courses_avg": 70.74 }, {
                "courses_dept": "econ",
                "courses_avg": 70.77
            }, { "courses_dept": "rhsc", "courses_avg": 70.83 }, {
                "courses_dept": "econ",
                "courses_avg": 70.86
            }, { "courses_dept": "econ", "courses_avg": 70.86 }, {
                "courses_dept": "span",
                "courses_avg": 70.95
            }, { "courses_dept": "mtrl", "courses_avg": 71.14 }, {
                "courses_dept": "comm",
                "courses_avg": 71.25
            }, { "courses_dept": "econ", "courses_avg": 71.28 }, {
                "courses_dept": "econ",
                "courses_avg": 71.28
            }, { "courses_dept": "hist", "courses_avg": 71.52 }, {
                "courses_dept": "span",
                "courses_avg": 71.57
            }, { "courses_dept": "biol", "courses_avg": 71.78 }, {
                "courses_dept": "ital",
                "courses_avg": 71.87
            }, { "courses_dept": "biol", "courses_avg": 72.35 }, {
                "courses_dept": "biol",
                "courses_avg": 72.35
            }, { "courses_dept": "fren", "courses_avg": 73.4 }, {
                "courses_dept": "musc",
                "courses_avg": 73.44
            }, { "courses_dept": "econ", "courses_avg": 73.46 }, {
                "courses_dept": "fren",
                "courses_avg": 73.51
            }, { "courses_dept": "comm", "courses_avg": 73.86 }, {
                "courses_dept": "geob",
                "courses_avg": 74.04
            }, { "courses_dept": "chin", "courses_avg": 74.04 }, {
                "courses_dept": "fren",
                "courses_avg": 74.46
            }, { "courses_dept": "fren", "courses_avg": 74.73 }, {
                "courses_dept": "comm",
                "courses_avg": 75.06
            }, { "courses_dept": "ital", "courses_avg": 75.08 }, {
                "courses_dept": "japn",
                "courses_avg": 75.16
            }, { "courses_dept": "fren", "courses_avg": 75.17 }, {
                "courses_dept": "stat",
                "courses_avg": 75.37
            }, { "courses_dept": "comm", "courses_avg": 75.65 }, {
                "courses_dept": "rhsc",
                "courses_avg": 76
            }, { "courses_dept": "germ", "courses_avg": 76.13 }, {
                "courses_dept": "arth",
                "courses_avg": 76.18
            }, { "courses_dept": "mine", "courses_avg": 76.19 }, {
                "courses_dept": "cons",
                "courses_avg": 76.21
            }, { "courses_dept": "cons", "courses_avg": 76.21 }, {
                "courses_dept": "micb",
                "courses_avg": 76.22
            }, { "courses_dept": "chin", "courses_avg": 76.25 }, {
                "courses_dept": "chin",
                "courses_avg": 76.25
            }, { "courses_dept": "civl", "courses_avg": 76.83 }, {
                "courses_dept": "civl",
                "courses_avg": 76.83
            }, { "courses_dept": "micb", "courses_avg": 76.83 }, {
                "courses_dept": "germ",
                "courses_avg": 76.99
            }, { "courses_dept": "rhsc", "courses_avg": 77 }, {
                "courses_dept": "comm",
                "courses_avg": 77.05
            }, { "courses_dept": "musc", "courses_avg": 77.19 }, {
                "courses_dept": "frst",
                "courses_avg": 77.36
            }, { "courses_dept": "frst", "courses_avg": 77.36 }, {
                "courses_dept": "stat",
                "courses_avg": 77.41
            }, { "courses_dept": "cpsc", "courses_avg": 77.43 }, {
                "courses_dept": "germ",
                "courses_avg": 77.49
            }, { "courses_dept": "rhsc", "courses_avg": 77.65 }, {
                "courses_dept": "germ",
                "courses_avg": 77.81
            }, { "courses_dept": "cpsc", "courses_avg": 77.93 }, {
                "courses_dept": "arth",
                "courses_avg": 78.02
            }, { "courses_dept": "germ", "courses_avg": 78.54 }, {
                "courses_dept": "rhsc",
                "courses_avg": 78.63
            }, { "courses_dept": "micb", "courses_avg": 79.09 }, {
                "courses_dept": "germ",
                "courses_avg": 79.45
            }, { "courses_dept": "frst", "courses_avg": 79.64 }, {
                "courses_dept": "frst",
                "courses_avg": 79.64
            }, { "courses_dept": "libr", "courses_avg": 79.72 }, {
                "courses_dept": "libr",
                "courses_avg": 79.72
            }, { "courses_dept": "spph", "courses_avg": 79.97 }, {
                "courses_dept": "mech",
                "courses_avg": 80
            }, { "courses_dept": "germ", "courses_avg": 80.04 }, {
                "courses_dept": "cpsc",
                "courses_avg": 80.29
            }, { "courses_dept": "cpsc", "courses_avg": 80.29 }, {
                "courses_dept": "spph",
                "courses_avg": 80.53
            }, { "courses_dept": "bafi", "courses_avg": 80.54 }, {
                "courses_dept": "chbe",
                "courses_avg": 80.81
            }, { "courses_dept": "chbe", "courses_avg": 80.81 }, {
                "courses_dept": "bafi",
                "courses_avg": 81
            }, { "courses_dept": "rhsc", "courses_avg": 81.09 }, {
                "courses_dept": "civl",
                "courses_avg": 81.29
            }, { "courses_dept": "civl", "courses_avg": 81.29 }, {
                "courses_dept": "germ",
                "courses_avg": 81.79
            }, { "courses_dept": "eece", "courses_avg": 82.36 }, {
                "courses_dept": "eece",
                "courses_avg": 82.36
            }, { "courses_dept": "rhsc", "courses_avg": 82.56 }, {
                "courses_dept": "rhsc",
                "courses_avg": 82.67
            }, { "courses_dept": "spph", "courses_avg": 82.95 }, {
                "courses_dept": "frst",
                "courses_avg": 82.95
            }, { "courses_dept": "frst", "courses_avg": 82.95 }, {
                "courses_dept": "spph",
                "courses_avg": 83.49
            }, { "courses_dept": "rhsc", "courses_avg": 83.86 }, {
                "courses_dept": "rhsc",
                "courses_avg": 83.89
            }, { "courses_dept": "chbe", "courses_avg": 84.09 }, {
                "courses_dept": "educ",
                "courses_avg": 84.14
            }, { "courses_dept": "educ", "courses_avg": 84.14 }, {
                "courses_dept": "rhsc",
                "courses_avg": 84.17
            }, { "courses_dept": "germ", "courses_avg": 84.21 }, {
                "courses_dept": "rhsc",
                "courses_avg": 84.33
            }, { "courses_dept": "biol", "courses_avg": 84.38 }, {
                "courses_dept": "biol",
                "courses_avg": 84.38
            }, { "courses_dept": "soci", "courses_avg": 84.44 }, {
                "courses_dept": "soci",
                "courses_avg": 84.44
            }, { "courses_dept": "rhsc", "courses_avg": 84.5 }, {
                "courses_dept": "rhsc",
                "courses_avg": 84.5
            }, { "courses_dept": "cnto", "courses_avg": 84.59 }, {
                "courses_dept": "cnto",
                "courses_avg": 84.6
            }, { "courses_dept": "rhsc", "courses_avg": 84.71 }, {
                "courses_dept": "rhsc",
                "courses_avg": 84.83
            }, { "courses_dept": "rhsc", "courses_avg": 85.13 }, {
                "courses_dept": "frst",
                "courses_avg": 85.14
            }, { "courses_dept": "frst", "courses_avg": 85.14 }, {
                "courses_dept": "rhsc",
                "courses_avg": 85.14
            }, { "courses_dept": "rhsc", "courses_avg": 85.5 }, {
                "courses_dept": "frst",
                "courses_avg": 85.56
            }, { "courses_dept": "frst", "courses_avg": 85.56 }, {
                "courses_dept": "rhsc",
                "courses_avg": 85.58
            }, { "courses_dept": "frst", "courses_avg": 85.6 }, {
                "courses_dept": "frst",
                "courses_avg": 85.6
            }, { "courses_dept": "rhsc", "courses_avg": 85.67 }, {
                "courses_dept": "rhsc",
                "courses_avg": 85.67
            }, { "courses_dept": "rhsc", "courses_avg": 85.73 }, {
                "courses_dept": "rhsc",
                "courses_avg": 85.78
            }, { "courses_dept": "rhsc", "courses_avg": 85.8 }, {
                "courses_dept": "rhsc",
                "courses_avg": 86
            }, { "courses_dept": "rhsc", "courses_avg": 86 }, {
                "courses_dept": "rhsc",
                "courses_avg": 86.19
            }, { "courses_dept": "frst", "courses_avg": 86.42 }, {
                "courses_dept": "frst",
                "courses_avg": 86.42
            }, { "courses_dept": "rhsc", "courses_avg": 86.45 }, {
                "courses_dept": "rhsc",
                "courses_avg": 86.78
            }, { "courses_dept": "rhsc", "courses_avg": 86.86 }, {
                "courses_dept": "rhsc",
                "courses_avg": 86.89
            }, { "courses_dept": "rhsc", "courses_avg": 86.9 }, {
                "courses_dept": "rhsc",
                "courses_avg": 87
            }, { "courses_dept": "rhsc", "courses_avg": 87 }, {
                "courses_dept": "rhsc",
                "courses_avg": 87.03
            }, { "courses_dept": "rhsc", "courses_avg": 87.14 }, {
                "courses_dept": "rhsc",
                "courses_avg": 87.26
            }, { "courses_dept": "rhsc", "courses_avg": 87.4 }, {
                "courses_dept": "rhsc",
                "courses_avg": 87.86
            }, { "courses_dept": "rhsc", "courses_avg": 88 }, {
                "courses_dept": "rhsc",
                "courses_avg": 88
            }, { "courses_dept": "rhsc", "courses_avg": 88.2 }, {
                "courses_dept": "rhsc",
                "courses_avg": 88.25
            }, { "courses_dept": "rhsc", "courses_avg": 88.5 }, {
                "courses_dept": "rhsc",
                "courses_avg": 88.57
            }, { "courses_dept": "educ", "courses_avg": 88.75 }, {
                "courses_dept": "educ",
                "courses_avg": 88.75
            }, { "courses_dept": "rhsc", "courses_avg": 88.79 }, {
                "courses_dept": "rhsc",
                "courses_avg": 89.5
            }, { "courses_dept": "rhsc", "courses_avg": 89.67 }, {
                "courses_dept": "epse",
                "courses_avg": 89.96
            }, { "courses_dept": "epse", "courses_avg": 89.96 }, {
                "courses_dept": "rhsc",
                "courses_avg": 90
            }, { "courses_dept": "cpsc", "courses_avg": 90.53 }, {
                "courses_dept": "cpsc",
                "courses_avg": 90.53
            }, { "courses_dept": "epse", "courses_avg": 90.8 }, {
                "courses_dept": "epse",
                "courses_avg": 90.8
            }, { "courses_dept": "rhsc", "courses_avg": 91 }, {
                "courses_dept": "rhsc",
                "courses_avg": 91
            }, { "courses_dept": "cpsc", "courses_avg": 91.22 }, {
                "courses_dept": "cpsc",
                "courses_avg": 91.22
            }, { "courses_dept": "rhsc", "courses_avg": 91.4 }, {
                "courses_dept": "econ",
                "courses_avg": 93.33
            }, { "courses_dept": "econ", "courses_avg": 93.33 }, {
                "courses_dept": "rhsc",
                "courses_avg": 94
            }, { "courses_dept": "edcp", "courses_avg": 94.17 }, {
                "courses_dept": "edcp",
                "courses_avg": 94.17
            }, { "courses_dept": "aanb", "courses_avg": 94.44 }, {
                "courses_dept": "aanb",
                "courses_avg": 94.44
            }, { "courses_dept": "epse", "courses_avg": 95 }, { "courses_dept": "epse", "courses_avg": 95 }
        ];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("Should be able to find sections with lots of auditors2", function () {
        var query = {
            "WHERE": {
                "EQ": {
                    "courses_audit": 8
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_instructor"
                ],
                "ORDER": "courses_id"
            }
        };
        var second = [
            { "courses_id": "100", "courses_instructor": "" }, {
                "courses_id": "100",
                "courses_instructor": ""
            }, { "courses_id": "295", "courses_instructor": "" }, {
                "courses_id": "302",
                "courses_instructor": ""
            }, { "courses_id": "430", "courses_instructor": "" }, {
                "courses_id": "505",
                "courses_instructor": "tba"
            }, { "courses_id": "505", "courses_instructor": "" }, {
                "courses_id": "683",
                "courses_instructor": "zumbo, bruno"
            }, { "courses_id": "683", "courses_instructor": "" }
        ];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("Should be able to find course average for a course", function () {
        var query = {
            "WHERE": {
                "IS": { "courses_title": "applied econ" }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_title",
                    "courses_instructor",
                    "courses_avg",
                    "courses_pass"
                ],
                "ORDER": "courses_title"
            }
        };
        var second = [
            {
                "courses_title": "applied econ",
                "courses_instructor": "lucke, bernd",
                "courses_avg": 78.24,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "adshade, marina",
                "courses_avg": 79.4,
                "courses_pass": 15
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 80.11,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 79.96,
                "courses_pass": 52
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "adshade, marina",
                "courses_avg": 71.47,
                "courses_pass": 15
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 73.73,
                "courses_pass": 15
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 72.94,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "fortin, nicole",
                "courses_avg": 81.95,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "milligan, kevin",
                "courses_avg": 81.56,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "whistler, diana",
                "courses_avg": 79.75,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "szkup, michal",
                "courses_avg": 81.63,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "halevy, yoram",
                "courses_avg": 80.17,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 81.44,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 82.7,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "song, kyungchul",
                "courses_avg": 82.65,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "whistler, diana",
                "courses_avg": 80.85,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "green, david",
                "courses_avg": 81,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "neary, hugh",
                "courses_avg": 85.53,
                "courses_pass": 15
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 80.03,
                "courses_pass": 255
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "douglas, catherine",
                "courses_avg": 78.37,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "milligan, kevin",
                "courses_avg": 79,
                "courses_pass": 21
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "halevy, yoram",
                "courses_avg": 83.3,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "song, unjy",
                "courses_avg": 84.57,
                "courses_pass": 21
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 84.05,
                "courses_pass": 22
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 81.3,
                "courses_pass": 23
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "song, unjy",
                "courses_avg": 81.95,
                "courses_pass": 21
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "rehavi, michal",
                "courses_avg": 75.88,
                "courses_pass": 15
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "halevy, yoram",
                "courses_avg": 80.12,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "chapple, clive",
                "courses_avg": 79.89,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "lahiri, amartya",
                "courses_avg": 78.24,
                "courses_pass": 21
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 80.76,
                "courses_pass": 219
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "douglas, catherine",
                "courses_avg": 77.67,
                "courses_pass": 15
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 77.21,
                "courses_pass": 14
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "milligan, kevin",
                "courses_avg": 80.56,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "oprea, ryan",
                "courses_avg": 81,
                "courses_pass": 15
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 74.29,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "whistler, diana",
                "courses_avg": 81.05,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 82.7,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "rehavi, michal",
                "courses_avg": 78.17,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 80.39,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "neary, hugh",
                "courses_avg": 81.44,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "anderson, kristin siwan",
                "courses_avg": 85.5,
                "courses_pass": 16
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "whistler, diana",
                "courses_avg": 78.8,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "vaney, michael",
                "courses_avg": 72.6,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "douglas, catherine",
                "courses_avg": 74.22,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 78.96,
                "courses_pass": 243
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "douglas, catherine",
                "courses_avg": 74.72,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "halevy, yoram",
                "courses_avg": 75.29,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "milligan, kevin",
                "courses_avg": 79.06,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "halevy, yoram",
                "courses_avg": 84.41,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 84.65,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 76.39,
                "courses_pass": 16
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "song, unjy",
                "courses_avg": 83.63,
                "courses_pass": 16
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "rehavi, michal",
                "courses_avg": 77.8,
                "courses_pass": 15
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "song, unjy",
                "courses_avg": 81.72,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "pereira, alvaro",
                "courses_avg": 79.59,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "lahiri, amartya",
                "courses_avg": 80.39,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "whistler, diana",
                "courses_avg": 82.67,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "vaney, michael",
                "courses_avg": 80.18,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "douglas, catherine",
                "courses_avg": 75.82,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 79.72,
                "courses_pass": 239
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "milligan, kevin",
                "courses_avg": 79.72,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "song, unjy",
                "courses_avg": 80.72,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "marmer, vadim",
                "courses_avg": 85.28,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 80.28,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "halevy, yoram",
                "courses_avg": 81.42,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "lahiri, amartya",
                "courses_avg": 76,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "drelichman, mauricio",
                "courses_avg": 81,
                "courses_pass": 15
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "douglas, catherine",
                "courses_avg": 76.18,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "paterson, donald g",
                "courses_avg": 73.23,
                "courses_pass": 12
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "chapple, clive",
                "courses_avg": 77.19,
                "courses_pass": 16
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "troost, wiliam",
                "courses_avg": 77.67,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 78.95,
                "courses_pass": 186
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 74,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 79.45,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 78.22,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 79.68,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 76.58,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 74.74,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 81.55,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 78.35,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 80.24,
                "courses_pass": 21
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 75.38,
                "courses_pass": 21
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 77.85,
                "courses_pass": 194
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "adshade, marina",
                "courses_avg": 82,
                "courses_pass": 13
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 80.64,
                "courses_pass": 14
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 80.39,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "neary, hugh",
                "courses_avg": 83.31,
                "courses_pass": 13
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kozak rogo, juliana",
                "courses_avg": 82.22,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "whistler, diana",
                "courses_avg": 80.56,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "szkup, michal",
                "courses_avg": 81.11,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "halevy, yoram",
                "courses_avg": 81.47,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 82.59,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 79.89,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "song, kyungchul",
                "courses_avg": 87.89,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "whistler, diana",
                "courses_avg": 82.22,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "green, david",
                "courses_avg": 80.44,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 80.94,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 81.81,
                "courses_pass": 236
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "adshade, marina",
                "courses_avg": 76.65,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 74.56,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "milligan, kevin",
                "courses_avg": 80.68,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "oprea, ryan",
                "courses_avg": 80.29,
                "courses_pass": 15
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 77.65,
                "courses_pass": 20
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "whistler, diana",
                "courses_avg": 80.9,
                "courses_pass": 21
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 82.09,
                "courses_pass": 22
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "vaney, michael",
                "courses_avg": 78.83,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 80.11,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "halevy, yoram",
                "courses_avg": 80.53,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "whistler, diana",
                "courses_avg": 81.29,
                "courses_pass": 21
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "vaney, michael",
                "courses_avg": 79.1,
                "courses_pass": 21
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "douglas, catherine",
                "courses_avg": 74.52,
                "courses_pass": 21
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "",
                "courses_avg": 79.07,
                "courses_pass": 250
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "adshade, marina",
                "courses_avg": 73.83,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 76.24,
                "courses_pass": 17
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "milligan, kevin",
                "courses_avg": 80.67,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "fortin, nicole",
                "courses_avg": 84.06,
                "courses_pass": 16
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "kong, wai-ching alfred",
                "courses_avg": 73.22,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "whistler, diana",
                "courses_avg": 82.42,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "francois, patrick",
                "courses_avg": 78.05,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "halevy, yoram",
                "courses_avg": 79.42,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 83.61,
                "courses_pass": 18
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "malhotra, nisha",
                "courses_avg": 83.42,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "song, kyungchul",
                "courses_avg": 75.31,
                "courses_pass": 15
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "whistler, diana",
                "courses_avg": 81.47,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "green, david",
                "courses_avg": 81.63,
                "courses_pass": 19
            }, {
                "courses_title": "applied econ",
                "courses_instructor": "douglas, catherine",
                "courses_avg": 76.75,
                "courses_pass": 16
            }, { "courses_title": "applied econ", "courses_instructor": "", "courses_avg": 79.36, "courses_pass": 249 }
        ];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("Should be able to find course average for a course2", function () {
        var query = {
            "WHERE": {
                "IS": { "courses_id": "310" }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id",
                    "courses_instructor",
                    "courses_avg",
                    "courses_pass",
                    "courses_fail"
                ],
                "ORDER": "courses_pass"
            }
        };
        var second = [
            {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 76,
                "courses_pass": 4,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "hodge, kirsten",
                "courses_avg": 76.5,
                "courses_pass": 4,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "chanway, christopher",
                "courses_avg": 76,
                "courses_pass": 4,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "hodge, kirsten",
                "courses_avg": 73.8,
                "courses_pass": 5,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 84.6,
                "courses_pass": 5,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "chanway, christopher",
                "courses_avg": 84.6,
                "courses_pass": 5,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81.2,
                "courses_pass": 5,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "kornelsen, jude;thordarson, dana",
                "courses_avg": 87.33,
                "courses_pass": 6,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.5,
                "courses_pass": 6,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "chanway, christopher",
                "courses_avg": 77.5,
                "courses_pass": 6,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 86,
                "courses_pass": 7,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "chanway, christopher",
                "courses_avg": 85.57,
                "courses_pass": 7,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 85.57,
                "courses_pass": 7,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "thordarson, dana",
                "courses_avg": 86,
                "courses_pass": 7,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "thordarson, dana",
                "courses_avg": 84.25,
                "courses_pass": 8,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 73.11,
                "courses_pass": 9,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 73.11,
                "courses_pass": 9,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "tba",
                "courses_avg": 84.6,
                "courses_pass": 10,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 84.6,
                "courses_pass": 10,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "hempen, daniela",
                "courses_avg": 76.9,
                "courses_pass": 10,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 69.91,
                "courses_pass": 11,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 69.91,
                "courses_pass": 11,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 85.45,
                "courses_pass": 11,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "kumar, uma",
                "courses_avg": 82,
                "courses_pass": 11,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "kornelsen, jude;thordarson, dana",
                "courses_avg": 87.82,
                "courses_pass": 11,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "hempen, daniela",
                "courses_avg": 72.08,
                "courses_pass": 12,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "kumar, uma",
                "courses_avg": 79.17,
                "courses_pass": 12,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 82.75,
                "courses_pass": 12,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "d'onofrio, christine",
                "courses_avg": 65.5,
                "courses_pass": 12,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 85.92,
                "courses_pass": 12,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "thordarson, dana",
                "courses_avg": 85.92,
                "courses_pass": 12,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 85.69,
                "courses_pass": 13,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "medjuck, melissa",
                "courses_avg": 83.15,
                "courses_pass": 13,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "thordarson, dana",
                "courses_avg": 89.46,
                "courses_pass": 13,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 89.46,
                "courses_pass": 13,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "hempen, daniela",
                "courses_avg": 77.62,
                "courses_pass": 13,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "allison, kelly",
                "courses_avg": 83.62,
                "courses_pass": 13,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 80.07,
                "courses_pass": 14,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "casson, barbara",
                "courses_avg": 86.67,
                "courses_pass": 15,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "medjuck, melissa",
                "courses_avg": 82.2,
                "courses_pass": 15,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "jones, elizabeth",
                "courses_avg": 81.93,
                "courses_pass": 15,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "faller, florian",
                "courses_avg": 81.53,
                "courses_pass": 15,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "faller, florian",
                "courses_avg": 82.33,
                "courses_pass": 15,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 57.78,
                "courses_pass": 15,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "souto clement, juan",
                "courses_avg": 57.78,
                "courses_pass": 15,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "jones, elizabeth",
                "courses_avg": 82.75,
                "courses_pass": 16,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "kumar, uma",
                "courses_avg": 81.06,
                "courses_pass": 16,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "faller, florian",
                "courses_avg": 77,
                "courses_pass": 16,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "casson, barbara",
                "courses_avg": 86.44,
                "courses_pass": 16,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "jones, elizabeth",
                "courses_avg": 86.18,
                "courses_pass": 17,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "jones, elizabeth",
                "courses_avg": 84.29,
                "courses_pass": 17,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "allison, kelly",
                "courses_avg": 78.94,
                "courses_pass": 17,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "d'onofrio, christine",
                "courses_avg": 74.35,
                "courses_pass": 17,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "faller, florian",
                "courses_avg": 82.24,
                "courses_pass": 17,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 87.65,
                "courses_pass": 17,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.63,
                "courses_pass": 18,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "d'onofrio, christine",
                "courses_avg": 75.63,
                "courses_pass": 18,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "hempen, daniela",
                "courses_avg": 81.44,
                "courses_pass": 18,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "d'onofrio, christine",
                "courses_avg": 74.94,
                "courses_pass": 18,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "kumar, uma",
                "courses_avg": 77.06,
                "courses_pass": 18,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "johnston, kirsty",
                "courses_avg": 80.17,
                "courses_pass": 18,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 80.17,
                "courses_pass": 18,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "faller, florian",
                "courses_avg": 80.56,
                "courses_pass": 18,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "lin, diana",
                "courses_avg": 83,
                "courses_pass": 18,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 83,
                "courses_pass": 18,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "jones, elizabeth",
                "courses_avg": 84.53,
                "courses_pass": 19,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.57,
                "courses_pass": 20,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "d'onofrio, christine",
                "courses_avg": 74.43,
                "courses_pass": 20,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.25,
                "courses_pass": 20,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "hite, joshua",
                "courses_avg": 75.25,
                "courses_pass": 20,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.9,
                "courses_pass": 20,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "lin, diana",
                "courses_avg": 77.9,
                "courses_pass": 20,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "ganzenmueller, petra",
                "courses_avg": 79.15,
                "courses_pass": 20,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.57,
                "courses_pass": 20,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "allison, kelly",
                "courses_avg": 84.15,
                "courses_pass": 20,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81.86,
                "courses_pass": 20,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 80.62,
                "courses_pass": 21,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "lin, diana",
                "courses_avg": 80.62,
                "courses_pass": 21,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "allison, kelly",
                "courses_avg": 85.86,
                "courses_pass": 21,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "quinn, alyson",
                "courses_avg": 83.24,
                "courses_pass": 21,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "medjuck, melissa",
                "courses_avg": 83.95,
                "courses_pass": 21,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81.27,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81.27,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 73.23,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 76.77,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "allen, meghan",
                "courses_avg": 78.68,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 79.82,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "d'onofrio, christine",
                "courses_avg": 75.5,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "wildcat, matthew caldwell",
                "courses_avg": 79.82,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81.27,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "d'onofrio, christine",
                "courses_avg": 73.23,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "d'onofrio, christine",
                "courses_avg": 76.77,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.5,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 78.68,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81.27,
                "courses_pass": 22,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81,
                "courses_pass": 23,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "ruping, henrik",
                "courses_avg": 68.96,
                "courses_pass": 23,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 68.96,
                "courses_pass": 23,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "lin, diana",
                "courses_avg": 81,
                "courses_pass": 23,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "faller, florian",
                "courses_avg": 78.65,
                "courses_pass": 23,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "bozorgebrahimi, enayat;hitch, michael",
                "courses_avg": 71.52,
                "courses_pass": 24,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "allison, kelly",
                "courses_avg": 83.88,
                "courses_pass": 24,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "johnston, kirsty",
                "courses_avg": 77.68,
                "courses_pass": 25,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "medjuck, melissa",
                "courses_avg": 83.68,
                "courses_pass": 25,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.68,
                "courses_pass": 25,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 76.76,
                "courses_pass": 25,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 82.78,
                "courses_pass": 27,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.48,
                "courses_pass": 27,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "couture, selena",
                "courses_avg": 75.48,
                "courses_pass": 27,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.14,
                "courses_pass": 27,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "spreter von kreudenstein, chri",
                "courses_avg": 81.96,
                "courses_pass": 27,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "ryan, jeffrey",
                "courses_avg": 78.69,
                "courses_pass": 28,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 82.14,
                "courses_pass": 28,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.93,
                "courses_pass": 28,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 78.69,
                "courses_pass": 28,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 70.35,
                "courses_pass": 29,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 84.3,
                "courses_pass": 30,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "chang bortolussi, dorothy",
                "courses_avg": 78.3,
                "courses_pass": 30,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 68.11,
                "courses_pass": 30,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "liu, keqin",
                "courses_avg": 68.11,
                "courses_pass": 30,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 78.3,
                "courses_pass": 30,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 78.4,
                "courses_pass": 30,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "segal, judy",
                "courses_avg": 75.97,
                "courses_pass": 30,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.97,
                "courses_pass": 30,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 78.16,
                "courses_pass": 31,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.29,
                "courses_pass": 31,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "chang bortolussi, dorothy",
                "courses_avg": 78.16,
                "courses_pass": 31,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "allen, meghan",
                "courses_avg": 81.88,
                "courses_pass": 31,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 80.56,
                "courses_pass": 31,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 85.41,
                "courses_pass": 31,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 80.56,
                "courses_pass": 31,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81.68,
                "courses_pass": 31,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "graham, scott",
                "courses_avg": 85.41,
                "courses_pass": 31,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81.88,
                "courses_pass": 31,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 74.09,
                "courses_pass": 32,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "chang bortolussi, dorothy",
                "courses_avg": 74.09,
                "courses_pass": 32,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 80.56,
                "courses_pass": 32,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 82.18,
                "courses_pass": 32,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "haines-saah, rebecca",
                "courses_avg": 81.47,
                "courses_pass": 32,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81.47,
                "courses_pass": 32,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "rudrum, sarah",
                "courses_avg": 80.56,
                "courses_pass": 32,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "ryan, jeffrey",
                "courses_avg": 81.15,
                "courses_pass": 33,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81.15,
                "courses_pass": 33,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 85.33,
                "courses_pass": 33,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "chang bortolussi, dorothy",
                "courses_avg": 76.55,
                "courses_pass": 33,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 76.55,
                "courses_pass": 33,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 80.79,
                "courses_pass": 33,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 76.18,
                "courses_pass": 34,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "chang bortolussi, dorothy",
                "courses_avg": 76.18,
                "courses_pass": 34,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "gossen, david",
                "courses_avg": 68.8,
                "courses_pass": 35,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 68.8,
                "courses_pass": 35,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 80.6,
                "courses_pass": 35,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "chang bortolussi, dorothy",
                "courses_avg": 75.97,
                "courses_pass": 35,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "latimer, heather",
                "courses_avg": 80.6,
                "courses_pass": 35,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.97,
                "courses_pass": 35,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 83.64,
                "courses_pass": 36,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 83.75,
                "courses_pass": 36,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "latimer, heather",
                "courses_avg": 83.64,
                "courses_pass": 36,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "mathijs, ernest",
                "courses_avg": 83.75,
                "courses_pass": 36,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75,
                "courses_pass": 37,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "segal, judy",
                "courses_avg": 79.24,
                "courses_pass": 37,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 73.77,
                "courses_pass": 37,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "johnston, kirsty",
                "courses_avg": 73.77,
                "courses_pass": 37,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "segal, judy",
                "courses_avg": 75,
                "courses_pass": 37,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 79.24,
                "courses_pass": 37,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 74.67,
                "courses_pass": 38,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 78.28,
                "courses_pass": 40,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "aviles, leticia",
                "courses_avg": 78.28,
                "courses_pass": 40,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "gossen, david",
                "courses_avg": 75.26,
                "courses_pass": 40,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.26,
                "courses_pass": 40,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 78.95,
                "courses_pass": 41,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "kurian, mathew",
                "courses_avg": 78.95,
                "courses_pass": 41,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.93,
                "courses_pass": 41,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "segal, judy",
                "courses_avg": 77.93,
                "courses_pass": 41,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.88,
                "courses_pass": 43,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 84.49,
                "courses_pass": 43,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "segal, judy",
                "courses_avg": 77.88,
                "courses_pass": 43,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "segal, judy",
                "courses_avg": 76.98,
                "courses_pass": 44,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 76.98,
                "courses_pass": 44,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81.76,
                "courses_pass": 45,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 79.67,
                "courses_pass": 46,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "kam, christopher",
                "courses_avg": 67.46,
                "courses_pass": 46,
                "courses_fail": 6
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 67.46,
                "courses_pass": 46,
                "courses_fail": 6
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 84.6,
                "courses_pass": 47,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 84.6,
                "courses_pass": 47,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 74.6,
                "courses_pass": 47,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "yates, julian",
                "courses_avg": 74.6,
                "courses_pass": 47,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 83.78,
                "courses_pass": 49,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 69.63,
                "courses_pass": 49,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 80.84,
                "courses_pass": 49,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "aviles, leticia",
                "courses_avg": 80.84,
                "courses_pass": 49,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 69.63,
                "courses_pass": 49,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "bozorgebrahimi, enayat",
                "courses_avg": 75.37,
                "courses_pass": 50,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.37,
                "courses_pass": 50,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 71.74,
                "courses_pass": 52,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "hammer, philip",
                "courses_avg": 77.74,
                "courses_pass": 52,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "thistle, john",
                "courses_avg": 71.74,
                "courses_pass": 52,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 67.6,
                "courses_pass": 53,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.39,
                "courses_pass": 53,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "hitch, michael",
                "courses_avg": 72.39,
                "courses_pass": 53,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "hitch, michael",
                "courses_avg": 71.48,
                "courses_pass": 53,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "legzdins, peter",
                "courses_avg": 67.6,
                "courses_pass": 53,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 78.43,
                "courses_pass": 53,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 78.43,
                "courses_pass": 53,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 83.74,
                "courses_pass": 54,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "kam, christopher",
                "courses_avg": 71.55,
                "courses_pass": 54,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 71.55,
                "courses_pass": 54,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "kam, christopher",
                "courses_avg": 67,
                "courses_pass": 54,
                "courses_fail": 7
            }, {
                "courses_id": "310",
                "courses_instructor": "hitch, michael",
                "courses_avg": 76.19,
                "courses_pass": 54,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 76.19,
                "courses_pass": 54,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 67,
                "courses_pass": 54,
                "courses_fail": 7
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 78.62,
                "courses_pass": 55,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "aviles, leticia",
                "courses_avg": 79.76,
                "courses_pass": 55,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 79.76,
                "courses_pass": 55,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "hitch, michael",
                "courses_avg": 78.62,
                "courses_pass": 55,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "goodey, wayne",
                "courses_avg": 77.82,
                "courses_pass": 55,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.82,
                "courses_pass": 55,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "aviles, leticia",
                "courses_avg": 83.34,
                "courses_pass": 56,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.23,
                "courses_pass": 56,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "peyton, jonathan wynne",
                "courses_avg": 75.23,
                "courses_pass": 56,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 83.34,
                "courses_pass": 56,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 78.61,
                "courses_pass": 57,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "aviles, leticia",
                "courses_avg": 78.61,
                "courses_pass": 57,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 73.76,
                "courses_pass": 58,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "kam, christopher",
                "courses_avg": 73.76,
                "courses_pass": 58,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "goodey, wayne",
                "courses_avg": 77.32,
                "courses_pass": 59,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 71.21,
                "courses_pass": 59,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.11,
                "courses_pass": 59,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "mohit, surdas",
                "courses_avg": 68.45,
                "courses_pass": 59,
                "courses_fail": 7
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.32,
                "courses_pass": 59,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "bozorgebrahimi, enayat",
                "courses_avg": 72.11,
                "courses_pass": 59,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "legzdins, peter",
                "courses_avg": 67.31,
                "courses_pass": 59,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 67.31,
                "courses_pass": 59,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "kam, christopher",
                "courses_avg": 72.56,
                "courses_pass": 59,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.56,
                "courses_pass": 59,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 68.3,
                "courses_pass": 59,
                "courses_fail": 7
            }, {
                "courses_id": "310",
                "courses_instructor": "aviles, leticia",
                "courses_avg": 82.95,
                "courses_pass": 60,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 82.95,
                "courses_pass": 60,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 70.15,
                "courses_pass": 60,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 68.48,
                "courses_pass": 60,
                "courses_fail": 7
            }, {
                "courses_id": "310",
                "courses_instructor": "ali, khawaja faran",
                "courses_avg": 73.41,
                "courses_pass": 60,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 73.41,
                "courses_pass": 60,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "richer, harvey",
                "courses_avg": 77.13,
                "courses_pass": 61,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "fritz, thomas",
                "courses_avg": 75.57,
                "courses_pass": 62,
                "courses_fail": 6
            }, {
                "courses_id": "310",
                "courses_instructor": "mohit, surdas",
                "courses_avg": 74.83,
                "courses_pass": 62,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 84.35,
                "courses_pass": 63,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "legzdins, peter",
                "courses_avg": 66.97,
                "courses_pass": 64,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 66.97,
                "courses_pass": 64,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "gladman, brett",
                "courses_avg": 76.18,
                "courses_pass": 66,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "allen, meghan",
                "courses_avg": 80.34,
                "courses_pass": 66,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 80.34,
                "courses_pass": 66,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "thistle, john",
                "courses_avg": 68.07,
                "courses_pass": 69,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 68.07,
                "courses_pass": 69,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "hammer, philip",
                "courses_avg": 79.94,
                "courses_pass": 70,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "bain, amelia anne",
                "courses_avg": 76.18,
                "courses_pass": 72,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "frappe-seneclauze, tom-pierre;hammer, philip",
                "courses_avg": 72.62,
                "courses_pass": 72,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 70.68,
                "courses_pass": 73,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "legzdins, peter",
                "courses_avg": 70.68,
                "courses_pass": 73,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "legzdins, peter",
                "courses_avg": 62.99,
                "courses_pass": 75,
                "courses_fail": 11
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 62.99,
                "courses_pass": 75,
                "courses_fail": 11
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 79.12,
                "courses_pass": 75,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "baniassad, elisa",
                "courses_avg": 79.12,
                "courses_pass": 75,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "shepherd, david",
                "courses_avg": 74.45,
                "courses_pass": 76,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "hodge, kirsten",
                "courses_avg": 67.3,
                "courses_pass": 77,
                "courses_fail": 14
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 71.49,
                "courses_pass": 77,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 68.53,
                "courses_pass": 79,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "legzdins, peter",
                "courses_avg": 68.53,
                "courses_pass": 79,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.95,
                "courses_pass": 79,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "bain, amelia anne",
                "courses_avg": 72.95,
                "courses_pass": 79,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "mindell, randal",
                "courses_avg": 74.56,
                "courses_pass": 80,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "legzdins, peter",
                "courses_avg": 67.78,
                "courses_pass": 80,
                "courses_fail": 9
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 67.78,
                "courses_pass": 80,
                "courses_fail": 9
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 74.31,
                "courses_pass": 81,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "allen, meghan",
                "courses_avg": 73.16,
                "courses_pass": 81,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 67.68,
                "courses_pass": 81,
                "courses_fail": 14
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.4,
                "courses_pass": 82,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "ernst, neil",
                "courses_avg": 76.31,
                "courses_pass": 83,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "hammer, philip",
                "courses_avg": 72.56,
                "courses_pass": 84,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.42,
                "courses_pass": 85,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "hodge, kirsten",
                "courses_avg": 68.63,
                "courses_pass": 86,
                "courses_fail": 14
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 76.52,
                "courses_pass": 86,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "ali, khawaja faran",
                "courses_avg": 69.97,
                "courses_pass": 87,
                "courses_fail": 6
            }, {
                "courses_id": "310",
                "courses_instructor": "mcdonald, jennifer",
                "courses_avg": 70.29,
                "courses_pass": 88,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "stewart, howard",
                "courses_avg": 74.3,
                "courses_pass": 89,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "shepherd, david",
                "courses_avg": 75.72,
                "courses_pass": 90,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "ver, leah may",
                "courses_avg": 74.79,
                "courses_pass": 91,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "gladman, brett",
                "courses_avg": 72.58,
                "courses_pass": 92,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "allen, meghan",
                "courses_avg": 80.32,
                "courses_pass": 92,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.58,
                "courses_pass": 92,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "longridge, louise",
                "courses_avg": 73.13,
                "courses_pass": 93,
                "courses_fail": 7
            }, {
                "courses_id": "310",
                "courses_instructor": "ver, leah may",
                "courses_avg": 82.38,
                "courses_pass": 93,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "nixon, denver vale",
                "courses_avg": 74.33,
                "courses_pass": 94,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "gladman, brett",
                "courses_avg": 72.05,
                "courses_pass": 95,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "brown, loch",
                "courses_avg": 73.82,
                "courses_pass": 95,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.05,
                "courses_pass": 95,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "brown, loch",
                "courses_avg": 76.64,
                "courses_pass": 97,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "allen, meghan",
                "courses_avg": 77.63,
                "courses_pass": 97,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "mindell, randal",
                "courses_avg": 72.82,
                "courses_pass": 98,
                "courses_fail": 10
            }, {
                "courses_id": "310",
                "courses_instructor": "ver, leah may",
                "courses_avg": 76.2,
                "courses_pass": 98,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "allen, meghan",
                "courses_avg": 72.27,
                "courses_pass": 101,
                "courses_fail": 6
            }, {
                "courses_id": "310",
                "courses_instructor": "ernst, neil",
                "courses_avg": 77.78,
                "courses_pass": 101,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "hodge, kirsten",
                "courses_avg": 75.34,
                "courses_pass": 113,
                "courses_fail": 9
            }, {
                "courses_id": "310",
                "courses_instructor": "mindell, randal",
                "courses_avg": 72.84,
                "courses_pass": 117,
                "courses_fail": 12
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.76,
                "courses_pass": 118,
                "courses_fail": 12
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 70.69,
                "courses_pass": 119,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "hodge, kirsten",
                "courses_avg": 72.51,
                "courses_pass": 122,
                "courses_fail": 20
            }, {
                "courses_id": "310",
                "courses_instructor": "brown, loch",
                "courses_avg": 70.58,
                "courses_pass": 125,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.84,
                "courses_pass": 125,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 76.63,
                "courses_pass": 127,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "hodge, kirsten",
                "courses_avg": 73.43,
                "courses_pass": 130,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "allen, meghan",
                "courses_avg": 74.99,
                "courses_pass": 133,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "mindell, randal",
                "courses_avg": 72.59,
                "courses_pass": 135,
                "courses_fail": 10
            }, {
                "courses_id": "310",
                "courses_instructor": "richer, harvey",
                "courses_avg": 70.43,
                "courses_pass": 136,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 70.43,
                "courses_pass": 136,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "hodge, kirsten",
                "courses_avg": 76.77,
                "courses_pass": 138,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 81.17,
                "courses_pass": 139,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "holmes, reid",
                "courses_avg": 81.17,
                "courses_pass": 139,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "baniassad, elisa",
                "courses_avg": 80.35,
                "courses_pass": 150,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 78.32,
                "courses_pass": 154,
                "courses_fail": 7
            }, {
                "courses_id": "310",
                "courses_instructor": "allen, meghan",
                "courses_avg": 78.22,
                "courses_pass": 154,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "palyart-lamarche, marc",
                "courses_avg": 78.69,
                "courses_pass": 156,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "bain, amelia anne",
                "courses_avg": 73.55,
                "courses_pass": 156,
                "courses_fail": 17
            }, {
                "courses_id": "310",
                "courses_instructor": "wohlstadter, eric",
                "courses_avg": 80.24,
                "courses_pass": 156,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "bain, amelia anne",
                "courses_avg": 71.96,
                "courses_pass": 158,
                "courses_fail": 21
            }, {
                "courses_id": "310",
                "courses_instructor": "gladman, brett",
                "courses_avg": 70.34,
                "courses_pass": 161,
                "courses_fail": 9
            }, {
                "courses_id": "310",
                "courses_instructor": "baniassad, elisa",
                "courses_avg": 81.18,
                "courses_pass": 162,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.14,
                "courses_pass": 166,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.97,
                "courses_pass": 168,
                "courses_fail": 1
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.21,
                "courses_pass": 169,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "dempsey, jessica",
                "courses_avg": 72.21,
                "courses_pass": 169,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 64.81,
                "courses_pass": 174,
                "courses_fail": 19
            }, {
                "courses_id": "310",
                "courses_instructor": "moore, robert daniel;shaw, alison",
                "courses_avg": 64.81,
                "courses_pass": 174,
                "courses_fail": 19
            }, {
                "courses_id": "310",
                "courses_instructor": "richer, harvey",
                "courses_avg": 74.56,
                "courses_pass": 175,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 74.56,
                "courses_pass": 175,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "richer, harvey",
                "courses_avg": 71.18,
                "courses_pass": 177,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.54,
                "courses_pass": 178,
                "courses_fail": 6
            }, {
                "courses_id": "310",
                "courses_instructor": "bakker, karen jessica;ritts, max",
                "courses_avg": 74.17,
                "courses_pass": 178,
                "courses_fail": 11
            }, {
                "courses_id": "310",
                "courses_instructor": "harris, sara",
                "courses_avg": 75.49,
                "courses_pass": 180,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "bakker, karen jessica;williams, jennifer",
                "courses_avg": 71.12,
                "courses_pass": 180,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "bakker, karen jessica;moore, robert daniel",
                "courses_avg": 69.4,
                "courses_pass": 184,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.11,
                "courses_pass": 184,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "bakker, karen jessica;williams, jennifer",
                "courses_avg": 79.07,
                "courses_pass": 185,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "baniassad, elisa",
                "courses_avg": 77.13,
                "courses_pass": 185,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "bakker, karen jessica;moore, robert daniel",
                "courses_avg": 71.18,
                "courses_pass": 187,
                "courses_fail": 6
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 76.09,
                "courses_pass": 194,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "shrestha, ratna",
                "courses_avg": 76.09,
                "courses_pass": 194,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "richer, harvey",
                "courses_avg": 70.63,
                "courses_pass": 195,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 68.1,
                "courses_pass": 198,
                "courses_fail": 7
            }, {
                "courses_id": "310",
                "courses_instructor": "bakker, karen jessica;moore, robert daniel",
                "courses_avg": 68.1,
                "courses_pass": 198,
                "courses_fail": 7
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 70.4,
                "courses_pass": 200,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 76.72,
                "courses_pass": 200,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 70.4,
                "courses_pass": 200,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "shrestha, ratna",
                "courses_avg": 76.72,
                "courses_pass": 200,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "shrestha, ratna",
                "courses_avg": 79.33,
                "courses_pass": 202,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 79.33,
                "courses_pass": 202,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 74.78,
                "courses_pass": 204,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "shrestha, ratna",
                "courses_avg": 74.78,
                "courses_pass": 204,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 73.37,
                "courses_pass": 208,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 73.37,
                "courses_pass": 208,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 71.94,
                "courses_pass": 209,
                "courses_fail": 15
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 70.65,
                "courses_pass": 211,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "blair, alec;williams, jennifer",
                "courses_avg": 75.63,
                "courses_pass": 212,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 74.07,
                "courses_pass": 213,
                "courses_fail": 19
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 76.95,
                "courses_pass": 221,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "shrestha, ratna",
                "courses_avg": 76.95,
                "courses_pass": 221,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 70.69,
                "courses_pass": 221,
                "courses_fail": 25
            }, {
                "courses_id": "310",
                "courses_instructor": "matthews, jaymie mark",
                "courses_avg": 78.61,
                "courses_pass": 222,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "richer, harvey",
                "courses_avg": 73.13,
                "courses_pass": 222,
                "courses_fail": 6
            }, {
                "courses_id": "310",
                "courses_instructor": "shrestha, ratna",
                "courses_avg": 75.76,
                "courses_pass": 224,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "shrestha, ratna",
                "courses_avg": 77.57,
                "courses_pass": 224,
                "courses_fail": 6
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.76,
                "courses_pass": 224,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.57,
                "courses_pass": 224,
                "courses_fail": 6
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.34,
                "courses_pass": 233,
                "courses_fail": 15
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 79.72,
                "courses_pass": 235,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "shrestha, ratna",
                "courses_avg": 77.02,
                "courses_pass": 247,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.02,
                "courses_pass": 247,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 73.46,
                "courses_pass": 251,
                "courses_fail": 9
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.31,
                "courses_pass": 252,
                "courses_fail": 6
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.8,
                "courses_pass": 255,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.98,
                "courses_pass": 257,
                "courses_fail": 28
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.17,
                "courses_pass": 269,
                "courses_fail": 2
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 69.59,
                "courses_pass": 271,
                "courses_fail": 11
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 74.22,
                "courses_pass": 272,
                "courses_fail": 12
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.3,
                "courses_pass": 280,
                "courses_fail": 4
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 70.52,
                "courses_pass": 283,
                "courses_fail": 10
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 77.8,
                "courses_pass": 289,
                "courses_fail": 5
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.2,
                "courses_pass": 304,
                "courses_fail": 10
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 79.5,
                "courses_pass": 306,
                "courses_fail": 0
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.95,
                "courses_pass": 309,
                "courses_fail": 7
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 70.94,
                "courses_pass": 312,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.74,
                "courses_pass": 314,
                "courses_fail": 38
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 70.77,
                "courses_pass": 338,
                "courses_fail": 12
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 79.04,
                "courses_pass": 347,
                "courses_fail": 3
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 75.85,
                "courses_pass": 444,
                "courses_fail": 8
            }, {
                "courses_id": "310",
                "courses_instructor": "",
                "courses_avg": 72.19,
                "courses_pass": 462,
                "courses_fail": 12
            }
        ];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("OR", function () {
        var query = {
            "WHERE": {
                "OR": [
                    {
                        "GT": {
                            "courses_avg": 99
                        }
                    },
                    {
                        "GT": {
                            "courses_avg": 98.5
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [
            { "courses_dept": "nurs", "courses_id": "578", "courses_avg": 98.58 }, {
                "courses_dept": "epse",
                "courses_id": "449",
                "courses_avg": 98.58
            }, { "courses_dept": "epse", "courses_id": "449", "courses_avg": 98.58 }, {
                "courses_dept": "nurs",
                "courses_id": "578",
                "courses_avg": 98.58
            }, { "courses_dept": "epse", "courses_id": "421", "courses_avg": 98.7 }, {
                "courses_dept": "nurs",
                "courses_id": "509",
                "courses_avg": 98.71
            }, { "courses_dept": "nurs", "courses_id": "509", "courses_avg": 98.71 }, {
                "courses_dept": "eece",
                "courses_id": "541",
                "courses_avg": 98.75
            }, { "courses_dept": "eece", "courses_id": "541", "courses_avg": 98.75 }, {
                "courses_dept": "epse",
                "courses_id": "449",
                "courses_avg": 98.76
            }, { "courses_dept": "epse", "courses_id": "449", "courses_avg": 98.76 }, {
                "courses_dept": "epse",
                "courses_id": "449",
                "courses_avg": 98.8
            }, { "courses_dept": "spph", "courses_id": "300", "courses_avg": 98.98 }, {
                "courses_dept": "spph",
                "courses_id": "300",
                "courses_avg": 98.98
            }, { "courses_dept": "cnps", "courses_id": "574", "courses_avg": 99.19 }, {
                "courses_dept": "math",
                "courses_id": "527",
                "courses_avg": 99.78
            }, { "courses_dept": "math", "courses_id": "527", "courses_avg": 99.78 }
        ];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("AND", function () {
        var query = {
            "WHERE": {
                "AND": [
                    {
                        "GT": {
                            "courses_avg": 90
                        }
                    },
                    {
                        "IS": {
                            "courses_dept": "adhe"
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [
            { "courses_dept": "adhe", "courses_id": "329", "courses_avg": 90.02 }, {
                "courses_dept": "adhe",
                "courses_id": "412",
                "courses_avg": 90.16
            }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 90.17 }, {
                "courses_dept": "adhe",
                "courses_id": "412",
                "courses_avg": 90.18
            }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 90.5 }, {
                "courses_dept": "adhe",
                "courses_id": "330",
                "courses_avg": 90.72
            }, { "courses_dept": "adhe", "courses_id": "329", "courses_avg": 90.82 }, {
                "courses_dept": "adhe",
                "courses_id": "330",
                "courses_avg": 90.85
            }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 91.29 }, {
                "courses_dept": "adhe",
                "courses_id": "330",
                "courses_avg": 91.33
            }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 91.33 }, {
                "courses_dept": "adhe",
                "courses_id": "330",
                "courses_avg": 91.48
            }, { "courses_dept": "adhe", "courses_id": "329", "courses_avg": 92.54 }, {
                "courses_dept": "adhe",
                "courses_id": "329",
                "courses_avg": 93.33
            }, { "courses_dept": "adhe", "courses_id": "329", "courses_avg": 96.11 }
        ];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("Should find avg > 92 in cpsc", function () {
        var query = {
            "WHERE": {
                "AND": [
                    {
                        "GT": {
                            "courses_avg": 92
                        }
                    },
                    {
                        "IS": {
                            "courses_dept": "cpsc"
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [{ "courses_dept": "cpsc", "courses_avg": 92.4 }, {
                "courses_dept": "cpsc",
                "courses_avg": 92.4
            }, { "courses_dept": "cpsc", "courses_avg": 92.43 }, {
                "courses_dept": "cpsc",
                "courses_avg": 92.43
            }, { "courses_dept": "cpsc", "courses_avg": 92.5 }, {
                "courses_dept": "cpsc",
                "courses_avg": 92.5
            }, { "courses_dept": "cpsc", "courses_avg": 92.63 }, {
                "courses_dept": "cpsc",
                "courses_avg": 92.63
            }, { "courses_dept": "cpsc", "courses_avg": 92.75 }, {
                "courses_dept": "cpsc",
                "courses_avg": 92.75
            }, { "courses_dept": "cpsc", "courses_avg": 93.38 }, {
                "courses_dept": "cpsc",
                "courses_avg": 93.38
            }, { "courses_dept": "cpsc", "courses_avg": 93.5 }, {
                "courses_dept": "cpsc",
                "courses_avg": 93.5
            }, { "courses_dept": "cpsc", "courses_avg": 94 }, {
                "courses_dept": "cpsc",
                "courses_avg": 94
            }, { "courses_dept": "cpsc", "courses_avg": 94.5 }, {
                "courses_dept": "cpsc",
                "courses_avg": 94.5
            }, { "courses_dept": "cpsc", "courses_avg": 95 }, { "courses_dept": "cpsc", "courses_avg": 95 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("Complex", function () {
        var query = {
            "WHERE": {
                "OR": [
                    {
                        "AND": [
                            {
                                "GT": {
                                    "courses_avg": 90
                                }
                            },
                            {
                                "IS": {
                                    "courses_dept": "adhe"
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 95
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                "ORDER": "courses_avg"
            }
        };
        var second = [{ courses_dept: 'adhe', courses_id: '329', courses_avg: 90.02 },
            { courses_dept: 'adhe', courses_id: '412', courses_avg: 90.16 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.17 },
            { courses_dept: 'adhe', courses_id: '412', courses_avg: 90.18 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.5 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.72 },
            { courses_dept: 'adhe', courses_id: '329', courses_avg: 90.82 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 90.85 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.29 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.33 },
            { courses_dept: 'adhe', courses_id: '330', courses_avg: 91.48 },
            { courses_dept: 'adhe', courses_id: '329', courses_avg: 92.54 },
            { courses_dept: 'adhe', courses_id: '329', courses_avg: 93.33 },
            { courses_dept: 'rhsc', courses_id: '501', courses_avg: 95 },
            { courses_dept: 'bmeg', courses_id: '597', courses_avg: 95 },
            { courses_dept: 'bmeg', courses_id: '597', courses_avg: 95 },
            { courses_dept: 'cnps', courses_id: '535', courses_avg: 95 },
            { courses_dept: 'cnps', courses_id: '535', courses_avg: 95 },
            { courses_dept: 'cpsc', courses_id: '589', courses_avg: 95 },
            { courses_dept: 'cpsc', courses_id: '589', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'crwr', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'sowk', courses_id: '570', courses_avg: 95 },
            { courses_dept: 'econ', courses_id: '516', courses_avg: 95 },
            { courses_dept: 'edcp', courses_id: '473', courses_avg: 95 },
            { courses_dept: 'edcp', courses_id: '473', courses_avg: 95 },
            { courses_dept: 'epse', courses_id: '606', courses_avg: 95 },
            { courses_dept: 'epse', courses_id: '682', courses_avg: 95 },
            { courses_dept: 'epse', courses_id: '682', courses_avg: 95 },
            { courses_dept: 'kin', courses_id: '499', courses_avg: 95 },
            { courses_dept: 'kin', courses_id: '500', courses_avg: 95 },
            { courses_dept: 'kin', courses_id: '500', courses_avg: 95 },
            { courses_dept: 'math', courses_id: '532', courses_avg: 95 },
            { courses_dept: 'math', courses_id: '532', courses_avg: 95 },
            { courses_dept: 'mtrl', courses_id: '564', courses_avg: 95 },
            { courses_dept: 'mtrl', courses_id: '564', courses_avg: 95 },
            { courses_dept: 'mtrl', courses_id: '599', courses_avg: 95 },
            { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
            { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
            { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
            { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
            { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
            { courses_dept: 'musc', courses_id: '553', courses_avg: 95 },
            { courses_dept: 'nurs', courses_id: '424', courses_avg: 95 },
            { courses_dept: 'nurs', courses_id: '424', courses_avg: 95 },
            { courses_dept: 'obst', courses_id: '549', courses_avg: 95 },
            { courses_dept: 'psyc', courses_id: '501', courses_avg: 95 },
            { courses_dept: 'psyc', courses_id: '501', courses_avg: 95 },
            { courses_dept: 'econ', courses_id: '516', courses_avg: 95 },
            { courses_dept: 'adhe', courses_id: '329', courses_avg: 96.11 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("find the room by rooms_lat", function () {
        var query = {
            "WHERE": {
                "GT": {
                    "rooms_lat": 49.26048
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{ "rooms_name": "AERL_120" }, { "rooms_name": "ALRD_105" }, { "rooms_name": "ALRD_112" }, { "rooms_name": "ALRD_113" }, { "rooms_name": "ALRD_121" }, { "rooms_name": "ALRD_B101" }, { "rooms_name": "ANGU_037" }, { "rooms_name": "ANGU_039" }, { "rooms_name": "ANGU_098" }, { "rooms_name": "ANGU_232" }, { "rooms_name": "ANGU_234" }, { "rooms_name": "ANGU_235" }, { "rooms_name": "ANGU_237" }, { "rooms_name": "ANGU_241" }, { "rooms_name": "ANGU_243" }, { "rooms_name": "ANGU_254" }, { "rooms_name": "ANGU_291" }, { "rooms_name": "ANGU_292" }, { "rooms_name": "ANGU_293" }, { "rooms_name": "ANGU_295" }, { "rooms_name": "ANGU_296" }, { "rooms_name": "ANGU_332" }, { "rooms_name": "ANGU_334" }, { "rooms_name": "ANGU_335" }, { "rooms_name": "ANGU_339" }, { "rooms_name": "ANGU_343" }, { "rooms_name": "ANGU_345" }, { "rooms_name": "ANGU_347" }, { "rooms_name": "ANGU_350" }, { "rooms_name": "ANGU_354" }, { "rooms_name": "ANGU_432" }, { "rooms_name": "ANGU_434" }, { "rooms_name": "ANGU_435" }, { "rooms_name": "ANGU_437" }, { "rooms_name": "ANSO_202" }, { "rooms_name": "ANSO_203" }, { "rooms_name": "ANSO_205" }, { "rooms_name": "ANSO_207" }, { "rooms_name": "AUDX_142" }, { "rooms_name": "AUDX_157" }, { "rooms_name": "BIOL_1503" }, { "rooms_name": "BIOL_2000" }, { "rooms_name": "BIOL_2200" }, { "rooms_name": "BIOL_2519" }, { "rooms_name": "BRKX_2365" }, { "rooms_name": "BRKX_2367" }, { "rooms_name": "BUCH_A101" }, { "rooms_name": "BUCH_A102" }, { "rooms_name": "BUCH_A103" }, { "rooms_name": "BUCH_A104" }, { "rooms_name": "BUCH_A201" }, { "rooms_name": "BUCH_A202" }, { "rooms_name": "BUCH_A203" }, { "rooms_name": "BUCH_B141" }, { "rooms_name": "BUCH_B142" }, { "rooms_name": "BUCH_B208" }, { "rooms_name": "BUCH_B209" }, { "rooms_name": "BUCH_B210" }, { "rooms_name": "BUCH_B211" }, { "rooms_name": "BUCH_B213" }, { "rooms_name": "BUCH_B215" }, { "rooms_name": "BUCH_B216" }, { "rooms_name": "BUCH_B218" }, { "rooms_name": "BUCH_B219" }, { "rooms_name": "BUCH_B302" }, { "rooms_name": "BUCH_B303" }, { "rooms_name": "BUCH_B304" }, { "rooms_name": "BUCH_B306" }, { "rooms_name": "BUCH_B307" }, { "rooms_name": "BUCH_B308" }, { "rooms_name": "BUCH_B309" }, { "rooms_name": "BUCH_B310" }, { "rooms_name": "BUCH_B312" }, { "rooms_name": "BUCH_B313" }, { "rooms_name": "BUCH_B315" }, { "rooms_name": "BUCH_B316" }, { "rooms_name": "BUCH_B318" }, { "rooms_name": "BUCH_B319" }, { "rooms_name": "BUCH_D201" }, { "rooms_name": "BUCH_D204" }, { "rooms_name": "BUCH_D205" }, { "rooms_name": "BUCH_D207" }, { "rooms_name": "BUCH_D209" }, { "rooms_name": "BUCH_D213" }, { "rooms_name": "BUCH_D214" }, { "rooms_name": "BUCH_D216" }, { "rooms_name": "BUCH_D217" }, { "rooms_name": "BUCH_D218" }, { "rooms_name": "BUCH_D219" }, { "rooms_name": "BUCH_D221" }, { "rooms_name": "BUCH_D222" }, { "rooms_name": "BUCH_D228" }, { "rooms_name": "BUCH_D229" }, { "rooms_name": "BUCH_D301" }, { "rooms_name": "BUCH_D304" }, { "rooms_name": "BUCH_D306" }, { "rooms_name": "BUCH_D307" }, { "rooms_name": "BUCH_D312" }, { "rooms_name": "BUCH_D313" }, { "rooms_name": "BUCH_D314" }, { "rooms_name": "BUCH_D315" }, { "rooms_name": "BUCH_D316" }, { "rooms_name": "BUCH_D317" }, { "rooms_name": "BUCH_D319" }, { "rooms_name": "BUCH_D322" }, { "rooms_name": "BUCH_D323" }, { "rooms_name": "BUCH_D325" }, { "rooms_name": "CEME_1202" }, { "rooms_name": "CEME_1204" }, { "rooms_name": "CEME_1206" }, { "rooms_name": "CEME_1210" }, { "rooms_name": "CEME_1212" }, { "rooms_name": "CEME_1215" }, { "rooms_name": "CHBE_101" }, { "rooms_name": "CHBE_102" }, { "rooms_name": "CHBE_103" }, { "rooms_name": "CHEM_B150" }, { "rooms_name": "CHEM_B250" }, { "rooms_name": "CHEM_C124" }, { "rooms_name": "CHEM_C126" }, { "rooms_name": "CHEM_D200" }, { "rooms_name": "CHEM_D300" }, { "rooms_name": "CIRS_1250" }, { "rooms_name": "DMP_101" }, { "rooms_name": "DMP_110" }, { "rooms_name": "DMP_201" }, { "rooms_name": "DMP_301" }, { "rooms_name": "DMP_310" }, { "rooms_name": "EOSM_135" }, { "rooms_name": "ESB_1012" }, { "rooms_name": "ESB_1013" }, { "rooms_name": "ESB_2012" }, { "rooms_name": "FNH_20" }, { "rooms_name": "FNH_30" }, { "rooms_name": "FNH_320" }, { "rooms_name": "FNH_40" }, { "rooms_name": "FNH_50" }, { "rooms_name": "FNH_60" }, { "rooms_name": "FORW_303" }, { "rooms_name": "FORW_317" }, { "rooms_name": "FORW_519" }, { "rooms_name": "FRDM_153" }, { "rooms_name": "GEOG_100" }, { "rooms_name": "GEOG_101" }, { "rooms_name": "GEOG_147" }, { "rooms_name": "GEOG_200" }, { "rooms_name": "GEOG_201" }, { "rooms_name": "GEOG_212" }, { "rooms_name": "GEOG_214" }, { "rooms_name": "GEOG_242" }, { "rooms_name": "HEBB_10" }, { "rooms_name": "HEBB_100" }, { "rooms_name": "HEBB_12" }, { "rooms_name": "HEBB_13" }, { "rooms_name": "HENN_200" }, { "rooms_name": "HENN_201" }, { "rooms_name": "HENN_202" }, { "rooms_name": "HENN_301" }, { "rooms_name": "HENN_302" }, { "rooms_name": "HENN_304" }, { "rooms_name": "IBLC_155" }, { "rooms_name": "IBLC_156" }, { "rooms_name": "IBLC_157" }, { "rooms_name": "IBLC_158" }, { "rooms_name": "IBLC_182" }, { "rooms_name": "IBLC_185" }, { "rooms_name": "IBLC_191" }, { "rooms_name": "IBLC_192" }, { "rooms_name": "IBLC_193" }, { "rooms_name": "IBLC_194" }, { "rooms_name": "IBLC_195" }, { "rooms_name": "IBLC_261" }, { "rooms_name": "IBLC_263" }, { "rooms_name": "IBLC_264" }, { "rooms_name": "IBLC_265" }, { "rooms_name": "IBLC_266" }, { "rooms_name": "IBLC_460" }, { "rooms_name": "IBLC_461" }, { "rooms_name": "IONA_301" }, { "rooms_name": "IONA_633" }, { "rooms_name": "LASR_102" }, { "rooms_name": "LASR_104" }, { "rooms_name": "LASR_105" }, { "rooms_name": "LASR_107" }, { "rooms_name": "LASR_211" }, { "rooms_name": "LASR_5C" }, { "rooms_name": "LSC_1001" }, { "rooms_name": "LSC_1002" }, { "rooms_name": "LSC_1003" }, { "rooms_name": "LSK_200" }, { "rooms_name": "LSK_201" }, { "rooms_name": "LSK_460" }, { "rooms_name": "LSK_462" }, { "rooms_name": "MATH_100" }, { "rooms_name": "MATH_102" }, { "rooms_name": "MATH_104" }, { "rooms_name": "MATH_105" }, { "rooms_name": "MATH_202" }, { "rooms_name": "MATH_203" }, { "rooms_name": "MATH_204" }, { "rooms_name": "MATH_225" }, { "rooms_name": "MATX_1100" }, { "rooms_name": "MCLD_202" }, { "rooms_name": "MCLD_214" }, { "rooms_name": "MCLD_220" }, { "rooms_name": "MCLD_228" }, { "rooms_name": "MCLD_242" }, { "rooms_name": "MCLD_254" }, { "rooms_name": "MCML_154" }, { "rooms_name": "MCML_158" }, { "rooms_name": "MCML_160" }, { "rooms_name": "MCML_166" }, { "rooms_name": "MCML_256" }, { "rooms_name": "MCML_260" }, { "rooms_name": "MCML_358" }, { "rooms_name": "MCML_360A" }, { "rooms_name": "MCML_360B" }, { "rooms_name": "MCML_360C" }, { "rooms_name": "MCML_360D" }, { "rooms_name": "MCML_360E" }, { "rooms_name": "MCML_360F" }, { "rooms_name": "MCML_360G" }, { "rooms_name": "MCML_360H" }, { "rooms_name": "MCML_360J" }, { "rooms_name": "MCML_360K" }, { "rooms_name": "MCML_360L" }, { "rooms_name": "MCML_360M" }, { "rooms_name": "MGYM_206" }, { "rooms_name": "MGYM_208" }, { "rooms_name": "PCOH_1001" }, { "rooms_name": "PCOH_1002" }, { "rooms_name": "PCOH_1003" }, { "rooms_name": "PCOH_1008" }, { "rooms_name": "PCOH_1009" }, { "rooms_name": "PCOH_1011" }, { "rooms_name": "PCOH_1215" }, { "rooms_name": "PCOH_1302" }, { "rooms_name": "PHRM_1101" }, { "rooms_name": "PHRM_1201" }, { "rooms_name": "PHRM_3112" }, { "rooms_name": "PHRM_3114" }, { "rooms_name": "PHRM_3115" }, { "rooms_name": "PHRM_3116" }, { "rooms_name": "PHRM_3118" }, { "rooms_name": "PHRM_3120" }, { "rooms_name": "PHRM_3122" }, { "rooms_name": "PHRM_3124" }, { "rooms_name": "PHRM_3208" }, { "rooms_name": "SCRF_100" }, { "rooms_name": "SCRF_1003" }, { "rooms_name": "SCRF_1004" }, { "rooms_name": "SCRF_1005" }, { "rooms_name": "SCRF_1020" }, { "rooms_name": "SCRF_1021" }, { "rooms_name": "SCRF_1022" }, { "rooms_name": "SCRF_1023" }, { "rooms_name": "SCRF_1024" }, { "rooms_name": "SCRF_1328" }, { "rooms_name": "SCRF_200" }, { "rooms_name": "SCRF_201" }, { "rooms_name": "SCRF_202" }, { "rooms_name": "SCRF_203" }, { "rooms_name": "SCRF_204" }, { "rooms_name": "SCRF_204A" }, { "rooms_name": "SCRF_205" }, { "rooms_name": "SCRF_206" }, { "rooms_name": "SCRF_207" }, { "rooms_name": "SCRF_208" }, { "rooms_name": "SCRF_209" }, { "rooms_name": "SCRF_210" }, { "rooms_name": "SOWK_122" }, { "rooms_name": "SOWK_124" }, { "rooms_name": "SOWK_222" }, { "rooms_name": "SOWK_223" }, { "rooms_name": "SOWK_224" }, { "rooms_name": "SOWK_324" }, { "rooms_name": "SOWK_326" }, { "rooms_name": "SPPH_143" }, { "rooms_name": "SPPH_B108" }, { "rooms_name": "SPPH_B112" }, { "rooms_name": "SPPH_B136" }, { "rooms_name": "SPPH_B138" }, { "rooms_name": "SPPH_B151" }, { "rooms_name": "SRC_220A" }, { "rooms_name": "SRC_220B" }, { "rooms_name": "SRC_220C" }, { "rooms_name": "SWNG_105" }, { "rooms_name": "SWNG_106" }, { "rooms_name": "SWNG_107" }, { "rooms_name": "SWNG_108" }, { "rooms_name": "SWNG_109" }, { "rooms_name": "SWNG_110" }, { "rooms_name": "SWNG_121" }, { "rooms_name": "SWNG_122" }, { "rooms_name": "SWNG_221" }, { "rooms_name": "SWNG_222" }, { "rooms_name": "SWNG_305" }, { "rooms_name": "SWNG_306" }, { "rooms_name": "SWNG_307" }, { "rooms_name": "SWNG_308" }, { "rooms_name": "SWNG_309" }, { "rooms_name": "SWNG_310" }, { "rooms_name": "SWNG_405" }, { "rooms_name": "SWNG_406" }, { "rooms_name": "SWNG_407" }, { "rooms_name": "SWNG_408" }, { "rooms_name": "SWNG_409" }, { "rooms_name": "SWNG_410" }, { "rooms_name": "UCLL_101" }, { "rooms_name": "UCLL_103" }, { "rooms_name": "UCLL_107" }, { "rooms_name": "UCLL_109" }, { "rooms_name": "WESB_100" }, { "rooms_name": "WESB_201" }, { "rooms_name": "WOOD_1" }, { "rooms_name": "WOOD_2" }, { "rooms_name": "WOOD_3" }, { "rooms_name": "WOOD_4" }, { "rooms_name": "WOOD_5" }, { "rooms_name": "WOOD_6" }, { "rooms_name": "WOOD_B75" }, { "rooms_name": "WOOD_B79" }, { "rooms_name": "WOOD_G41" }, { "rooms_name": "WOOD_G44" }, { "rooms_name": "WOOD_G53" }, { "rooms_name": "WOOD_G55" }, { "rooms_name": "WOOD_G57" }, { "rooms_name": "WOOD_G59" }, { "rooms_name": "WOOD_G65" }, { "rooms_name": "WOOD_G66" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("ERROR : The query resulted in no entry being found", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_furniture": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("find the room by rooms_furniture ", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_furniture": "Classroom-Movable Tables & Chairs"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{ "rooms_name": "ALRD_112" }, { "rooms_name": "ALRD_113" }, { "rooms_name": "ANGU_232" }, { "rooms_name": "ANGU_254" }, { "rooms_name": "ANGU_292" }, { "rooms_name": "ANGU_293" }, { "rooms_name": "ANGU_296" }, { "rooms_name": "ANGU_332" }, { "rooms_name": "ANGU_339" }, { "rooms_name": "ANGU_432" }, { "rooms_name": "ANGU_435" }, { "rooms_name": "ANGU_437" }, { "rooms_name": "ANSO_202" }, { "rooms_name": "AUDX_142" }, { "rooms_name": "AUDX_157" }, { "rooms_name": "BIOL_1503" }, { "rooms_name": "BIOL_2519" }, { "rooms_name": "BRKX_2367" }, { "rooms_name": "BUCH_B141" }, { "rooms_name": "BUCH_B142" }, { "rooms_name": "BUCH_B216" }, { "rooms_name": "BUCH_B312" }, { "rooms_name": "BUCH_B316" }, { "rooms_name": "BUCH_B318" }, { "rooms_name": "BUCH_D201" }, { "rooms_name": "BUCH_D204" }, { "rooms_name": "BUCH_D205" }, { "rooms_name": "BUCH_D207" }, { "rooms_name": "BUCH_D209" }, { "rooms_name": "BUCH_D214" }, { "rooms_name": "BUCH_D221" }, { "rooms_name": "BUCH_D229" }, { "rooms_name": "BUCH_D315" }, { "rooms_name": "BUCH_D319" }, { "rooms_name": "BUCH_D323" }, { "rooms_name": "BUCH_D325" }, { "rooms_name": "CEME_1206" }, { "rooms_name": "CEME_1210" }, { "rooms_name": "CHBE_103" }, { "rooms_name": "DMP_101" }, { "rooms_name": "DMP_201" }, { "rooms_name": "EOSM_135" }, { "rooms_name": "FNH_30" }, { "rooms_name": "FORW_317" }, { "rooms_name": "FORW_519" }, { "rooms_name": "FSC_1002" }, { "rooms_name": "FSC_1402" }, { "rooms_name": "FSC_1611" }, { "rooms_name": "FSC_1613" }, { "rooms_name": "FSC_1615" }, { "rooms_name": "FSC_1617" }, { "rooms_name": "GEOG_101" }, { "rooms_name": "GEOG_147" }, { "rooms_name": "GEOG_200" }, { "rooms_name": "GEOG_201" }, { "rooms_name": "HEBB_10" }, { "rooms_name": "HEBB_12" }, { "rooms_name": "HEBB_13" }, { "rooms_name": "HENN_301" }, { "rooms_name": "HENN_302" }, { "rooms_name": "HENN_304" }, { "rooms_name": "IBLC_156" }, { "rooms_name": "IBLC_157" }, { "rooms_name": "IBLC_158" }, { "rooms_name": "IBLC_185" }, { "rooms_name": "IBLC_191" }, { "rooms_name": "IBLC_195" }, { "rooms_name": "IBLC_261" }, { "rooms_name": "IBLC_264" }, { "rooms_name": "IBLC_265" }, { "rooms_name": "IBLC_460" }, { "rooms_name": "IONA_633" }, { "rooms_name": "LASR_211" }, { "rooms_name": "LASR_5C" }, { "rooms_name": "LSK_460" }, { "rooms_name": "LSK_462" }, { "rooms_name": "MATH_102" }, { "rooms_name": "MATH_104" }, { "rooms_name": "MATH_203" }, { "rooms_name": "MCLD_214" }, { "rooms_name": "MCLD_220" }, { "rooms_name": "MCLD_242" }, { "rooms_name": "MCLD_254" }, { "rooms_name": "MCML_154" }, { "rooms_name": "MCML_256" }, { "rooms_name": "MCML_260" }, { "rooms_name": "MCML_358" }, { "rooms_name": "MCML_360M" }, { "rooms_name": "ORCH_3002" }, { "rooms_name": "ORCH_3058" }, { "rooms_name": "ORCH_3074" }, { "rooms_name": "ORCH_4058" }, { "rooms_name": "ORCH_4068" }, { "rooms_name": "OSBO_203A" }, { "rooms_name": "OSBO_A" }, { "rooms_name": "PCOH_1001" }, { "rooms_name": "PCOH_1002" }, { "rooms_name": "PCOH_1009" }, { "rooms_name": "PCOH_1011" }, { "rooms_name": "PCOH_1215" }, { "rooms_name": "PCOH_1302" }, { "rooms_name": "PHRM_3112" }, { "rooms_name": "PHRM_3114" }, { "rooms_name": "PHRM_3115" }, { "rooms_name": "PHRM_3116" }, { "rooms_name": "PHRM_3118" }, { "rooms_name": "PHRM_3120" }, { "rooms_name": "PHRM_3122" }, { "rooms_name": "PHRM_3124" }, { "rooms_name": "PHRM_3208" }, { "rooms_name": "SCRF_1003" }, { "rooms_name": "SCRF_1004" }, { "rooms_name": "SCRF_1005" }, { "rooms_name": "SCRF_1020" }, { "rooms_name": "SCRF_1021" }, { "rooms_name": "SCRF_1022" }, { "rooms_name": "SCRF_1023" }, { "rooms_name": "SCRF_1024" }, { "rooms_name": "SCRF_1328" }, { "rooms_name": "SCRF_200" }, { "rooms_name": "SCRF_202" }, { "rooms_name": "SCRF_204" }, { "rooms_name": "SCRF_204A" }, { "rooms_name": "SCRF_205" }, { "rooms_name": "SCRF_206" }, { "rooms_name": "SCRF_207" }, { "rooms_name": "SCRF_208" }, { "rooms_name": "SCRF_209" }, { "rooms_name": "SCRF_210" }, { "rooms_name": "SOWK_122" }, { "rooms_name": "SOWK_324" }, { "rooms_name": "SOWK_326" }, { "rooms_name": "SPPH_B112" }, { "rooms_name": "SPPH_B136" }, { "rooms_name": "SPPH_B138" }, { "rooms_name": "SRC_220A" }, { "rooms_name": "SRC_220B" }, { "rooms_name": "SRC_220C" }, { "rooms_name": "SWNG_105" }, { "rooms_name": "SWNG_106" }, { "rooms_name": "SWNG_107" }, { "rooms_name": "SWNG_108" }, { "rooms_name": "SWNG_109" }, { "rooms_name": "SWNG_110" }, { "rooms_name": "SWNG_305" }, { "rooms_name": "SWNG_306" }, { "rooms_name": "SWNG_307" }, { "rooms_name": "SWNG_308" }, { "rooms_name": "SWNG_309" }, { "rooms_name": "SWNG_310" }, { "rooms_name": "SWNG_405" }, { "rooms_name": "SWNG_407" }, { "rooms_name": "SWNG_409" }, { "rooms_name": "SWNG_410" }, { "rooms_name": "UCLL_101" }, { "rooms_name": "UCLL_107" }, { "rooms_name": "WOOD_B75" }, { "rooms_name": "WOOD_G41" }, { "rooms_name": "WOOD_G44" }, { "rooms_name": "WOOD_G53" }, { "rooms_name": "WOOD_G55" }, { "rooms_name": "WOOD_G57" }, { "rooms_name": "WOOD_G59" }, { "rooms_name": "WOOD_G65" }, { "rooms_name": "WOOD_G66" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("rooms_fullname", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_fullname": "Hugh Dempster Pavilion"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_fullname"
                ],
                "ORDER": "rooms_fullname"
            }
        };
        var second = [{ "rooms_name": "DMP_310", "rooms_fullname": "Hugh Dempster Pavilion" }, {
                "rooms_name": "DMP_201",
                "rooms_fullname": "Hugh Dempster Pavilion"
            }, { "rooms_name": "DMP_101", "rooms_fullname": "Hugh Dempster Pavilion" }, {
                "rooms_name": "DMP_301",
                "rooms_fullname": "Hugh Dempster Pavilion"
            }, { "rooms_name": "DMP_110", "rooms_fullname": "Hugh Dempster Pavilion" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("rooms_shortname", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_shortname": "DMP*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_shortname"
                ],
                "ORDER": "rooms_shortname"
            }
        };
        var second = [{ "rooms_name": "DMP_310", "rooms_shortname": "DMP" }, {
                "rooms_name": "DMP_201",
                "rooms_shortname": "DMP"
            }, { "rooms_name": "DMP_101", "rooms_shortname": "DMP" }, {
                "rooms_name": "DMP_301",
                "rooms_shortname": "DMP"
            }, { "rooms_name": "DMP_110", "rooms_shortname": "DMP" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("rooms_number", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_number": "310"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_number"
                ],
                "ORDER": "rooms_number"
            }
        };
        var second = [{ "rooms_name": "SWNG_310", "rooms_number": "310" }, {
                "rooms_name": "DMP_310",
                "rooms_number": "310"
            }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("rooms_name", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_name": "SWNG_310"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_number"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{ "rooms_name": "SWNG_310", "rooms_number": "310" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("rooms_address", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_101"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_110"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_201"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_301"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_310"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_1001" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3002"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3004" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3016"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3018" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3052"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3058" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3062"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3068" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3072"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3074" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4002"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4004" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4016"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4018" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4052"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4058" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4062"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4068" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4072"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4074" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("rooms_lat", function () {
        var query = {
            "WHERE": {
                "GT": {
                    "rooms_lat": 49.26125
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_lat", "rooms_lon"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{
                "rooms_name": "AERL_120",
                "rooms_lat": 49.26372,
                "rooms_lon": -123.25099
            }, { "rooms_name": "ALRD_105", "rooms_lat": 49.2699, "rooms_lon": -123.25318 }, {
                "rooms_name": "ALRD_112",
                "rooms_lat": 49.2699,
                "rooms_lon": -123.25318
            }, { "rooms_name": "ALRD_113", "rooms_lat": 49.2699, "rooms_lon": -123.25318 }, {
                "rooms_name": "ALRD_121",
                "rooms_lat": 49.2699,
                "rooms_lon": -123.25318
            }, { "rooms_name": "ALRD_B101", "rooms_lat": 49.2699, "rooms_lon": -123.25318 }, {
                "rooms_name": "ANGU_037",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_039", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_098",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_232", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_234",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_235", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_237",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_241", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_243",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_254", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_291",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_292", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_293",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_295", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_296",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_332", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_334",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_335", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_339",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_343", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_345",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_347", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_350",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_354", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_432",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_434", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANGU_435",
                "rooms_lat": 49.26486,
                "rooms_lon": -123.25364
            }, { "rooms_name": "ANGU_437", "rooms_lat": 49.26486, "rooms_lon": -123.25364 }, {
                "rooms_name": "ANSO_202",
                "rooms_lat": 49.26958,
                "rooms_lon": -123.25741
            }, { "rooms_name": "ANSO_203", "rooms_lat": 49.26958, "rooms_lon": -123.25741 }, {
                "rooms_name": "ANSO_205",
                "rooms_lat": 49.26958,
                "rooms_lon": -123.25741
            }, { "rooms_name": "ANSO_207", "rooms_lat": 49.26958, "rooms_lon": -123.25741 }, {
                "rooms_name": "AUDX_142",
                "rooms_lat": 49.2666,
                "rooms_lon": -123.25655
            }, { "rooms_name": "AUDX_157", "rooms_lat": 49.2666, "rooms_lon": -123.25655 }, {
                "rooms_name": "BIOL_1503",
                "rooms_lat": 49.26479,
                "rooms_lon": -123.25249
            }, { "rooms_name": "BIOL_2000", "rooms_lat": 49.26479, "rooms_lon": -123.25249 }, {
                "rooms_name": "BIOL_2200",
                "rooms_lat": 49.26479,
                "rooms_lon": -123.25249
            }, { "rooms_name": "BIOL_2519", "rooms_lat": 49.26479, "rooms_lon": -123.25249 }, {
                "rooms_name": "BRKX_2365",
                "rooms_lat": 49.26862,
                "rooms_lon": -123.25237
            }, { "rooms_name": "BRKX_2367", "rooms_lat": 49.26862, "rooms_lon": -123.25237 }, {
                "rooms_name": "BUCH_A101",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_A102", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_A103",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_A104", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_A201",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_A202", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_A203",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B141", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_B142",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B208", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_B209",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B210", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_B211",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B213", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_B215",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B216", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_B218",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B219", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_B302",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B303", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_B304",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B306", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_B307",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B308", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_B309",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B310", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_B312",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B313", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_B315",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B316", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_B318",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_B319", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D201",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D204", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D205",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D207", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D209",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D213", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D214",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D216", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D217",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D218", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D219",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D221", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D222",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D228", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D229",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D301", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D304",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D306", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D307",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D312", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D313",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D314", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D315",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D316", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D317",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D319", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D322",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "BUCH_D323", "rooms_lat": 49.26826, "rooms_lon": -123.25468 }, {
                "rooms_name": "BUCH_D325",
                "rooms_lat": 49.26826,
                "rooms_lon": -123.25468
            }, { "rooms_name": "CEME_1202", "rooms_lat": 49.26273, "rooms_lon": -123.24894 }, {
                "rooms_name": "CEME_1204",
                "rooms_lat": 49.26273,
                "rooms_lon": -123.24894
            }, { "rooms_name": "CEME_1206", "rooms_lat": 49.26273, "rooms_lon": -123.24894 }, {
                "rooms_name": "CEME_1210",
                "rooms_lat": 49.26273,
                "rooms_lon": -123.24894
            }, { "rooms_name": "CEME_1212", "rooms_lat": 49.26273, "rooms_lon": -123.24894 }, {
                "rooms_name": "CEME_1215",
                "rooms_lat": 49.26273,
                "rooms_lon": -123.24894
            }, { "rooms_name": "CHBE_101", "rooms_lat": 49.26228, "rooms_lon": -123.24718 }, {
                "rooms_name": "CHBE_102",
                "rooms_lat": 49.26228,
                "rooms_lon": -123.24718
            }, { "rooms_name": "CHBE_103", "rooms_lat": 49.26228, "rooms_lon": -123.24718 }, {
                "rooms_name": "CHEM_B150",
                "rooms_lat": 49.2659,
                "rooms_lon": -123.25308
            }, { "rooms_name": "CHEM_B250", "rooms_lat": 49.2659, "rooms_lon": -123.25308 }, {
                "rooms_name": "CHEM_C124",
                "rooms_lat": 49.2659,
                "rooms_lon": -123.25308
            }, { "rooms_name": "CHEM_C126", "rooms_lat": 49.2659, "rooms_lon": -123.25308 }, {
                "rooms_name": "CHEM_D200",
                "rooms_lat": 49.2659,
                "rooms_lon": -123.25308
            }, { "rooms_name": "CHEM_D300", "rooms_lat": 49.2659, "rooms_lon": -123.25308 }, {
                "rooms_name": "CIRS_1250",
                "rooms_lat": 49.26207,
                "rooms_lon": -123.25314
            }, { "rooms_name": "EOSM_135", "rooms_lat": 49.26228, "rooms_lon": -123.25198 }, {
                "rooms_name": "ESB_1012",
                "rooms_lat": 49.26274,
                "rooms_lon": -123.25224
            }, { "rooms_name": "ESB_1013", "rooms_lat": 49.26274, "rooms_lon": -123.25224 }, {
                "rooms_name": "ESB_2012",
                "rooms_lat": 49.26274,
                "rooms_lon": -123.25224
            }, { "rooms_name": "FNH_20", "rooms_lat": 49.26414, "rooms_lon": -123.24959 }, {
                "rooms_name": "FNH_30",
                "rooms_lat": 49.26414,
                "rooms_lon": -123.24959
            }, { "rooms_name": "FNH_320", "rooms_lat": 49.26414, "rooms_lon": -123.24959 }, {
                "rooms_name": "FNH_40",
                "rooms_lat": 49.26414,
                "rooms_lon": -123.24959
            }, { "rooms_name": "FNH_50", "rooms_lat": 49.26414, "rooms_lon": -123.24959 }, {
                "rooms_name": "FNH_60",
                "rooms_lat": 49.26414,
                "rooms_lon": -123.24959
            }, { "rooms_name": "FORW_303", "rooms_lat": 49.26176, "rooms_lon": -123.25179 }, {
                "rooms_name": "FORW_317",
                "rooms_lat": 49.26176,
                "rooms_lon": -123.25179
            }, { "rooms_name": "FORW_519", "rooms_lat": 49.26176, "rooms_lon": -123.25179 }, {
                "rooms_name": "FRDM_153",
                "rooms_lat": 49.26541,
                "rooms_lon": -123.24608
            }, { "rooms_name": "GEOG_100", "rooms_lat": 49.26605, "rooms_lon": -123.25623 }, {
                "rooms_name": "GEOG_101",
                "rooms_lat": 49.26605,
                "rooms_lon": -123.25623
            }, { "rooms_name": "GEOG_147", "rooms_lat": 49.26605, "rooms_lon": -123.25623 }, {
                "rooms_name": "GEOG_200",
                "rooms_lat": 49.26605,
                "rooms_lon": -123.25623
            }, { "rooms_name": "GEOG_201", "rooms_lat": 49.26605, "rooms_lon": -123.25623 }, {
                "rooms_name": "GEOG_212",
                "rooms_lat": 49.26605,
                "rooms_lon": -123.25623
            }, { "rooms_name": "GEOG_214", "rooms_lat": 49.26605, "rooms_lon": -123.25623 }, {
                "rooms_name": "GEOG_242",
                "rooms_lat": 49.26605,
                "rooms_lon": -123.25623
            }, { "rooms_name": "HEBB_10", "rooms_lat": 49.2661, "rooms_lon": -123.25165 }, {
                "rooms_name": "HEBB_100",
                "rooms_lat": 49.2661,
                "rooms_lon": -123.25165
            }, { "rooms_name": "HEBB_12", "rooms_lat": 49.2661, "rooms_lon": -123.25165 }, {
                "rooms_name": "HEBB_13",
                "rooms_lat": 49.2661,
                "rooms_lon": -123.25165
            }, { "rooms_name": "HENN_200", "rooms_lat": 49.26627, "rooms_lon": -123.25374 }, {
                "rooms_name": "HENN_201",
                "rooms_lat": 49.26627,
                "rooms_lon": -123.25374
            }, { "rooms_name": "HENN_202", "rooms_lat": 49.26627, "rooms_lon": -123.25374 }, {
                "rooms_name": "HENN_301",
                "rooms_lat": 49.26627,
                "rooms_lon": -123.25374
            }, { "rooms_name": "HENN_302", "rooms_lat": 49.26627, "rooms_lon": -123.25374 }, {
                "rooms_name": "HENN_304",
                "rooms_lat": 49.26627,
                "rooms_lon": -123.25374
            }, { "rooms_name": "IBLC_155", "rooms_lat": 49.26766, "rooms_lon": -123.2521 }, {
                "rooms_name": "IBLC_156",
                "rooms_lat": 49.26766,
                "rooms_lon": -123.2521
            }, { "rooms_name": "IBLC_157", "rooms_lat": 49.26766, "rooms_lon": -123.2521 }, {
                "rooms_name": "IBLC_158",
                "rooms_lat": 49.26766,
                "rooms_lon": -123.2521
            }, { "rooms_name": "IBLC_182", "rooms_lat": 49.26766, "rooms_lon": -123.2521 }, {
                "rooms_name": "IBLC_185",
                "rooms_lat": 49.26766,
                "rooms_lon": -123.2521
            }, { "rooms_name": "IBLC_191", "rooms_lat": 49.26766, "rooms_lon": -123.2521 }, {
                "rooms_name": "IBLC_192",
                "rooms_lat": 49.26766,
                "rooms_lon": -123.2521
            }, { "rooms_name": "IBLC_193", "rooms_lat": 49.26766, "rooms_lon": -123.2521 }, {
                "rooms_name": "IBLC_194",
                "rooms_lat": 49.26766,
                "rooms_lon": -123.2521
            }, { "rooms_name": "IBLC_195", "rooms_lat": 49.26766, "rooms_lon": -123.2521 }, {
                "rooms_name": "IBLC_261",
                "rooms_lat": 49.26766,
                "rooms_lon": -123.2521
            }, { "rooms_name": "IBLC_263", "rooms_lat": 49.26766, "rooms_lon": -123.2521 }, {
                "rooms_name": "IBLC_264",
                "rooms_lat": 49.26766,
                "rooms_lon": -123.2521
            }, { "rooms_name": "IBLC_265", "rooms_lat": 49.26766, "rooms_lon": -123.2521 }, {
                "rooms_name": "IBLC_266",
                "rooms_lat": 49.26766,
                "rooms_lon": -123.2521
            }, { "rooms_name": "IBLC_460", "rooms_lat": 49.26766, "rooms_lon": -123.2521 }, {
                "rooms_name": "IBLC_461",
                "rooms_lat": 49.26766,
                "rooms_lon": -123.2521
            }, { "rooms_name": "IONA_301", "rooms_lat": 49.27106, "rooms_lon": -123.25042 }, {
                "rooms_name": "IONA_633",
                "rooms_lat": 49.27106,
                "rooms_lon": -123.25042
            }, { "rooms_name": "LASR_102", "rooms_lat": 49.26767, "rooms_lon": -123.25583 }, {
                "rooms_name": "LASR_104",
                "rooms_lat": 49.26767,
                "rooms_lon": -123.25583
            }, { "rooms_name": "LASR_105", "rooms_lat": 49.26767, "rooms_lon": -123.25583 }, {
                "rooms_name": "LASR_107",
                "rooms_lat": 49.26767,
                "rooms_lon": -123.25583
            }, { "rooms_name": "LASR_211", "rooms_lat": 49.26767, "rooms_lon": -123.25583 }, {
                "rooms_name": "LASR_5C",
                "rooms_lat": 49.26767,
                "rooms_lon": -123.25583
            }, { "rooms_name": "LSC_1001", "rooms_lat": 49.26236, "rooms_lon": -123.24494 }, {
                "rooms_name": "LSC_1002",
                "rooms_lat": 49.26236,
                "rooms_lon": -123.24494
            }, { "rooms_name": "LSC_1003", "rooms_lat": 49.26236, "rooms_lon": -123.24494 }, {
                "rooms_name": "LSK_200",
                "rooms_lat": 49.26545,
                "rooms_lon": -123.25533
            }, { "rooms_name": "LSK_201", "rooms_lat": 49.26545, "rooms_lon": -123.25533 }, {
                "rooms_name": "LSK_460",
                "rooms_lat": 49.26545,
                "rooms_lon": -123.25533
            }, { "rooms_name": "LSK_462", "rooms_lat": 49.26545, "rooms_lon": -123.25533 }, {
                "rooms_name": "MATH_100",
                "rooms_lat": 49.266463,
                "rooms_lon": -123.255534
            }, { "rooms_name": "MATH_102", "rooms_lat": 49.266463, "rooms_lon": -123.255534 }, {
                "rooms_name": "MATH_104",
                "rooms_lat": 49.266463,
                "rooms_lon": -123.255534
            }, { "rooms_name": "MATH_105", "rooms_lat": 49.266463, "rooms_lon": -123.255534 }, {
                "rooms_name": "MATH_202",
                "rooms_lat": 49.266463,
                "rooms_lon": -123.255534
            }, { "rooms_name": "MATH_203", "rooms_lat": 49.266463, "rooms_lon": -123.255534 }, {
                "rooms_name": "MATH_204",
                "rooms_lat": 49.266463,
                "rooms_lon": -123.255534
            }, { "rooms_name": "MATH_225", "rooms_lat": 49.266463, "rooms_lon": -123.255534 }, {
                "rooms_name": "MATX_1100",
                "rooms_lat": 49.266089,
                "rooms_lon": -123.254816
            }, { "rooms_name": "MCLD_202", "rooms_lat": 49.26176, "rooms_lon": -123.24935 }, {
                "rooms_name": "MCLD_214",
                "rooms_lat": 49.26176,
                "rooms_lon": -123.24935
            }, { "rooms_name": "MCLD_220", "rooms_lat": 49.26176, "rooms_lon": -123.24935 }, {
                "rooms_name": "MCLD_228",
                "rooms_lat": 49.26176,
                "rooms_lon": -123.24935
            }, { "rooms_name": "MCLD_242", "rooms_lat": 49.26176, "rooms_lon": -123.24935 }, {
                "rooms_name": "MCLD_254",
                "rooms_lat": 49.26176,
                "rooms_lon": -123.24935
            }, { "rooms_name": "MGYM_206", "rooms_lat": 49.2663, "rooms_lon": -123.2466 }, {
                "rooms_name": "MGYM_208",
                "rooms_lat": 49.2663,
                "rooms_lon": -123.2466
            }, { "rooms_name": "PCOH_1001", "rooms_lat": 49.264, "rooms_lon": -123.2559 }, {
                "rooms_name": "PCOH_1002",
                "rooms_lat": 49.264,
                "rooms_lon": -123.2559
            }, { "rooms_name": "PCOH_1003", "rooms_lat": 49.264, "rooms_lon": -123.2559 }, {
                "rooms_name": "PCOH_1008",
                "rooms_lat": 49.264,
                "rooms_lon": -123.2559
            }, { "rooms_name": "PCOH_1009", "rooms_lat": 49.264, "rooms_lon": -123.2559 }, {
                "rooms_name": "PCOH_1011",
                "rooms_lat": 49.264,
                "rooms_lon": -123.2559
            }, { "rooms_name": "PCOH_1215", "rooms_lat": 49.264, "rooms_lon": -123.2559 }, {
                "rooms_name": "PCOH_1302",
                "rooms_lat": 49.264,
                "rooms_lon": -123.2559
            }, { "rooms_name": "PHRM_1101", "rooms_lat": 49.26229, "rooms_lon": -123.24342 }, {
                "rooms_name": "PHRM_1201",
                "rooms_lat": 49.26229,
                "rooms_lon": -123.24342
            }, { "rooms_name": "PHRM_3112", "rooms_lat": 49.26229, "rooms_lon": -123.24342 }, {
                "rooms_name": "PHRM_3114",
                "rooms_lat": 49.26229,
                "rooms_lon": -123.24342
            }, { "rooms_name": "PHRM_3115", "rooms_lat": 49.26229, "rooms_lon": -123.24342 }, {
                "rooms_name": "PHRM_3116",
                "rooms_lat": 49.26229,
                "rooms_lon": -123.24342
            }, { "rooms_name": "PHRM_3118", "rooms_lat": 49.26229, "rooms_lon": -123.24342 }, {
                "rooms_name": "PHRM_3120",
                "rooms_lat": 49.26229,
                "rooms_lon": -123.24342
            }, { "rooms_name": "PHRM_3122", "rooms_lat": 49.26229, "rooms_lon": -123.24342 }, {
                "rooms_name": "PHRM_3124",
                "rooms_lat": 49.26229,
                "rooms_lon": -123.24342
            }, { "rooms_name": "PHRM_3208", "rooms_lat": 49.26229, "rooms_lon": -123.24342 }, {
                "rooms_name": "SCRF_100",
                "rooms_lat": 49.26398,
                "rooms_lon": -123.2531
            }, { "rooms_name": "SCRF_1003", "rooms_lat": 49.26398, "rooms_lon": -123.2531 }, {
                "rooms_name": "SCRF_1004",
                "rooms_lat": 49.26398,
                "rooms_lon": -123.2531
            }, { "rooms_name": "SCRF_1005", "rooms_lat": 49.26398, "rooms_lon": -123.2531 }, {
                "rooms_name": "SCRF_1020",
                "rooms_lat": 49.26398,
                "rooms_lon": -123.2531
            }, { "rooms_name": "SCRF_1021", "rooms_lat": 49.26398, "rooms_lon": -123.2531 }, {
                "rooms_name": "SCRF_1022",
                "rooms_lat": 49.26398,
                "rooms_lon": -123.2531
            }, { "rooms_name": "SCRF_1023", "rooms_lat": 49.26398, "rooms_lon": -123.2531 }, {
                "rooms_name": "SCRF_1024",
                "rooms_lat": 49.26398,
                "rooms_lon": -123.2531
            }, { "rooms_name": "SCRF_1328", "rooms_lat": 49.26398, "rooms_lon": -123.2531 }, {
                "rooms_name": "SCRF_200",
                "rooms_lat": 49.26398,
                "rooms_lon": -123.2531
            }, { "rooms_name": "SCRF_201", "rooms_lat": 49.26398, "rooms_lon": -123.2531 }, {
                "rooms_name": "SCRF_202",
                "rooms_lat": 49.26398,
                "rooms_lon": -123.2531
            }, { "rooms_name": "SCRF_203", "rooms_lat": 49.26398, "rooms_lon": -123.2531 }, {
                "rooms_name": "SCRF_204",
                "rooms_lat": 49.26398,
                "rooms_lon": -123.2531
            }, { "rooms_name": "SCRF_204A", "rooms_lat": 49.26398, "rooms_lon": -123.2531 }, {
                "rooms_name": "SCRF_205",
                "rooms_lat": 49.26398,
                "rooms_lon": -123.2531
            }, { "rooms_name": "SCRF_206", "rooms_lat": 49.26398, "rooms_lon": -123.2531 }, {
                "rooms_name": "SCRF_207",
                "rooms_lat": 49.26398,
                "rooms_lon": -123.2531
            }, { "rooms_name": "SCRF_208", "rooms_lat": 49.26398, "rooms_lon": -123.2531 }, {
                "rooms_name": "SCRF_209",
                "rooms_lat": 49.26398,
                "rooms_lon": -123.2531
            }, { "rooms_name": "SCRF_210", "rooms_lat": 49.26398, "rooms_lon": -123.2531 }, {
                "rooms_name": "SOWK_122",
                "rooms_lat": 49.2643,
                "rooms_lon": -123.25505
            }, { "rooms_name": "SOWK_124", "rooms_lat": 49.2643, "rooms_lon": -123.25505 }, {
                "rooms_name": "SOWK_222",
                "rooms_lat": 49.2643,
                "rooms_lon": -123.25505
            }, { "rooms_name": "SOWK_223", "rooms_lat": 49.2643, "rooms_lon": -123.25505 }, {
                "rooms_name": "SOWK_224",
                "rooms_lat": 49.2643,
                "rooms_lon": -123.25505
            }, { "rooms_name": "SOWK_324", "rooms_lat": 49.2643, "rooms_lon": -123.25505 }, {
                "rooms_name": "SOWK_326",
                "rooms_lat": 49.2643,
                "rooms_lon": -123.25505
            }, { "rooms_name": "SPPH_143", "rooms_lat": 49.2642, "rooms_lon": -123.24842 }, {
                "rooms_name": "SPPH_B108",
                "rooms_lat": 49.2642,
                "rooms_lon": -123.24842
            }, { "rooms_name": "SPPH_B112", "rooms_lat": 49.2642, "rooms_lon": -123.24842 }, {
                "rooms_name": "SPPH_B136",
                "rooms_lat": 49.2642,
                "rooms_lon": -123.24842
            }, { "rooms_name": "SPPH_B138", "rooms_lat": 49.2642, "rooms_lon": -123.24842 }, {
                "rooms_name": "SPPH_B151",
                "rooms_lat": 49.2642,
                "rooms_lon": -123.24842
            }, { "rooms_name": "SRC_220A", "rooms_lat": 49.2683, "rooms_lon": -123.24894 }, {
                "rooms_name": "SRC_220B",
                "rooms_lat": 49.2683,
                "rooms_lon": -123.24894
            }, { "rooms_name": "SRC_220C", "rooms_lat": 49.2683, "rooms_lon": -123.24894 }, {
                "rooms_name": "SWNG_105",
                "rooms_lat": 49.26293,
                "rooms_lon": -123.25431
            }, { "rooms_name": "SWNG_106", "rooms_lat": 49.26293, "rooms_lon": -123.25431 }, {
                "rooms_name": "SWNG_107",
                "rooms_lat": 49.26293,
                "rooms_lon": -123.25431
            }, { "rooms_name": "SWNG_108", "rooms_lat": 49.26293, "rooms_lon": -123.25431 }, {
                "rooms_name": "SWNG_109",
                "rooms_lat": 49.26293,
                "rooms_lon": -123.25431
            }, { "rooms_name": "SWNG_110", "rooms_lat": 49.26293, "rooms_lon": -123.25431 }, {
                "rooms_name": "SWNG_121",
                "rooms_lat": 49.26293,
                "rooms_lon": -123.25431
            }, { "rooms_name": "SWNG_122", "rooms_lat": 49.26293, "rooms_lon": -123.25431 }, {
                "rooms_name": "SWNG_221",
                "rooms_lat": 49.26293,
                "rooms_lon": -123.25431
            }, { "rooms_name": "SWNG_222", "rooms_lat": 49.26293, "rooms_lon": -123.25431 }, {
                "rooms_name": "SWNG_305",
                "rooms_lat": 49.26293,
                "rooms_lon": -123.25431
            }, { "rooms_name": "SWNG_306", "rooms_lat": 49.26293, "rooms_lon": -123.25431 }, {
                "rooms_name": "SWNG_307",
                "rooms_lat": 49.26293,
                "rooms_lon": -123.25431
            }, { "rooms_name": "SWNG_308", "rooms_lat": 49.26293, "rooms_lon": -123.25431 }, {
                "rooms_name": "SWNG_309",
                "rooms_lat": 49.26293,
                "rooms_lon": -123.25431
            }, { "rooms_name": "SWNG_310", "rooms_lat": 49.26293, "rooms_lon": -123.25431 }, {
                "rooms_name": "SWNG_405",
                "rooms_lat": 49.26293,
                "rooms_lon": -123.25431
            }, { "rooms_name": "SWNG_406", "rooms_lat": 49.26293, "rooms_lon": -123.25431 }, {
                "rooms_name": "SWNG_407",
                "rooms_lat": 49.26293,
                "rooms_lon": -123.25431
            }, { "rooms_name": "SWNG_408", "rooms_lat": 49.26293, "rooms_lon": -123.25431 }, {
                "rooms_name": "SWNG_409",
                "rooms_lat": 49.26293,
                "rooms_lon": -123.25431
            }, { "rooms_name": "SWNG_410", "rooms_lat": 49.26293, "rooms_lon": -123.25431 }, {
                "rooms_name": "UCLL_101",
                "rooms_lat": 49.26867,
                "rooms_lon": -123.25692
            }, { "rooms_name": "UCLL_103", "rooms_lat": 49.26867, "rooms_lon": -123.25692 }, {
                "rooms_name": "UCLL_107",
                "rooms_lat": 49.26867,
                "rooms_lon": -123.25692
            }, { "rooms_name": "UCLL_109", "rooms_lat": 49.26867, "rooms_lon": -123.25692 }, {
                "rooms_name": "WESB_100",
                "rooms_lat": 49.26517,
                "rooms_lon": -123.24937
            }, { "rooms_name": "WESB_201", "rooms_lat": 49.26517, "rooms_lon": -123.24937 }, {
                "rooms_name": "WOOD_1",
                "rooms_lat": 49.26478,
                "rooms_lon": -123.24673
            }, { "rooms_name": "WOOD_2", "rooms_lat": 49.26478, "rooms_lon": -123.24673 }, {
                "rooms_name": "WOOD_3",
                "rooms_lat": 49.26478,
                "rooms_lon": -123.24673
            }, { "rooms_name": "WOOD_4", "rooms_lat": 49.26478, "rooms_lon": -123.24673 }, {
                "rooms_name": "WOOD_5",
                "rooms_lat": 49.26478,
                "rooms_lon": -123.24673
            }, { "rooms_name": "WOOD_6", "rooms_lat": 49.26478, "rooms_lon": -123.24673 }, {
                "rooms_name": "WOOD_B75",
                "rooms_lat": 49.26478,
                "rooms_lon": -123.24673
            }, { "rooms_name": "WOOD_B79", "rooms_lat": 49.26478, "rooms_lon": -123.24673 }, {
                "rooms_name": "WOOD_G41",
                "rooms_lat": 49.26478,
                "rooms_lon": -123.24673
            }, { "rooms_name": "WOOD_G44", "rooms_lat": 49.26478, "rooms_lon": -123.24673 }, {
                "rooms_name": "WOOD_G53",
                "rooms_lat": 49.26478,
                "rooms_lon": -123.24673
            }, { "rooms_name": "WOOD_G55", "rooms_lat": 49.26478, "rooms_lon": -123.24673 }, {
                "rooms_name": "WOOD_G57",
                "rooms_lat": 49.26478,
                "rooms_lon": -123.24673
            }, { "rooms_name": "WOOD_G59", "rooms_lat": 49.26478, "rooms_lon": -123.24673 }, {
                "rooms_name": "WOOD_G65",
                "rooms_lat": 49.26478,
                "rooms_lon": -123.24673
            }, { "rooms_name": "WOOD_G66", "rooms_lat": 49.26478, "rooms_lon": -123.24673 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("rooms_lon", function () {
        var query = {
            "WHERE": {
                "EQ": {
                    "rooms_lon": -123.24807
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_lat", "rooms_lon"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{
                "rooms_name": "DMP_101",
                "rooms_lat": 49.26125,
                "rooms_lon": -123.24807
            }, { "rooms_name": "DMP_110", "rooms_lat": 49.26125, "rooms_lon": -123.24807 }, {
                "rooms_name": "DMP_201",
                "rooms_lat": 49.26125,
                "rooms_lon": -123.24807
            }, { "rooms_name": "DMP_301", "rooms_lat": 49.26125, "rooms_lon": -123.24807 }, {
                "rooms_name": "DMP_310",
                "rooms_lat": 49.26125,
                "rooms_lon": -123.24807
            }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("rooms_seats", function () {
        var query = {
            "WHERE": {
                "GT": {
                    "rooms_seats": 150
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_seats"
                ],
                "ORDER": "rooms_seats"
            }
        };
        var second = [{ "rooms_name": "IBLC_182", "rooms_seats": 154 }, {
                "rooms_name": "HENN_201",
                "rooms_seats": 155
            }, { "rooms_name": "FRDM_153", "rooms_seats": 160 }, {
                "rooms_name": "DMP_310",
                "rooms_seats": 160
            }, { "rooms_name": "PHRM_1201", "rooms_seats": 167 }, {
                "rooms_name": "BUCH_A201",
                "rooms_seats": 181
            }, { "rooms_name": "WOOD_6", "rooms_seats": 181 }, {
                "rooms_name": "LSK_201",
                "rooms_seats": 183
            }, { "rooms_name": "SWNG_121", "rooms_seats": 187 }, {
                "rooms_name": "SWNG_122",
                "rooms_seats": 188
            }, { "rooms_name": "SWNG_221", "rooms_seats": 190 }, {
                "rooms_name": "SWNG_222",
                "rooms_seats": 190
            }, { "rooms_name": "CHBE_101", "rooms_seats": 200 }, {
                "rooms_name": "MCML_166",
                "rooms_seats": 200
            }, { "rooms_name": "LSK_200", "rooms_seats": 205 }, {
                "rooms_name": "MATH_100",
                "rooms_seats": 224
            }, { "rooms_name": "GEOG_100", "rooms_seats": 225 }, {
                "rooms_name": "BIOL_2000",
                "rooms_seats": 228
            }, { "rooms_name": "PHRM_1101", "rooms_seats": 236 }, {
                "rooms_name": "CHEM_B250",
                "rooms_seats": 240
            }, { "rooms_name": "FSC_1005", "rooms_seats": 250 }, {
                "rooms_name": "HENN_200",
                "rooms_seats": 257
            }, { "rooms_name": "ANGU_098", "rooms_seats": 260 }, {
                "rooms_name": "CHEM_B150",
                "rooms_seats": 265
            }, { "rooms_name": "BUCH_A101", "rooms_seats": 275 }, {
                "rooms_name": "SCRF_100",
                "rooms_seats": 280
            }, { "rooms_name": "SRC_220A", "rooms_seats": 299 }, {
                "rooms_name": "SRC_220B",
                "rooms_seats": 299
            }, { "rooms_name": "SRC_220C", "rooms_seats": 299 }, {
                "rooms_name": "WESB_100",
                "rooms_seats": 325
            }, { "rooms_name": "ESB_1013", "rooms_seats": 350 }, {
                "rooms_name": "LSC_1001",
                "rooms_seats": 350
            }, { "rooms_name": "LSC_1002", "rooms_seats": 350 }, {
                "rooms_name": "HEBB_100",
                "rooms_seats": 375
            }, { "rooms_name": "CIRS_1250", "rooms_seats": 426 }, {
                "rooms_name": "OSBO_A",
                "rooms_seats": 442
            }, { "rooms_name": "WOOD_2", "rooms_seats": 503 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("rooms_type", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_type": "Tiered Large Group"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_seats"
                ],
                "ORDER": "rooms_seats"
            }
        };
        var second = [{ "rooms_name": "ANGU_354", "rooms_seats": 44 }, {
                "rooms_name": "ANGU_350",
                "rooms_seats": 58
            }, { "rooms_name": "BUCH_D218", "rooms_seats": 65 }, {
                "rooms_name": "BUCH_D219",
                "rooms_seats": 65
            }, { "rooms_name": "BUCH_D217", "rooms_seats": 65 }, {
                "rooms_name": "ANGU_343",
                "rooms_seats": 68
            }, { "rooms_name": "ANGU_243", "rooms_seats": 68 }, {
                "rooms_name": "ANGU_345",
                "rooms_seats": 68
            }, { "rooms_name": "BRKX_2365", "rooms_seats": 70 }, {
                "rooms_name": "ANGU_241",
                "rooms_seats": 70
            }, { "rooms_name": "ANGU_347", "rooms_seats": 70 }, {
                "rooms_name": "MCML_158",
                "rooms_seats": 74
            }, { "rooms_name": "BIOL_2200", "rooms_seats": 76 }, {
                "rooms_name": "BUCH_B315",
                "rooms_seats": 78
            }, { "rooms_name": "BUCH_B313", "rooms_seats": 78 }, {
                "rooms_name": "LASR_102",
                "rooms_seats": 80
            }, { "rooms_name": "ESB_2012", "rooms_seats": 80 }, {
                "rooms_name": "DMP_301",
                "rooms_seats": 80
            }, { "rooms_name": "WOOD_3", "rooms_seats": 88 }, {
                "rooms_name": "CHEM_C124",
                "rooms_seats": 90
            }, { "rooms_name": "CHEM_C126", "rooms_seats": 90 }, {
                "rooms_name": "CHBE_102",
                "rooms_seats": 94
            }, { "rooms_name": "LASR_104", "rooms_seats": 94 }, {
                "rooms_name": "FNH_60",
                "rooms_seats": 99
            }, { "rooms_name": "FSC_1221", "rooms_seats": 99 }, {
                "rooms_name": "CEME_1202",
                "rooms_seats": 100
            }, { "rooms_name": "WESB_201", "rooms_seats": 102 }, {
                "rooms_name": "MATX_1100",
                "rooms_seats": 106
            }, { "rooms_name": "CHEM_D300", "rooms_seats": 114 }, {
                "rooms_name": "CHEM_D200",
                "rooms_seats": 114
            }, { "rooms_name": "WOOD_4", "rooms_seats": 120 }, {
                "rooms_name": "WOOD_5",
                "rooms_seats": 120
            }, { "rooms_name": "DMP_110", "rooms_seats": 120 }, {
                "rooms_name": "WOOD_1",
                "rooms_seats": 120
            }, { "rooms_name": "MCLD_202", "rooms_seats": 123 }, {
                "rooms_name": "LSC_1003",
                "rooms_seats": 125
            }, { "rooms_name": "BUCH_A103", "rooms_seats": 131 }, {
                "rooms_name": "MCLD_228",
                "rooms_seats": 136
            }, { "rooms_name": "AERL_120", "rooms_seats": 144 }, {
                "rooms_name": "BUCH_A104",
                "rooms_seats": 150
            }, { "rooms_name": "HENN_202", "rooms_seats": 150 }, {
                "rooms_name": "BUCH_A102",
                "rooms_seats": 150
            }, { "rooms_name": "ESB_1012", "rooms_seats": 150 }, {
                "rooms_name": "IBLC_182",
                "rooms_seats": 154
            }, { "rooms_name": "HENN_201", "rooms_seats": 155 }, {
                "rooms_name": "FRDM_153",
                "rooms_seats": 160
            }, { "rooms_name": "DMP_310", "rooms_seats": 160 }, {
                "rooms_name": "PHRM_1201",
                "rooms_seats": 167
            }, { "rooms_name": "WOOD_6", "rooms_seats": 181 }, {
                "rooms_name": "BUCH_A201",
                "rooms_seats": 181
            }, { "rooms_name": "LSK_201", "rooms_seats": 183 }, {
                "rooms_name": "SWNG_121",
                "rooms_seats": 187
            }, { "rooms_name": "SWNG_122", "rooms_seats": 188 }, {
                "rooms_name": "SWNG_221",
                "rooms_seats": 190
            }, { "rooms_name": "SWNG_222", "rooms_seats": 190 }, {
                "rooms_name": "MCML_166",
                "rooms_seats": 200
            }, { "rooms_name": "CHBE_101", "rooms_seats": 200 }, {
                "rooms_name": "LSK_200",
                "rooms_seats": 205
            }, { "rooms_name": "MATH_100", "rooms_seats": 224 }, {
                "rooms_name": "GEOG_100",
                "rooms_seats": 225
            }, { "rooms_name": "BIOL_2000", "rooms_seats": 228 }, {
                "rooms_name": "PHRM_1101",
                "rooms_seats": 236
            }, { "rooms_name": "CHEM_B250", "rooms_seats": 240 }, {
                "rooms_name": "FSC_1005",
                "rooms_seats": 250
            }, { "rooms_name": "HENN_200", "rooms_seats": 257 }, {
                "rooms_name": "ANGU_098",
                "rooms_seats": 260
            }, { "rooms_name": "CHEM_B150", "rooms_seats": 265 }, {
                "rooms_name": "BUCH_A101",
                "rooms_seats": 275
            }, { "rooms_name": "SCRF_100", "rooms_seats": 280 }, {
                "rooms_name": "WESB_100",
                "rooms_seats": 325
            }, { "rooms_name": "ESB_1013", "rooms_seats": 350 }, {
                "rooms_name": "LSC_1001",
                "rooms_seats": 350
            }, { "rooms_name": "LSC_1002", "rooms_seats": 350 }, {
                "rooms_name": "HEBB_100",
                "rooms_seats": 375
            }, { "rooms_name": "CIRS_1250", "rooms_seats": 426 }, { "rooms_name": "WOOD_2", "rooms_seats": 503 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("rooms_furniture", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_furniture"
                ],
                "ORDER": "rooms_furniture"
            }
        };
        var second = [{
                "rooms_name": "MCLD_202",
                "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
            }, {
                "rooms_name": "MCLD_228",
                "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
            }, {
                "rooms_name": "LSK_200",
                "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
            }, {
                "rooms_name": "LSK_201",
                "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
            }, {
                "rooms_name": "IBLC_182",
                "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
            }, {
                "rooms_name": "HEBB_100",
                "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
            }, {
                "rooms_name": "LASR_102",
                "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
            }, {
                "rooms_name": "CEME_1202",
                "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
            }, {
                "rooms_name": "BUCH_A203",
                "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs"
            }, { "rooms_name": "BUCH_A202", "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("rooms_href", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A202"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_href"
                ],
                "ORDER": "rooms_href"
            }
        };
        var second = [{
                "rooms_name": "BUCH_A202",
                "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A202"
            }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("AND", function () {
        var query = {
            "WHERE": {
                "AND": [
                    {
                        "IS": {
                            "rooms_address": "*Agrono*"
                        }
                    },
                    {
                        "IS": {
                            "rooms_shortname": "DMP*"
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name",
                    "rooms_seats"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{ "rooms_name": "DMP_101", "rooms_seats": 40 }, {
                "rooms_name": "DMP_110",
                "rooms_seats": 120
            }, { "rooms_name": "DMP_201", "rooms_seats": 40 }, {
                "rooms_name": "DMP_301",
                "rooms_seats": 80
            }, { "rooms_name": "DMP_310", "rooms_seats": 160 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("OR", function () {
        var query = {
            "WHERE": {
                "OR": [
                    {
                        "IS": {
                            "rooms_shortname": "WOOD"
                        }
                    },
                    {
                        "IS": {
                            "rooms_shortname": "DMP*"
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name",
                    "rooms_seats"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{ "rooms_name": "DMP_101", "rooms_seats": 40 }, {
                "rooms_name": "DMP_110",
                "rooms_seats": 120
            }, { "rooms_name": "DMP_201", "rooms_seats": 40 }, {
                "rooms_name": "DMP_301",
                "rooms_seats": 80
            }, { "rooms_name": "DMP_310", "rooms_seats": 160 }, {
                "rooms_name": "WOOD_1",
                "rooms_seats": 120
            }, { "rooms_name": "WOOD_2", "rooms_seats": 503 }, {
                "rooms_name": "WOOD_3",
                "rooms_seats": 88
            }, { "rooms_name": "WOOD_4", "rooms_seats": 120 }, {
                "rooms_name": "WOOD_5",
                "rooms_seats": 120
            }, { "rooms_name": "WOOD_6", "rooms_seats": 181 }, {
                "rooms_name": "WOOD_B75",
                "rooms_seats": 30
            }, { "rooms_name": "WOOD_B79", "rooms_seats": 21 }, {
                "rooms_name": "WOOD_G41",
                "rooms_seats": 30
            }, { "rooms_name": "WOOD_G44", "rooms_seats": 14 }, {
                "rooms_name": "WOOD_G53",
                "rooms_seats": 10
            }, { "rooms_name": "WOOD_G55", "rooms_seats": 10 }, {
                "rooms_name": "WOOD_G57",
                "rooms_seats": 12
            }, { "rooms_name": "WOOD_G59", "rooms_seats": 10 }, {
                "rooms_name": "WOOD_G65",
                "rooms_seats": 12
            }, { "rooms_name": "WOOD_G66", "rooms_seats": 16 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("NOT", function () {
        var query = {
            "WHERE": {
                "NOT": {
                    "LT": {
                        "rooms_seats": 100
                    }
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name",
                    "rooms_seats"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{ "rooms_name": "AERL_120", "rooms_seats": 144 }, {
                "rooms_name": "ANGU_098",
                "rooms_seats": 260
            }, { "rooms_name": "BIOL_2000", "rooms_seats": 228 }, {
                "rooms_name": "BUCH_A101",
                "rooms_seats": 275
            }, { "rooms_name": "BUCH_A102", "rooms_seats": 150 }, {
                "rooms_name": "BUCH_A103",
                "rooms_seats": 131
            }, { "rooms_name": "BUCH_A104", "rooms_seats": 150 }, {
                "rooms_name": "BUCH_A201",
                "rooms_seats": 181
            }, { "rooms_name": "BUCH_A202", "rooms_seats": 108 }, {
                "rooms_name": "BUCH_A203",
                "rooms_seats": 108
            }, { "rooms_name": "CEME_1202", "rooms_seats": 100 }, {
                "rooms_name": "CHBE_101",
                "rooms_seats": 200
            }, { "rooms_name": "CHEM_B150", "rooms_seats": 265 }, {
                "rooms_name": "CHEM_B250",
                "rooms_seats": 240
            }, { "rooms_name": "CHEM_D200", "rooms_seats": 114 }, {
                "rooms_name": "CHEM_D300",
                "rooms_seats": 114
            }, { "rooms_name": "CIRS_1250", "rooms_seats": 426 }, {
                "rooms_name": "DMP_110",
                "rooms_seats": 120
            }, { "rooms_name": "DMP_310", "rooms_seats": 160 }, {
                "rooms_name": "ESB_1012",
                "rooms_seats": 150
            }, { "rooms_name": "ESB_1013", "rooms_seats": 350 }, {
                "rooms_name": "FRDM_153",
                "rooms_seats": 160
            }, { "rooms_name": "FSC_1005", "rooms_seats": 250 }, {
                "rooms_name": "GEOG_100",
                "rooms_seats": 225
            }, { "rooms_name": "GEOG_200", "rooms_seats": 100 }, {
                "rooms_name": "HEBB_100",
                "rooms_seats": 375
            }, { "rooms_name": "HENN_200", "rooms_seats": 257 }, {
                "rooms_name": "HENN_201",
                "rooms_seats": 155
            }, { "rooms_name": "HENN_202", "rooms_seats": 150 }, {
                "rooms_name": "IBLC_182",
                "rooms_seats": 154
            }, { "rooms_name": "IBLC_261", "rooms_seats": 112 }, {
                "rooms_name": "IONA_301",
                "rooms_seats": 100
            }, { "rooms_name": "LSC_1001", "rooms_seats": 350 }, {
                "rooms_name": "LSC_1002",
                "rooms_seats": 350
            }, { "rooms_name": "LSC_1003", "rooms_seats": 125 }, {
                "rooms_name": "LSK_200",
                "rooms_seats": 205
            }, { "rooms_name": "LSK_201", "rooms_seats": 183 }, {
                "rooms_name": "MATH_100",
                "rooms_seats": 224
            }, { "rooms_name": "MATX_1100", "rooms_seats": 106 }, {
                "rooms_name": "MCLD_202",
                "rooms_seats": 123
            }, { "rooms_name": "MCLD_228", "rooms_seats": 136 }, {
                "rooms_name": "MCML_166",
                "rooms_seats": 200
            }, { "rooms_name": "OSBO_A", "rooms_seats": 442 }, {
                "rooms_name": "PHRM_1101",
                "rooms_seats": 236
            }, { "rooms_name": "PHRM_1201", "rooms_seats": 167 }, {
                "rooms_name": "SCRF_100",
                "rooms_seats": 280
            }, { "rooms_name": "SRC_220A", "rooms_seats": 299 }, {
                "rooms_name": "SRC_220B",
                "rooms_seats": 299
            }, { "rooms_name": "SRC_220C", "rooms_seats": 299 }, {
                "rooms_name": "SWNG_121",
                "rooms_seats": 187
            }, { "rooms_name": "SWNG_122", "rooms_seats": 188 }, {
                "rooms_name": "SWNG_221",
                "rooms_seats": 190
            }, { "rooms_name": "SWNG_222", "rooms_seats": 190 }, {
                "rooms_name": "WESB_100",
                "rooms_seats": 325
            }, { "rooms_name": "WESB_201", "rooms_seats": 102 }, {
                "rooms_name": "WOOD_1",
                "rooms_seats": 120
            }, { "rooms_name": "WOOD_2", "rooms_seats": 503 }, {
                "rooms_name": "WOOD_4",
                "rooms_seats": 120
            }, { "rooms_name": "WOOD_5", "rooms_seats": 120 }, { "rooms_name": "WOOD_6", "rooms_seats": 181 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("IS", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_101"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_110"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_201"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_301"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_310"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_1001" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3002"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3004" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3016"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3018" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3052"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3058" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3062"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3068" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3072"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3074" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4002"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4004" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4016"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4018" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4052"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4058" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4062"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4068" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4072"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4074" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("GT", function () {
        var query = {
            "WHERE": {
                "GT": {
                    "rooms_seats": 200
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{ "rooms_name": "ANGU_098" }, { "rooms_name": "BIOL_2000" }, { "rooms_name": "BUCH_A101" }, { "rooms_name": "CHEM_B150" }, { "rooms_name": "CHEM_B250" }, { "rooms_name": "CIRS_1250" }, { "rooms_name": "ESB_1013" }, { "rooms_name": "FSC_1005" }, { "rooms_name": "GEOG_100" }, { "rooms_name": "HEBB_100" }, { "rooms_name": "HENN_200" }, { "rooms_name": "LSC_1001" }, { "rooms_name": "LSC_1002" }, { "rooms_name": "LSK_200" }, { "rooms_name": "MATH_100" }, { "rooms_name": "OSBO_A" }, { "rooms_name": "PHRM_1101" }, { "rooms_name": "SCRF_100" }, { "rooms_name": "SRC_220A" }, { "rooms_name": "SRC_220B" }, { "rooms_name": "SRC_220C" }, { "rooms_name": "WESB_100" }, { "rooms_name": "WOOD_2" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("LT", function () {
        var query = {
            "WHERE": {
                "LT": {
                    "rooms_seats": 10
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{ "rooms_name": "IBLC_192" }, { "rooms_name": "IBLC_193" }, { "rooms_name": "IBLC_194" }, { "rooms_name": "IBLC_195" }, { "rooms_name": "IBLC_263" }, { "rooms_name": "IBLC_266" }, { "rooms_name": "MCML_360A" }, { "rooms_name": "MCML_360B" }, { "rooms_name": "MCML_360C" }, { "rooms_name": "MCML_360D" }, { "rooms_name": "MCML_360E" }, { "rooms_name": "MCML_360F" }, { "rooms_name": "MCML_360G" }, { "rooms_name": "MCML_360H" }, { "rooms_name": "MCML_360J" }, { "rooms_name": "MCML_360K" }, { "rooms_name": "MCML_360L" }, { "rooms_name": "MCML_360M" }, { "rooms_name": "PHRM_3112" }, { "rooms_name": "PHRM_3114" }, { "rooms_name": "PHRM_3115" }, { "rooms_name": "PHRM_3118" }, { "rooms_name": "PHRM_3120" }, { "rooms_name": "PHRM_3122" }, { "rooms_name": "PHRM_3124" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("EQ", function () {
        var query = {
            "WHERE": {
                "EQ": {
                    "rooms_seats": 20
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{ "rooms_name": "ALRD_112" }, { "rooms_name": "ALRD_113" }, { "rooms_name": "ANGU_339" }, { "rooms_name": "AUDX_142" }, { "rooms_name": "FSC_1615" }, { "rooms_name": "FSC_1617" }, { "rooms_name": "LASR_211" }, { "rooms_name": "LASR_5C" }, { "rooms_name": "ORCH_4072" }, { "rooms_name": "SCRF_1021" }, { "rooms_name": "SCRF_1022" }, { "rooms_name": "SCRF_1023" }, { "rooms_name": "SCRF_1024" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("partial string_1 -* ", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "6245 Agronomy*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_101"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_110"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_201"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_301"
            }, { "rooms_address": "6245 Agronomy Road V6T 1Z4", "rooms_name": "DMP_310" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("partial string_2 *- ", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*V6T 1Z4"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{
                "rooms_address": "2260 West Mall, V6T 1Z4",
                "rooms_name": "CIRS_1250"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_101"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_110"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_201"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_301"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_310"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_105"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_106"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_107"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_108"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_109"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_110"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_121"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_122"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_221"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_222"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_305"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_306"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_307"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_308"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_309"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_310"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_405"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_406"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_407"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_408"
            }, {
                "rooms_address": "2175 West Mall V6T 1Z4",
                "rooms_name": "SWNG_409"
            }, { "rooms_address": "2175 West Mall V6T 1Z4", "rooms_name": "SWNG_410" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("partial string_3 *-* ", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        var second = [{
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_101"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_110"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_201"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_301"
            }, {
                "rooms_address": "6245 Agronomy Road V6T 1Z4",
                "rooms_name": "DMP_310"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_1001" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3002"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3004" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3016"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3018" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3052"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3058" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3062"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3068" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_3072"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_3074" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4002"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4004" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4016"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4018" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4052"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4058" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4062"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4068" }, {
                "rooms_address": "6363 Agronomy Road",
                "rooms_name": "ORCH_4072"
            }, { "rooms_address": "6363 Agronomy Road", "rooms_name": "ORCH_4074" }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("missing COLUMNS", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "ORDER": "rooms_name"
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("no key under COLUMNS", function () {
        var emptyArray = [];
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": emptyArray,
                "ORDER": "rooms_name"
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("invaild keys in COLUMNS", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "missing data"
                ],
                "ORDER": "rooms_name"
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("invaild keys in ORDER", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "missing data"
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("invaild keys in ORDER", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name"
                ],
                "ORDER": "missing data"
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("ORDER is not in COLUMNS", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address"
                ],
                "ORDER": "rooms_name"
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("invaild filter", function () {
        var query = {
            "WHERE": {
                "AB": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("missing WHERE or OPTION", function () {
        var query = {
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_number"
                ],
                "ORDER": "rooms_number"
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect("Missing WHERE or OPTION! Invalid Query!");
        });
    });
    it("more than one key in WHERE or OPTIONS", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_number": "310"
                },
                "GT": {
                    "rooms_seats": 5
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name", "rooms_number"
                ],
                "ORDER": "rooms_number"
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("no filter under LOGIC", function () {
        var emptyArray = [];
        var query = {
            "WHERE": {
                "AND": emptyArray
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name",
                    "rooms_seats"
                ],
                "ORDER": "rooms_name"
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("Invalid query having keys for more than 1 dataset should result in 400", function () {
        var query = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_id", "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("Some COLUMNS keys are not contained in GROUP key", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "rooms_fullname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("GROUP contains invalid key", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "maxSeats"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("No APPLYKEY in APPLY", function () {
        var emptyArray = [];
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": emptyArray
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("APPLYKEY has more than one keys", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        },
                        "minSeats": {
                            "MIN": "rooms_seats"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("APPLYKEY's key is not a string", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["rooms_shortname"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        1000: {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("APPLYKEY's key contians '_'", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "max_Seats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("APPLYKEY's value has more than one keys", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats",
                            "MIN": "room_seats"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("applyToken is not one of MAX, MIN, AVG, SUM and COUNT", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MISS": "rooms_seats"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("1", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("The key_value is not exist in M_KEY or S_KEY, when apply COUNT", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "COUNT": "rooms_VALUE"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("The key_value is not exist in M_KEY, when apply MAX, MIN, SUM or AVG", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_VALUE"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": "maxSeats"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        var second = [{ "rooms_shortname": "LSC", "maxSeats": 350 }, { "rooms_shortname": "HEBB", "maxSeats": 375 }, { "rooms_shortname": "OSBO", "maxSeats": 442 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": "maxSeats"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        var second = [{ "rooms_shortname": "LSC", "maxSeats": 350 }, { "rooms_shortname": "HEBB", "maxSeats": 375 }, { "rooms_shortname": "OSBO", "maxSeats": 442 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("query A", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        var second = [{ "rooms_shortname": "OSBO", "maxSeats": 442 }, { "rooms_shortname": "HEBB", "maxSeats": 375 }, { "rooms_shortname": "LSC", "maxSeats": 350 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("query BB", function () {
        var emptyArray = [];
        var query = {
            "WHERE": {
                "GT": {
                    "courses_avg": 99
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_uuid"
                ],
                "ORDER": "courses_dept"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept",
                    "courses_id",
                    "courses_uuid"
                ],
                "APPLY": emptyArray
            }
        };
        return test.performQuery(query).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "maxSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxSeats", "rooms_shortname"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }]
            }
        };
        var second = [{ "rooms_shortname": "OSBO", "maxSeats": 442 }, { "rooms_shortname": "HEBB", "maxSeats": 375 }, { "rooms_shortname": "LSC", "maxSeats": 350 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 300
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "countnumber"
                ],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["countnumber", "rooms_shortname"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "countnumber": {
                            "COUNT": "rooms_shortname"
                        }
                    }]
            }
        };
        var second = [{ "rooms_shortname": "HEBB", "countnumber": 1 }, { "rooms_shortname": "LSC", "countnumber": 1 }, { "rooms_shortname": "OSBO", "countnumber": 1 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("complex", function () {
        var query = {
            "WHERE": {
                "OR": [
                    {
                        "AND": [
                            {
                                "GT": {
                                    "courses_avg": 90
                                }
                            },
                            {
                                "IS": {
                                    "courses_dept": "adhe"
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 95
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg",
                    "maxAVG"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxAVG", "courses_avg"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept", "courses_id", "courses_avg"],
                "APPLY": [{
                        "maxAVG": {
                            "MAX": "courses_avg"
                        }
                    }]
            }
        };
        var second = [{ "courses_dept": "adhe", "courses_id": "329", "courses_avg": 96.11, "maxAVG": 96.11 }, { "courses_dept": "cpsc", "courses_id": "589", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "psyc", "courses_id": "501", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "obst", "courses_id": "549", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "nurs", "courses_id": "424", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "musc", "courses_id": "553", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "mtrl", "courses_id": "599", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "mtrl", "courses_id": "564", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "math", "courses_id": "532", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "kin", "courses_id": "500", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "kin", "courses_id": "499", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "epse", "courses_id": "682", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "epse", "courses_id": "606", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "edcp", "courses_id": "473", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "econ", "courses_id": "516", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "crwr", "courses_id": "599", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "rhsc", "courses_id": "501", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "cnps", "courses_id": "535", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "bmeg", "courses_id": "597", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "sowk", "courses_id": "570", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "adhe", "courses_id": "329", "courses_avg": 93.33, "maxAVG": 93.33 }, { "courses_dept": "adhe", "courses_id": "329", "courses_avg": 92.54, "maxAVG": 92.54 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 91.48, "maxAVG": 91.48 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 91.33, "maxAVG": 91.33 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 91.29, "maxAVG": 91.29 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 90.85, "maxAVG": 90.85 }, { "courses_dept": "adhe", "courses_id": "329", "courses_avg": 90.82, "maxAVG": 90.82 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 90.72, "maxAVG": 90.72 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 90.5, "maxAVG": 90.5 }, { "courses_dept": "adhe", "courses_id": "412", "courses_avg": 90.18, "maxAVG": 90.18 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 90.17, "maxAVG": 90.17 }, { "courses_dept": "adhe", "courses_id": "412", "courses_avg": 90.16, "maxAVG": 90.16 }, { "courses_dept": "adhe", "courses_id": "329", "courses_avg": 90.02, "maxAVG": 90.02 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("query BB", function () {
        var emptyArray = [];
        var query = {
            "WHERE": {
                "GT": {
                    "courses_avg": 99
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_uuid"
                ],
                "ORDER": "courses_dept"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_dept",
                    "courses_id",
                    "courses_uuid"
                ],
                "APPLY": emptyArray
            }
        };
        return test.performQuery(query).then(function (response) {
            chai_1.expect(response.code).to.equal(200);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("for Unblowuppable, Unpossible", function () {
        var query = {
            "WHERE": {
                "OR": [
                    {
                        "AND": [
                            {
                                "GT": {
                                    "courses_avg": 90
                                }
                            },
                            {
                                "IS": {
                                    "courses_dept": "adhe"
                                }
                            }
                        ]
                    },
                    {
                        "EQ": {
                            "courses_avg": 95
                        }
                    }
                ]
            },
            "OPTIONS": {
                "COLUMNS": [
                    "courses_dept",
                    "courses_id",
                    "courses_avg",
                    "maxAVG"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxAVG", "courses_avg"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["courses_id", "courses_avg", "courses_dept"],
                "APPLY": [{
                        "maxAVG": {
                            "MAX": "courses_avg"
                        }
                    }]
            }
        };
        var second = [{ "courses_dept": "adhe", "courses_id": "329", "courses_avg": 96.11, "maxAVG": 96.11 }, { "courses_dept": "cpsc", "courses_id": "589", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "psyc", "courses_id": "501", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "obst", "courses_id": "549", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "nurs", "courses_id": "424", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "musc", "courses_id": "553", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "mtrl", "courses_id": "599", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "mtrl", "courses_id": "564", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "math", "courses_id": "532", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "kin", "courses_id": "500", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "kin", "courses_id": "499", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "epse", "courses_id": "682", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "epse", "courses_id": "606", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "edcp", "courses_id": "473", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "econ", "courses_id": "516", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "crwr", "courses_id": "599", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "rhsc", "courses_id": "501", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "cnps", "courses_id": "535", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "bmeg", "courses_id": "597", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "sowk", "courses_id": "570", "courses_avg": 95, "maxAVG": 95 }, { "courses_dept": "adhe", "courses_id": "329", "courses_avg": 93.33, "maxAVG": 93.33 }, { "courses_dept": "adhe", "courses_id": "329", "courses_avg": 92.54, "maxAVG": 92.54 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 91.48, "maxAVG": 91.48 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 91.33, "maxAVG": 91.33 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 91.29, "maxAVG": 91.29 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 90.85, "maxAVG": 90.85 }, { "courses_dept": "adhe", "courses_id": "329", "courses_avg": 90.82, "maxAVG": 90.82 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 90.72, "maxAVG": 90.72 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 90.5, "maxAVG": 90.5 }, { "courses_dept": "adhe", "courses_id": "412", "courses_avg": 90.18, "maxAVG": 90.18 }, { "courses_dept": "adhe", "courses_id": "330", "courses_avg": 90.17, "maxAVG": 90.17 }, { "courses_dept": "adhe", "courses_id": "412", "courses_avg": 90.16, "maxAVG": 90.16 }, { "courses_dept": "adhe", "courses_id": "329", "courses_avg": 90.02, "maxAVG": 90.02 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("COUNT", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["numberRooms"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_lat"],
                "APPLY": [{
                        "numberRooms": {
                            "COUNT": "rooms_number"
                        }
                    }]
            }
        };
        var second = [{ "rooms_shortname": "MATX", "rooms_lat": 49.266089, "numberRooms": 1 }, { "rooms_shortname": "CIRS", "rooms_lat": 49.26207, "numberRooms": 1 }, { "rooms_shortname": "FRDM", "rooms_lat": 49.26541, "numberRooms": 1 }, { "rooms_shortname": "AERL", "rooms_lat": 49.26372, "numberRooms": 1 }, { "rooms_shortname": "EOSM", "rooms_lat": 49.26228, "numberRooms": 1 }, { "rooms_shortname": "AUDX", "rooms_lat": 49.2666, "numberRooms": 2 }, { "rooms_shortname": "BRKX", "rooms_lat": 49.26862, "numberRooms": 2 }, { "rooms_shortname": "IONA", "rooms_lat": 49.27106, "numberRooms": 2 }, { "rooms_shortname": "MGYM", "rooms_lat": 49.2663, "numberRooms": 2 }, { "rooms_shortname": "WESB", "rooms_lat": 49.26517, "numberRooms": 2 }, { "rooms_shortname": "ESB", "rooms_lat": 49.26274, "numberRooms": 3 }, { "rooms_shortname": "SRC", "rooms_lat": 49.2683, "numberRooms": 3 }, { "rooms_shortname": "LSC", "rooms_lat": 49.26236, "numberRooms": 3 }, { "rooms_shortname": "FORW", "rooms_lat": 49.26176, "numberRooms": 3 }, { "rooms_shortname": "CHBE", "rooms_lat": 49.26228, "numberRooms": 3 }, { "rooms_shortname": "OSBO", "rooms_lat": 49.26047, "numberRooms": 3 }, { "rooms_shortname": "LSK", "rooms_lat": 49.26545, "numberRooms": 4 }, { "rooms_shortname": "HEBB", "rooms_lat": 49.2661, "numberRooms": 4 }, { "rooms_shortname": "UCLL", "rooms_lat": 49.26867, "numberRooms": 4 }, { "rooms_shortname": "BIOL", "rooms_lat": 49.26479, "numberRooms": 4 }, { "rooms_shortname": "ANSO", "rooms_lat": 49.26958, "numberRooms": 4 }, { "rooms_shortname": "DMP", "rooms_lat": 49.26125, "numberRooms": 5 }, { "rooms_shortname": "ALRD", "rooms_lat": 49.2699, "numberRooms": 5 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414, "numberRooms": 6 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176, "numberRooms": 6 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767, "numberRooms": 6 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642, "numberRooms": 6 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627, "numberRooms": 6 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659, "numberRooms": 6 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273, "numberRooms": 6 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643, "numberRooms": 7 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264, "numberRooms": 8 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605, "numberRooms": 8 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463, "numberRooms": 8 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044, "numberRooms": 10 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229, "numberRooms": 11 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "numberRooms": 16 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "numberRooms": 18 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "numberRooms": 19 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "numberRooms": 21 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "numberRooms": 22 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "numberRooms": 22 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "numberRooms": 28 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "numberRooms": 61 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("SUM", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 200
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": ["maxSeats", "rooms_shortname", "maxlat"],
                "ORDER": "rooms_shortname"
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_seats"],
                "APPLY": [
                    { "maxSeats": { "SUM": "rooms_seats" } },
                    { "maxlat": { "SUM": "rooms_lat" } }
                ]
            }
        };
        var second = [{ "rooms_shortname": "ANGU", "maxSeats": 260, "maxlat": 49.26 }, { "rooms_shortname": "HEBB", "maxSeats": 375, "maxlat": 49.27 }, { "rooms_shortname": "LSC", "maxSeats": 700, "maxlat": 98.52 }, { "rooms_shortname": "LSK", "maxSeats": 205, "maxlat": 49.27 }, { "rooms_shortname": "OSBO", "maxSeats": 442, "maxlat": 49.26 }, { "rooms_shortname": "PHRM", "maxSeats": 236, "maxlat": 49.26 }, { "rooms_shortname": "SRC", "maxSeats": 897, "maxlat": 147.8 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("AVG", function () {
        var query = {
            "WHERE": {
                "AND": [{
                        "IS": {
                            "rooms_furniture": "*Tables*"
                        }
                    }, {
                        "GT": {
                            "rooms_seats": 200
                        }
                    }]
            },
            "OPTIONS": {
                "COLUMNS": ["maxSeats", "rooms_shortname"],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["maxSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_seats"],
                "APPLY": [{
                        "maxSeats": {
                            "AVG": "rooms_seats"
                        }
                    }]
            }
        };
        var second = [{ "rooms_shortname": "LSK", "maxSeats": 205 }, { "rooms_shortname": "PHRM", "maxSeats": 236 }, { "rooms_shortname": "ANGU", "maxSeats": 260 }, { "rooms_shortname": "SRC", "maxSeats": 299 }, { "rooms_shortname": "LSC", "maxSeats": 350 }, { "rooms_shortname": "HEBB", "maxSeats": 375 }, { "rooms_shortname": "OSBO", "maxSeats": 442 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("many keys", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["rooms_shortname", "avgSeats", "minSeats", "maxSeats", "countRoom", "sumSeats"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{
                        "maxSeats": {
                            "MAX": "rooms_seats"
                        }
                    }, {
                        "avgSeats": {
                            "AVG": "rooms_seats"
                        }
                    }, {
                        "minSeats": {
                            "MIN": "rooms_seats"
                        }
                    }, {
                        "countRoom": {
                            "COUNT": "rooms_shortname"
                        }
                    }, {
                        "sumSeats": {
                            "SUM": "rooms_seats"
                        }
                    }]
            }
        };
        var second = [{ "rooms_shortname": "AUDX", "maxSeats": 21, "avgSeats": 20.5, "minSeats": 20, "countRoom": 1, "sumSeats": 41 }, { "rooms_shortname": "SPPH", "maxSeats": 66, "avgSeats": 27.67, "minSeats": 12, "countRoom": 1, "sumSeats": 166 }, { "rooms_shortname": "SOWK", "maxSeats": 68, "avgSeats": 28.71, "minSeats": 12, "countRoom": 1, "sumSeats": 201 }, { "rooms_shortname": "PCOH", "maxSeats": 40, "avgSeats": 30, "minSeats": 24, "countRoom": 1, "sumSeats": 240 }, { "rooms_shortname": "MCML", "maxSeats": 200, "avgSeats": 30.16, "minSeats": 6, "countRoom": 1, "sumSeats": 573 }, { "rooms_shortname": "ORCH", "maxSeats": 72, "avgSeats": 31.52, "minSeats": 16, "countRoom": 1, "sumSeats": 662 }, { "rooms_shortname": "IBLC", "maxSeats": 154, "avgSeats": 31.56, "minSeats": 8, "countRoom": 1, "sumSeats": 568 }, { "rooms_shortname": "MGYM", "maxSeats": 40, "avgSeats": 32.5, "minSeats": 25, "countRoom": 1, "sumSeats": 65 }, { "rooms_shortname": "UCLL", "maxSeats": 55, "avgSeats": 40.75, "minSeats": 30, "countRoom": 1, "sumSeats": 163 }, { "rooms_shortname": "FNH", "maxSeats": 99, "avgSeats": 43.83, "minSeats": 12, "countRoom": 1, "sumSeats": 263 }, { "rooms_shortname": "ALRD", "maxSeats": 94, "avgSeats": 45.6, "minSeats": 20, "countRoom": 1, "sumSeats": 228 }, { "rooms_shortname": "SCRF", "maxSeats": 280, "avgSeats": 45.64, "minSeats": 20, "countRoom": 1, "sumSeats": 1004 }, { "rooms_shortname": "ANSO", "maxSeats": 90, "avgSeats": 46.5, "minSeats": 26, "countRoom": 1, "sumSeats": 186 }, { "rooms_shortname": "BRKX", "maxSeats": 70, "avgSeats": 47, "minSeats": 24, "countRoom": 1, "sumSeats": 94 }, { "rooms_shortname": "FORW", "maxSeats": 63, "avgSeats": 47.33, "minSeats": 35, "countRoom": 1, "sumSeats": 142 }, { "rooms_shortname": "CEME", "maxSeats": 100, "avgSeats": 48.17, "minSeats": 22, "countRoom": 1, "sumSeats": 289 }, { "rooms_shortname": "PHRM", "maxSeats": 236, "avgSeats": 48.91, "minSeats": 7, "countRoom": 1, "sumSeats": 538 }, { "rooms_shortname": "EOSM", "maxSeats": 50, "avgSeats": 50, "minSeats": 50, "countRoom": 1, "sumSeats": 50 }, { "rooms_shortname": "BUCH", "maxSeats": 275, "avgSeats": 52.3, "minSeats": 18, "countRoom": 1, "sumSeats": 3190 }, { "rooms_shortname": "LASR", "maxSeats": 94, "avgSeats": 54.17, "minSeats": 20, "countRoom": 1, "sumSeats": 325 }, { "rooms_shortname": "ANGU", "maxSeats": 260, "avgSeats": 55.21, "minSeats": 16, "countRoom": 1, "sumSeats": 1546 }, { "rooms_shortname": "MATH", "maxSeats": 224, "avgSeats": 61.88, "minSeats": 25, "countRoom": 1, "sumSeats": 495 }, { "rooms_shortname": "FSC", "maxSeats": 250, "avgSeats": 62.1, "minSeats": 18, "countRoom": 1, "sumSeats": 621 }, { "rooms_shortname": "SWNG", "maxSeats": 190, "avgSeats": 64.59, "minSeats": 27, "countRoom": 1, "sumSeats": 1421 }, { "rooms_shortname": "IONA", "maxSeats": 100, "avgSeats": 75, "minSeats": 50, "countRoom": 1, "sumSeats": 150 }, { "rooms_shortname": "GEOG", "maxSeats": 225, "avgSeats": 77.38, "minSeats": 21, "countRoom": 1, "sumSeats": 619 }, { "rooms_shortname": "WOOD", "maxSeats": 503, "avgSeats": 81.06, "minSeats": 10, "countRoom": 1, "sumSeats": 1297 }, { "rooms_shortname": "MCLD", "maxSeats": 136, "avgSeats": 83.83, "minSeats": 40, "countRoom": 1, "sumSeats": 503 }, { "rooms_shortname": "BIOL", "maxSeats": 228, "avgSeats": 84, "minSeats": 16, "countRoom": 1, "sumSeats": 336 }, { "rooms_shortname": "DMP", "maxSeats": 160, "avgSeats": 88, "minSeats": 40, "countRoom": 1, "sumSeats": 440 }, { "rooms_shortname": "MATX", "maxSeats": 106, "avgSeats": 106, "minSeats": 106, "countRoom": 1, "sumSeats": 106 }, { "rooms_shortname": "HENN", "maxSeats": 257, "avgSeats": 109.67, "minSeats": 30, "countRoom": 1, "sumSeats": 658 }, { "rooms_shortname": "CHBE", "maxSeats": 200, "avgSeats": 118, "minSeats": 60, "countRoom": 1, "sumSeats": 354 }, { "rooms_shortname": "LSK", "maxSeats": 205, "avgSeats": 126.25, "minSeats": 42, "countRoom": 1, "sumSeats": 505 }, { "rooms_shortname": "HEBB", "maxSeats": 375, "avgSeats": 134.25, "minSeats": 54, "countRoom": 1, "sumSeats": 537 }, { "rooms_shortname": "AERL", "maxSeats": 144, "avgSeats": 144, "minSeats": 144, "countRoom": 1, "sumSeats": 144 }, { "rooms_shortname": "CHEM", "maxSeats": 265, "avgSeats": 152.17, "minSeats": 90, "countRoom": 1, "sumSeats": 913 }, { "rooms_shortname": "FRDM", "maxSeats": 160, "avgSeats": 160, "minSeats": 160, "countRoom": 1, "sumSeats": 160 }, { "rooms_shortname": "OSBO", "maxSeats": 442, "avgSeats": 173.67, "minSeats": 39, "countRoom": 1, "sumSeats": 521 }, { "rooms_shortname": "ESB", "maxSeats": 350, "avgSeats": 193.33, "minSeats": 80, "countRoom": 1, "sumSeats": 580 }, { "rooms_shortname": "WESB", "maxSeats": 325, "avgSeats": 213.5, "minSeats": 102, "countRoom": 1, "sumSeats": 427 }, { "rooms_shortname": "LSC", "maxSeats": 350, "avgSeats": 275, "minSeats": 125, "countRoom": 1, "sumSeats": 825 }, { "rooms_shortname": "SRC", "maxSeats": 299, "avgSeats": 299, "minSeats": 299, "countRoom": 1, "sumSeats": 897 }, { "rooms_shortname": "CIRS", "maxSeats": 426, "avgSeats": 426, "minSeats": 426, "countRoom": 1, "sumSeats": 426 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("cover toGroupUp", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat", "rooms_fullname",
                    "rooms_number", "rooms_name", "rooms_address", "rooms_type", "rooms_furniture",
                    "rooms_href", "rooms_lon", "rooms_seats"],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["numberRooms"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_lat", "rooms_fullname",
                    "rooms_number", "rooms_name", "rooms_address", "rooms_type", "rooms_furniture",
                    "rooms_href", "rooms_lon", "rooms_seats"],
                "APPLY": [{
                        "numberRooms": {
                            "COUNT": "rooms_number"
                        }
                    }]
            }
        };
        var second = [{ "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "192", "rooms_name": "IBLC_192", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-192", "rooms_lon": -123.2521, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "G65", "rooms_name": "WOOD_G65", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G65", "rooms_lon": -123.24673, "rooms_seats": 12, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "G53", "rooms_name": "WOOD_G53", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G53", "rooms_lon": -123.24673, "rooms_seats": 10, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "G41", "rooms_name": "WOOD_G41", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G41", "rooms_lon": -123.24673, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "B75", "rooms_name": "WOOD_B75", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-B75", "rooms_lon": -123.24673, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "5", "rooms_name": "WOOD_5", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-5", "rooms_lon": -123.24673, "rooms_seats": 120, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "3", "rooms_name": "WOOD_3", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-3", "rooms_lon": -123.24673, "rooms_seats": 88, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "1", "rooms_name": "WOOD_1", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-1", "rooms_lon": -123.24673, "rooms_seats": 120, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "G66", "rooms_name": "WOOD_G66", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G66", "rooms_lon": -123.24673, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "G59", "rooms_name": "WOOD_G59", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G59", "rooms_lon": -123.24673, "rooms_seats": 10, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "G55", "rooms_name": "WOOD_G55", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G55", "rooms_lon": -123.24673, "rooms_seats": 10, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "G44", "rooms_name": "WOOD_G44", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G44", "rooms_lon": -123.24673, "rooms_seats": 14, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "B79", "rooms_name": "WOOD_B79", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-B79", "rooms_lon": -123.24673, "rooms_seats": 21, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "6", "rooms_name": "WOOD_6", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-6", "rooms_lon": -123.24673, "rooms_seats": 181, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "4", "rooms_name": "WOOD_4", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-4", "rooms_lon": -123.24673, "rooms_seats": 120, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "2", "rooms_name": "WOOD_2", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-2", "rooms_lon": -123.24673, "rooms_seats": 503, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "409", "rooms_name": "SWNG_409", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-409", "rooms_lon": -123.25431, "rooms_seats": 47, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "407", "rooms_name": "SWNG_407", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-407", "rooms_lon": -123.25431, "rooms_seats": 47, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "405", "rooms_name": "SWNG_405", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-405", "rooms_lon": -123.25431, "rooms_seats": 47, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "309", "rooms_name": "SWNG_309", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-309", "rooms_lon": -123.25431, "rooms_seats": 47, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "307", "rooms_name": "SWNG_307", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-307", "rooms_lon": -123.25431, "rooms_seats": 47, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "305", "rooms_name": "SWNG_305", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-305", "rooms_lon": -123.25431, "rooms_seats": 47, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "221", "rooms_name": "SWNG_221", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-221", "rooms_lon": -123.25431, "rooms_seats": 190, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "121", "rooms_name": "SWNG_121", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-121", "rooms_lon": -123.25431, "rooms_seats": 187, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "109", "rooms_name": "SWNG_109", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-109", "rooms_lon": -123.25431, "rooms_seats": 47, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "107", "rooms_name": "SWNG_107", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-107", "rooms_lon": -123.25431, "rooms_seats": 47, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "105", "rooms_name": "SWNG_105", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-105", "rooms_lon": -123.25431, "rooms_seats": 47, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "410", "rooms_name": "SWNG_410", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-410", "rooms_lon": -123.25431, "rooms_seats": 27, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "408", "rooms_name": "SWNG_408", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-408", "rooms_lon": -123.25431, "rooms_seats": 27, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "406", "rooms_name": "SWNG_406", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-406", "rooms_lon": -123.25431, "rooms_seats": 27, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "310", "rooms_name": "SWNG_310", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-310", "rooms_lon": -123.25431, "rooms_seats": 27, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "308", "rooms_name": "SWNG_308", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-308", "rooms_lon": -123.25431, "rooms_seats": 27, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "306", "rooms_name": "SWNG_306", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-306", "rooms_lon": -123.25431, "rooms_seats": 27, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "222", "rooms_name": "SWNG_222", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-222", "rooms_lon": -123.25431, "rooms_seats": 190, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "122", "rooms_name": "SWNG_122", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-122", "rooms_lon": -123.25431, "rooms_seats": 188, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "110", "rooms_name": "SWNG_110", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-110", "rooms_lon": -123.25431, "rooms_seats": 27, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "108", "rooms_name": "SWNG_108", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-108", "rooms_lon": -123.25431, "rooms_seats": 27, "numberRooms": 1 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293, "rooms_fullname": "West Mall Swing Space", "rooms_number": "106", "rooms_name": "SWNG_106", "rooms_address": "2175 West Mall V6T 1Z4", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SWNG-106", "rooms_lon": -123.25431, "rooms_seats": 27, "numberRooms": 1 }, { "rooms_shortname": "WESB", "rooms_lat": 49.26517, "rooms_fullname": "Wesbrook", "rooms_number": "100", "rooms_name": "WESB_100", "rooms_address": "6174 University Boulevard", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WESB-100", "rooms_lon": -123.24937, "rooms_seats": 325, "numberRooms": 1 }, { "rooms_shortname": "WESB", "rooms_lat": 49.26517, "rooms_fullname": "Wesbrook", "rooms_number": "201", "rooms_name": "WESB_201", "rooms_address": "6174 University Boulevard", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WESB-201", "rooms_lon": -123.24937, "rooms_seats": 102, "numberRooms": 1 }, { "rooms_shortname": "MGYM", "rooms_lat": 49.2663, "rooms_fullname": "War Memorial Gymnasium", "rooms_number": "206", "rooms_name": "MGYM_206", "rooms_address": "6081 University Blvd", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MGYM-206", "rooms_lon": -123.2466, "rooms_seats": 25, "numberRooms": 1 }, { "rooms_shortname": "MGYM", "rooms_lat": 49.2663, "rooms_fullname": "War Memorial Gymnasium", "rooms_number": "208", "rooms_name": "MGYM_208", "rooms_address": "6081 University Blvd", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MGYM-208", "rooms_lon": -123.2466, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "UCLL", "rooms_lat": 49.26867, "rooms_fullname": "The Leon and Thea Koerner University Centre", "rooms_number": "107", "rooms_name": "UCLL_107", "rooms_address": "6331 Crescent Road V6T 1Z1", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/UCLL-107", "rooms_lon": -123.25692, "rooms_seats": 48, "numberRooms": 1 }, { "rooms_shortname": "UCLL", "rooms_lat": 49.26867, "rooms_fullname": "The Leon and Thea Koerner University Centre", "rooms_number": "101", "rooms_name": "UCLL_101", "rooms_address": "6331 Crescent Road V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/UCLL-101", "rooms_lon": -123.25692, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "UCLL", "rooms_lat": 49.26867, "rooms_fullname": "The Leon and Thea Koerner University Centre", "rooms_number": "109", "rooms_name": "UCLL_109", "rooms_address": "6331 Crescent Road V6T 1Z1", "rooms_type": "Studio Lab", "rooms_furniture": "Classroom-Learn Lab", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/UCLL-109", "rooms_lon": -123.25692, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "UCLL", "rooms_lat": 49.26867, "rooms_fullname": "The Leon and Thea Koerner University Centre", "rooms_number": "103", "rooms_name": "UCLL_103", "rooms_address": "6331 Crescent Road V6T 1Z1", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/UCLL-103", "rooms_lon": -123.25692, "rooms_seats": 55, "numberRooms": 1 }, { "rooms_shortname": "SRC", "rooms_lat": 49.2683, "rooms_fullname": "Student Recreation Centre", "rooms_number": "220C", "rooms_name": "SRC_220C", "rooms_address": "6000 Student Union Blvd", "rooms_type": "TBD", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SRC-220C", "rooms_lon": -123.24894, "rooms_seats": 299, "numberRooms": 1 }, { "rooms_shortname": "SRC", "rooms_lat": 49.2683, "rooms_fullname": "Student Recreation Centre", "rooms_number": "220A", "rooms_name": "SRC_220A", "rooms_address": "6000 Student Union Blvd", "rooms_type": "TBD", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SRC-220A", "rooms_lon": -123.24894, "rooms_seats": 299, "numberRooms": 1 }, { "rooms_shortname": "SRC", "rooms_lat": 49.2683, "rooms_fullname": "Student Recreation Centre", "rooms_number": "220B", "rooms_name": "SRC_220B", "rooms_address": "6000 Student Union Blvd", "rooms_type": "TBD", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SRC-220B", "rooms_lon": -123.24894, "rooms_seats": 299, "numberRooms": 1 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642, "rooms_fullname": "School of Population and Public Health", "rooms_number": "B138", "rooms_name": "SPPH_B138", "rooms_address": "2206 East Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SPPH-B138", "rooms_lon": -123.24842, "rooms_seats": 14, "numberRooms": 1 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642, "rooms_fullname": "School of Population and Public Health", "rooms_number": "B112", "rooms_name": "SPPH_B112", "rooms_address": "2206 East Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SPPH-B112", "rooms_lon": -123.24842, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642, "rooms_fullname": "School of Population and Public Health", "rooms_number": "143", "rooms_name": "SPPH_143", "rooms_address": "2206 East Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SPPH-143", "rooms_lon": -123.24842, "rooms_seats": 28, "numberRooms": 1 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642, "rooms_fullname": "School of Population and Public Health", "rooms_number": "B151", "rooms_name": "SPPH_B151", "rooms_address": "2206 East Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SPPH-B151", "rooms_lon": -123.24842, "rooms_seats": 66, "numberRooms": 1 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642, "rooms_fullname": "School of Population and Public Health", "rooms_number": "B136", "rooms_name": "SPPH_B136", "rooms_address": "2206 East Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SPPH-B136", "rooms_lon": -123.24842, "rooms_seats": 12, "numberRooms": 1 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642, "rooms_fullname": "School of Population and Public Health", "rooms_number": "B108", "rooms_name": "SPPH_B108", "rooms_address": "2206 East Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SPPH-B108", "rooms_lon": -123.24842, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "OSBO", "rooms_lat": 49.26047, "rooms_fullname": "Robert F. Osborne Centre", "rooms_number": "A", "rooms_name": "OSBO_A", "rooms_address": "6108 Thunderbird Boulevard", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/OSBO-A", "rooms_lon": -123.24467, "rooms_seats": 442, "numberRooms": 1 }, { "rooms_shortname": "OSBO", "rooms_lat": 49.26047, "rooms_fullname": "Robert F. Osborne Centre", "rooms_number": "203A", "rooms_name": "OSBO_203A", "rooms_address": "6108 Thunderbird Boulevard", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/OSBO-203A", "rooms_lon": -123.24467, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "OSBO", "rooms_lat": 49.26047, "rooms_fullname": "Robert F. Osborne Centre", "rooms_number": "203B", "rooms_name": "OSBO_203B", "rooms_address": "6108 Thunderbird Boulevard", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/OSBO-203B", "rooms_lon": -123.24467, "rooms_seats": 39, "numberRooms": 1 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264, "rooms_fullname": "Ponderosa Commons: Oak House", "rooms_number": "1215", "rooms_name": "PCOH_1215", "rooms_address": "6445 University Boulevard", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1215", "rooms_lon": -123.2559, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264, "rooms_fullname": "Ponderosa Commons: Oak House", "rooms_number": "1009", "rooms_name": "PCOH_1009", "rooms_address": "6445 University Boulevard", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1009", "rooms_lon": -123.2559, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264, "rooms_fullname": "Ponderosa Commons: Oak House", "rooms_number": "1003", "rooms_name": "PCOH_1003", "rooms_address": "6445 University Boulevard", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1003", "rooms_lon": -123.2559, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264, "rooms_fullname": "Ponderosa Commons: Oak House", "rooms_number": "1001", "rooms_name": "PCOH_1001", "rooms_address": "6445 University Boulevard", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1001", "rooms_lon": -123.2559, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264, "rooms_fullname": "Ponderosa Commons: Oak House", "rooms_number": "1302", "rooms_name": "PCOH_1302", "rooms_address": "6445 University Boulevard", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1302", "rooms_lon": -123.2559, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264, "rooms_fullname": "Ponderosa Commons: Oak House", "rooms_number": "1011", "rooms_name": "PCOH_1011", "rooms_address": "6445 University Boulevard", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1011", "rooms_lon": -123.2559, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264, "rooms_fullname": "Ponderosa Commons: Oak House", "rooms_number": "1008", "rooms_name": "PCOH_1008", "rooms_address": "6445 University Boulevard", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1008", "rooms_lon": -123.2559, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264, "rooms_fullname": "Ponderosa Commons: Oak House", "rooms_number": "1002", "rooms_name": "PCOH_1002", "rooms_address": "6445 University Boulevard", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PCOH-1002", "rooms_lon": -123.2559, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229, "rooms_fullname": "Pharmaceutical Sciences Building", "rooms_number": "3208", "rooms_name": "PHRM_3208", "rooms_address": "2405 Wesbrook Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3208", "rooms_lon": -123.24342, "rooms_seats": 72, "numberRooms": 1 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229, "rooms_fullname": "Pharmaceutical Sciences Building", "rooms_number": "3122", "rooms_name": "PHRM_3122", "rooms_address": "2405 Wesbrook Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3122", "rooms_lon": -123.24342, "rooms_seats": 7, "numberRooms": 1 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229, "rooms_fullname": "Pharmaceutical Sciences Building", "rooms_number": "3118", "rooms_name": "PHRM_3118", "rooms_address": "2405 Wesbrook Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3118", "rooms_lon": -123.24342, "rooms_seats": 7, "numberRooms": 1 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229, "rooms_fullname": "Pharmaceutical Sciences Building", "rooms_number": "3115", "rooms_name": "PHRM_3115", "rooms_address": "2405 Wesbrook Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3115", "rooms_lon": -123.24342, "rooms_seats": 7, "numberRooms": 1 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229, "rooms_fullname": "Pharmaceutical Sciences Building", "rooms_number": "3112", "rooms_name": "PHRM_3112", "rooms_address": "2405 Wesbrook Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3112", "rooms_lon": -123.24342, "rooms_seats": 7, "numberRooms": 1 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229, "rooms_fullname": "Pharmaceutical Sciences Building", "rooms_number": "1101", "rooms_name": "PHRM_1101", "rooms_address": "2405 Wesbrook Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-1101", "rooms_lon": -123.24342, "rooms_seats": 236, "numberRooms": 1 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229, "rooms_fullname": "Pharmaceutical Sciences Building", "rooms_number": "3124", "rooms_name": "PHRM_3124", "rooms_address": "2405 Wesbrook Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3124", "rooms_lon": -123.24342, "rooms_seats": 7, "numberRooms": 1 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229, "rooms_fullname": "Pharmaceutical Sciences Building", "rooms_number": "3120", "rooms_name": "PHRM_3120", "rooms_address": "2405 Wesbrook Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3120", "rooms_lon": -123.24342, "rooms_seats": 7, "numberRooms": 1 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229, "rooms_fullname": "Pharmaceutical Sciences Building", "rooms_number": "3116", "rooms_name": "PHRM_3116", "rooms_address": "2405 Wesbrook Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3116", "rooms_lon": -123.24342, "rooms_seats": 14, "numberRooms": 1 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229, "rooms_fullname": "Pharmaceutical Sciences Building", "rooms_number": "3114", "rooms_name": "PHRM_3114", "rooms_address": "2405 Wesbrook Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-3114", "rooms_lon": -123.24342, "rooms_seats": 7, "numberRooms": 1 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229, "rooms_fullname": "Pharmaceutical Sciences Building", "rooms_number": "1201", "rooms_name": "PHRM_1201", "rooms_address": "2405 Wesbrook Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/PHRM-1201", "rooms_lon": -123.24342, "rooms_seats": 167, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "4074", "rooms_name": "ORCH_4074", "rooms_address": "6363 Agronomy Road", "rooms_type": "Studio Lab", "rooms_furniture": "Classroom-Learn Lab", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4074", "rooms_lon": -123.24944, "rooms_seats": 72, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "4068", "rooms_name": "ORCH_4068", "rooms_address": "6363 Agronomy Road", "rooms_type": "Active Learning", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4068", "rooms_lon": -123.24944, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "4058", "rooms_name": "ORCH_4058", "rooms_address": "6363 Agronomy Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4058", "rooms_lon": -123.24944, "rooms_seats": 25, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "4018", "rooms_name": "ORCH_4018", "rooms_address": "6363 Agronomy Road", "rooms_type": "Active Learning", "rooms_furniture": "Classroom-Hybrid Furniture", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4018", "rooms_lon": -123.24944, "rooms_seats": 48, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "4004", "rooms_name": "ORCH_4004", "rooms_address": "6363 Agronomy Road", "rooms_type": "Active Learning", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4004", "rooms_lon": -123.24944, "rooms_seats": 25, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "3074", "rooms_name": "ORCH_3074", "rooms_address": "6363 Agronomy Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3074", "rooms_lon": -123.24944, "rooms_seats": 72, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "3068", "rooms_name": "ORCH_3068", "rooms_address": "6363 Agronomy Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3068", "rooms_lon": -123.24944, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "3058", "rooms_name": "ORCH_3058", "rooms_address": "6363 Agronomy Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3058", "rooms_lon": -123.24944, "rooms_seats": 25, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "3018", "rooms_name": "ORCH_3018", "rooms_address": "6363 Agronomy Road", "rooms_type": "Studio Lab", "rooms_furniture": "Classroom-Learn Lab", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3018", "rooms_lon": -123.24944, "rooms_seats": 48, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "3004", "rooms_name": "ORCH_3004", "rooms_address": "6363 Agronomy Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Hybrid Furniture", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3004", "rooms_lon": -123.24944, "rooms_seats": 25, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "1001", "rooms_name": "ORCH_1001", "rooms_address": "6363 Agronomy Road", "rooms_type": "Active Learning", "rooms_furniture": "Classroom-Hybrid Furniture", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-1001", "rooms_lon": -123.24944, "rooms_seats": 72, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "4072", "rooms_name": "ORCH_4072", "rooms_address": "6363 Agronomy Road", "rooms_type": "Active Learning", "rooms_furniture": "Classroom-Hybrid Furniture", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4072", "rooms_lon": -123.24944, "rooms_seats": 20, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "4062", "rooms_name": "ORCH_4062", "rooms_address": "6363 Agronomy Road", "rooms_type": "Active Learning", "rooms_furniture": "Classroom-Hybrid Furniture", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4062", "rooms_lon": -123.24944, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "4052", "rooms_name": "ORCH_4052", "rooms_address": "6363 Agronomy Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Hybrid Furniture", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4052", "rooms_lon": -123.24944, "rooms_seats": 25, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "4016", "rooms_name": "ORCH_4016", "rooms_address": "6363 Agronomy Road", "rooms_type": "Active Learning", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4016", "rooms_lon": -123.24944, "rooms_seats": 25, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "4002", "rooms_name": "ORCH_4002", "rooms_address": "6363 Agronomy Road", "rooms_type": "Active Learning", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-4002", "rooms_lon": -123.24944, "rooms_seats": 25, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "3072", "rooms_name": "ORCH_3072", "rooms_address": "6363 Agronomy Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3072", "rooms_lon": -123.24944, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "3062", "rooms_name": "ORCH_3062", "rooms_address": "6363 Agronomy Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3062", "rooms_lon": -123.24944, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "3052", "rooms_name": "ORCH_3052", "rooms_address": "6363 Agronomy Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Hybrid Furniture", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3052", "rooms_lon": -123.24944, "rooms_seats": 25, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "3016", "rooms_name": "ORCH_3016", "rooms_address": "6363 Agronomy Road", "rooms_type": "Active Learning", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3016", "rooms_lon": -123.24944, "rooms_seats": 25, "numberRooms": 1 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048, "rooms_fullname": "Orchard Commons", "rooms_number": "3002", "rooms_name": "ORCH_3002", "rooms_address": "6363 Agronomy Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ORCH-3002", "rooms_lon": -123.24944, "rooms_seats": 25, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "209", "rooms_name": "SCRF_209", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-209", "rooms_lon": -123.2531, "rooms_seats": 60, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "207", "rooms_name": "SCRF_207", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-207", "rooms_lon": -123.2531, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "205", "rooms_name": "SCRF_205", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-205", "rooms_lon": -123.2531, "rooms_seats": 34, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "204", "rooms_name": "SCRF_204", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-204", "rooms_lon": -123.2531, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "202", "rooms_name": "SCRF_202", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-202", "rooms_lon": -123.2531, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "200", "rooms_name": "SCRF_200", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-200", "rooms_lon": -123.2531, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "1024", "rooms_name": "SCRF_1024", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1024", "rooms_lon": -123.2531, "rooms_seats": 20, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "1022", "rooms_name": "SCRF_1022", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1022", "rooms_lon": -123.2531, "rooms_seats": 20, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "1020", "rooms_name": "SCRF_1020", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1020", "rooms_lon": -123.2531, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "1004", "rooms_name": "SCRF_1004", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1004", "rooms_lon": -123.2531, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "100", "rooms_name": "SCRF_100", "rooms_address": "2125 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-100", "rooms_lon": -123.2531, "rooms_seats": 280, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "210", "rooms_name": "SCRF_210", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-210", "rooms_lon": -123.2531, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "208", "rooms_name": "SCRF_208", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-208", "rooms_lon": -123.2531, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "206", "rooms_name": "SCRF_206", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-206", "rooms_lon": -123.2531, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "204A", "rooms_name": "SCRF_204A", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-204A", "rooms_lon": -123.2531, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "203", "rooms_name": "SCRF_203", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-203", "rooms_lon": -123.2531, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "201", "rooms_name": "SCRF_201", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-201", "rooms_lon": -123.2531, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "1328", "rooms_name": "SCRF_1328", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1328", "rooms_lon": -123.2531, "rooms_seats": 38, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "1023", "rooms_name": "SCRF_1023", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1023", "rooms_lon": -123.2531, "rooms_seats": 20, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "1021", "rooms_name": "SCRF_1021", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1021", "rooms_lon": -123.2531, "rooms_seats": 20, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "1005", "rooms_name": "SCRF_1005", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1005", "rooms_lon": -123.2531, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398, "rooms_fullname": "Neville Scarfe", "rooms_number": "1003", "rooms_name": "SCRF_1003", "rooms_address": "2125 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SCRF-1003", "rooms_lon": -123.2531, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "MATX", "rooms_lat": 49.266089, "rooms_fullname": "Mathematics Annex", "rooms_number": "1100", "rooms_name": "MATX_1100", "rooms_address": "1986 Mathematics Road", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATX-1100", "rooms_lon": -123.254816, "rooms_seats": 106, "numberRooms": 1 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463, "rooms_fullname": "Mathematics", "rooms_number": "204", "rooms_name": "MATH_204", "rooms_address": "1984 Mathematics Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-204", "rooms_lon": -123.255534, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463, "rooms_fullname": "Mathematics", "rooms_number": "202", "rooms_name": "MATH_202", "rooms_address": "1984 Mathematics Road", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-202", "rooms_lon": -123.255534, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463, "rooms_fullname": "Mathematics", "rooms_number": "104", "rooms_name": "MATH_104", "rooms_address": "1984 Mathematics Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-104", "rooms_lon": -123.255534, "rooms_seats": 48, "numberRooms": 1 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463, "rooms_fullname": "Mathematics", "rooms_number": "100", "rooms_name": "MATH_100", "rooms_address": "1984 Mathematics Road", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-100", "rooms_lon": -123.255534, "rooms_seats": 224, "numberRooms": 1 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463, "rooms_fullname": "Mathematics", "rooms_number": "225", "rooms_name": "MATH_225", "rooms_address": "1984 Mathematics Road", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-225", "rooms_lon": -123.255534, "rooms_seats": 25, "numberRooms": 1 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463, "rooms_fullname": "Mathematics", "rooms_number": "203", "rooms_name": "MATH_203", "rooms_address": "1984 Mathematics Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-203", "rooms_lon": -123.255534, "rooms_seats": 48, "numberRooms": 1 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463, "rooms_fullname": "Mathematics", "rooms_number": "105", "rooms_name": "MATH_105", "rooms_address": "1984 Mathematics Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-105", "rooms_lon": -123.255534, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463, "rooms_fullname": "Mathematics", "rooms_number": "102", "rooms_name": "MATH_102", "rooms_address": "1984 Mathematics Road", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MATH-102", "rooms_lon": -123.255534, "rooms_seats": 60, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "360M", "rooms_name": "MCML_360M", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360M", "rooms_lon": -123.25027, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "360K", "rooms_name": "MCML_360K", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360K", "rooms_lon": -123.25027, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "360H", "rooms_name": "MCML_360H", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360H", "rooms_lon": -123.25027, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "360F", "rooms_name": "MCML_360F", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360F", "rooms_lon": -123.25027, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "360D", "rooms_name": "MCML_360D", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360D", "rooms_lon": -123.25027, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "360B", "rooms_name": "MCML_360B", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360B", "rooms_lon": -123.25027, "rooms_seats": 6, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "358", "rooms_name": "MCML_358", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-358", "rooms_lon": -123.25027, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "256", "rooms_name": "MCML_256", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-256", "rooms_lon": -123.25027, "rooms_seats": 32, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "160", "rooms_name": "MCML_160", "rooms_address": "2357 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-160", "rooms_lon": -123.25027, "rooms_seats": 72, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "154", "rooms_name": "MCML_154", "rooms_address": "2357 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-154", "rooms_lon": -123.25027, "rooms_seats": 47, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "360L", "rooms_name": "MCML_360L", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360L", "rooms_lon": -123.25027, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "360J", "rooms_name": "MCML_360J", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360J", "rooms_lon": -123.25027, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "360G", "rooms_name": "MCML_360G", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360G", "rooms_lon": -123.25027, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "360E", "rooms_name": "MCML_360E", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360E", "rooms_lon": -123.25027, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "360C", "rooms_name": "MCML_360C", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360C", "rooms_lon": -123.25027, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "360A", "rooms_name": "MCML_360A", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-360A", "rooms_lon": -123.25027, "rooms_seats": 6, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "260", "rooms_name": "MCML_260", "rooms_address": "2357 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-260", "rooms_lon": -123.25027, "rooms_seats": 32, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "166", "rooms_name": "MCML_166", "rooms_address": "2357 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-166", "rooms_lon": -123.25027, "rooms_seats": 200, "numberRooms": 1 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114, "rooms_fullname": "MacMillan", "rooms_number": "158", "rooms_name": "MCML_158", "rooms_address": "2357 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCML-158", "rooms_lon": -123.25027, "rooms_seats": 74, "numberRooms": 1 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176, "rooms_fullname": "MacLeod", "rooms_number": "242", "rooms_name": "MCLD_242", "rooms_address": "2356 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCLD-242", "rooms_lon": -123.24935, "rooms_seats": 60, "numberRooms": 1 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176, "rooms_fullname": "MacLeod", "rooms_number": "220", "rooms_name": "MCLD_220", "rooms_address": "2356 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCLD-220", "rooms_lon": -123.24935, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176, "rooms_fullname": "MacLeod", "rooms_number": "202", "rooms_name": "MCLD_202", "rooms_address": "2356 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCLD-202", "rooms_lon": -123.24935, "rooms_seats": 123, "numberRooms": 1 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176, "rooms_fullname": "MacLeod", "rooms_number": "254", "rooms_name": "MCLD_254", "rooms_address": "2356 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCLD-254", "rooms_lon": -123.24935, "rooms_seats": 84, "numberRooms": 1 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176, "rooms_fullname": "MacLeod", "rooms_number": "228", "rooms_name": "MCLD_228", "rooms_address": "2356 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCLD-228", "rooms_lon": -123.24935, "rooms_seats": 136, "numberRooms": 1 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176, "rooms_fullname": "MacLeod", "rooms_number": "214", "rooms_name": "MCLD_214", "rooms_address": "2356 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/MCLD-214", "rooms_lon": -123.24935, "rooms_seats": 60, "numberRooms": 1 }, { "rooms_shortname": "LSC", "rooms_lat": 49.26236, "rooms_fullname": "Life Sciences Centre", "rooms_number": "1003", "rooms_name": "LSC_1003", "rooms_address": "2350 Health Sciences Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSC-1003", "rooms_lon": -123.24494, "rooms_seats": 125, "numberRooms": 1 }, { "rooms_shortname": "LSC", "rooms_lat": 49.26236, "rooms_fullname": "Life Sciences Centre", "rooms_number": "1001", "rooms_name": "LSC_1001", "rooms_address": "2350 Health Sciences Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSC-1001", "rooms_lon": -123.24494, "rooms_seats": 350, "numberRooms": 1 }, { "rooms_shortname": "LSC", "rooms_lat": 49.26236, "rooms_fullname": "Life Sciences Centre", "rooms_number": "1002", "rooms_name": "LSC_1002", "rooms_address": "2350 Health Sciences Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSC-1002", "rooms_lon": -123.24494, "rooms_seats": 350, "numberRooms": 1 }, { "rooms_shortname": "LSK", "rooms_lat": 49.26545, "rooms_fullname": "Leonard S. Klinck (also known as CSCI)", "rooms_number": "460", "rooms_name": "LSK_460", "rooms_address": "6356 Agricultural Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSK-460", "rooms_lon": -123.25533, "rooms_seats": 75, "numberRooms": 1 }, { "rooms_shortname": "LSK", "rooms_lat": 49.26545, "rooms_fullname": "Leonard S. Klinck (also known as CSCI)", "rooms_number": "200", "rooms_name": "LSK_200", "rooms_address": "6356 Agricultural Road", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSK-200", "rooms_lon": -123.25533, "rooms_seats": 205, "numberRooms": 1 }, { "rooms_shortname": "LSK", "rooms_lat": 49.26545, "rooms_fullname": "Leonard S. Klinck (also known as CSCI)", "rooms_number": "462", "rooms_name": "LSK_462", "rooms_address": "6356 Agricultural Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSK-462", "rooms_lon": -123.25533, "rooms_seats": 42, "numberRooms": 1 }, { "rooms_shortname": "LSK", "rooms_lat": 49.26545, "rooms_fullname": "Leonard S. Klinck (also known as CSCI)", "rooms_number": "201", "rooms_name": "LSK_201", "rooms_address": "6356 Agricultural Road", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LSK-201", "rooms_lon": -123.25533, "rooms_seats": 183, "numberRooms": 1 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643, "rooms_fullname": "Jack Bell Building for the School of Social Work", "rooms_number": "326", "rooms_name": "SOWK_326", "rooms_address": "2080 West Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-326", "rooms_lon": -123.25505, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643, "rooms_fullname": "Jack Bell Building for the School of Social Work", "rooms_number": "224", "rooms_name": "SOWK_224", "rooms_address": "2080 West Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-224", "rooms_lon": -123.25505, "rooms_seats": 31, "numberRooms": 1 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643, "rooms_fullname": "Jack Bell Building for the School of Social Work", "rooms_number": "222", "rooms_name": "SOWK_222", "rooms_address": "2080 West Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-222", "rooms_lon": -123.25505, "rooms_seats": 29, "numberRooms": 1 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643, "rooms_fullname": "Jack Bell Building for the School of Social Work", "rooms_number": "122", "rooms_name": "SOWK_122", "rooms_address": "2080 West Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-122", "rooms_lon": -123.25505, "rooms_seats": 12, "numberRooms": 1 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643, "rooms_fullname": "Jack Bell Building for the School of Social Work", "rooms_number": "324", "rooms_name": "SOWK_324", "rooms_address": "2080 West Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-324", "rooms_lon": -123.25505, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643, "rooms_fullname": "Jack Bell Building for the School of Social Work", "rooms_number": "223", "rooms_name": "SOWK_223", "rooms_address": "2080 West Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-223", "rooms_lon": -123.25505, "rooms_seats": 29, "numberRooms": 1 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643, "rooms_fullname": "Jack Bell Building for the School of Social Work", "rooms_number": "124", "rooms_name": "SOWK_124", "rooms_address": "2080 West Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/SOWK-124", "rooms_lon": -123.25505, "rooms_seats": 68, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "460", "rooms_name": "IBLC_460", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-460", "rooms_lon": -123.2521, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "265", "rooms_name": "IBLC_265", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-265", "rooms_lon": -123.2521, "rooms_seats": 10, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "263", "rooms_name": "IBLC_263", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-263", "rooms_lon": -123.2521, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "195", "rooms_name": "IBLC_195", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-195", "rooms_lon": -123.2521, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "193", "rooms_name": "IBLC_193", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-193", "rooms_lon": -123.2521, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "191", "rooms_name": "IBLC_191", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-191", "rooms_lon": -123.2521, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "182", "rooms_name": "IBLC_182", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-182", "rooms_lon": -123.2521, "rooms_seats": 154, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "157", "rooms_name": "IBLC_157", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-157", "rooms_lon": -123.2521, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "155", "rooms_name": "IBLC_155", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-155", "rooms_lon": -123.2521, "rooms_seats": 50, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "461", "rooms_name": "IBLC_461", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-461", "rooms_lon": -123.2521, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "266", "rooms_name": "IBLC_266", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-266", "rooms_lon": -123.2521, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "264", "rooms_name": "IBLC_264", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-264", "rooms_lon": -123.2521, "rooms_seats": 12, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "261", "rooms_name": "IBLC_261", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-261", "rooms_lon": -123.2521, "rooms_seats": 112, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "194", "rooms_name": "IBLC_194", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-194", "rooms_lon": -123.2521, "rooms_seats": 8, "numberRooms": 1 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478, "rooms_fullname": "Woodward (Instructional Resources Centre-IRC)", "rooms_number": "G57", "rooms_name": "WOOD_G57", "rooms_address": "2194 Health Sciences Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/WOOD-G57", "rooms_lon": -123.24673, "rooms_seats": 12, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "185", "rooms_name": "IBLC_185", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-185", "rooms_lon": -123.2521, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "158", "rooms_name": "IBLC_158", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-158", "rooms_lon": -123.2521, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766, "rooms_fullname": "Irving K Barber Learning Centre", "rooms_number": "156", "rooms_name": "IBLC_156", "rooms_address": "1961 East Mall V6T 1Z1", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IBLC-156", "rooms_lon": -123.2521, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "IONA", "rooms_lat": 49.27106, "rooms_fullname": "Iona Building", "rooms_number": "301", "rooms_name": "IONA_301", "rooms_address": "6000 Iona Drive", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IONA-301", "rooms_lon": -123.25042, "rooms_seats": 100, "numberRooms": 1 }, { "rooms_shortname": "IONA", "rooms_lat": 49.27106, "rooms_fullname": "Iona Building", "rooms_number": "633", "rooms_name": "IONA_633", "rooms_address": "6000 Iona Drive", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/IONA-633", "rooms_lon": -123.25042, "rooms_seats": 50, "numberRooms": 1 }, { "rooms_shortname": "DMP", "rooms_lat": 49.26125, "rooms_fullname": "Hugh Dempster Pavilion", "rooms_number": "310", "rooms_name": "DMP_310", "rooms_address": "6245 Agronomy Road V6T 1Z4", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-310", "rooms_lon": -123.24807, "rooms_seats": 160, "numberRooms": 1 }, { "rooms_shortname": "DMP", "rooms_lat": 49.26125, "rooms_fullname": "Hugh Dempster Pavilion", "rooms_number": "201", "rooms_name": "DMP_201", "rooms_address": "6245 Agronomy Road V6T 1Z4", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-201", "rooms_lon": -123.24807, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "DMP", "rooms_lat": 49.26125, "rooms_fullname": "Hugh Dempster Pavilion", "rooms_number": "101", "rooms_name": "DMP_101", "rooms_address": "6245 Agronomy Road V6T 1Z4", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-101", "rooms_lon": -123.24807, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "DMP", "rooms_lat": 49.26125, "rooms_fullname": "Hugh Dempster Pavilion", "rooms_number": "301", "rooms_name": "DMP_301", "rooms_address": "6245 Agronomy Road V6T 1Z4", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-301", "rooms_lon": -123.24807, "rooms_seats": 80, "numberRooms": 1 }, { "rooms_shortname": "DMP", "rooms_lat": 49.26125, "rooms_fullname": "Hugh Dempster Pavilion", "rooms_number": "110", "rooms_name": "DMP_110", "rooms_address": "6245 Agronomy Road V6T 1Z4", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/DMP-110", "rooms_lon": -123.24807, "rooms_seats": 120, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "435", "rooms_name": "ANGU_435", "rooms_address": "2053 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-435", "rooms_lon": -123.25364, "rooms_seats": 53, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "432", "rooms_name": "ANGU_432", "rooms_address": "2053 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-432", "rooms_lon": -123.25364, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "350", "rooms_name": "ANGU_350", "rooms_address": "2053 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-350", "rooms_lon": -123.25364, "rooms_seats": 58, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "345", "rooms_name": "ANGU_345", "rooms_address": "2053 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-345", "rooms_lon": -123.25364, "rooms_seats": 68, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "339", "rooms_name": "ANGU_339", "rooms_address": "2053 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-339", "rooms_lon": -123.25364, "rooms_seats": 20, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "334", "rooms_name": "ANGU_334", "rooms_address": "2053 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-334", "rooms_lon": -123.25364, "rooms_seats": 60, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "296", "rooms_name": "ANGU_296", "rooms_address": "2053 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-296", "rooms_lon": -123.25364, "rooms_seats": 37, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "293", "rooms_name": "ANGU_293", "rooms_address": "2053 Main Mall", "rooms_type": "TBD", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-293", "rooms_lon": -123.25364, "rooms_seats": 32, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "291", "rooms_name": "ANGU_291", "rooms_address": "2053 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-291", "rooms_lon": -123.25364, "rooms_seats": 54, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "243", "rooms_name": "ANGU_243", "rooms_address": "2053 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-243", "rooms_lon": -123.25364, "rooms_seats": 68, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "237", "rooms_name": "ANGU_237", "rooms_address": "2053 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-237", "rooms_lon": -123.25364, "rooms_seats": 41, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "234", "rooms_name": "ANGU_234", "rooms_address": "2053 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-234", "rooms_lon": -123.25364, "rooms_seats": 60, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "098", "rooms_name": "ANGU_098", "rooms_address": "2053 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-098", "rooms_lon": -123.25364, "rooms_seats": 260, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "037", "rooms_name": "ANGU_037", "rooms_address": "2053 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-037", "rooms_lon": -123.25364, "rooms_seats": 54, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "437", "rooms_name": "ANGU_437", "rooms_address": "2053 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-437", "rooms_lon": -123.25364, "rooms_seats": 32, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "434", "rooms_name": "ANGU_434", "rooms_address": "2053 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-434", "rooms_lon": -123.25364, "rooms_seats": 44, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "354", "rooms_name": "ANGU_354", "rooms_address": "2053 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-354", "rooms_lon": -123.25364, "rooms_seats": 44, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "347", "rooms_name": "ANGU_347", "rooms_address": "2053 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-347", "rooms_lon": -123.25364, "rooms_seats": 70, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "343", "rooms_name": "ANGU_343", "rooms_address": "2053 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-343", "rooms_lon": -123.25364, "rooms_seats": 68, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "335", "rooms_name": "ANGU_335", "rooms_address": "2053 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-335", "rooms_lon": -123.25364, "rooms_seats": 41, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "332", "rooms_name": "ANGU_332", "rooms_address": "2053 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-332", "rooms_lon": -123.25364, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "295", "rooms_name": "ANGU_295", "rooms_address": "2053 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-295", "rooms_lon": -123.25364, "rooms_seats": 54, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "292", "rooms_name": "ANGU_292", "rooms_address": "2053 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-292", "rooms_lon": -123.25364, "rooms_seats": 35, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "254", "rooms_name": "ANGU_254", "rooms_address": "2053 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-254", "rooms_lon": -123.25364, "rooms_seats": 80, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "241", "rooms_name": "ANGU_241", "rooms_address": "2053 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-241", "rooms_lon": -123.25364, "rooms_seats": 70, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "235", "rooms_name": "ANGU_235", "rooms_address": "2053 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-235", "rooms_lon": -123.25364, "rooms_seats": 41, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "232", "rooms_name": "ANGU_232", "rooms_address": "2053 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-232", "rooms_lon": -123.25364, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486, "rooms_fullname": "Henry Angus", "rooms_number": "039", "rooms_name": "ANGU_039", "rooms_address": "2053 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANGU-039", "rooms_lon": -123.25364, "rooms_seats": 54, "numberRooms": 1 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627, "rooms_fullname": "Hennings", "rooms_number": "302", "rooms_name": "HENN_302", "rooms_address": "6224 Agricultural Road", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HENN-302", "rooms_lon": -123.25374, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627, "rooms_fullname": "Hennings", "rooms_number": "202", "rooms_name": "HENN_202", "rooms_address": "6224 Agricultural Road", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HENN-202", "rooms_lon": -123.25374, "rooms_seats": 150, "numberRooms": 1 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627, "rooms_fullname": "Hennings", "rooms_number": "200", "rooms_name": "HENN_200", "rooms_address": "6224 Agricultural Road", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HENN-200", "rooms_lon": -123.25374, "rooms_seats": 257, "numberRooms": 1 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627, "rooms_fullname": "Hennings", "rooms_number": "304", "rooms_name": "HENN_304", "rooms_address": "6224 Agricultural Road", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HENN-304", "rooms_lon": -123.25374, "rooms_seats": 36, "numberRooms": 1 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627, "rooms_fullname": "Hennings", "rooms_number": "301", "rooms_name": "HENN_301", "rooms_address": "6224 Agricultural Road", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HENN-301", "rooms_lon": -123.25374, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627, "rooms_fullname": "Hennings", "rooms_number": "201", "rooms_name": "HENN_201", "rooms_address": "6224 Agricultural Road", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HENN-201", "rooms_lon": -123.25374, "rooms_seats": 155, "numberRooms": 1 }, { "rooms_shortname": "HEBB", "rooms_lat": 49.2661, "rooms_fullname": "Hebb", "rooms_number": "12", "rooms_name": "HEBB_12", "rooms_address": "2045 East Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HEBB-12", "rooms_lon": -123.25165, "rooms_seats": 54, "numberRooms": 1 }, { "rooms_shortname": "HEBB", "rooms_lat": 49.2661, "rooms_fullname": "Hebb", "rooms_number": "10", "rooms_name": "HEBB_10", "rooms_address": "2045 East Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HEBB-10", "rooms_lon": -123.25165, "rooms_seats": 54, "numberRooms": 1 }, { "rooms_shortname": "HEBB", "rooms_lat": 49.2661, "rooms_fullname": "Hebb", "rooms_number": "13", "rooms_name": "HEBB_13", "rooms_address": "2045 East Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HEBB-13", "rooms_lon": -123.25165, "rooms_seats": 54, "numberRooms": 1 }, { "rooms_shortname": "HEBB", "rooms_lat": 49.2661, "rooms_fullname": "Hebb", "rooms_number": "100", "rooms_name": "HEBB_100", "rooms_address": "2045 East Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/HEBB-100", "rooms_lon": -123.25165, "rooms_seats": 375, "numberRooms": 1 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605, "rooms_fullname": "Geography", "rooms_number": "214", "rooms_name": "GEOG_214", "rooms_address": "1984 West Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-214", "rooms_lon": -123.25623, "rooms_seats": 39, "numberRooms": 1 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605, "rooms_fullname": "Geography", "rooms_number": "201", "rooms_name": "GEOG_201", "rooms_address": "1984 West Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-201", "rooms_lon": -123.25623, "rooms_seats": 42, "numberRooms": 1 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605, "rooms_fullname": "Geography", "rooms_number": "147", "rooms_name": "GEOG_147", "rooms_address": "1984 West Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-147", "rooms_lon": -123.25623, "rooms_seats": 60, "numberRooms": 1 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605, "rooms_fullname": "Geography", "rooms_number": "100", "rooms_name": "GEOG_100", "rooms_address": "1984 West Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-100", "rooms_lon": -123.25623, "rooms_seats": 225, "numberRooms": 1 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605, "rooms_fullname": "Geography", "rooms_number": "242", "rooms_name": "GEOG_242", "rooms_address": "1984 West Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-242", "rooms_lon": -123.25623, "rooms_seats": 21, "numberRooms": 1 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605, "rooms_fullname": "Geography", "rooms_number": "212", "rooms_name": "GEOG_212", "rooms_address": "1984 West Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-212", "rooms_lon": -123.25623, "rooms_seats": 72, "numberRooms": 1 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605, "rooms_fullname": "Geography", "rooms_number": "200", "rooms_name": "GEOG_200", "rooms_address": "1984 West Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-200", "rooms_lon": -123.25623, "rooms_seats": 100, "numberRooms": 1 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605, "rooms_fullname": "Geography", "rooms_number": "101", "rooms_name": "GEOG_101", "rooms_address": "1984 West Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/GEOG-101", "rooms_lon": -123.25623, "rooms_seats": 60, "numberRooms": 1 }, { "rooms_shortname": "FRDM", "rooms_lat": 49.26541, "rooms_fullname": "Friedman Building", "rooms_number": "153", "rooms_name": "FRDM_153", "rooms_address": "2177 Wesbrook Mall V6T 1Z3", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FRDM-153", "rooms_lon": -123.24608, "rooms_seats": 160, "numberRooms": 1 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767, "rooms_fullname": "Frederic Lasserre", "rooms_number": "211", "rooms_name": "LASR_211", "rooms_address": "6333 Memorial Road", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LASR-211", "rooms_lon": -123.25583, "rooms_seats": 20, "numberRooms": 1 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767, "rooms_fullname": "Frederic Lasserre", "rooms_number": "105", "rooms_name": "LASR_105", "rooms_address": "6333 Memorial Road", "rooms_type": "", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LASR-105", "rooms_lon": -123.25583, "rooms_seats": 60, "numberRooms": 1 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767, "rooms_fullname": "Frederic Lasserre", "rooms_number": "102", "rooms_name": "LASR_102", "rooms_address": "6333 Memorial Road", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LASR-102", "rooms_lon": -123.25583, "rooms_seats": 80, "numberRooms": 1 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767, "rooms_fullname": "Frederic Lasserre", "rooms_number": "5C", "rooms_name": "LASR_5C", "rooms_address": "6333 Memorial Road", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LASR-5C", "rooms_lon": -123.25583, "rooms_seats": 20, "numberRooms": 1 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767, "rooms_fullname": "Frederic Lasserre", "rooms_number": "107", "rooms_name": "LASR_107", "rooms_address": "6333 Memorial Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LASR-107", "rooms_lon": -123.25583, "rooms_seats": 51, "numberRooms": 1 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767, "rooms_fullname": "Frederic Lasserre", "rooms_number": "104", "rooms_name": "LASR_104", "rooms_address": "6333 Memorial Road", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/LASR-104", "rooms_lon": -123.25583, "rooms_seats": 94, "numberRooms": 1 }, { "rooms_shortname": "FORW", "rooms_lat": 49.26176, "rooms_fullname": "Frank Forward", "rooms_number": "519", "rooms_name": "FORW_519", "rooms_address": "6350 Stores Road", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FORW-519", "rooms_lon": -123.25179, "rooms_seats": 35, "numberRooms": 1 }, { "rooms_shortname": "FORW", "rooms_lat": 49.26176, "rooms_fullname": "Frank Forward", "rooms_number": "303", "rooms_name": "FORW_303", "rooms_address": "6350 Stores Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FORW-303", "rooms_lon": -123.25179, "rooms_seats": 63, "numberRooms": 1 }, { "rooms_shortname": "FORW", "rooms_lat": 49.26176, "rooms_fullname": "Frank Forward", "rooms_number": "317", "rooms_name": "FORW_317", "rooms_address": "6350 Stores Road", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FORW-317", "rooms_lon": -123.25179, "rooms_seats": 44, "numberRooms": 1 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044, "rooms_fullname": "Forest Sciences Centre", "rooms_number": "1615", "rooms_name": "FSC_1615", "rooms_address": "2424 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1615", "rooms_lon": -123.24886, "rooms_seats": 20, "numberRooms": 1 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044, "rooms_fullname": "Forest Sciences Centre", "rooms_number": "1611", "rooms_name": "FSC_1611", "rooms_address": "2424 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1611", "rooms_lon": -123.24886, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044, "rooms_fullname": "Forest Sciences Centre", "rooms_number": "1221", "rooms_name": "FSC_1221", "rooms_address": "2424 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1221", "rooms_lon": -123.24886, "rooms_seats": 99, "numberRooms": 1 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044, "rooms_fullname": "Forest Sciences Centre", "rooms_number": "1003", "rooms_name": "FSC_1003", "rooms_address": "2424 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1003", "rooms_lon": -123.24886, "rooms_seats": 65, "numberRooms": 1 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044, "rooms_fullname": "Forest Sciences Centre", "rooms_number": "1001", "rooms_name": "FSC_1001", "rooms_address": "2424 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1001", "rooms_lon": -123.24886, "rooms_seats": 65, "numberRooms": 1 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044, "rooms_fullname": "Forest Sciences Centre", "rooms_number": "1617", "rooms_name": "FSC_1617", "rooms_address": "2424 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1617", "rooms_lon": -123.24886, "rooms_seats": 20, "numberRooms": 1 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044, "rooms_fullname": "Forest Sciences Centre", "rooms_number": "1613", "rooms_name": "FSC_1613", "rooms_address": "2424 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1613", "rooms_lon": -123.24886, "rooms_seats": 36, "numberRooms": 1 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044, "rooms_fullname": "Forest Sciences Centre", "rooms_number": "1402", "rooms_name": "FSC_1402", "rooms_address": "2424 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1402", "rooms_lon": -123.24886, "rooms_seats": 18, "numberRooms": 1 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044, "rooms_fullname": "Forest Sciences Centre", "rooms_number": "1005", "rooms_name": "FSC_1005", "rooms_address": "2424 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1005", "rooms_lon": -123.24886, "rooms_seats": 250, "numberRooms": 1 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044, "rooms_fullname": "Forest Sciences Centre", "rooms_number": "1002", "rooms_name": "FSC_1002", "rooms_address": "2424 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FSC-1002", "rooms_lon": -123.24886, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414, "rooms_fullname": "Food, Nutrition and Health", "rooms_number": "50", "rooms_name": "FNH_50", "rooms_address": "2205 East Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-50", "rooms_lon": -123.24959, "rooms_seats": 43, "numberRooms": 1 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414, "rooms_fullname": "Food, Nutrition and Health", "rooms_number": "320", "rooms_name": "FNH_320", "rooms_address": "2205 East Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-320", "rooms_lon": -123.24959, "rooms_seats": 27, "numberRooms": 1 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414, "rooms_fullname": "Food, Nutrition and Health", "rooms_number": "20", "rooms_name": "FNH_20", "rooms_address": "2205 East Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-20", "rooms_lon": -123.24959, "rooms_seats": 12, "numberRooms": 1 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414, "rooms_fullname": "Food, Nutrition and Health", "rooms_number": "60", "rooms_name": "FNH_60", "rooms_address": "2205 East Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-60", "rooms_lon": -123.24959, "rooms_seats": 99, "numberRooms": 1 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414, "rooms_fullname": "Food, Nutrition and Health", "rooms_number": "40", "rooms_name": "FNH_40", "rooms_address": "2205 East Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-40", "rooms_lon": -123.24959, "rooms_seats": 54, "numberRooms": 1 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414, "rooms_fullname": "Food, Nutrition and Health", "rooms_number": "30", "rooms_name": "FNH_30", "rooms_address": "2205 East Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-30", "rooms_lon": -123.24959, "rooms_seats": 28, "numberRooms": 1 }, { "rooms_shortname": "ESB", "rooms_lat": 49.26274, "rooms_fullname": "Earth Sciences Building", "rooms_number": "2012", "rooms_name": "ESB_2012", "rooms_address": "2207 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ESB-2012", "rooms_lon": -123.25224, "rooms_seats": 80, "numberRooms": 1 }, { "rooms_shortname": "ESB", "rooms_lat": 49.26274, "rooms_fullname": "Earth Sciences Building", "rooms_number": "1012", "rooms_name": "ESB_1012", "rooms_address": "2207 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Hybrid Furniture", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ESB-1012", "rooms_lon": -123.25224, "rooms_seats": 150, "numberRooms": 1 }, { "rooms_shortname": "ESB", "rooms_lat": 49.26274, "rooms_fullname": "Earth Sciences Building", "rooms_number": "1013", "rooms_name": "ESB_1013", "rooms_address": "2207 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ESB-1013", "rooms_lon": -123.25224, "rooms_seats": 350, "numberRooms": 1 }, { "rooms_shortname": "EOSM", "rooms_lat": 49.26228, "rooms_fullname": "Earth and Ocean Sciences - Main", "rooms_number": "135", "rooms_name": "EOSM_135", "rooms_address": "6339 Stores Road", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/EOSM-135", "rooms_lon": -123.25198, "rooms_seats": 50, "numberRooms": 1 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273, "rooms_fullname": "Civil and Mechanical Engineering", "rooms_number": "1212", "rooms_name": "CEME_1212", "rooms_address": "6250 Applied Science Lane", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CEME-1212", "rooms_lon": -123.24894, "rooms_seats": 34, "numberRooms": 1 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273, "rooms_fullname": "Civil and Mechanical Engineering", "rooms_number": "1206", "rooms_name": "CEME_1206", "rooms_address": "6250 Applied Science Lane", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CEME-1206", "rooms_lon": -123.24894, "rooms_seats": 26, "numberRooms": 1 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273, "rooms_fullname": "Civil and Mechanical Engineering", "rooms_number": "1202", "rooms_name": "CEME_1202", "rooms_address": "6250 Applied Science Lane", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CEME-1202", "rooms_lon": -123.24894, "rooms_seats": 100, "numberRooms": 1 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273, "rooms_fullname": "Civil and Mechanical Engineering", "rooms_number": "1215", "rooms_name": "CEME_1215", "rooms_address": "6250 Applied Science Lane", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CEME-1215", "rooms_lon": -123.24894, "rooms_seats": 45, "numberRooms": 1 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273, "rooms_fullname": "Civil and Mechanical Engineering", "rooms_number": "1210", "rooms_name": "CEME_1210", "rooms_address": "6250 Applied Science Lane", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CEME-1210", "rooms_lon": -123.24894, "rooms_seats": 22, "numberRooms": 1 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273, "rooms_fullname": "Civil and Mechanical Engineering", "rooms_number": "1204", "rooms_name": "CEME_1204", "rooms_address": "6250 Applied Science Lane", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CEME-1204", "rooms_lon": -123.24894, "rooms_seats": 62, "numberRooms": 1 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659, "rooms_fullname": "Chemistry", "rooms_number": "D200", "rooms_name": "CHEM_D200", "rooms_address": "2036 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHEM-D200", "rooms_lon": -123.25308, "rooms_seats": 114, "numberRooms": 1 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659, "rooms_fullname": "Chemistry", "rooms_number": "C124", "rooms_name": "CHEM_C124", "rooms_address": "2036 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHEM-C124", "rooms_lon": -123.25308, "rooms_seats": 90, "numberRooms": 1 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659, "rooms_fullname": "Chemistry", "rooms_number": "B150", "rooms_name": "CHEM_B150", "rooms_address": "2036 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHEM-B150", "rooms_lon": -123.25308, "rooms_seats": 265, "numberRooms": 1 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659, "rooms_fullname": "Chemistry", "rooms_number": "D300", "rooms_name": "CHEM_D300", "rooms_address": "2036 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHEM-D300", "rooms_lon": -123.25308, "rooms_seats": 114, "numberRooms": 1 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659, "rooms_fullname": "Chemistry", "rooms_number": "C126", "rooms_name": "CHEM_C126", "rooms_address": "2036 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHEM-C126", "rooms_lon": -123.25308, "rooms_seats": 90, "numberRooms": 1 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659, "rooms_fullname": "Chemistry", "rooms_number": "B250", "rooms_name": "CHEM_B250", "rooms_address": "2036 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHEM-B250", "rooms_lon": -123.25308, "rooms_seats": 240, "numberRooms": 1 }, { "rooms_shortname": "CHBE", "rooms_lat": 49.26228, "rooms_fullname": "Chemical and Biological Engineering Building", "rooms_number": "103", "rooms_name": "CHBE_103", "rooms_address": "2360 East Mall V6T 1Z3", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHBE-103", "rooms_lon": -123.24718, "rooms_seats": 60, "numberRooms": 1 }, { "rooms_shortname": "CHBE", "rooms_lat": 49.26228, "rooms_fullname": "Chemical and Biological Engineering Building", "rooms_number": "101", "rooms_name": "CHBE_101", "rooms_address": "2360 East Mall V6T 1Z3", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHBE-101", "rooms_lon": -123.24718, "rooms_seats": 200, "numberRooms": 1 }, { "rooms_shortname": "CHBE", "rooms_lat": 49.26228, "rooms_fullname": "Chemical and Biological Engineering Building", "rooms_number": "102", "rooms_name": "CHBE_102", "rooms_address": "2360 East Mall V6T 1Z3", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CHBE-102", "rooms_lon": -123.24718, "rooms_seats": 94, "numberRooms": 1 }, { "rooms_shortname": "CIRS", "rooms_lat": 49.26207, "rooms_fullname": "Centre for Interactive  Research on Sustainability", "rooms_number": "1250", "rooms_name": "CIRS_1250", "rooms_address": "2260 West Mall, V6T 1Z4", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/CIRS-1250", "rooms_lon": -123.25314, "rooms_seats": 426, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D325", "rooms_name": "BUCH_D325", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D325", "rooms_lon": -123.25468, "rooms_seats": 22, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D322", "rooms_name": "BUCH_D322", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D322", "rooms_lon": -123.25468, "rooms_seats": 50, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D317", "rooms_name": "BUCH_D317", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D317", "rooms_lon": -123.25468, "rooms_seats": 50, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D315", "rooms_name": "BUCH_D315", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D315", "rooms_lon": -123.25468, "rooms_seats": 22, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D313", "rooms_name": "BUCH_D313", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D313", "rooms_lon": -123.25468, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D307", "rooms_name": "BUCH_D307", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D307", "rooms_lon": -123.25468, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D304", "rooms_name": "BUCH_D304", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D304", "rooms_lon": -123.25468, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D229", "rooms_name": "BUCH_D229", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D229", "rooms_lon": -123.25468, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D222", "rooms_name": "BUCH_D222", "rooms_address": "1866 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D222", "rooms_lon": -123.25468, "rooms_seats": 65, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D219", "rooms_name": "BUCH_D219", "rooms_address": "1866 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D219", "rooms_lon": -123.25468, "rooms_seats": 65, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D217", "rooms_name": "BUCH_D217", "rooms_address": "1866 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D217", "rooms_lon": -123.25468, "rooms_seats": 65, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D214", "rooms_name": "BUCH_D214", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D214", "rooms_lon": -123.25468, "rooms_seats": 22, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D209", "rooms_name": "BUCH_D209", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D209", "rooms_lon": -123.25468, "rooms_seats": 22, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D205", "rooms_name": "BUCH_D205", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D205", "rooms_lon": -123.25468, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D201", "rooms_name": "BUCH_D201", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D201", "rooms_lon": -123.25468, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B318", "rooms_name": "BUCH_B318", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B318", "rooms_lon": -123.25468, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B315", "rooms_name": "BUCH_B315", "rooms_address": "1866 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B315", "rooms_lon": -123.25468, "rooms_seats": 78, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B312", "rooms_name": "BUCH_B312", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B312", "rooms_lon": -123.25468, "rooms_seats": 18, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B309", "rooms_name": "BUCH_B309", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B309", "rooms_lon": -123.25468, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B307", "rooms_name": "BUCH_B307", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B307", "rooms_lon": -123.25468, "rooms_seats": 32, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B304", "rooms_name": "BUCH_B304", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B304", "rooms_lon": -123.25468, "rooms_seats": 32, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B302", "rooms_name": "BUCH_B302", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B302", "rooms_lon": -123.25468, "rooms_seats": 32, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B218", "rooms_name": "BUCH_B218", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B218", "rooms_lon": -123.25468, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B215", "rooms_name": "BUCH_B215", "rooms_address": "1866 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B215", "rooms_lon": -123.25468, "rooms_seats": 78, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B211", "rooms_name": "BUCH_B211", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B211", "rooms_lon": -123.25468, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B209", "rooms_name": "BUCH_B209", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B209", "rooms_lon": -123.25468, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B142", "rooms_name": "BUCH_B142", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B142", "rooms_lon": -123.25468, "rooms_seats": 26, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "A203", "rooms_name": "BUCH_A203", "rooms_address": "1866 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A203", "rooms_lon": -123.25468, "rooms_seats": 108, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "A201", "rooms_name": "BUCH_A201", "rooms_address": "1866 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A201", "rooms_lon": -123.25468, "rooms_seats": 181, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "A103", "rooms_name": "BUCH_A103", "rooms_address": "1866 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A103", "rooms_lon": -123.25468, "rooms_seats": 131, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "A101", "rooms_name": "BUCH_A101", "rooms_address": "1866 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A101", "rooms_lon": -123.25468, "rooms_seats": 275, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D323", "rooms_name": "BUCH_D323", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D323", "rooms_lon": -123.25468, "rooms_seats": 31, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D319", "rooms_name": "BUCH_D319", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D319", "rooms_lon": -123.25468, "rooms_seats": 22, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D316", "rooms_name": "BUCH_D316", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D316", "rooms_lon": -123.25468, "rooms_seats": 50, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D314", "rooms_name": "BUCH_D314", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D314", "rooms_lon": -123.25468, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D312", "rooms_name": "BUCH_D312", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D312", "rooms_lon": -123.25468, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D306", "rooms_name": "BUCH_D306", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D306", "rooms_lon": -123.25468, "rooms_seats": 22, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D301", "rooms_name": "BUCH_D301", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D301", "rooms_lon": -123.25468, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D228", "rooms_name": "BUCH_D228", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D228", "rooms_lon": -123.25468, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D221", "rooms_name": "BUCH_D221", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D221", "rooms_lon": -123.25468, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D218", "rooms_name": "BUCH_D218", "rooms_address": "1866 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D218", "rooms_lon": -123.25468, "rooms_seats": 65, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D216", "rooms_name": "BUCH_D216", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D216", "rooms_lon": -123.25468, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D213", "rooms_name": "BUCH_D213", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D213", "rooms_lon": -123.25468, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D207", "rooms_name": "BUCH_D207", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D207", "rooms_lon": -123.25468, "rooms_seats": 30, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "D204", "rooms_name": "BUCH_D204", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-D204", "rooms_lon": -123.25468, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B319", "rooms_name": "BUCH_B319", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B319", "rooms_lon": -123.25468, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B316", "rooms_name": "BUCH_B316", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B316", "rooms_lon": -123.25468, "rooms_seats": 22, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B313", "rooms_name": "BUCH_B313", "rooms_address": "1866 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B313", "rooms_lon": -123.25468, "rooms_seats": 78, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B310", "rooms_name": "BUCH_B310", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B310", "rooms_lon": -123.25468, "rooms_seats": 32, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B308", "rooms_name": "BUCH_B308", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B308", "rooms_lon": -123.25468, "rooms_seats": 32, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B306", "rooms_name": "BUCH_B306", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B306", "rooms_lon": -123.25468, "rooms_seats": 32, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B303", "rooms_name": "BUCH_B303", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B303", "rooms_lon": -123.25468, "rooms_seats": 40, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B219", "rooms_name": "BUCH_B219", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B219", "rooms_lon": -123.25468, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B216", "rooms_name": "BUCH_B216", "rooms_address": "1866 Main Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B216", "rooms_lon": -123.25468, "rooms_seats": 22, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B213", "rooms_name": "BUCH_B213", "rooms_address": "1866 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B213", "rooms_lon": -123.25468, "rooms_seats": 78, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B210", "rooms_name": "BUCH_B210", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B210", "rooms_lon": -123.25468, "rooms_seats": 48, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B208", "rooms_name": "BUCH_B208", "rooms_address": "1866 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Moveable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B208", "rooms_lon": -123.25468, "rooms_seats": 56, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "B141", "rooms_name": "BUCH_B141", "rooms_address": "1866 Main Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-B141", "rooms_lon": -123.25468, "rooms_seats": 42, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "A202", "rooms_name": "BUCH_A202", "rooms_address": "1866 Main Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Fixed Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A202", "rooms_lon": -123.25468, "rooms_seats": 108, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "A104", "rooms_name": "BUCH_A104", "rooms_address": "1866 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A104", "rooms_lon": -123.25468, "rooms_seats": 150, "numberRooms": 1 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826, "rooms_fullname": "Buchanan", "rooms_number": "A102", "rooms_name": "BUCH_A102", "rooms_address": "1866 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BUCH-A102", "rooms_lon": -123.25468, "rooms_seats": 150, "numberRooms": 1 }, { "rooms_shortname": "BRKX", "rooms_lat": 49.26862, "rooms_fullname": "Brock Hall Annex", "rooms_number": "2365", "rooms_name": "BRKX_2365", "rooms_address": "1874 East Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BRKX-2365", "rooms_lon": -123.25237, "rooms_seats": 70, "numberRooms": 1 }, { "rooms_shortname": "BRKX", "rooms_lat": 49.26862, "rooms_fullname": "Brock Hall Annex", "rooms_number": "2367", "rooms_name": "BRKX_2367", "rooms_address": "1874 East Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BRKX-2367", "rooms_lon": -123.25237, "rooms_seats": 24, "numberRooms": 1 }, { "rooms_shortname": "BIOL", "rooms_lat": 49.26479, "rooms_fullname": "Biological Sciences", "rooms_number": "2200", "rooms_name": "BIOL_2200", "rooms_address": "6270 University Boulevard", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BIOL-2200", "rooms_lon": -123.25249, "rooms_seats": 76, "numberRooms": 1 }, { "rooms_shortname": "BIOL", "rooms_lat": 49.26479, "rooms_fullname": "Biological Sciences", "rooms_number": "1503", "rooms_name": "BIOL_1503", "rooms_address": "6270 University Boulevard", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BIOL-1503", "rooms_lon": -123.25249, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "BIOL", "rooms_lat": 49.26479, "rooms_fullname": "Biological Sciences", "rooms_number": "2519", "rooms_name": "BIOL_2519", "rooms_address": "6270 University Boulevard", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BIOL-2519", "rooms_lon": -123.25249, "rooms_seats": 16, "numberRooms": 1 }, { "rooms_shortname": "BIOL", "rooms_lat": 49.26479, "rooms_fullname": "Biological Sciences", "rooms_number": "2000", "rooms_name": "BIOL_2000", "rooms_address": "6270 University Boulevard", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/BIOL-2000", "rooms_lon": -123.25249, "rooms_seats": 228, "numberRooms": 1 }, { "rooms_shortname": "AUDX", "rooms_lat": 49.2666, "rooms_fullname": "Auditorium Annex", "rooms_number": "142", "rooms_name": "AUDX_142", "rooms_address": "1924 West Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/AUDX-142", "rooms_lon": -123.25655, "rooms_seats": 20, "numberRooms": 1 }, { "rooms_shortname": "AUDX", "rooms_lat": 49.2666, "rooms_fullname": "Auditorium Annex", "rooms_number": "157", "rooms_name": "AUDX_157", "rooms_address": "1924 West Mall", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/AUDX-157", "rooms_lon": -123.25655, "rooms_seats": 21, "numberRooms": 1 }, { "rooms_shortname": "AERL", "rooms_lat": 49.26372, "rooms_fullname": "Aquatic Ecosystems Research Laboratory", "rooms_number": "120", "rooms_name": "AERL_120", "rooms_address": "2202 Main Mall", "rooms_type": "Tiered Large Group", "rooms_furniture": "Classroom-Fixed Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/AERL-120", "rooms_lon": -123.25099, "rooms_seats": 144, "numberRooms": 1 }, { "rooms_shortname": "ANSO", "rooms_lat": 49.26958, "rooms_fullname": "Anthropology and Sociology", "rooms_number": "205", "rooms_name": "ANSO_205", "rooms_address": "6303 North West Marine Drive", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANSO-205", "rooms_lon": -123.25741, "rooms_seats": 37, "numberRooms": 1 }, { "rooms_shortname": "ANSO", "rooms_lat": 49.26958, "rooms_fullname": "Anthropology and Sociology", "rooms_number": "202", "rooms_name": "ANSO_202", "rooms_address": "6303 North West Marine Drive", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANSO-202", "rooms_lon": -123.25741, "rooms_seats": 26, "numberRooms": 1 }, { "rooms_shortname": "ANSO", "rooms_lat": 49.26958, "rooms_fullname": "Anthropology and Sociology", "rooms_number": "207", "rooms_name": "ANSO_207", "rooms_address": "6303 North West Marine Drive", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Moveable Tablets", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANSO-207", "rooms_lon": -123.25741, "rooms_seats": 90, "numberRooms": 1 }, { "rooms_shortname": "ANSO", "rooms_lat": 49.26958, "rooms_fullname": "Anthropology and Sociology", "rooms_number": "203", "rooms_name": "ANSO_203", "rooms_address": "6303 North West Marine Drive", "rooms_type": "Small Group", "rooms_furniture": "Classroom-Moveable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANSO-203", "rooms_lon": -123.25741, "rooms_seats": 33, "numberRooms": 1 }, { "rooms_shortname": "ALRD", "rooms_lat": 49.2699, "rooms_fullname": "Allard Hall (LAW)", "rooms_number": "B101", "rooms_name": "ALRD_B101", "rooms_address": "1822 East Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-B101", "rooms_lon": -123.25318, "rooms_seats": 44, "numberRooms": 1 }, { "rooms_shortname": "ALRD", "rooms_lat": 49.2699, "rooms_fullname": "Allard Hall (LAW)", "rooms_number": "113", "rooms_name": "ALRD_113", "rooms_address": "1822 East Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-113", "rooms_lon": -123.25318, "rooms_seats": 20, "numberRooms": 1 }, { "rooms_shortname": "ALRD", "rooms_lat": 49.2699, "rooms_fullname": "Allard Hall (LAW)", "rooms_number": "105", "rooms_name": "ALRD_105", "rooms_address": "1822 East Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-105", "rooms_lon": -123.25318, "rooms_seats": 94, "numberRooms": 1 }, { "rooms_shortname": "ALRD", "rooms_lat": 49.2699, "rooms_fullname": "Allard Hall (LAW)", "rooms_number": "121", "rooms_name": "ALRD_121", "rooms_address": "1822 East Mall", "rooms_type": "Case Style", "rooms_furniture": "Classroom-Fixed Tables/Movable Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-121", "rooms_lon": -123.25318, "rooms_seats": 50, "numberRooms": 1 }, { "rooms_shortname": "ALRD", "rooms_lat": 49.2699, "rooms_fullname": "Allard Hall (LAW)", "rooms_number": "112", "rooms_name": "ALRD_112", "rooms_address": "1822 East Mall", "rooms_type": "Open Design General Purpose", "rooms_furniture": "Classroom-Movable Tables & Chairs", "rooms_href": "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-112", "rooms_lon": -123.25318, "rooms_seats": 20, "numberRooms": 1 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("dir missing", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "error": "UP",
                    "keys": ["numberRooms"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_lat"],
                "APPLY": [{
                        "numberRooms": {
                            "COUNT": "rooms_number"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("keys missing", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "UP",
                    "error": ["numberRooms"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_lat"],
                "APPLY": [{
                        "numberRooms": {
                            "COUNT": "rooms_number"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("Incorrect direction", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "RIGHT",
                    "keys": ["numberRooms"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_lat"],
                "APPLY": [{
                        "numberRooms": {
                            "COUNT": "rooms_number"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("ORDERE KEYS IS EMPTY", function () {
        var emptyArray = [];
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "UP",
                    "keys": emptyArray
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_lat"],
                "APPLY": [{
                        "numberRooms": {
                            "COUNT": "rooms_number"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("invalid str", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["error"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_lat"],
                "APPLY": [{
                        "numberRooms": {
                            "COUNT": "rooms_number"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("key is not in column", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["rooms_address"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_lat"],
                "APPLY": [{
                        "numberRooms": {
                            "COUNT": "rooms_number"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("no group", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["numberRooms"]
                }
            },
            "TRANSFORMATIONS": {
                "APPLY": [{
                        "numberRooms": {
                            "COUNT": "rooms_number"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("no apply", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["numberRooms"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_lat"]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("group is empty", function () {
        var emptyArray = [];
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["numberRooms"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": emptyArray,
                "APPLY": [{
                        "numberRooms": {
                            "COUNT": "rooms_number"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("multiple keys in APPLYKEY", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["numberRooms"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_lat"],
                "APPLY": [{
                        "numberRooms": {
                            "COUNT": "rooms_number"
                        },
                        "error": {
                            "MAX": "rooms_lat"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("key in APPLYKEY is not a string", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["numberRooms", "rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["numberRooms"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname", "rooms_lat"],
                "APPLY": [{
                        100000: {
                            "COUNT": "rooms_number"
                        }
                    }]
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("where is empty and no transformation", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "UP",
                    "keys": ["rooms_shortname"]
                }
            }
        };
        var second = [{ "rooms_shortname": "AERL", "rooms_lat": 49.26372 }, { "rooms_shortname": "ALRD", "rooms_lat": 49.2699 }, { "rooms_shortname": "ALRD", "rooms_lat": 49.2699 }, { "rooms_shortname": "ALRD", "rooms_lat": 49.2699 }, { "rooms_shortname": "ALRD", "rooms_lat": 49.2699 }, { "rooms_shortname": "ALRD", "rooms_lat": 49.2699 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANGU", "rooms_lat": 49.26486 }, { "rooms_shortname": "ANSO", "rooms_lat": 49.26958 }, { "rooms_shortname": "ANSO", "rooms_lat": 49.26958 }, { "rooms_shortname": "ANSO", "rooms_lat": 49.26958 }, { "rooms_shortname": "ANSO", "rooms_lat": 49.26958 }, { "rooms_shortname": "AUDX", "rooms_lat": 49.2666 }, { "rooms_shortname": "AUDX", "rooms_lat": 49.2666 }, { "rooms_shortname": "BIOL", "rooms_lat": 49.26479 }, { "rooms_shortname": "BIOL", "rooms_lat": 49.26479 }, { "rooms_shortname": "BIOL", "rooms_lat": 49.26479 }, { "rooms_shortname": "BIOL", "rooms_lat": 49.26479 }, { "rooms_shortname": "BRKX", "rooms_lat": 49.26862 }, { "rooms_shortname": "BRKX", "rooms_lat": 49.26862 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "BUCH", "rooms_lat": 49.26826 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273 }, { "rooms_shortname": "CEME", "rooms_lat": 49.26273 }, { "rooms_shortname": "CHBE", "rooms_lat": 49.26228 }, { "rooms_shortname": "CHBE", "rooms_lat": 49.26228 }, { "rooms_shortname": "CHBE", "rooms_lat": 49.26228 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659 }, { "rooms_shortname": "CHEM", "rooms_lat": 49.2659 }, { "rooms_shortname": "CIRS", "rooms_lat": 49.26207 }, { "rooms_shortname": "DMP", "rooms_lat": 49.26125 }, { "rooms_shortname": "DMP", "rooms_lat": 49.26125 }, { "rooms_shortname": "DMP", "rooms_lat": 49.26125 }, { "rooms_shortname": "DMP", "rooms_lat": 49.26125 }, { "rooms_shortname": "DMP", "rooms_lat": 49.26125 }, { "rooms_shortname": "EOSM", "rooms_lat": 49.26228 }, { "rooms_shortname": "ESB", "rooms_lat": 49.26274 }, { "rooms_shortname": "ESB", "rooms_lat": 49.26274 }, { "rooms_shortname": "ESB", "rooms_lat": 49.26274 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414 }, { "rooms_shortname": "FNH", "rooms_lat": 49.26414 }, { "rooms_shortname": "FORW", "rooms_lat": 49.26176 }, { "rooms_shortname": "FORW", "rooms_lat": 49.26176 }, { "rooms_shortname": "FORW", "rooms_lat": 49.26176 }, { "rooms_shortname": "FRDM", "rooms_lat": 49.26541 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044 }, { "rooms_shortname": "FSC", "rooms_lat": 49.26044 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605 }, { "rooms_shortname": "GEOG", "rooms_lat": 49.26605 }, { "rooms_shortname": "HEBB", "rooms_lat": 49.2661 }, { "rooms_shortname": "HEBB", "rooms_lat": 49.2661 }, { "rooms_shortname": "HEBB", "rooms_lat": 49.2661 }, { "rooms_shortname": "HEBB", "rooms_lat": 49.2661 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627 }, { "rooms_shortname": "HENN", "rooms_lat": 49.26627 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IBLC", "rooms_lat": 49.26766 }, { "rooms_shortname": "IONA", "rooms_lat": 49.27106 }, { "rooms_shortname": "IONA", "rooms_lat": 49.27106 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767 }, { "rooms_shortname": "LASR", "rooms_lat": 49.26767 }, { "rooms_shortname": "LSC", "rooms_lat": 49.26236 }, { "rooms_shortname": "LSC", "rooms_lat": 49.26236 }, { "rooms_shortname": "LSC", "rooms_lat": 49.26236 }, { "rooms_shortname": "LSK", "rooms_lat": 49.26545 }, { "rooms_shortname": "LSK", "rooms_lat": 49.26545 }, { "rooms_shortname": "LSK", "rooms_lat": 49.26545 }, { "rooms_shortname": "LSK", "rooms_lat": 49.26545 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463 }, { "rooms_shortname": "MATH", "rooms_lat": 49.266463 }, { "rooms_shortname": "MATX", "rooms_lat": 49.266089 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176 }, { "rooms_shortname": "MCLD", "rooms_lat": 49.26176 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MCML", "rooms_lat": 49.26114 }, { "rooms_shortname": "MGYM", "rooms_lat": 49.2663 }, { "rooms_shortname": "MGYM", "rooms_lat": 49.2663 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "ORCH", "rooms_lat": 49.26048 }, { "rooms_shortname": "OSBO", "rooms_lat": 49.26047 }, { "rooms_shortname": "OSBO", "rooms_lat": 49.26047 }, { "rooms_shortname": "OSBO", "rooms_lat": 49.26047 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264 }, { "rooms_shortname": "PCOH", "rooms_lat": 49.264 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229 }, { "rooms_shortname": "PHRM", "rooms_lat": 49.26229 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SCRF", "rooms_lat": 49.26398 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643 }, { "rooms_shortname": "SOWK", "rooms_lat": 49.2643 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642 }, { "rooms_shortname": "SPPH", "rooms_lat": 49.2642 }, { "rooms_shortname": "SRC", "rooms_lat": 49.2683 }, { "rooms_shortname": "SRC", "rooms_lat": 49.2683 }, { "rooms_shortname": "SRC", "rooms_lat": 49.2683 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "SWNG", "rooms_lat": 49.26293 }, { "rooms_shortname": "UCLL", "rooms_lat": 49.26867 }, { "rooms_shortname": "UCLL", "rooms_lat": 49.26867 }, { "rooms_shortname": "UCLL", "rooms_lat": 49.26867 }, { "rooms_shortname": "UCLL", "rooms_lat": 49.26867 }, { "rooms_shortname": "WESB", "rooms_lat": 49.26517 }, { "rooms_shortname": "WESB", "rooms_lat": 49.26517 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }, { "rooms_shortname": "WOOD", "rooms_lat": 49.26478 }];
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            var first = (JSON.parse(JSON.stringify(response.body))).result;
            compareArrays(first, second);
        }).catch(function (e) {
            console.log(JSON.stringify(e));
            chai_1.expect.fail();
        });
    });
    it("dir error", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "dir": "error",
                    "keys": ["rooms_shortname"]
                }
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
    it("", function () {
        var query = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["rooms_shortname", "rooms_lat"],
                "ORDER": {
                    "a": 3,
                    "keys": ["rooms_shortname"],
                    "ERROR": "err"
                }
            }
        };
        return test.performQuery(query).then(function (response) {
            Util_1.default.info("perform query");
            chai_1.expect.fail();
        }).catch(function (e) {
            chai_1.expect('Invalid Query');
        });
    });
});
//# sourceMappingURL=InsightQueryTest.js.map