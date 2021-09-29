import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase
	.initializeApp({
		apiKey: "AIzaSyDT4V28mD8aGjmQ5EEBnVWl6nisRZrO94E",
		authDomain: "unichat-25a66.firebaseapp.com",
		projectId: "unichat-25a66",
		storageBucket: "unichat-25a66.appspot.com",
		messagingSenderId: "977895676739",
		appId: "1:977895676739:web:f449a1ed645761141c2df6",
	})
	.auth();
