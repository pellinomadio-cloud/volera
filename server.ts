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
    try {
      const { bank_code, account_number } = req.body;

      if (!bank_code || !account_number) {
        res.status(400).send("Error: Missing bank code or account number");
        return;
      }

      const params = new URLSearchParams();
      params.append("bank_code", bank_code);
      params.append("account_number", account_number);

      const apiResponse = await fetch("https://api.wtproject.space/vrf/verify.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });

      if (!apiResponse.ok) {
        res.status(apiResponse.status).send(`Error: Verification server returned ${apiResponse.status}`);
        return;
      }

      const textResult = await apiResponse.text();
      res.setHeader("Content-Type", "text/plain");
      res.send(textResult);
    } catch (error) {
      console.error("Error inside bank verification proxy:", error);
      res.status(500).send("Error: Failed to connect to verification server");
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
