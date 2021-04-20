const { MongoClient, ObjectId } = require('mongodb');
const debug = require("debug")("app:mongo");
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName

// connection to mlab
//const MONGO_URI = `mongodb://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/?authSource=${DB_NAME}`;

// connection to MongoDB Atlas
const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`

class MongoLib {
    constructor(){
        // this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true })
        this.client = new MongoClient(MONGO_URI, { useUnifiedTopology: true })
        this.dbName = DB_NAME;
    }

    async connect() {
        if(!MongoLib.connection) {
            try {
                await this.client.connect()
                debug('Connected successfully to mongo')
                MongoLib.connection = this.client.db(this.dbName)
              } catch (error) {
                debug(error)
              }
        }
        return  MongoLib.connection
    };

    async getAll(collection, query){
        try {
            const db = await this.connect();
            return await db
                .collection(collection)
                .find(query)
                .toArray();

        } catch (error) {
            debug(error);
        }
    }

    async get(collection, id){
        try {
            const db = await this.connect();
            return await db
                .collection(collection)
                .findOne({ _id: ObjectId(id) });

        } catch (error) {
            debug(error);
        }
    }

    async create(collection, data){
        try {
            const db = await this.connect();
            const result = await db
                .collection(collection)
                .insertOne(data);
            return result.insertedId;

        } catch (error) {
            debug(error);
        }
    }

    async update(collection, id, data){
        try {
            const db = await this.connect();
            const result = await db
                .collection(collection)
                .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
            
            return result.upsertedId || id;

        } catch (error) {
            debug(error);
        }
    }

    async delete(collection, id){
        try {
            const db = await this.connect();
            await db
                .collection(collection)
                .deleteOne({ _id: ObjectId(id) });
            
            return id;

        } catch (error) {
            debug(error);
        }
    }
}

module.exports = MongoLib;