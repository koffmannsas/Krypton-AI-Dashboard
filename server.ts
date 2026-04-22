import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { startAgentCron } from "./src/services/backend/agent";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "Agent Systems Online", timestamp: new Date() });
  });

  // Start Autonomous AI Agent Automations
  startAgentCron();

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server initialized at http://localhost:${PORT}`);
    console.log(`🧠 Autonomous SEO Agent is now monitoring keywords.`);
  });
}

startServer().catch((error) => {
  console.error("🔥 Server startup failed:", error);
});
