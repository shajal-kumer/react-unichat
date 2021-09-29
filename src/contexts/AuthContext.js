import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../components/firebase";

const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const history = useHistory();

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			console.log(user);
			setUser(user);
			setLoading(false);
			if (user) history.push("/chats");
		});
	}, [history]);

	return <AuthContext.Provider value={{user}}>{!loading && children}</AuthContext.Provider>;
};
