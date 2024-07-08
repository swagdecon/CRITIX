import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';
import UserStyle from './UserProfile.module.css';
import AddIcon from '@mui/icons-material/Add';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { sendData } from '../../security/Data';
const SaveProfileImgEndpoint = process.env.REACT_APP_UPDATE_PROFILE_IMAGE
const ImgUpload = ({ onChange, src, userId }) => {
    const [editor, setEditor] = useState(null);
    const editorRef = useRef(null);
    const [btn, setBtn] = useState("add");
    const [profilePicture, setProfilePicture] = useState(null);

    const validateImageURL = (url) => {
        const img = new Image();
        img.src = url;

        return new Promise((resolve, reject) => {
            img.onload = () => {
                if (img.width > 0 && img.height > 0) {
                    resolve(true);
                } else {
                    reject(new Error("Invalid image URL"));
                }
            };
            img.onerror = () => {
                reject(new Error("Invalid image URL"));
            };
        });
    };

    const handleAddClick = async () => {
        const url = window.prompt("Please enter the image URL:");
        if (url) {
            try {
                await validateImageURL(url);
                setProfilePicture(url)
                onChange(url);
                setBtn("save");
            } catch (error) {
                window.alert('Please enter a valid image URL');
            }
        }
    };

    const onClickSave = async () => {
        if (editor) {
            const data = {
                profilePic: profilePicture
            }
            const response = await sendData(`${SaveProfileImgEndpoint}/${userId}`, data);
            response.ok ? window.alert('New Profile Picture Saved Successfully') : window.alert('An Error Occured, Please try again');
        }

    };
    return (
        <div className={UserStyle['img-container']}>
            <AvatarEditor
                ref={editorRef}
                image={src}
                width={150}
                height={150}
                scale={1}
                borderRadius={125}
                rotate={0}
                color={[23, 23, 23]}
                crossOrigin="anonymous"
                className={UserStyle['img-wrap']}
                onImageReady={() => setEditor(editorRef.current)}
            />
            <label htmlFor="photo-upload" className={UserStyle['custom-file-upload']}>
                {btn === "add" ? (
                    <>
                        <AddIcon
                            style={{ color: '#0096ff' }}
                            className={UserStyle['add-icon']}
                            onClick={handleAddClick} // Trigger URL prompt
                        />
                    </>
                ) : (
                    <SaveAltIcon
                        style={{ color: '#0096ff' }}
                        onClick={onClickSave}
                        className={UserStyle['save-icon']}
                    />
                )}
            </label>
        </div>
    );
};

const CardProfile = ({ userId }) => {
    const [imageURL, setImageURL] = useState(null);

    const photoUpload = (url) => {
        setImageURL(url);
    };

    return (
        <ImgUpload onChange={photoUpload} userId={userId} src={imageURL || "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"} />
    );
};
CardProfile.propTypes = {
    userId: PropTypes.string.isRequired,
}
ImgUpload.propTypes = {
    onChange: PropTypes.func.isRequired,
    src: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired
};

export default CardProfile;


