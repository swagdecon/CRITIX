import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';
import UserStyle from './UserProfile.module.css';
import AddIcon from '@mui/icons-material/Add';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { sendData } from '../../security/Data';
import { validateImageURL } from '../Shared/Shared';

const saveProfileImgEndpoint = process.env.REACT_APP_UPDATE_PROFILE_IMAGE;

const ImgUpload = ({ onChange, src }) => {
    const [editor, setEditor] = useState(null);
    const editorRef = useRef(null);
    const [btn, setBtn] = useState("add");

    const handleAddClick = async () => {
        const url = window.prompt("Please enter the image URL:");
        if (url) {
            try {
                const sanitizedUrl = new URL(url).href;
                await validateImageURL(sanitizedUrl);
                onChange(url);
                setBtn("save");
            } catch (error) {
                console.error(error);
                window.alert('Please enter a valid image URL');
            }
        }
    };

    const onClickSave = async () => {
        if (editor) {
            const profilePic = editor.getImageScaledToCanvas().toDataURL();

            const data = JSON.stringify(profilePic)


            const response = await sendData(saveProfileImgEndpoint, data);
            response.ok
                ? window.alert('New Profile Picture Saved Successfully')
                : window.alert('An Error Occurred, Please try again');
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
                className={UserStyle.AvatarEditor}
                rotate={0}
                color={[0, 0, 0]}
                crossOrigin="anonymous"
                onImageReady={() => setEditor(editorRef.current)}
            />
            <label htmlFor="photo-upload" className={UserStyle['custom-file-upload']}>
                {btn === "add" ? (
                    <>
                        <AddIcon
                            style={{ color: '#0096ff' }}
                            className={UserStyle['add-icon']}
                            onClick={handleAddClick}
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

export default function ProfilePicture({ avatar }) {
    const [imageURL, setImageURL] = useState(() => {
        try {
            const parsedData = JSON.parse(avatar);
            return parsedData;
        } catch {
            return avatar;
        }
    });

    const photoUpload = (url) => {
        setImageURL(url);
    };

    return (
        <ImgUpload
            onChange={photoUpload}
            src={imageURL || avatar}
        />
    );
}

ProfilePicture.propTypes = {
    avatar: PropTypes.string.isRequired
}

ImgUpload.propTypes = {
    onChange: PropTypes.func.isRequired,
    src: PropTypes.string.isRequired,
};
