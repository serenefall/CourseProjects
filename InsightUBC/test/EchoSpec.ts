/**
 * Created by rtholmes on 2016-10-31.
 */

import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";

import chai = require('chai');
import chaiHttp = require('chai-http');
import Response = ChaiHttp.Response;
import restify = require('restify');
import fs = require('fs');

chai.use(chaiHttp);

describe("EchoSpec", function () {
    this.timeout(100000);
    let serverTest: Server = new Server(4321);

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    before(function () {
        serverTest.start().then().catch();
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        serverTest.stop().then().catch();
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("Should be able to echo", function () {
        let out = Server.performEcho('echo');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: 'echo...echo'});
    });

    it("Should be able to echo silence", function () {
        let out = Server.performEcho('');
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(200);
        expect(out.body).to.deep.equal({message: '...'});
    });

    it("Should be able to handle a missing echo message sensibly", function () {
        let out = Server.performEcho(undefined);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });

    it("Should be able to handle a null echo message sensibly", function () {
        let out = Server.performEcho(null);
        Log.test(JSON.stringify(out));
        sanityCheck(out);
        expect(out.code).to.equal(400);
        expect(out.body).to.have.property('error');
        expect(out.body).to.deep.equal({error: 'Message not provided'});
    });


    //Test for Server.ts from Piazza
    // it("Test Server", function() {
    //
    //     // Init
    //     chai.use(chaiHttp);
    //     let server = new Server(4320);
    //     let URL = "http://127.0.0.1:4321";
    //
    //     // Test
    //     expect(server).to.not.equal(undefined);
    //     try{
    //         Server.echo((<restify.Request>{}), null, null);
    //         expect.fail()
    //     } catch(err) {
    //         expect(err.message).to.equal("Cannot read property 'json' of null");
    //     }
    //
    //     return server.start().then(function(success: boolean) {
    //         return chai.request(URL)
    //             .get("/")
    //     }).catch(function(err) {
    //         expect.fail()
    //     }).then(function(res: Response) {
    //         expect(res.status).to.be.equal(200);
    //         return chai.request(URL)
    //             .get("/echo/Hello")
    //     }).catch(function(err) {
    //         expect.fail()
    //     }).then(function(res: Response) {
    //         expect(res.status).to.be.equal(200);
    //         return server.start()
    //     }).then(function(success: boolean) {
    //         expect.fail();
    //     }).catch(function(err) {
    //         expect(err.code).to.equal('EADDRINUSE');
    //         return server.stop();
    //     }).catch(function(err) {
    //         expect.fail();
    //     });
    // });

    // Additional tests
    it("PUT should fail", function () {
        return chai.request('http://localhost:4321')
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync(__dirname + "/nodata.zip"), "/nodata.zip")
            .then(function (res: Response) {
                expect.fail();
            })
            .catch(function (err: any) {
                expect(err).to.have.status(400);
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
            .then(function (res: Response) {
                // Log.trace('then:');
                // some assertions
                expect.fail();
            })
            .catch(function (err: any) {
                // Log.trace('catch:');
                // some assertions
               // expect(err).to.have.status(400);
            });
    });

    it("PUT description for rooms", function () {
        return chai.request('http://localhost:4321')
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync(__dirname + "/rooms.zip"), "/rooms.zip")
            .then(function (res: Response) {
                // expect(res).to.have.status(201);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("PUT description for courses", function () {
        return chai.request('http://localhost:4321')
            .put('/dataset/courses')
            .attach("body", fs.readFileSync(__dirname + "/courses.zip"), "/courses.zip")
            .then(function (res: Response) {
                // expect(res).to.have.status(201);
            })
            .catch(function (err: any) {
                expect.fail();
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
            .then(function (res: Response) {
                expect(res).to.have.status(200);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("DELETE description for rooms", function () {
        return chai.request('http://localhost:4321')
            .del('/dataset/rooms')
            .then(function (res: Response) {
                expect(res).to.have.status(204);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });

    it("DELETE description for courses", function () {
        return chai.request('http://localhost:4321')
            .del('/dataset/courses')
            .then(function (res: Response) {
                expect(res).to.have.status(204);
            })
            .catch(function (err: any) {
                expect.fail();
            });
    });




    // More Tests
    it("Should be able to start server", function () {
        return serverTest.start()
            .then((res) => {
                expect(res).to.equal(true);
            })
            .catch(err => {
                console.log(err);
            })
    });

    it("PUT description fail", function () {
        return chai.request("localhost:4321")
            .put('/dataset/hello')
            .attach("body", fs.readFileSync("./test/rooms.zip"), "rooms.zip")
            .then(function (res: any) {
                Log.trace('then:');
                console.log(res.status);
                expect.fail();
            })
            .catch(function (err: any) {
                Log.trace('catch:');
                console.log(err.status)
            });
    });

    it("PUT description fail", function () {
        return chai.request("localhost:4321")
            .put('/dataset/rooms')
            // .attach("body", fs.readFileSync("./rooms.zip"), "rooms.zip")
            .then(function (res: any) {
                Log.trace('then:');
                // some assertions
                console.log(res.status);
                expect.fail();
                // console.log(res.body);
            })
            .catch(function (err: any) {
                Log.trace('catch:');
                // some assertions
                console.log(err.status)
            });
    });

    it("PUT description", function () {
        return chai.request("localhost:4321")
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync("./test/rooms.zip"), "rooms.zip")
            .then(function (res: any) {
                Log.trace('then:');
                // some assertions
                console.log(res.status);
                // console.log(res.body);
            })
            .catch(function (err: any) {
                Log.trace('catch:');
                // some assertions
                console.log(err.status);
                expect.fail();
            });
    });


    it("POST description", function () {
        let queryJSONObject = {
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
            .then(function (res: any) {
                Log.trace('then:');
                // some assertions
                console.log(res.status);
                //console.log(res.body);
            })
            .catch(function (err: any) {
                Log.trace('catch:');
                // some assertions
                console.log(err.status)
                expect.fail();
            });
    });

    it("DELETE description", function () {
        return chai.request("localhost:4321")
            .del('/dataset/rooms')
            .then(function (res: any) {
                Log.trace('then:');
                // some assertions
                console.log(res.status);
                // console.log(res.body);
            })
            .catch(function (err: any) {
                Log.trace('catch:');
                // some assertions
                console.log(err.status)
                expect.fail();
            });
    });

    it("Should be able to stop server", function () {
        return serverTest.stop()
            .then((res: any) => {
                expect(res).to.equal(true);
            })
            .catch((err: any) => {
                console.log(err);
            })
    });

});
