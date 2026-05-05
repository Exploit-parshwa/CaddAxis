<?php include 'includes/header.php'; ?>

<main style="padding-top: var(--header-height);">

    <!-- PAGE HEADER -->
    <section class="section" style="padding-bottom: 2rem;">
        <h1 class="display-text" style="font-size: 5vw;">OUR <span class="highlight">COURSES</span></h1>
        <p style="max-width: 600px; margin-top: 1rem; color: #555;">
            Industry-oriented curriculum designed by experts. Choose your path and master the tools that build the world.
        </p>
    </section>

    <!-- FILTER BAR (Visual Only) -->
    <div style="padding: 0 4vw 4rem; display: flex; gap: 2rem; overflow-x: auto;">
        <button class="btn-main" style="padding: 0.8rem 2rem; margin-top: 0; background: var(--primary); border-color: var(--primary);">ALL</button>
        <button class="btn-main" style="padding: 0.8rem 2rem; margin-top: 0; background: white; color: black;">CIVIL</button>
        <button class="btn-main" style="padding: 0.8rem 2rem; margin-top: 0; background: white; color: black;">MECHANICAL</button>
        <button class="btn-main" style="padding: 0.8rem 2rem; margin-top: 0; background: white; color: black;">ARCHITECTURAL</button>
    </div>

    <!-- COURSE GRID (Using the Poster Style) -->
    <section class="poster-grid" style="padding: 0 4vw 8rem;">
        <?php
        $all_courses = [
            ['tag' => 'CIVIL', 'title' => 'AutoCAD Civil 3D', 'img' => 'assets/images/poster_civil.png'],
            ['tag' => 'MECHANICAL', 'title' => 'SolidWorks Pro', 'img' => 'assets/images/poster_mech.png'],
            ['tag' => 'ARCHITECTURAL', 'title' => 'Revit Architecture', 'img' => 'assets/images/hero_eng.png'],
            ['tag' => 'STRUCTURAL', 'title' => 'STAAD Pro V8i', 'img' => 'assets/images/poster_abstract.png'],
            ['tag' => 'MECHANICAL', 'title' => 'CATIA V5', 'img' => 'assets/images/poster_mech.png'],
            ['tag' => 'SIMULATION', 'title' => 'Ansys Workbench', 'img' => 'assets/images/poster_abstract.png'],
        ];

        foreach($all_courses as $c) {
            echo '
            <div class="poster-card" data-hover="true">
                <img src="'.$c['img'].'" alt="'.$c['title'].'">
                <div class="poster-content">
                    <span class="poster-tag">'.$c['tag'].'</span>
                    <h3 class="poster-title" style="font-size: 2rem;">'.$c['title'].'</h3>
                    <div style="display:flex; justify-content:space-between; margin-top:1rem; border-top:1px solid rgba(255,255,255,0.3); padding-top:1rem;">
                        <span>3 MONTHS</span>
                        <span>CERTIFIED</span>
                    </div>
                </div>
            </div>
            ';
        }
        ?>
    </section>

</main>

<?php include 'includes/footer.php'; ?>
