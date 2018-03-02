"use strict";
var Server_1 = require("../src/rest/Server");
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var chai = require("chai");
var chaiHttp = require("chai-http");
var fs = require("fs");
chai.use(chaiHttp);
describe("EchoSpec", function () {
    this.timeout(100000);
    var serverTest = new Server_1.default(4321);
    function sanityCheck(response) {
        chai_1.expect(response).to.have.property('code');
        chai_1.expect(response).to.have.property('body');
        chai_1.expect(response.code).to.be.a('number');
    }
    before(function () {
        serverTest.start().then().catch();
        Util_1.default.test('Before: ' + this.test.parent.title);
    });
    beforeEach(function () {
        Util_1.default.test('BeforeTest: ' + this.currentTest.title);
    });
    after(function () {
        serverTest.stop().then().catch();
        Util_1.default.test('After: ' + this.test.parent.title);
    });
    afterEach(function () {
        Util_1.default.test('AfterTest: ' + this.currentTest.title);
    });
    it("Should be able to echo", function () {
        var out = Server_1.default.performEcho('echo');
        Util_1.default.test(JSON.stringify(out));
        sanityCheck(out);
        chai_1.expect(out.code).to.equal(200);
        chai_1.expect(out.body).to.deep.equal({ message: 'echo...echo' });
    });
    it("Should be able to echo silence", function () {
        var out = Server_1.default.performEcho('');
        Util_1.default.test(JSON.stringify(out));
        sanityCheck(out);
        chai_1.expect(out.code).to.equal(200);
        chai_1.expect(out.body).to.deep.equal({ message: '...' });
    });
    it("Should be able to handle a missing echo message sensibly", function () {
        var out = Server_1.default.performEcho(undefined);
        Util_1.default.test(JSON.stringify(out));
        sanityCheck(out);
        chai_1.expect(out.code).to.equal(400);
        chai_1.expect(out.body).to.deep.equal({ error: 'Message not provided' });
    });
    it("Should be able to handle a null echo message sensibly", function () {
        var out = Server_1.default.performEcho(null);
        Util_1.default.test(JSON.stringify(out));
        sanityCheck(out);
        chai_1.expect(out.code).to.equal(400);
        chai_1.expect(out.body).to.have.property('error');
        chai_1.expect(out.body).to.deep.equal({ error: 'Message not provided' });
    });
    it("PUT should fail", function () {
        return chai.request('http://localhost:4321')
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync(__dirname + "/nodata.zip"), "/nodata.zip")
            .then(function (res) {
            chai_1.expect.fail();
        })
            .catch(function (err) {
            chai_1.expect(err).to.have.status(400);
        });
    });
    it("POST should fail", function () {
        return chai.request('http://localhost:4321')
            .post('/query')
            .send({
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ]
            }
        })
            .then(function (res) {
            chai_1.expect.fail();
        })
            .catch(function (err) {
        });
    });
    it("PUT description for rooms", function () {
        return chai.request('http://localhost:4321')
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync(__dirname + "/rooms.zip"), "/rooms.zip")
            .then(function (res) {
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("PUT description for courses", function () {
        return chai.request('http://localhost:4321')
            .put('/dataset/courses')
            .attach("body", fs.readFileSync(__dirname + "/courses.zip"), "/courses.zip")
            .then(function (res) {
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("POST description for rooms", function () {
        return chai.request('http://localhost:4321')
            .post('/query')
            .send({
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        })
            .then(function (res) {
            chai_1.expect(res).to.have.status(200);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("DELETE description for rooms", function () {
        return chai.request('http://localhost:4321')
            .del('/dataset/rooms')
            .then(function (res) {
            chai_1.expect(res).to.have.status(204);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("DELETE description for courses", function () {
        return chai.request('http://localhost:4321')
            .del('/dataset/courses')
            .then(function (res) {
            chai_1.expect(res).to.have.status(204);
        })
            .catch(function (err) {
            chai_1.expect.fail();
        });
    });
    it("Should be able to start server", function () {
        return serverTest.start()
            .then(function (res) {
            chai_1.expect(res).to.equal(true);
        })
            .catch(function (err) {
            console.log(err);
        });
    });
    it("PUT description fail", function () {
        return chai.request("localhost:4321")
            .put('/dataset/hello')
            .attach("body", fs.readFileSync("./test/rooms.zip"), "rooms.zip")
            .then(function (res) {
            Util_1.default.trace('then:');
            console.log(res.status);
            chai_1.expect.fail();
        })
            .catch(function (err) {
            Util_1.default.trace('catch:');
            console.log(err.status);
        });
    });
    it("PUT description fail", function () {
        return chai.request("localhost:4321")
            .put('/dataset/rooms')
            .then(function (res) {
            Util_1.default.trace('then:');
            console.log(res.status);
            chai_1.expect.fail();
        })
            .catch(function (err) {
            Util_1.default.trace('catch:');
            console.log(err.status);
        });
    });
    it("PUT description", function () {
        return chai.request("localhost:4321")
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync("./test/rooms.zip"), "rooms.zip")
            .then(function (res) {
            Util_1.default.trace('then:');
            console.log(res.status);
        })
            .catch(function (err) {
            Util_1.default.trace('catch:');
            console.log(err.status);
            chai_1.expect.fail();
        });
    });
    it("POST description", function () {
        var queryJSONObject = {
            "WHERE": {
                "IS": {
                    "rooms_address": "*Agrono*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_address", "rooms_name"
                ],
                "FORM": "TABLE"
            }
        };
        return chai.request("localhost:4321")
            .post('/query')
            .send(queryJSONObject)
            .then(function (res) {
            Util_1.default.trace('then:');
            console.log(res.status);
        })
            .catch(function (err) {
            Util_1.default.trace('catch:');
            console.log(err.status);
            chai_1.expect.fail();
        });
    });
    it("DELETE description", function () {
        return chai.request("localhost:4321")
            .del('/dataset/rooms')
            .then(function (res) {
            Util_1.default.trace('then:');
            console.log(res.status);
        })
            .catch(function (err) {
            Util_1.default.trace('catch:');
            console.log(err.status);
            chai_1.expect.fail();
        });
    });
    it("Should be able to stop server", function () {
        return serverTest.stop()
            .then(function (res) {
            chai_1.expect(res).to.equal(true);
        })
            .catch(function (err) {
            console.log(err);
        });
    });
});
//# sourceMappingURL=EchoSpec.js.map