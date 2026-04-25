import { Router } from "express";
import { db, productsTable, bannersTable, categoriesTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

async function getProductsWithCategory(condition?: Parameters<typeof db.select>[0]) {
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
    .limit(8);

  return rows.map((r) => ({
    ...r,
    price: Number(r.price),
    originalPrice: r.originalPrice ? Number(r.originalPrice) : null,
    rating: r.rating ? Number(r.rating) : null,
    categoryName: r.categoryName ?? "",
    categoryNameAr: r.categoryNameAr ?? "",
  }));
}

router.get("/featured", async (req, res) => {
  try {
    const banners = await db.select().from(bannersTable).limit(5);

    const featured = await db
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
      .where(eq(productsTable.isFeatured, true))
      .limit(8);

    const newArrivals = await db
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
      .where(eq(productsTable.isNew, true))
      .limit(8);

    const bestsellers = await db
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
      .where(eq(productsTable.isBestseller, true))
      .limit(8);

    const mapProducts = (rows: typeof featured) =>
      rows.map((r) => ({
        ...r,
        price: Number(r.price),
        originalPrice: r.originalPrice ? Number(r.originalPrice) : null,
        rating: r.rating ? Number(r.rating) : null,
        categoryName: r.categoryName ?? "",
        categoryNameAr: r.categoryNameAr ?? "",
      }));

    res.json({
      heroBanners: banners,
      featuredProducts: mapProducts(featured),
      newArrivals: mapProducts(newArrivals),
      bestsellers: mapProducts(bestsellers),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get featured content");
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
