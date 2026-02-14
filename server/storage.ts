import { eq, asc, and } from "drizzle-orm";
import { db } from "./db";
import {
  projects, goalSections, labBuckets, deliverables, bucketItems, chatMessages,
  type InsertProject, type Project,
  type InsertGoalSection, type GoalSection,
  type InsertLabBucket, type LabBucket,
  type InsertDeliverable, type Deliverable,
  type InsertBucketItem, type BucketItem,
  type InsertChatMessage, type ChatMessage,
} from "@shared/schema";

export interface IStorage {
  listProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(data: InsertProject): Promise<Project>;
  updateProject(id: string, data: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<void>;

  listGoalSections(projectId: string): Promise<GoalSection[]>;
  getGoalSection(id: string): Promise<GoalSection | undefined>;
  createGoalSection(data: InsertGoalSection): Promise<GoalSection>;
  updateGoalSection(id: string, data: Partial<InsertGoalSection>): Promise<GoalSection | undefined>;
  deleteGoalSection(id: string): Promise<void>;
  reorderGoalSections(projectId: string, ids: string[]): Promise<void>;

  listLabBuckets(projectId: string): Promise<LabBucket[]>;
  getLabBucket(id: string): Promise<LabBucket | undefined>;
  createLabBucket(data: InsertLabBucket): Promise<LabBucket>;
  updateLabBucket(id: string, data: Partial<InsertLabBucket>): Promise<LabBucket | undefined>;
  deleteLabBucket(id: string): Promise<void>;
  reorderLabBuckets(projectId: string, ids: string[]): Promise<void>;

  listDeliverables(projectId: string): Promise<Deliverable[]>;
  getDeliverable(id: string): Promise<Deliverable | undefined>;
  createDeliverable(data: InsertDeliverable): Promise<Deliverable>;
  updateDeliverable(id: string, data: Partial<InsertDeliverable>): Promise<Deliverable | undefined>;
  deleteDeliverable(id: string): Promise<void>;
  reorderDeliverables(projectId: string, ids: string[]): Promise<void>;

  listBucketItems(parentId: string, parentType: string): Promise<BucketItem[]>;
  createBucketItem(data: InsertBucketItem): Promise<BucketItem>;
  deleteBucketItem(id: string): Promise<void>;

  listChatMessages(parentId: string, parentType: string): Promise<ChatMessage[]>;
  createChatMessage(data: InsertChatMessage): Promise<ChatMessage>;
  updateChatMessage(id: string, data: Partial<InsertChatMessage>): Promise<ChatMessage | undefined>;
}

export class DatabaseStorage implements IStorage {
  async listProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(asc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [row] = await db.select().from(projects).where(eq(projects.id, id));
    return row;
  }

  async createProject(data: InsertProject): Promise<Project> {
    const [row] = await db.insert(projects).values(data).returning();
    return row;
  }

  async updateProject(id: string, data: Partial<InsertProject>): Promise<Project | undefined> {
    const [row] = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
    return row;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async listGoalSections(projectId: string): Promise<GoalSection[]> {
    return db.select().from(goalSections).where(eq(goalSections.projectId, projectId)).orderBy(asc(goalSections.sortOrder));
  }

  async getGoalSection(id: string): Promise<GoalSection | undefined> {
    const [row] = await db.select().from(goalSections).where(eq(goalSections.id, id));
    return row;
  }

  async createGoalSection(data: InsertGoalSection): Promise<GoalSection> {
    const [row] = await db.insert(goalSections).values(data).returning();
    return row;
  }

  async updateGoalSection(id: string, data: Partial<InsertGoalSection>): Promise<GoalSection | undefined> {
    const [row] = await db.update(goalSections).set(data).where(eq(goalSections.id, id)).returning();
    return row;
  }

  async deleteGoalSection(id: string): Promise<void> {
    await db.delete(goalSections).where(eq(goalSections.id, id));
  }

  async reorderGoalSections(projectId: string, ids: string[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await db.update(goalSections).set({ sortOrder: i }).where(and(eq(goalSections.id, ids[i]), eq(goalSections.projectId, projectId)));
    }
  }

  async listLabBuckets(projectId: string): Promise<LabBucket[]> {
    return db.select().from(labBuckets).where(eq(labBuckets.projectId, projectId)).orderBy(asc(labBuckets.sortOrder));
  }

  async getLabBucket(id: string): Promise<LabBucket | undefined> {
    const [row] = await db.select().from(labBuckets).where(eq(labBuckets.id, id));
    return row;
  }

  async createLabBucket(data: InsertLabBucket): Promise<LabBucket> {
    const [row] = await db.insert(labBuckets).values(data).returning();
    return row;
  }

  async updateLabBucket(id: string, data: Partial<InsertLabBucket>): Promise<LabBucket | undefined> {
    const [row] = await db.update(labBuckets).set(data).where(eq(labBuckets.id, id)).returning();
    return row;
  }

  async deleteLabBucket(id: string): Promise<void> {
    await db.delete(labBuckets).where(eq(labBuckets.id, id));
  }

  async reorderLabBuckets(projectId: string, ids: string[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await db.update(labBuckets).set({ sortOrder: i }).where(and(eq(labBuckets.id, ids[i]), eq(labBuckets.projectId, projectId)));
    }
  }

  async listDeliverables(projectId: string): Promise<Deliverable[]> {
    return db.select().from(deliverables).where(eq(deliverables.projectId, projectId)).orderBy(asc(deliverables.sortOrder));
  }

  async getDeliverable(id: string): Promise<Deliverable | undefined> {
    const [row] = await db.select().from(deliverables).where(eq(deliverables.id, id));
    return row;
  }

  async createDeliverable(data: InsertDeliverable): Promise<Deliverable> {
    const [row] = await db.insert(deliverables).values(data).returning();
    return row;
  }

  async updateDeliverable(id: string, data: Partial<InsertDeliverable>): Promise<Deliverable | undefined> {
    const [row] = await db.update(deliverables).set(data).where(eq(deliverables.id, id)).returning();
    return row;
  }

  async deleteDeliverable(id: string): Promise<void> {
    await db.delete(deliverables).where(eq(deliverables.id, id));
  }

  async reorderDeliverables(projectId: string, ids: string[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await db.update(deliverables).set({ sortOrder: i }).where(and(eq(deliverables.id, ids[i]), eq(deliverables.projectId, projectId)));
    }
  }

  async listBucketItems(parentId: string, parentType: string): Promise<BucketItem[]> {
    return db.select().from(bucketItems)
      .where(and(eq(bucketItems.parentId, parentId), eq(bucketItems.parentType, parentType)))
      .orderBy(asc(bucketItems.sortOrder));
  }

  async createBucketItem(data: InsertBucketItem): Promise<BucketItem> {
    const [row] = await db.insert(bucketItems).values(data).returning();
    return row;
  }

  async deleteBucketItem(id: string): Promise<void> {
    await db.delete(bucketItems).where(eq(bucketItems.id, id));
  }

  async listChatMessages(parentId: string, parentType: string): Promise<ChatMessage[]> {
    return db.select().from(chatMessages)
      .where(and(eq(chatMessages.parentId, parentId), eq(chatMessages.parentType, parentType)))
      .orderBy(asc(chatMessages.sortOrder));
  }

  async createChatMessage(data: InsertChatMessage): Promise<ChatMessage> {
    const [row] = await db.insert(chatMessages).values(data).returning();
    return row;
  }

  async updateChatMessage(id: string, data: Partial<InsertChatMessage>): Promise<ChatMessage | undefined> {
    const [row] = await db.update(chatMessages).set(data).where(eq(chatMessages.id, id)).returning();
    return row;
  }
}

export const storage = new DatabaseStorage();
