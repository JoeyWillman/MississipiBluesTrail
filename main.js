// ================================
// Map initialization
// ================================
if (document.getElementById("map")) {
  const map = L.map('map', { zoomControl: true }).setView([33.0, -90.0], 7); // Mississippi center

  // Hide controls until splash is closed
  map.getContainer().classList.add("hidden-controls");

  // Basemap
 L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 20
}).addTo(map);


  // Icon
  const markerIcon = L.icon({
    iconUrl: 'assets/images/blues-marker.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28]
  });

  // Splash screen
  const enterBtn = document.getElementById("enter-btn");
  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      document.getElementById("splash").style.display = "none";
      map.getContainer().classList.remove("hidden-controls");
    });
  }

// Load CSV markers
Papa.parse("data/mbtmarkers.csv", {
  download: true,
  header: true,
  complete: function(results) {
    results.data.forEach(site => {
      if (site.lat && site.lon) {
        const marker = L.marker([+site.lat, +site.lon], { icon: markerIcon }).addTo(map);

        // Remove <img> tags but keep <a> links and <br>
        let cleanedDesc = (site.desc || "")
          .replace(/<img[^>]*>/gi, "") // strip all <img> tags
          .replace(/Visit the Mississippi Blues Trail.*?(Commission 2011)/gis, ""); // remove the stock footer text

        // Clean up extra <br> tags at start/end
        cleanedDesc = cleanedDesc.replace(/^(<br>\s*)+/, "").replace(/(\s*<br>)+$/, "");

        // Build popup
        let popupContent = `
          <div class="popup-card">
            <h3>${site.name || ""}</h3>
            <div class="popup-text">${cleanedDesc}</div>
            <div class="popup-footer">
              <p>Visit the Mississippi Blues Trail to learn more about this marker and the rest of the Blues Trail.</p>
              <a href="http://www.msbluestrail.org/blues_trail/" target="_blank" rel="noopener" class="popup-btn">
                Visit Website
              </a>
              <p style="margin-top:0.5rem; font-size:0.85rem; color:#555;">
                All content © Mississippi Blues Commission 2011
              </p>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 400,
          className: "custom-popup"
        });
      }
    });
  }
});


// Museum icon (different from trail marker)
const museumIcon = L.icon({
  iconUrl: 'assets/images/blues-museum.png', // create a new icon file for museums
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28]
});

// Load CSV museums
Papa.parse("data/mbtmuseums.csv", {
  download: true,
  header: true,
  complete: function(results) {
    results.data.forEach(museum => {
      if (museum.lat && museum.lon) {
        const marker = L.marker([+museum.lat, +museum.lon], { icon: museumIcon }).addTo(map);

        // Ensure website starts with http
        let url = museum.website || "";
        if (url && !/^https?:\/\//i.test(url)) {
          url = "http://" + url;
        }

        const popupContent = `
          <div class="popup-card">
            <h3>${museum.name || ""}</h3>
            ${url ? `<a href="${url}" target="_blank" rel="noopener" class="popup-btn">Visit Website</a>` : ""}
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 400,
          className: "custom-popup"
        });
      }
    });
  }
});



// Info button control
const infoControl = L.control({ position: "topright" });

infoControl.onAdd = function(map) {
  const div = L.DomUtil.create("div", "leaflet-control-info");
  div.innerHTML = "i"; // info button text/icon

  // Prevent map drag when clicking
  L.DomEvent.disableClickPropagation(div);

  div.addEventListener("click", () => {
    document.getElementById("info-overlay").style.display = "flex";
  });

  return div;
};

infoControl.addTo(map);

// Close button logic
document.querySelector(".info-close").addEventListener("click", () => {
  document.getElementById("info-overlay").style.display = "none";
});




// Legend
const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML = `
    <h4 style="font-size: 16px; margin-bottom: 8px;">Legend</h4>
    <div class="legend-item" style="font-size: 15px; margin-bottom: 6px;">
      <img src="assets/images/blues-marker.png" alt="Blues Trail Marker" style="width:24px; height:24px; margin-right:8px;"> Blues Trail Marker
    </div>
    <div class="legend-item" style="font-size: 15px;">
      <img src="assets/images/blues-museum.png" alt="Blues Museum" style="width:24px; height:24px; margin-right:8px;"> Blues Museum
    </div>
  `;
  return div;
};
legend.addTo(map);

}



// ================================
// Navbar hamburger
// ================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}
