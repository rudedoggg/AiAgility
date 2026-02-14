import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { seedDemoData } from "./seed";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === PROJECTS ===
  app.get("/api/projects", async (_req, res) => {
    let rows = await storage.listProjects();
    if (rows.length === 0) {
      await seedDemoData();
      rows = await storage.listProjects();
    }
    res.json(rows);
  });

  app.get("/api/projects/:id", async (req, res) => {
    const row = await storage.getProject(req.params.id);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  });

  app.post("/api/projects", async (req, res) => {
    const row = await storage.createProject(req.body);
    res.status(201).json(row);
  });

  app.patch("/api/projects/:id", async (req, res) => {
    const row = await storage.updateProject(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    await storage.deleteProject(req.params.id);
    res.status(204).end();
  });

  // === GOAL SECTIONS ===
  app.get("/api/projects/:projectId/goals", async (req, res) => {
    const rows = await storage.listGoalSections(req.params.projectId);
    res.json(rows);
  });

  app.post("/api/projects/:projectId/goals", async (req, res) => {
    const row = await storage.createGoalSection({ ...req.body, projectId: req.params.projectId });
    res.status(201).json(row);
  });

  app.patch("/api/goals/:id", async (req, res) => {
    const row = await storage.updateGoalSection(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  });

  app.delete("/api/goals/:id", async (req, res) => {
    await storage.deleteGoalSection(req.params.id);
    res.status(204).end();
  });

  app.put("/api/projects/:projectId/goals/reorder", async (req, res) => {
    await storage.reorderGoalSections(req.params.projectId, req.body.ids);
    res.status(204).end();
  });

  // === LAB BUCKETS ===
  app.get("/api/projects/:projectId/lab", async (req, res) => {
    const rows = await storage.listLabBuckets(req.params.projectId);
    res.json(rows);
  });

  app.post("/api/projects/:projectId/lab", async (req, res) => {
    const row = await storage.createLabBucket({ ...req.body, projectId: req.params.projectId });
    res.status(201).json(row);
  });

  app.patch("/api/lab/:id", async (req, res) => {
    const row = await storage.updateLabBucket(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  });

  app.delete("/api/lab/:id", async (req, res) => {
    await storage.deleteLabBucket(req.params.id);
    res.status(204).end();
  });

  app.put("/api/projects/:projectId/lab/reorder", async (req, res) => {
    await storage.reorderLabBuckets(req.params.projectId, req.body.ids);
    res.status(204).end();
  });

  // === DELIVERABLES ===
  app.get("/api/projects/:projectId/deliverables", async (req, res) => {
    const rows = await storage.listDeliverables(req.params.projectId);
    res.json(rows);
  });

  app.post("/api/projects/:projectId/deliverables", async (req, res) => {
    const row = await storage.createDeliverable({ ...req.body, projectId: req.params.projectId });
    res.status(201).json(row);
  });

  app.patch("/api/deliverables/:id", async (req, res) => {
    const row = await storage.updateDeliverable(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  });

  app.delete("/api/deliverables/:id", async (req, res) => {
    await storage.deleteDeliverable(req.params.id);
    res.status(204).end();
  });

  app.put("/api/projects/:projectId/deliverables/reorder", async (req, res) => {
    await storage.reorderDeliverables(req.params.projectId, req.body.ids);
    res.status(204).end();
  });

  // === BUCKET ITEMS ===
  app.get("/api/items/:parentType/:parentId", async (req, res) => {
    const rows = await storage.listBucketItems(req.params.parentId, req.params.parentType);
    res.json(rows);
  });

  app.post("/api/items", async (req, res) => {
    const row = await storage.createBucketItem(req.body);
    res.status(201).json(row);
  });

  app.delete("/api/items/:id", async (req, res) => {
    await storage.deleteBucketItem(req.params.id);
    res.status(204).end();
  });

  // === CHAT MESSAGES ===
  app.get("/api/messages/:parentType/:parentId", async (req, res) => {
    const rows = await storage.listChatMessages(req.params.parentId, req.params.parentType);
    res.json(rows);
  });

  app.post("/api/messages", async (req, res) => {
    const row = await storage.createChatMessage(req.body);
    res.status(201).json(row);
  });

  app.patch("/api/messages/:id", async (req, res) => {
    const row = await storage.updateChatMessage(req.params.id, req.body);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  });

  return httpServer;
}
