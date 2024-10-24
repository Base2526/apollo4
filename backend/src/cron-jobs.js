const cron = require('node-cron');
import product from './model/ProductModel';
import pubsub from './pubsub'
import * as Utils from "./utils"

const _ = require('lodash');
const moment = require('moment');

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');


// Function to delete old backups
const deleteOldBackups = () => {
  const backupDir = path.join(__dirname, '../backups');
  fs.readdir(backupDir, (err, files) => {
    if (err) {
      console.error(`Error reading backup directory: ${err.message}`);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(backupDir, file);
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          console.error(`Error getting stats for file: ${statErr.message}`);
          return;
        }

        const now = Date.now();
        const endTime = new Date(stats.mtime).getTime() + 5 * 24 * 60 * 60 * 1000; // 5 days

        if (now > endTime) {
          fs.rm(filePath, { recursive: true, force: true }, rmErr => {
            if (rmErr) {
              console.error(`Error deleting old backup: ${rmErr.message}`);
              return;
            }

            console.log(`Deleted old backup: ${filePath}`);
          });
        }
      });
    });
  });
};

// Function to perform the backup
// const backupMongoDB = () => {
//   const backupDir = path.join(__dirname, 'backups');
  
//   const date = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, '');
//   const backupPath = path.join(backupDir, `backup_${date}`);

//   console.log("@2 backupMongoDB :", backupPath)

//   const command = `docker exec a4_mongo mongodump --uri="${process.env.MONGO_URI}" --out="${backupPath}"`;

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error during backup: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`Stderr: ${stderr}`);
//       return;
//     }
//     console.log(`Backup successful: ${backupPath}`);
//   });
  
//   // Delete old backups
//   deleteOldBackups();
// }

// // At minute 0 past every 6th hour.
// cron.schedule('0 */6 * * *', backupMongoDB, {
// // cron.schedule('*/5 * * * *', backupMongoDB, {
//   scheduled: true,
//   timezone: 'Asia/Bangkok' // Adjust timezone as needed
// });

// // Schedule the cron job
// cron.schedule('0 1 * * *', async() => {
//   console.log('Running a task every At 01:00 AM');
//   await Utils.calTree(); // Replace `xx` with your specific function
// });

// Function to back up MongoDB collections
const backupMongoDB = () => {
  const dbName = 'insurance'; // Replace with your database name
  const collections = ['member', 'node', 'product']; // List your collections to back up
  const mongoUri = process.env.MONGO_URI;//'mongodb://username:password@localhost:27017'; // Replace with your MongoDB URI

  collections.forEach(collection => {
    const outputFilePath = `./backups/${collection}-${new Date().toISOString()}.json`; // Output file path
    const command = `mongoexport --uri="${mongoUri}" --db=${dbName} --collection=${collection} --out=${outputFilePath} --jsonArray`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error exporting collection ${collection}: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`Backup of collection ${collection} completed: ${outputFilePath}`);
    });
  });
};

// Schedule the backup every 6 hours
cron.schedule('5 * * * *', backupMongoDB, {
  scheduled: true,
  timezone: 'Asia/Bangkok', // Adjust timezone as needed
});