# AgilityAI — Decision-Making & Project Management Tool

## Overview
A decision-making and project management tool with four main sections: Dashboard, Goals, Lab/Knowledge Buckets, and Deliverables. Projects are selected via a header dropdown and switching projects updates all pages. Supports two levels of AI chat: global page-level and bucket-scoped conversations.

## Architecture
- **Frontend**: React + Vite + TypeScript, Tailwind CSS + shadcn/ui, wouter routing, @tanstack/react-query for data fetching
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Data Flow**: Frontend fetches via React Query → Express API routes → Drizzle storage layer → PostgreSQL

## Database Schema
- `projects` — id, name, summary, executiveSummary, dashboardStatus (jsonb), createdAt
- `goal_sections` — id, projectId (FK), genericName, subtitle, completeness, totalItems, completedItems, content, sortOrder
- `lab_buckets` — id, projectId (FK), name, sortOrder
- `deliverables` — id, projectId (FK), title, subtitle, completeness, status, content, engaged, sortOrder
- `bucket_items` — id, parentId, parentType (goal/lab/deliverable), type, title, preview, date, url, fileName, fileSizeLabel, sortOrder
- `chat_messages` — id, parentId, parentType (goal_page/lab_page/deliverable_page/goal_bucket/lab_bucket/deliverable_bucket), role, content, timestamp, hasSaveableContent, saved, sortOrder

## Key Files
- `shared/schema.ts` — Drizzle schema definitions + Zod insert schemas
- `server/db.ts` — Database connection
- `server/storage.ts` — Storage interface (IStorage) + DatabaseStorage implementation
- `server/routes.ts` — Express API routes
- `server/seed.ts` — Demo data seeding (auto-seeds on first request if no projects exist)
- `client/src/lib/api.ts` — Frontend API client
- `client/src/lib/projectStore.ts` — Selected project state (localStorage for quick access)
- `client/src/lib/queryClient.ts` — React Query client + apiRequest helper

## Recent Changes (Feb 14, 2026)
- Converted from localStorage prototype to full-stack PostgreSQL architecture
- Created database schema with Drizzle ORM for all entities
- Built complete CRUD API (projects, goals, lab, deliverables, items, messages)
- Updated all frontend pages (Dashboard, Goals, Lab, Deliverables, Projects, Header) to use API
- Added auto-seeding of demo data on first load
- Optimistic updates pattern: local state updates immediately, API call runs in background

## User Preferences
- Clean, minimal UI with consistent bucket patterns across pages
- Two-level chat: global page-level + bucket-scoped
- Drag-and-drop reordering for sections/buckets/deliverables
- Memory/attachments panel in expandable buckets
- History sidebar (ScopedHistory component)
