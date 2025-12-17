

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../security/Data';
const API_URL = process.env.REACT_APP_BACKEND_API_URL;
const AR_ENDPOINT = process.env.REACT_APP_AR_MOVIE_ENDPOINT;

const MovieSceneViewer = () => {
    const [embedCode, setEmbedCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { movieName } = useParams()

    useEffect(() => {
        async function fetchModel() {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchData(`${API_URL}${AR_ENDPOINT}/${movieName}`);
                if (response) {
                    setEmbedCode(response.embedUrl);
                } else {
                    setError('Failed to load model.');
                }

            } catch (err) {
                setError('Failed to load model.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (movieName) {
            fetchModel();
        }
    }, [movieName]);


    if (loading) return <div>Loading 3D model...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ height: '100vh', margin: 0, padding: 0 }}>
            <iframe
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                width="100%"
                height="100%"
                src={embedCode}
                allow="autoplay; fullscreen; vr"
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                style={{ border: 'none' }}
            ></iframe>
        </div>
    );

};


export default MovieSceneViewer;
