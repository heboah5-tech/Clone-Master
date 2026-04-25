import { Router } from "express";
import { db, productsTable, categoriesTable } from "@workspace/db";
import { eq, like, sql, asc, desc } from "drizzle-orm";
import {
  ListProductsQueryParams,
  GetProductParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/products/summary", async (req, res) => {
  try {
    const [totalProducts] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(productsTable);
    const [totalCategories] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(categoriesTable);
    const [inStock] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(productsTable)
      .where(eq(productsTable.inStock, true));
    const [newArrivals] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(productsTable)
      .where(eq(productsTable.isNew, true));
    const [bestsellers] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(productsTable)
      .where(eq(productsTable.isBestseller, true));
    const [prices] = await db
      .select({
        min: sql<number>`min(price::numeric)`,
        max: sql<number>`max(price::numeric)`,
      })
      .from(productsTable);

    res.json({
      totalProducts: totalProducts.count,
      totalCategories: totalCategories.count,
      inStockCount: inStock.count,
      newArrivalsCount: newArrivals.count,
      bestsellersCount: bestsellers.count,
      priceRange: {
        min: prices.min ?? 0,
        max: prices.max ?? 0,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get products summary");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const query = ListProductsQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ message: "Invalid query parameters" });
      return;
    }
    const { categoryId, search, limit = 20, offset = 0 } = query.data;

    const conditions = [];
    if (categoryId) conditions.push(eq(productsTable.categoryId, categoryId));
    if (search) conditions.push(like(productsTable.name, `%${search}%`));

    const rows = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        nameAr: productsTable.nameAr,
        description: productsTable.description,
        descriptionAr: productsTable.descriptionAr,
        price: productsTable.price,
        originalPrice: productsTable.originalPrice,
        currency: productsTable.currency,
        imageUrl: productsTable.imageUrl,
        images: productsTable.images,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        categoryNameAr: categoriesTable.nameAr,
        inStock: productsTable.inStock,
        rating: productsTable.rating,
        reviewCount: productsTable.reviewCount,
        isNew: productsTable.isNew,
        isFeatured: productsTable.isFeatured,
        isBestseller: productsTable.isBestseller,
        volume: productsTable.volume,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(conditions.length > 0 ? sql`${conditions.join(" AND ")}` : undefined)
      .orderBy(desc(productsTable.isFeatured), asc(productsTable.id))
      .limit(limit)
      .offset(offset);

    res.json(
      rows.map((r) => ({
        ...r,
        price: Number(r.price),
        originalPrice: r.originalPrice ? Number(r.originalPrice) : null,
        rating: r.rating ? Number(r.rating) : null,
        categoryName: r.categoryName ?? "",
        categoryNameAr: r.categoryNameAr ?? "",
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const params = GetProductParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }

    const [row] = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        nameAr: productsTable.nameAr,
        description: productsTable.description,
        descriptionAr: productsTable.descriptionAr,
        price: productsTable.price,
        originalPrice: productsTable.originalPrice,
        currency: productsTable.currency,
        imageUrl: productsTable.imageUrl,
        images: productsTable.images,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        categoryNameAr: categoriesTable.nameAr,
        inStock: productsTable.inStock,
        rating: productsTable.rating,
        reviewCount: productsTable.reviewCount,
        isNew: productsTable.isNew,
        isFeatured: productsTable.isFeatured,
        isBestseller: productsTable.isBestseller,
        volume: productsTable.volume,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, params.data.id))
      .limit(1);

    if (!row) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json({
      ...row,
      price: Number(row.price),
      originalPrice: row.originalPrice ? Number(row.originalPrice) : null,
      rating: row.rating ? Number(row.rating) : null,
      categoryName: row.categoryName ?? "",
      categoryNameAr: row.categoryNameAr ?? "",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get product");
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
