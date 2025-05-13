// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// Your web app's Firebase configuration
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
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const signupLink = document.getElementById('signup-link');
const loginLink = document.getElementById('login-link');
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('dashboard');
const userEmail = document.getElementById('user-email');
const errorMessage = document.getElementById('error-message');

// Form switch karna (SignUp <-> Login)
signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    signupContainer.classList.remove('hidden');
    errorMessage.classList.add('hidden');
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
    errorMessage.classList.add('hidden');
});

// Sign Up Form Submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Sign up successful
        showDashboard(userCredential.user);
    } catch (error) {
        showError(error.message);
    }
});

// Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Login successful
        showDashboard(userCredential.user);
    } catch (error) {
        showError(error.message);
    }
});

// Logout Button
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        // Logout successful
        signupContainer.classList.remove('hidden');
        loginContainer.classList.add('hidden');
        dashboard.classList.add('hidden');
    } catch (error) {
        showError(error.message);
    }
});

// Auth State Observer (user logged in/out check karna)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        showDashboard(user);
    } else {
        // User is signed out
        signupContainer.classList.remove('hidden');
        loginContainer.classList.add('hidden');
        dashboard.classList.add('hidden');
    }
});

// Dashboard dikhana
function showDashboard(user) {
    signupContainer.classList.add('hidden');
    loginContainer.classList.add('hidden');
    dashboard.classList.remove('hidden');
    userEmail.textContent = user.email;
    errorMessage.classList.add('hidden');
}

// Error message dikhana
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}