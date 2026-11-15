import { APIRequestContext } from '@playwright/test';

const BASE = 'https://api.mail.tm';
const pass = 'Vritt@12345';

export async function createTempMail(request: APIRequestContext) {
  const d = await request.get(`${BASE}/domains`);
  const domainData = await d.json();
  const domain = domainData['hydra:member'][0].domain;

  const address = 'Vritttechnology' + Date.now() + '@' + domain;

  await request.post(`${BASE}/accounts`, { data: { address: address, password: pass } });
  const t = await request.post(`${BASE}/token`, { data: { address: address, password: pass } });
  const tokenData = await t.json();

  console.log('mail created', address);
  return { email: address, token: tokenData.token };
}

export async function getOTP(request: APIRequestContext, token: string) {
  const headers = { Authorization: 'Bearer ' + token };

  for (let i = 1; i <= 15; i++) {
    try {
      const res = await request.get(`${BASE}/messages`, { headers });
      const data = await res.json();
      const mails = data['hydra:member'];
      console.log('attempt', i, 'mails:', mails.length);

      for (const m of mails) {
        let text = m.subject + ' ' + m.intro;
        let match = text.match(/\b\d{6}\b/);

        if (!match) {
          const full = await request.get(`${BASE}/messages/${m.id}`, { headers });
          const fullData = await full.json();
          text = fullData.text + ' ' + fullData.html;
          match = text.match(/\b\d{6}\b/);
        }

        if (match) {
          console.log('otp is', match[0]);
          return match[0];
        }
      }
    } catch (e) {
      console.log('something went wrong, trying again');
    }

    await new Promise(r => setTimeout(r, 3000));
  }

  throw new Error('OTP not received');
}