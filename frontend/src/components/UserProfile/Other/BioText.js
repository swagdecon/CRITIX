import React, { useState } from "react";
import DOMPurify from "dompurify";
import UserStyle from "../UserProfile.module.css"
import { sendData } from "../../../security/Data";
import PropTypes from "prop-types";

const updateBioEndpoint = process.env.REACT_APP_UPDATE_PROFILE_BIO
const API_URL = process.env.REACT_APP_BACKEND_API_URL

export default function EditableBio({ bioText }) {
    const defaultBio = "Here you can change your bio, be creative! (50 words max)";
    const [bio, setBio] = useState(bioText || defaultBio);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [lastSavedTime, setLastSavedTime] = useState(0);

    const handleChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^a-zA-Z0-9 .,!'?]/g, "");
        if (value.split(" ").length <= 50) {
            setBio(value);
        }
    };

    const toggleEditing = async () => {
        if (editing) {
            if (Date.now() - lastSavedTime < 30000) { // 30-second cooldown
                alert("Please wait before saving again.");
                return;
            }

            const sanitizedBio = DOMPurify.sanitize(bio).trim();
            setBio(sanitizedBio === "" ? defaultBio : sanitizedBio);
            setSaving(true);

            try {
                const data = { bioText: sanitizedBio };
                const response = await sendData(`${API_URL}${updateBioEndpoint}`, data);

                if (response.ok) {
                    setLastSavedTime(Date.now());
                    alert("New Bio Saved Successfully");
                } else {
                    alert("An Error Occurred, Please try again");
                }
            } catch (error) {
                alert("An Error Occurred, Please try again later");
            }

            setSaving(false);
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
                    disabled={saving}
                />
            ) : (
                <p className={UserStyle["bio-text"]}>{bio}</p>
            )}
            <button
                onClick={toggleEditing}
                className={UserStyle["bio-save-btn"]}
                disabled={saving}
            >
                {saving ? "Saving..." : editing ? "Save" : "Edit Bio"}
            </button>
        </div>
    );
}
EditableBio.propTypes = {
    bioText: PropTypes.string
};
