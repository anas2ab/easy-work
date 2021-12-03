import { useEffect, useState } from 'react';
import { auth, storage, firestore } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const { dispatch } = useAuthContext();

    const signup = async (email, password, displayName, userPicture) => {
        setError(null);
        setIsPending(true);

        try {
            // signup user
            const res = await auth.createUserWithEmailAndPassword(email, password);

            if (!res) {
                throw new Error('Could not complete signup');
            }
            
            // upload user picture
            const uploadPath = `pictures/${res.user.uid}/${userPicture.name}`;
            const img = await storage.ref(uploadPath).put(userPicture);
            const photoURL = await img.ref.getDownloadURL();

            // add display name to user

            await res.user.updateProfile({ displayName, photoURL });

            // create a user document
            await firestore.collection('users').doc(res.user.uid).set({
                online: true,
                displayName,
                photoURL
            });

            // dispatch login action
            dispatch({type: 'LOGIN', payload: res.user });

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

    return { error, isPending, signup } 
}