import { templates } from './templates.js';

const KABBO_TEMPLATE_POLISH = `
  .template-wrapper { box-sizing: border-box; isolation: isolate; }
  .template-wrapper img { display: block; }
  .template-wrapper h1, .template-wrapper p { text-wrap: balance; }
  .template-wrapper .ad-container { overflow: hidden; }
  .template-wrapper .ad-container img { width: auto; height: auto; }
  .template-wrapper .logo-wrapper, .template-wrapper .logo-badge, .template-wrapper .logo-overlay,
  .template-wrapper .logo-area, .template-wrapper .mini-logo, .template-wrapper .logo-section,
  .template-wrapper .paperline-logo, .template-wrapper .broadcast-logo-wrapper, .template-wrapper .greenroom-logo-badge,
  .template-wrapper .publicdesk-logo-area, .template-wrapper .headline-logo, .template-wrapper .ticker-logo-overlay,
  .template-wrapper .pulse-logo, .template-wrapper .top-logo { z-index: 5; }

  .classic-theme .image-area:after, .modern-theme .top-half:after, .breaking-theme .image-container:after,
  .broadcast-theme .broadcast-image-area:after, .greenroom-theme .greenroom-image-container:after,
  .publicdesk-theme .publicdesk-image-frame:after, .paperline-theme .paperline-image-area:after,
  .ticker-theme .ticker-image-area:after, .pulse-theme .pulse-image-area:after,
  .splitframe-theme .split-image-area:after, .spectrum-theme .gradient-image:after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(180deg, rgba(0,0,0,.06), transparent 35%, rgba(0,0,0,.20)); z-index: 1;
  }
  .classic-theme .main-photo, .modern-theme .hero-image, .breaking-theme .news-image,
  .broadcast-theme .broadcast-main-image, .greenroom-theme .greenroom-main-image, .publicdesk-theme .publicdesk-main-image,
  .paperline-theme .paperline-main-image, .ticker-theme img, .pulse-theme img, .splitframe-theme img,
  .spectrum-theme img { filter: saturate(1.05) contrast(1.02); }

  .classic-theme .content-area { border-top: 1px solid color-mix(in srgb, var(--text) 12%, transparent); }
  .classic-theme .heading { letter-spacing: -.035em; text-wrap: balance; }
  .modern-theme .bottom-half { border-top: 10px solid var(--accent); }
  .modern-theme .headline, .breaking-theme .headline, .broadcast-theme .broadcast-headline,
  .greenroom-theme .greenroom-headline, .publicdesk-theme .publicdesk-headline, .paperline-theme .paperline-headline { letter-spacing: -.045em; text-wrap: balance; }
  .modern-theme .read-more-btn { box-shadow: 0 10px 22px color-mix(in srgb, var(--accent) 28%, transparent); }
  .breaking-theme .header-strip { letter-spacing: .04em; }
  .breaking-theme .ticker-tape { box-shadow: 0 -5px 18px rgba(0,0,0,.16); }
  .quote-theme .content-wrapper { padding: 90px 105px; }
  .quote-theme .quote-text { letter-spacing: -.035em; text-wrap: balance; }
  .minimal-theme .image-frame { border-width: 0; border-bottom: 10px solid var(--accent); }
  .minimal-theme .title { letter-spacing: -.04em; }
  .feature-theme .content-section { border-top: 1px solid color-mix(in srgb, var(--accent) 28%, transparent); }
  .feature-theme .headline { letter-spacing: -.04em; text-wrap: balance; }
  .paperline-theme .paperline-content-area, .broadcast-theme .broadcast-content-area, .greenroom-theme .greenroom-content { border-top: 10px solid var(--accent); border-bottom: 0; }
  .paperline-theme .paperline-subhead, .broadcast-theme .broadcast-subhead, .greenroom-theme .greenroom-subhead { max-width: 900px; }
  .greenroom-theme .greenroom-date-pill { box-shadow: 0 8px 16px color-mix(in srgb, var(--accent) 22%, transparent); }
  .publicdesk-theme { border-width: 14px; }
  .publicdesk-theme .publicdesk-live-badge { box-shadow: 0 8px 16px rgba(0,0,0,.22); }
  .headline-theme .headline-headline, .ticker-theme h1, .pulse-theme h1, .splitframe-theme h1,
  .spectrum-theme h1 { letter-spacing: -.045em; text-wrap: balance; }
  @media (prefers-reduced-motion: reduce) { .template-wrapper * { animation: none !important; transition: none !important; } }
`;

const defaultState = {
    templateId: 'classic',
    heading: 'শিরোনাম লিখুন',
    subheading: 'বিস্তারিত বর্ণনা যোগ করুন',
    headingSize: 48,
    subheadingSize: 28,
    date: '19 সেপ্টেম্বর 2026',
    domain: 'www.sobarkotha.com',
    facebook: 'yourpage',
    youtube: 'yourchannel',
    image: '', // Data URL
    imageScale: 1,
    imageX: 0,
    imageY: 0,
    imageObjectFit: 'cover',
    logo: '',  // Data URL
    font: 'VarendraAP',
    accentColor: '#c41e3a',
    bgColor: '#e8e8e8',
    textColor: '#000000',
};

let state = { ...defaultState };

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Force Choices.js to update styling
    if (fontChoices) {
        const container = document.querySelector('.choices');
        if (container) {
            // Remove and re-add the class to trigger a re-render
            container.classList.remove('choices--open');
        }
    }
}

function saveState() {
    try {
        localStorage.setItem('kabboStudioState', JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem('kabboStudioState');
        if (saved) {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
            if (!templates.some(template => template.id === state.templateId)) {
                state.templateId = defaultState.templateId;
            }
            const savedTemplate = templates.find(template => template.id === state.templateId);
            if (savedTemplate?.defaults) {
                if (!Object.prototype.hasOwnProperty.call(parsed, 'headingSize')) state.headingSize = savedTemplate.defaults.headingSize;
                if (!Object.prototype.hasOwnProperty.call(parsed, 'subheadingSize')) state.subheadingSize = savedTemplate.defaults.subheadingSize;
            }
        } else {
            // No saved state - merge template defaults into defaultState
            const template = templates.find(t => t.id === state.templateId);
            if (template && template.defaults) {
                state = { ...defaultState, ...template.defaults };
            }
        }
    } catch (e) {
        console.error('Failed to load state:', e);
    }
}

function resetState() {
    if (confirm('Are you sure you want to reset all settings?')) {
        localStorage.removeItem('kabboStudioState');
        window.location.reload();
    }
}
const SYSTEM_FIELDS = ['image', 'imageScale', 'imageX', 'imageY', 'imageObjectFit', 'logo', 'font', 'accentColor', 'bgColor', 'textColor', 'headingSize', 'subheadingSize'];

const elements = {
    templateSelect: document.getElementById('templateSelect'),
    templateDesc: document.getElementById('templateDesc'),
    dynamicContent: document.getElementById('dynamicContent'),
    image: document.getElementById('imageInput'),
    imageUrl: document.getElementById('imageUrlInput'),
    imageScale: document.getElementById('imageScaleInput'),
    imageX: document.getElementById('imageXInput'),
    imageY: document.getElementById('imageYInput'),
    imageObjectFit: document.getElementById('imageObjectFitInput'),
    headingSize: document.getElementById('headingSizeInput'),
    subheadingSize: document.getElementById('subheadingSizeInput'),
    headingSizeOutput: document.getElementById('headingSizeOutput'),
    subheadingSizeOutput: document.getElementById('subheadingSizeOutput'),
    logo: document.getElementById('logoInput'),
    logoUrl: document.getElementById('logoUrlInput'),
    font: document.getElementById('fontInput'),
    accentColor: document.getElementById('accentColorInput'),
    bgColor: document.getElementById('bgColorInput'),
    textColor: document.getElementById('textColorInput'),
    renderTarget: document.getElementById('renderTarget'),
    canvasWrapper: document.querySelector('.canvas-wrapper'),
    downloadBtn: document.getElementById('downloadBtn'),
    resetBtn: document.getElementById('resetBtn'),
    loadSystemFontsBtn: document.getElementById('loadSystemFontsBtn')
};

let fontChoices;

// Initialize
function init() {
    initTheme();
    loadState();

    // Initialize Choices.js for fonts
    fontChoices = new Choices(elements.font, {
        searchEnabled: true,
        itemSelectText: '',
        placeholder: true,
        placeholderValue: 'Search fonts...',
        shouldSort: false, // Keep our grouping order
    });

    // Load fonts
    loadFonts();

    // Check for Local Fonts API support
    if ('queryLocalFonts' in window) {
        elements.loadSystemFontsBtn.style.display = 'block';
        elements.loadSystemFontsBtn.addEventListener('click', loadSystemFonts);
    }

    // Populate Templates
    templates.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = t.name;
        elements.templateSelect.appendChild(option);
    });

    // Set initial values
    elements.templateSelect.value = state.templateId;
    // Font value will be set after fonts are loaded
    elements.accentColor.value = state.accentColor;
    elements.bgColor.value = state.bgColor;
    elements.textColor.value = state.textColor;
    if (state.image && !state.image.startsWith('data:')) elements.imageUrl.value = state.image;
    elements.imageScale.value = state.imageScale || 1;
    const scaleOutput = document.getElementById('scaleOutput');
    if (scaleOutput) scaleOutput.value = `${Math.round((state.imageScale || 1) * 100)}%`;
    elements.imageX.value = state.imageX || 0;
    elements.imageObjectFit.value = state.imageObjectFit || 'cover';
    elements.imageY.value = state.imageY || 0;
    elements.headingSize.value = state.headingSize || 48;
    elements.subheadingSize.value = state.subheadingSize || 28;
    elements.headingSizeOutput.value = `${state.headingSize || 48}px`;
    elements.subheadingSizeOutput.value = `${state.subheadingSize || 28}px`;
    if (elements.logoUrl && state.logo && !state.logo.startsWith('data:')) elements.logoUrl.value = state.logo;

    // Listeners
    elements.templateSelect.addEventListener('change', (e) => {
        state.templateId = e.target.value;
        
        // Update defaults if available
        const template = templates.find(t => t.id === state.templateId);
        if (template && template.defaults) {
            Object.entries(template.defaults).forEach(([key, value]) => {
                state[key] = value;
                // Update static inputs if they exist
                if (elements[key]) {
                    if (key === 'font') {
                        fontChoices.setChoiceByValue(value);
                    } else {
                        elements[key].value = value;
                    }
                }
            });
        }

        saveState();
        updateDynamicInputs();
        render();
    });

    elements.font.addEventListener('change', (e) => { 
        state.font = e.target.value; 
        loadGoogleFont(state.font);
        saveState(); 
        render(); 
    });
    elements.accentColor.addEventListener('input', (e) => { state.accentColor = e.target.value; saveState(); render(); });
    elements.bgColor.addEventListener('input', (e) => { state.bgColor = e.target.value; saveState(); render(); });
    elements.textColor.addEventListener('input', (e) => { state.textColor = e.target.value; saveState(); render(); });
    elements.imageScale.addEventListener('input', (e) => { state.imageScale = parseFloat(e.target.value); const output = document.getElementById('scaleOutput'); if (output) output.value = `${Math.round(state.imageScale * 100)}%`; saveState(); render(); });
    elements.imageObjectFit.addEventListener('change', (e) => { state.imageObjectFit = e.target.value; saveState(); render(); });
    elements.imageX.addEventListener('input', (e) => { state.imageX = parseInt(e.target.value); saveState(); render(); });
    elements.imageY.addEventListener('input', (e) => { state.imageY = parseInt(e.target.value); saveState(); render(); });
    elements.headingSize.addEventListener('input', (e) => { state.headingSize = parseInt(e.target.value); elements.headingSizeOutput.value = `${state.headingSize}px`; saveState(); render(); });
    elements.subheadingSize.addEventListener('input', (e) => { state.subheadingSize = parseInt(e.target.value); elements.subheadingSizeOutput.value = `${state.subheadingSize}px`; saveState(); render(); });
    
    elements.image.addEventListener('change', handleImageUpload.bind(null, 'image'));
    elements.imageUrl.addEventListener('input', (e) => { state.image = e.target.value; saveState(); render(); });
    if (elements.logo) elements.logo.addEventListener('change', handleImageUpload.bind(null, 'logo'));
    if (elements.logoUrl) elements.logoUrl.addEventListener('input', (e) => { state.logo = e.target.value; saveState(); render(); });

    elements.downloadBtn.addEventListener('click', downloadImage);
    elements.resetBtn.addEventListener('click', resetState);

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
            e.preventDefault();
            downloadImage();
        }
    });

    window.addEventListener('resize', fitPreview);

    // Mobile Toggle
    const toggleBtn = document.getElementById('toggleSettings');
    const closeBtn = document.getElementById('closeSettings');
    const themeToggleBtn = document.getElementById('themeToggle');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Add event listener for canvas text editing
    elements.renderTarget.addEventListener('input', (e) => {
        const target = e.target;
        // Check if the event originated from a contenteditable element
        if (target.getAttribute('contenteditable') === 'true') {
            const field = target.getAttribute('data-field');
            if (field) {
                // Update state
                state[field] = target.innerText;
                saveState();

                // Update corresponding sidebar input
                const sidebarInput = elements.dynamicContent.querySelector(`textarea[data-field="${field}"]`);
                if (sidebarInput) {
                    sidebarInput.value = state[field];
                }
            }
        }
    });

    updateDynamicInputs();
    render();
    // Delay fitPreview slightly to ensure DOM is ready
    setTimeout(fitPreview, 100);
}

async function loadFonts() {
    const localFonts = [
        { value: 'VarendraAP', label: 'VarendraAP (Local)', customProperties: { type: 'local' } }
    ];
    const popularFonts = [
        'Hind Siliguri', 'Noto Sans Bengali', 'Noto Serif Bengali', 'Baloo Da 2', 'Mina', 'Galada', 'Anek Bangla', // Bengali
        'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Oswald', // Sans
        'Merriweather', 'Playfair Display', 'Lora', 'Roboto Slab' // Serif
    ];

    const webSafeFonts = [
        // Windows
        'Segoe UI', 'Calibri', 'Cambria', 'Candara', 'Consolas', 'Constantia', 'Corbel', 
        'Franklin Gothic Medium', 'Gabriola', 'Palatino Linotype', 'Perpetua', 'Rockwell',
        'Franklin Gothic', 'Century Gothic',
        // macOS
        'Helvetica Neue', 'Avenir', 'Avenir Next', 'Optima', 'Gill Sans', 'Didot', 
        'American Typewriter', 'Baskerville', 'Geneva', 'Monaco',
        // Common / Web Safe
        'Arial', 'Helvetica', 'Verdana', 'Tahoma', 'Trebuchet MS', 
        'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 
        'Brush Script MT', 'Impact', 'Arial Black', 'Comic Sans MS'
    ].sort();

    try {
        const response = await fetch('https://api.fontsource.org/v1/fonts');
        const fonts = await response.json();
        
        const googleFonts = fonts.filter(f => f.type === 'google');
        
        const choices = [];

        choices.push({
            label: 'KABBO Local Fonts',
            id: 'kabbo-local',
            disabled: false,
            choices: localFonts.map(font => ({ ...font, selected: state.font === font.value }))
        });

        // Add Popular Group
        const popularGroup = {
            label: 'Popular / Bengali',
            id: 'popular',
            disabled: false,
            choices: []
        };

        popularFonts.forEach(fontName => {
            const font = googleFonts.find(f => f.family === fontName);
            if (font) {
                popularGroup.choices.push({
                    value: font.family,
                    label: font.family,
                    selected: state.font === font.family,
                    customProperties: { weights: font.weights }
                });
            }
        });
        choices.push(popularGroup);
        
        // Add System Fonts Group
        const systemGroup = {
            label: 'Standard System Fonts',
            id: 'system',
            disabled: false,
            choices: []
        };

        webSafeFonts.forEach(fontName => {
            systemGroup.choices.push({
                value: fontName,
                label: fontName,
                selected: state.font === fontName,
                customProperties: { type: 'system' }
            });
        });
        choices.push(systemGroup);

        // Add All Fonts Group
        const allGroup = {
            label: 'All Google Fonts',
            id: 'all',
            disabled: false,
            choices: []
        };

        googleFonts.forEach(font => {
            if (!popularFonts.includes(font.family)) {
                allGroup.choices.push({
                    value: font.family,
                    label: font.family,
                    selected: state.font === font.family,
                    customProperties: { weights: font.weights }
                });
            }
        });
        choices.push(allGroup);

        fontChoices.setChoices(choices, 'value', 'label', true);
        
        // Ensure initial font is loaded
        if (state.font) {
            loadGoogleFont(state.font);
        }

    } catch (e) {
        console.error('Failed to load fonts:', e);
        // Fallback to basic list if API fails
        const fallbackChoices = popularFonts.map(f => ({
            value: f,
            label: f,
            selected: state.font === f
        }));
        fontChoices.setChoices(fallbackChoices, 'value', 'label', true);
    }
}

async function loadSystemFonts() {
    const btn = elements.loadSystemFontsBtn;
    const originalText = btn.textContent;
    btn.textContent = 'Loading...';
    btn.disabled = true;

    try {
        const availableFonts = await window.queryLocalFonts();
        const uniqueFonts = [...new Set(availableFonts.map(f => f.family))].sort();
        
        const localGroup = {
            label: 'Installed Local Fonts',
            id: 'local',
            disabled: false,
            choices: uniqueFonts.map(family => ({
                value: family,
                label: family,
                selected: false,
                customProperties: { type: 'local' }
            }))
        };

        // Add to choices (prepend or append)
        // Note: setChoices with replace=false appends.
        fontChoices.setChoices([localGroup], 'value', 'label', false);
        
        btn.textContent = `Success! ${uniqueFonts.length} fonts loaded`;
        setTimeout(() => {
            btn.style.display = 'none';
        }, 2000);

    } catch (err) {
        console.error(err);
        btn.textContent = 'Failed to load fonts';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
    }
}

function loadGoogleFont(fontFamily) {
    if (!fontFamily) return;
    
    // Check if it's a system/local font (simple heuristic: if it's in our webSafe list or we don't want to fetch it)
    // But we don't easily know if a random string is a google font or local font here without checking the list.
    // However, fetching a non-existent google font usually just 404s harmlessly or we can check if it was in the google list.
    // For now, we'll just try to load it if it looks like a google font.
    
    // Optimization: Don't try to load web safe fonts from Google
    const webSafeFonts = [
        // Windows
        'Segoe UI', 'Calibri', 'Cambria', 'Candara', 'Consolas', 'Constantia', 'Corbel', 
        'Franklin Gothic Medium', 'Gabriola', 'Palatino Linotype', 'Perpetua', 'Rockwell',
        'Franklin Gothic', 'Century Gothic',
        // macOS
        'Helvetica Neue', 'Avenir', 'Avenir Next', 'Optima', 'Gill Sans', 'Didot', 
        'American Typewriter', 'Baskerville', 'Geneva', 'Monaco',
        // Common / Web Safe
        'Arial', 'Helvetica', 'Verdana', 'Tahoma', 'Trebuchet MS', 
        'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 
        'Brush Script MT', 'Impact', 'Arial Black', 'Comic Sans MS'
    ];
    if (webSafeFonts.includes(fontFamily)) return;

    const id = `font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(id)) return;

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    // Load regular and bold weights if possible, or just 400,700
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
}

function extractPlaceholders(html) {
    const regex = /{([a-zA-Z0-9_]+)}/g;
    const placeholders = new Set();
    let match;
    while ((match = regex.exec(html)) !== null) {
        placeholders.add(match[1]);
    }
    return Array.from(placeholders);
}

function updateDynamicInputs() {
    const template = templates.find(t => t.id === state.templateId);
    if (!template) return;

    const placeholders = extractPlaceholders(template.html);
    const contentFields = placeholders.filter(p => !SYSTEM_FIELDS.includes(p));

    elements.dynamicContent.innerHTML = '';

    contentFields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'control-group';

        const label = document.createElement('label');
        // Capitalize first letter
        const fieldLabels = { heading: 'শিরোনাম', subheading: 'সাবহেড / সারাংশ', date: 'তারিখ', domain: 'ওয়েবসাইট', facebook: 'ফেসবুক পেজ', youtube: 'ইউটিউব চ্যানেল', content: 'মূল লেখা' };
        label.textContent = fieldLabels[field] || field.charAt(0).toUpperCase() + field.slice(1);
        
        const textarea = document.createElement('textarea');
        textarea.dataset.field = field;
        textarea.rows = ['heading', 'content', 'subheading'].indexOf(field) !== -1 ? 3 : 1;
        textarea.value = state[field] || '';
        
        textarea.addEventListener('input', (e) => {
            state[field] = e.target.value;
            saveState();
            render();
        });

        group.appendChild(label);
        group.appendChild(textarea);
        elements.dynamicContent.appendChild(group);
    });
}

function handleImageUpload(key, event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        state[key] = e.target.result;
        saveState();
        render();
    };
    reader.readAsDataURL(file);
}

function render() {
    const template = templates.find(t => t.id === state.templateId);
    if (!template) return;

    elements.templateDesc.textContent = template.description;

    // Prepare CSS
    let styleTag = document.getElementById('template-styles');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'template-styles';
        document.head.appendChild(styleTag);
    }
    
    const logoSelectors = [
        '.logo-wrapper', '.logo-badge', '.logo-overlay', '.logo-area',
        '.mini-logo', '.logo-section', '.paperline-logo', '.broadcast-logo-wrapper',
        '.greenroom-logo-badge', '.publicdesk-logo-area', '.headline-logo',
        '.ticker-logo-overlay', '.pulse-logo', '.top-logo', '.editorial-logo', '.broadcast-logo'
    ];
    const hideLogoCss = `
        .template-wrapper:not(.has-logo) ${logoSelectors.join(',\n.template-wrapper:not(.has-logo) ')} {
            display: none !important;
        }
    `;
    styleTag.textContent = template.css + KABBO_TEMPLATE_POLISH + hideLogoCss;

    // Prepare HTML
    let html = template.html;
    
    const formatText = (text) => (text || '').replace(/\n/g, '<br>');

    // Replace placeholders
    const placeholders = extractPlaceholders(template.html);
    placeholders.forEach(key => {
        if (SYSTEM_FIELDS.includes(key)) return;
        
        const val = state[key] || '';
        const formatted = formatText(val);
        const regex = new RegExp(`{${key}}`, 'g');

        // Wrap in editable span
        const editableHtml = `<span contenteditable="true" data-field="${key}" style="outline: none; min-width: 10px; display: inline-block;">${formatted}</span>`;
        html = html.replace(regex, editableHtml);
    });

    html = html.replace(/{font}/g, state.font || 'sans-serif');
    html = html.replace(/{accentColor}/g, state.accentColor);
    html = html.replace(/{bgColor}/g, state.bgColor);
    html = html.replace(/{textColor}/g, state.textColor);
    html = html.replace(/{headingSize}/g, String(state.headingSize || 48));
    html = html.replace(/{subheadingSize}/g, String(state.subheadingSize || 28));
    
    // Placeholder images
    const placeholderImg = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZmlsbD0iI2YzZjRmNiI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0Ij5JTUFHRTwvdGV4dD48L3N2Zz4=';
    const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    
    // Inject the current image URL/file into the template.
    const imgVal = state.image || (template.html.includes('exact-upload-image') ? transparentPixel : placeholderImg);
    html = html.replace(/{image}/g, imgVal);
    
    // Logo Logic
    if (state.logo) {
        html = html.replace(/{logo}/g, state.logo);
        html = html.replace('template-wrapper', 'template-wrapper has-logo');
    } else {
        html = html.replace(/{logo}/g, transparentPixel);
    }
    
    elements.renderTarget.innerHTML = html;
    const renderedCanvas = elements.renderTarget.firstElementChild;
    const canvasWidth = Number(renderedCanvas?.dataset.canvasWidth) || 1080;
    const canvasHeight = Number(renderedCanvas?.dataset.canvasHeight) || 1080;
    elements.canvasWrapper.style.width = `${canvasWidth}px`;
    elements.canvasWrapper.style.height = `${canvasHeight}px`;
    const sizeLabel = `${canvasWidth} × ${canvasHeight} PX`;
    const previewSize = document.querySelector('.preview-topbar code');
    const zoomHint = document.querySelector('.zoom-hint');
    if (previewSize) previewSize.textContent = sizeLabel;
    if (zoomHint) zoomHint.textContent = `প্রিভিউ স্ক্রিনে ফিট করা হয়েছে · আউটপুট ${sizeLabel}`;

    // Apply Image Transforms
    const mainImg = elements.renderTarget.querySelector(
        '.basic-image, .sb1-image, .sb2-image, .main-photo, .editorial-image, .broadcast-image, .exact-upload-image'
    );
    if (mainImg) {
        mainImg.style.transform = `scale(${state.imageScale || 1}) translate(${state.imageX || 0}px, ${state.imageY || 0}px)`;
        mainImg.style.objectFit = state.imageObjectFit || 'cover';
    }
}

function fitPreview() {
    const wrapper = elements.canvasWrapper;
    const container = wrapper.parentElement;
    if (!container) return;
    
    const padding = 80; // Total padding
    const availableWidth = container.clientWidth - padding;
    const availableHeight = container.clientHeight - padding;
    
    const scale = Math.min(
        availableWidth / wrapper.clientWidth,
        availableHeight / wrapper.clientHeight
    );
    
    // Ensure scale is not negative or infinite
    const safeScale = (scale > 0 && scale < 5) ? scale : 0.5;
    
    wrapper.style.transform = `scale(${safeScale})`;
}

function downloadImage() {
    const originalElement = elements.renderTarget.firstElementChild;
    if (!originalElement) return;

    // Wait for fonts to be ready to ensure correct rendering
    document.fonts.ready.then(() => {
        // Create a container for the full-size render
        // We render off-screen to ensure we capture at full 1080x1080 resolution
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '0';
        const canvasWidth = Number(originalElement.dataset.canvasWidth) || 1080;
        const canvasHeight = Number(originalElement.dataset.canvasHeight) || 1080;
        container.style.width = `${canvasWidth}px`;
        container.style.height = `${canvasHeight}px`;
        container.style.zIndex = '-1';
        
        // Clone the element
        const clonedElement = originalElement.cloneNode(true);
        // Ensure the clone has the correct dimensions and no transform
        clonedElement.style.width = `${canvasWidth}px`;
        clonedElement.style.height = `${canvasHeight}px`;
        clonedElement.style.transform = 'none';

        container.appendChild(clonedElement);
        document.body.appendChild(container);

        // Helper to wait for images to load in the clone
        const waitForImages = () => {
            const images = Array.from(clonedElement.querySelectorAll('img'));
            const promises = images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            });
            return Promise.all(promises);
        };

        waitForImages().then(() => {
            // Fix object-fit: cover and contain by drawing to canvas
            // This is more robust than div replacement for html2canvas
            const images = Array.from(clonedElement.querySelectorAll('img'));
            images.forEach(img => {
                const style = window.getComputedStyle(img);
                const objectFit = style.objectFit;
                if ((objectFit === 'cover' || objectFit === 'contain') && img.naturalWidth > 0 && img.naturalHeight > 0) {
                    // Use offsetWidth/Height to get the element's layout size (untransformed)
                    const width = img.offsetWidth;
                    const height = img.offsetHeight;
                    
                    if (width === 0 || height === 0) return;

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    // Copy classes
                    canvas.className = img.className;

                    // Copy critical styles
                    canvas.style.width = `${width}px`;
                    canvas.style.height = `${height}px`;
                    canvas.style.display = style.display;
                    canvas.style.position = style.position;
                    canvas.style.top = style.top;
                    canvas.style.left = style.left;
                    canvas.style.right = style.right;
                    canvas.style.bottom = style.bottom;
                    canvas.style.margin = style.margin;
                    canvas.style.borderRadius = style.borderRadius;
                    canvas.style.zIndex = style.zIndex;
                    canvas.style.opacity = style.opacity;
                    canvas.style.transform = style.transform;
                    canvas.style.transformOrigin = style.transformOrigin;

                    const ctx = canvas.getContext('2d');

                    // Calculate dimensions (center aligned)
                    const imgAspect = img.naturalWidth / img.naturalHeight;
                    const canvasAspect = width / height;

                    let renderW, renderH, renderX, renderY;

                    if (objectFit === 'cover') {
                        if (imgAspect > canvasAspect) {
                            // Image is wider: match height, crop width
                            renderH = height;
                            renderW = height * imgAspect;
                            renderY = 0;
                            renderX = (width - renderW) / 2;
                        } else {
                            // Image is taller: match width, crop height
                            renderW = width;
                            renderH = width / imgAspect;
                            renderX = 0;
                            renderY = (height - renderH) / 2;
                        }
                    } else { // contain
                        if (imgAspect > canvasAspect) {
                            // Image is wider: match width, fit height
                            renderW = width;
                            renderH = width / imgAspect;
                            renderX = 0;
                            renderY = (height - renderH) / 2;
                        } else {
                            // Image is taller: match height, fit width
                            renderH = height;
                            renderW = height * imgAspect;
                            renderY = 0;
                            renderX = (width - renderW) / 2;
                        }
                    }

                    try {
                        ctx.drawImage(img, renderX, renderY, renderW, renderH);
                        img.parentNode.replaceChild(canvas, img);
                    } catch (e) {
                        console.warn('Canvas draw failed (likely CORS), keeping original image', e);
                    }
                }
            });

            // Small delay to ensure layout is finalized
            setTimeout(() => {
                html2canvas(clonedElement, {
                    scale: 1, // 1:1 scale of the 1080px element
                    useCORS: true,
                    backgroundColor: null,
                    logging: false,
                    width: canvasWidth,
                    height: canvasHeight
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `kabbo-${state.templateId}-${Date.now()}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();

                    // Cleanup
                    document.body.removeChild(container);
                }).catch(err => {
                    console.error('Export failed:', err);
                    if (document.body.contains(container)) {
                        document.body.removeChild(container);
                    }
                });
            }, 100);
        });
    });
}

init();
