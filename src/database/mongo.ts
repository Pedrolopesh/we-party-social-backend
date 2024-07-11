import { MongoClient as Mongo, Db } from 'mongodb';

export const MongoClient = {
    client: undefined as unknown as Mongo,
    db: undefined as unknown as Db,

    async connect() {
        const url = process.env.MONGODB_URL || '';
        const username = process.env.MONGO_USERNAME;
        const password = process.env.MONGO_PASSWORD;

        const client = new Mongo(url, {
            auth: {
                username, password
            }
        });
        const db = client.db('full-cripto-db');

        this.client = client;
        this.db = db;

        console.log('Connected to MongoDB ...');
    }
}