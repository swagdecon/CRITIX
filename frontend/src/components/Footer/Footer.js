import React from 'react';
import FooterStyle from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={FooterStyle["footer"]}>
            <div className={FooterStyle["footer-content"]}>
                <p className={FooterStyle["footer-text"]}>© 2025 POPFLIX</p>
                <div className={FooterStyle["social-links"]}>
                    <a href="#" className={FooterStyle["social-icon"]}>
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className={FooterStyle["social-icon"]}>
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className={FooterStyle["social-icon"]}>
                        <i className="fab fa-twitter"></i>
                    </a>
                </div>
                <div className={FooterStyle["footer-links"]}>
                    <a href="/privacy" className={FooterStyle["footer-link"]}>
                        <i className="fas fa-lock"></i> Privacy Policy
                    </a>
                    <a href="/terms" className={FooterStyle["footer-link"]}>
                        <i className="fas fa-file-alt"></i> Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    );
}
