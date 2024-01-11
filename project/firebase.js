
import { initializeApp } from "firebase/app";
import {getFirestore,collection,getDocs,addDoc,doc,updateDoc,setDoc} from "firebase/firestore"
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAfPJvYPxSX9QgTMneeJvAxvY4BpqaZhsE",
  authDomain: "final-project-54426.firebaseapp.com",
  projectId: "final-project-54426",
  storageBucket: "final-project-54426.appspot.com",
  messagingSenderId: "696366922801",
  appId: "1:696366922801:web:a40c1c9c94563f493ee910",
  measurementId: "G-4J4SCENBL9"
};

const app = initializeApp(firebaseConfig);


const firebaseAuth=getAuth(app)
const db=getFirestore(app)
export {firebaseAuth,db,collection,getDocs,addDoc,doc,updateDoc,setDoc}
