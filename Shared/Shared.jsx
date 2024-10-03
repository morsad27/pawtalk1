import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";  // Added updateDoc import
import { db } from "../config/FirebaseConfig";

const GetFavList = async (user) => {
    try {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        const docRef = doc(db, 'UserFavPet', userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap?.exists()) {
            return docSnap.data();  // Return the existing document data
        } else {
            // If no document exists, create a new one with empty favorites array
            await setDoc(docRef, {
                email: userEmail,
                favorites: []
            });
            return { email: userEmail, favorites: [] };  // Return the new document with empty favorites
        }
    } catch (error) {
        console.error("Error fetching favorite list:", error);
        return { email: user?.primaryEmailAddress?.emailAddress, favorites: [] };  // Return an empty list in case of an error
    }
};

const UpdateFav = async (user, favorites) => {
    try {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        const docRef = doc(db, 'UserFavPet', userEmail);

        // Update the document's favorites array
        await updateDoc(docRef, {
            favorites: favorites
        });
        console.log("Favorites updated successfully");
    } catch (error) {
        console.error("Error updating favorites:", error);
    }
};

export default {
    GetFavList,
    UpdateFav
};
