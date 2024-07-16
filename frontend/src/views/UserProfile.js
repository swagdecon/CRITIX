import React, { useState, useMemo, useEffect, useCallback } from "react";
import { fetchData } from "../security/Data";
import CookieManager from "../security/CookieManager.js";
import isTokenExpired from "../security/IsTokenExpired.js";
import UserStyle from "../components/UserProfile/UserProfile.module.css"
import CardProfile from "../components/UserProfile/ProfileImageUpload.js"
import NavBar from "../components/NavBar/NavBar.js";
import { LineChart } from "@mui/x-charts/LineChart"
import jwt_decode from "jwt-decode";
import BannerImg from "../components/UserProfile/BannerImage.js";
import LoadingPage from "./LoadingPage.js";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Pagination from "@mui/material/Pagination";
import IndUserReview from "../components/Review/NewReview/IndUserReview.js";
import { reviewInputStyles, UserGraphStyle } from "../components/Shared/SharedMUI.js"
const allUserReviewsEndpoint = process.env.REACT_APP_USER_REVIEWS_ENDPOINT
const getAvatarEndpoint = process.env.REACT_APP_GET_USER_AVATAR
const getBannerEndpoint = process.env.REACT_APP_GET_USER_BANNER

export default function UserProfile() {

    const token = useMemo(() => CookieManager.decryptCookie("accessToken"), []);
    const decodedToken = useMemo(() => jwt_decode(token), [token]);
    const userId = decodedToken.userId
    const reviewsPerPage = 3;
    const [userReviews, setUserReviews] = useState(null)
    const [recentUserReview, setRecentUserReview] = useState(null)
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [renderUserSettings, setRenderUserSettings] = useState(false);
    const [renderUserHome, setRenderUserHome] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastName, setLastName] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = useCallback((event, page) => setCurrentPage(page));

    const displayReviews = useMemo(() => {
        let reviewsToDisplay = [];
        const startIdx = (currentPage - 1) * reviewsPerPage;
        const endIdx = startIdx + reviewsPerPage;
        reviewsToDisplay = userReviews?.slice(startIdx, endIdx);
        return reviewsToDisplay;
    }, [currentPage, userReviews]);

    const commonTextFieldProps = {
        fullWidth: true,
        sx: reviewInputStyles,
        InputLabelProps: {
            style: {
                color: "white"
            }
        }
    }

    const totalPages = userReviews ? Math.ceil(userReviews.length / reviewsPerPage) : 1;
    const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,20}/;

    const fetchBackendData = useCallback(async () => {

        try {
            await isTokenExpired();
            const [allUserReviews, avatarPic, bannerPic] = await Promise.all([
                fetchData(`${allUserReviewsEndpoint}${userId}`),
                fetchData(`${getAvatarEndpoint}${userId}`),
                fetchData(`${getBannerEndpoint}${userId}`)
            ]);
            setUserReviews(allUserReviews);
            setAvatar(avatarPic);
            setRecentUserReview(allUserReviews[0]);
            setBanner(bannerPic);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBackendData();
    }, [fetchBackendData]);

    function showUserSettings() {
        setRenderUserHome(false)
        setRenderUserSettings(true)
    }
    function showUserHome() {
        setRenderUserHome(true)
        setRenderUserSettings(false)
    }

    const handleFirstNameChange = e => {
        setFirstName(e.target.value);
        setFirstNameError(e.target.value ? '' : 'First name is required');
    };

    const handleLastNameChange = e => {
        setLastName(e.target.value);
        setLastNameError(e.target.value ? '' : 'Last name is required');
    };

    const handlePasswordChange = e => {
        setPassword(e.target.value);
        setPasswordError(passwordPattern.test(e.target.value) ? '' : 'Password must be 7-20 characters long, with at least one digit, one lowercase letter, and one uppercase letter');
    };

    const handleConfirmPasswordChange = e => {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError(e.target.value === password ? '' : 'Passwords do not match');
    };

    const handleSubmit = e => {
        e.preventDefault();

        // Trigger validation for all fields
        handleFirstNameChange({ target: { value: firstName } });
        handleLastNameChange({ target: { value: lastName } });
        handlePasswordChange({ target: { value: password } });
        handleConfirmPasswordChange({ target: { value: confirmPassword } });

        // Check for errors
        if (firstNameError || lastNameError || passwordError || confirmPasswordError) {
            alert('Please fix the errors in the form');
            return;
        }

        // Proceed with form submission
        alert('Form submitted successfully!');
    };
    return isLoading ? (
        <LoadingPage />
    ) : (
        <div className={UserStyle.container}>
            <NavBar />
            <div className={UserStyle["profile-card"]}>
                <div className={UserStyle["profile-header"]}>
                    < BannerImg userId={userId} bannerPic={banner} refetchBanner={fetchBackendData} /> :
                    <div className={UserStyle["main-profile"]}>
                        <CardProfile userId={userId} avatar={avatar} />
                        <div className={UserStyle["profile-names"]}>
                            <h1 className={UserStyle.username}>Connor Pant</h1>
                        </div>
                    </div>
                </div>

                <div className={UserStyle["profile-body"]}>
                    <div className={UserStyle["profile-actions"]}>
                        <button className={UserStyle.settings} onClick={showUserHome}>Home</button>

                        <button className={UserStyle.settings} onClick={showUserSettings}>Settings</button>
                        <section className={UserStyle.bio}>
                            <div className={UserStyle["bio-header"]}>
                                <i className="fa fa-info-circle"></i>
                                Bio
                            </div>
                            <p className={UserStyle["bio-text"]}>
                                Hi!, My name is Connor and I am the working on this application!
                            </p>
                        </section>
                    </div>
                    {renderUserHome && !renderUserSettings ?
                        <div className={UserStyle.MainInfoPanel}>
                            <div className={UserStyle.ActivityInfo}>
                                <h2 className={UserStyle.Title}>Your Activity (Logins)</h2>
                                <LineChart
                                    xAxis={[
                                        {
                                            scaleType: 'time',
                                            data: [
                                                new Date(2024, 0, 1),
                                                new Date(2024, 1, 1),
                                                new Date(2024, 2, 1),
                                                new Date(2024, 3, 1),
                                                new Date(2024, 4, 1),
                                                new Date(2024, 5, 1),
                                                new Date(2024, 6, 1),
                                                new Date(2024, 7, 1),
                                                new Date(2024, 8, 1),
                                                new Date(2024, 9, 1),
                                                new Date(2024, 10, 1),
                                                new Date(2024, 11, 1),

                                            ],
                                            tickNumber: 3,
                                        },
                                    ]}
                                    series={[
                                        {
                                            data: [1, 9, 4, 6.5, 7, 13, 2, 5.5, 2, 8.5, 4, 7.1],
                                            color: '#0096ff',

                                        },
                                    ]}
                                    width={1000}
                                    height={300}
                                    sx={UserGraphStyle}
                                />
                            </div>
                            <div className={UserStyle.RecentReviews}>
                                <h2 className={UserStyle.Title}>Recent review</h2>
                                <div className={UserStyle.AllUserReviews}>
                                    {recentUserReview ?
                                        <IndUserReview key={recentUserReview.movieId} avatar={recentUserReview.avatar} movieTitle={recentUserReview.movieTitle} createdDate={recentUserReview.createdDate} content={recentUserReview.content} rating={recentUserReview.rating} />
                                        : "No Recent Reviews"}
                                </div>
                            </div>
                            <div className={UserStyle.AllReviews}>
                                <h2 className={UserStyle.Title}>all reviews</h2>
                                <div className={UserStyle.AllUserReviews}>
                                    {displayReviews.map((review) => (
                                        <IndUserReview key={review.movieId} avatar={review.avatar} movieTitle={review.movieTitle} createdDate={review.createdDate} content={review.content} rating={review.rating} />
                                    ))}
                                </div>
                                <div className={UserStyle.PaginationWrapper}>
                                    <Pagination
                                        size="large"
                                        color="primary"
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        sx={{
                                            "& .MuiPaginationItem-root": {
                                                color: "#ffffff",
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        :
                        <div className={UserStyle.UserSettings}>
                            <div className={UserStyle.UserSettingsBox}>
                                <h2 className={UserStyle.Title}>General Information</h2>
                                <form className={UserStyle.UpdateInfoForm} onSubmit={handleSubmit}>
                                    <div className={UserStyle.GridContainer}>
                                        <div className={UserStyle.GridItem}>
                                            <TextField
                                                label="First Name"
                                                value={firstName}
                                                onChange={handleFirstNameChange}
                                                error={firstNameError}
                                                helperText={firstNameError}
                                                {...commonTextFieldProps}
                                            /></div>
                                        <div className={UserStyle.GridItem}>
                                            <TextField
                                                label="Last Name"
                                                value={lastName}
                                                onChange={handleLastNameChange}
                                                error={lastNameError}
                                                helperText={lastNameError}
                                                {...commonTextFieldProps}
                                            /></div>
                                        <div className={UserStyle.GridItem}>
                                            <TextField
                                                label="Password"
                                                value={password}
                                                onChange={handlePasswordChange}
                                                error={passwordError}
                                                helperText={passwordError}
                                                {...commonTextFieldProps}
                                            /></div>
                                        <div className={UserStyle.GridItem}>
                                            <TextField
                                                label="Confirm Password"
                                                value={confirmPassword}
                                                onChange={handleConfirmPasswordChange}
                                                error={confirmPasswordError}
                                                helperText={confirmPasswordError}
                                                {...commonTextFieldProps}
                                            /></div>
                                    </div>
                                    <div className={UserStyle.BtnWrapper}>
                                        <Button fullWidth sx={{ width: "50%" }} variant="contained">Confirm</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}