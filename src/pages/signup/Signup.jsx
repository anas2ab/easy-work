import React, { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';


// styles
import './Signup.css';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [userPicture, setUserPicture] = useState(null);
    const [pictureUploadError, setPictureUploadError] = useState(null);

    const { signup, isPending, error } = useSignup();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        signup(email, password, displayName, userPicture);
    }

    const handleFileChange = (e) => {
        setUserPicture(null);

        // returns an array of files so we get the first one
        let selected = e.target.files[0];

        if (!selected) { // if they didnt select an image
            setPictureUploadError('Please select a file');
            return
        }

        if(!selected.type.includes('image')) { // if selected file isnt an image
            setPictureUploadError('Selected file must be an image');
            return
        } 

        if(selected.size > 200000) {
            // if selected image is larger than 1000k bytes
            setPictureUploadError('Image file size must be less than 200kb');
            return
        }

        setPictureUploadError(null);
        setUserPicture(selected);
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Sign up</h2>
            <label>
                <span>email:</span>
                <input 
                    required
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </label>
            <label>
                <span>password:</span>
                <input 
                    required
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </label>
            <label>
                <span>display name:</span>
                <input 
                    required
                    type="text"
                    onChange={(e) => setDisplayName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                    value={displayName}
                />
            </label>
            <label>
                <span>profile thumbnail:</span>
                <input 
                    required
                    type="file"
                    onChange={handleFileChange}
                />
                {pictureUploadError && <div className="error">{pictureUploadError}</div>}
            </label>
            {!isPending && <button className="btn">Sign up</button>}
            {isPending && <button className="btn" disabled>Loading</button>}
            {error && <div className="error">{error}</div>}
        </form>
    )
}
