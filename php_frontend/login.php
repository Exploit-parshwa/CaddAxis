<?php include 'includes/header.php'; ?>

<main style="background: var(--surface-alt); min-height: 100vh;">
    <div style="display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 80px); padding: 2rem;">
        <div class="card" style="width: 500px; padding: 3rem;">

            <div style="text-align: center; margin-bottom: 2rem;">
                <h1 id="auth-title" style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary-dark);">
                    Student Portal
                </h1>
                <p id="auth-desc" style="color: var(--text-secondary);">
                    Sign in to access your dashboard
                </p>
            </div>

            <!-- Sign In Form -->
            <form id="signin-form" style="display: grid; gap: 1.5rem;">
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">
                        <i data-lucide="mail" style="display: inline; margin-right: 0.5rem; vertical-align:middle; width:16px;"></i>
                        Email Address
                    </label>
                    <input type="email" required placeholder="your.email@example.com" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">
                        <i data-lucide="lock" style="display: inline; margin-right: 0.5rem; vertical-align:middle; width:16px;"></i>
                        Password
                    </label>
                    <input type="password" required placeholder="Enter your password" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px;">
                    <div style="text-align: right; margin-top: 0.25rem;">
                        <button type="button" style="font-size: 0.8rem; color: var(--primary); background: none; border: none; cursor: pointer;">
                            Forgot Password?
                        </button>
                    </div>
                </div>
                <button class="btn btn-primary" style="width: 100%; padding: 0.875rem;">
                    Sign In
                </button>
                <div style="text-align: center; padding-top: 1rem; border-top: 1px solid var(--border);">
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        Don't have an account? <button type="button" onclick="toggleAuth('signup')" style="color: var(--primary); font-weight: 600; background: none; border: none; cursor: pointer;">Sign Up</button>
                    </p>
                </div>
            </form>

            <!-- Sign Up Form -->
            <form id="signup-form" style="display: none; gap: 1rem;">
                <div class="grid-2">
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">
                            <i data-lucide="user" style="display: inline; margin-right: 0.5rem; vertical-align:middle; width:16px;"></i> Full Name
                        </label>
                        <input type="text" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">
                            <i data-lucide="phone" style="display: inline; margin-right: 0.5rem; vertical-align:middle; width:16px;"></i> Phone
                        </label>
                        <input type="tel" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px;">
                    </div>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">
                        <i data-lucide="mail" style="display: inline; margin-right: 0.5rem; vertical-align:middle; width:16px;"></i> Email Address
                    </label>
                    <input type="email" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">
                        <i data-lucide="book-open" style="display: inline; margin-right: 0.5rem; vertical-align:middle; width:16px;"></i> Course
                    </label>
                    <select style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px;">
                        <option value="AutoCAD Civil 3D">AutoCAD Civil 3D</option>
                        <option value="Revit Architecture">Revit Architecture</option>
                        <option value="SolidWorks">SolidWorks</option>
                        <option value="CATIA V4/V5">CATIA V4/V5</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">
                        <i data-lucide="lock" style="display: inline; margin-right: 0.5rem; vertical-align:middle; width:16px;"></i> Password
                    </label>
                    <input type="password" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px;">
                </div>
                <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">
                        <i data-lucide="lock" style="display: inline; margin-right: 0.5rem; vertical-align:middle; width:16px;"></i> Confirm Password
                    </label>
                    <input type="password" required style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px;">
                </div>
                <button class="btn btn-primary" style="width: 100%; padding: 0.875rem;">
                    Create Account
                </button>
                <div style="text-align: center; padding-top: 1rem; border-top: 1px solid var(--border);">
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        Already have an account? <button type="button" onclick="toggleAuth('signin')" style="color: var(--primary); font-weight: 600; background: none; border: none; cursor: pointer;">Sign In</button>
                    </p>
                </div>
            </form>

        </div>
    </div>
</main>

<script>
function toggleAuth(view) {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const title = document.getElementById('auth-title');
    const desc = document.getElementById('auth-desc');

    if (view === 'signup') {
        signinForm.style.display = 'none';
        signupForm.style.display = 'grid';
        title.innerText = 'Create Account';
        desc.innerText = 'Sign up to access your courses';
    } else {
        signinForm.style.display = 'grid';
        signupForm.style.display = 'none';
        title.innerText = 'Student Portal';
        desc.innerText = 'Sign in to access your dashboard';
    }
}
</script>

<?php include 'includes/footer.php'; ?>
