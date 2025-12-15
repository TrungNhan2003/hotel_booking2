const mongoose = require('mongoose');
const Photo = require('../collection-currentAvailableHotelsPhoto/defineSchema'); // your schema file
const { settingUpTheConnection } = require(
    '../../../../tripadvisorApi/ingestToMongoDB/mongodbUtils'
)
async function migrate() {
    const connect = await settingUpTheConnection()
    const hotel_info_db = connect.db("hotel_info");
    const docs = await hotel_info_db.collection('currentAvailableHotelsPhoto').find({}).toArray();
    for (const doc of docs) {
        if (!doc.data) continue;
        const update = {
            id: doc.data.id,
            is_blessed: doc.data.is_blessed,
            caption: doc.data.caption,
            published_date: doc.data.published_date,
            images: doc.data.images,
            album: doc.data.album,
            source: doc.data.source
        };

        await mongoose.connection.collection('photos').updateOne(
            { _id: doc._id },
            {
                $set: update,
                $unset: { data: "" } // remove the old field
            }
        );
    }

    console.log("Migration completed.");
    process.exit();
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
