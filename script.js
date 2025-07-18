// Load businesses on page load
document.addEventListener('DOMContentLoaded', () => {
  renderBusinesses(businesses);
});

// Render businesses to the DOM
function renderBusinesses(businessesToRender) {
  const container = document.getElementById('businesses-container');
  container.innerHTML = '';

  businessesToRender.forEach(business => {
    const businessCard = document.createElement('div');
    businessCard.className = 'business-card';
    
    // Star rating HTML
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `<i class="fas fa-star${i <= business.rating ? '' : '-half-alt'}"></i>`;
    }

    businessCard.innerHTML = `
      <h2>${business.name}</h2>
      <p>${business.description}</p>
      <div class="rating">${stars} (${business.rating})</div>
      
      <div class="review-form">
        <textarea id="review-text-${business.id}" placeholder="Write a review"></textarea>
        <div>
          <select id="review-rating-${business.id}">
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <button onclick="addReview(${business.id})">Submit Review</button>
        </div>
      </div>
      
      <div class="reviews-list">
        <h3>Reviews</h3>
        ${business.reviews.map(review => `
          <div class="review">
            <strong>${review.user}</strong>
            <div>${'★'.repeat(review.rating)}</div>
            <p>${review.comment}</p>
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(businessCard);
  });
}

// Add a new review
function addReview(businessId) {
  const text = document.getElementById(`review-text-${businessId}`).value;
  const rating = parseInt(document.getElementById(`review-rating-${businessId}`).value);
  
  if (!text) return alert('Please write a review!');
  
  const business = businesses.find(b => b.id === businessId);
  business.reviews.push({
    user: "Guest",  // In a real app, this would be the logged-in user
    comment: text,
    rating: rating
  });
  
  // Update average rating
  const total = business.reviews.reduce((sum, review) => sum + review.rating, 0);
  business.rating = (total / business.reviews.length).toFixed(1);
  
  // Re-render businesses
  renderBusinesses(businesses);
  
  // Clear the form
  document.getElementById(`review-text-${businessId}`).value = '';
}

// Search functionality
document.getElementById('search-btn').addEventListener('click', () => {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const filtered = businesses.filter(business => 
    business.name.toLowerCase().includes(searchTerm) || 
    business.description.toLowerCase().includes(searchTerm)
  );
  renderBusinesses(filtered);
});
