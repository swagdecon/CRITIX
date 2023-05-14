import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.REACT_APP_COOKIE_ENCRYPTION_KEY;

const CookieManager = {
  encryptCookie(name, value, options = {}) {
    const encryptedValue = CryptoJS.AES.encrypt(
      value,
      ENCRYPTION_KEY
    ).toString();
    Cookies.set(name, encryptedValue, options);
  },
  decryptCookie(name) {
    const cookieValue = Cookies.get(name);
    if (cookieValue) {
      const decryptedValue = CryptoJS.AES.decrypt(cookieValue, ENCRYPTION_KEY);
      return decryptedValue.toString(CryptoJS.enc.Utf8);
    }
    return null;
  },
  removeCookie(name, options = {}) {
    Cookies.remove(name, options);
  },
};

export default CookieManager;
