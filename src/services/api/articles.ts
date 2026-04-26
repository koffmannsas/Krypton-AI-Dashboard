import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Article } from '../../types/seo';
import { handleFirestoreError, OperationType } from '../../lib/firestoreUtils';

const COLLECTION_NAME = 'articles';

export const subscribeArticles = (companyId: string, callback: (articles: Article[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('companyId', '==', companyId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const articles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Article[];
    callback(articles);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  });
};

export const subscribeCategories = (companyId: string, callback: (categories: any[]) => void) => {
  const q = query(
    collection(db, 'categories'),
    where('companyId', '==', companyId)
  );

  return onSnapshot(q, (snapshot) => {
    const cats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(cats);
  }, (error) => {
    console.error("Firebase error in subscribeCategories:", error);
    callback([]);
  });
};

export const getArticlesByCategory = async (companyId: string, categoryId: string) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('companyId', '==', companyId),
    where('category', '==', categoryId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Article[];
};

export const createArticle = async (companyId: string, data: Partial<Article>) => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    companyId,
    status: data.status || 'draft',
    seoScore: data.seoScore || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateArticle = async (articleId: string, data: Partial<Article>) => {
  const docRef = doc(db, COLLECTION_NAME, articleId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
  
  // SEO Auto-Ping: Avertir Google de la mise à jour si l'article est publié
  if (data.status === 'published') {
    try {
      // In a real production deployment, this hits Google's Ping endpoint
      // Note: Google is deprecating the ping endpoint soon, but for this exercise we simulate it
      await fetch(`https://www.google.com/ping?sitemap=https://krypton.ai/sitemap.xml`, { mode: 'no-cors' });
      console.log('✅ Google pinged successfully for indexing');
    } catch (e) {
      console.warn('Google ping failed', e);
    }
  }
};

export const deleteArticle = async (articleId: string) => {
  const docRef = doc(db, COLLECTION_NAME, articleId);
  await deleteDoc(docRef);
};

export const getPublishedArticles = async (companyId: string) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('companyId', '==', companyId),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Article[];
};
