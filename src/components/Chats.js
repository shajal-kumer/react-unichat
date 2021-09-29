import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatEngine } from "react-chat-engine";
import { useHistory } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "./firebase";

export default function Chats() {
	const history = useHistory();
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);

	const getFile = async (url) => {
		const response = await fetch(url);
		const data = await response.blob();

		return new File([data], "userphoto.jpg", { type: "image/jpeg" });
	};

	useEffect( () => {	
			if (!user || user === null) {
				history.push("/");
				return;
			}

		 async function getOrSetUser() {
            	try {
					// Get-or-Create should be in a Firebase Function
					await axios.get("https://api.chatengine.io/users/me/", {
						headers: {
							"project-id": process.env.REACT_APP_CHAT_ENGINE_ID,
							"user-name": user.email,
							"user-secret": user.uid,
						},
					});

					setLoading(false);
				} catch (error) {
					let formdata = new FormData();
					formdata.append("email", user.email);
					formdata.append("username", user.email);
					formdata.append("secret", user.uid);

					try {
						const avatar = await getFile(user.photoURL);
						formdata.append("avatar", avatar, avatar.name);

						await axios.post("https://api.chatengine.io/users/", formdata, {
							headers: { "private-key": process.env.REACT_APP_CHAT_ENGINE_KEY },
						});
					} catch (error) {
						console.log("error", error.response);
					}
				}
        }
        getOrSetUser()
		
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
