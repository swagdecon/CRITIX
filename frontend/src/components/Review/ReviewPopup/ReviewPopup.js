import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import AlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import AlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import AlignRightIcon from '@mui/icons-material/FormatAlignRight';
import AlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { LinearProgress, Chip, Tooltip } from '@mui/material';
import { useEditor, EditorContent } from "@tiptap/react";
import ReCAPTCHA from "react-google-recaptcha";
import InputSlider from "../Slider/Slider"
import { Modal, Box, Typography, IconButton, Fade, Button } from "@mui/material";
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import CodeBlock from '@tiptap/extension-code-block';
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from '@tiptap/extension-text-align';
import CookieManager from "../../../security/CookieManager";
import { motion, AnimatePresence } from 'framer-motion'
import { format } from "date-fns";
import Filter from "bad-words";
import { jwtDecode } from "jwt-decode";
import CloseIcon from '@mui/icons-material/Close';
import { Extension } from "@tiptap/react";
import { sendData } from "../../../security/Data";

const RECAPTCHA_ENDPOINT = process.env.REACT_APP_RECAPTCHA_ENDPOINT;
const CREATE_REVIEW_ENDPOINT = process.env.REACT_APP_CREATE_REVIEW_ENDPOINT;
const API_URL = process.env.REACT_APP_BACKEND_API_URL;
const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_KEY;
const AI_SUGGESTIONS_ENDPOINT = process.env.REACT_APP_AI_SUGGESTIONS_ENDPOINT
const AI_SEMANTICS_ENDPOINT = process.env.REACT_APP_AI_SEMANTICS_ENDPOINT

const LimitParagraphs = (setLineLimitReached) => Extension.create({
    addKeyboardShortcuts() {
        return {
            Enter: ({ editor }) => {
                const paragraphCount = editor.state.doc.content.content.filter(node => node.type.name === 'paragraph').length;
                paragraphCount >= 20 ? setLineLimitReached(true) : setLineLimitReached(false);
            },
        };
    },
});

const ideaSuggestions = [
    "Talk about your favorite scene!",
    "Did the ending surprise you?",
    "Describe the acting performances.",
    "Would you recommend it to others?",
    "How did the movie make you feel?",
    "What was the cinematography like?",
    "How did the soundtrack affect the mood?",
    "Was the pacing too fast or too slow?",
    "Which character did you connect with the most?",
    "Was there a message or theme you noticed?"
];

export default function ReviewPopup({ movieId, movieTitle, movieTagline, movieGenres, openModal, setOpenModal }) {
    const [randomIdea, setRandomIdea] = useState('');
    const [containsSpoilers, setContainsSpoilers] = useState(false);
    const token = CookieManager.decryptCookie('accessToken');
    const decodedToken = jwtDecode(token);
    const firstName = decodedToken.firstName;
    const filter = useMemo(() => new Filter(), []);
    const [lineLimitReached, setLineLimitReached] = useState(false)
    const [reviewRating, setReviewRating] = useState(0);
    const [recaptchaResult, setRecaptchaResult] = useState(false);
    const lastWordCheckpointRef = useRef(0);
    const [suggestionsList, setSuggestionsList] = useState([]);
    const [semanticsList, setSemanticsList] = useState([]);

    const handleRemoveSuggestion = (indexToRemove) => {
        setSuggestionsList(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleGetIdea = () => {
        const randomIndex = Math.floor(Math.random() * ideaSuggestions.length);
        setRandomIdea(ideaSuggestions[randomIndex]);
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            LimitParagraphs(setLineLimitReached),
            Color,
            Blockquote,
            HorizontalRule,
            CodeBlock,
            Placeholder.configure({
                placeholder: 'Share your thoughts about this movie...',
            }),
            CharacterCount.configure(),
            TextAlign.configure({
                types: ['paragraph', 'heading', 'listItem'],
            }),
        ],
        onUpdate: ({ editor }) => {
            const plainText = editor.getText().trim();
            const words = plainText.match(/\b\w+\b/g) || [];
            const currentWordCount = words.length;

            const paragraphCount = editor.state.doc.content.content.filter(
                node => node.type.name === 'paragraph'
            ).length;
            setLineLimitReached(paragraphCount >= 20);

            if (
                currentWordCount >= 15 &&
                currentWordCount % 15 === 0 &&
                currentWordCount !== lastWordCheckpointRef.current
            ) {
                fetchSuggestions(plainText);
                lastWordCheckpointRef.current = currentWordCount;
            }
        },
        content: '',
        autofocus: 'end',
    });

    const reviewContent = editor?.getHTML() || "";
    const plainText = reviewContent.replace(/<[^>]+>/g, '').trim();
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const hasReviewProfanity = useMemo(() => filter.isProfane(plainText), [filter, plainText]);
    const isRecaptchaVisible = plainText.length > 0 && reviewRating !== 0 && !hasReviewProfanity;

    const isSubmitDisabled = useMemo(() =>
        plainText.length === 0 ||
        reviewRating === 0 ||
        wordCount < 15 ||
        !recaptchaResult,
        [plainText, reviewRating, recaptchaResult, wordCount]
    );

    async function onChangeCaptcha(token) {
        try {
            const res = await sendData(`${API_URL}${RECAPTCHA_ENDPOINT}`, {
                recaptchaValue: token
            });
            setRecaptchaResult(res.ok);
        } catch (e) {
            console.error(e);
        }
    }

    const handleSubmit = useCallback(async () => {
        if (!hasReviewProfanity && editor) {
            const currentDate = new Date();
            const formattedDate = format(currentDate, 'MM-dd-yyyy HH:mm');

            await sendData(`${API_URL}${CREATE_REVIEW_ENDPOINT}${movieId}`, {
                createdDate: formattedDate,
                movieId,
                movieTitle,
                movieGenres,
                author: firstName,
                rating: reviewRating,
                spoiler: containsSpoilers,
                content: reviewContent,
            })
                .then(() => {
                    setReviewRating(0);
                    editor.commands.clearContent();
                    setOpenModal(false);
                })
                .catch((error) => {
                    if (error.response?.status === 400 && error.response?.data === "User already submitted a review for this movie.") {
                        console.log(error)
                    }
                });
        }
    }, [movieId, reviewRating, reviewContent, hasReviewProfanity, editor, firstName, movieTitle, movieGenres, containsSpoilers, setOpenModal]);

    useEffect(() => {
        if (openModal && editor) {
            editor.commands.focus('end');
        }
    }, [openModal, editor]);

    const fetchSuggestions = async (reviewText) => {
        try {
            const suggestionResponse = await sendData(`${API_URL}${AI_SUGGESTIONS_ENDPOINT}`, { review: reviewText });
            const suggestionData = await suggestionResponse.json();

            const semanticsResponse = await sendData(`${API_URL}${AI_SEMANTICS_ENDPOINT}`, { review: reviewText });
            const semanticsData = await semanticsResponse.json();

            if (suggestionResponse.ok && Array.isArray(suggestionData)) {
                setSuggestionsList(suggestionData);
                setSemanticsList(semanticsData)
            } else {
                console.error("Suggestions are not an array:", suggestionData + semanticsData);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    return (
        <Modal open={openModal} onClose={() => setOpenModal(false)} closeAfterTransition>
            <Fade in={openModal}>
                <Box sx={modalStyles}>
                    {/* Header Section */}
                    <Box sx={headerContainerStyles}>
                        <IconButton
                            aria-label="close"
                            onClick={() => setOpenModal(false)}
                            sx={closeButtonStyles}
                        >
                            <CloseIcon />
                        </IconButton>

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Typography variant="h4" sx={titleStyles}>
                                ✍️ Write Your Review
                            </Typography>
                            <Typography variant="body2" sx={subtitleStyles}>
                                Share your thoughts on &ldquo;{movieTitle}&rdquo;
                            </Typography>
                        </motion.div>

                        {movieTagline && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                            >
                                <Box sx={taglineBoxStyles}>
                                    <FormatQuoteIcon sx={{ ...quoteIconStyles, transform: 'scaleX(-1)' }} />
                                    <Typography variant="body1" sx={{ fontStyle: 'italic', flex: 1, textAlign: 'center' }}>
                                        {movieTagline}
                                    </Typography>
                                    <FormatQuoteIcon sx={quoteIconStyles} />
                                </Box>
                            </motion.div>
                        )}
                    </Box>

                    {/* Rating Section */}
                    <Box sx={ratingContainerStyles}>
                        <Typography variant="h6" sx={sectionTitleStyles}>
                            ⭐ Your Rating
                        </Typography>
                        <InputSlider onSliderChange={setReviewRating} />
                    </Box>

                    {/* Toolbar */}
                    <Box sx={toolbarContainerStyles}>
                        <Box sx={toolbarStyles}>
                            <Tooltip title="Bold" arrow>
                                <IconButton onClick={() => editor.chain().focus().toggleBold().run()} sx={toolbarButtonStyles}>
                                    <FormatBoldIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Italic" arrow>
                                <IconButton onClick={() => editor.chain().focus().toggleItalic().run()} sx={toolbarButtonStyles}>
                                    <FormatItalicIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Bullet List" arrow>
                                <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()} sx={toolbarButtonStyles}>
                                    <FormatListBulletedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Blockquote" arrow>
                                <IconButton onClick={() => editor.chain().focus().toggleBlockquote().run()} sx={toolbarButtonStyles}>
                                    <FormatQuoteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Box sx={toolbarDividerStyles} />
                            <Tooltip title="Undo" arrow>
                                <IconButton onClick={() => editor.chain().focus().undo().run()} sx={toolbarButtonStyles}>
                                    <UndoIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Redo" arrow>
                                <IconButton onClick={() => editor.chain().focus().redo().run()} sx={toolbarButtonStyles}>
                                    <RedoIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Box sx={toolbarDividerStyles} />
                            <Tooltip title="Align Left" arrow>
                                <IconButton onClick={() => editor.chain().focus().setTextAlign('left').run()} sx={toolbarButtonStyles}>
                                    <AlignLeftIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Align Center" arrow>
                                <IconButton onClick={() => editor.chain().focus().setTextAlign('center').run()} sx={toolbarButtonStyles}>
                                    <AlignCenterIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Align Right" arrow>
                                <IconButton onClick={() => editor.chain().focus().setTextAlign('right').run()} sx={toolbarButtonStyles}>
                                    <AlignRightIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Justify" arrow>
                                <IconButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} sx={toolbarButtonStyles}>
                                    <AlignJustifyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Editor */}
                    <Box sx={editorWrapperStyles}>
                        <EditorContent editor={editor} />
                    </Box>

                    {/* Progress Bar */}
                    <Box sx={progressContainerStyles}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                                Word Count: {wordCount}/15 minimum
                            </Typography>
                            {wordCount >= 15 && (
                                <Chip
                                    label="✓ Ready to submit"
                                    size="small"
                                    sx={{
                                        background: 'linear-gradient(135deg, #00e676 0%, #00c853 100%)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '11px'
                                    }}
                                />
                            )}
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min((wordCount / 15) * 100, 100)}
                            sx={progressBarStyles}
                        />
                    </Box>

                    {/* Main Content Grid */}
                    <Box sx={mainGridStyles}>
                        {/* Left Column - Ideas & Semantics */}
                        <Box sx={leftColumnStyles}>
                            {/* Ideas Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Box sx={ideasBoxStyles}>
                                    <LightbulbIcon sx={{ color: '#ffd54f', fontSize: 28, mb: 1 }} />
                                    <Typography variant="subtitle2" sx={cardTitleStyles}>
                                        Need Inspiration?
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={handleGetIdea}
                                        sx={ideaButtonStyles}
                                        fullWidth
                                    >
                                        Get Writing Prompt
                                    </Button>
                                    <AnimatePresence mode="wait">
                                        {randomIdea && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Box sx={randomIdeaBoxStyles}>
                                                    <Typography variant="body2">
                                                        💡 {randomIdea}
                                                    </Typography>
                                                </Box>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Box>
                            </motion.div>

                            {/* Semantics Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Box sx={semanticsBoxStyles}>
                                    <AutoAwesomeIcon sx={{ color: '#64b5f6', fontSize: 24, mb: 1 }} />
                                    <Typography variant="subtitle2" sx={cardTitleStyles}>
                                        Sentiment Analysis
                                    </Typography>
                                    <Box sx={semanticsListStyles}>
                                        {semanticsList.length > 0 ? (
                                            <AnimatePresence>
                                                {semanticsList.map((semantic, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                    >
                                                        <Chip
                                                            label={semantic}
                                                            sx={semanticChipStyles}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        ) : (
                                            <Typography variant="caption" sx={emptyStateStyles}>
                                                Write at least 15 words to see sentiment analysis
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </motion.div>
                        </Box>

                        {/* Right Column - AI Suggestions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{ flex: 1 }}
                        >
                            <Box sx={suggestionBoxStyles}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <AutoAwesomeIcon sx={{ color: '#7c4dff', fontSize: 24 }} />
                                    <Typography variant="h6" sx={cardTitleStyles}>
                                        AI Suggestions
                                    </Typography>
                                </Box>
                                <Box sx={suggestionListStyles}>
                                    {suggestionsList.length > 0 ? (
                                        <AnimatePresence>
                                            {suggestionsList.map((suggestion, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                                >
                                                    <Box sx={suggestionItemStyles}>
                                                        <Typography variant="body2" sx={{ flex: 1, lineHeight: 1.6 }}>
                                                            {suggestion}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleRemoveSuggestion(idx)}
                                                            sx={removeButtonStyles}
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    ) : (
                                        <Box sx={emptyStateContainerStyles}>
                                            <AutoAwesomeIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                                            <Typography variant="body2" sx={emptyStateStyles}>
                                                AI-powered suggestions will appear here as you write
                                            </Typography>
                                            <Typography variant="caption" sx={{ ...emptyStateStyles, mt: 1 }}>
                                                Write at least 15 words to get started
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </motion.div>
                    </Box>

                    {/* Warnings */}
                    <AnimatePresence>
                        {hasReviewProfanity && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <Box sx={warningBoxStyles}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        ⚠️ Please remove profanity from your review
                                    </Typography>
                                </Box>
                            </motion.div>
                        )}
                        {lineLimitReached && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <Box sx={warningBoxStyles}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        ✋ Maximum number of lines reached
                                    </Typography>
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Spoiler Toggle */}
                    <Box sx={spoilerToggleStyles}>
                        <input
                            type="checkbox"
                            id="spoilerToggle"
                            checked={containsSpoilers}
                            onChange={() => setContainsSpoilers(!containsSpoilers)}
                            style={checkboxStyles}
                        />
                        <label htmlFor="spoilerToggle" style={{ fontSize: '15px', cursor: 'pointer', userSelect: 'none' }}>
                            ⚠️ This review contains spoilers
                        </label>
                    </Box>

                    {/* Recaptcha */}
                    {isRecaptchaVisible && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ marginTop: "20px", display: 'flex', justifyContent: 'center' }}
                        >
                            <ReCAPTCHA
                                sitekey={RECAPTCHA_KEY}
                                onChange={onChangeCaptcha}
                            />
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <Box sx={{ marginTop: "24px", textAlign: "center" }}>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled}
                            variant="contained"
                            size="large"
                            sx={submitButtonStyles(isSubmitDisabled)}
                        >
                            {isSubmitDisabled ? 'Complete All Fields' : 'Submit Review'}
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

ReviewPopup.propTypes = {
    openModal: PropTypes.bool,
    setOpenModal: PropTypes.func,
    movieId: PropTypes.number.isRequired,
    movieTitle: PropTypes.string.isRequired,
    movieTagline: PropTypes.string.isRequired,
    movieGenres: PropTypes.array
};

// Styles
const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '90%', md: '1100px' },
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'linear-gradient(135deg, rgba(15, 18, 24, 0.98) 0%, rgba(25, 30, 40, 0.98) 100%)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 100px rgba(124, 77, 255, 0.15)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    p: { xs: 3, sm: 4, md: 5 },
    outline: 'none',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(124, 77, 255, 0.5)',
        borderRadius: '4px',
        '&:hover': {
            background: 'rgba(124, 77, 255, 0.7)',
        },
    },
};

const headerContainerStyles = {
    position: 'relative',
    mb: 4,
};

const closeButtonStyles = {
    position: 'absolute',
    right: -8,
    top: -8,
    color: 'rgba(255,255,255,0.7)',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'rgba(255,77,79,0.2)',
        color: 'white',
        transform: 'rotate(90deg)',
        borderColor: 'rgba(255,77,79,0.5)',
    },
};

const titleStyles = {
    fontWeight: 800,
    textAlign: 'center',
    mb: 1,
    background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
};

const subtitleStyles = {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    mb: 3,
    fontWeight: 500,
};

const taglineBoxStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.15) 0%, rgba(100, 181, 246, 0.15) 100%)',
    padding: '16px 24px',
    borderRadius: '16px',
    border: '1px solid rgba(124, 77, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(124, 77, 255, 0.2)',
};

const quoteIconStyles = {
    fontSize: '32px',
    color: '#7c4dff',
    opacity: 0.8,
};

const ratingContainerStyles = {
    mb: 4,
    p: 3,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
};

const sectionTitleStyles = {
    fontWeight: 700,
    mb: 2,
    color: 'rgba(255,255,255,0.95)',
    fontSize: '16px',
};

const toolbarContainerStyles = {
    mb: 2,
};

const toolbarStyles = {
    display: 'flex',
    gap: '6px',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    justifyContent: 'center',
    flexWrap: 'wrap',
};

const toolbarButtonStyles = {
    minWidth: '36px',
    width: '36px',
    height: '36px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255,255,255,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: 'rgba(124, 77, 255, 0.25)',
        borderColor: 'rgba(124, 77, 255, 0.5)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(124, 77, 255, 0.3)',
    },
};

const toolbarDividerStyles = {
    width: '1px',
    height: '24px',
    background: 'rgba(255,255,255,0.1)',
    alignSelf: 'center',
};

const editorWrapperStyles = {
    minHeight: "200px",
    maxHeight: "300px",
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
    borderRadius: '16px',
    border: '2px solid rgba(124, 77, 255, 0.2)',
    marginBottom: '20px',
    overflowY: 'auto',
    color: 'white',
    fontSize: '16px',
    lineHeight: 1.8,
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: 'rgba(124, 77, 255, 0.4)',
        boxShadow: '0 8px 24px rgba(124, 77, 255, 0.15)',
    },
    '&:focus-within': {
        borderColor: 'rgba(124, 77, 255, 0.6)',
        boxShadow: '0 0 0 4px rgba(124, 77, 255, 0.1)',
    },
    '& .ProseMirror': {
        outline: 'none',
        minHeight: '160px',
    },
    '& .ProseMirror p.is-editor-empty:first-child::before': {
        color: 'rgba(255,255,255,0.3)',
        content: 'attr(data-placeholder)',
        float: 'left',
        height: 0,
        pointerEvents: 'none',
    },
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(124, 77, 255, 0.4)',
        borderRadius: '4px',
        '&:hover': {
            background: 'rgba(124, 77, 255, 0.6)',
        },
    },
};

const progressContainerStyles = {
    mb: 3,
};

const progressBarStyles = {
    height: 12,
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    '& .MuiLinearProgress-bar': {
        background: 'linear-gradient(90deg, #7c4dff 0%, #00e676 100%)',
        borderRadius: '8px',
        transition: 'transform 0.4s ease',
    },
};

const mainGridStyles = {
    display: 'flex',
    gap: 3,
    mb: 3,
    flexDirection: { xs: 'column', md: 'row' },
};

const leftColumnStyles = {
    flex: '0 0 320px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};

const ideasBoxStyles = {
    p: 3,
    background: 'linear-gradient(135deg, rgba(255, 213, 79, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)',
    border: '1px solid rgba(255, 213, 79, 0.2)',
    borderRadius: '16px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(255, 213, 79, 0.2)',
        borderColor: 'rgba(255, 213, 79, 0.4)',
    },
};

const cardTitleStyles = {
    fontWeight: 700,
    color: 'rgba(255,255,255,0.95)',
    mb: 1.5,
};

const ideaButtonStyles = {
    background: 'linear-gradient(135deg, #ffd54f 0%, #ffb300 100%)',
    color: '#000',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '10px',
    py: 1.2,
    boxShadow: '0 4px 16px rgba(255, 213, 79, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #ffeb3b 0%, #ffd54f 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(255, 213, 79, 0.4)',
    },
};

const randomIdeaBoxStyles = {
    mt: 2,
    p: 2,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 213, 79, 0.2)',
    color: 'rgba(255,255,255,0.9)',
};

const semanticsBoxStyles = {
    p: 3,
    background: 'linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)',
    border: '1px solid rgba(100, 181, 246, 0.2)',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 32px rgba(100, 181, 246, 0.2)',
        borderColor: 'rgba(100, 181, 246, 0.4)',
    },
};

const semanticsListStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
    justifyContent: 'center',
    minHeight: '60px',
    alignItems: 'center',
};

const semanticChipStyles = {
    background: 'linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(33, 150, 243, 0.2) 100%)',
    color: '#64b5f6',
    border: '1px solid rgba(100, 181, 246, 0.3)',
    fontWeight: 600,
    fontSize: '12px',
    '&:hover': {
        background: 'linear-gradient(135deg, rgba(100, 181, 246, 0.3) 0%, rgba(33, 150, 243, 0.3) 100%)',
        transform: 'scale(1.05)',
    },
};

const suggestionBoxStyles = {
    flex: 1,
    p: 3,
    background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
    border: '1px solid rgba(124, 77, 255, 0.2)',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 16px 40px rgba(124, 77, 255, 0.2)',
        borderColor: 'rgba(124, 77, 255, 0.4)',
    },
};

const suggestionListStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
};

const suggestionItemStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 2,
    background: 'rgba(255,255,255,0.05)',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(124, 77, 255, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateX(4px)',
        background: 'rgba(124, 77, 255, 0.15)',
        borderColor: 'rgba(124, 77, 255, 0.4)',
        boxShadow: '0 8px 20px rgba(124, 77, 255, 0.2)',
    },
};

const removeButtonStyles = {
    color: 'rgba(255,255,255,0.4)',
    transition: 'all 0.2s ease',
    '&:hover': {
        color: '#ff4444',
        background: 'rgba(255,68,68,0.1)',
        transform: 'scale(1.1)',
    },
};

const emptyStateContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    textAlign: 'center',
};

const emptyStateStyles = {
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 1.6,
};

const warningBoxStyles = {
    background: 'linear-gradient(135deg, rgba(255, 77, 79, 0.2) 0%, rgba(244, 67, 54, 0.2) 100%)',
    padding: '14px 20px',
    borderRadius: '12px',
    mb: 2,
    color: '#ff8a80',
    border: '1px solid rgba(255, 77, 79, 0.4)',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(255, 77, 79, 0.2)',
};

const spoilerToggleStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mt: 3,
    p: 2.5,
    background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.12) 0%, rgba(255, 87, 34, 0.12) 100%)',
    border: '1px solid rgba(255, 152, 0, 0.2)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.18) 0%, rgba(255, 87, 34, 0.18) 100%)',
        borderColor: 'rgba(255, 152, 0, 0.4)',
        boxShadow: '0 4px 16px rgba(255, 152, 0, 0.2)',
    },
};

const checkboxStyles = {
    width: '22px',
    height: '22px',
    accentColor: '#ff9800',
    cursor: 'pointer',
};

const submitButtonStyles = (isDisabled) => ({
    background: isDisabled
        ? 'linear-gradient(135deg, rgba(100,100,100,0.3) 0%, rgba(80,80,80,0.3) 100%)'
        : 'linear-gradient(135deg, #7c4dff 0%, #9c27b0 100%)',
    color: isDisabled ? 'rgba(255,255,255,0.4)' : '#fff',
    border: 'none',
    padding: '14px 40px',
    fontSize: '16px',
    fontWeight: 700,
    borderRadius: '12px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'none',
    boxShadow: isDisabled ? 'none' : '0 8px 24px rgba(124, 77, 255, 0.4)',
    minWidth: '200px',
    '&:hover': isDisabled ? {} : {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px rgba(124, 77, 255, 0.5)',
        background: 'linear-gradient(135deg, #9c27b0 0%, #7c4dff 100%)',
    },
    '&:active': isDisabled ? {} : {
        transform: 'translateY(0px)',
    },
});