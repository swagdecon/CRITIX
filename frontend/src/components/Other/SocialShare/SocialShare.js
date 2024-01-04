import React from 'react'
import PropTypes from "prop-types"
import socialShareStyle from "./socialshare.module.css"
import {
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    PinterestIcon,
    PinterestShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TumblrIcon,
    TumblrShareButton,
    TwitterShareButton,
    XIcon,
    WhatsappIcon,
    WhatsappShareButton,
    EmailShareButton,
    EmailIcon,
} from "react-share";

export default function SharePagePopup({ shareUrl }) {
    const title = "Check out this movie on Popflix!"
    const totalUrl = "https://popflix.netlify.app" + shareUrl
    return (
        <div>
            <div className={socialShareStyle.title}>
                <span>Where Would You Like To Share?</span>
            </div>
            <div className={socialShareStyle["popup-content"]}>
                <div className={socialShareStyle.share_container}>
                    <div className="EmailShareButton">
                        <EmailShareButton
                            title={title}
                            url={totalUrl}
                        >
                            <EmailIcon size={50} round />
                        </EmailShareButton>
                    </div>
                    <div className="FbShareButton">
                        <FacebookShareButton
                            title={title}
                            url={totalUrl}
                        >
                            <FacebookIcon size={50} round />
                        </FacebookShareButton>
                    </div>
                    <div className="FbMsgShareButton">
                        <FacebookMessengerShareButton
                            url={totalUrl}
                            title={title}
                        >
                            <FacebookMessengerIcon size={50} round />
                        </FacebookMessengerShareButton>
                    </div>
                    <div className="RedditShareButton">
                        <RedditShareButton
                            url={totalUrl}
                            title={title}

                        >
                            <RedditIcon size={50} round />
                        </RedditShareButton>
                    </div>
                    <div className="PinterestShareButton">
                        <PinterestShareButton
                            url={totalUrl}
                            title={title}

                        >
                            <PinterestIcon size={50} round />
                        </PinterestShareButton>
                    </div>
                    <div className="TwitterShareButton">
                        <TwitterShareButton
                            url={totalUrl}
                            title={title}

                        >
                            <XIcon size={50} round />
                        </TwitterShareButton>
                    </div>
                    <div className="LinkedInShareButton">
                        <LinkedinShareButton
                            url={totalUrl}
                            title={title}

                        >
                            <LinkedinIcon size={50} round />
                        </LinkedinShareButton>
                    </div>
                    <div className="TelegramShareButton">
                        <TelegramShareButton
                            url={totalUrl}
                            title={title}

                        >
                            <TelegramIcon size={50} round />
                        </TelegramShareButton>
                    </div>
                    <div className="TumblerShareButton">
                        <TumblrShareButton
                            url={totalUrl}
                            title={title}

                        >
                            <TumblrIcon size={50} round />
                        </TumblrShareButton>
                    </div>
                    <div className="WhatsappShareButton">
                        <WhatsappShareButton
                            url={totalUrl}
                            title={title}

                        >
                            <WhatsappIcon size={50} round />
                        </WhatsappShareButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

SharePagePopup.propTypes = {
    shareUrl: PropTypes.string.isRequired,
};
