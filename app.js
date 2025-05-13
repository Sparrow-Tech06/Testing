import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Generate or get Device ID
function getDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
}

// Check if device already has an account
async function checkDeviceAccount(deviceId) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('deviceId', '==', deviceId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

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
    const deviceId = getDeviceId();

    try {
        // Check if device already has an account
        const deviceHasAccount = await checkDeviceAccount(deviceId);
        if (deviceHasAccount) {
            throw new Error('This device already has an account. Only one account per device is allowed.');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save user data with device ID
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: email,
            deviceId: deviceId,
            createdAt: new Date().toISOString()
        });
        
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
        
        // Verify device ID matches
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
            const storedDeviceId = userDoc.data().deviceId;
            const currentDeviceId = getDeviceId();
            
            if (storedDeviceId !== currentDeviceId) {
                await signOut(auth);
                throw new Error('This account was created on a different device. Please use the original device.');
            }
        }
        
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
