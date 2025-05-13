import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { 
    getAuth, 
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// Firebase configuration (same as app.js)
const firebaseConfig = {
    apiKey: "AIzaSyAShqykH1iT5-pWZxG1DswmkFB8rWn5fxM",
    authDomain: "text-auth-1ab4c.firebaseapp.com",
    projectId: "text-auth-1ab4c",
    storageBucket: "text-auth-1ab4c.firebasestorage.app",
    messagingSenderId: "866729642893",
    appId: "1:866729642893:web:17f65c760178412221cbc4",
    measurementId: "G-YXWKPSVB98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const userEmail = document.getElementById('user-email');
const userCreated = document.getElementById('user-created');
const logoutBtn = document.getElementById('logout-btn');

// Display user info
onAuthStateChanged(auth, (user) => {
    if (user) {
        userEmail.textContent = user.email;
        const creationDate = new Date(user.metadata.creationTime);
        userCreated.textContent = creationDate.toLocaleString();
    } else {
        // No user is signed in, redirect to login
        window.location.href = 'index.html';
    }
});

// Logout button
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        
        await Swal.fire({
            icon: 'success',
            title: 'Logged Out!',
            text: 'You have been successfully logged out.',
            timer: 2000,
            showConfirmButton: false
        });
        
        // Redirect to login page
        window.location.href = 'index.html';
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Logout Failed',
            text: error.message
        });
    }
});
