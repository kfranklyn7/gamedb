const { MongoClient } = require('mongodb');

async function run() {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const db = client.db('gamedb');

    const game = await db.collection('games').findOne({ name: /Mario/i });
    console.log("Game ID:", game._id, "Name:", game.name);
    console.log("Platforms:", game.platforms);
    console.log("Genres:", game.genres);
    console.log("Themes:", game.themes);
    console.log("Involved Companies:", game.involved_companies);

    await client.close();
}

run().catch(console.dir);
