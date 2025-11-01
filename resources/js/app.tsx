import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'DriveAssist';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // ✅ FIX: Update CSRF token from Inertia page props
        // This ensures the CSRF token in the meta tag and axios headers
        // stays in sync with the token from the server on every page load
        if (props.initialPage.props.csrf_token) {
            const meta = document.querySelector('meta[name="csrf-token"]');
            if (meta) {
                meta.setAttribute('content', props.initialPage.props.csrf_token as string);
            }

            // Update axios default header (if axios is being used)
            if (window.axios?.defaults?.headers?.common) {
                window.axios.defaults.headers.common['X-CSRF-TOKEN'] = props.initialPage.props.csrf_token as string;
            }

            console.log('✅ CSRF token synchronized with server');
        }

        root.render(<App {...props} />);
    },
    progress: {
        color: '#3b82f6',
        showSpinner: true,
    },
});