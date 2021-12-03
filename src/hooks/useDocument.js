import { useEffect, useState } from "react";
import { firestore } from "../firebase/config";

export const useDocument = (collection, id) => {
    
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);

    // realtime data for document

    useEffect(() => {
        const ref = firestore.collection(collection).doc(id);

        const unsubscribe = ref.onSnapshot((snapshot) => {
            if (snapshot.data()) {
                setDocument({ ...snapshot.data(), id: snapshot.id });
                setError(null);
            } else {
                setError('no such document exists');
            }
        }, (error) => {
            console.log(error.message);
            setError('failed to get document');
        });

        // cleanup function
        return () => unsubscribe();

    }, [collection, id]);

    return { document, error };
}