import _ from 'lodash'; // Import lodash if you're using it
import UniversalCookie, { CookieSetOptions } from 'universal-cookie';

import * as Constants from "@/constants"

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
