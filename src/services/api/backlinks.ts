import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  getDocs,
  limit
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Backlink, BacklinkTarget } from "../../types/seo";

const TARGETS_COLLECTION = (companyId: string) => `companies/${companyId}/backlink_targets`;
const BACKLINKS_COLLECTION = (companyId: string) => `companies/${companyId}/backlinks`;

export const subscribeBacklinkTargets = (companyId: string, callback: (targets: BacklinkTarget[]) => void) => {
  const q = query(
    collection(db, TARGETS_COLLECTION(companyId)),
    orderBy("da", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BacklinkTarget)));
  }, (error) => {
    console.error("Firebase error in subscribeBacklinkTargets:", error);
    callback([]);
  });
};

export const subscribeBacklinks = (companyId: string, callback: (backlinks: Backlink[]) => void) => {
  const q = query(
    collection(db, BACKLINKS_COLLECTION(companyId)),
    orderBy("placedAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Backlink)));
  }, (error) => {
    console.error("Firebase error in subscribeBacklinks:", error);
    callback([]);
  });
};

export const getBacklinkTargets = async (companyId: string) => {
  const q = query(
    collection(db, TARGETS_COLLECTION(companyId)),
    orderBy("da", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BacklinkTarget));
};

export const getBacklinks = async (companyId: string) => {
  const q = query(
    collection(db, BACKLINKS_COLLECTION(companyId)),
    orderBy("placedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Backlink));
};

export const addBacklinkTarget = async (companyId: string, target: Partial<BacklinkTarget>) => {
  const docRef = await addDoc(collection(db, TARGETS_COLLECTION(companyId)), {
    ...target,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateBacklinkTarget = async (companyId: string, id: string, updates: Partial<BacklinkTarget>) => {
  const docRef = doc(db, TARGETS_COLLECTION(companyId), id);
  await updateDoc(docRef, updates);
};

export const createBacklink = async (companyId: string, backlink: Partial<Backlink>) => {
  const docRef = await addDoc(collection(db, BACKLINKS_COLLECTION(companyId)), {
    ...backlink,
    placedAt: serverTimestamp()
  });
  return docRef.id;
};

export const getNextTarget = async (companyId: string) => {
  const q = query(
    collection(db, TARGETS_COLLECTION(companyId)),
    where("status", "==", "pending"),
    orderBy("da", "desc"),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as BacklinkTarget;
};
