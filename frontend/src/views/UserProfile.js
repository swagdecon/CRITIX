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

const allUserReviewsEndpoint = process.env.REACT_APP_USER_REVIEWS_ENDPOINT
const getAvatarEndpoint = process.env.REACT_APP_GET_USER_AVATAR
const getBannerEndpoint = process.env.REACT_APP_GET_USER_BANNER
const DEFAULT_ACTOR_IMAGE = process.env.REACT_APP_DEFAULT_ACTOR_IMAGE

export default function UserProfile() {

    const token = useMemo(() => CookieManager.decryptCookie("accessToken"), []);
    const decodedToken = useMemo(() => jwt_decode(token), [token]);
    const userId = decodedToken.userId
    const [userReviews, setUserReviews] = useState(null)
    const [recentUserReview, setRecentUserReview] = useState(null)
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [renderUserSettings, setRenderUserSettings] = useState(false);
    const [renderUserHome, setRenderUserHome] = useState(true);
    const [email, setEmail] = useState("");
    const [emailConfirm, setEmailConfirm] = useState("");
    const [emailConfirmError, setEmailConfirmError] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastName, setLastName] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const emailPattern = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;
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

    const handleEmailChange = e => {
        setEmail(e.target.value);
        setEmailError(emailPattern.test(e.target.value) ? '' : 'Invalid email address');
    };

    const handleEmailConfirmChange = e => {
        setEmailConfirm(e.target.value);
        setEmailConfirmError(e.target.value === email ? '' : 'Email addresses do not match');
    };

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
        handleEmailChange({ target: { value: email } });
        handleEmailConfirmChange({ target: { value: emailConfirm } });
        handleFirstNameChange({ target: { value: firstName } });
        handleLastNameChange({ target: { value: lastName } });
        handlePasswordChange({ target: { value: password } });
        handleConfirmPasswordChange({ target: { value: confirmPassword } });

        // Check for errors
        if (emailError || emailConfirmError || firstNameError || lastNameError || passwordError || confirmPasswordError) {
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
                        {/* <button className={UserStyle.follow}>Follow</button>
                        <button className={UserStyle.message}>Message</button> */}
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
                                    sx={{
                                        //change left yAxis label styles
                                        "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                                            strokeWidth: "1",
                                            fill: "white"
                                        },
                                        // change all labels fontFamily shown on both xAxis and yAxis
                                        "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel": {
                                            fontFamily: "Roboto",
                                        },
                                        // change bottom label styles
                                        "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                                            strokeWidth: "0.5",
                                            fill: "white"
                                        },
                                        // bottomAxis Line Styles
                                        "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                                            stroke: "white",
                                            strokeWidth: 1
                                        },
                                        // leftAxis Line Styles
                                        "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                                            stroke: "white",
                                            strokeWidth: 1
                                        },
                                    }}
                                />
                            </div>
                            <div className={UserStyle.RecentReviews}>
                                <h2 className={UserStyle.Title}>Recent reviews</h2>
                                <div className={UserStyle.AllUserReviews}>
                                    {recentUserReview ?
                                        <div className={UserStyle.IndUserReviews} key={recentUserReview.movieId}>
                                            <div className={UserStyle.ProfilePic}>
                                                <img src={avatar ? avatar : DEFAULT_ACTOR_IMAGE} alt="User Avatar" />
                                            </div>
                                            <div className={UserStyle.ContentWrapper}>
                                                <div className={UserStyle.ContentHeaderWrapper}>
                                                    <div className={UserStyle.UserName}>{recentUserReview.author}</div>
                                                    <div className={UserStyle.TimeAgo}>
                                                        {recentUserReview.createdDate}
                                                    </div>
                                                </div>
                                                <div className={UserStyle.ReviewContent}>{recentUserReview.content}</div>
                                            </div>
                                        </div>
                                        : "No Recent Reviews"}
                                </div>
                            </div>
                            <div className={UserStyle.AllReviews}>
                                <h2 className={UserStyle.Title}>all reviews</h2>
                                <div className={UserStyle.AllUserReviews}>
                                    {userReviews?.map((review) => (<div className={UserStyle.IndUserReviews} key={review.movieId}>
                                        <div className={UserStyle.ProfilePic}>
                                            <img src={avatar ? avatar : DEFAULT_ACTOR_IMAGE} alt="User Avatar" />
                                        </div>
                                        <div className={UserStyle.ContentWrapper}>
                                            <div className={UserStyle.ContentHeaderWrapper}>
                                                <div className={UserStyle.UserName}>{review.author}</div>
                                                <div className={UserStyle.TimeAgo}>
                                                    {review.createdDate}
                                                </div>
                                            </div>
                                            <div className={UserStyle.ReviewContent}>{review.content}</div>
                                        </div>
                                    </div>
                                    ))}
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
                                                fullWidth
                                                label="Email"
                                                value={email}
                                                onChange={handleEmailChange}
                                                error={emailError}
                                                helperText={emailError}
                                            />
                                        </div>
                                        <div className={UserStyle.GridItem}>
                                            <TextField
                                                fullWidth
                                                label="Confirm Email"
                                                value={emailConfirm}
                                                onChange={handleEmailConfirmChange}
                                                error={emailConfirmError}
                                                helperText={emailConfirmError}
                                            /></div>
                                        <div className={UserStyle.GridItem}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                value={firstName}
                                                onChange={handleFirstNameChange}
                                                error={firstNameError}
                                                helperText={firstNameError}
                                            /></div>
                                        <div className={UserStyle.GridItem}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                value={lastName}
                                                onChange={handleLastNameChange}
                                                error={lastNameError}
                                                helperText={lastNameError}
                                            /></div>
                                        <div className={UserStyle.GridItem}>
                                            <TextField
                                                fullWidth
                                                label="Password"
                                                value={password}
                                                onChange={handlePasswordChange}
                                                error={passwordError}
                                                helperText={passwordError}
                                            /></div>
                                        <div className={UserStyle.GridItem}>
                                            <TextField
                                                fullWidth
                                                label="Confirm Password"
                                                value={confirmPassword}
                                                onChange={handleConfirmPasswordChange}
                                                error={confirmPasswordError}
                                                helperText={confirmPasswordError}
                                            /></div>
                                    </div>
                                    <Button variant="contained">Confirm</Button>
                                </form>
                            </div>

                        </div>
                    }
                </div>
            </div>
        </div >
    )
}