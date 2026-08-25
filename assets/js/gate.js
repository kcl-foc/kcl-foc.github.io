/*
 * Simple password gate.
 *
 * NOT SECURE. This is a speed bump, not protection. The page content is in the
 * HTML that has already been sent to the browser, so anyone who opens
 * view-source, DevTools, or runs `curl` can read it without entering anything.
 * Use it to keep casual visitors out of a work-in-progress site, nothing more.
 *
 * Configured under `gate:` in _data/site.yml. To change the password, generate
 * a new SHA-256 hash (see the README) and paste it into `gate.password_hash`.
 */
(function () {
    var cfg = window.GATE_CONFIG || {};
    if (!cfg.enabled) {
        document.documentElement.classList.remove('gated');
        return;
    }

    var STORAGE_KEY = 'fc-gate-unlocked';

    function reveal() {
        document.documentElement.classList.remove('gated');
        var overlay = document.getElementById('gate');
        if (overlay) overlay.remove();
    }

    // Already unlocked in this browser? Let them straight through.
    try {
        if (window.sessionStorage.getItem(STORAGE_KEY) === cfg.password_hash) {
            document.addEventListener('DOMContentLoaded', reveal);
            return;
        }
    } catch (e) {
        // sessionStorage can throw in private mode; fall through to the prompt.
    }

    async function sha256(text) {
        var bytes = new TextEncoder().encode(text);
        var digest = await window.crypto.subtle.digest('SHA-256', bytes);
        return Array.from(new Uint8Array(digest))
            .map(function (b) { return b.toString(16).padStart(2, '0'); })
            .join('');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('gate-form');
        var input = document.getElementById('gate-password');
        var error = document.getElementById('gate-error');
        if (!form || !input) { reveal(); return; }

        input.focus();

        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            error.textContent = '';

            var hash;
            try {
                hash = await sha256(input.value);
            } catch (e) {
                // crypto.subtle needs a secure context (https or localhost).
                error.textContent = cfg.unavailable_message;
                return;
            }

            if (hash === cfg.password_hash) {
                try {
                    window.sessionStorage.setItem(STORAGE_KEY, hash);
                } catch (e) {
                    // Not fatal: they just re-enter it on the next page.
                }
                reveal();
            } else {
                error.textContent = cfg.error_message;
                input.value = '';
                input.focus();
            }
        });
    });
})();
