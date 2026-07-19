import { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: any, res: any) {
  // Add CORS headers so that client-side requests from any subdomain of vercel.app or local work
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const requestId = Math.random().toString(36).substring(7);
  console.log(`[Vercel Serverless ${requestId}] Received request:`, req.body);

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error(`[Vercel Serverless ${requestId}] Failed to parse string body:`, e);
      }
    }

    const { bank_code, account_number } = body || {};

    if (!bank_code || !account_number) {
      console.warn(`[Vercel Serverless ${requestId}] Bad request: missing bank_code or account_number`);
      res.status(400).send("Error: Missing bank code or account number");
      return;
    }

    const params = new URLSearchParams();
    params.append("bank_code", bank_code);
    params.append("account_number", account_number);

    const targetUrl = "https://api.wtproject.space/vrf/verify.php";
    const headersToSend = {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    };

    console.log(`[Vercel Serverless ${requestId}] Forwarding to: ${targetUrl} with params:`, params.toString());

    const apiResponse = await fetch(targetUrl, {
      method: "POST",
      headers: headersToSend,
      body: params.toString()
    });

    console.log(`[Vercel Serverless ${requestId}] Remote response status: ${apiResponse.status} (${apiResponse.statusText})`);

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text().catch(() => "Could not read error body");
      console.error(`[Vercel Serverless ${requestId}] Remote error: status=${apiResponse.status}, body:`, errorBody);
      res.status(apiResponse.status).send(`Error: Verification server returned status ${apiResponse.status}`);
      return;
    }

    const textResult = await apiResponse.text();
    console.log(`[Vercel Serverless ${requestId}] Remote response text snippet:`, textResult.substring(0, 150));

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(textResult);
  } catch (error: any) {
    console.error(`[Vercel Serverless ${requestId}] Exception:`, error);
    res.status(500).send(`Error: Failed to connect to verification server. Details: ${error?.message || error}`);
  }
}
