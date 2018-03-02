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
describe("DatsetTest", function () {
    this.timeout(10000);
    var test = null;
    function readFile(name) {
        return new Promise(function (fulfill, reject) {
            fs.readFile('./test/' + name, function (err, data) {
                if (err)
                    reject(err);
                fulfill(data.toString('base64'));
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
    it("Should add courses.zip into dataset", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("courses.zip")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("courses", content).then(function (response) {
                                chai_1.expect(response.code).to.deep.equal(204);
                            }).catch(function (e) {
                                console.log("Error Code : " + e.code + "  " + e.body.error);
                                chai_1.expect.fail();
                            })];
                }
            });
        });
    });
    it("Should override courses.zip that is already in dataset", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("courses.zip")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("courses", content).then(function (response) {
                                return test.addDataset("courses", content).then(function (response) {
                                    chai_1.expect(response.code).to.deep.equal(201);
                                }).catch(function (e) {
                                    console.log("Error Code : 1");
                                    chai_1.expect.fail();
                                });
                            }).catch(function (e) {
                                console.log("Error Code : 2");
                                chai_1.expect.fail();
                            })];
                }
            });
        });
    });
    it("Should find out notzip.doc is not a valid zip file", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("notzip.doc")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("notzip", content).then(function (response) {
                                chai_1.expect.fail();
                            }).catch(function (e) {
                                chai_1.expect(e.code).to.deep.equal(400);
                            })];
                }
            });
        });
    });
    it("Should find out notzip.doc is not a valid rooms.zip file", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("notzip.doc")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("rooms", content).then(function (response) {
                                chai_1.expect.fail();
                            }).catch(function (e) {
                                chai_1.expect(e.code).to.deep.equal(400);
                            })];
                }
            });
        });
    });
    it("Should find out notzip.doc is not a valid courses.zip file", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("notzip.doc")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("courses", content).then(function (response) {
                                chai_1.expect.fail();
                            }).catch(function (e) {
                                chai_1.expect(e.code).to.deep.equal(400);
                            })];
                }
            });
        });
    });
    it("Should find out nodata.zip is not a valid dataset", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("nodata.zip")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("nodata", content).then(function (response) {
                                chai_1.expect.fail();
                            }).catch(function (e) {
                                chai_1.expect(e.code).to.deep.equal(400);
                            })];
                }
            });
        });
    });
    it("Should remove courses from disk", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("courses.zip")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("courses", content).then(function (response) {
                                return test.removeDataset("courses").then(function (response) {
                                    chai_1.expect(response.code).to.deep.equal(204);
                                }).catch(function (e) {
                                    console.log("Error: removing courses.query failed");
                                    chai_1.expect.fail();
                                });
                            }).catch(function (e) {
                                console.log("Error: adding file failed");
                                chai_1.expect.fail();
                            })];
                }
            });
        });
    });
    it("Should be unable to remove non-existing c from disk", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("courses.zip")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("courses", content).then(function (response) {
                                return test.removeDataset("c").then(function (response) {
                                    chai_1.expect.fail();
                                }).catch(function (e) {
                                    chai_1.expect(e.code).to.deep.equal(404);
                                });
                            }).catch(function (e) {
                                console.log("Error: adding file failed");
                                chai_1.expect.fail();
                            })];
                }
            });
        });
    });
    it("Should be unable to remove courses as it already was removed", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("courses.zip")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("courses", content).then(function (response) {
                                return test.removeDataset("courses").then(function (response) {
                                    console.log("Good: removing file done");
                                    return test.removeDataset("courses").then(function (response) {
                                        chai_1.expect.fail();
                                    }).catch(function (e) {
                                        console.log("Good: no file to be removed");
                                        chai_1.expect(e.code).to.deep.equal(404);
                                    });
                                }).catch(function (e) {
                                    console.log("Error: removing file failed");
                                    chai_1.expect.fail();
                                });
                            }).catch(function (e) {
                                console.log("Error: adding file failed");
                                chai_1.expect.fail();
                            })];
                }
            });
        });
    });
    it("Should add rooms.zip into dataset", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("rooms.zip")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("rooms", content).then(function (response) {
                                chai_1.expect(response.code).to.deep.equal(204);
                            }).catch(function (e) {
                                console.log("Error Code : " + e.code + "  " + e.body.error);
                                chai_1.expect.fail();
                            })];
                }
            });
        });
    });
    it("Should override rooms.zip that is already in dataset", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("rooms.zip")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("rooms", content).then(function (response) {
                                return test.addDataset("rooms", content).then(function (response) {
                                    chai_1.expect(response.code).to.deep.equal(201);
                                }).catch(function (e) {
                                    console.log("Error Code : 1");
                                    chai_1.expect.fail();
                                });
                            }).catch(function (e) {
                                console.log("Error Code : 2");
                                chai_1.expect.fail();
                            })];
                }
            });
        });
    });
    it("Should remove rooms from disk", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("rooms.zip")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("rooms", content).then(function (response) {
                                return test.removeDataset("rooms").then(function (response) {
                                    chai_1.expect(response.code).to.deep.equal(204);
                                }).catch(function (e) {
                                    console.log("Error: removing rooms data and file failed");
                                    chai_1.expect.fail();
                                });
                            }).catch(function (e) {
                                console.log("Error: adding rooms file failed");
                                chai_1.expect.fail();
                            })];
                }
            });
        });
    });
    it("Should be unable to remove non-existing Room from disk", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("rooms.zip")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("rooms", content).then(function (response) {
                                return test.removeDataset("r").then(function (response) {
                                    chai_1.expect.fail();
                                }).catch(function (e) {
                                    chai_1.expect(e.code).to.deep.equal(404);
                                });
                            }).catch(function (e) {
                                console.log("Error: adding file failed");
                                chai_1.expect.fail();
                            })];
                }
            });
        });
    });
    it("Should be unable to remove rooms as it already was removed", function () {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, readFile("rooms.zip")];
                    case 1:
                        content = _a.sent();
                        return [2 /*return*/, test.addDataset("rooms", content).then(function (response) {
                                return test.removeDataset("rooms").then(function (response) {
                                    console.log("Good: removing file done");
                                    return test.removeDataset("rooms").then(function (response) {
                                        chai_1.expect.fail();
                                    }).catch(function (e) {
                                        console.log("Good: no file to be removed");
                                        chai_1.expect(e.code).to.deep.equal(404);
                                    });
                                }).catch(function (e) {
                                    console.log("Error: removing file failed");
                                    chai_1.expect.fail();
                                });
                            }).catch(function (e) {
                                console.log("Error: adding file failed");
                                chai_1.expect.fail();
                            })];
                }
            });
        });
    });
});
//# sourceMappingURL=InsightDatasetTest.js.map