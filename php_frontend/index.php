<?php include 'includes/header.php'; ?>

<main>
    <!-- HERO SECTION -->
    <section class="hero">
        <div class="hero-content">
            <h1 class="display-text">
                <span class="text-outline">ENGINEERING</span>
                <span class="highlight">EXCELLENCE</span>
                <span>STARTS HERE</span>
            </h1>
            <p style="margin-top: 2rem; max-width: 480px; font-size: 1.1rem; line-height: 1.6; color: #444; opacity: 0; animation: fadeUp 1s 0.3s forwards;">
                Master industry-standard CAD, CAM, and CAE software with expert guidance. 
                <br><strong>ISO 9001:2015 Certified Institute.</strong>
            </p>
            <div style="opacity: 0; animation: fadeUp 1s 0.5s forwards;">
                <a href="courses.php" class="btn-main" data-hover="true">Explore Courses</a>
            </div>
        </div>
        
        <!-- Right Side Blob Image -->
        <div class="blob-container">
            <div class="blob-mask">
                <!-- Using Generated High-End Engineering Art -->
                <img src="assets/images/hero_eng.png" alt="Engineering Structure" data-hover="true">
            </div>
        </div>
    </section>

    <!-- LIVE STATS STRIP -->
    <div style="background: var(--black); color: white; overflow: hidden; white-space: nowrap; padding: 1.5rem 0; border-top: 5px solid var(--primary);">
        <div class="marquee" style="display: inline-block; animation: scroll 20s linear infinite;">
            <span style="font-family: 'Oswald'; font-size: 1.5rem; margin: 0 2rem;">/// 5200+ STUDENTS TRAINED</span>
            <span style="font-family: 'Oswald'; font-size: 1.5rem; margin: 0 2rem; color: var(--primary);">/// 98% PLACEMENT RATE</span>
            <span style="font-family: 'Oswald'; font-size: 1.5rem; margin: 0 2rem;">/// 15+ YEARS EXPERIENCE</span>
            <span style="font-family: 'Oswald'; font-size: 1.5rem; margin: 0 2rem;">/// ISO CERTIFIED</span>
            <span style="font-family: 'Oswald'; font-size: 1.5rem; margin: 0 2rem;">/// 5200+ STUDENTS TRAINED</span>
            <span style="font-family: 'Oswald'; font-size: 1.5rem; margin: 0 2rem; color: var(--primary);">/// 98% PLACEMENT RATE</span>
        </div>
    </div>

    <!-- COURSE POSTERS -->
    <section class="section">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem;">
            <h2 style="font-size: 3rem; margin: 0;">Featured <span class="highlight">Programs</span></h2>
            <a href="courses.php" style="border-bottom: 2px solid var(--black); padding-bottom: 5px; font-weight: 600;" data-hover="true">VIEW ALL PROGRAMS</a>
        </div>

        <div class="poster-grid">
            <!-- Mechanical Poster -->
            <div class="poster-card" data-hover="true">
                <img src="assets/images/poster_mech.png" alt="Mechanical CAD">
                <div class="poster-content">
                    <span class="poster-tag">Mechanical</span>
                    <h3 class="poster-title">SolidWorks Master</h3>
                    <p>Advanced product design & simulation techniques.</p>
                </div>
            </div>

            <!-- Civil Poster -->
            <div class="poster-card" data-hover="true">
                <img src="assets/images/poster_civil.png" alt="Civil CAD">
                <div class="poster-content">
                    <span class="poster-tag">Civil</span>
                    <h3 class="poster-title">Revit Architecture</h3>
                    <p>Building Information Modeling (BIM) from scratch.</p>
                </div>
            </div>

            <!-- Abstract/Advanced Poster -->
            <div class="poster-card" data-hover="true">
                <img src="assets/images/poster_abstract.png" alt="Advanced Design">
                <div class="poster-content">
                    <span class="poster-tag">Research</span>
                    <h3 class="poster-title">Ansys & Simulation</h3>
                    <p>Finite Element Analysis for complex engineering problems.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CONTACT CTA -->
    <section style="padding: 8rem 4vw; background: #f0f0f0; text-align: center;">
        <h2 style="font-size: 4rem; line-height: 1; margin-bottom: 2rem;">READY TO <span class="text-outline">START?</span></h2>
        <p style="margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto;">
            Join the elite community of designers and engineers. Your career transformation begins with a single click.
        </p>
        <a href="contact.php" class="btn-main" style="background: var(--primary); border-color: var(--primary);" data-hover="true">BOOK FREE DEMO</a>
    </section>

</main>

<style>
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
}
</style>

<?php include 'includes/footer.php'; ?>
