document.addEventListener('DOMContentLoaded', function() {
    // State variables
    const state = {
        query: '',
        audioUrl: '',
        isLoading: false,
        error: '',
        recentSearches: [],
        currentSound: '',
        colorTheme: 'blue',
        inputSize: 'md'
    };

    // API Key
    const API_KEY = "qRfAuMtH2CLG23y8ThoVzieU1VCfjaEmtsylcFXa";

    // DOM Elements
    const soundInput = document.getElementById('soundInput');
    const clearButton = document.getElementById('clearButton');
    const searchButton = document.getElementById('searchButton');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const retryButton = document.getElementById('retryButton');
    const recentSearchesContainer = document.getElementById('recentSearches');
    const searchesList = document.getElementById('searchesList');
    const audioPlayer = document.getElementById('audioPlayer');
    const currentSoundElement = document.getElementById('currentSound');
    const audioElement = document.getElementById('audioElement');
    const replayButton = document.getElementById('replayButton');
    const themeToggle = document.getElementById('themeToggle');
    const sizeToggle = document.getElementById('sizeToggle');

    // Initialize
    document.body.classList.add('theme-blue');
    soundInput.focus();

    // Event Listeners
    soundInput.addEventListener('input', handleInputChange);
    clearButton.addEventListener('click', clearInput);
    searchButton.addEventListener('click', fetchSound);
    soundInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') fetchSound();
    });
    retryButton.addEventListener('click', handleRetry);
    replayButton.addEventListener('click', handleRetry);
    themeToggle.addEventListener('click', rotateColorTheme);
    sizeToggle.addEventListener('click', cycleInputSize);

    // Functions
    function handleInputChange() {
        state.query = soundInput.value;
        clearButton.style.display = state.query ? 'flex' : 'none';
    }

    function clearInput() {
        soundInput.value = '';
        state.query = '';
        clearButton.style.display = 'none';
        soundInput.focus();
    }

    function setLoading(isLoading) {
        state.isLoading = isLoading;
        
        if (isLoading) {
            searchButton.classList.add('loading');
            searchButton.disabled = true;
        } else {
            searchButton.classList.remove('loading');
            searchButton.disabled = false;
        }
    }

    function showError(message) {
        state.error = message;
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
    }

    function hideError() {
        state.error = '';
        errorMessage.style.display = 'none';
    }

    function updateRecentSearches() {
        if (state.recentSearches.length === 0) {
            recentSearchesContainer.style.display = 'none';
            return;
        }

        recentSearchesContainer.style.display = 'block';
        searchesList.innerHTML = '';
        
        state.recentSearches.forEach(term => {
            const tag = document.createElement('button');
            tag.className = 'search-tag';
            tag.textContent = term;
            tag.addEventListener('click', () => {
                soundInput.value = term;
                state.query = term;
                clearButton.style.display = 'flex';
                setTimeout(fetchSound, 100);
            });
            searchesList.appendChild(tag);
        });
    }

    function updateAudioPlayer() {
        if (!state.audioUrl) {
            audioPlayer.style.display = 'none';
            return;
        }

        audioPlayer.style.display = 'block';
        currentSoundElement.textContent = state.currentSound;
        audioElement.src = state.audioUrl;
        audioElement.play();
    }

    function addToRecentSearches(term) {
        if (!state.recentSearches.includes(term)) {
            state.recentSearches = [term, ...state.recentSearches].slice(0, 5);
            updateRecentSearches();
        }
    }

    async function fetchSound() {
        if (!state.query.trim()) {
            showError('Please enter a sound to search for');
            soundInput.focus();
            return;
        }

        hideError();
        setLoading(true);
        
        try {
            const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(state.query)}&token=${API_KEY}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const soundId = data.results[0].id;
                const soundUrl = `https://freesound.org/apiv2/sounds/${soundId}/?token=${API_KEY}`;

                const soundResponse = await fetch(soundUrl);
                if (!soundResponse.ok) {
                    throw new Error(`Sound error: ${soundResponse.status}`);
                }
                
                const soundData = await soundResponse.json();
                state.audioUrl = soundData.previews["preview-hq-mp3"];
                state.currentSound = state.query;
                
                addToRecentSearches(state.query);
                updateAudioPlayer();
            } else {
                showError(`No sounds found for "${state.query}"`);
            }
        } catch (err) {
            console.error(err);
            showError('Failed to fetch sound. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function handleRetry() {
        hideError();
        if (state.currentSound) {
            soundInput.value = state.currentSound;
            state.query = state.currentSound;
            clearButton.style.display = 'flex';
            setTimeout(fetchSound, 100);
        } else if (state.query) {
            fetchSound();
        } else {
            soundInput.focus();
        }
    }

    function rotateColorTheme() {
        const themes = ['blue', 'purple', 'teal', 'pink'];
        const currentIndex = themes.indexOf(state.colorTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        state.colorTheme = themes[nextIndex];
        
        // Remove all theme classes
        document.body.classList.remove('theme-blue', 'theme-purple', 'theme-teal', 'theme-pink');
        
        // Add the new theme class
        document.body.classList.add('theme-' + state.colorTheme);
    }

    function cycleInputSize() {
        const sizes = ['sm', 'md', 'lg'];
        const currentIndex = sizes.indexOf(state.inputSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        state.inputSize = sizes[nextIndex];
        
        // Remove all size classes
        soundInput.classList.remove('size-sm', 'size-md', 'size-lg');
        
        // Add the new size class
        soundInput.classList.add('size-' + state.inputSize);
        
        // Adjust search button height based on input size
        if (state.inputSize === 'sm') {
            searchButton.style.height = '2.5rem'; // 40px
        } else if (state.inputSize === 'lg') {
            searchButton.style.height = '3.5rem'; // 56px
        } else {
            searchButton.style.height = '3rem'; // 48px
        }
    }
});