document.addEventListener('DOMContentLoaded', () => {
  const apiContent = document.getElementById('api-content');
  if (!apiContent) return;

  const apiLoader = document.getElementById('api-loader');
  const apiError = document.getElementById('api-error');

  async function fetchNasaData() {
    if (apiLoader) apiLoader.style.display = 'block';
    if (apiError) apiError.style.display = 'none';
    apiContent.innerHTML = '';

    try {
      const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=6');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      data.forEach(item => {
        const imageUrl = item.media_type === 'image' 
          ? (item.hdurl || item.url) 
          : 'https://images-assets.nasa.gov/image/PIA12235/PIA12235~medium.jpg';
        
        const card = document.createElement('div');
        card.className = 'api-card';
        
        card.innerHTML = `
          <div class="api-img-container">
            <img src="${imageUrl}" alt="${item.title}" onerror="this.src='https://images-assets.nasa.gov/image/PIA12235/PIA12235~medium.jpg'">
            <span class="api-badge">${item.date}</span>
          </div>
          <div class="api-body">
            <h3 style="color: #fff; margin-bottom: 0.5rem; font-size: 1.2rem;">${item.title}</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">
              ${item.explanation.substring(0, 120)}...
            </p>
            <a href="${imageUrl}" target="_blank" style="display: inline-block; margin-top: 1rem; color: var(--accent); font-weight: 600; font-size: 0.9rem;">
              View Full Image →
            </a>
          </div>
        `;
        
        apiContent.appendChild(card);
      });

    } catch (error) {
      console.error('Error fetching NASA data:', error);
      if (apiError) {
        apiError.style.display = 'block';
        apiError.innerHTML = `
          <h3 style="color: var(--danger); margin-bottom: 1rem;">⚠️ Connection Lost</h3>
          <p style="color: var(--text-muted);">Failed to fetch data from NASA API. Please check your internet connection or try again later.</p>
          <p style="color: var(--danger); font-size: 0.8rem; margin-top: 0.5rem;">Error: ${error.message}</p>
        `;
      }
    } finally {
      if (apiLoader) apiLoader.style.display = 'none';
    }
  }

  window.fetchNasaData = fetchNasaData;
  fetchNasaData();
});