const VISITOR_KEY = 'siteops.visitorId';

let fallbackId = null;

const readStoredId = () => {
  try {
    return localStorage.getItem(VISITOR_KEY);
  } catch {
    return null;
  }
};

const storeId = (id) => {
  try {
    localStorage.setItem(VISITOR_KEY, id);
  } catch {
    fallbackId = id;
  }
};

export const getVisitorId = () => {
  const storedId = readStoredId() ?? fallbackId;
  if (storedId) return storedId;
  const newId = crypto.randomUUID();
  storeId(newId);
  return newId;
};
