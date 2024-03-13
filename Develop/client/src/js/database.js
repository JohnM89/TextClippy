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


export const getDb = async () => {
  console.error('getDb not implemented');
  console.log('GET from the database');
  
  const contactDb = await openDB('jate', 1);
  
  // read only transaction
  const tx = contactDb.transaction('jate', 'readonly');
  
  const store = tx.objectStore('jate');
  
  const request = store.getAll();
  
  const result = await request;
  
  console.log('result.value', result);
  
  return result;
};

initdb();
