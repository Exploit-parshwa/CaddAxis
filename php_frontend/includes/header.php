<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadd Axis Institute | Engineering CAD Training Specialists</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Oswald:wght@400;500;700&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- Styles -->
    <link rel="stylesheet" href="css/style.css">
    
    <!-- Smooth Scroll Support (optional, for Lando feel) -->
    <style>
        html { scroll-behavior: smooth; }
    </style>
</head>
<body>
    <!-- Custom Cursor -->
    <div class="cursor"></div>
    <div class="cursor-dot"></div>

    <nav class="navbar">
        <a href="index.php" class="logo" data-hover="true">
            <!-- Using uploaded logo if available, or text fallback -->
            <img src="assets/images/logo.png" alt="Cadd Axis" onerror="this.onerror=null; this.src=''; this.outerHTML='<h2 style=\'margin:0; color:var(--primary)\'>CADD<span style=\'color:black\'>AXIS</span></h2>'">
        </a>

        <!-- Desktop Menu -->
        <div class="menu-desktop">
            <a href="index.php" class="nav-link" data-hover="true">Home</a>
            <a href="courses.php" class="nav-link" data-hover="true">Courses</a>
            <a href="contact.php" class="nav-link" data-hover="true">Contact</a>
            <a href="login.php" class="nav-link" style="color: var(--primary);" data-hover="true">Student Portal</a>
        </div>

        <!-- Mobile Toggle -->
        <button class="mobile-toggle" id="mobile-toggle-btn" data-hover="true" style="background:none; border:none;">
            <i data-lucide="menu" style="width:30px; height:30px;"></i>
        </button>
    </nav>
    
    <!-- Mobile Menu Container -->
    <div class="mobile-menu" id="mobile-menu" style="display:none; position:fixed; top:90px; left:0; width:100%; background:white; padding:2rem; flex-direction:column; gap:1.5rem; z-index:90; border-bottom:1px solid #eee;">
        <a href="index.php" style="font-family:'Oswald'; font-size:1.5rem;">Home</a>
        <a href="courses.php" style="font-family:'Oswald'; font-size:1.5rem;">Courses</a>
        <a href="contact.php" style="font-family:'Oswald'; font-size:1.5rem;">Contact</a>
        <a href="login.php" style="font-family:'Oswald'; font-size:1.5rem; color:var(--primary);">Login</a>
    </div>
