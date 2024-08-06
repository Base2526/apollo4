import _ from 'lodash'; // Import lodash if you're using it
import UniversalCookie, { CookieSetOptions } from 'universal-cookie';

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