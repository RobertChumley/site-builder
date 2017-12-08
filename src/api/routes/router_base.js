import { Router } from 'express';
let bodyParser = require('body-parser');

export class RouterBase{
    constructor(params={disableDefault:false}) {
        this.router = new Router();
        this._setupPreProcessing();
        if(params.disableDefault)
            this._setupDefaultRoutes();
    }
    router(){
        return this.router;
    }
    async search(req, res) {

    }
    async upload(req, res) {

    }
    async schema(req,res){

    }
    async getById(id, req, res) {

    }
    async post(req, res) {

    }
    async put(id, req, res) {

    }
    async patch(id, req, res) {

    }
    async deleteById(id, req, res) {

    }
    _setupDefaultRoutes() {

        this.router.route('/_schema').get((req,res) =>{
            this.schema(req, res).then(data => data).catch(err => res.json({ error: true, message: err.toString() }));
        });
        this.router.route('/upload').post((req,res) =>{
            this.upload(req, res).then(data => data).catch(err => res.json({ error: true, message: err.toString() }));
        });
        this.router.route('/').get((req, res) => {
            this.search(req, res).then(data => data).catch(err => res.json({ error: true, message: err.toString() }));
        }).post((req, res) => {
            this.post(req, res).then(data => data).catch(err => res.json({ error: true, message: err.toString() }));
        });
        this.router.param('id', (req, res, next, id) => {
            req.id = id;
            next();
        });
        this.router.route('/:id').get((req, res) => {
            this.getById(req.id, req, res).then(data => data)
                .catch(err => res.json({ error: true, message: err.toString() }));
        }).put((req, res) => {
            this.put(req.id, req, res).then(data => data)
                .catch(err => res.json({ error: true, message: err.toString() }));
        }).patch((req, res) => {
            this.patch(req.id, req, res).then(data => data)
                .catch(err => res.json({ error: true, message: err.toString() }));
        }).delete((req, res) => {
            this.deleteById(req.id, req, res).then(data => data)
                .catch(err => res.json({ error: true, message: err.toString() }));
        });
    }

    _setupPreProcessing() {
        // Parse JSON
        this.router.use(bodyParser.json()); // for parsing application/json
        this.router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    }
}