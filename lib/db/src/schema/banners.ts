import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bannersTable = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  subtitle: text("subtitle"),
  subtitleAr: text("subtitle_ar"),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBannerSchema = createInsertSchema(bannersTable).omit({
  id: true,
  createdAt: true,
});
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type Banner = typeof bannersTable.$inferSelect;
