import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';
import UserStyle from './UserProfile.module.css';
import AddIcon from '@mui/icons-material/Add';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { sendData } from '../../security/Data';
// import { validateImageURL } from '../Shared/Shared';

const saveProfileImgEndpoint = process.env.REACT_APP_UPDATE_PROFILE_IMAGE;
const proxyImgEndpoint = process.env.REACT_APP_PROXY_IMG;

const ImgUpload = ({ picture }) => {
    const [btn, setBtn] = useState("add");
    const [avatar, setAvatar] = useState(picture)
    const editorRef = useRef(null);

    const handleAddClick = async () => {
        const url = window.prompt("Please enter the image URL:");
        if (url) {
            try {
                setAvatar(`${proxyImgEndpoint}?url=${encodeURIComponent(url)}`)

                setBtn("save");
            } catch (error) {
                console.error(error);
                window.alert('Please enter a valid image URL');
            }
        }
    };
    const onClickSave = async () => {
        const profilePicture = editorRef.current.getImageScaledToCanvas().toDataURL()
        const response = await sendData(saveProfileImgEndpoint, { profilePic: profilePicture });
        window.alert(response.ok ? 'New Profile Picture Saved Successfully' : 'An Error Occurred, Please try again');

    };

    return (
        <div className={UserStyle['img-container']}>
            <AvatarEditor
                ref={editorRef}
                image={avatar}
                width={150}
                height={150}
                scale={1}
                borderRadius={125}
                className={UserStyle.AvatarEditor}
                rotate={0}
                color={[0, 0, 0]}
                crossOrigin='anonymous'
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
    return <ImgUpload picture={avatar} />;
}

ProfilePicture.propTypes = {
    avatar: PropTypes.string.isRequired
}

ImgUpload.propTypes = {
    picture: PropTypes.string.isRequired,
};
