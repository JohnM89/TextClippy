import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// putDb function
export const putDb = async (content) => {
  console.error('putDb not implemented');
  console.log('PUT to the database:', content);
  const contactDb = await openDB('jate', 1);
  
  // ensure reading and writing to the database
  const tx = contactDb.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  const request = store.put(content);
  await request;
  console.log('Content added/updated successfully.');
};


// getDb function
export const getDb = async () => {
  try {
    console.log('Retrieving...');
    const jateDb = await openDB('jate', 1);
    const transaction = jateDb.transaction('jate', 'readonly');
    const safe = transaction.objectStore('jate');
    // get the first item in the database (was missing initially)
    const request = safe.get(1); 
    const result = await request;
    console.log('Retrieved content:', result);
    return result?.value; 
  } catch (error) {
    console.error('An error occurred:', error);
    return null;
  }
};

initdb();
