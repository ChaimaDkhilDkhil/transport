"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const transport_model_1 = __importDefault(require("./transport.model"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const memoryStore = new session.MemoryStore();
const kcConfig = {
    clientId: 'flyware-client',
    bearerOnly: true,
    serverUrl: 'http://localhost:8080',
    realm: 'Flyware-Realm',
    publicClient: true
};
const keycloak = new Keycloak({ store: memoryStore }, kcConfig);
const eurekaHelper = require('./eureka-helper');
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
}));
app.use(keycloak.middleware());
app.listen(PORT, () => {
    console.log("transport-server on 3000");
});
eurekaHelper.registerWithEureka('transport-server', PORT);
app.use(body_parser_1.default.json());
const uri = "mongodb://localhost:27017/transports";
mongoose_1.default.connect(uri, (err) => {
    if (err)
        console.log(err);
    else
        console.log("Mongo Database connected successfuly");
});
app.get("/transports", keycloak.protect('realm:admin'), (req, resp) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.size) || 10;
    transport_model_1.default.paginate("", { page: page, limit: pageSize }, (err, result) => {
        if (err) {
            resp.status(500).send(err);
        }
        else {
            resp.send(result);
        }
    });
});
// app.get("/transports",(req:Request,resp:Response)=>{
//   Transport.find((err,transports)=>{
//      if(err) resp.status(500).send(err);
//      else resp.send(transports);
// });
// });
app.get("/transports/:id", (req, resp) => {
    transport_model_1.default.findById(req.params.id, (err, transport) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(transport);
    });
});
app.put("/transports/:id", (req, resp) => {
    let transport = transport_model_1.default.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("transport update");
    });
});
app.delete("/transports/:id", (req, resp) => {
    let transport = transport_model_1.default.findByIdAndDelete(req.params.id, req.body, (err) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("transport deleted");
    });
});
app.get('/transportsSearch', (req, res) => {
    var _a, _b;
    const search = req.query.search || '';
    const page = parseInt(((_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) || '1');
    const size = parseInt(((_b = req.query.size) === null || _b === void 0 ? void 0 : _b.toString()) || '5');
    transport_model_1.default.paginate({ title: { $regex: ".*(?i)" + search + ".*" } }, { page: page, limit: size }, (err, transports) => {
        if (err)
            res.status(500).send(err);
        else
            res.send(transports);
    });
});
app.post("/transports", (req, resp) => {
    let transport = new transport_model_1.default(req.body);
    transport.save(err => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(transport);
    });
});
app.get("/", (req, resp) => {
    resp.send("yyyyyyy");
});
app.listen(8085, () => {
    console.log("server srtared");
});
