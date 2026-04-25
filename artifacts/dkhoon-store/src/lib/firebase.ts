import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined;
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;
const appId = import.meta.env.VITE_FIREBASE_APP_ID as string | undefined;

const config = {
  apiKey: apiKey ?? "",
  authDomain: projectId ? `${projectId}.firebaseapp.com` : "",
  projectId: projectId ?? "",
  storageBucket: projectId ? `${projectId}.appspot.com` : "",
  appId: appId ?? "",
};

export const isFirebaseConfigured = Boolean(apiKey && projectId && appId);

let app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(config);
  _db = getFirestore(app);
  _auth = getAuth(app);
}

export const db = _db;
export const auth = _auth;
export const firebaseApp = app;

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "قيد المراجعة",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export interface Order {
  id: string;
  orderNumber: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  notes?: string;
}
