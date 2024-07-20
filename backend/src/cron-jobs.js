const cron = require('node-cron');
// import { Supplier, Transition} from './model'
import pubsub from './pubsub'
// import { checkBalance, checkBalanceBook } from './utils'

// import * as Constants from "./constants"

const _ = require('lodash');
const moment = require('moment');

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// MongoDB connection details
// const mongoUri = 'mongodb://root:example@localhost:27017/admin';
const backupDir = path.join(__dirname, 'backups');

console.log(">>>>> cron-jobs :", process.env.MONGO_URI)

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Function to delete old backups
const deleteOldBackups = () => {
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
const backupMongoDB = () => {
  const date = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, '');
  const backupPath = path.join(backupDir, `backup_${date}`);

  const command = `docker exec mlm_mongo mongodump --uri="${process.env.MONGO_URI}" --out="${backupPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during backup: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Backup successful: ${backupPath}`);
  });
  
  // Delete old backups
  deleteOldBackups();
}

// At minute 0 past every 6th hour.
cron.schedule('0 */6 * * *', backupMongoDB, {
  scheduled: true,
  timezone: 'Asia/Bangkok' // Adjust timezone as needed
});

// cron.schedule('*/5 * * * *', async() => {
//   console.log('[Start] Run task every 5 minute :', new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
//   try{
//     // let users = await User.find({})
//     // //////////////// clear book ////////////////
//     // let cleans = []
//     // let suppliers = await Supplier.find({buys: {$elemMatch:{selected: 0}}});
//     // await Promise.all(_.map(suppliers, async(supplier)=>{
//     //                     // _.map(supplier.buys, (buy)=>{
//     //                     //   let now       = moment(new Date());     // todays date
//     //                     //   let end       = moment(buy.createdAt);  // another date
//     //                     //   let duration  = moment.duration(now.diff(end));
//     //                     //   console.log( "duration :", buy, duration.asMinutes() )
//     //                     //   if( duration.asMinutes() <= 1 || n.selected == 1 ) {
//     //                     //   }
//     //                     // })

//     //                     let Ids = []
//     //                     let buys = supplier.buys
//     //                     let tranIds = _.groupBy(buys, "transitionId")
//     //                     _.map(tranIds, async(tranId) => {
//     //                       let updateTransition   = true
//     //                       let transitionId       = ""
//     //                       _.map(tranId, (v, i) => {
//     //                         transitionId = v.transitionId

//     //                         let now = moment(new Date());
//     //                         let end = moment(v.createdAt);
//     //                         let duration = moment.duration(now.diff(end));

//     //                         if(duration.asHours() < 2){
//     //                           updateTransition = false
//     //                         }
//     //                       });

//     //                       if( updateTransition && !_.isEmpty(transitionId) ){
//     //                         Ids = [...Ids, transitionId]
//     //                         await Transition.updateOne({ _id: transitionId, status: Constants.WAIT }, { status: Constants.REJECT });
//     //                       }
//     //                     });

//     //                     let newBuys = _.filter(buys, (v) => !_.includes(Ids, v.transitionId))
//     //                     console.log("Run task every minute #3 :", buys, newBuys, Ids)
//     //                     if(!_.isEqual(newBuys, buys)){
//     //                       await Supplier.updateOne({ _id: supplier._id }, { buys: newBuys });
//     //                     }

//     //                     // let { buys } = supplier
//     //                     // let users = [];
//     //                     // let newBuys = _.transform(
//     //                     //   buys,
//     //                     //   (result, n) => {
//     //                     //     var now = moment(new Date());  // todays date
//     //                     //     var end = moment(n.createdAt); // another date
//     //                     //     var duration = moment.duration(now.diff(end));
//     //                     //     // console.log("duration :", duration.asMinutes(), duration.asHours())
//     //                     //     if( duration.asMinutes() <= 1 || n.selected == 1) {
//     //                     //       result.push(n);
//     //                     //     }else{
//     //                     //       users.push(n.userId)
//     //                     //     }
//     //                     //   },
//     //                     //   []
//     //                     // );
//     //                     // console.log("cron.schedule :", newBuys, buys)
//     //                     // if(!_.isEqual(newBuys, buys)){
//     //                     // let tran = await Transition.updateOne({ refId: supplier?._id, userId: current_user?._id, status: Constants.WAIT });
//     //                     //   try{
//     //                     //     await Supplier.updateOne({ _id: supplier?._id }, { ...supplier._doc, buys: newBuys });
//     //                     //     let newSupplier = await Supplier.findById(supplier?._id)
//     //                     //     pubsub.publish("SUPPLIER_BY_ID", {
//     //                     //       supplierById: { mutation: "AUTO_CLEAR_BOOK", data: newSupplier },
//     //                     //     });
//     //                     //     pubsub.publish("SUPPLIERS", {
//     //                     //       suppliers: { mutation: "AUTO_CLEAR_BOOK", data: newSupplier },
//     //                     //     });
//     //                     //     console.log("ping :AUTO_CLEAR_BOOK AUTO_CLEAR_BOOK ", newSupplier)
//     //                     //     // if(!_.isEmpty(users)){
//     //                     //     //   _.map(_.uniqWith(users, _.isEqual), async(userId)=>{
//     //                     //     //     pubsub.publish("ME", {
//     //                     //     //       me: { mutation: "BOOK", data: {userId, data: { /* balance: (await checkBalance(userId)).balance*/ ...await checkBalance(userId) , balanceBook: await checkBalanceBook(userId) } } },
//     //                     //     //     });
//     //                     //     //   })
//     //                     //     // }
//     //                     //   }catch(error){}
//     //                     // }
//     // }))
//     // //////////////// clear book ////////////////

//     console.log('[End] Run task every 5 minute :', new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
//   } catch(err) {
//     console.log("cron error :", err)
//   }
// });

// 0 2 * * * /path/to/your/mongo_backup.sh
