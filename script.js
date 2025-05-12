// Toggle visibility of trait section
function toggleThumbnails(sectionId) {
  const section = document.getElementById(sectionId);
  section.style.display = section.style.display === 'none' ? 'flex' : 'none';
}

// Load trait thumbnails from the JSON data
function loadTraitThumbnails(traitType, containerId, fileList) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Clear existing thumbnails

  fileList.forEach(fileName => {
    const img = document.createElement('img');
    img.src = `traits/${traitType}/${fileName}`;
    img.alt = fileName;
    img.classList.add('thumbnail');
    img.title = fileName.replace(/\.[^/.]+$/, '');

    img.onclick = () => {
      const traitImage = document.getElementById(traitType);
      if (traitImage) {
        traitImage.classList.add('fade-out');
        setTimeout(() => {
          traitImage.src = `traits/${traitType}/${fileName}`;
          traitImage.classList.remove('fade-out');
          traitImage.style.display = 'inline';
        }, 200);
      }
    };

    container.appendChild(img);
  });
}

// Load all traits from traits.json on window load
window.onload = () => {
  fetch('traits.json')
    .then(res => res.json())
    .then(data => {
      Object.entries(data).forEach(([traitType, files]) => {
        loadTraitThumbnails(traitType, `${traitType}-thumbnails`, files);
      });
    })
    .catch(err => console.error('❌ Error loading traits.json:', err));
};

// Theme toggle
const themeToggleBtn = document.getElementById("theme-toggle-btn");
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });
}

// PNG download
const downloadBtn = document.getElementById("download-btn");
if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const canvasContainer = document.getElementById("canvas");
    html2canvas(canvasContainer).then(canvas => {
      const link = document.createElement("a");
      link.download = "MAGApixel.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });
}

// Randomize traits
function randomizeTraits() {
  const traitTypes = ['background', 'skin', 'face', 'body', 'head', 'glasses', 'hand'];
  traitTypes.forEach(trait => {
    const container = document.getElementById(`${trait}-thumbnails`);
    const images = container.querySelectorAll('img');
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      images[randomIndex].click();
    }
  });
}
document.getElementById("randomize-btn").addEventListener("click", randomizeTraits);

// Clear all traits
function clearAllTraits() {
  const traitTypes = ['background', 'skin', 'face', 'body', 'head', 'glasses', 'hand'];
  traitTypes.forEach(trait => {
    const img = document.getElementById(trait);
    if (img) {
      img.src = '';
      img.style.display = 'none';
    }
  });
  const defaultPreview = document.getElementById("default-preview");
  if (defaultPreview) defaultPreview.style.display = "block";
}
document.getElementById("clear-btn").addEventListener("click", clearAllTraits);

// Tooltip
const tooltip = document.getElementById("trait-tooltip");
const tooltipImg = document.getElementById("tooltip-img");
document.addEventListener("mousemove", (e) => {
  tooltip.style.left = `${e.pageX + 10}px`;
  tooltip.style.top = `${e.pageY - 120}px`;
});
document.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("thumbnail")) {
    tooltipImg.src = e.target.src;
    tooltip.classList.add("show");
  }
});
document.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("thumbnail")) {
    tooltip.classList.remove("show");
  }
});

// Save and load favorites
const saveBtn = document.getElementById("save-fav-btn");
const loadBtn = document.getElementById("load-fav-btn");
if (saveBtn && loadBtn) {
  saveBtn.addEventListener("click", () => {
    const traitTypes = ['background', 'skin', 'face', 'body', 'head', 'glasses', 'hand'];
    const combo = {};
    traitTypes.forEach(trait => {
      const img = document.getElementById(trait);
      combo[trait] = img?.src || '';
    });
    localStorage.setItem("magapixelFavorite", JSON.stringify(combo));
    alert("Favorite saved!");
  });

  loadBtn.addEventListener("click", () => {
    const saved = localStorage.getItem("magapixelFavorite");
    if (!saved) return alert("No favorite saved yet!");
    const combo = JSON.parse(saved);
    Object.entries(combo).forEach(([trait, src]) => {
      const img = document.getElementById(trait);
      if (img) {
        img.src = src;
        img.style.display = src ? 'block' : 'none';
      }
    });
    const defaultPreview = document.getElementById("default-preview");
    if (defaultPreview) defaultPreview.style.display = "none";
  });
}
