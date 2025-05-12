// Toggle visibility of trait section
function toggleThumbnails(sectionId) {
  const section = document.getElementById(sectionId);
  section.style.display = section.style.display === 'none' ? 'flex' : 'none';
}

// Load trait thumbnails from folder and set up image previews
function loadTraitThumbnails(traitType, containerId, folderPath) {
  const container = document.getElementById(containerId);

  fetch(folderPath)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const html = parser.parseFromString(data, 'text/html');
      const links = html.querySelectorAll('a');

      links.forEach(link => {
        const fileName = link.getAttribute('href');
        if (fileName.endsWith('.png') || fileName.endsWith('.gif')) {
          const img = document.createElement('img');
          img.src = `${folderPath}/${fileName.replace(/^.*[\\\/]/, '')}`;
          img.alt = fileName;
          img.classList.add('thumbnail');
          img.title = fileName.replace(/\.[^/.]+$/, '');

          img.onclick = () => {
            const traitImage = document.getElementById(traitType);
            const newSrc = `${folderPath}/${fileName.replace(/^.*[\\\/]/, '')}`;
            if (traitImage) {
              traitImage.classList.add('fade-out');
              setTimeout(() => {
                traitImage.src = newSrc;
                traitImage.classList.remove('fade-out');
                traitImage.style.display = 'inline';
              }, 200);
            }
          };

          container.appendChild(img);
        }
      });
    });
}

// Load all traits on window load
window.onload = () => {
  const traits = ['background', 'skin', 'face', 'body', 'head', 'glasses', 'hand'];
  traits.forEach(trait => {
    loadTraitThumbnails(trait, `${trait}-thumbnails`, `traits/${trait}`);
  });
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
downloadBtn.addEventListener("click", () => {
  const canvasContainer = document.getElementById("canvas");
  html2canvas(canvasContainer).then(canvas => {
    const link = document.createElement("a");
    link.download = "MAGApixel.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

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

document.getElementById("randomize-btn").addEventListener("click", randomizeTraits);
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
