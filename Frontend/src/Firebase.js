import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB3pNHfUbkCPiOXv92bZH5ymnsJf8-di84",
    authDomain: "logisticspro-b2f81.firebaseapp.com",
    projectId: "logisticspro-b2f81",
    storageBucket: "logisticspro-b2f81.firebasestorage.app",
    messagingSenderId: "868407407017",
    appId: "1:868407407017:web:b7687f341b0179549f94b8",
    measurementId: "G-L9G3XFPRT2"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try{
        const response = await signInWithPopup(auth, googleProvider)
        const user = response.user
        const q = query(collection(db,"users"),where("uid", "==", user.uid))
        const docs = await getDocs(q)
        if(docs.docs.length === 0){
            await addDoc(collection(db,"users"),{
                uid: user.uid,
                email: user.email,
                authProvider: "google",
            })
        }
    }
    catch(error){
        console.log(error)
    }
}

const registerWithEmailAndPassword = async (email, password ) => {
    try{
        const response = await createUserWithEmailAndPassword(auth, email, password);
        const user = response.user;
        await addDoc(collection(db,"users"),{
            uid: user.uid,
            email,
            authProvider: "local",
        })
    }
    catch(error){
        console.log(error)
    }
}

const loginWithEmailAndPassword = async (email, password) => {
    try{
        await signInWithEmailAndPassword(auth, email, password)
    }
    catch(error){
        console.log(error)
    }
}

const setResetPasswordEmail = async (email) => {
    try{
        await sendPasswordResetEmail(auth, email)
    }
    catch(error){
        console.log(error)
    }
}

const logOut = async () => {
    try{
        await signOut(auth)
    }
    catch(error){
        console.log(error)
    }
}

export {
    signInWithGoogle,
    registerWithEmailAndPassword,
    loginWithEmailAndPassword,
    setResetPasswordEmail,
    logOut,
    auth,
    db
}