import { DeviceInformation } from "../model/dataModel";

export function randomString(len: number, charSet?: string) {
  charSet =
    charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let rstr = "";
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    rstr += charSet.substring(randomPoz, randomPoz + 1);
  }
  return rstr;
}

export function createTempDevice(): DeviceInformation {
  const id = randomString(10);
  return {
    id,
    browserName: navigator.userAgent,
    name: "Name " + id,
    position: 1,
    size: { width: window.innerWidth, height: window.innerHeight },
    totalDevice: 0
  };
}
export function reorder<T>(
  list: Array<T>,
  startIndex: number,
  endIndex: number
): Array<T> {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
