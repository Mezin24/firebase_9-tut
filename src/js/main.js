import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase.config';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore/lite';
import { alertSuccess, alertDanger } from './alert';

const addForm = document.getElementById('add-form');
const deleteForm = document.getElementById('delete-form');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const curRef = collection(db, 'books');

async function getBooks() {
  const booksSnapshot = await getDocs(curRef);
  const booksList = booksSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return booksList;
}

addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { value: title } = addForm.title;
  const { value: author } = addForm.author;

  await addDoc(collection(db, 'books'), {
    title,
    author,
  });

  document.documentElement.insertAdjacentHTML('afterbegin', alertSuccess);
  setTimeout(() => document.documentElement.firstElementChild.remove(), 3000);

  addForm.reset();
});

deleteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { value: id } = deleteForm.id;

  await deleteDoc(doc(db, 'books', id));

  document.documentElement.insertAdjacentHTML('afterbegin', alertDanger);
  setTimeout(() => document.documentElement.firstElementChild.remove(), 3000);
  deleteForm.reset();
});

getBooks().then((res) => console.log(res));
