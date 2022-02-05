var chai = require('chai')
var chaihttp = require('chai-http')
var expect = chai.expect
chai.use(chaihttp)

describe('testing the restapi',()=>{
    it("should return status 200 for health", (done) => {
        chai.request("http://localhost:6900")
        .get('/health')
        .then((res)=>{
            expect(res).to.have.status(200)
            done()
        })
        .catch((err) => {
            throw err
        })
    })

    it("should return status 200 for users", (done) => {
        chai.request("http://localhost:6900")
        .get('/users')
        .then((res)=>{
            expect(res).to.have.status(200)
            done()
        })
        .catch((err) => {
            throw err
        })
    })

    it("should return status 200 for addusers", (done) => {
        chai.request("http://localhost:6900")
        .post('/addUser')
        .send({"name":"test","city":"testCity","phone":"testPhone","role":"testRole","isActive":"testActive"})
        .then((res)=>{
            expect(res).to.have.status(200)
            done()
        })
        .catch((err) => {
            throw err
        })
    })
})