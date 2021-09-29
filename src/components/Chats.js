import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { ChatEngine } from "react-chat-engine";
import { useHistory } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "./firebase";

export default function Chats() {
	const history = useHistory();
    const didMountRef = useRef(false);
    
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);

	const getFile = async (url) => {
		const response = await fetch(url);
		const data = await response.blob();

		return new File([data], "userphoto.jpg", { type: "image/jpeg" });
	};

	useEffect(() => {
		  if (!didMountRef.current) {
				didMountRef.current = true;

				if (!user || user === null) {
					history.push("/");
					return;
				}

				// Get-or-Create should be in a Firebase Function
				axios
					.get("https://api.chatengine.io/users/me/", {
						headers: {
							"project-id": process.env.REACT_APP_CHAT_ENGINE_ID,
							"user-name": user.email,
							"user-secret": user.uid,
						},
					})

					.then(() => setLoading(false))

					.catch((e) => {
						let formdata = new FormData();
						formdata.append("email", user.email);
						formdata.append("username", user.email);
						formdata.append("secret", user.uid);

						getFile(user.photoURL).then((avatar) => {
							formdata.append("avatar", avatar, avatar.name);

							axios
								.post("https://api.chatengine.io/users/", formdata, {
									headers: { "private-key": process.env.REACT_APP_CHAT_ENGINE_KEY },
								})
								.then(() => setLoading(false))
								.catch((e) => console.log("e", e.response));
						});
					});
				// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			}
	}, [user, history]);

	const handleLogout = async () => {
		 await auth.signOut();
		history.push("/");
	};
	if (!user || loading) return "Loading...";
	return (
		<div className="chats-page">
			<div className="nav-bar">
				<div className="logo-tab">Unichat</div>
				<div className="logout-tab" onClick={handleLogout}>
					Logout
				</div>
			</div>
			<ChatEngine
				height="calc(100vh - 66px)"
				projectID={process.env.REACT_APP_CHAT_ENGINE_ID}
				userName={user.email}
				userSecret={user.uid}
			></ChatEngine>
		</div>
	);
}
