import { collection, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const SETTINGS_COLLECTION = (companyId: string) => `companies/${companyId}/settings`;
const SETTINGS_DOC = 'public_website';

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export interface WebsiteSettings {
  headline: string;
  subheadline: string;
  pricing: PricingTier[];
}

export const subscribeWebsiteSettings = (companyId: string, callback: (settings: WebsiteSettings | null) => void) => {
  const docRef = doc(db, SETTINGS_COLLECTION(companyId), SETTINGS_DOC);
  
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as WebsiteSettings);
    } else {
      // Default initial state
      const defaultSettings: WebsiteSettings = {
        headline: "L'IA qui automatise 90% de vos ventes.",
        subheadline: "Krypton convertit vos visiteurs en clients 24h/24 grâce à son agent commercial autonome.",
        pricing: [
          { id: "starter", name: "Starter", price: 49, features: ["Agent IA basique", "50 conversations/mois", "Dashboard Admin"] },
          { id: "pro", name: "Pro", price: 149, features: ["Agent IA illimité", "Dashboard temps réel", "Support dédié"] }
        ]
      };
      
      // Auto-initialize implicitly
      setDoc(docRef, defaultSettings).catch(console.error);
      callback(defaultSettings);
    }
  });
};

export const updateWebsiteSettings = async (companyId: string, updates: Partial<WebsiteSettings>) => {
  const docRef = doc(db, SETTINGS_COLLECTION(companyId), SETTINGS_DOC);
  await updateDoc(docRef, updates);
};
