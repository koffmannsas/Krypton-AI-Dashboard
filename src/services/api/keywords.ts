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

const KEYWORDS_COLLECTION = (companyId: string) => `companies/${companyId}/keywords`;

export interface Keyword {
  id: string;
  term: string;
  cluster: string;
  intent: 'traffic' | 'conversion' | 'informational' | 'comparative' | 'transactional' | 'decisional' | 'commercial';
  status: 'pending' | 'processing' | 'completed';
  priority: number;
  secondaryKeywords?: string[];
  articleId?: string;
  processedAt?: any;
}

export const subscribeKeywords = (companyId: string, callback: (keywords: Keyword[]) => void) => {
  const q = query(
    collection(db, KEYWORDS_COLLECTION(companyId)),
    orderBy("priority", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Keyword)));
  }, (error) => {
    console.error("Firebase error in subscribeKeywords:", error);
    callback([]);
  });
};

export const addKeywords = async (companyId: string, keywords: Partial<Keyword>[]) => {
  const batch = keywords.map(kw => 
    addDoc(collection(db, KEYWORDS_COLLECTION(companyId)), {
      ...kw,
      status: 'pending',
      priority: kw.priority || 0,
      createdAt: serverTimestamp()
    })
  );
  await Promise.all(batch);
};

export const getNextKeyword = async (companyId: string) => {
  const q = query(
    collection(db, KEYWORDS_COLLECTION(companyId)),
    where("status", "==", "pending"),
    orderBy("priority", "desc"),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Keyword;
};

export const updateKeyword = async (companyId: string, id: string, updates: Partial<Keyword>) => {
  const docRef = doc(db, KEYWORDS_COLLECTION(companyId), id);
  await updateDoc(docRef, updates);
};
