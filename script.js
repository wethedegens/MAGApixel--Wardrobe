// Toggle visibility of trait section
const isGitHub = window.location.hostname.includes("github.io");
const basePath = isGitHub ? "MAGApixel--Wardrobe/" : "";

function toggleThumbnails(sectionId) {
    const section = document.getElementById(sectionId);
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
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
            img.title = fileName.replace(/\.[^/.]+$/, ''); // Tooltip text
             // sets tooltip text (removes .png)
  
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
  
  // Call the function for each trait type
  window.onload = () => {
    loadTraitThumbnails('background', 'background-thumbnails', basePath + 'traits/background');
    loadTraitThumbnails('skin', 'skin-thumbnails', basePath + 'traits/skin');
    loadTraitThumbnails('face', 'face-thumbnails', basePath + 'traits/face');
    loadTraitThumbnails('body', 'body-thumbnails', basePath + 'traits/body');
    loadTraitThumbnails('head', 'head-thumbnails', basePath + 'traits/head');
    loadTraitThumbnails('glasses', 'glasses-thumbnails', basePath + 'traits/glasses');
    loadTraitThumbnails('hand', 'hand-thumbnails', basePath + 'traits/hand');
    
    
    // Test change to trigger GitHub Desktop

    
  };
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
    });
  }
  
  document.getElementById("download-btn").addEventListener("click", () => {
    const canvasContainer = document.getElementById("canvas");
  
    html2canvas(canvasContainer).then(canvas => {
      const link = document.createElement("a");
      link.download = "MAGApixel.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });
  function randomizeTraits() {
    const traitTypes = ['background', 'skin', 'face', 'body', 'head', 'glasses', 'hand'];
  
    traitTypes.forEach(trait => {
      const container = document.getElementById(`${trait}-thumbnails`);
      const images = container.querySelectorAll('img');
  
      if (images.length > 0) {
        const randomIndex = Math.floor(Math.random() * images.length);
        images[randomIndex].click(); // simulate clicking the trait image
      }
  
      // Make sure the corresponding preview image is visible
      const previewImg = document.getElementById(trait);
      if (previewImg) {
        previewImg.style.display = 'block';
      }
    });
  }
  
  
  function clearAllTraits() {
  const traitTypes = ['background', 'skin', 'face', 'body', 'head', 'glasses', 'hand'];

  // Hide all trait layers
  traitTypes.forEach(trait => {
    const img = document.getElementById(trait);
    if (img) {
      img.src = '';
      img.style.display = 'none';
    }
  });

  // Show the default preview image again
  const defaultPreview = document.getElementById("default-preview");
  if (defaultPreview) {
    defaultPreview.style.display = "block";
  }
}

  
  
  document.getElementById("randomize-btn").addEventListener("click", randomizeTraits);
  document.getElementById("clear-btn").addEventListener("click", clearAllTraits);
  
  const tooltip = document.getElementById("trait-tooltip");
const tooltipImg = document.getElementById("tooltip-img");

document.addEventListener("mousemove", (e) => {
  tooltip.style.left = `${e.pageX}px`;
  tooltip.style.top = `${e.pageY - 120}px`; // Position above cursor
});

document.querySelectorAll(".thumbnail").forEach(img => {
  img.addEventListener("mouseenter", () => {
    tooltipImg.src = img.src;
    tooltip.style.display = "block";
  });

  img.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
});
document.getElementById("save-fav-btn").addEventListener("click", () => {
    const traitTypes = ['background', 'skin', 'face', 'body', 'head', 'glasses', 'hand'];
    const combo = {};
  
    traitTypes.forEach(trait => {
      const img = document.getElementById(trait);
      combo[trait] = img?.src || '';
    });
  
    localStorage.setItem("magapixelFavorite", JSON.stringify(combo));
    alert("Favorite saved!");
  });
  
  document.getElementById("load-fav-btn").addEventListener("click", () => {
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
  
    // Hide default preview
    const defaultPreview = document.getElementById("default-preview");
    if (defaultPreview) defaultPreview.style.display = "none";
  });
  // === Make Canvas Draggable ===
const canvas = document.getElementById("canvas");

let isDragging = false;
let offsetX, offsetY;

canvas.addEventListener("dragstart", (e) => {
  isDragging = true;
  const rect = canvas.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
});

document.addEventListener("dragover", (e) => {
  if (isDragging) {
    e.preventDefault(); // Prevent default to allow drop
  }
});

document.addEventListener("drop", (e) => {
  if (isDragging) {
    e.preventDefault();
    canvas.style.position = "absolute";
    canvas.style.left = `${e.clientX - offsetX}px`;
    canvas.style.top = `${e.clientY - offsetY}px`;
    isDragging = false;
  }
});

  