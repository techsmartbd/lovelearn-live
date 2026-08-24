import crypto from 'crypto';

function hashPII(val: string | null | undefined): string | null {
  if (!val) return null;
  return crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}

const MASK_EVENTS = ['ViewContent', 'Search', 'AddToCart', 'InitiateCheckout', 'Lead'];

export async function sendMetaCapiEvent({
  eventName,
  email,
  phone,
  name,
  value = 0,
  currency = 'BDT',
  eventId,
  ipAddress,
  userAgent,
}: {
  eventName: string;
  email?: string;
  phone?: string;
  name?: string;
  value?: number;
  currency?: string;
  eventId?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
      console.log('[CAPI] Meta Pixel ID or Access Token missing in env. Skipping.');
      return;
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId || 'ev_' + Date.now() + '_' + Math.random().toString(36).substring(7),
          action_source: 'website',
          user_data: {
            em: email ? [hashPII(email)] : [],
            ph: phone ? [hashPII(phone)] : [],
            fn: name ? [hashPII(name)] : [],
            client_ip_address: ipAddress || '',
            client_user_agent: userAgent || '',
          },
          custom_data: {
            currency,
            value,
          },
        },
      ],
    };

    const url = 'https://graph.facebook.com/v18.0/' + pixelId + '/events?access_token=' + accessToken;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log('[CAPI] Event ' + eventName + ' response:', data);
  } catch (err) {
    console.error('[CAPI] Error sending event:', err);
  }
}

export function getRandomMaskEvent(): string {
  const idx = Math.floor(Math.random() * MASK_EVENTS.length);
  return MASK_EVENTS[idx];
}
