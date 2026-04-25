import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db, type Order, type OrderStatus } from "./firebase";

const ORDERS_COLLECTION = "orders";

function toMillis(v: unknown): number {
  if (!v) return Date.now();
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const t = new Date(v).getTime();
    return isNaN(t) ? Date.now() : t;
  }
  if (typeof (v as Timestamp)?.toMillis === "function") {
    return (v as Timestamp).toMillis();
  }
  return Date.now();
}

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(-3);
  return `DKH-${ts}${rand}`;
}

export async function createOrder(
  data: Omit<Order, "id" | "orderNumber" | "status" | "createdAt" | "updatedAt">,
): Promise<{ id: string; orderNumber: string }> {
  if (!db) throw new Error("Firebase not configured");
  const orderNumber = generateOrderNumber();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const ref = doc(collection(db, ORDERS_COLLECTION), id);
  await setDoc(ref, {
    ...data,
    id,
    orderNumber,
    status: "pending" as OrderStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id, orderNumber };
}

export function listenOrders(callback: (orders: Order[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const orders: Order[] = snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          orderNumber: String(data.orderNumber ?? d.id),
          itemId: String(data.itemId ?? ""),
          itemTitle: String(data.itemTitle ?? ""),
          itemImage: String(data.itemImage ?? ""),
          quantity: Number(data.quantity ?? 1),
          unitPrice: Number(data.unitPrice ?? 0),
          total: Number(data.total ?? 0),
          customerName: String(data.customerName ?? ""),
          customerEmail: String(data.customerEmail ?? ""),
          customerPhone: String(data.customerPhone ?? ""),
          shippingAddress: String(data.shippingAddress ?? ""),
          shippingCity: String(data.shippingCity ?? ""),
          status: (data.status as OrderStatus) ?? "pending",
          createdAt: toMillis(data.createdAt),
          updatedAt: toMillis(data.updatedAt),
          notes: data.notes ? String(data.notes) : undefined,
        };
      });
      callback(orders);
    },
    (err) => {
      console.error("Error listening to orders:", err);
      callback([]);
    },
  );
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, ORDERS_COLLECTION, id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOrder(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, ORDERS_COLLECTION, id));
}
