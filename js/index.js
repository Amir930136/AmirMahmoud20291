var SPACE_DEVS_LAUNCHES_LIMIT = 10;
var SPACE_DEVS_LAUNCHES_API = `https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=${SPACE_DEVS_LAUNCHES_LIMIT}`;
var SOLAR_SYSTEM_OPENDATA_API =
    "https://solar-system-opendata-proxy.vercel.app/api/planets";
var NASA_API =
    "https://api.nasa.gov/planetary/apod?api_key=u0xZdHPOhUgue2kVaTp1Jq5ImzoG1UbM4iEClpZZ";
var ACTIVE_LINK_CLASSES = ["bg-blue-500/10", "text-blue-400"];
var IN_ACTIVE_LINK_CLASSES = ["text-slate-300", "hover:bg-slate-800"];
var IMAGES_PATH = "./images/";
var LAUNCHER_IMAGE_PLACEHODER_PATH = `${IMAGES_PATH}launch-placeholder.png`;
var GO_STATUS_CLASSES = ["bg-green-500/20", "text-green-400"];
var TBD_STATUS_CLASSES = ["bg-yellow-500/20", "text-yellow-400"];
var AU_NUMBER = 149597870.7;
var TIME_OUT_LIMET = 20000;
var todayInSpaceArticle = {
    mediaContainer: document.getElementById("media"),
    imageLayout: document.getElementById("imageLayout"),
    apodDate: document.getElementById("apod-date"),
    loaderUI: document.getElementById("apod-loading"),
    newsImage: document.getElementById("apod-image"),
    newsVideo: document.getElementById("apod-video"),
    apodYoutubeVideo: document.getElementById("apod-youtube-video"),
    openNewTapForImageBtn: document.getElementById("openNewTapForImageBtn"),
    articleTitle: document.getElementById("apod-title"),
    articleDateDetail: document.getElementById("apod-date-detail"),
    articleExplanation: document.getElementById("apod-explanation"),
    articleCopyRight: document.getElementById("apod-copyright"),
    articleDateInfo: document.getElementById("apod-date-info"),
    articleMediaType: document.getElementById("apod-media-type"),
    inputs: {
        apodDateInput: document.getElementById("apod-date-input"),
        dateDisplayer: document.getElementById("dateDisplayer"),
    },
    btns: {
        loadDateBtn: document.getElementById("load-date-btn"),
        todayApodBtn: document.getElementById("today-apod-btn"),
    },
};
var sections = document.querySelectorAll("section");
var navigators = document.getElementById("navigators");
var navigatorLinks = document.querySelectorAll("#navigators a");
document.getElementById("launches-count").innerText =
    `${SPACE_DEVS_LAUNCHES_LIMIT} Launches`;
document.getElementById("launches-count-mobile").innerText =
    SPACE_DEVS_LAUNCHES_LIMIT;
var defaultApodData = {
    copyright: "NASA/JPL",
    date: new Date().toISOString().split("T")[0],
    explanation: `The Rosette Nebula is a large spherical H II region located
                  near one end of a giant molecular cloud in the Monoceros
                  region of the Milky Way Galaxy. The open cluster NGC 2244
                  (Caldwell 50) is closely associated with the nebulosity, the
                  stars of the cluster having been formed from the nebula's
                  matter.`,
    url: "./assets/images/placeholder.webp",
    media_type: "image",
    title: "The Rosette Nebula",
};
var mainLaunch = {
    title: document.getElementById("mainLaunchTitle"),
    companyName: document.getElementById("mainLaunchCompanyName"),
    shipName: document.getElementById("mainLaunchShipName"),
    daysLeft: document.getElementById("mainLaunchDaysLeft"),
    daysLeftCount: document.getElementById("mainLaunchDaysLeftCount"),
    date: document.getElementById("mainLaunchDate"),
    time: document.getElementById("mainLaunchTime"),
    location: document.getElementById("mainLaunchLocation"),
    country: document.getElementById("mainLaunchCountry"),
    description: document.getElementById("mainLaunchDescription"),
    image: document.getElementById("mainLaunchImage"),
    mainLaunchIcone: document.getElementById("mainLaunchIcone"),
    launchStatus: document.getElementById("launchStatus"),
};
var sidebar = document.getElementById("sidebar");
var sidebarToggleBtn = document.getElementById("sidebar-toggle");
var launchesGrid = document.getElementById("launches-grid");
var apodData = {};
var launchesData = [];
var solarSystemData = [];
var apodController = null;
var planetsGrid = document.getElementById("planets-grid");
var planetTable = document.getElementById("planet-comparison-tbody");
var planetsColor = {
    Mercury: {
        planetColor: "#eab308",
        borderColor: "#eab30880",
    },
    Venus: {
        planetColor: "#f97316",
        borderColor: "#f9731680",
    },
    Earth: {
        planetColor: "#3b82f6",
        borderColor: "#3b82f680",
    },
    Mars: {
        planetColor: "#ef4444",
        borderColor: "#ef444480",
    },
    Jupiter: {
        planetColor: "#fb923c",
        borderColor: "#fb923c80",
    },
    Saturn: {
        planetColor: "#facc15",
        borderColor: "#facc1580",
    },
    Uranus: {
        planetColor: "#06b6d4",
        borderColor: "#06b6d480",
    },
    Neptune: {
        planetColor: "#2563eb",
        borderColor: "#2563eb80",
    },
};
var mainPlanet = {
    img: document.getElementById("planet-detail-image"),
    name: document.getElementById("planet-detail-name"),
    description: document.getElementById("planet-detail-description"),
    distance: document.getElementById("planet-distance"),
    radius: document.getElementById("planet-radius"),
    mass: document.getElementById("planet-mass"),
    density: document.getElementById("planet-density"),
    orbitalPeriod: document.getElementById("planet-orbital-period"),
    rotation: document.getElementById("planet-rotation"),
    moons: document.getElementById("planet-moons"),
    gravity: document.getElementById("planet-gravity"),
    discoverer: document.getElementById("planet-discoverer"),
    discoveryDate: document.getElementById("planet-discovery-date"),
    bodyType: document.getElementById("planet-body-type"),
    volume: document.getElementById("planet-volume"),
    massFact: document.getElementById("massFact"),
    surfaceGravityFact: document.getElementById("surfaceGravityFact"),
    densityFact: document.getElementById("densityFact"),
    axialTiltFact: document.getElementById("axialTiltFact"),
    perihelion: document.getElementById("planet-perihelion"),
    aphelion: document.getElementById("planet-aphelion"),
    eccentricity: document.getElementById("planet-eccentricity"),
    inclination: document.getElementById("planet-inclination"),
    axialTilt: document.getElementById("planet-axial-tilt"),
    temp: document.getElementById("planet-temp"),
    escape: document.getElementById("planet-escape"),
};

function showLoadingState() {
    todayInSpaceArticle.loaderUI.classList.remove("hidden");
    todayInSpaceArticle.mediaContainer.classList.add("hidden");
    todayInSpaceArticle.imageLayout.classList.add("hidden");
    todayInSpaceArticle.articleTitle.innerText = "Loading...";
    todayInSpaceArticle.articleDateDetail.innerText = "Loading...";
    todayInSpaceArticle.articleDateInfo.innerText = "Loading...";
    todayInSpaceArticle.apodDate.innerText = `Astronomy Picture of the Day - Loading...`;
    todayInSpaceArticle.articleExplanation.innerText = "Loading description...";
    todayInSpaceArticle.articleCopyRight.innerText = "Loading...";
    todayInSpaceArticle.articleMediaType.innerText = "Loading...";
}
function showLaunchersLoadingState() {
    mainLaunch.image.classList.add("hidden");
    mainLaunch.mainLaunchIcone.classList.remove("hidden");
    launchesGrid.innerHTML = `<h2>Loading Launchers<i class="fas fa-rocket text-9xl text-slate-700/50"></i>...</h2>`;
}
async function fetchWithTimeout(api) {
    if (apodController) apodController.abort();
    apodController = new AbortController();
    var stopFetching = setTimeout(() => {
        apodController.abort();
    }, TIME_OUT_LIMET);
    try {
        var res = await fetchApi(api, { signal: apodController.signal });
    } finally {
        clearTimeout(stopFetching);
    }
    return res;
}
async function fetchApi(api, options = {}) {
    return await fetch(api, options);
}
async function fetchNASAAPI(api = NASA_API) {
    var errorName;
    showLoadingState();
    try {
        var res = await fetchWithTimeout(api);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        apodData = await res.json();
    } catch (e) {
        if (e.name === "AbortError") {
            errorName = e.name;
            return;
        }
        apodData = defaultApodData;
        todayInSpaceArticle.openNewTapForImageBtn.classList.add("hidden");
    } finally {
        if (errorName === "AbortError") return;
        renderArticle();
        todayInSpaceArticle.loaderUI.classList.add("hidden");
        todayInSpaceArticle.mediaContainer.classList.remove("hidden");
    }
}
function renderArticle() {
    var date = formatDate(apodData.date);
    var copyright = `Copyright: ${apodData.copyright}`;
    updateDisplayedDate();
    renderMedia();
    todayInSpaceArticle.articleTitle.innerText = apodData.title;
    todayInSpaceArticle.articleDateDetail.innerText = date;
    todayInSpaceArticle.articleDateInfo.innerText = date;
    todayInSpaceArticle.apodDate.innerText = `Astronomy Picture of the Day - ${date}`;
    todayInSpaceArticle.articleExplanation.innerText = apodData.explanation;
    todayInSpaceArticle.articleCopyRight.innerHTML = copyright;
    todayInSpaceArticle.articleMediaType.innerText = apodData.media_type;
}
function renderMedia() {
    var mediaUrl = apodData.hdurl || apodData.url;
    if (apodData.media_type === "image") {
        todayInSpaceArticle.mediaContainer.innerHTML = `
                <img
                  id="apod-image"
                  class="w-full h-full object-cover"
                  src="${mediaUrl}"
                  alt="${apodData.title}"
                />
    `;
        todayInSpaceArticle.imageLayout.classList.remove("hidden");
    } else if (apodData.media_type === "video") {
        if (mediaUrl.includes("youtu")) {
            todayInSpaceArticle.mediaContainer.innerHTML = `
      <iframe id="apod-youtube-video" class="w-full h-full object-cover" src="${mediaUrl}" frameborder="0" title="YouTube video"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
      `;
        } else {
            todayInSpaceArticle.mediaContainer.innerHTML = `
                <video id="apod-video" class="w-full h-full object-cover" autoplay controls muted loop>
                  <source src="${mediaUrl}" type="video/mp4">
                </video>
            `;
        }
    }
}
function updateDisplayedDate() {
    var newDate = todayInSpaceArticle.inputs.apodDateInput.value;
    if (newDate) initializeDate(newDate);
    else initializeDate(apodData.date);
}
function initializeDate(date) {
    var formatedDate = formatDate(date);
    todayInSpaceArticle.inputs.dateDisplayer.innerText = formatedDate;
}
function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}
function openNewTapForImage() {
    var img = apodData.hdurl || apodData.url;
    if (img) {
        window.open(img, "_blank");
    }
}
function getInputValue() {
    var newDate = todayInSpaceArticle.inputs.apodDateInput.value;
    return newDate;
}
function loadNewDate() {
    var Value = getInputValue();
    if (!Value) return;
    if (Value === apodData.date) return;
    var newApi =
        NASA_API +
        `&date=${todayInSpaceArticle.inputs.apodDateInput.value || apodData.date}`;
    fetchNASAAPI(newApi);
}
function loadTodayApod() {
    var Value = getInputValue();
    if (!Value) return;
    if (Value === defaultApodData.date) return;
    todayInSpaceArticle.inputs.apodDateInput.value = defaultApodData.date;
    updateDisplayedDate();
    fetchNASAAPI();
}
function setDefaultDateDisplay() {
    todayInSpaceArticle.inputs.dateDisplayer.innerText = formatDate(
        defaultApodData.date,
    );
}
function handleNavigation(e) {
    var link = e.target.closest(".nav-link");

    if (!link) return;

    navigatorLinks.forEach((e) => {
        if (e.classList.contains(...ACTIVE_LINK_CLASSES)) {
            e.classList.remove(...ACTIVE_LINK_CLASSES);
            e.classList.add(...IN_ACTIVE_LINK_CLASSES);
        }
    });

    link.classList.remove(...IN_ACTIVE_LINK_CLASSES);
    link.classList.add(...ACTIVE_LINK_CLASSES);

    sections.forEach((e) => e.classList.remove("hidden"));
    sections.forEach((e) => {
        if (
            !e.classList.contains("hidden") &&
            link.getAttribute("data-section") !== e.getAttribute("data-section")
        ) {
            e.classList.add("hidden");
        }
    });
}
async function getLaunchesData() {
    try {
        var res = await fetchApi(SPACE_DEVS_LAUNCHES_API);
        if (res === undefined) throw new Error(`HTTP ${res.status}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        var data = await res.json();
        var arr = [];
        data.results.forEach((e) => {
            arr.push({
                title: e.name,
                launch_service_provider: e.launch_service_provider.name,
                rocketName: e.rocket.configuration.name,
                fullDate: e.net,
                countryName: e.pad.country.name,
                location: e.pad.location.name,
                description: e.mission.description,
                imgAlt: e.image.name,
                imgURL: e.image.image_url,
                status: e.status.abbrev,
            });
        });
        launchesData = arr;
        mainLaunch.image.classList.remove("hidden");
        mainLaunch.mainLaunchIcone.classList.add("hidden");
    } catch (e) {
        launchesGrid.innerHTML = `Failed To Load Launchers<i class="fas fa-rocket text-9xl text-slate-700/50"></i> <br> <p class="text-center">Hint: reload page</p>`;
    }
}
function parseDate(fullDate, options) {
    var date = formatDate(fullDate.split("T")[0]);
    var shortDate = new Date(fullDate.split("T")[0]).toLocaleDateString("EN-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    var day = new Date(date).toLocaleDateString("EN-US", {
        weekday: "long",
    });
    var time = fullDate.split("T")[1].slice(0, 5);

    if (+time.split(":")[0] < 11) {
        time = `${time} AM UTC`;
    } else if (+time.split(":")[0] === 11 && +time.split(":")[1] <= 59) {
        time = `${time} AM UTC`;
    } else {
        var hour = +time.split(":")[0] - 12;
        time = `${hour < 10 ? "0" + hour : hour}:${time.split(":")[1]} PM UTC`;
    }
    if (time === "00:00 AM UTC") time = "12:00 AM UTC";

    return { date, day, time, shortDate };
}
function createCard(data) {
    var parsedDate = parseDate(data.fullDate);

    return `
            <div
              class="my-card bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              <div
                class="relative h-48 bg-slate-900/50 flex items-center justify-center"
              >
                <img
                  class="card-image w-full h-full object-cover"
                  src="${data.imgURL}"
                  alt="${data.imgAlt}"
                />
                <div class="absolute top-3 right-3">
                  <span
                    class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold"
                  >
                    ${data.status}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    ${data.title}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${data.launch_service_provider}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${parsedDate.shortDate}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${parsedDate.time}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${data.rocketName}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${data.location}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
  `;
}
function setMainLaunchesData() {
    var data = launchesData[0];
    if (!data) return;
    var style = "";
    if (data.status === "Go") style = GO_STATUS_CLASSES;
    else if (data.status === "TBD") style = TBD_STATUS_CLASSES;
    var img = mainLaunch.image;
    var parsedDate = parseDate(data.fullDate);
    mainLaunch.launchStatus.classList.add(...style);
    mainLaunch.launchStatus.innerText = data.status;
    mainLaunch.title.innerText = data.title;
    mainLaunch.companyName.innerText = data.launch_service_provider;
    mainLaunch.shipName.innerText = data.rocketName;
    mainLaunch.date.innerText = parsedDate.day + "," + parsedDate.date;
    mainLaunch.time.innerText = parsedDate.time;
    mainLaunch.location.innerText = data.location;
    mainLaunch.country.innerText = data.countryName;
    mainLaunch.description.innerHTML = data.description;
    img.setAttribute("alt", data.imgAlt);
    img.setAttribute("src", data.imgURL);
    img.addEventListener(
        "error",
        () => {
            img.setAttribute("src", LAUNCHER_IMAGE_PLACEHODER_PATH);
        },
        { once: true },
    );

    var days = getRemainingDays(data.fullDate);

    if (days) {
        mainLaunch.daysLeft.classList.replace("hidden", "inline-flex");
        mainLaunch.daysLeftCount.innerText = days;
    }
}
function getRemainingDays(date) {
    var launchDate = new Date(date).toISOString().split("T")[0].split("-");

    var today = new Date().toISOString().split("T")[0].split("-");

    var year = today[0] - launchDate[0];
    var month = today[1] - launchDate[1];

    var day = today[2] - launchDate[2];

    if (year) month += year * 12;
    if (month) day += month * 30;

    return day;
}
async function loadlaunches() {
    showLaunchersLoadingState();
    await getLaunchesData();
    setMainLaunchesData();
    var htmlElements = "";

    for (var i = 1; i < launchesData.length; i++) {
        htmlElements += createCard(launchesData[i]);
    }

    launchesGrid.innerHTML = htmlElements;

    if (launchesData.length > 0) {
        var images = document.querySelectorAll(".card-image");
        images.forEach((e) => {
            e.addEventListener(
                "error",
                () => {
                    e.src = LAUNCHER_IMAGE_PLACEHODER_PATH;
                },
                { once: true },
            );
        });
    }
}
function createPlanetRowData(planet) {
    var YEAR_DAYS_COUNT = 365.25;
    var EARTH_MASS = 5.972e24;
    var {
        englishName,
        semimajorAxis,
        meanRadius,
        mass,
        sideralOrbit,
        moons,
        type,
    } = planet;
    var AU = (semimajorAxis / AU_NUMBER).toFixed(2);
    var diameter = (meanRadius * 2).toLocaleString();
    var earthUnits =
        (mass.massValue * Math.pow(10, mass.massExponent)) / EARTH_MASS;
    var orbitalYears = (sideralOrbit / YEAR_DAYS_COUNT).toFixed(1);
    var typeStyles = {
        iceGiant: "background-color: #3b82f680; color: #60a5fa",
        gasGiant: "background-color: #a855f780; color: #c084fc",
        terrestrial: "background-color: #f9731680; color: #fb923c",
    };
    var style = "";
    if (type === "Ice Giant") style = typeStyles.iceGiant;
    else if (type === "Gas Giant") style = typeStyles.gasGiant;
    else if (type === "Terrestrial") style = typeStyles.terrestrial;
    return `
                    <tr class="hover:bg-slate-800/30 transition-colors ${englishName === "Earth" ? "bg-blue-500/5" : ""}">
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10"
                      >
                        <div class="flex items-center space-x-2 md:space-x-3">
                          <div
                            class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                            style="background-color: ${planetsColor[englishName].planetColor}"
                          ></div>
                          <span
                            class="font-semibold text-sm md:text-base whitespace-nowrap"
                            >${englishName}</span
                          >
                        </div>
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${AU}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${diameter}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${earthUnits.toFixed(3)}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${sideralOrbit >= 365 ? `${orbitalYears} years` : `${Math.ceil(sideralOrbit)} days`}
                      </td>
                      <td
                        class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap"
                      >
                        ${moons ? moons.length : 0}
                      </td>
                      <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span
                          class="px-2 py-1 rounded text-xs bg-orange-500/50 text-orange-200"
                          style="${style}"
                          >${type}</span
                        >
                      </td>
                    </tr>
  `;
}
async function getSolarSystemData() {
    try {
        var res = await fetchApi(SOLAR_SYSTEM_OPENDATA_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        solarSystemData = (await res.json()).bodies;
    } finally {
        document.getElementById("planets-count").innerText =
            `${solarSystemData.length} Launches`;
        document.getElementById("planets-count-mobile").innerText =
            solarSystemData.length;
    }
}
function createPlante(data) {
    var { id, englishName, semimajorAxis } = data;
    var AU = `${(semimajorAxis / AU_NUMBER).toFixed(2)} AU`;
    var color = planetsColor[englishName];
    return `
            <div
              class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group"
              data-planet-id="${id}"
              style="--planet-color: ${color.planetColor}"
              onmouseover="this.style.borderColor = '${color.borderColor}'"
              onmouseout="this.style.borderColor = '#334155'"
            >
              <div class="relative mb-3 h-24 flex items-center justify-center">
                <img
                  class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                  src="${IMAGES_PATH}${englishName.toLowerCase()}.png"
                  alt="${englishName}"
                />
              </div>
              <h4 class="font-semibold text-center text-sm">${englishName}</h4>
              <p class="text-xs text-slate-400 text-center">${AU}</p>
            </div>
  `;
}
async function loadPlanetsData() {
    await getSolarSystemData();
    var htmlElements = "";
    var htmlElementsTable = "";

    for (var i = 0; i < solarSystemData.length; i++) {
        htmlElements += createPlante(solarSystemData[i]);
        htmlElementsTable += createPlanetRowData(solarSystemData[i]);
    }

    planetsGrid.innerHTML = htmlElements;
    planetTable.innerHTML = htmlElementsTable;
}
function changeActivePlanet(e) {
    var planet = e.target.closest(".planet-card");
    if (!planet) return;
    var planetInfo;
    for (var i = 0; i < solarSystemData.length; i++) {
        if (solarSystemData[i].id === planet.getAttribute("data-planet-id")) {
            planetInfo = solarSystemData[i];
            break;
        }
    }
    setPlanetInfo(planetInfo);
}
function setPlanetInfo(planetInfo) {
    var massValue = planetInfo.mass.massValue;
    var massExponent = planetInfo.mass.massExponent;
    var axialTilt = planetInfo.axialTilt;

    mainPlanet.name.innerText = planetInfo.englishName;
    mainPlanet.img.src =
        IMAGES_PATH + planetInfo.englishName.toLowerCase() + ".png";
    mainPlanet.img.setAttribute("alt", planetInfo.englishName.toLowerCase());
    mainPlanet.description.innerText = planetInfo.description;
    mainPlanet.distance.innerText =
        (planetInfo.semimajorAxis / 1000000).toFixed(1) + "M km";
    mainPlanet.radius.innerText = planetInfo.meanRadius + " km";
    mainPlanet.mass.innerText = `${massValue} x 10^${massExponent} kg`;
    mainPlanet.density.innerText = `${planetInfo.density} g/cm³`;
    mainPlanet.orbitalPeriod.innerText = `${planetInfo.sideralOrbit.toFixed(2)} days`;
    mainPlanet.rotation.innerText = `${planetInfo.sideralRotation} hours`;
    mainPlanet.moons.innerText = planetInfo.moons ? planetInfo.moons.length : 0;
    mainPlanet.gravity.innerText = `${planetInfo.gravity} m/s²`;
    mainPlanet.discoverer.innerText = planetInfo.discoveredBy
        ? planetInfo.discoveredBy
        : "Known since antiquity";
    mainPlanet.discoveryDate.innerText = planetInfo.discoveryDate
        ? planetInfo.discoveryDate
        : "Ancient times";
    mainPlanet.bodyType.innerText = planetInfo.bodyType;
    mainPlanet.volume.innerText = `${planetInfo.vol.volValue} x 10^${planetInfo.vol.volExponent} km³`;
    mainPlanet.massFact.innerText = `Mass: ${massValue} x 10^${massExponent} kg`;
    mainPlanet.surfaceGravityFact.innerText = `Surface gravity: ${planetInfo.gravity} m/s²`;
    mainPlanet.densityFact.innerText = `Density: ${planetInfo.density} g/cm³`;
    mainPlanet.axialTiltFact.innerText = `Axial tilt: ${axialTilt}°`;
    mainPlanet.perihelion.innerText = `${(planetInfo.perihelion / 1000000).toFixed(1)}M km`;
    mainPlanet.aphelion.innerText = `${(planetInfo.aphelion / 1000000).toFixed(1)}M km`;
    mainPlanet.eccentricity.innerText = planetInfo.eccentricity.toFixed(5);
    mainPlanet.inclination.innerText = planetInfo.inclination.toFixed(2);
    mainPlanet.axialTilt.innerText = axialTilt;
    mainPlanet.temp.innerText = `${planetInfo.avgTemp}°C`;
    mainPlanet.escape.innerText = `${planetInfo.escape / 1000} km/s`;
}
function closeNav() {
    sidebar.classList.remove("sidebar-open");
}
function toggleNav(e) {
    var btn = e.target.closest("#sidebar-toggle");
    if (!btn) return;
    if (!sidebar.classList.contains("sidebar-open")) {
        sidebar.classList.add("sidebar-open");
    } else {
        closeNav();
    }
}

window.addEventListener("load", async () => {
    todayInSpaceArticle.inputs.apodDateInput.setAttribute(
        "max",
        defaultApodData.date,
    );
    todayInSpaceArticle.inputs.apodDateInput.setAttribute("min", "1995-06-16");
    setDefaultDateDisplay();
    await fetchNASAAPI();
    await loadlaunches();
    await loadPlanetsData();
    var randomPlanetIndex = Math.floor(Math.random() * solarSystemData.length);
    setPlanetInfo(solarSystemData[randomPlanetIndex]);
});
todayInSpaceArticle.inputs.apodDateInput.addEventListener(
    "change",
    updateDisplayedDate,
);
todayInSpaceArticle.openNewTapForImageBtn.addEventListener(
    "click",
    openNewTapForImage,
);
todayInSpaceArticle.btns.loadDateBtn.addEventListener("click", loadNewDate);
todayInSpaceArticle.btns.todayApodBtn.addEventListener("click", loadTodayApod);
navigators.addEventListener("click", handleNavigation);
planetsGrid.addEventListener("click", changeActivePlanet);
sidebarToggleBtn.addEventListener("click", toggleNav);
document.addEventListener("click", function (e) {
    if (e.target.closest("#sidebar-toggle")) return;
    closeNav();
});
