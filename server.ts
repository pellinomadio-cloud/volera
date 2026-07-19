import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Proxy Route for Bank Verification (bypasses CORS)
  app.post("/api/verify-bank", async (req, res) => {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[Proxy Request ${requestId}] Received bank verification request:`, req.body);
    
    try {
      const { bank_code, account_number } = req.body;

      if (!bank_code || !account_number) {
        console.warn(`[Proxy Request ${requestId}] Bad request: missing bank_code or account_number`);
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

      console.log(`[Proxy Request ${requestId}] Forwarding to: ${targetUrl} with params:`, params.toString());

      const apiResponse = await fetch(targetUrl, {
        method: "POST",
        headers: headersToSend,
        body: params.toString()
      });

      console.log(`[Proxy Request ${requestId}] Remote server response status: ${apiResponse.status} (${apiResponse.statusText})`);

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text().catch(() => "Could not read error body");
        console.error(`[Proxy Request ${requestId}] Remote server error: status=${apiResponse.status}, body:`, errorText);
        res.status(apiResponse.status).send(`Error: Verification server returned status ${apiResponse.status}`);
        return;
      }

      const textResult = await apiResponse.text();
      console.log(`[Proxy Request ${requestId}] Remote response text snippet:`, textResult.substring(0, 150));
      
      res.setHeader("Content-Type", "text/plain");
      res.send(textResult);
    } catch (error: any) {
      console.error(`[Proxy Request ${requestId}] Exception during proxy:`, error);
      res.status(500).send(`Error: Failed to connect to verification server. Details: ${error?.message || error}`);
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Since Express v5 is used, use '*all' for wild-card SPA routes
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
