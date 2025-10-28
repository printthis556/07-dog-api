// script.js
// Beginner-friendly script to fetch dog breeds and images using .then()

// Select DOM elements
const fetchBtn = document.getElementById('fetchBtn');
const breedBtn = document.getElementById('breedBtn');
const breedSelect = document.getElementById('breedSelect');
const dogImage = document.getElementById('dogImage');
const breedEl = document.getElementById('breed');
const errorEl = document.getElementById('error');
const loadingImageEl = document.getElementById('loadingImage');

// Helper to capitalize a word
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Helper to create a friendly display name from a raw value like "hound-afghan"
const displayBreed = (raw) => {
  if (!raw) return 'Random';
  if (raw.indexOf('-') !== -1) {
    const parts = raw.split('-'); // [breed, sub]
    return `${capitalize(parts[1])} ${capitalize(parts[0])}`; // "Afghan Hound"
  }
  return capitalize(raw);
};

// Populate the select using the object returned from /breeds/list/all
function populateBreeds(data) {
  const breeds = data.message; // {breed: [subbreeds]}
  breedSelect.innerHTML = '';

  const randomOpt = document.createElement('option');
  randomOpt.value = '';
  randomOpt.textContent = '-- Random (no selection) --';
  breedSelect.appendChild(randomOpt);

  Object.keys(breeds).forEach(breed => {
    const subs = breeds[breed];
    if (subs.length === 0) {
      const opt = document.createElement('option');
      opt.value = breed;
      opt.textContent = displayBreed(breed);
      breedSelect.appendChild(opt);
    } else {
      subs.forEach(sub => {
        const opt = document.createElement('option');
        opt.value = `${breed}-${sub}`; // e.g. "hound-afghan"
        opt.textContent = displayBreed(`${breed}-${sub}`);
        breedSelect.appendChild(opt);
      });
    }
  });
}

// Fetch a random dog or a dog for a specific breed/sub-breed
function fetchRandomDog(selected) {
  errorEl.textContent = '';
  loadingImageEl.style.display = 'block';
  dogImage.style.opacity = '0.5';

  let url = 'https://dog.ceo/api/breeds/image/random';
  if (selected) {
    if (selected.indexOf('-') !== -1) {
      const parts = selected.split('-');
      url = `https://dog.ceo/api/breed/${parts[0]}/${parts[1]}/images/random`;
    } else {
      url = `https://dog.ceo/api/breed/${selected}/images/random`;
    }
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const imageUrl = data.message;
      dogImage.src = imageUrl;
      dogImage.style.opacity = '1';
      loadingImageEl.style.display = 'none';

      if (selected) {
        breedEl.textContent = `Breed: ${displayBreed(selected)}`;
      } else {
        const match = imageUrl.match(/breeds\/([^\/]+)\//);
        const rawBreed = match ? match[1] : '';
        breedEl.textContent = `Breed: ${displayBreed(rawBreed)}`;
      }
    })
    .catch(err => {
      console.error(err);
      loadingImageEl.style.display = 'none';
      dogImage.style.opacity = '1';
      errorEl.textContent = 'Failed to load image. Please try again.';
    });
}

// Fetch breeds list on load
function loadBreeds() {
  // Show a loading option while the breeds list is fetched
  breedSelect.innerHTML = '<option>-- loading breeds --</option>';
  errorEl.textContent = '';

  fetch('https://dog.ceo/api/breeds/list/all')
    .then(response => response.json())
    .then(data => {
      populateBreeds(data);
    })
    .catch(err => {
      console.error(err);
      breedSelect.innerHTML = '<option value="">-- failed to load breeds --</option>';
      errorEl.textContent = 'Failed to load breeds list. Check your network.';
    });
}

// Wire up buttons
fetchBtn.addEventListener('click', function() { fetchRandomDog(); });
breedBtn.addEventListener('click', function() { fetchRandomDog(breedSelect.value); });

// Initial load
loadBreeds();
fetchRandomDog();
