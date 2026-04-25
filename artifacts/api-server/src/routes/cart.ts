import { Router } from "express";
import { db, cartItemsTable, productsTable, categoriesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { AddToCartBody, RemoveFromCartParams, UpdateCartItemBody, UpdateCartItemParams } from "@workspace/api-zod";

const router = Router();

async function getCartItemWithProduct(cartItemId: number) {
  const [row] = await db
    .select({
      id: cartItemsTable.id,
      productId: cartItemsTable.productId,
      quantity: cartItemsTable.quantity,
      sessionId: cartItemsTable.sessionId,
      productName: productsTable.name,
      productNameAr: productsTable.nameAr,
      productDescription: productsTable.description,
      productDescriptionAr: productsTable.descriptionAr,
      productPrice: productsTable.price,
      productOriginalPrice: productsTable.originalPrice,
      productCurrency: productsTable.currency,
      productImageUrl: productsTable.imageUrl,
      productImages: productsTable.images,
      productCategoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      categoryNameAr: categoriesTable.nameAr,
      productInStock: productsTable.inStock,
      productRating: productsTable.rating,
      productReviewCount: productsTable.reviewCount,
      productIsNew: productsTable.isNew,
      productIsFeatured: productsTable.isFeatured,
      productIsBestseller: productsTable.isBestseller,
      productVolume: productsTable.volume,
    })
    .from(cartItemsTable)
    .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(cartItemsTable.id, cartItemId))
    .limit(1);
  return row;
}

router.get("/cart", async (req, res) => {
  try {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
      res.json([]);
      return;
    }

    const rows = await db
      .select({
        id: cartItemsTable.id,
        productId: cartItemsTable.productId,
        quantity: cartItemsTable.quantity,
        sessionId: cartItemsTable.sessionId,
        productName: productsTable.name,
        productNameAr: productsTable.nameAr,
        productDescription: productsTable.description,
        productDescriptionAr: productsTable.descriptionAr,
        productPrice: productsTable.price,
        productOriginalPrice: productsTable.originalPrice,
        productCurrency: productsTable.currency,
        productImageUrl: productsTable.imageUrl,
        productImages: productsTable.images,
        productCategoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        categoryNameAr: categoriesTable.nameAr,
        productInStock: productsTable.inStock,
        productRating: productsTable.rating,
        productReviewCount: productsTable.reviewCount,
        productIsNew: productsTable.isNew,
        productIsFeatured: productsTable.isFeatured,
        productIsBestseller: productsTable.isBestseller,
        productVolume: productsTable.volume,
      })
      .from(cartItemsTable)
      .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(cartItemsTable.sessionId, sessionId));

    res.json(
      rows.map((r) => ({
        id: r.id,
        productId: r.productId,
        quantity: r.quantity,
        sessionId: r.sessionId,
        product: {
          id: r.productId,
          name: r.productName ?? "",
          nameAr: r.productNameAr ?? "",
          description: r.productDescription,
          descriptionAr: r.productDescriptionAr,
          price: Number(r.productPrice ?? 0),
          originalPrice: r.productOriginalPrice ? Number(r.productOriginalPrice) : null,
          currency: r.productCurrency ?? "AED",
          imageUrl: r.productImageUrl,
          images: r.productImages ?? [],
          categoryId: r.productCategoryId ?? 0,
          categoryName: r.categoryName ?? "",
          categoryNameAr: r.categoryNameAr ?? "",
          inStock: r.productInStock ?? true,
          rating: r.productRating ? Number(r.productRating) : null,
          reviewCount: r.productReviewCount ?? 0,
          isNew: r.productIsNew ?? false,
          isFeatured: r.productIsFeatured ?? false,
          isBestseller: r.productIsBestseller ?? false,
          volume: r.productVolume,
        },
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to get cart");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const body = AddToCartBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }

    const { productId, quantity = 1, sessionId } = body.data;

    const existing = await db
      .select()
      .from(cartItemsTable)
      .where(and(eq(cartItemsTable.productId, productId), eq(cartItemsTable.sessionId, sessionId)))
      .limit(1);

    let cartItemId: number;
    if (existing.length > 0) {
      const [updated] = await db
        .update(cartItemsTable)
        .set({ quantity: existing[0].quantity + quantity })
        .where(eq(cartItemsTable.id, existing[0].id))
        .returning({ id: cartItemsTable.id });
      cartItemId = updated.id;
    } else {
      const [inserted] = await db
        .insert(cartItemsTable)
        .values({ productId, quantity, sessionId })
        .returning({ id: cartItemsTable.id });
      cartItemId = inserted.id;
    }

    const item = await getCartItemWithProduct(cartItemId);
    if (!item) {
      res.status(500).json({ message: "Failed to retrieve cart item" });
      return;
    }

    res.status(201).json({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      sessionId: item.sessionId,
      product: {
        id: item.productId,
        name: item.productName ?? "",
        nameAr: item.productNameAr ?? "",
        description: item.productDescription,
        descriptionAr: item.productDescriptionAr,
        price: Number(item.productPrice ?? 0),
        originalPrice: item.productOriginalPrice ? Number(item.productOriginalPrice) : null,
        currency: item.productCurrency ?? "AED",
        imageUrl: item.productImageUrl,
        images: item.productImages ?? [],
        categoryId: item.productCategoryId ?? 0,
        categoryName: item.categoryName ?? "",
        categoryNameAr: item.categoryNameAr ?? "",
        inStock: item.productInStock ?? true,
        rating: item.productRating ? Number(item.productRating) : null,
        reviewCount: item.productReviewCount ?? 0,
        isNew: item.productIsNew ?? false,
        isFeatured: item.productIsFeatured ?? false,
        isBestseller: item.productIsBestseller ?? false,
        volume: item.productVolume,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to add to cart");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/cart/:productId", async (req, res) => {
  try {
    const params = UpdateCartItemParams.safeParse({ productId: Number(req.params.productId) });
    if (!params.success) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }

    const body = UpdateCartItemBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ message: "Invalid request body" });
      return;
    }

    const { quantity, sessionId } = body.data;

    const [updated] = await db
      .update(cartItemsTable)
      .set({ quantity })
      .where(
        and(
          eq(cartItemsTable.productId, params.data.productId),
          eq(cartItemsTable.sessionId, sessionId)
        )
      )
      .returning({ id: cartItemsTable.id });

    if (!updated) {
      res.status(404).json({ message: "Cart item not found" });
      return;
    }

    const item = await getCartItemWithProduct(updated.id);
    if (!item) {
      res.status(500).json({ message: "Failed to retrieve cart item" });
      return;
    }

    res.json({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      sessionId: item.sessionId,
      product: {
        id: item.productId,
        name: item.productName ?? "",
        nameAr: item.productNameAr ?? "",
        description: item.productDescription,
        descriptionAr: item.productDescriptionAr,
        price: Number(item.productPrice ?? 0),
        originalPrice: item.productOriginalPrice ? Number(item.productOriginalPrice) : null,
        currency: item.productCurrency ?? "AED",
        imageUrl: item.productImageUrl,
        images: item.productImages ?? [],
        categoryId: item.productCategoryId ?? 0,
        categoryName: item.categoryName ?? "",
        categoryNameAr: item.categoryNameAr ?? "",
        inStock: item.productInStock ?? true,
        rating: item.productRating ? Number(item.productRating) : null,
        reviewCount: item.productReviewCount ?? 0,
        isNew: item.productIsNew ?? false,
        isFeatured: item.productIsFeatured ?? false,
        isBestseller: item.productIsBestseller ?? false,
        volume: item.productVolume,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update cart item");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/cart/:productId", async (req, res) => {
  try {
    const params = RemoveFromCartParams.safeParse({ productId: Number(req.params.productId) });
    if (!params.success) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }

    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
      res.status(400).json({ message: "sessionId is required" });
      return;
    }

    const [deleted] = await db
      .delete(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.productId, params.data.productId),
          eq(cartItemsTable.sessionId, sessionId)
        )
      )
      .returning();

    if (!deleted) {
      res.status(404).json({ message: "Cart item not found" });
      return;
    }

    res.json({ id: deleted.id, productId: deleted.productId, quantity: deleted.quantity, sessionId: deleted.sessionId, product: null as any });
  } catch (err) {
    req.log.error({ err }, "Failed to remove from cart");
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
