import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// Firebase configuration
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
const signupLink = document.getElementById('signup-link');
const loginLink = document.getElementById('login-link');
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');

// Form switch between SignUp and Login
signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.classList.add('d-none');
    signupContainer.classList.remove('d-none');
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupContainer.classList.add('d-none');
    loginContainer.classList.remove('d-none');
});

// Sign Up Form Submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        await Swal.fire({
            icon: 'success',
            title: 'Account Created!',
            text: 'You have successfully signed up!',
            timer: 2000,
            showConfirmButton: false
        });
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        let errorMessage = error.message;
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. Please login instead.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters';
        }
        
        Swal.fire({
            icon: 'error',
            title: 'Sign Up Failed',
            text: errorMessage
        });
    }
});

// Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        await Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            timer: 2000,
            showConfirmButton: false
        });
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        let errorMessage = error.message;
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email. Please sign up first.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again.';
        }
        
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: errorMessage
        });
    }
});

// Check auth state to redirect if already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});
