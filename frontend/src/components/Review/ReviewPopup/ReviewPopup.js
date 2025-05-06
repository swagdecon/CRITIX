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
import { LinearProgress } from '@mui/material';
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
import axios from "axios";
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

export default function ReviewPopup({ movieId, movieTitle, movieTagline, openModal, setOpenModal }) {
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
                placeholder: 'Write your movie review here...',
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
        wordCount < 40 ||
        !recaptchaResult,
        [plainText, reviewRating, recaptchaResult]
    );

    async function onChangeCaptcha(token) {
        try {
            const res = await axios.post(`${API_URL}${RECAPTCHA_ENDPOINT}`, {
                recaptchaValue: token
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setRecaptchaResult(res.data.success);
        } catch (e) {
            console.error(e);
        }
    }

    const handleSubmit = useCallback(() => {
        if (!hasReviewProfanity && editor) {
            const currentDate = new Date();
            const formattedDate = format(currentDate, 'MM-dd-yyyy HH:mm');

            axios
                .post(`${API_URL}${CREATE_REVIEW_ENDPOINT}${movieId}`, {
                    createdDate: formattedDate,
                    movieId,
                    movieTitle,
                    author: firstName,
                    rating: reviewRating,
                    content: reviewContent,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
    }, [movieId, decodedToken, reviewRating, reviewContent, token, hasReviewProfanity, editor]);

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
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenModal(false)}
                        sx={{ position: 'absolute', right: 12, top: 12, color: "white" }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h5" mb={3} fontWeight="bold" textAlign="center">
                        Write Your Review
                    </Typography>
                    {movieTagline && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,150,255,0.1)',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                marginBottom: '50px',
                                color: 'white',
                            }}
                        >
                            <FormatQuoteIcon sx={{ fontSize: '28px', marginRight: '10px', color: '#00e676', transform: 'scaleX(-1)' }} />
                            <Typography variant="body1" fontStyle="italic" >
                                {movieTagline}
                            </Typography>
                            <FormatQuoteIcon sx={{ fontSize: '28px', marginRight: '10px', color: '#00e676' }} />
                        </Box>
                    )}
                    <InputSlider onSliderChange={setReviewRating} />
                    <br />
                    <div style={toolbarStyles}>
                        <IconButton onClick={() => editor.chain().focus().toggleBold().run()} sx={toolbarButtonStyles}>
                            <FormatBoldIcon />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().toggleItalic().run()} sx={toolbarButtonStyles}>
                            <FormatItalicIcon />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()} sx={toolbarButtonStyles}>
                            <FormatListBulletedIcon />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().toggleBlockquote().run()} sx={toolbarButtonStyles}>
                            <blockquote style={{ fontStyle: 'italic', margin: 0 }}>“”</blockquote>
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().setHorizontalRule().run()} sx={toolbarButtonStyles}>
                            ―
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().undo().run()} sx={toolbarButtonStyles}>
                            <UndoIcon />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().redo().run()} sx={toolbarButtonStyles}>
                            <RedoIcon />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().setTextAlign('left').run()} sx={toolbarButtonStyles}>
                            <AlignLeftIcon />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().setTextAlign('center').run()} sx={toolbarButtonStyles}>
                            <AlignCenterIcon />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().setTextAlign('right').run()} sx={toolbarButtonStyles}>
                            <AlignRightIcon />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} sx={toolbarButtonStyles}>
                            <AlignJustifyIcon />
                        </IconButton>
                        {[1, 2, 3].map((level) => (
                            <Button
                                key={level}
                                onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                                sx={{ ...toolbarButtonStyles, minWidth: '30px', fontSize: '14px' }}
                            >
                                H{level}
                            </Button>
                        ))}
                    </div>
                    <Box sx={editorWrapperStyles}>
                        <EditorContent editor={editor} />
                    </Box>
                    <Box sx={editorAndSuggestionsWrapperStyles}>
                        <Box sx={editorContainerStyles}>
                            <Box sx={semanticsBoxStyles}>
                                <Typography variant="h6" sx={{ textAlign: 'center' }} mb={2}>Semantics Analysis</Typography>
                                <Box sx={suggestionListStyles}>
                                    {suggestionsList.length > 0 ? (
                                        semanticsList.map((semantic, idx) => (
                                            <Box key={idx} sx={suggestionItemStyles}>
                                                {semantic}
                                            </Box>
                                        ))
                                    ) : (<Typography variant="body2" color="gray">
                                        Type at least 15 words to get review semantic analysis...
                                    </Typography>
                                    )}
                                </Box>
                            </Box>
                            <Box sx={ideasBoxStyles}>
                                <Button variant="outlined" onClick={handleGetIdea}>
                                    Need Ideas?
                                </Button>
                                {randomIdea && (
                                    <Typography variant="body2" mt={2}>
                                        💡 {randomIdea}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <Box sx={suggestionBoxStyles}>
                            <Typography variant="h6" sx={{ justifyContent: 'center', display: 'flex' }} mb={2}>Suggestions</Typography>
                            <Box sx={suggestionListStyles}>
                                {suggestionsList.length > 0 ? (
                                    <AnimatePresence >
                                        {suggestionsList.map((suggestion, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                            >
                                                <Box sx={{ ...suggestionItemStyles, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">{suggestion}</Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveSuggestion(idx)}
                                                        sx={{ marginLeft: '8px', color: 'gray' }}
                                                        aria-label="Remove suggestion"
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>

                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                ) : (
                                    <Typography variant="body2" color="gray">
                                        Type at least 15 words to get review suggestions...
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mt: 3,
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '10px 15px',
                            gap: '12px',
                            color: 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'rgba(0, 150, 255, 0.08)',
                                boxShadow: '0 0 10px rgba(0, 150, 255, 0.3)',
                            },
                        }}
                    >
                        <input
                            type="checkbox"
                            id="spoilerToggle"
                            checked={containsSpoilers}
                            onChange={() => setContainsSpoilers(!containsSpoilers)}
                            style={{
                                width: '20px',
                                height: '20px',
                                accentColor: '#00e676',
                                cursor: 'pointer',
                            }}
                        />
                        <label htmlFor="spoilerToggle" style={{ fontSize: '15px', cursor: 'pointer' }}>
                            This review contains spoilers
                        </label>
                    </Box>
                    <div style={centeredContentStyles}>
                        <Box sx={{ width: '80%', margin: '10px auto' }}>
                            <Typography variant="body2" color="white" mb={1}>
                                Write at least to 15 words
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min((wordCount / 15) * 100, 100)}
                                sx={{
                                    height: 10,
                                    borderRadius: '5px',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: wordCount >= 15 ? '#00e676' : '#0096ff',
                                    },
                                }}
                            />
                        </Box>
                        {hasReviewProfanity && (
                            <Box sx={profanityBoxStyles}>
                                <Typography color="white" variant="body2">
                                    Profanity detected! Please remove it.
                                </Typography>
                            </Box>
                        )}
                        {lineLimitReached && (
                            <Box sx={profanityBoxStyles}>
                                <Typography variant="body2" color="white" sx={{ fontWeight: 'bold' }}>
                                    ✋ Maximum number of lines reached!
                                </Typography>
                            </Box>
                        )}
                    </div>
                    {isRecaptchaVisible && (
                        <div style={{ marginTop: "20px", display: 'flex', justifyContent: 'center' }}>
                            <ReCAPTCHA
                                sitekey={RECAPTCHA_KEY}
                                onChange={onChangeCaptcha}
                            />
                        </div>
                    )}

                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        <Button
                            variant="contained"
                            disabled={isSubmitDisabled}
                            onClick={handleSubmit}
                            sx={{
                                bgcolor: isSubmitDisabled ? "#d3d3d3" : "#0096ff",
                                color: isSubmitDisabled ? "#a0a0a0" : "#fff",
                                border: '1px solid',
                                borderColor: isSubmitDisabled ? "#b0b0b0" : "#0096ff",
                                '&:hover': {
                                    bgcolor: isSubmitDisabled ? "#d3d3d3" : "#007acc",
                                    cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                                },
                                opacity: isSubmitDisabled ? 0.6 : 1,
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Submit Review
                        </Button>
                    </div>
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
};

const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '900px', md: '1000px' },
    bgcolor: 'rgba(30, 30, 30, 0.97)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    color: 'white',
    p: 4,
    outline: 'none',
};

const centeredContentStyles = {
    textAlign: 'center',
    marginTop: '20px',
};

const toolbarStyles = {
    display: 'flex',
    gap: '8px',
    marginBottom: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
};

const toolbarButtonStyles = {
    backgroundColor: 'rgba(0, 150, 255, 0.2)',
    color: 'white',
    "&:hover": {
        backgroundColor: 'rgba(0, 150, 255, 0.4)',
    },
};

const editorWrapperStyles = {
    minHeight: '200px',
    maxHeight: '300px',
    padding: '15px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: '15px',
    border: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '20px',
    overflowY: 'auto',
    overflowX: 'hidden',
    color: 'white',
    fontSize: '16px',
    transition: 'background 0.3s ease',
    zIndex: 1,
    '& [contenteditable="true"]:focus': {
        outline: 'none',
    },
    '& hr': {
        display: 'none',
    },
};
const ideasBoxStyles = {
    mt: 3,
    p: 2,
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    textAlign: 'center',
    color: 'white',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'rgba(255, 255, 255, 0.12)',
        boxShadow: '0px 0px 15px rgba(0, 150, 255, 0.2)',
    },
};
const profanityBoxStyles = {
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '10px',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    border: '2px solid #ff0000',
};
const editorAndSuggestionsWrapperStyles = {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
};

const editorContainerStyles = {
    flex: 2,
    minHeight: '400px',
    padding: '15px',
    background: 'linear-gradient(135deg, rgba(0,150,255,0.08), rgba(0,150,255,0.02))',
    borderRadius: '15px',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 4px 30px rgba(0,0,0,0.2)',
    overflowY: 'auto',
    color: 'white',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    transition: 'background 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, rgba(0,150,255,0.15), rgba(0,150,255,0.05))',
        boxShadow: '0 6px 40px rgba(0,0,0,0.3)',
    }
};
const suggestionBoxStyles = {
    background: 'linear-gradient(135deg, rgba(0,150,255,0.08), rgba(0,150,255,0.02))',
    width: '50%',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '15px',
    padding: '20px',
    marginTop: '20px',
    transition: 'all 0.3s ease',
    color: 'white',
    '&:hover': {
        background: 'linear-gradient(135deg, rgba(0,150,255,0.15), rgba(0,150,255,0.05))',
        boxShadow: '0px 0px 15px rgba(0,150,255,0.2)',
    },
};

const suggestionItemStyles = {
    background: 'linear-gradient(135deg, rgba(0,150,255,0.3), rgba(0,150,255,0.1))',
    padding: '8px 12px',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
        background: 'linear-gradient(135deg, rgba(0,150,255,0.5), rgba(0,150,255,0.2))',
    },
};

const semanticsBoxStyles = {
    ...suggestionBoxStyles,
    marginTop: '10px',

};
const suggestionListStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center'
};
