
import React from "react"
import IndMovieStyle from "../IndFilm/IndMovie.module.css"
export default function IntroSlide() {
    const themeColor = "#0096ff";

    return (
        <div className={IndMovieStyle.fullPageSlide}>
            <div
                className={IndMovieStyle.background}
                style={{
                    background: "linear-gradient(135deg, #1f1f1f, #0d0d0d)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100vh",
                }}
            />
            <div className={IndMovieStyle["content-wrapper"]}>
                <section className={IndMovieStyle["hero-content"]}>
                    <div className={IndMovieStyle.movie_hero_info_container} style={{ textAlign: "center" }}>
                        <h1 style={{ fontSize: "3rem", color: "#fff", marginBottom: "1rem", textAlign: "center" }}>
                            <span style={{ color: themeColor }}>Daily Movie Picks</span>
                        </h1>
                        <p style={{ fontSize: "1.2rem", color: "#ccc", marginBottom: "2rem" }}>
                            Curated using advanced algorithms that learn your taste. Sit back and enjoy personalized picks, every day.
                        </p>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "2rem",
                                flexWrap: "wrap",
                                color: "#fff",
                                marginTop: "1rem",
                            }}
                        >
                            {[
                                { icon: "psychology", text: "AI-Powered" },
                                { icon: "update", text: "Updated Daily" },
                                { icon: "favorite", text: "Tailored to You" },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        fontWeight: "500",
                                        color: themeColor,
                                        fontSize: "1rem",
                                    }}
                                >
                                    <span
                                        className="material-icons"
                                        style={{ fontSize: "2rem" }}
                                    >
                                        {item.icon}
                                    </span>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}