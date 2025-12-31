import { initializeApp } from "firebase/app"
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, signOut,
} from 'firebase/auth'



const firebaseConfig = {
    apiKey: "AIzaSyApWYtg33VmXPkHbtERs2o9F6oe50jvjog",
    authDomain: "stockweb-a9b37.firebaseapp.com",
    projectId: "stockweb-a9b37",
    storageBucket: "stockweb-a9b37.firebasestorage.app",
    messagingSenderId: "842856794672",
    appId: "1:842856794672:web:f55d7e4f0108b3a463bbf5"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = firebase.firestore();

const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
        .then(cred => {
            console.log('user created:', cred.user)
            signupForm.reset()
        })
        .catch(err => {
            console.log(err.message)
        })
})

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('user signed out');
            
        })
        .catch(err => {
            console.log(err.message)
        })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
        .then(cred => {
            console.log('user logged in:', cred.user);
            window.location.href = "home.html";
        })
        .catch(err => {
            console.log(err.message)
        })
})
