import _ from 'lodash'; // Import lodash if you're using it
import UniversalCookie, { CookieSetOptions } from 'universal-cookie';

import * as Constants from "@/constants"
import { ProductItem, ProductCurrentItem, ProfileType, PositionInterface } from "@/interface/user/user"

const cookies = new UniversalCookie();

export const setCookie = (
  name: string,
  value: string,
  options: CookieSetOptions = { path: '/', maxAge: 2147483647 }
): void => {
  cookies.set(name, value, options);
};

export const getCookie = (name: string): string | undefined => {
  return cookies.get(name);
};

export const removeCookie = (
  name: string,
  options: CookieSetOptions = { path: '/', maxAge: 2147483647 }
): void => {
  cookies.remove(name, options);
};

// Define the type for params if you know its structure
interface Params {
    [key: string]: any; // Replace with specific properties if known
}
  
export const getHeaders = (params: Params): Record<string, string> => {
    const usidaCookie =  getCookie('usida') || '';

    const headers: Record<string, string> = {
        "apollo-require-preflight": "true",
        "content-Type": "application/json",
        "authorization": !_.isUndefined(usidaCookie) ? `Bearer ${usidaCookie}` : '',
        "custom-location": JSON.stringify(params),
        "custom-authorization": !_.isUndefined(usidaCookie) ? `Bearer ${usidaCookie}` : '',
        "custom-x": `--1-- ${usidaCookie}`
    };

    return headers;
};

export const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

export const checkRole = (user: any) => {
  if (user?.current?.roles) {
    // Ensure VITE_USER_ROLES is a string before using it
    const { REACT_APP_USER_ROLES } = process.env;
    
    if (typeof REACT_APP_USER_ROLES === 'string') {
      const rolesArray = REACT_APP_USER_ROLES.split(',');

      if (_.includes(user.current.roles, parseInt(rolesArray[0]))) {
        return Constants.ADMINISTRATOR;
      } else if (_.includes(user.current.roles, parseInt(rolesArray[2]))) {
        return Constants.SELLER;
      } else if (_.includes(user.current.roles, parseInt(rolesArray[1]))) {
        return Constants.AUTHENTICATED;
      }
    } else {
      // Handle the case where VITE_USER_ROLES is not a string
      console.error("REACT_APP_USER_ROLES is not a string");
    }
  }
  
  return Constants.ANONYMOUS;
};


export const getPositionId = (positionIds: any) =>{
  if (positionIds.length === 0) return null;

  // Find the position with the highest version
  const latestPosition = positionIds.reduce((latest: any, current: any) => {
    return current.version > latest.version ? current : latest;
  });

  return latestPosition.positionId;
}

// ส่วนลดตำแหน่งสมาชิก
// เราต้องเช็ดว่า user เป็นตำแหน่งอะไร มีอยู่ 2 กรณี
// 1. BM เราจะดึง % field price_discount_bm เพือเอาไปใช้ในการคำนวณ
// 2. สูงกว่า BM เริ่มตั้งแต่ BS โดยเราจะดึง % field price_discount_bs + position.percent เพือเอาไปใช้ในการคำนวณ
// หลักการคำนวณ = (ราคาขาย *  จำนวนซื้อ) * ( % ทีได้จากข้อ 2  / 100 )
export const ___discount_position_for_member = ( positions: PositionInterface[], positionId: string,  value : ProductCurrentItem) =>{
  let percent_discount = 0;

  let position = _.find(positions, (p)=>p._id?.toString() === positionId )
  switch(position?.name?.toLocaleUpperCase()){
    case "BM":{
      percent_discount = value.price_discount_bm;
      break;
    }
    // BS, BG, BD, BP, MA, MB, MC, MD, ME, MF, MG, MH, MI, MJ, MK, ML, MM, MN, MO, MP, MQ, MR, MS
    case "BS":
    case "BG":
    case "BD":
    case "BP":
    case "MA":
    case "MB":
    case "MC":
    case "MD":
    case "ME":
    case "MF":
    case "MG":
    case "MH":
    case "MI":
    case "MJ":
    case "MK":
    case "ML":
    case "MM":
    case "MN":
    case "MO":
    case "MP":
    case "MG":
    case "MR":
    case "MS":{
      percent_discount = value.price_discount_bs + position.percent;
      break;
    }
  }

  return  (( parseInt(value.price_sell) * value.quantities ) * (percent_discount/100))
}

export const ___discount_position_for_member_inclue_vat = ( price: number, positions: PositionInterface[], positionId: string,  value : ProductCurrentItem) =>{
  let percent_discount = 0;

  let position = _.find(positions, (p)=>p._id?.toString() === positionId)
  switch(position?.name?.toLocaleUpperCase()){
    case "BM":{
      percent_discount = value.price_discount_bm;
      break;
    }
    // BS, BG, BD, BP, MA, MB, MC, MD, ME, MF, MG, MH, MI, MJ, MK, ML, MM, MN, MO, MP, MQ, MR, MS
    case "BS":
    case "BG":
    case "BD":
    case "BP":
    case "MA":
    case "MB":
    case "MC":
    case "MD":
    case "ME":
    case "MF":
    case "MG":
    case "MH":
    case "MI":
    case "MJ":
    case "MK":
    case "ML":
    case "MM":
    case "MN":
    case "MO":
    case "MP":
    case "MG":
    case "MR":
    case "MS":{
      percent_discount = value.price_discount_bs + position.percent;
      break;
    }
  }

  return  (( price * value.quantities ) * (percent_discount/100))
}

// % ส่วนของตำแหน่ง BM หรือ BS
export const ___price_discount_bm_or_bs = (positions: PositionInterface[], profile: ProfileType, value : ProductCurrentItem) =>{
  let position = _.find(positions, (p)=>p._id?.toString() === profile.current?.positionId?.toString())

  switch(position?.name?.toLocaleUpperCase()){
    case "BM":{
      return  value.price_discount_bm;
    }
    // BS, BG, BD, BP, MA, MB, MC, MD, ME, MF, MG, MH, MI, MJ, MK, ML, MM, MN, MO, MP, MQ, MR, MS
    case "BS":
    case "BG":
    case "BD":
    case "BP":
    case "MA":
    case "MB":
    case "MC":
    case "MD":
    case "ME":
    case "MF":
    case "MG":
    case "MH":
    case "MI":
    case "MJ":
    case "MK":
    case "ML":
    case "MM":
    case "MN":
    case "MO":
    case "MP":
    case "MG":
    case "MR":
    case "MS":{
      return  value.price_discount_bs + position.percent
    }
  }
}

// ราคาก่อน vat
export const ___price_before_vat = (current : ProductCurrentItem, tax: number) =>{
  let { price_sell, quantities } = current;
  return  (parseInt(price_sell)  * quantities) - (parseInt(price_sell)  * quantities) * (tax/(100 + tax));
}

export const ___vat = (vat : number) =>{
  switch(vat){
    case 0:return "N"
    case 1:return "I"
    case 2:return "E"
  }
}
