<?php include 'includes/header.php'; ?>

<main style="display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh;">

    <!-- LEFT: INFO & FORM -->
    <div style="padding: calc(var(--header-height) + 4rem) 4vw 4rem; display: flex; flex-direction: column; justify-content: center;">
        <span style="color: var(--primary); font-weight: 600; letter-spacing: 2px;">GET IN TOUCH</span>
        <h1 class="display-text" style="font-size: 4vw; margin-bottom: 2rem;">LET'S START <br>A CONVERSATION</h1>
        
        <div style="margin-bottom: 4rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
                <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">VISIT US</h3>
                <p style="color: #666;">
                    Plot No. 45, Industrial Estate,<br>
                    Ichalkaranji, Maharashtra,<br>
                    India - 416115
                </p>
            </div>
            <div>
                <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">CONTACT</h3>
                <p style="color: #666;">
                    hello@caddaxis.com<br>
                    +91 95477 14747
                </p>
            </div>
        </div>

        <form style="display: flex; flex-direction: column; gap: 2rem;">
            <div style="border-bottom: 1px solid #ddd;">
                <input type="text" placeholder="YOUR NAME" style="width: 100%; padding: 1rem 0; border: none; font-family: 'Oswald'; font-size: 1.5rem; outline: none; background: transparent;">
            </div>
            <div style="border-bottom: 1px solid #ddd;">
                <input type="email" placeholder="YOUR EMAIL" style="width: 100%; padding: 1rem 0; border: none; font-family: 'Oswald'; font-size: 1.5rem; outline: none; background: transparent;">
            </div>
            
            <button class="btn-main" style="width: fit-content;" data-hover="true">SEND MESSAGE</button>
        </form>
    </div>

    <!-- RIGHT: IMAGE/MAP -->
    <div style="background: black; position: relative; height: 100%;">
        <img src="assets/images/contact_bg.png" alt="Office" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.6;">
        
        <div style="position: absolute; bottom: 4rem; left: 4rem; color: white;">
            <h2 style="font-size: 3rem;">OPENING HOURS</h2>
            <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
        </div>
    </div>

</main>

<style>
/* Tablet/Mobile Adjustments */
@media (max-width: 900px) {
    main { grid-template-columns: 1fr; }
    .display-text { font-size: 10vw !important; }
}
</style>

<?php include 'includes/footer.php'; ?>
