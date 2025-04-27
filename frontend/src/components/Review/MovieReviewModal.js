import React, { useState } from "react";
import { Modal, Box, Typography, Button, IconButton, Fade } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import InputSlider from "../Slider/Slider"; // Your custom slider
import ReCAPTCHA from "react-google-recaptcha";

const MovieReviewModal = ({ open, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [recaptchaVerified, setRecaptchaVerified] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write your movie review here...',
            }),
            CharacterCount.configure(),
        ],
        content: '',
        autofocus: 'end',
        editorProps: {
            attributes: {
                class: 'editor-content',
            },
        },
    });

    const handleSubmit = () => {
        if (editor && recaptchaVerified && rating > 0) {
            const reviewContent = editor.getHTML();
            onSubmit({ rating, content: reviewContent });
            editor.commands.clearContent();
            setRating(0);
            setRecaptchaVerified(false);
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                onClose();
            }, 1000);
        }
    };

    useEffect(() => {
        if (open && editor) {
            editor.commands.focus('end');
        }
    }, [open, editor]);

    const wordCount = editor?.storage.characterCount.words() || 0;

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition>
            <Fade in={open}>
                <Box sx={modalStyles}>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 12, top: 12, color: "white" }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h5" mb={2} fontWeight="bold">
                        Write Your Review
                    </Typography>

                    <InputSlider onSliderChange={setRating} />

                    {/* Tiptap Toolbar */}
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
                        <IconButton onClick={() => editor.chain().focus().undo().run()} sx={toolbarButtonStyles}>
                            <UndoIcon />
                        </IconButton>
                        <IconButton onClick={() => editor.chain().focus().redo().run()} sx={toolbarButtonStyles}>
                            <RedoIcon />
                        </IconButton>
                    </div>

                    {/* Tiptap Editor */}
                    <Box sx={editorWrapperStyles}>
                        <EditorContent editor={editor} />
                    </Box>

                    <Typography variant="body2" mt={1} color="lightgray">
                        Word Count: {wordCount}
                    </Typography>

                    <Box mt={2}>
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                            onChange={() => setRecaptchaVerified(true)}
                        />
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            ...submitButtonStyles,
                            backgroundColor: submitted ? 'limegreen' : '#0096ff',
                        }}
                        disabled={!editor || !recaptchaVerified || rating === 0 || wordCount < 40}
                        onClick={handleSubmit}
                    >
                        {submitted ? "Posted!" : "Post Review"}
                    </Button>
                </Box>
            </Fade>
        </Modal>
    );
};
const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '600px' },
    bgcolor: 'rgba(30, 30, 30, 0.6)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 30px rgba(0, 150, 255, 0.5)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    borderRadius: '20px',
    border: '2px solid rgba(255, 255, 255, 0.18)',
    p: 4,
    color: "white",
    outline: "none",
};

const toolbarStyles = {
    display: 'flex',
    gap: '8px',
    marginBottom: '10px',
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
    minHeight: '150px',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    marginBottom: '10px',
    overflowY: 'auto',
};

export default MovieReviewModal;
