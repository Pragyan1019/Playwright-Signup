import { APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://api.guerrillamail.com/ajax.php';

// ─── Generate unique inbox name per test run ───────────────────────────────────
export function generateInbox(): string {
  return `testuser_${Date.now()}`;
}

// ─── Strip HTML tags and decode entities from email body ──────────────────────
function stripHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')    // remove all HTML tags
    .replace(/&amp;/g, '&')      // decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')        // collapse whitespace
    .trim();
}

// ─── Step 1 & 2: Start session and set custom inbox name ─────────────────────
export async function createGuerrillaSession(
  request: APIRequestContext,
  inbox: string
): Promise<{ email: string; sidToken: string }> {

  // Step 1: Get a session token
  const sessionRes = await request.get(`${BASE_URL}?f=get_email_address`);

  if (!sessionRes.ok()) {
    throw new Error(`Failed to create Guerrilla Mail session: ${sessionRes.status()}`);
  }

  const sessionData = await sessionRes.json();
  const sidToken: string = sessionData.sid_token;

  console.log('[GuerrillaMail] Session token obtained:', sidToken);
  console.log('[GuerrillaMail] Default email:', sessionData.email_addr);

  // Step 2: Set custom inbox name using sid_token
  const setRes = await request.get(
    `${BASE_URL}?f=set_email_user&email_user=${inbox}&sid_token=${sidToken}`
  );

  if (!setRes.ok()) {
    throw new Error(`Failed to set Guerrilla Mail inbox: ${setRes.status()}`);
  }

  const setData = await setRes.json();
  const email: string = setData.email_addr;

  console.log('[GuerrillaMail] Custom inbox set:', email);

  return { email, sidToken };
}

// ─── Step 3 & 4: Poll inbox and extract OTP ───────────────────────────────────
export async function getOTPFromGuerrillaMail(
  request: APIRequestContext,
  sidToken: string,
  retries = 10,
  intervalMs = 3000
): Promise<string> {

  for (let i = 0; i < retries; i++) {

    // Step 3: Check inbox for new emails
    const checkRes = await request.get(
      `${BASE_URL}?f=check_email&sid_token=${sidToken}&seq=0`
    );

    if (!checkRes.ok()) {
      throw new Error(`Failed to check Guerrilla Mail inbox: ${checkRes.status()}`);
    }

    const checkData = await checkRes.json();
    console.log(`[GuerrillaMail] Attempt ${i + 1}/${retries} — emails in inbox: ${checkData.list?.length ?? 0}`);

    if (checkData.list && checkData.list.length > 0) {
      const mailId: string = checkData.list[0].mail_id;
      console.log('[GuerrillaMail] Mail ID found:', mailId);

      // Step 4: Fetch full email body using mail_id
      const fetchRes = await request.get(
        `${BASE_URL}?f=fetch_email&email_id=${mailId}&sid_token=${sidToken}`
      );

      if (!fetchRes.ok()) {
        throw new Error(`Failed to fetch email body: ${fetchRes.status()}`);
      }

      const fetchData = await fetchRes.json();
      const rawBody: string = fetchData.mail_body;

      // Strip HTML so regex works correctly
      const plainText = stripHTML(rawBody);
      console.log('[GuerrillaMail] Plain text body:', plainText);

      // Extract 6-digit OTP
      const match = plainText.match(/\b\d{6}\b/);
      if (match) {
        console.log('[GuerrillaMail] OTP extracted:', match[0]);
        return match[0];
      }

      console.log('[GuerrillaMail] Email found but no 6-digit OTP matched');
    }

    // Wait before next poll
    console.log(`[GuerrillaMail] Waiting ${intervalMs}ms before retry...`);
    await new Promise(r => setTimeout(r, intervalMs));
  }

  throw new Error('[GuerrillaMail] OTP not received after max retries');
}