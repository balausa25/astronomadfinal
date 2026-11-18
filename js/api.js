// ============================================================
// ASTRONOMAD — NASA APOD API Integration (FIXED)
// Author: Smail Balaussa | Group: SE-2505
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const apiContent = document.getElementById('api-content');
  if (!apiContent) return;

  const apiLoader = document.getElementById('api-loader');
  const apiError = document.getElementById('api-error');

  
  const NASA_API_KEY = 'Gn6HmgBPNmK7CF9drcDkp9KmrWbhRHBnHRBKtKWL'; 

  async function fetchNasaData() {
    if (apiLoader) apiLoader.style.display = 'block';
    if (apiError) apiError.style.display = 'none';
    apiContent.innerHTML = '';

    try {
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&count=6`);
      
      
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
          <div class="api-img-container" style="height: 200px; overflow: hidden;">
            <img src="${imageUrl}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images-assets.nasa.gov/image/PIA12235/PIA12235~medium.jpg'">
            <span class="api-badge" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 5px; font-size: 0.8rem; color: #fff;">${item.date}</span>
          </div>
          <div class="api-body" style="padding: 1.5rem;">
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