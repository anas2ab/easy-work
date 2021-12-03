import { useEffect, useState } from "react";
import { auth, firestore } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setError(null);
        setIsPending(true);

        // sign the user in

        try {
            const res = await auth.signInWithEmailAndPassword(email, password);

            // dispatch login action
            dispatch({ type: 'LOGIN', payload: res.user });
            
            // update online status
            const { uid } = res.user;
            await firestore.collection('users').doc(uid).update({ online: true });
            
            // update state
            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }


        } catch (err) {
            if (!isCancelled) {
                console.log(err.message);
                setError(err.message);
                setIsPending(false);
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { login, error, isPending };
}