import express from 'express';
import cors from 'cors';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
import lyricsRouter from './routes/lyriqs';
const port = process.env.PORT;
app.use(cors());

AWS.config.update({
    region: process.env.REGION
});
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const s3BucketName = process.env.S3_BUCKET_NAME!;
const s3KeyName = "page_counter.json";
const s3Body = { counter: 0 }
const s3Params = {
    Bucket: s3BucketName,
    Key: s3KeyName,
    Body: {},
    ContentType: 'application/json'
};
const s3CheckParams = {
    Bucket: s3BucketName,
    Key: s3KeyName
}

app.get('/counter', (_, res) => {
    console.log("⚡️ Received request to lyriqs.io");
    s3Body.counter++;
    s3Params.Body = JSON.stringify(s3Body);
    setCounter();
    res.send(`${s3Body.counter}`);
});

app.use('/songs?', lyricsRouter);

app.listen(port, () => {
    console.log(`⚡️ Server is running at http://localhost:${port}`);
    initializeBucket();
});

function initializeBucket() {
    s3.createBucket({ Bucket: s3BucketName })
        .promise()
        .then(() => {
            console.log(`✅ Created bucket: ${s3BucketName}`);
            checkCounterObj();
        })
        .catch((err) => {
            if (err.statusCode == 409) {
                checkCounterObj();
            } else {
                console.log(`❌ Error creating bucket: ${err}`);
            }
        });
}

function checkCounterObj() {
    // first, check if the object exists in the bucket
    s3.headObject(s3CheckParams)
        .promise()
        .then((metadata) => {
            if (metadata) {
                // object already exists: get actual object and update counter value
                console.log(`ℹ️ Counter already initialized in ${s3BucketName}/${s3KeyName}`);
                s3.getObject(s3CheckParams)
                    .promise()
                    .then((data) => {
                        s3Body.counter = JSON.parse(data.Body?.toString('utf-8')!).counter;
                        console.log(`ℹ️ Counter value: ${s3Body.counter}`);
                    })
                    .catch(error => {
                        // error ocurred while getting object from bucket
                        console.log(`❌ Error getting object '${s3KeyName}': ${error}`);
                    })
            } else {
                // object does not exist: initialize object with counter=0
                console.log(`⚡️ Initializing counter in ${s3BucketName}/${s3KeyName}`);
                s3Params.Body = JSON.stringify(s3Body);
                setCounter();
            }
        })
        .catch(error => {
            // error occurred while checking if object exists in bucket
            console.log(`❌ Error checking object '${s3KeyName}': ${error}`);
        });
}

function setCounter() {
    s3.putObject(s3Params)
        .promise()
        .then(() => {
            console.log(`✅ Uploaded counter=${s3Body.counter} to ${s3BucketName}/${s3KeyName}`);
        })
        .catch((err: Error) => {
            console.log(`❌ Error updating counter: ${err}`);
        });
}