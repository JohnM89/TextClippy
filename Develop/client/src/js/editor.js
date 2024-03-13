// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';
import { header } from './header';

export default class {
  constructor() {
    // Retrieve data from IndexedDB or localStorage using getDb
    getDb().then((data) => {
      // Combine header content with retrieved data or set to header if no data is retrieved
      const initialContent = data ? header + '\n' + data : header;

      // Initialize CodeMirror editor with the combined content
      this.editor = CodeMirror(document.querySelector('#main'), {
        value: initialContent,
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true,
        indentUnit: 2,
        tabSize: 2,
      });

      // Event listener for editor changes to update localStorage
      this.editor.on('change', () => {
        localStorage.setItem('content', this.editor.getValue());
      });

      // Event listener to save content to IndexedDB when editor loses focus
      this.editor.on('blur', () => {
        console.log('The editor has lost focus');
        putDb(localStorage.getItem('content'));
      });
    });
  }
}
