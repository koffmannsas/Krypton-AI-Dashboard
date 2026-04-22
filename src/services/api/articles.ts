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
  getDocs
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Article, Category } from "../../types/seo";

const ARTICLES_COLLECTION = (companyId: string) => `companies/${companyId}/articles`;
const CATEGORIES_COLLECTION = (companyId: string) => `companies/${companyId}/categories`;

export const subscribeArticles = (companyId: string, callback: (articles: Article[]) => void) => {
  const q = query(
    collection(db, ARTICLES_COLLECTION(companyId)),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
    callback(articles);
  });
};

export const createArticle = async (companyId: string, article: Partial<Article>) => {
  const docRef = await addDoc(collection(db, ARTICLES_COLLECTION(companyId)), {
    ...article,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateArticle = async (companyId: string, articleId: string, updates: Partial<Article>) => {
  const docRef = doc(db, ARTICLES_COLLECTION(companyId), articleId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteArticle = async (companyId: string, articleId: string) => {
  await deleteDoc(doc(db, ARTICLES_COLLECTION(companyId), articleId));
};

// Categories
export const subscribeCategories = (companyId: string, callback: (categories: Category[]) => void) => {
  const q = query(
    collection(db, CATEGORIES_COLLECTION(companyId)),
    orderBy("name", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    callback(categories);
  });
};

export const createCategory = async (companyId: string, category: Partial<Category>) => {
  await addDoc(collection(db, CATEGORIES_COLLECTION(companyId)), category);
};

export const getArticlesByCategory = async (companyId: string, categorySlug: string) => {
  const q = query(
    collection(db, ARTICLES_COLLECTION(companyId)),
    where("category", "==", categorySlug)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
};
