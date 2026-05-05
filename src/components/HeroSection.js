'use client';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="hero">
            <div className="container">

                {/* HERO CONTENT LEFT */}
                <div className="hero-content">
                    <h1 className="display-text">
                        <span className="text-outline">ENGINEERING</span>
                        <span className="highlight">EXCELLENCE</span>
                        <span>STARTS HERE</span>
                    </h1>
                    <p className="sub-text">
                        Master industry-standard CAD, CAM, and CAE software with expert guidance.
                        <br /><strong>ISO 9001:2015 Certified Institute.</strong>
                    </p>
                    <Link href="/courses" className="btn-main">
                        Explore Courses
                    </Link>
                </div>

                {/* BLOB IMAGE RIGHT - Exact Replica of PHP CSS Mask */}
                <div className="blob-container">
                    <div className="blob-mask">
                        <img
                            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
                            alt="Engineering Structure"
                        />
                    </div>
                </div>

            </div>

            <style jsx>{`
                .hero {
                    min-height: 90vh; /* Matches PHP min-height: 100vh approx */
                    display: flex;
                    align-items: center;
                    position: relative;
                    padding: 120px 4vw 0; /* ADDED TOP PADDING FOR NAVBAR */
                    overflow: hidden;
                    background: #ffffff; /* White BG */
                    color: #050505;
                }

                .container {
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                /* LEFT TEXT */
                .hero-content {
                    width: 50%;
                    z-index: 2;
                }

                .display-text {
                    font-family: 'Oswald', sans-serif;
                    font-size: clamp(3.5rem, 7vw, 7rem);
                    line-height: 0.9;
                    font-weight: 700;
                    margin-bottom: 2rem;
                    text-transform: uppercase;
                }

                .display-text span {
                    display: block;
                }

                .text-outline {
                    color: transparent;
                    -webkit-text-stroke: 1.5px #050505;
                    transition: all 0.5s ease;
                }
                .text-outline:hover {
                    color: #E91E63;
                    -webkit-text-stroke: 0px;
                }

                .highlight {
                    color: #E91E63; /* Primary Pink */
                }

                .sub-text {
                    margin-top: 2rem;
                    max-width: 480px;
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: #444;
                    font-family: 'Inter', sans-serif; /* Fallback sans */
                }

                /* BUTTON */
                .btn-main {
                    background: #050505;
                    color: #ffffff;
                    padding: 1.2rem 3rem;
                    font-family: 'Oswald', sans-serif;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 1px;
                    border: 1px solid #050505;
                    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
                    display: inline-block;
                    margin-top: 2rem;
                    text-decoration: none;
                    cursor: pointer;
                }
                .btn-main:hover {
                    background: transparent;
                    color: #050505;
                    transform: translateX(10px);
                }

                /* RIGHT BLOB CONTAINER */
                .blob-container {
                    position: absolute;
                    top: 50%;
                    right: -10%;
                    transform: translateY(-50%);
                    width: 60vw;
                    height: 80vh;
                    z-index: 1;
                    pointer-events: none;
                }

                .blob-mask {
                    width: 100%;
                    height: 100%;
                    /* The SVG Mask from reference */
                    mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.6,32.3C59,43.1,47.1,51.8,35.3,58.8C23.5,65.8,11.8,71.1,-0.8,72.5C-13.4,73.9,-26.8,71.4,-37.8,63.9C-48.8,56.4,-57.4,43.9,-65.2,30.3C-73,16.7,-80,2,-79.1,-12.3C-78.2,-26.6,-69.4,-40.5,-57.8,-50.7C-46.2,-60.9,-31.8,-67.4,-17.7,-70.6C-3.6,-73.8,10.2,-73.7,25.8,-73.7' transform='translate(100 100)' /%3E%3C/svg%3E");
                    mask-repeat: no-repeat;
                    mask-size: contain;
                    mask-position: center;
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.6,32.3C59,43.1,47.1,51.8,35.3,58.8C23.5,65.8,11.8,71.1,-0.8,72.5C-13.4,73.9,-26.8,71.4,-37.8,63.9C-48.8,56.4,-57.4,43.9,-65.2,30.3C-73,16.7,-80,2,-79.1,-12.3C-78.2,-26.6,-69.4,-40.5,-57.8,-50.7C-46.2,-60.9,-31.8,-67.4,-17.7,-70.6C-3.6,-73.8,10.2,-73.7,25.8,-73.7' transform='translate(100 100)' /%3E%3C/svg%3E");
                    -webkit-mask-repeat: no-repeat;
                    -webkit-mask-size: contain;
                    -webkit-mask-position: center;
                    
                    background-color: #ddd; /* Fallback */
                    transition: transform 0.5s ease;
                }

                .blob-mask img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transform: scale(1.05); /* Slight zoom for fit */
                    transition: transform 1s ease;
                }
                
                .hero:hover .blob-mask img {
                    transform: scale(1.1);
                }

                /* RESPONSIVE */
                @media (max-width: 1024px) {
                    .container {
                        flex-direction: column;
                        justify-content: center;
                    }
                    .hero-content {
                        width: 100%;
                        text-align: center;
                        margin-top: 4rem;
                        z-index: 10;
                    }
                    .sub-text { margin: 2rem auto; }
                    
                    .blob-container {
                        position: absolute;
                        top: 20%;
                        right: -10%;
                        width: 90vw;
                        height: 50vh;
                        opacity: 0.2; /* Faded on mobile like PHP */
                    }
                }
            `}</style>
        </section>
    );
}
