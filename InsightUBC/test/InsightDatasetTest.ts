import {expect} from 'chai';
import fs = require('fs');
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";


describe("DatsetTest", function () {
    this.timeout(10000);

    let test: InsightFacade = null;

    function readFile(name: string): Promise<any> {
        return new Promise(function (fulfill, reject) {
            fs.readFile('./test/' + name, function (err: any, data: any) {
                if (err) reject(err);
                fulfill(data.toString('base64'))
            });
        });
    }

    before(async function () {
        test = new InsightFacade();
    });

    after(function () {
        test = null;
    });

    it("Should add courses.zip into dataset", async function () {
        let content = await readFile("courses.zip");

        return test.addDataset("courses", content).then(function (response) {
            expect(response.code).to.deep.equal(204);
        }).catch(function (e) {
            console.log("Error Code : " + e.code + "  " + e.body.error);
            expect.fail();
        });
    });

    it("Should override courses.zip that is already in dataset", async function () {
        let content = await readFile("courses.zip");

        return test.addDataset("courses", content).then(function (response) {
            return test.addDataset("courses", content).then(function (response) {
                expect(response.code).to.deep.equal(201);
            }).catch(function (e) {
                console.log("Error Code : 1");
                expect.fail();
            });
        }).catch(function (e) {
            console.log("Error Code : 2");
            expect.fail();
        });
    });

    it("Should find out notzip.doc is not a valid zip file", async function () {
        let content = await readFile("notzip.doc");

        return test.addDataset("notzip", content).then(function (response) {
            expect.fail();
        }).catch(function (e) {
            expect(e.code).to.deep.equal(400);
        });
    });

    it("Should find out notzip.doc is not a valid rooms.zip file", async function () {
        let content = await readFile("notzip.doc");

        return test.addDataset("rooms", content).then(function (response) {
            expect.fail();
        }).catch(function (e) {
            expect(e.code).to.deep.equal(400);
        });
    });

    it("Should find out notzip.doc is not a valid courses.zip file", async function () {
        let content = await readFile("notzip.doc");

        return test.addDataset("courses", content).then(function (response) {
            expect.fail();
        }).catch(function (e) {
            expect(e.code).to.deep.equal(400);
        });
    });

    it("Should find out nodata.zip is not a valid dataset", async function () {
        let content = await readFile("nodata.zip");

        return test.addDataset("nodata", content).then(function (response) {
            expect.fail();
        }).catch(function (e) {
            expect(e.code).to.deep.equal(400);
        });
    });

    it("Should remove courses from disk", async function () {
        let content = await readFile("courses.zip");

        return test.addDataset("courses", content).then(function (response) {
            return test.removeDataset("courses").then(function (response) {
                expect(response.code).to.deep.equal(204);
            }).catch(function (e) {
                console.log("Error: removing courses.query failed");
                expect.fail();
            });
        }).catch(function (e) {
            console.log("Error: adding file failed");
            expect.fail();
        });
    });

    it("Should be unable to remove non-existing c from disk", async function () {
        let content = await readFile("courses.zip");

        return test.addDataset("courses", content).then(function (response) {
            return test.removeDataset("c").then(function (response) {
                expect.fail();
            }).catch(function (e) {
                expect(e.code).to.deep.equal(404);
            });
        }).catch(function (e) {
            console.log("Error: adding file failed");
            expect.fail();
        });
    });

    it("Should be unable to remove courses as it already was removed", async function () {
        let content = await readFile("courses.zip");

        return test.addDataset("courses", content).then(function (response) {
            return test.removeDataset("courses").then(function (response) {
                console.log("Good: removing file done");
                return test.removeDataset("courses").then(function (response) {
                    expect.fail();
                }).catch(function (e) {
                    console.log("Good: no file to be removed");
                    expect(e.code).to.deep.equal(404);
                });
            }).catch(function (e) {
                console.log("Error: removing file failed");
                expect.fail();
            });
        }).catch(function (e) {
            console.log("Error: adding file failed");
            expect.fail();
        });
    });


    // rooms.zip
    it("Should add rooms.zip into dataset", async function () {
        let content = await readFile("rooms.zip");

        return test.addDataset("rooms", content).then(function (response) {
            expect(response.code).to.deep.equal(204);
        }).catch(function (e) {
            console.log("Error Code : " + e.code + "  " + e.body.error);
            expect.fail();
        });
    });

    it("Should override rooms.zip that is already in dataset", async function () {
        let content = await readFile("rooms.zip");

        return test.addDataset("rooms", content).then(function (response) {
            return test.addDataset("rooms", content).then(function (response) {
                expect(response.code).to.deep.equal(201);
            }).catch(function (e) {
                console.log("Error Code : 1");
                expect.fail();
            });
        }).catch(function (e) {
            console.log("Error Code : 2");
            expect.fail();
        });
    });



    it("Should remove rooms from disk", async function () {
        let content = await readFile("rooms.zip");

        return test.addDataset("rooms", content).then(function (response) {
            return test.removeDataset("rooms").then(function (response) {
                expect(response.code).to.deep.equal(204);
            }).catch(function (e) {
                console.log("Error: removing rooms data and file failed");
                expect.fail();
            });
        }).catch(function (e) {
            console.log("Error: adding rooms file failed");
            expect.fail();
        });
    });

    it("Should be unable to remove non-existing Room from disk", async function () {
        let content = await readFile("rooms.zip");

        return test.addDataset("rooms", content).then(function (response) {
            return test.removeDataset("r").then(function (response) {
                expect.fail();
            }).catch(function (e) {
                expect(e.code).to.deep.equal(404);
            });
        }).catch(function (e) {
            console.log("Error: adding file failed");
            expect.fail();
        });
    });

    it("Should be unable to remove rooms as it already was removed", async function () {
        let content = await readFile("rooms.zip");

        return test.addDataset("rooms", content).then(function (response) {
            return test.removeDataset("rooms").then(function (response) {
                console.log("Good: removing file done");
                return test.removeDataset("rooms").then(function (response) {
                    expect.fail();
                }).catch(function (e) {
                    console.log("Good: no file to be removed");
                    expect(e.code).to.deep.equal(404);
                });
            }).catch(function (e) {
                console.log("Error: removing file failed");
                expect.fail();
            });
        }).catch(function (e) {
            console.log("Error: adding file failed");
            expect.fail();
        });
    });

});
