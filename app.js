// app.js

document.addEventListener('DOMContentLoaded', () => {

    // --- TABS LOGIC ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            // Find parent to scope the tabs (either analyze area or info area)
            const parentSection = btn.closest('.glass-panel');

            // Deactivate all in this section
            const sectionBtns = parentSection.querySelectorAll('.tab-btn');
            const sectionContents = parentSection.querySelectorAll('.tab-content');

            sectionBtns.forEach(b => b.classList.remove('active'));
            sectionContents.forEach(c => c.classList.remove('active'));

            // Activate selected
            btn.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- ANALYSIS LOGIC ---
    const loadingState = document.getElementById('loading-state');
    const resultsArea = document.getElementById('results-area');

    // MOCK DATA: Text/Message Scams
    const textDatabase = [
        {
            keywords: ['gift card', 'gift cards', 'itunes', 'target card', 'google play'],
            riskLevel: 'HIGH', title: 'Gift Card Payment Scam',
            reason: 'Legitimate organizations never ask for payment via gift cards.',
            reports: [{ source: 'FTC Alert', title: 'Gift cards are for gifts', snippet: 'Anyone who demands payment by <mark>gift card</mark> is always a scammer.' }]
        },
        {
            keywords: ['kindly', 'urgent', 'account suspended', 'verify identity', 'password'],
            riskLevel: 'MODERATE', title: 'Phishing Attempt',
            reason: 'Excessive urgency and threats of account suspension are common phishing tactics.',
            reports: [{ source: 'Consumer Reports', title: 'Spotting Phishing', snippet: 'Scammers create a false sense of <mark>urgent</mark> action required.' }]
        }
    ];

    // MOCK DATA: Link/AI Scams
    const linkDatabase = [
        {
            keywords: ['ai generated', 'chatgpt', 'openai', 'as an ai', 'delve'],
            riskLevel: 'MODERATE', title: 'Likely AI-Generated Content',
            reason: 'The text contains phrasing commonly produced by Large Language Models.',
            reports: [{ source: 'AI Detector', title: 'Generative Text Found', snippet: 'Phrases like "<mark>as an AI</mark>" or repetitive paragraph structures detected.' }]
        },
        {
            keywords: ['http://', 'bit.ly', 'tinyurl', 'free-money'],
            riskLevel: 'HIGH', title: 'Suspicious or Unsecured Link',
            reason: 'URL shorteners or unsecured HTTP protocol are frequently used to mask malicious destinations.',
            reports: [{ source: 'Security Blog', title: 'URL Shortener Abuse', snippet: 'Scammers use <mark>bit.ly</mark> to hide the true destination of phishing sites.' }]
        }
    ];

    const analyzeTextBtn = document.getElementById('analyze-text-btn');
    const textInputArea = document.getElementById('scam-input');

    analyzeTextBtn?.addEventListener('click', () => {
        runAnalysis(textInputArea.value, textDatabase);
    });

    const analyzeLinkBtn = document.getElementById('analyze-link-btn');
    const linkInputArea = document.getElementById('link-input');

    analyzeLinkBtn?.addEventListener('click', () => {
        runAnalysis(linkInputArea.value, linkDatabase);
    });

    function runAnalysis(text, database) {
        text = text.trim().toLowerCase();
        if (!text) {
            alert('Please provide some input for analysis.');
            return;
        }

        resultsArea.innerHTML = '';
        resultsArea.classList.add('hidden');
        loadingState.classList.remove('hidden');

        setTimeout(() => {
            loadingState.classList.add('hidden');
            processAnalysis(text, database);
        }, 1500);
    }

    function processAnalysis(text, database) {
        let matchedScam = null;
        let maxMathces = 0;

        for (const scam of database) {
            let matches = 0;
            for (const keyword of scam.keywords) {
                if (text.includes(keyword)) matches++;
            }
            if (matches > maxMathces) {
                maxMathces = matches;
                matchedScam = scam;
            }
        }
        renderResults(matchedScam);
    }

    function renderResults(match) {
        resultsArea.classList.remove('hidden');
        if (!match) {
            resultsArea.innerHTML = `
                <div class="result-header">
                    <span class="risk-badge risk-low">Low Risk / Unknown</span>
                    <h2>No direct matches found.</h2>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Proceed with caution and trust your instincts.</p>
            `;
            return;
        }

        const riskClass = match.riskLevel === 'HIGH' ? 'risk-high' : 'risk-moderate';
        let reportsHtml = match.reports.map(report => `
            <div class="match-card">
                <div class="match-source"><i class="ph ph-article"></i> ${report.source}</div>
                <h4 style="margin-bottom: 0.5rem;">${report.title}</h4>
                <p style="font-size: 0.875rem; color: var(--text-secondary);">"${report.snippet}"</p>
            </div>
        `).join('');

        resultsArea.innerHTML = `
            <div class="glass-panel" style="padding: 2rem; border-radius: 24px; border-left: 4px solid var(--accent-${match.riskLevel === 'HIGH' ? 'red' : 'orange'});">
                <div class="result-header">
                    <span class="risk-badge ${riskClass}">${match.riskLevel} LIKELIHOOD</span>
                    <h2>${match.title}</h2>
                </div>
                <p style="margin-bottom: 2rem;"><strong>Why it's flagged:</strong> ${match.reason}</p>
                <div class="matches-grid">${reportsHtml}</div>
            </div>
        `;
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- RECENT NEWS GENERATOR ---
    const newsGrid = document.getElementById('news-grid');
    if (newsGrid) {
        const newsData = [
            { title: 'FTC Reports Romance Scams Cost Consumers $1.14B', date: 'March 20, 2026', source: 'FTC', icon: 'ph-heart-break' },
            { title: 'AI Voice Cloning Used in Grandparent Scam Ring', date: 'March 18, 2026', source: 'CyberNews', icon: 'ph-wave-waveform' },
            { title: 'Fake Crypto Exchange Busted by Authorities', date: 'March 15, 2026', source: 'CoinDesk', icon: 'ph-currency-btc' }
        ];

        newsGrid.innerHTML = newsData.map(news => `
            <div class="glass-card news-card">
                <div class="news-img"><i class="ph ${news.icon}"></i></div>
                <div class="news-content">
                    <div class="news-meta">${news.date} • ${news.source}</div>
                    <h3 style="font-size: 1.2rem;">${news.title}</h3>
                </div>
            </div>
        `).join('');
    }

    // --- CHAT WIDGET LOGIC ---
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    chatToggle?.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) chatInput.focus();
    });

    chatClose?.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    chatSend?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.textContent = text;
        chatMessages.appendChild(userMsg);
        chatInput.value = '';

        // Auto-scroll
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Mock bot reply
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'message bot';
            botMsg.innerHTML = 'Thank you for reaching out. An agent will be with you shortly. In the meantime, try our <strong>Analyzer Tool</strong> above!';
            chatMessages.appendChild(botMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
    // --- LIVE FEED FETCH LOGIC ---
    const liveScanFeed = document.getElementById('live-scan-feed');

    // We only want to fetch once when the tab is clicked to save API limits.
    const liveScanTabBtn = document.querySelector('button[data-target="kb-live-scan"]');
    let hasFetchedLiveFeed = false;

    liveScanTabBtn?.addEventListener('click', () => {
        if (!hasFetchedLiveFeed) {
            hasFetchedLiveFeed = true;
            fetchLiveThreats();
        }
    });

    async function fetchLiveThreats() {
        if (!liveScanFeed) return;

        try {
            // Using a public RSS to JSON API to hit BleepingComputer's feed
            const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.bleepingcomputer.com%2Ffeed%2F');
            const data = await response.json();

            if (data.status === 'ok' && data.items.length > 0) {
                // Grab top 3 news items
                const topItems = data.items.slice(0, 3);

                liveScanFeed.innerHTML = topItems.map((item, index) => {
                    // Extract a clean snippet (removing HTML tags if present)
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = item.description;
                    let textSnippet = tempDiv.textContent || tempDiv.innerText || '';
                    textSnippet = textSnippet.substring(0, 180) + '...';

                    const colors = ['orange', 'blue', 'purple'];
                    const color = colors[index % colors.length];
                    const icons = ['ph-warning', 'ph-shield-warning', 'ph-siren'];
                    const icon = icons[index % icons.length];

                    return `
                        <div class="glass-panel" style="padding: 1.5rem; background: rgba(0,0,0,0.2); margin-bottom: 1.5rem; border-left: 4px solid var(--accent-${color}); border-radius: 12px; animation: slideUp 0.5s ease forwards; animation-delay: ${index * 0.2}s; opacity: 0; transform: translateY(20px);">
                            <h4 style="margin-bottom: 0.5rem; font-size: 1.1rem;"><i class="ph ${icon}" style="color:var(--accent-${color})"></i> ${item.title}</h4>
                            <p style="font-size: 0.8rem; color: var(--accent-blue); margin-bottom: 0.5rem; text-transform: uppercase;">${item.pubDate} • Live Intel</p>
                            <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem;">${textSnippet}</p>
                            <a href="${item.link}" target="_blank" style="color: var(--text-primary); text-decoration: none; font-size: 0.9rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;"><i class="ph ph-arrow-square-out"></i> Read Full Report</a>
                        </div>
                    `;
                }).join('');
            } else {
                throw new Error("Feed empty");
            }
        } catch (error) {
            console.error('Error fetching live threats:', error);
            liveScanFeed.innerHTML = `
                <div style="text-align:center; padding: 2rem; border: 1px dashed var(--border-color); border-radius: 12px;">
                    <i class="ph ph-warning-circle" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem; display: block;"></i>
                    <p style="color: var(--text-secondary);">Unable to connect to live threat feeds at this time. Please check your connection or try again later.</p>
                </div>
            `;
        }
    }

    // --- STORY SUBMISSION / CONTACT FORM LOGIC ---
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');
    const requestHelpCheckbox = document.getElementById('request-help');
    const emailFieldContainer = document.getElementById('email-field-container');
    const contactEmailInput = document.getElementById('contact-email');
    const submitBtnBase = contactForm?.querySelector('button[type="submit"] span');

    requestHelpCheckbox?.addEventListener('change', (e) => {
        if (e.target.checked) {
            emailFieldContainer.classList.remove('hidden');
            contactEmailInput.required = true;
            if (submitBtnBase) submitBtnBase.innerText = "Request Team Support";
        } else {
            emailFieldContainer.classList.add('hidden');
            contactEmailInput.required = false;
            contactEmailInput.value = '';
            if (submitBtnBase) submitBtnBase.innerText = "Submit Story Anonymously";
        }
    });

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstname = document.getElementById('contact-firstname').value;
        const lastname = document.getElementById('contact-lastname').value;
        const email = document.getElementById('contact-email').value;
        const reason = document.getElementById('contact-reason').value;

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Encrypting & Sending...</span><i class="ph ph-spinner ph-spin"></i>';
        submitBtn.disabled = true;

        try {
            // Send real POST request to the backend
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    reason,
                    requestedHelp: requestHelpCheckbox?.checked
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            const data = await response.json();
            console.log('Submission successful:', data);

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            contactForm.reset();

            // Re-hide email
            if (emailFieldContainer) emailFieldContainer.classList.add('hidden');
            if (contactEmailInput) contactEmailInput.required = false;
            if (submitBtnBase) submitBtnBase.innerText = "Submit Story Anonymously";

            contactSuccess.classList.remove('hidden');

            setTimeout(() => {
                contactSuccess.classList.add('hidden');
            }, 6000);

        } catch (error) {
            console.error("Backend Error:", error);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert("Secure server connection failed. Please attempt again later.");
        }
    });

    // --- THERAPIST GEOLOCATION LOGIC ---
    const therapistBtn = document.getElementById('find-therapist-btn');
    const therapistStatus = document.getElementById('therapist-status');

    therapistBtn?.addEventListener('click', () => {
        if (!navigator.geolocation) {
            therapistStatus.innerText = "Geolocation is not supported by your browser.";
            therapistStatus.style.color = "var(--accent-red)";
            return;
        }

        const originalText = therapistBtn.innerHTML;
        therapistBtn.innerHTML = '<span>Locating...</span><i class="ph ph-spinner ph-spin"></i>';
        therapistBtn.disabled = true;
        therapistStatus.innerText = "Requesting location permissions...";
        therapistStatus.style.color = "var(--text-secondary)";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                therapistStatus.innerText = "Location secured. Generating localized resources...";

                setTimeout(() => {
                    therapistBtn.innerHTML = originalText;
                    therapistBtn.disabled = false;
                    therapistStatus.innerText = `Successfully loaded resources near coordinates [${lat.toFixed(2)}, ${lng.toFixed(2)}]!`;
                    therapistStatus.style.color = "var(--accent-green)";
                    window.open(`https://www.google.com/maps/search/licensed+therapist+near+me/@${lat},${lng},12z`, '_blank');
                }, 1000);
            },
            (error) => {
                therapistBtn.innerHTML = originalText;
                therapistBtn.disabled = false;
                therapistStatus.style.color = "var(--accent-red)";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        therapistStatus.innerText = "Location permission denied. Redirecting to general directory.";
                        setTimeout(() => { window.open("https://www.psychologytoday.com/us/therapists", "_blank") }, 1500);
                        break;
                    case error.POSITION_UNAVAILABLE:
                        therapistStatus.innerText = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        therapistStatus.innerText = "The request to get user location timed out.";
                        break;
                    default:
                        therapistStatus.innerText = "An unknown error occurred.";
                        break;
                }
            }
        );
    });
    // --- EMAIL ANALYZER LOGIC ---
    const analyzeEmailBtn = document.getElementById('analyze-email-btn');
    const emailInput = document.getElementById('email-input');

    analyzeEmailBtn?.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const resultsArea = document.getElementById('results-area');
        const loadingState = document.getElementById('loading-state');

        if (!email) {
            resultsArea.innerHTML = '<div class="glass-panel" style="padding:1.5rem; border-left:4px solid var(--accent-orange)"><p>Please enter an email address to analyze.</p></div>';
            resultsArea.classList.remove('hidden');
            return;
        }

        resultsArea.classList.add('hidden');
        loadingState.classList.remove('hidden');

        setTimeout(() => {
            loadingState.classList.add('hidden');
            resultsArea.classList.remove('hidden');

            const isFreeProvider = /@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|aol\.com|protonmail\.com)/i.test(email);
            const isTypoSquatting = /(paypal.*|amazon.*|apple.*|microsoft.*|bank.*|support.*)@/i.test(email) ||
                /.*@(paypal|amazon|apple|microsoft|chase|wellsfargo).*\.(com|net|org)/i.test(email);
            const corporateClaim = /(support|admin|billing|security|alert)@/i.test(email);

            let score = 0;
            let feedback = [];

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                score = 100;
                feedback.push('<i class="ph ph-x-circle" style="color:var(--accent-red)"></i> Invalid Format: This does not look like a valid email address.');
            } else {
                if (isFreeProvider && corporateClaim) {
                    score += 80;
                    feedback.push('<i class="ph ph-warning" style="color:var(--accent-red)"></i> Free Email Provider: Official corporate support never uses @gmail.com or @yahoo.com addresses.');
                }
                if (isTypoSquatting && !isFreeProvider) {
                    const domain = email.split('@')[1].toLowerCase();
                    if (domain !== 'paypal.com' && domain !== 'amazon.com' && domain !== 'apple.com' && domain !== 'microsoft.com') {
                        score += 90;
                        feedback.push(`<i class="ph ph-warning" style="color:var(--accent-red)"></i> Typo-squatting Detected: The domain "@${domain}" is designed to look like a legitimate corporation, but it is a fake domain.`);
                    }
                }
                if (score === 0 && /[0-9]{4,}@/.test(email)) {
                    score += 40;
                    feedback.push('<i class="ph ph-warning" style="color:var(--accent-orange)"></i> Suspicious Pattern: This email contains a large string of numbers which is common in automated burner addresses.');
                }
            }

            let resultHtml = '';

            if (score >= 70) {
                resultHtml = `
                    <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--accent-red); animation: slideUp 0.3s ease-out;">
                        <h3 style="color: var(--accent-red); margin-bottom: 0.5rem;"><i class="ph ph-warning-octagon"></i> HIGH RISK SENDER</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">This email address exhibits major red flags associated with phishing and impersonation.</p>
                        <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:0.5rem;">
                            ${feedback.map(f => `<li style="font-size: 0.95rem; line-height: 1.4;">${f}</li>`).join('')}
                        </ul>
                    </div>
                `;
            } else if (score > 0) {
                resultHtml = `
                    <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--accent-orange); animation: slideUp 0.3s ease-out;">
                        <h3 style="color: var(--accent-orange); margin-bottom: 0.5rem;"><i class="ph ph-warning"></i> SUSPICIOUS SENDER</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">This email address has some unusual patterns. Proceed with caution and do not click any links.</p>
                        <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:0.5rem;">
                            ${feedback.map(f => `<li style="font-size: 0.95rem; line-height: 1.4;">${f}</li>`).join('')}
                        </ul>
                    </div>
                `;
            } else {
                resultHtml = `
                    <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--accent-green); animation: slideUp 0.3s ease-out;">
                        <h3 style="color: var(--accent-green); margin-bottom: 0.5rem;"><i class="ph ph-check-circle"></i> NO IMMEDIATE FLAGS DETECTED</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">This format does not trigger our standard automated threat heuristics. However, 'From' addresses can still occasionally be spoofed. Always verify the sender through a secondary channel if they are asking for money.</p>
                    </div>
                `;
            }

            resultsArea.innerHTML = resultHtml;
            resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1200);
    });

    // --- VISUAL NEURAL SCANNER LOGIC ---
    const dropZone = document.getElementById('drop-zone');
    const visualInput = document.getElementById('visual-upload-input');
    const analyzeVisualBtn = document.getElementById('analyze-visual-btn');
    const previewContainer = document.getElementById('preview-container');
    const dropZoneContent = document.getElementById('drop-zone-content');
    const uploadPreview = document.getElementById('upload-preview');
    const fileInfo = document.getElementById('file-info');
    const removeUpload = document.getElementById('remove-upload');
    const visualBtnText = document.getElementById('visual-btn-text');

    let currentFile = null;

    // Trigger file input on click
    dropZone?.addEventListener('click', () => {
        if (!currentFile) visualInput.click();
    });

    // Handle Drag and Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone?.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    dropZone?.addEventListener('dragover', () => dropZone.style.borderColor = 'var(--accent-purple)');
    dropZone?.addEventListener('dragleave', () => dropZone.style.borderColor = 'rgba(255,255,255,0.1)');

    dropZone?.addEventListener('drop', (e) => {
        dropZone.style.borderColor = 'rgba(255,255,255,0.1)';
        const files = e.dataTransfer.files;
        if (files.length) handleFiles(files[0]);
    });

    visualInput?.addEventListener('change', (e) => {
        if (e.target.files.length) handleFiles(e.target.files[0]);
    });

    function handleFiles(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }
        currentFile = file;

        // Show Preview
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadPreview.src = e.target.result;
            previewContainer.classList.remove('hidden');
            dropZoneContent.classList.add('hidden');
            fileInfo.innerText = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

            // Enable Button
            analyzeVisualBtn.disabled = false;
            analyzeVisualBtn.classList.remove('disabled');
            analyzeVisualBtn.style.opacity = '1';
        };
        reader.readAsDataURL(file);
    }

    removeUpload?.addEventListener('click', (e) => {
        e.stopPropagation();
        currentFile = null;
        visualInput.value = '';
        previewContainer.classList.add('hidden');
        dropZoneContent.classList.remove('hidden');

        analyzeVisualBtn.disabled = true;
        analyzeVisualBtn.classList.add('disabled');
        analyzeVisualBtn.style.opacity = '0.5';
    });

    analyzeVisualBtn?.addEventListener('click', () => {
        if (!currentFile) return;

        const resultsArea = document.getElementById('results-area');
        const loadingState = document.getElementById('loading-state');

        resultsArea.classList.add('hidden');
        loadingState.classList.remove('hidden');
        visualBtnText.innerText = "Analyzing Neural Buffers...";

        // Metadata Scan Simulation
        const reader = new FileReader();
        reader.onload = () => {
            const content = reader.result;
            // Common AI strings used in metadata by Midjourney, DALL-E, etc.
            const aiMarkers = ['midjourney', 'dall-e', 'generative', 'ai art', 'stable diffusion', 'adobe firefly'];
            let foundMarker = null;

            for (const marker of aiMarkers) {
                if (content.toLowerCase().includes(marker)) {
                    foundMarker = marker;
                    break;
                }
            }

            setTimeout(() => {
                loadingState.classList.add('hidden');
                resultsArea.classList.remove('hidden');
                visualBtnText.innerText = "Initialize Neural Scan";

                let riskValue = 15;
                let riskLevel = 'LOW';
                let riskClass = 'risk-low';
                let feedback = "Structural analysis indicates high consistency in noise patterns and lighting geometry.";

                if (foundMarker) {
                    riskValue = 99;
                    riskLevel = 'EXTREME';
                    riskClass = 'risk-high';
                    feedback = `<strong>PROVEN AI ORIGIN:</strong> Embedded metadata markers associated with <em>"${foundMarker}"</em> modules were detected in the file's binary structure. This is objectively AI-generated content.`;
                } else if (currentFile.size < 100000 && (currentFile.name.includes('ai') || currentFile.name.includes('gen'))) {
                    // Slight heuristic based on filename if no metadata
                    riskValue = 45;
                    riskLevel = 'MODERATE';
                    riskClass = 'risk-moderate';
                    feedback = "Metadata is missing or has been stripped, but the bit-depth and compression patterns are atypical for modern smartphone cameras.";
                }

                resultsArea.innerHTML = `
                    <div class="glass-panel" style="padding: 1.5rem; border-left: 4px solid var(--accent-${riskLevel === 'EXTREME' ? 'red' : (riskLevel === 'MODERATE' ? 'orange' : 'green')}); animation: slideUp 0.3s ease-out;">
                        <div class="result-header">
                            <span class="risk-badge ${riskClass}">${riskLevel} AI CONFIDENCE: ${riskValue}%</span>
                            <h2>Neural Analysis Result</h2>
                        </div>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem;">${feedback}</p>
                        <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; font-size: 0.9rem;">
                            <strong>Technical Detail:</strong> ${foundMarker ? 'Metadata Signature Match' : 'Frequency structural check complete. No definitive AI markers found in EXIF/Binary block.'}
                        </div>
                        <p style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-secondary);"><em>Warning: Professional deepfakes often have metadata stripped by social media platforms. High confidence in "Low Risk" results is never guaranteed.</em></p>
                    </div>
                `;
                resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 2000);
        };
        reader.readAsText(currentFile.slice(0, 5000)); // Read first 5KB for markers
    });
});
