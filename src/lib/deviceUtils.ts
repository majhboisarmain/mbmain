export interface DeviceSession {
  id: string;
  phone: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  deviceBrand: string;
  browser: string;
  ip?: string;
  createdAt: number;
  lastActive: number;
}

export function parseDeviceFromUA(ua: string): { deviceType: 'Mobile' | 'Desktop' | 'Tablet'; deviceBrand: string; browser: string } {
  let deviceType: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
  let deviceBrand = 'Computer';
  let browser = 'Browser';

  if (/iPad|Tablet/i.test(ua)) {
    deviceType = 'Tablet';
    deviceBrand = /iPad/i.test(ua) ? 'iPad' : 'Tablet Device';
  } else if (/iPhone/i.test(ua)) {
    deviceType = 'Mobile';
    deviceBrand = 'Apple iPhone';
  } else if (/Android/i.test(ua)) {
    deviceType = 'Mobile';
    deviceBrand = 'Android Phone';
  } else if (/Windows/i.test(ua)) {
    deviceType = 'Desktop';
    deviceBrand = 'Windows PC';
  } else if (/Macintosh|Mac OS/i.test(ua)) {
    deviceType = 'Desktop';
    deviceBrand = 'Apple Mac';
  } else if (/Linux/i.test(ua)) {
    deviceType = 'Desktop';
    deviceBrand = 'Linux PC';
  }

  if (/Edg/i.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) {
    browser = 'Google Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/Firefox/i.test(ua)) {
    browser = 'Mozilla Firefox';
  } else if (/Opera|OPR/i.test(ua)) {
    browser = 'Opera';
  }

  return { deviceType, deviceBrand, browser };
}
