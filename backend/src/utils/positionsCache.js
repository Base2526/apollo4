const NodeCache = require('node-cache');

// Initialize cache with a default expiration of 3600 seconds (1 hour)
const cache = new NodeCache({ stdTTL: 3600 * 48, checkperiod: 120 });

// Initial positions data
const init_position = [
    {"_id":"6721098ce9dccb02aab4cb3e","level":0,"name":"BM","percent":0,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb3f","level":1,"name":"BS","percent":0,"budget":5000 },
    {"_id":"6721098ce9dccb02aab4cb40","level":2,"name":"BG","percent":0.5,"budget":10000 },
    {"_id":"6721098ce9dccb02aab4cb41","level":3,"name":"BD","percent":1,"budget":50000 },
    {"_id":"6721098ce9dccb02aab4cb42","level":4,"name":"BP","percent":2,"budget":200000 },
    {"_id":"6721098ce9dccb02aab4cb43","level":5,"name":"MA","percent":3,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb44","level":6,"name":"MB","percent":4,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb45","level":7,"name":"MC","percent":5,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb46","level":8,"name":"MD","percent":5.5,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb47","level":9,"name":"ME","percent":6,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb48","level":10,"name":"MF","percent":6.5,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb49","level":11,"name":"MG","percent":7,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb4a","level":12,"name":"MH","percent":7.3,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb4b","level":13,"name":"MI","percent":7.5,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb4c","level":14,"name":"MJ","percent":7.8,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb4d","level":15,"name":"MK","percent":8,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb4e","level":16,"name":"ML","percent":8.3,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb4f","level":17,"name":"MM","percent":8.5,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb50","level":18,"name":"MN","percent":8.8,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb51","level":19,"name":"MO","percent":9,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb52","level":20,"name":"MP","percent":9.3,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb53","level":21,"name":"MQ","percent":9.5,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb54","level":22,"name":"MR","percent":9.8,"budget":0 },
    {"_id":"6721098ce9dccb02aab4cb55","level":23,"name":"MS","percent":10,"budget":0 }
];

// Cache key for positions data
const CACHE_KEY = 'positions';

/**
 * Save initial positions data to cache only if it doesn't already exist.
 * @param {number} ttl - Expiration time in seconds
 */
function savePositionsIfNotExists(ttl = 3600 * 24) {
    if (!cache.has(CACHE_KEY)) {
      cache.set(CACHE_KEY, init_position, ttl);
    }
}

/**
 * Save initial positions data to cache with custom expiration time
 * @param {number} ttl - Expiration time in seconds
 */
// function savePositions(ttl = 3600) {
//   cache.set(CACHE_KEY, init_position, ttl);
// }

/**
 * Get positions data from cache
 * @returns {Array|undefined} - Positions data if available, otherwise undefined
 */
function getPositions() {
  return cache.get(CACHE_KEY);
}

/**
 * Update positions data in cache with custom expiration time
 * @param {Array} newData - Updated positions data
 * @param {number} ttl - Expiration time in seconds
 */
function updatePositions(newData, ttl = 3600) {
  cache.set(CACHE_KEY, newData, ttl);
}

/**
 * Check if positions data is in cache
 * @returns {boolean} - True if positions data is in cache, false otherwise
 */
function isPositionsCached() {
  return cache.has(CACHE_KEY);
}

/**
 * Get a position by _id.
 * @param {string} id - The _id of the position to retrieve.
 * @returns {Object|null} The position object or null if not found.
 */
const getPositionById = (id) => {
    return cache.get(id);
};

/**
 * Get percent by _id.
 * @param {string} id - The _id of the position to retrieve percent for.
 * @returns {number|null} The percent value or null if position not found.
 */
const getPercentById = (id) => {
    const position = getPositionById(id);
    return position ? position.percent : null;
};

/*
หา id ทั้งหมดและมี level ตํ่ากว่า
*/
const findPositionIds_levelLess = (targetId)=>{
    const positions = getPositions();
    const targetItem = positions.find( item=> item._id === targetId );
    if (targetItem) {
        return positions.filter(item => item.level < targetItem.level).map(item => item._id);
    } else {
        return []
    }
} 

/*
หา id ทั้งหมดและมี level ตํ่ากว่า และ เท่ากับ
*/
const positionLevelLessAndEqual = (targetId)=>{
  const positions = getPositions();
  const targetItem = positions.find( item=> item._id === targetId );
  if (targetItem) {
      return positions.filter(item => item.level <= targetItem.level).map(item => item._id);
  } else {
      return []
  }
} 

/*
หา id ทั้งหมดและมี level มากกว่า และ เท่ากับ
*/
const positionLevelMoreThan = (targetId)=>{
  const positions = getPositions();
  const targetItem = positions.find( item=> item._id === targetId );
  if (targetItem) {
      return positions.filter(item => item.level > targetItem.level).map(item => item._id);
  } else {
      return []
  }
} 

module.exports = {
    findPositionIds_levelLess,
    positionLevelLessAndEqual,
    positionLevelMoreThan,
    getPositions,
    updatePositions,
    isPositionsCached,
    getPercentById,
    savePositionsIfNotExists
};
