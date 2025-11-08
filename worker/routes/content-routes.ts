import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { HonoContext } from "../types";
import { newsArticles, robotCatalog, faqItems, diyProjects, chatMessages, usefulLinks } from "../db/schema";
import { desc, eq } from "drizzle-orm";
import { authenticatedOnly } from "../middleware/auth";

export const contentRoutes = new Hono<HonoContext>()
  .get("/news", async (c) => {
    const db = c.get("db");
    const limit = c.req.query("limit");
    
    const query = db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt));
    
    if (limit) {
      const articles = await query.limit(parseInt(limit)).all();
      return c.json(articles);
    }
    
    const articles = await query.all();
    return c.json(articles);
  })
  
  .get("/news/:id", async (c) => {
    const db = c.get("db");
    const id = parseInt(c.req.param("id"));
    
    const article = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).get();
    
    if (!article) {
      return c.json({ error: "Not found" }, 404);
    }
    
    return c.json(article);
  })
  
  .get("/robots", async (c) => {
    const db = c.get("db");
    const limit = c.req.query("limit");
    
    const query = db.select().from(robotCatalog).orderBy(desc(robotCatalog.createdAt));
    
    if (limit) {
      const robots = await query.limit(parseInt(limit)).all();
      return c.json(robots);
    }
    
    const robots = await query.all();
    return c.json(robots);
  })
  
  .get("/robots/:id", async (c) => {
    const db = c.get("db");
    const id = parseInt(c.req.param("id"));
    
    const robot = await db.select().from(robotCatalog).where(eq(robotCatalog.id, id)).get();
    
    if (!robot) {
      return c.json({ error: "Not found" }, 404);
    }
    
    return c.json(robot);
  })
  
  .get("/faq", async (c) => {
    const db = c.get("db");
    const items = await db.select().from(faqItems).orderBy(faqItems.order).all();
    return c.json(items);
  })
  
  .get("/diy", async (c) => {
    const db = c.get("db");
    const limit = c.req.query("limit");
    
    const query = db.select().from(diyProjects).orderBy(desc(diyProjects.createdAt));
    
    if (limit) {
      const projects = await query.limit(parseInt(limit)).all();
      return c.json(projects);
    }
    
    const projects = await query.all();
    return c.json(projects);
  })
  
  .get("/diy/:id", async (c) => {
    const db = c.get("db");
    const id = parseInt(c.req.param("id"));
    
    const project = await db.select().from(diyProjects).where(eq(diyProjects.id, id)).get();
    
    if (!project) {
      return c.json({ error: "Not found" }, 404);
    }
    
    return c.json(project);
  })
  
  .get("/chat/messages", async (c) => {
    const db = c.get("db");
    const messages = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.isDeleted, false))
      .orderBy(chatMessages.createdAt)
      .limit(100)
      .all();
    
    return c.json(messages);
  })
  
  .post(
    "/chat/messages",
    authenticatedOnly,
    zValidator("json", z.object({
      message: z.string().min(1).max(1000),
    })),
    async (c) => {
      const db = c.get("db");
      const user = c.get("user");
      const { message } = c.req.valid("json");
      
      if (!user) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      const newMessage = await db.insert(chatMessages).values({
        userId: user.id,
        userName: user.name || user.email,
        message,
        createdAt: new Date(),
        isDeleted: false,
      }).returning().get();
      
      return c.json(newMessage);
    }
  )
  
  .get("/useful-links", async (c) => {
    const db = c.get("db");
    const limit = c.req.query("limit");
    const category = c.req.query("category");
    
    let query = db.select().from(usefulLinks).orderBy(usefulLinks.order, desc(usefulLinks.createdAt));
    
    if (category) {
      query = db.select().from(usefulLinks).where(eq(usefulLinks.category, category)).orderBy(usefulLinks.order, desc(usefulLinks.createdAt));
    }
    
    if (limit) {
      const links = await query.limit(parseInt(limit)).all();
      return c.json(links);
    }
    
    const links = await query.all();
    return c.json(links);
  })
  
  .get("/useful-links/:id", async (c) => {
    const db = c.get("db");
    const id = parseInt(c.req.param("id"));
    
    const link = await db.select().from(usefulLinks).where(eq(usefulLinks.id, id)).get();
    
    if (!link) {
      return c.json({ error: "Not found" }, 404);
    }
    
    return c.json(link);
  });
