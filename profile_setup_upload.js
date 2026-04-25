// ---------------------------------------------------
// STEP 1: INITIALIZE FIREBASE
// ---------------------------------------------------
// REPLACE THE PLACEHOLDERS BELOW WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// ---------------------------------------------------
// STEP 2: GET REFERENCES & CHECK AUTH
// ---------------------------------------------------
const profileForm = document.getElementById("profile-form");
const nameInput = document.getElementById("name");
const locationInput = document.getElementById("location");
const errorMessage = document.getElementById("error-message");

let currentUser = null;

// Listen for Auth State
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        console.log("User is logged in:", user.email);
    } else {
        console.log("No user found, redirecting to login.");
        window.location.href = "login.html";
    }
});

// ---------------------------------------------------
// STEP 3: FORM SUBMIT LISTENER (SAVE PROFILE DATA)
// ---------------------------------------------------
profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    errorMessage.innerText = "";

    const name = nameInput.value;
    const location = locationInput.value;

    if (!name || !location) {
        errorMessage.innerText = "Please fill in both fields.";
        return;
    }

    if (!currentUser) {
        errorMessage.innerText = "Error: Not logged in. Please go back to login.";
        return;
    }

    const profileUpdates = {
        name: name,
        location: location
    };

    // Save data to the database under the user's uid
    db.ref('users/' + currentUser.uid).update(profileUpdates)
        .then(() => {
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            console.error("Error saving profile data:", error);
            errorMessage.innerText = "Error saving profile. Try again.";
        });
});