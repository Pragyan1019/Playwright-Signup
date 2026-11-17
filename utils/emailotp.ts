import { APIRequestContext } from '@playwright/test';

const BASE = 'https://api.mail.tm';

function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function createTempMail(request: APIRequestContext) {
  const domRes = await request.get(`${BASE}/domains`);
  const domain = (await domRes.json())['hydra:member'][0].domain;

  const address = `testuser_${Date.now()}@${domain}`;
  const password = 'Vritt@12345';

  const acc = await request.post(`${BASE}/accounts`, { data: { address, password } });
  if (!acc.ok()) throw new Error(`Account failed to create:${acc.status()}`);

  const tok = await request.post(`${BASE}/token`, { data: { address, password } });
  if (!tok.ok()) throw new Error(`Failed: ${tok.status()}`);

  return { email: address, token: (await tok.json()).token as string };
}

export async function getOTP(request: APIRequestContext, token: string, retries = 15, intervalMs = 3000) {
  const headers = { Authorization: `Bearer ${token}` };

  for (let i = 0; i < retries; i++) {
    const res = await request.get(`${BASE}/messages`, { headers });
    const list = (await res.json())['hydra:member'] ?? [];

    for (const m of list) {
      const full = await (await request.get(`${BASE}/messages/${m.id}`, { headers })).json();
      const text = stripHTML(`${m.subject} ${m.intro} ${full.text ?? ''} ${(full.html ?? []).join(' ')}`);
      const match = text.match(/\b\d{6}\b/);
      if (match) {
        console.log('OTP extracted:', match[0]);
        return match[0];
      }
    }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error(' OTP not received after max retries');
}