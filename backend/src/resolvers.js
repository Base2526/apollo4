import { withFilter } from 'graphql-subscriptions';
import _ from "lodash";
import FormData from "form-data";
import cryptojs from "crypto-js";
import deepdash from "deepdash";
deepdash(_);
import * as fs from "fs";
import { GraphQLUpload } from 'graphql-upload';
import moment from "moment";
import jwt from 'jsonwebtoken';

import pubsub from './pubsub'
import AppError from "./utils/AppError"
import logger from "./utils/logger";
import * as cache from "./cache"
import * as Constants from "./constants"
import * as Model from "./model"
import * as Utils from "./utils"
import connection from './mongo'
import { createXMLData } from './utils/xmlGenerator'; 
import { getPositions, findPositionIds_levelLess } from "./utils/positionsCache"

const mongoose = require('mongoose');

export default {
  Query: {
    /*
    ดึงข้อมูล Tree ข้อมูลของ user แต่ละคน
    */
    async test_fetch_node(parent, args, context, info){
      let start = Date.now()
      let { req } = context
      let { _id } = args

      let { status, current_user } =  await Utils.checkAuth(req);
      if(!status){
        throw new AppError(Constants.ERROR, "current user empty")
      }

      let role = Utils.checkRole(current_user)
      // if( role !== Constants.ADMINISTRATOR ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied')

      /*
      เราต้องเอา _id user เพือหา _id node ก่อน แล้วใช้ _id node วิ่งหาข้อมูล
      */
      // let rootNode = await Model.Node.findOne({'current.ownerId': current_user._id, 'current.isParent': true });
      // if(_.isEmpty(rootNode)){
      //   throw new AppError(Constants.ERROR, "current user empty")
      // }

      // if(role === Constants.ADMINISTRATOR){

        let rootNode = await Model.Node.findOne({'current.ownerId': current_user._id, 'current.isParent': true });
        if(_.isEmpty(rootNode)){
          throw new AppError(Constants.ERROR, "current user empty")
        }
        let nodeId = rootNode._id

        const limit = false;
        const level = 1;
        console.log(`Fetching data for nodeId: ${nodeId}`);
    
        const node = await Model.Node.findById(nodeId);
        console.log(`Node fetched:`, node);
    
        if (node) {
            const trees = await Utils.buildTree(nodeId, level, limit);
            
            const owner = await Model.Member.findById(node.current.ownerId);
            // console.log(`Owner fetched:`, owner);
    
            const result = [{
                title: `parentNodeId: ${node.current.parentNodeId}, ownerId: ${node.current.ownerId}, number: ${node.current.number}, level: ${ level }, isParent: ${node.current.isParent}`,
                key: node._id.toString(),
                node,
                owner,
                level,
                children: trees
            }];
    
            // console.log(`Resulting tree structure:`, JSON.stringify(result, null, 2));
    
    
            // Function to recursively extract key structure 
            // Get only field key to display
            // const getKeyStructure = (nodes) => {
            //     return nodes.map(node => {
            //         const result = { key: node.key };
            //         if (node.children) {
            //             result.children = getKeyStructure(node.children);
            //         }
            //         return result;
            //     });
            // };
            // console.log(`Resulting tree structure:`, JSON.stringify(getKeyStructure(result), null, 2));
        
            return {
              status: true,
              data: result,
              executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
            }
        }
    
        console.log(`No node found for nodeId: ${nodeId}`);
        return {
          status: true,
          data: [],
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
        /*
      }else{
        const session = await mongoose.startSession();
        session.startTransaction()
        try {
  
          let nodes =  await Model.Node.find({ 'current.ownerId': current_user._id });
          // Create an array of promises for each node
          let promises = nodes.map(async (node) => {
            // console.log("node.current.updatedAt :", node.current.updatedAt)
            if (node.current.updatedAt === null) {
              let node_children = await Utils.fetchTreeData(node._id, role !== Constants.ADMINISTRATOR)
              let history = await Model.Node.findOne({ _id: node._id })
              await Model.Node.updateOne({ _id: node._id }, { 'current.node_children' : node_children, 'current.updatedAt': Date.now(), history: Utils.createRevision(history) }, { session });
              // await session.commitTransaction();
  
              return true;
            }else{
              return false;
            }
          })
  
         
          // Use Promise.all to wait for all promises to resolve
          let result = await Promise.all(promises);
          // if(promises){
          // }
  
          console.log("result :", result)
  
          nodes =  await Model.Node.find({ 'current.ownerId': current_user._id });
          return {
            status: true,
            data: nodes,
            executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
          }
          // Log the results if needed
          console.log("All nodes processed:", results);
        }catch(error){
          await session.abortTransaction();
          console.log(`init #error ${error}`)
  
          throw new AppError(Constants.ERROR, error)
        }finally {
          session.endSession();
  
          console.log("init # : OK")
        }  
         
    
      }
         */
    },
    async test_fetch_tree_by_node_id(parent, args, context, info){
      let start = Date.now()
      let { req } = context
      let { node_id } = args

      let { status, current_user } =  await Utils.checkAuth(req);
      if(!status){
        throw new AppError(Constants.ERROR, "current user empty")
      }

      // let trees = await Utils.fetchTreeData(node_id)

      let timePeriod= new Date();
      let trees = await Utils.calculateAmount(node_id, timePeriod)

      return {
        status: true,
        data: trees,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async dblog(parent, args, context, info){
      let start = Date.now()
      let { req } = context

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied')

      let dblogs = await Model.Dblog.find({})
      return {  status: true,
                data:dblogs,
                executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds` }

    },
    async members(parent, args, context, info) {
      let start = Date.now()
      let { req } = context

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)

      if( role !== Constants.ADMINISTRATOR && role !== Constants.AUTHENTICATED ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      let members =  await Model.Member.aggregate([
                                                    {
                                                      $lookup: {
                                                        localField: "_id",
                                                        from: "logUserAccess",
                                                        foreignField: "current.userId",
                                                        as: "logAccess"
                                                      }
                                                    },
                                                    {
                                                      $unwind: {
                                                        path: "$logAccess",
                                                        preserveNullAndEmptyArrays: true
                                                      }
                                                    }
                                                  ])
      return {
        status:true,
        data: members,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async member(parent, args, context, info) {
      let start = Date.now()
      let { req } = context
      let { _id } = args

      try {
        console.log("member @1 :", _id)
        let { current_user } =  await Utils.checkAuth(req);
        let role = Utils.checkRole(current_user)

        if( role !== Constants.ADMINISTRATOR && role !== Constants.AUTHENTICATED ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

        let data = await Model.Member.findById(_id)

        console.log("member @2 :", data)
        return {
          status:true,
          data,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch (error) {
        new AppError(Constants.UNAUTHENTICATED, 'permission denied')
      }
    },
    async files(parent, args, context, info) {
      let start = Date.now()
      let { req } = context

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR && role !== Constants.AUTHENTICATED ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      let files = await Model.File.aggregate([
                                                {
                                                  $lookup: {
                                                    localField: "userId",
                                                    from: "member",
                                                    foreignField: "_id",
                                                    as: "creator"
                                                  }
                                                },
                                                {
                                                  $unwind: {
                                                    path: "$creator",
                                                    preserveNullAndEmptyArrays: true
                                                  }
                                                }
                                              ])
      return {
        status:true,
        data: files,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async bills(parent, args, context, info) {
      let start = Date.now()
      let { req } = context

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)

      if( role !== Constants.ADMINISTRATOR && role !== Constants.AUTHENTICATED ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      let bills = await Model.Node.find({'current.ownerId': current_user._id})

      // Use Promise.all to resolve all promises in the map

      let timePeriod= new Date();
      
      bills = await Promise.all(
        _.map(bills, async (bill) => {
          // let trees = await Utils.fetchTreeData(bill._id);
          let trees = await Utils.calculateAmount(bill._id, timePeriod)
          return { ...bill._doc, node_child: trees };
        })
      );

      console.log("bills :", bills)
      return {
        status:true,
        data: bills,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async bill(parent, args, context, info) {
      let start = Date.now()
      let { req } = context
      let { _id } = args

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)

      if( role !== Constants.ADMINISTRATOR && role !== Constants.AUTHENTICATED ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      let bill = await Model.Node.findById(_id)
      return {
        status:true,
        data: bill,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async cals(parent, args, context, info) {
      let start = Date.now()
      let { req } = context
      // let { _id } = args

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)

      if( role !== Constants.ADMINISTRATOR ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      let cals = await Model.CalTree.aggregate([{
                                                  $lookup: {
                                                    localField: "userId",
                                                    from: "member",
                                                    foreignField: "_id",
                                                    as: "creator"
                                                  }
                                                },
                                                {
                                                  $unwind: {
                                                    path: "$creator",
                                                    preserveNullAndEmptyArrays: true
                                                  }
                                                }
                                              ])

      return {
        status:true,
        data: cals,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async products(parent, args, context, info) {
      let start = Date.now()
      let { req } = context

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR  && role !== Constants.AUTHENTICATED  ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      console.log("products :", current_user.current.packages)

      if( role === Constants.ADMINISTRATOR ){
        let products = await Model.Product.aggregate([
                                                      {
                                                        $addFields: {
                                                          ownerId: "$current.ownerId",
                                                        }
                                                      },
                                                      {
                                                        $lookup: {
                                                          localField: "ownerId",
                                                          from: "member",
                                                          foreignField: "_id",
                                                          as: "owner"
                                                        }
                                                      },
                                                      {
                                                        $unwind: {
                                                          path: "$owner",
                                                          preserveNullAndEmptyArrays: true
                                                        }
                                                      }
                                                      ]);
        return {
          status:true,
          data: products,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      }

      let products = await Model.Product.aggregate([
                                                    { $addFields: { ownerId: "$current.ownerId" } },
                                                    {
                                                      // $match: {
                                                      //   $or: [
                                                      //     { 'current.package_front': { $in: [current_user.current.packages] } },
                                                      //     { 'current.package_back': { $in: [current_user.current.packages] } }
                                                      //   ]
                                                      // }
                                                      
                                                      // ต้องมีการ check box 1 or 2 or 1 and 2 ถึงเราจะ check package_front, package_back 
                                                      $match: {
                                                        $or: [
                                                            {
                                                                // Case: product_type contains 1
                                                                'current.product_type': 1,
                                                                'current.package_front': { $in: [current_user.current.packages] }
                                                            },
                                                            {
                                                                // Case: product_type contains 2
                                                                'current.product_type': 2,
                                                                'current.package_back': { $in: [current_user.current.packages] }
                                                            },
                                                            {
                                                                // Case: product_type contains both 1 and 2
                                                                'current.product_type': { $all: [1, 2] },
                                                                $or: [
                                                                    { 'current.package_front': { $in: [current_user.current.packages] } },
                                                                    { 'current.package_back': { $in: [current_user.current.packages] } }
                                                                ]
                                                            }
                                                        ]
                                                      }
                                                    },
                                                    {
                                                      $lookup: {
                                                        localField: "ownerId",
                                                        from: "member",
                                                        foreignField: "_id",
                                                        as: "owner"
                                                      }
                                                    },
                                                    {
                                                      $unwind: {
                                                        path: "$owner",
                                                        preserveNullAndEmptyArrays: true
                                                      }
                                                    }
                                                  ]);
      return {
        status:true,
        data: products,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async product(parent, args, context, info) {
      let start = Date.now()
      let { req } = context

      let { _id } = args

      console.log("product :", args)

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR  && role !== Constants.AUTHENTICATED  ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      let product = await Model.Product.aggregate([{
                                                      $addFields: {
                                                        ownerId: "$current.ownerId"
                                                      }
                                                    },
                                                    { $match: { _id: mongoose.Types.ObjectId(_id) } },
                                                    {
                                                      $lookup: {
                                                        localField: "ownerId",
                                                        from: "member",
                                                        foreignField: "_id",
                                                        as: "owner"
                                                      }
                                                    },
                                                    {
                                                      $unwind: {
                                                        path: "$owner",
                                                        preserveNullAndEmptyArrays: true
                                                      }
                                                    }
                                                    ]);
      return {
        status:true,
        data: product.length > 0 ? product[0] : undefined,
        args,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async orders(parent, args, context, info) {
      let start = Date.now()
      let { req } = context

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)
      
      let orders = await Model.Order.aggregate([
                                                {
                                                  $addFields: {
                                                    ownerId: "$current.owner._id",  // Bring the nested field to the top level
                                                    // editerId: "$current.editer",   // Bring editerId to the top level
                                                    // productId: "$current.productIds.productId"
                                                  }
                                                },
                                                {
                                                  $lookup: {
                                                    localField: "ownerId",
                                                    from: "member",
                                                    foreignField: "_id",
                                                    as: "owner"
                                                  }
                                                },
                                                {
                                                  $unwind: {
                                                    path: "$owner",
                                                    preserveNullAndEmptyArrays: true
                                                  }
                                                },
                                                // Lookup to fetch the editer details from the "member" collection
                                                // {
                                                //   $lookup: {
                                                //     from: "member",  // Referencing the member collection
                                                //     localField: "editerId",  // Field from the current pipeline
                                                //     foreignField: "_id",  // Field from the member collection
                                                //     as: "editer"  // Output the result as "editer"
                                                //   }
                                                // },
                                                // {
                                                //   $unwind: {
                                                //     path: "$editer",
                                                //     preserveNullAndEmptyArrays: true  // Handle cases where there might be no editer
                                                //   }
                                                // },
                                                // Lookup to fetch the product details from the "Product" collection based on productIds array
                                                // {
                                                //   $lookup: {
                                                //     from: "product", // the collection you're referencing (Product collection)
                                                //     localField: "productId", // field in the Orders collection (array of ObjectId)
                                                //     foreignField: "_id", // field in the Product collection
                                                //     as: "productDetails" // field to store the resulting product details
                                                //   }
                                                // },
                                                // Add default fields if they are missing
                                                // {
                                                //   $addFields: {
                                                //     "owner.current.positionId": { $ifNull: ["$owner.current.positionId", mongoose.Types.ObjectId('6721098ce9dccb02aab4cb3e')] },
                                                //     // "editer.defaultField": { $ifNull: ["$editer.defaultField", "defaultValue"] },
                                                //     // "productDetails.defaultField": { $ifNull: ["$productDetails.defaultField", "defaultValue"] }
                                                //   }
                                                // }
                                              ]);     
                                  
      return {
        status: true,
        data: orders,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async order(parent, args, context, info) {
      let start = Date.now()
      let { req } = context

      let { _id } = args

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR  && role !== Constants.AUTHENTICATED ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      console.log("order :", _id)

      try{
        let order = await Model.Order.aggregate([ { $match: { _id: mongoose.Types.ObjectId(_id) } },
                                                  {
                                                    $addFields: {
                                                      // ownerId: "$current.ownerId",  // Bring the nested field to the top level
                                                      editerId: "$current.editer",   // Bring editerId to the top level
                                                      // productId: "$current.productIds.productId"
                                                    }
                                                  },
                                                  /*{
                                                    $lookup: {
                                                      localField: "ownerId",
                                                      from: "member",
                                                      foreignField: "_id",
                                                      as: "owner"
                                                    }
                                                  },
                                                  {
                                                    $unwind: {
                                                      path: "$owner",
                                                      preserveNullAndEmptyArrays: true
                                                    }
                                                  },
                                                  */
                                                  // Lookup to fetch the editer details from the "member" collection
                                                  {
                                                    $lookup: {
                                                      from: "member",  // Referencing the member collection
                                                      localField: "editerId",  // Field from the current pipeline
                                                      foreignField: "_id",  // Field from the member collection
                                                      as: "editer"  // Output the result as "editer"
                                                    }
                                                  },
                                                  {
                                                    $unwind: {
                                                      path: "$editer",
                                                      preserveNullAndEmptyArrays: true  // Handle cases where there might be no editer
                                                    }
                                                  },
                                                  // Lookup to fetch the product details from the "Product" collection based on productIds array
                                                  // {
                                                  //   $lookup: {
                                                  //     from: "product", // the collection you're referencing (Product collection)
                                                  //     localField: "productId", // field in the Orders collection (array of ObjectId)
                                                  //     foreignField: "_id", // field in the Product collection
                                                  //     as: "productDetails" // field to store the resulting product details
                                                  //   }
                                                  // },
                                                  ]);

        return {
          status:true,
          data: order.length > 0 ? order[0] : undefined,
          args,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      }catch(error){
        console.log("order error :", error)
        
        throw new AppError(Constants.ERROR, error)
      }
    },
    async purchases(parent, args, context, info) {
      let start = Date.now()
      let { req } = context

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR  && role !== Constants.AUTHENTICATED  ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)
        let purchases = await Model.Order.aggregate([
                                                  {
                                                    $match: {
                                                      "current.owner._id": current_user._id  // Replace xxxxx with the actual OwnerId value you're looking for
                                                    }
                                                  },
                                                  // {
                                                  //   $addFields: {
                                                  //     // ownerId: "$current.ownerId",  // Bring the nested field to the top level
                                                  //     productId: "$current.productIds.productId"
                                                  //   }
                                                  // },
                                                  /*{
                                                    $lookup: {
                                                      localField: "ownerId",
                                                      from: "member",
                                                      foreignField: "_id",
                                                      as: "owner"
                                                    }
                                                  },
                                                  {
                                                    $unwind: {
                                                      path: "$owner",
                                                      preserveNullAndEmptyArrays: true
                                                    }
                                                  },*/
                                                  // Lookup to fetch the product details from the "Product" collection based on productIds array
                                                  // {
                                                  //   $lookup: {
                                                  //     from: "product", // the collection you're referencing (Product collection)
                                                  //     localField: "productId", // field in the Orders collection (array of ObjectId)
                                                  //     foreignField: "_id", // field in the Product collection
                                                  //     as: "productDetails" // field to store the resulting product details
                                                  //   }
                                                  // },
                                                ]);                                      
      return {
        status: true,
        data: purchases,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async periods(parent, args, context, info) {
      let start = Date.now()
      let { req } = context

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR  && role !== Constants.AUTHENTICATED  ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)
        
     
      const user_period = await Model.Period.find({
        start: { $lte: current_user.createdAt }, // Start date is less than or equal to 'dateToFind'
        end: { $gte: current_user.createdAt },   // End date is greater than or equal to 'dateToFind'
      });

      if(_.isEmpty(user_period)) throw new AppError(Constants.ERROR, 'user_period error', current_user)

      let periods = await Model.Period.aggregate([
                                                    {
                                                      $match: {
                                                        start: { $gte: user_period[0].start }, // Start date is greater than or equal to 1st September 2024
                                                        end: { $lte: new Date() }          // End date is less than or equal to the current date
                                                      }
                                                    }
                                                  ]);

      const currentPeriod = await Model.Period.findOne({
          start: { $lte: new Date() }, // Start date should be less than or equal to now
          end: { $gte: new Date() }    // End date should be greater than or equal to now
      });

      // 4. Combine results
      if (currentPeriod) {
        periods.push(currentPeriod); // Include the current period in the result
      }

      console.log("periods :", periods)

      return {
        status: true,
        data: periods,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async positions(parent, args, context, info) {
      let start = Date.now()
      let { req } = context

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR  && role !== Constants.AUTHENTICATED  ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)
        
      let positions = await Model.Position.find({});
      // console.log("positions :", positions);

      return {
        status: true,
        data: positions,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },  
  },
  Upload: GraphQLUpload,
  Mutation: {  
    async login(parent, args, context, info) {
      let start = Date.now()
      let {input} = args

      console.log("login :", input, process.env.MONGO_PASSWORD_SECRET, cryptojs.AES.encrypt( input.password, process.env.MONGO_PASSWORD_SECRET).toString())

      /*
      let username = input.username.toLowerCase()

      let user = Utils.emailValidate().test(username) 
      if(Utils.emailValidate().test(username)){
        user = await Utils.getUser({email: username}, false)
        if( _.isNull(user) ){
          throw new AppError(Constants.USER_NOT_FOUND, 'USER NOT FOUND')
        }
        if(!_.isEqual(cryptojs.AES.decrypt(user?.password, process.env.MONGO_PASSWORD_SECRET).toString(cryptojs.enc.Utf8), input.password)){
          
          console.log("e :", user?.password, input?.password, cryptojs.AES.decrypt(user?.password, process.env.MONGO_PASSWORD_SECRET).toString(cryptojs.enc.Utf8))
          throw new AppError(Constants.PASSWORD_WRONG, 'PASSWORD WRONG')
        }
        user = await Utils.getUserFull({email: username})
      }else{
        user = await Utils.getUser({username}, false)
        if( _.isNull(user) ){
          throw new AppError(Constants.USER_NOT_FOUND, 'USER NOT FOUND')
        }
        if(!_.isEqual(cryptojs.AES.decrypt(user?.password, process.env.MONGO_PASSWORD_SECRET).toString(cryptojs.enc.Utf8), input.password)){
          console.log("e :", user?.password, input?.password, cryptojs.AES.decrypt(user?.password, process.env.MONGO_PASSWORD_SECRET).toString(cryptojs.enc.Utf8))
          throw new AppError(Constants.PASSWORD_WRONG, 'PASSWORD WRONG')
        }
        user = await Utils.getUserFull({username})
      }

      await Model.User.updateOne({ _id: user?._id }, { lastAccess : Date.now() });
      return {
        status: true,
        data: user,
        sessionId: await Utils.getSession(user?._id, input),
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
      */

      //  mlm login
      let username = input.username.toLowerCase()

      let user = Utils.emailValidate().test(username) 
      if(Utils.emailValidate().test(username)){
        // { "current.username": input.username?.toLowerCase() }
        user = await Utils.getMember({"current.email": username}, false)
        console.log("user : ", user)
        if( _.isNull(user) ){
          throw new AppError(Constants.USER_NOT_FOUND, 'USER NOT FOUND')
        }
        if(!_.isEqual(cryptojs.AES.decrypt(user?.current?.password, process.env.MONGO_PASSWORD_SECRET).toString(cryptojs.enc.Utf8), input.password)){
          
          console.log("e :", user?.current?.password, input?.password, cryptojs.AES.decrypt(user?.current?.password, process.env.MONGO_PASSWORD_SECRET).toString(cryptojs.enc.Utf8))
          throw new AppError(Constants.PASSWORD_WRONG, 'PASSWORD WRONG')
        }
        // user = await Utils.getUserFull({email: username})
      }else{
        user = await Utils.getMember({"current.username":username}, false)
        console.log("user : ", user)
        if( _.isNull(user) ){
          throw new AppError(Constants.USER_NOT_FOUND, 'USER NOT FOUND')
        }
        if(!_.isEqual(cryptojs.AES.decrypt(user?.current?.password, process.env.MONGO_PASSWORD_SECRET).toString(cryptojs.enc.Utf8), input.password)){
          console.log("e :", user?.current?.password, input?.password, cryptojs.AES.decrypt(user?.current?.password, process.env.MONGO_PASSWORD_SECRET).toString(cryptojs.enc.Utf8))
          throw new AppError(Constants.PASSWORD_WRONG, 'PASSWORD WRONG')
        }
        // user = await Utils.getUserFull({username})
      }

      await Model.Member.updateOne({ _id: user?._id }, { "current.lastAccess" : Date.now() });
      return {
        status: true,
        data: user,
        sessionId: await Utils.getSession(user?._id, input),
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async register(parent, args, context, info) {
      let start     = Date.now()
      let { input } = args
      let { req } = context

      console.log("register :", args)
      
      // if(!_.isNull( await Utils.getMember({
      //                                       "$and": [{
      //                                           "current.username": input.username
      //                                       }, {
      //                                           "current.email": input.email
      //                                       }]
      //                                     } ) )) throw new AppError(Constants.ERROR, "EXITING USERNAME AND EMAIL", input)
      
      // if(!_.isNull( await Utils.getMember({ "current.username": input.username?.toLowerCase() }))) throw new AppError(Constants.ERROR, "EXITING USERNAME", input)
      if(!_.isNull( await Utils.getMember({ "current.email": input.email }) )) throw new AppError(Constants.ERROR, "EXITING EMAIL", input)
      if(!_.isNull( await Utils.getMember({ "current.idCard": input.idCard }) )) throw new AppError(Constants.ERROR, "EXITING ID CARD", input)
      if(!_.isNull( await Utils.getMember({ "current.tel": input.tel }) )) throw new AppError(Constants.ERROR, "EXITING TEL", input)
      
      let newInput =  {current: { ...input,  
                                  username: input.idCard,
                                  password: cryptojs.AES.encrypt( input.tel, process.env.MONGO_PASSWORD_SECRET).toString(),
                                  displayName: _.isEmpty(input.displayName) ? input.username : input.displayName ,
                                  car_brand: _.isEmpty(input.car_brand) ? "" : input.car_brand,
                                  car_model: _.isEmpty(input.car_model) ? "" : input.car_model,
                                  car_month_expired: _.isEmpty(input.car_month_expired) ? "" : input.car_month_expired,
                                  car_year_model: _.isEmpty(input.car_year_model) ? "" : input.car_year_model,
                                  lastAccess: Date.now(), 
                                  isOnline: true}
                      }

      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        let newMember = await Model.Member.create([newInput], { session });
        if (!newMember || newMember.length === 0) {
          throw new AppError("Member creation failed, returned undefined.");
        }

        let parentId     = mongoose.Types.ObjectId(input.parentId);
        let current_user = newMember[0];
        let packages     = input.packages;

        await Utils.createChildNodes(parentId, current_user, packages, session);

        let sessionId = await Utils.getSession(current_user?._id, input);

        // Commit the transaction
        await session.commitTransaction();

        return {
          status: true,
          data: current_user,
          sessionId,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      }catch(error){
        console.log("error @@@@@@@1 :", error)
  
        await session.abortTransaction();

        throw new AppError(Constants.ERROR, error)
      }finally {
        session.endSession();

        console.log("finally @@@@@@@1 :")
      }  
    },
    async bills(parent, args, context, info) {
      let start = Date.now()
      let { req } = context
      let { input } = args

      console.log("bills : ", input)

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR  && role !== Constants.AUTHENTICATED  ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      try {
        /*
        let bills = await Model.Node.find({'current.ownerId': current_user._id})

        // Use Promise.all to handle the asynchronous `map` calls.
        const results = await Promise.all(
          input.periods.map(async (period) => {

            const currentPeriod = await Model.Period.findById(period)
            if(!currentPeriod) throw new AppError(Constants.ERROR, `Period ${ period } is empty!`)

            // For each period, map over the bills and await `calculateAmount`.
            const billResults = await Promise.all(
              bills.map(async (bill) => {
                const trees = await Utils.calculateAmount(bill._id, currentPeriod);
                console.log("currentPeriod: ", currentPeriod, ", trees: ", trees);
                return { ...bill._doc, node_child: trees };
              })
            );
            return { period: currentPeriod, bills: billResults };
          })
        );
        */

        let nodeParent = await Model.Node.findOne({'current.ownerId': current_user._id, 'current.isParent': true });
        if (_.isEmpty(nodeParent)) {
            throw new Error("Parent node is empty.");
        }
  
        let nodes = [nodeParent._id];
        let billNodes = [nodeParent];
  
        while (true) {
            const children = await Model.Node.find({ 'current.ownerId': current_user._id,
                                                     'current.parentNodeId': { $in: nodes } });
            if (children.length === 0) break; // Exit loop if no more children are found
  
            billNodes = [...billNodes, ...children];
            nodes = children.map(node => node._id);
        }

        // 66fc0bffabef1f0072a05dbe
        const results = await Promise.all(
          input.periods.map(async (period) => {
            const currentPeriod = await Model.Period.findById(period)
            if(!currentPeriod) throw new AppError(Constants.ERROR, `Period ${ period } is empty!`)
            
            const billResults = await Promise.all(
              billNodes.map(async (bill) => {
                const trees = await Utils.calculateAmount(bill._id, currentPeriod);

                // const getKeyStructure = (nodes) => {
                //   return nodes.map(node => {
                //       const result = { key: node };
                //       if (node.children) {
                //           result.children = getKeyStructure(node.children);
                //       }
                //       return result;
                //   });
                // };
      
                // console.log(`Resulting tree structure:`, JSON.stringify(trees, null, 2));

                return { ...bill._doc, node_child: trees };
              })
            );
            return { period: currentPeriod, bills: billResults };
          })
        )
        
        return {
          status: true,
          input,
          data: results,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch (err) {
        console.log(err)
        throw new Error(`Error : ${ err }`);
      }
    },
    async bills_xml2js(parent, args, context, info) {
      let start = Date.now()
      let { req } = context
      let { input } = args

      console.log("bills_xml2js : ", input)

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR  && role !== Constants.AUTHENTICATED  ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      try {
        const xmlData = createXMLData(); // Function that generates XML
        return {
          status: true,
          data: xmlData,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      } catch (err) {
        throw new Error('Error generating XML');
      }
    },
    async address_delivery(parent, args, context, info) {
      let start = Date.now()
      let { req } = context
      let { input } = args
      
      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR && 
          role !== Constants.AUTHENTICATED  ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      const session = await mongoose.startSession();
      session.startTransaction()
      try{

        switch(input.mode){
          case 'added':{
            let newInput =  _.omit(input, ['mode']);
            await Model.Member.updateOne(
              { _id: current_user._id },
              { "current.address_delivery": newInput },
              { session }
            );
    
            await session.commitTransaction();
  
            pubsub.publish('USER_CONNECTED', { userConnected: 'A user connected' });
            console.log('Last access time updated successfully');
    
            return {
              status: true,
              executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
            }
          }

          case 'deleted':{
            await Model.Member.updateOne(
              { _id: current_user._id },
              { "current.address_delivery": {} },
              { session }
            );
    
            await session.commitTransaction();
    
            pubsub.publish('USER_CONNECTED', { userConnected: 'A user connected' });
            console.log('Last access time updated successfully');
    
            return {
              status: true,
              executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
            }
          }
        }
       
      } catch(error){
        await session.abortTransaction();
        console.log(`init #error ${error}`)

        throw new AppError(Constants.ERROR, error)
      }finally {
        session.endSession();
      }  
    },
    async calcute_plan_back(parent, args, context, info) {
      let start = Date.now()
      let { req } = context
      let { input } = args
      
      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR && 
          role !== Constants.AUTHENTICATED  ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      const session = await mongoose.startSession();
      session.startTransaction()
      try{
        // จะได้ Node แรก ของ owerId คนนี้
        let node_uid = await Model.Node.findOne({ 
                                                  'current.ownerId':  mongoose.Types.ObjectId(input.userId),
                                                  'current.isParent': true 
                                                })   

        console.log("calcute_plan_back input:", input, node_uid)
        if(node_uid){
          let owner   = await Model.Member.findById(input.userId);

          // Check Member ที่เราต้องการเช็ดตำแหน่งอะไร
          switch(owner.current.positionId.toString()){
            // กรณี owner มีตำแหน่ง BM
            case "6721098ce9dccb02aab4cb3e":{
              console.log(`@@@@@ Fast start (2) - start`);
              await Utils.calculate_fast_start(input);
              console.log(`@@@@@ Fast start (2) - end`);

              console.log("@@@@ BM");
              break;
            }
            // กรณี owner มีตำแหน่ง BS
            case "6721098ce9dccb02aab4cb3f":{
              console.log("@@@@ BS");
              break;
            }
            // BG
            case "6721098ce9dccb02aab4cb40":{
              console.log("@@@@ BG");
              break;
            }
            // BD
            case "6721098ce9dccb02aab4cb41":{
              console.log("@@@@ BD");
              break;
            }
            // BP
            case "6721098ce9dccb02aab4cb42":{
              console.log("@@@@ BP");
              break;
            }
          }

          console.log(`@@@@@ ค่าแนะนํา (3) - start`);
          await Utils.calculate_suggester(input);
          console.log(`@@@@@ ค่าแนะนํา (3) - end`);

          await Utils.calculate_ov(input);
          
          return {
            status: true,
            executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
          }   
        }
        
        // await session.commitTransaction();
        return {
          status: true,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }      
      } catch(error){
        await session.abortTransaction();
        console.log(`init #error ${error}`)

        throw new AppError(Constants.ERROR, error)
      }finally {
        session.endSession();
      }  
    },
    async calcute_recheck(parent, args, context, info) {
      let start = Date.now()
      let { req } = context
      let { input } = args
      
      console.log("calcute_recheck :", input)
      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !== Constants.ADMINISTRATOR ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      const session = await mongoose.startSession();
      session.startTransaction()
      try{

        // จะได้ Member โดย sort by positionId level most to less
        const members = await Model.Member.aggregate([
          // Unwind the positionIds array
          { $unwind: '$current.positionIds' },
  
          // Join init_position to get level information
          {
              $lookup: {
                  from: 'position', // Name of the init_position collection (adjust if needed)
                  localField: 'current.positionIds.positionId',
                  foreignField: '_id',
                  as: 'positionData',
              },
          },
  
          // Unwind the positionData array
          { $unwind: '$positionData' },
  
          // Sort by level in descending order
          { $sort: { 'positionData.level': -1 } },
  
          // Group to find the highest level for each member
          {
              $group: {
                  _id: '$_id',
                  member: { $first: '$$ROOT' }, // Keep the full member document
                  highestLevel: { $first: '$positionData.level' },
              },
          },
  
          // Sort members by the highest level
          { $sort: { highestLevel: -1 } },
        ]);

        let orders  =  await Model.Order.aggregate([ { $match: { 
                                                                // 'current.owner._id': { $in: ids },
                                                                // 'current.owner.positionId': { $ne: mongoose.Types.ObjectId("6721098ce9dccb02aab4cb3e") },
                                                                'current.type_plan': 2,
                                                                'current.status': 2,
                                                                'updatedAt': {
                                                                  $gte: new Date(input.startDate),
                                                                  $lte: new Date(input.endDate)
                                                                }
                                                      }} 
                                                    ]); 

        const promises = _.map(orders, async (order) => {
          const { owner: ownerOrder, products } = order.current;
          const priceDiscount = Utils.summaryPriceDiscount(products, ownerOrder.positionId);

          console.log(`priceDiscount : ${ priceDiscount }`)
        })
        await Promise.all(promises);
  
        
        // await session.commitTransaction();
        return {
          status: true,
          input,
          members,
          orders,
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }      
      } catch(error){
        await session.abortTransaction();
        console.log(`init #error ${error}`)
        throw new AppError(Constants.ERROR, error)
      }finally {
        session.endSession();
      }  
    },
    async order(parent, args, context, info) {
      let start = Date.now()
      let { req } = context
      let { input } = args

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !==Constants.ADMINISTRATOR &&
          role !==Constants.AUTHENTICATED ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)
          
      console.log("order : ", input)

      switch(input.mode){
        case 'added':{
          const session = await mongoose.startSession();
          session.startTransaction();
          try {
            const promises = _.map(input.products, async (vi) => {
              let { productId, quantities } = vi;
            
              // Fetch the product product from the database
              const product = await Model.Product.findOne({ _id: mongoose.Types.ObjectId(productId) });
            
              // Check if the product exists
              if (product) {
                // Check if the requested quantity is available
                if (quantities > product.current.quantity) {
                  throw new AppError(Constants.ERROR, "Quantity not enough");
                }
                
                // Update the product quantity in the database
                await Model.Product.updateOne(
                  { _id: mongoose.Types.ObjectId(productId) },
                  { $inc: { 'current.quantity': -quantities } },
                  { session }
                );
            
                let newProduct =  { _id: product._id, ...product.current }

                // Return the product and quantities
                return { product: newProduct, quantities };
              } else {
                // Return null or handle case when product doesn't exist
                return null; // or you can throw an error
              }
            });

            // Wait for all promises to resolve
            const results = await Promise.all(promises);

            // Filter out null results (if any documents were not found)
            const validResults = results.filter(result => result !== null);

            let positionId = Utils.getPositionId(current_user.current.positionIds)

            let current  = {  type_plan: input.type_plan,
                              products: validResults, 
                              owner: { _id: current_user._id, positionId },
                              status: 1 }

            await Model.Order.insertMany([{ current }], { session });
  
            // Commit the transaction
            await session.commitTransaction();
          }catch(error){
            console.log("error @@@@@@@1 :", error)
            await session.abortTransaction();
        
            throw new AppError(Constants.ERROR, error)
          }finally {
            session.endSession();
            console.log("finally @@@@@@@1 :")
          } 

          break;
        }
        case 'edited':{
          const session = await mongoose.startSession();
          session.startTransaction();
          try {
            // 2: cancel, 3: complete order
            switch( input.type ){
              
              case 3:{
                let promises = []; 
                if(!_.isEmpty(input.images)){
                  for (let i = 0; i < input.images.length; i++) {
                    const { createReadStream, filename, encoding, mimetype } = (await input.images[i]).file //await input.files[i];
          
                    const stream = createReadStream();
                    const assetUniqName = Utils.fileRenamer(filename);
                    let pathName = `/app/uploads/${assetUniqName}`;
          
                    const output = fs.createWriteStream(pathName)
                    stream.pipe(output);
          
                    const promise = await new Promise(function (resolve, reject) {
                      output.on('finish', async () => {
                        try {
                          let file = await Model.File.insertMany([{userId:current_user._id, url: `images/${assetUniqName}`, filename, encoding, mimetype }], {session});
                          resolve(file !== null ? file[0] : undefined );
                        } catch (error) {
                          reject(`Failed to save data to MongoDB: ${error.message}`);
                        }
                      });
                
                      output.on('error', async(err) => {
                        await Utils.loggerError(req, err.toString());
                        reject(err);
                      });
                    });
                    promises.push(promise);
                  }
                }
                let attachFile = await Promise.all(promises);
                
                let history = await Model.Order.findOne({ _id: mongoose.Types.ObjectId(input._id) }).session(session);
    
                const filter = { _id: input._id }
                const update = {
                  $set: {
                      'current.editer': current_user._id,
                      'current.status': input.type,
                      'current.message': input.message,
                      'current.attachFile': attachFile, // Add your file data here
                      'history': Utils.createRevision(history) // Update history as needed
                  }
                };
                await Model.Order.updateOne( filter , update, { session });

                // products, positions, profile
                if(input.type === 2){
                  // เช็ดยอดเพือปรับตำแหน่ง
                  let { owner, products } = history.current                  
                  // let positions = await Model.Position.find({});
                  // let ownerN    = await Model.Member.findById(owner._id).session(session);

                  let sumPrice = Utils.summaryPriceDiscount(products, owner.positionId);//  Math.ceil(Utils.summaryPriceDiscount(products, owner.positionId) + Utils.___tax_at_pay5(products, positions, owner.positionId) + Utils.summaryDelivery(products))
                  console.log( "เช็ดยอดเพือปรับตำแหน่ง :", sumPrice, owner)

                  let is_publish = false;
                  if(sumPrice >= 5000 && sumPrice <= 9999){
                    // BS
                    const codes = ['6721098ce9dccb02aab4cb3f', '6721098ce9dccb02aab4cb40', '6721098ce9dccb02aab4cb41', '6721098ce9dccb02aab4cb42'];
                    const check_includes =  _.includes(codes, owner.positionId.toString())

                    if(!check_includes){
                      is_publish = true;

                      const currentMember   = await Model.Member.findById(owner._id).session(session);
                      const latestVersion = currentMember?.current.positionIds.reduce((max, pos) => Math.max(max, pos.version), 0) || 0;

                      // Prepare the new positionId entry with incremented version
                      const newPositionId = {
                        version: latestVersion + 1,
                        positionId: mongoose.Types.ObjectId('6721098ce9dccb02aab4cb3f'),  // Update with appropriate ID if necessary
                        updatedAt: new Date(),
                      };

                      await Model.Member.updateOne(
                        { _id: owner._id },
                        // {  "current.positionId": mongoose.Types.ObjectId("6721098ce9dccb02aab4cb3f") },
                        {
                          $push: { 'current.positionIds': newPositionId },
                        },
                        { session }
                      );
                    }

                    console.log("@@@@@: BS")
                  }else if(sumPrice >= 10000 && sumPrice <= 49999){
                    // BG 
                    const codes = ['6721098ce9dccb02aab4cb40', '6721098ce9dccb02aab4cb41', '6721098ce9dccb02aab4cb42'];
                    const check_includes =  _.includes(codes, owner.positionId.toString())

                    if(!check_includes){
                      is_publish = true;

                      const currentMember   = await Model.Member.findById(owner._id).session(session);
                      const latestVersion = currentMember?.current.positionIds.reduce((max, pos) => Math.max(max, pos.version), 0) || 0;

                      // Prepare the new positionId entry with incremented version
                      const newPositionId = {
                        version: latestVersion + 1,
                        positionId: mongoose.Types.ObjectId('6721098ce9dccb02aab4cb40'),  // Update with appropriate ID if necessary
                        updatedAt: new Date(),
                      };

                      await Model.Member.updateOne(
                        { _id: owner._id },
                        // { "current.positionId": mongoose.Types.ObjectId("6721098ce9dccb02aab4cb40") },
                        {
                          $push: { 'current.positionIds': newPositionId },
                        },
                        { session }
                      );
                    }

                    console.log("@@@@@: BG")
                  }else if(sumPrice >= 50000 && sumPrice <= 199999){
                    // BD
                    const codes = ['6721098ce9dccb02aab4cb41', '6721098ce9dccb02aab4cb42'];
                    const check_includes =  _.includes(codes, owner.positionId.toString())

                    if(!check_includes){
                      is_publish = true;

                      const currentMember   = await Model.Member.findById(owner._id).session(session);
                      const latestVersion = currentMember?.current.positionIds.reduce((max, pos) => Math.max(max, pos.version), 0) || 0;

                      // Prepare the new positionId entry with incremented version
                      const newPositionId = {
                        version: latestVersion + 1,
                        positionId: mongoose.Types.ObjectId('6721098ce9dccb02aab4cb41'),  // Update with appropriate ID if necessary
                        updatedAt: new Date(),
                      };

                      await Model.Member.updateOne(
                        { _id: owner._id },
                        // { "current.positionId": mongoose.Types.ObjectId("6721098ce9dccb02aab4cb41") },
                        {
                          $push: { 'current.positionIds': newPositionId },
                        },
                        { session }
                      );
                    }
                    console.log("@@@@@: BD")
                  }else if(sumPrice >= 200000){
                    // BP
                    const codes = ['6721098ce9dccb02aab4cb42'];
                    const check_includes =  _.includes(codes, owner.positionId.toString())

                    if(!check_includes){
                      is_publish = true;

                      const currentMember   = await Model.Member.findById(owner._id).session(session);
                      const latestVersion = currentMember?.current.positionIds.reduce((max, pos) => Math.max(max, pos.version), 0) || 0;

                      // Prepare the new positionId entry with incremented version
                      const newPositionId = {
                        version: latestVersion + 1,
                        positionId: mongoose.Types.ObjectId('6721098ce9dccb02aab4cb41'),  // Update with appropriate ID if necessary
                        updatedAt: new Date(),
                      };

                      await Model.Member.updateOne(
                        { _id: owner._id },
                        // { "current.positionId": mongoose.Types.ObjectId("6721098ce9dccb02aab4cb42") },
                        {
                          $push: { 'current.positionIds': newPositionId },
                        },
                        { session }
                      );
                    }
                    console.log("@@@@@: BP")
                  }

                  if(is_publish){
                    const updatedProfile = await Model.Member.findById(history.current.owner._id).session(session); // Attach session to the query
                    console.log("@@@@@: ", updatedProfile, history.current.owner._id)
                    pubsub.publish("USER_CONNECTED", {
                      userConnected: {
                        mutation: "UPDATED_PROFILE",
                        data: updatedProfile,
                      }
                    });
                  }
                }

                // Commit the transaction
                await session.commitTransaction();

                break;
              }
              case 2:
              case 4:{
                let history = await Model.Order.findOne({ _id: mongoose.Types.ObjectId(input._id) })
                const filter = { _id: input._id }
                const update = {
                  $set: {
                      'current.editer': current_user._id,
                      'current.status': input.type,
                      'history': Utils.createRevision(history) // Update history as needed
                  }
                };
                await Model.Order.updateOne( filter , update, { session });

                 // Commit the transaction
                await session.commitTransaction();
                break;
              }
            }
          }catch(error){
            console.log("error @@@@@@@1 :", error)
            await session.abortTransaction();
        
            throw new AppError(Constants.ERROR, error)
          }finally {
            session.endSession();
            console.log("finally @@@@@@@1 :")
          } 

          break;
        }
      }

      return {
        status: true,
        input,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async tree_by_node_id(parent, args, context, info) {
      let start = Date.now()
      let { req } = context
      let { input } = args

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !==Constants.ADMINISTRATOR &&
          role !==Constants.AUTHENTICATED ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)
          
      console.log("order : ", input)

      let timePeriod= new Date();
      let trees = await Utils.calculateAmount(input.node_id, timePeriod)

      // let trees = await Utils.fetchTreeData(input.node_id)

      return {
        status: true,
        input,
        data: trees,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async product(parent, args, context, info) {
      let start = Date.now()
      let { req } = context
      let { input } = args

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !==Constants.ADMINISTRATOR &&
          role !==Constants.AUTHENTICATED ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)
          
      console.log("product : ", input)

      switch(input.mode){
        case 'added':{
          const session = await mongoose.startSession();
          session.startTransaction();
          try {
            // if(input?._isDEV === true){
            //   console.log(input?._isDEV, input);
            //   // let newInput = _.omit(input?.current, ['mode']);

            //   let current  = {...input?.current, ownerId: current_user._id }

            //   console.log("@@@1 product current : ", current)

            //   await Model.Product.insertMany([{ _isDEV: true, current }], { session });
            // }else{
              
              let promises = []; 
              if(!_.isEmpty(input.images)){
                for (let i = 0; i < input.images.length; i++) {
                  const { createReadStream, filename, encoding, mimetype } = (await input.images[i]).file //await input.files[i];
        
                  const stream = createReadStream();
                  const assetUniqName = Utils.fileRenamer(filename);
                  let pathName = `/app/uploads/${assetUniqName}`;
        
                  const output = fs.createWriteStream(pathName)
                  stream.pipe(output);
        
                  const promise = await new Promise(function (resolve, reject) {
                    // output.on('close', () => {
                    //   resolve("close");
                    // });

                    output.on('finish', async () => {
                      try {
                          // Save data to MongoDB after the stream has finished writing
                          // await saveDataToMongoDB(data, dbUrl, dbName, collectionName);
                          // console.log("finish : ", { url: `images/${assetUniqName}`, filename, encoding, mimetype })
                          
                          // let newInput ={current: { parentId: input?.parentId, childs: [{childId: current_user?._id}]}}  
                          let file = await Model.File.insertMany([{userId:current_user._id, url: `images/${assetUniqName}`, filename, encoding, mimetype }], {session});
                          // console.log("file ", file)
                          resolve(file !== null ? file[0] : undefined );
                      } catch (error) {
                          reject(`Failed to save data to MongoDB: ${error.message}`);
                      }
                    });
              
                    output.on('error', async(err) => {
                      await Utils.loggerError(req, err.toString());
        
                      reject(err);
                    });
                  });
                  promises.push(promise);
                }
              }

              let images = await Promise.all(promises);
              // console.log("All files processed: ", images );

              const newInput = _.omit(input, ['mode']);
              // let current  = {...newInput, images }
              // if(input?._isDEV === undefined){
              //   current  = { ...current, ownerId: current_user._id }
              // }

              let current  = {...newInput, images, ownerId: current_user._id }
              
              console.log("@@@2 product current : ", current, input?._isDEV)
              
              await Model.Product.insertMany([{ current }], { session });

            // }
            // Commit the transaction
            await session.commitTransaction();
          }catch(error){
              console.log("error @@@@@@@1 :", error)
              await session.abortTransaction();
          
              throw new AppError(Constants.ERROR, error)
          }finally {
              session.endSession();
              console.log("finally @@@@@@@1 :")
          }  

          break;
        }

        case 'edited':{
          const session = await mongoose.startSession();
          session.startTransaction();
          try {

            let promises = []; 
            let newFiles = [];
            if(!_.isEmpty(input.images)){
              for (let i = 0; i < input.images.length; i++) {
                try{
                  let fileObject = (await input.images[i]).file
    
                  if(!_.isEmpty(fileObject)){
                    const { createReadStream, filename, encoding, mimetype } = fileObject //await input.files[i];
      
                    const stream = createReadStream();
                    const assetUniqName = Utils.fileRenamer(filename);
                    let pathName = `/app/uploads/${assetUniqName}`;
          
                    const output = fs.createWriteStream(pathName)
                    stream.pipe(output);
          
                    const promise = await new Promise(function (resolve, reject) {
                      // output.on('close', () => {
                      //   resolve("close");
                      // });

                      output.on('finish', async () => {
                        console.log('@finish');
                        try {
                            // Save data to MongoDB after the stream has finished writing
                            // await saveDataToMongoDB(data, dbUrl, dbName, collectionName);
                            // console.log("finish : ", { url: `images/${assetUniqName}`, filename, encoding, mimetype })
                            
                            // let newInput ={current: { parentId: input?.parentId, childs: [{childId: current_user?._id}]}}  
                            let file = await Model.File.insertMany([{userId:current_user._id, url: `images/${assetUniqName}`, filename, encoding, mimetype }], {session});
                            // console.log("file ", file)
                            resolve(file !== null ? file[0] : undefined );
                        } catch (error) {
                            reject(`Failed to save data to MongoDB: ${error.message}`);
                        }
                      });
                
                      output.on('error', async(err) => {
                        console.log('@error');
                        await Utils.loggerError(req, err.toString());
          
                        reject(err);
                      });
                    });
                    promises.push(promise);

                  }else{
                    if(input.images[i].delete){
                      let pathUnlink = '/app/uploads/' + input.images[i].url.split('/').pop()
                      fs.unlink(pathUnlink, async(err)=>{
                          if (err) {
                            await Utils.loggerError(req, err);
                          }else{
                            // if no error, file has been deleted successfully
                            console.log('File has been deleted successfully ', pathUnlink);
                          }
                      });
                    }else{
                      newFiles = [...newFiles, input.images[i]]
                    }
                  }
                } catch(err) {
                  await Utils.loggerError(req, err.toString());

                  console.log("@error :", err)
                }
              }
            }

            let images = await Promise.all(promises);
            
            let newInput = _.omit(input, ['_id', 'mode']);
            
            let history = await Model.Product.findOne({ _id: mongoose.Types.ObjectId(input._id) })
            let result = await Model.Product.updateOne({ _id: input._id }, { $set: { current: {...history.current, ...newInput, images: [...images, ...newFiles]}, history: Utils.createRevision(history) } }, { session });

            console.log("All files processed @@@ : ", result );
            // Commit the transaction
            await session.commitTransaction();
          }catch(error){
            console.log("error @@@@@@@1 :", error)
            await session.abortTransaction();
        
            throw new AppError(Constants.ERROR, error)
          }finally {
            session.endSession();
            console.log("finally @@@@@@@1 :")
          }  

          break;
        }

        case 'deleted':{
          const session = await mongoose.startSession();
          session.startTransaction();
          try {
            await Model.Product.deleteOne({ _id: input._id }, { session });
            // Commit the transaction
            await session.commitTransaction();
          }catch(error){
            console.log("error @@@@@@@1 :", error)
            await session.abortTransaction();
        
            throw new AppError(Constants.ERROR, error)
          }finally {
            session.endSession();
            console.log("finally @@@@@@@1 :")
          } 
          break;
        }
      }
      
      return {
        status: true,
        input,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async paid_bill(parent, args, context, info) {
      let start = Date.now()
      let { input } = args
      let { req } = context

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !==Constants.ADMINISTRATOR && role !== Constants.AUTHENTICATED ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      // await Model.Insurance.create({ current: input });
      const session = await mongoose.startSession();
      session.startTransaction();
      try {

        let node = await Model.Node.findById(mongoose.Types.ObjectId(input?.id)).session(session);
        if (!node) {
          throw new Error('Node not found');
        }

        // Update the node within the session
        await Model.Node.updateOne(
          { _id: input?.id },
          { "current.status": 1, history: Utils.createRevision(node) },
          { session } // Include the session in the update
        );

        // Commit the transaction
        await session.commitTransaction();
      }catch(error){
          await session.abortTransaction();
          throw new AppError(Constants.ERROR, error)
      }finally {
          session.endSession();
      } 

      return {
        status: true,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async calculate_tree(parent, args, context, info) {
      let start = Date.now()
      let { req } = context

      let { current_user } =  await Utils.checkAuth(req);
      let role = Utils.checkRole(current_user)
      if( role !==Constants.ADMINISTRATOR ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)
    
      // await Utils.calculateTree()

      // // await Model.Insurance.create({ current: input });
      // const session = await mongoose.startSession();
      // session.startTransaction();
      // try {

      //   let node = await Model.Node.findById(mongoose.Types.ObjectId(input?.id)).session(session);
      //   if (!node) {
      //     throw new Error('Node not found');
      //   }

      //   // Update the node within the session
      //   await Model.Node.updateOne(
      //     { _id: input?.id },
      //     { "current.status": 1, history: Utils.createRevision(node) },
      //     { session } // Include the session in the update
      //   );

      //   // Commit the transaction
      //   await session.commitTransaction();
      // }catch(error){
      //     await session.abortTransaction();
      //     throw new AppError(Constants.ERROR, error)
      // }finally {
      //     session.endSession();
      // } 

      return {
        status: true,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async test_upload(parent, args, context, info) {
      let start = Date.now()
      let { input } = args
      let { req } = context

      /*
      const promises = []; // Array to hold all promises

      let newFiles = [];
      if(!_.isEmpty(input.files)){
        for (let i = 0; i < input.files.length; i++) {
          const { createReadStream, filename, encoding, mimetype } = (await input.files[i]).file //await input.files[i];

          const stream = createReadStream();
          const assetUniqName = Utils.fileRenamer(filename);
          let pathName = `/app/uploads/${assetUniqName}`;

          const output = fs.createWriteStream(pathName)
          stream.pipe(output);

          const promise = await new Promise(function (resolve, reject) {
            output.on('close', () => {
              resolve("close");
            });

            output.on('finish', async () => {
              try {
                  // Save data to MongoDB after the stream has finished writing
                  // await saveDataToMongoDB(data, dbUrl, dbName, collectionName);
                  // console.log("finish : ", { url: `images/${assetUniqName}`, filename, encoding, mimetype })
                  
                  // let newInput ={current: { parentId: input?.parentId, childs: [{childId: current_user?._id}]}}  
                  let file = await Model.File.create({ url: `images/${assetUniqName}`, filename, encoding, mimetype });
                  // console.log("file ", file)
                  resolve(file);
              } catch (error) {
                  reject(`Failed to save data to MongoDB: ${error.message}`);
              }
            });
      
            output.on('error', async(err) => {
              await Utils.loggerError(req, err.toString());

              reject(err);
            });
          });

          // console.log("arrs :" ,arrs)

          promises.push(promise); // Add the promise to the array

          // const urlForArray = `${process.env.RA_HOST}${assetUniqName}`;
          // newFiles.push({ url: `images/${assetUniqName}`, filename, encoding, mimetype });
        }
      }

      // Wait for all promises to resolve
      let arrs = await Promise.all(promises);
      console.log("All files processed: ", arrs);
      // console.log("newFiles :", newFiles)
      */


      let { current_user } =  await Utils.checkAuth(req);
      
      // console.log("test_upload :", input, current_user)

      let files  =  await Utils.saveFiles(current_user, input.files)
      // console.log("test_upload :", files)
      return {
        status: true,
        message: "test_upload",
        files,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      } 
    },
    async profile(parent, args, context, info) {
      let start = Date.now()
      let { input } = args
      let { req } = context

      console.log("profile :", input)

      let { current_user } =  await Utils.checkAuth(req);

      // let prof  =  await Utils.saveFile(current_user, input.file)
      // console.log("profile :", current_user, prof)
      // let member = await Model.Member.findOne({ _id: mongoose.Types.ObjectId(current_user?._id) })
      // await Model.Member.updateOne({ _id: mongoose.Types.ObjectId(current_user?._id) }, 
      //                              { "current.avatar": { url: prof.url, filename: prof.filename, encoding: prof.encoding, mimetype: prof.mimetype }, history: Utils.createRevision(member) }
      //                             );
      // let user = await Utils.getMember({ _id: mongoose.Types.ObjectId(current_user?._id) }, false)

      let { _id, mode } = input

      switch(mode){
        case 'added':{
          const session = await mongoose.startSession();
          session.startTransaction();
          try {
            /*
            let promises = []; 
            if(!_.isEmpty(input.images)){
              for (let i = 0; i < input.images.length; i++) {
                const { createReadStream, filename, encoding, mimetype } = (await input.images[i]).file //await input.files[i];
      
                const stream = createReadStream();
                const assetUniqName = Utils.fileRenamer(filename);
                let pathName = `/app/uploads/${assetUniqName}`;
      
                const output = fs.createWriteStream(pathName)
                stream.pipe(output);
      
                const promise = await new Promise(function (resolve, reject) {
                  // output.on('close', () => {
                  //   resolve("close");
                  // });

                  output.on('finish', async () => {
                    try {
                        // Save data to MongoDB after the stream has finished writing
                        // await saveDataToMongoDB(data, dbUrl, dbName, collectionName);
                        // console.log("finish : ", { url: `images/${assetUniqName}`, filename, encoding, mimetype })
                        
                        // let newInput ={current: { parentId: input?.parentId, childs: [{childId: current_user?._id}]}}  
                        let file = await Model.File.insertMany([{userId:current_user._id, url: `images/${assetUniqName}`, filename, encoding, mimetype }], {session});
                        // console.log("file ", file)
                        resolve(file !== null ? file[0] : undefined );
                    } catch (error) {
                        reject(`Failed to save data to MongoDB: ${error.message}`);
                    }
                  });
            
                  output.on('error', async(err) => {
                    await Utils.loggerError(req, err.toString());
      
                    reject(err);
                  });
                });
                promises.push(promise);
              }
            }

            let images = await Promise.all(promises);
            // console.log("All files processed: ", images );

            const newInput = _.omit(input, ['mode']);
            // let current  = {...newInput, images }
            // if(input?._isDEV === undefined){
            //   current  = { ...current, ownerId: current_user._id }
            // }

            let current  = {...newInput, images, ownerId: current_user._id }
            
            console.log("@@@2 product current : ", current, input?._isDEV)
            
            await Model.Product.insertMany([{ current }], { session });

            // Commit the transaction
            await session.commitTransaction();
            */
          }catch(error){
              console.log("error @@@@@@@1 :", error)
              await session.abortTransaction();
          
              throw new AppError(Constants.ERROR, error)
          }finally {
              session.endSession();
              console.log("finally @@@@@@@1 :")
          }  

          break;
        }

        case 'edited':{
          const session = await mongoose.startSession();
          session.startTransaction();
          try {
            if(input.image){
              let avatar  =  await Utils.saveFile(current_user, input.image)

              let history = await Model.Member.findOne({ _id: mongoose.Types.ObjectId(_id) })
              let newInput = _.omit(input, ['_id', 'mode', 'image']);

              let current = { ...history.current, 
                              ...newInput,
                              avatar: { url: avatar.url, filename: avatar.filename, encoding: avatar.encoding, mimetype: avatar.mimetype } 
                            }

              await Model.Member.updateOne({ _id }, { $set: { current, history: Utils.createRevision(history) } }, { session });
            }else{
              let history   = await Model.Member.findOne({ _id: mongoose.Types.ObjectId(_id) })
              let newInput  = _.omit(input, ['_id', 'mode']);
              let current   = { ...history.current, ...newInput }

              console.log("order current :", current)
              await Model.Member.updateOne({ _id }, { $set: { current, history: Utils.createRevision(history) } }, { session });
            }
             
            await session.commitTransaction();
          }catch(error){
            console.log("error @@@@@@@1 :", error)
            await session.abortTransaction();
        
            throw new AppError(Constants.ERROR, error)
          }finally {
            session.endSession();
            console.log("finally @@@@@@@1 :")
          }  

          break;
        }

        case 'deleted':{
          const session = await mongoose.startSession();
          session.startTransaction();
          try {

            // Commit the transaction
            await session.commitTransaction();
          }catch(error){
            console.log("error @@@@@@@1 :", error)
            await session.abortTransaction();
        
            throw new AppError(Constants.ERROR, error)
          }finally {
            session.endSession();
            console.log("finally @@@@@@@1 :")
          } 
          break;
        }
      }
      return {
        status: true,
        // data: user,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      } 
    },
    async profile_update_position(parent, args, context, info) {
      let start = Date.now()
      let { input } = args
      let { req } = context

      console.log("@1 profile_update_position :", input)

      let { current_user } =  await Utils.checkAuth(req);

      let { _id, positionId } = input

      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const currentMember   = await Model.Member.findById(_id).session(session);
        const latestVersion = currentMember?.current.positionIds.reduce((max, pos) => Math.max(max, pos.version), 0) || 0;
        // Prepare the new positionId entry with incremented version
        const newPositionId = {
          version: latestVersion + 1,
          positionId: mongoose.Types.ObjectId(positionId),  // Update with appropriate ID if necessary
          updatedAt: new Date(),
        };

        await Model.Member.updateOne(
                          { _id  },
                          {
                            $set: { 'history': Utils.createRevision(currentMember) },
                            $push: { 'current.positionIds': newPositionId },
                          },
                          { session }
                        );
        await session.commitTransaction();
      }catch(error){
        console.log("error @@@@@@@1 :", error)
        await session.abortTransaction();
    
        throw new AppError(Constants.ERROR, error)
      }finally {
        session.endSession();
        console.log("finally @@@@@@@1 :")
      }  

      return {
        status: true,
        // data: user,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      } 
    },
    async faker_agent(parent, args, context, info) {
      let start = Date.now()
      let { input } = args
      let { req } = context

      // let { current_user } =  await Utils.checkAuth(req);

      // console.log("faker_agent :", input, current_user)
  
      await Model.Agent.create({ current: input });
      return {
        status: true,
        message: "faker_agent",
        input,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async faker_insurance(parent, args, context, info) {
      let start = Date.now()
      let { input } = args
      let { req } = context

      // let { current_user } =  await Utils.checkAuth(req);

      // console.log("faker_insurance :", input, current_user)

      await Model.Insurance.create({ current: input });
      return {
        status: true,
        message: "faker_insurance",
        input,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async test_addmember(parent, args, context, info) {
      let start     = Date.now()
      let { input } = args
      let { req } = context

      let { current_user } =  await Utils.checkAuth(req);

      let role = Utils.checkRole(current_user)
      if( role !==Constants.ADMINISTRATOR ) throw new AppError(Constants.UNAUTHENTICATED, 'permission denied', current_user)

      if(!_.isNull( await Utils.getMember({
                                            "$and": [{
                                                "current.username": input.username
                                            }, {
                                                "current.email": input.email
                                            }]
                                          } ) )) throw new AppError(Constants.ERROR, "EXITING USERNAME AND EMAIL", input)
      
      if(!_.isNull(await Utils.getMember({ "current.username": input.username?.toLowerCase() }))) throw new AppError(Constants.ERROR, "EXITING USERNAME", input)
      if(!_.isNull( await Utils.getMember({ "current.email": input.email }) )) throw new AppError(Constants.ERROR, "EXITING EMAIL", input)
      
      let newInput =  {current: { ...input,  
                                  username: input.username?.toLowerCase(),
                                  password: cryptojs.AES.encrypt( input.password, process.env.MONGO_PASSWORD_SECRET).toString(),
                                  displayName: _.isEmpty(input.displayName) ? input.username : input.displayName ,
                                  lastAccess: Date.now(), 
                                  isOnline: true}
                      }
  
      await Model.Member.create(newInput);
      return {
        status: true,
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
    async test_addmlm(parent, args, context, info) {
      let start     = Date.now()
      let { req } = context
      let { input } = args

      let { current_user } =  await Utils.checkAuth(req);
      
      console.log("test_addmlm :", input, current_user)
      let mlm = await Model.MLM.findOne({"current.parentId": mongoose.Types.ObjectId(input?.parentId) })
      if(!_.isNull(mlm)){
        let childs = mlm?.current?.childs

        console.log("childs :", childs)
        let child = _.find(childs, e =>e.childId.equals(mongoose.Types.ObjectId(current_user?._id)))
        if(_.isEmpty(child)){

          childs = [...childs, {childId: current_user?._id}]
          await Model.MLM.updateOne({ _id: mlm?._id }, { "current.childs": childs, history: Utils.createRevision(mlm) });
          return {
            status: true,
            message: "UPDATE CHILD",
            executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
          }
        }

        return {
          status: false,
          message: "EXITING CHILD",
          executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
        }
      }

      let newInput ={current: { parentId: input?.parentId, childs: [{childId: current_user?._id}]}}  
      await Model.MLM.create(newInput);
      return {
        status: true,
        message: "PARENT NEW",
        executionTime: `Time to execute = ${ (Date.now() - start) / 1000 } seconds`
      }
    },
  },
  Subscription:{
    userConnected: {
      resolve: (payload) =>{
        return payload.userConnected
      },
      subscribe: withFilter((parent, args, context, info) => {
          return pubsub.asyncIterator(["USER_CONNECTED"])
        }, async (payload, variables, context, info) => {
          
          let { input } = variables
          let { mutation, data } = payload.userConnected

          console.log("@@@1 userConnected subscribe :", payload, variables)

          switch(mutation){
            case "UPDATED_PROFILE":{
              if(input._id.toString() === data._id.toString()){
                return true;
              }
              break;
            }
          }

          return false;
        }
      ),
      onDisconnect: () => {
        console.log(`Active subscriptions: xxxx`);
      },
    },
  },
}