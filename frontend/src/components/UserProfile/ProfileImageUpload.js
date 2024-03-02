import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';
import UserStyle from './UserProfile.module.css';
import AddIcon from '@mui/icons-material/Add';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
const ImgUpload = ({ onChange, src }) => {
    const [editor, setEditor] = useState(null);
    const editorRef = useRef(null);
    const [btn, setBtn] = useState("add")

    const validateImage = (file) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (file && !allowedTypes.includes(file.type)) {
            window.alert('Please upload a valid image file (JPEG or PNG)');
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (validateImage(file)) {
            onChange(e);
            setBtn("save");
        }
    };

    const onClickSave = () => {
        if (editor) {
            const canvas = editor.getImageScaledToCanvas();
            console.log(canvas)
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
                <>
                    {btn === "add" ?
                        <>
                            <input id="photo-upload" type="file" onChange={handleChange} />
                            <AddIcon style={{ color: '#0096ff' }} className={UserStyle['add-icon']} />
                        </>
                        :
                        <>
                            <SaveAltIcon style={{ color: '#0096ff' }} onChange={onClickSave} className={UserStyle['save-icon']} />
                        </>
                    }
                </>
            </label>
        </div>
    );
};

const CardProfile = () => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    const photoUpload = e => {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files[0];
        reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <ImgUpload onChange={photoUpload} src={imagePreviewUrl || "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"} />
        </div>
    );
};

ImgUpload.propTypes = {
    onChange: PropTypes.func.isRequired,
    src: PropTypes.string.isRequired,
};

export default CardProfile;


