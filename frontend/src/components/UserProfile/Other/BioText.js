import React, { useState } from "react";
import DOMPurify from "dompurify";
import UserStyle from "../UserProfile.module.css"

export default function EditableBio() {
    const [bio, setBio] = useState("Here you can change your bio, be creative! (50 words max)");
    const [editing, setEditing] = useState(false);

    const handleChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^a-zA-Z0-9 .,!'?]/g, "");
        if (value.split(" ").length <= 50) {
            setBio(value);
        }
    };

    const toggleEditing = () => {
        if (editing) {
            const sanitizedBio = DOMPurify.sanitize(bio);
            setBio(sanitizedBio);
        }
        setEditing(!editing);
    };

    return (
        <div className={UserStyle["bio-container"]}>
            {editing ? (
                <textarea
                    value={bio}
                    onChange={handleChange}
                    maxLength={300}
                    className={UserStyle["bio-input"]}
                    rows={3}
                />
            ) : (
                <p className={UserStyle["bio-text"]}>{bio}</p>
            )}
            <button onClick={toggleEditing} className={UserStyle["bio-save-btn"]}>
                {editing ? "Save" : "Edit Bio"}
            </button>
        </div>
    );
}
