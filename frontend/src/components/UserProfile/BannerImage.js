import React, { useState } from 'react';
import UserStyle from './UserProfile.module.css';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import { sendData } from '../../security/Data';
import { validateImageURL } from '../Shared/Shared';
import defaultBannerPic from "./banner.jpg"

const updateBannerImgEndpoint = process.env.REACT_APP_UPDATE_BANNER_IMAGE

export default function BannerImg({ userId, bannerPic }) {
    console.log(bannerPic)
    const [bannerPicture, setBannerPicture] = useState(bannerPic);
    const handleAddClick = async () => {
        const url = window.prompt("Please enter the image URL:");
        if (url) {
            try {
                await validateImageURL(url);
                setBannerPicture(url)
                const data = {
                    bannerPic: url
                }
                const response = await sendData(`${updateBannerImgEndpoint}${userId}`, data);
                response.ok ?
                    window.alert('New Banner Picture Saved Successfully')
                    :
                    window.alert('An Error Occured, Please try again')

            } catch (error) {
                window.alert('Please enter a valid image URL');
            }
        }
    };

    return (
        <>
            <img className={UserStyle.BannerImg} src={bannerPicture ? bannerPicture : defaultBannerPic} />
            <label htmlFor="photo-upload" className={UserStyle['custom-file-upload']}>
                <AddIcon
                    style={{ color: '#0096ff' }}
                    className={UserStyle['add-icon']}
                    onClick={handleAddClick}
                />
            </label>
        </>
    );
}
BannerImg.propTypes = {
    userId: PropTypes.string.isRequired,
    bannerPic: PropTypes.string,
    refetchBanner: PropTypes.func.isRequired,
};