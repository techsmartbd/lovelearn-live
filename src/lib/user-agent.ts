export interface ParsedUA {
  device: string;
  browser: string;
}

export function parseUserAgent(ua?: string | null): ParsedUA {
  if (!ua || typeof ua !== 'string') {
    return { device: 'Unknown Device', browser: 'Unknown Browser' };
  }

  const lower = ua.toLowerCase();

  // 1. Detect Device / OS
  let device = 'Desktop PC';
  if (lower.includes('iphone')) {
    device = 'iPhone';
  } else if (lower.includes('ipad')) {
    device = 'iPad';
  } else if (lower.includes('android')) {
    if (lower.includes('mobile')) {
      device = 'Android Phone';
    } else {
      device = 'Android Tablet';
    }
  } else if (lower.includes('windows phone')) {
    device = 'Windows Phone';
  } else if (lower.includes('windows nt 10.0') || lower.includes('windows nt 11.0')) {
    device = 'Windows 10/11 PC';
  } else if (lower.includes('windows')) {
    device = 'Windows PC';
  } else if (lower.includes('macintosh') || lower.includes('mac os x')) {
    device = 'Mac OS';
  } else if (lower.includes('linux')) {
    device = 'Linux PC';
  }

  // 2. Detect Browser
  let browser = 'Unknown Browser';
  if (lower.includes('edg/') || lower.includes('edge/')) {
    browser = 'Microsoft Edge';
  } else if (lower.includes('samsungbrowser')) {
    browser = 'Samsung Internet';
  } else if (lower.includes('opr/') || lower.includes('opera')) {
    browser = 'Opera';
  } else if (lower.includes('chrome') && !lower.includes('edg') && !lower.includes('opr')) {
    browser = 'Google Chrome';
  } else if (lower.includes('firefox')) {
    browser = 'Mozilla Firefox';
  } else if (lower.includes('safari') && !lower.includes('chrome') && !lower.includes('android')) {
    browser = 'Apple Safari';
  } else if (lower.includes('ucbrowser')) {
    browser = 'UC Browser';
  }

  return { device, browser };
}
