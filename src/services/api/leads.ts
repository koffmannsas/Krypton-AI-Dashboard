import { collection, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

const LEADS_COLLECTION = (companyId: string) => `companies/${companyId}/leads`;

export interface Lead {
  id?: string;
  score: number;
  status: 'cold' | 'warm' | 'hot';
  email: string | null;
  needs: string[];
  chatHistory: string[];
  createdAt?: any;
  updatedAt?: any;
}

export const subscribeLeads = (companyId: string, callback: (leads: Lead[]) => void) => {
  const q = query(
    collection(db, LEADS_COLLECTION(companyId)),
    orderBy("updatedAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
  });
};

export const createLead = async (companyId: string, leadData: Partial<Lead>) => {
  const docRef = await addDoc(collection(db, LEADS_COLLECTION(companyId)), {
    ...leadData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateLead = async (companyId: string, leadId: string, updates: Partial<Lead>) => {
  const docRef = doc(db, LEADS_COLLECTION(companyId), leadId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};
