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

export default function SharePagePopup(shareUrl) {
    return (
        <div>
            <div className={socialShareStyle.title}>
                <span>Where Would You Like To Share?</span>
            </div>
            <div className={socialShareStyle["popup-content"]}>
                <div className={socialShareStyle.share_container}>
                    <div className="EmailShareButton">
                        <EmailShareButton
                            url={shareUrl}
                        >
                            <EmailIcon size={50} round />
                        </EmailShareButton>
                    </div>
                    <div className="FbShareButton">
                        <FacebookShareButton
                            url={shareUrl}
                        >
                            <FacebookIcon size={50} round />
                        </FacebookShareButton>
                    </div>
                    <div className="FbMsgShareButton">
                        <FacebookMessengerShareButton
                            url={shareUrl}
                        >
                            <FacebookMessengerIcon size={50} round />
                        </FacebookMessengerShareButton>
                    </div>
                    <div className="ReddotShareButton">
                        <RedditShareButton
                            url={shareUrl}
                        >
                            <RedditIcon size={50} round />
                        </RedditShareButton>
                    </div>
                    <div className="PinterestShareButton">
                        <PinterestShareButton
                            url={shareUrl}
                        >
                            <PinterestIcon size={50} round />
                        </PinterestShareButton>
                    </div>
                    <div className="TwitterShareButton">
                        <TwitterShareButton
                            url={shareUrl}
                        >
                            <XIcon size={50} round />
                        </TwitterShareButton>
                    </div>
                    <div className="LinkedInShareButton">
                        <LinkedinShareButton
                            url={shareUrl}
                        >
                            <LinkedinIcon size={50} round />
                        </LinkedinShareButton>
                    </div>
                    <div className="TelegramShareButton">
                        <TelegramShareButton
                            url={shareUrl}
                        >
                            <TelegramIcon size={50} round />
                        </TelegramShareButton>
                    </div>
                    <div className="TumblerShareButton">
                        <TumblrShareButton
                            url={shareUrl}
                        >
                            <TumblrIcon size={50} round />
                        </TumblrShareButton>
                    </div>
                    <div className="WhatsappShareButton">
                        <WhatsappShareButton
                            url={shareUrl}
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
    shareLink: PropTypes.string.isRequired,
};
