(function () {
    "use strict";

    const LOCKED_TERYT = "181103_2.0022.90/2";
    const LOCKED_LAT = 50.317156;
    const LOCKED_LON = 21.304768;

    const FALLBACK_GEOMETRY = {
        wojewodztwo: "podkarpackie",
        powiat: "mielecki",
        gmina: "Wadowice Górne",
        obreb: "Dąbrówka Osuchowska",
        numer: "90/2",
        bbox: {
            minLon: 21.3037,
            maxLon: 21.3058,
            minLat: 50.3161,
            maxLat: 50.3182,
        },
        normalizedPoints: [
            { x: 0.878671, y: 1.0 },
            { x: 0.0, y: 0.915707 },
            { x: 0.218254, y: 0.0 },
            { x: 0.978396, y: 0.062693 },
        ],
    };

    const STATIC_REPORT = {
        parcelTitle: "181103_2.0022.90/2 (Dąbrówka Osuchowska 90/2)",
        crop: "Burak cukrowy",
        analysisDate: "2026-11-21",
        coordsLabel: "50,317156; 21,304768",
        droughtRiskLevel: "Umiarkowane",
        droughtScore: "60/100 punktów",
        factors: [
            "duży niedobór w historii",
            "powtarzalność niedoborów w miesiącach uprawowych",
            "gleba o potencjalnie niskiej zdolności retencji",
        ],
        waterDeficitSum: "0,0 mm",
        recentRain: [
            {
                month: "październik",
                rain: "19,0 mm opadu",
                norm: "brak",
                deficit: "—",
            },
            {
                month: "listopad",
                rain: "44,0 mm opadu",
                norm: "brak",
                deficit: "—",
            },
        ],
        soil: {
            complex: "5",
            type: "A",
            subsoil: "pglp",
            v0_7: { val: "0,237", typical: "0,237", diff: "-0,000 m³/m³" },
            v7_28: { val: "0,226", typical: "0,233", diff: "-0,008 m³/m³" },
        },
        history: {
            period: "2016-01-01–2026-11-21",
            monthsBelowNorm: 26,
            drySpells: 14,
            avgDeficit: "20,5 mm",
            maxDeficit: "45,4 mm (czerwiec 2019)",
            monthlyRepeat: [
                {
                    month: "kwiecień",
                    freq: "9% lat",
                    avg: "Niedobór w 1/11 lat średnio 0,1 mm",
                },
                {
                    month: "maj",
                    freq: "36% lat",
                    avg: "Niedobór w 4/11 lat średnio 5,6 mm",
                },
                {
                    month: "czerwiec",
                    freq: "64% lat",
                    avg: "Niedobór w 7/11 lat średnio 18,3 mm",
                },
                {
                    month: "lipiec",
                    freq: "36% lat",
                    avg: "Niedobór w 4/11 lat średnio 6,6 mm",
                },
                {
                    month: "sierpień",
                    freq: "73% lat",
                    avg: "Niedobór w 8/11 lat średnio 16,6 mm",
                },
                {
                    month: "wrzesień",
                    freq: "18% lat",
                    avg: "Niedobór w 2/11 lat średnio 1,3 mm",
                },
            ],
            anomalies: [
                {
                    month: "styczeń",
                    diff: "-21,3 mm",
                    actual: "6,5 mm",
                    typical: "27,8 mm",
                },
                {
                    month: "luty",
                    diff: "-16,5 mm",
                    actual: "19,6 mm",
                    typical: "36,1 mm",
                },
                {
                    month: "marzec",
                    diff: "-3,4 mm",
                    actual: "33,6 mm",
                    typical: "37,0 mm",
                },
                {
                    month: "kwiecień",
                    diff: "-19,9 mm",
                    actual: "37,8 mm",
                    typical: "57,7 mm",
                },
                {
                    month: "maj",
                    diff: "-18,2 mm",
                    actual: "64,5 mm",
                    typical: "82,7 mm",
                },
                {
                    month: "czerwiec",
                    diff: "-7,2 mm",
                    actual: "64,7 mm",
                    typical: "71,9 mm",
                },
                {
                    month: "lipiec",
                    diff: "-19,5 mm",
                    actual: "73,2 mm",
                    typical: "92,7 mm",
                },
                {
                    month: "sierpień",
                    diff: "-18,4 mm",
                    actual: "56,1 mm",
                    typical: "74,5 mm",
                },
                {
                    month: "wrzesień",
                    diff: "-10,8 mm",
                    actual: "71,2 mm",
                    typical: "82,0 mm",
                },
                {
                    month: "październik",
                    diff: "-12,4 mm",
                    actual: "50,3 mm",
                    typical: "62,7 mm",
                },
                {
                    month: "listopad",
                    diff: "3,4 mm",
                    actual: "44,0 mm",
                    typical: "40,6 mm",
                },
                {
                    month: "grudzień",
                    diff: "0,0 mm",
                    actual: "34,6 mm",
                    typical: "34,6 mm",
                },
            ],
        },
        terrain: {
            elevation: "163,0 m n.p.m.",
            slope: "1,1% (0,6°)",
            aspect: "Południowy wschód",
            runoffRisk: "niskie",
            nearestReservoir: "203,0 m",
            nearestWatercourse: "701,0 m",
        },
        recommendations: [
            "Rozważenie działań poprawiających retencję gleby – Mapa glebowo-rolnicza wskazuje gatunek gleby o potencjalnie niskiej zdolności retencji.",
            "Dostosowanie terminu siewu lub struktury upraw – W historii niedobory powtarzały się szczególnie w miesiącach: czerwiec, sierpień.",
        ],
        sources: [
            "Open-Meteo lokalna instancja; zakres: 2016-01-01–2026-11-21, 2026-10-23–2026-11-21; pobrano: 2026-11-22T08:09:30.117215+00:00",
            "Open-Meteo elevation; pobrano: 2026-11-22T08:09:30.117215+00:00",
            "OpenStreetMap Overpass API; pobrano: 2026-11-22T08:09:30.117215+00:00",
            "Mapa Glebowo-Rolnicza Geoportal 1:5000; pobrano: 2026-11-22T08:09:30.117215+00:00",
            "Ocena opiera się na jednym punkcie reprezentującym działkę; granice działki nie są agregowane do rastra.",
            "Mapa glebowo-rolnicza dostarcza klasyfikację gleby w punkcie; nie zastępuje badania mechanicznego i chemicznego gleby.",
            "Nachylenie i kierunek stoku są estymowane z 5 punktów wysokościowych wokół lokalizacji, a nie z pełnej geometrii działki.",
            "Bliskość wody pochodzi z OpenStreetMap i nie potwierdza możliwości poboru ani prawnego prawa do wody.",
        ],
    };

    let currentParcelData = FALLBACK_GEOMETRY;

    function parseWktPolygon(wkt) {
        const match = wkt.match(/POLYGON\s*\(\(([^)]+)\)\)/i);
        if (!match) return null;
        const pairs = match[1].split(",").map((pair) => {
            const parts = pair.trim().split(/\s+/).map(Number);
            return { lon: parts[0], lat: parts[1] };
        });
        if (pairs.length > 3) {
            const first = pairs[0];
            const last = pairs[pairs.length - 1];
            if (
                Math.abs(first.lon - last.lon) < 1e-9 &&
                Math.abs(first.lat - last.lat) < 1e-9
            ) {
                pairs.pop();
            }
        }
        return pairs;
    }

    function normalizeLonLatRing(ring) {
        const lons = ring.map((p) => p.lon);
        const lats = ring.map((p) => p.lat);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const spanLon = maxLon - minLon || 1e-6;
        const spanLat = maxLat - minLat || 1e-6;

        const normalizedPoints = ring.map((p) => ({
            x: Number(((p.lon - minLon) / spanLon).toFixed(6)),
            y: Number(((p.lat - minLat) / spanLat).toFixed(6)),
        }));

        return {
            bbox: { minLon, maxLon, minLat, maxLat },
            normalizedPoints,
        };
    }

    function updateWmsLayer(bbox) {
        const img = document.getElementById("perunWmsContour");
        if (!img) return;

        const showContour =
            document.getElementById("perunChkContour")?.checked ?? true;
        const showBuildings =
            document.getElementById("perunChkBuildings")?.checked ?? true;

        const layers = [];
        if (showContour) layers.push("dzialki", "numery_dzialek");
        if (showBuildings) layers.push("budynki");

        if (layers.length === 0) {
            img.style.display = "none";
            return;
        }

        const padLon = (bbox.maxLon - bbox.minLon) * 0.25 || 0.001;
        const padLat = (bbox.maxLat - bbox.minLat) * 0.25 || 0.001;
        const viewBbox = [
            (bbox.minLon - padLon).toFixed(6),
            (bbox.minLat - padLat).toFixed(6),
            (bbox.maxLon + padLon).toFixed(6),
            (bbox.maxLat + padLat).toFixed(6),
        ].join(",");

        const wmsUrl =
            "https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow" +
            `?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=${layers.join(",")}` +
            "&STYLES=&FORMAT=image/png&TRANSPARENT=true&SRS=EPSG:4326" +
            `&BBOX=${viewBbox}&WIDTH=800&HEIGHT=600`;

        img.style.display = "block";
        img.src = wmsUrl;
        img.onerror = () => {
            img.style.display = "none";
        };
    }

    function renderParcelCanvas(data) {
        const canvas = document.getElementById("perunDzialkaCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const showLabels =
            document.getElementById("perunChkBuildings")?.checked ?? true;
        const pts = data.normalizedPoints;

        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const xs = pts.map((p) => p.x);
        const ys = pts.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const spanX = maxX - minX || 1;
        const spanY = maxY - minY || 1;

        const ratioEl = document.getElementById("metaRatio");
        if (ratioEl) {
            ratioEl.textContent = (spanX / spanY).toFixed(2);
        }

        const pad = 95;
        const scale = Math.min((w - pad * 2) / spanX, (h - pad * 2) / spanY);
        const offsetX = (w - spanX * scale) / 2;
        const offsetY = (h - spanY * scale) / 2;

        const screenPts = pts.map((p) => ({
            sx: offsetX + (p.x - minX) * scale,
            sy: offsetY + (maxY - p.y) * scale,
            raw: p,
        }));

        ctx.beginPath();
        screenPts.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(33, 110, 39, 0.22)";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#166534";
        ctx.stroke();

        screenPts.forEach((pt, idx) => {
            ctx.beginPath();
            ctx.arc(pt.sx, pt.sy, 5.5, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "#166534";
            ctx.stroke();

            if (showLabels) {
                ctx.fillStyle = "#0f172a";
                ctx.font = "600 12px ui-monospace, monospace";
                const labelX = pt.sx > w * 0.72 ? pt.sx - 130 : pt.sx + 10;
                const labelY = pt.sy < 35 ? pt.sy + 18 : pt.sy - 8;
                ctx.fillText(
                    `P${idx + 1} (${pt.raw.x}, ${pt.raw.y})`,
                    labelX,
                    labelY,
                );
            }
        });
    }

    function applyParcelToUi(data, sourceLabel) {
        currentParcelData = data;
        document.getElementById("metaWoj").textContent =
            data.wojewodztwo || "podkarpackie";
        document.getElementById("metaPow").textContent =
            data.powiat || "mielecki";
        document.getElementById("metaGm").textContent =
            data.gmina || "Wadowice Górne";
        document.getElementById("metaObreb").textContent =
            data.obreb || "Dąbrówka Osuchowska";
        document.getElementById("metaNr").textContent = data.numer || "90/2";

        const badge = document.getElementById("gpParcelIdBadge");
        if (badge) {
            badge.textContent = `${LOCKED_TERYT} • ${LOCKED_LAT}, ${LOCKED_LON}`;
        }

        const jsonArea = document.getElementById("perunPunktyOutput");
        if (jsonArea) {
            jsonArea.value = JSON.stringify(data.normalizedPoints, null, 2);
        }

        const statusBox = document.getElementById("perunStatusBox");
        if (statusBox) {
            statusBox.textContent = sourceLabel;
        }

        updateWmsLayer(data.bbox);
        renderParcelCanvas(data);
    }

    async function fetchFromGeoportal() {
        const statusBox = document.getElementById("perunStatusBox");
        if (statusBox) {
            statusBox.textContent = `Pobieranie działki ${LOCKED_TERYT} z Geoportal ULDK...`;
        }

        const uldkUrl =
            "https://uldk.gugik.gov.pl/?request=GetParcelById" +
            `&id=${encodeURIComponent(LOCKED_TERYT)}` +
            "&result=geom_wkt,voivodeship,county,commune,region,parcel&srid=4326";

        try {
            const res = await fetch(uldkUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            const lines = text.trim().split(/\r?\n/);
            if (lines.length < 2 || !lines[0].startsWith("0")) {
                throw new Error("Nieprawidłowa odpowiedź ULDK");
            }

            const parts = lines[1].split("|");
            const ring = parseWktPolygon(parts[0] || "");
            if (!ring || ring.length < 3) {
                throw new Error("Nie udało się sparsować geometrii WKT");
            }

            const norm = normalizeLonLatRing(ring);
            applyParcelToUi(
                {
                    wojewodztwo: parts[1] || "podkarpackie",
                    powiat: parts[2] || "mielecki",
                    gmina: parts[3] || "Wadowice Górne",
                    obreb: parts[4] || "Dąbrówka Osuchowska",
                    numer: parts[5] || "90/2",
                    bbox: norm.bbox,
                    normalizedPoints: norm.normalizedPoints,
                },
                `Pobrano działkę ${LOCKED_TERYT} bezpośrednio z Geoportal ULDK (EPSG:4326).`,
            );
        } catch {
            applyParcelToUi(
                FALLBACK_GEOMETRY,
                `Załadowano zapisaną geometrię Geoportal dla działki ${LOCKED_TERYT} (${LOCKED_LAT}, ${LOCKED_LON}).`,
            );
        }
    }

    function renderStaticReport() {
        const out = document.getElementById("analysisReportOutput");
        if (!out) return;

        const rainRows = STATIC_REPORT.recentRain
            .map(
                (r) =>
                    `<tr><td><strong>${r.month}</strong></td><td>${r.rain}</td><td>Norma: ${r.norm}</td><td>Niedobór: ${r.deficit}</td></tr>`,
            )
            .join("");

        const repeatItems = STATIC_REPORT.history.monthlyRepeat
            .map(
                (m) =>
                    `<li><strong>${m.month}</strong> – ${m.freq} (${m.avg})</li>`,
            )
            .join("");

        const anomalyCards = STATIC_REPORT.history.anomalies
            .map(
                (a) => `
                    <div class="anomaly-chip">
                        <strong>${a.month}: ${a.diff}</strong><br/>
                        W analizowanym roku: ${a.actual}<br/>
                        Typowo: ${a.typical}
                    </div>
                `,
            )
            .join("");

        const factorItems = STATIC_REPORT.factors
            .map((f) => `<li>${f}</li>`)
            .join("");
        const recItems = STATIC_REPORT.recommendations
            .map((rec) => `<li>${rec}</li>`)
            .join("");
        const sourceItems = STATIC_REPORT.sources
            .map((src) => `<li>${src}</li>`)
            .join("");

        out.innerHTML = `
            <div class="report-header">
                <h3>PERUN – Raport analizy działki</h3>
                <p>
                    <strong>Działka:</strong> ${STATIC_REPORT.parcelTitle} |
                    <strong>Uprawa:</strong> ${STATIC_REPORT.crop} |
                    <strong>Data analizy:</strong> ${STATIC_REPORT.analysisDate}
                </p>
                <p><strong>Współrzędne:</strong> ${STATIC_REPORT.coordsLabel}</p>
            </div>

            <div class="report-grid">
                <div class="report-box">
                    <h4>Poziom ryzyka suszy</h4>
                    <p><strong>${STATIC_REPORT.droughtRiskLevel}</strong> (Wynik algorytmu: ${STATIC_REPORT.droughtScore})</p>
                    <p style="margin-top: 0.4rem;"><strong>Co wpłynęło na ocenę:</strong></p>
                    <ul>${factorItems}</ul>
                </div>

                <div class="report-box">
                    <h4>Sytuacja wodna ${STATIC_REPORT.analysisDate}</h4>
                    <p>Suma miesięcznych niedoborów względem norm uprawy: <strong>${STATIC_REPORT.waterDeficitSum}</strong>.</p>
                    <table class="report-table">
                        <tbody>${rainRows}</tbody>
                    </table>
                </div>

                <div class="report-box">
                    <h4>Wilgotność gleby</h4>
                    <p>Kompleks: <strong>${STATIC_REPORT.soil.complex}</strong> | Typ gleby: <strong>${STATIC_REPORT.soil.type}</strong> | Podłoże: <strong>${STATIC_REPORT.soil.subsoil}</strong></p>
                    <p style="margin-top: 0.35rem;">0–7 cm: <strong>${STATIC_REPORT.soil.v0_7.val} m³/m³</strong> (Typowo: ${STATIC_REPORT.soil.v0_7.typical}, Odchylenie: ${STATIC_REPORT.soil.v0_7.diff})</p>
                    <p>7–28 cm: <strong>${STATIC_REPORT.soil.v7_28.val} m³/m³</strong> (Typowo: ${STATIC_REPORT.soil.v7_28.typical}, Odchylenie: ${STATIC_REPORT.soil.v7_28.diff})</p>
                </div>

                <div class="report-box">
                    <h4>Ukształtowanie terenu i dostęp do wody</h4>
                    <p>Wysokość n.p.m.: <strong>${STATIC_REPORT.terrain.elevation}</strong> | Nachylenie: <strong>${STATIC_REPORT.terrain.slope}</strong></p>
                    <p>Kierunek stoku: <strong>${STATIC_REPORT.terrain.aspect}</strong> | Ryzyko spływu: <strong>${STATIC_REPORT.terrain.runoffRisk}</strong></p>
                    <p>Najbliższe obiekty wodne: Zbiornik <strong>${STATIC_REPORT.terrain.nearestReservoir}</strong>, Ciek wodny <strong>${STATIC_REPORT.terrain.nearestWatercourse}</strong></p>
                </div>
            </div>

            <div class="report-box" style="margin-top: 1rem;">
                <h4>Historyczna podatność na suszę (Okres: ${STATIC_REPORT.history.period})</h4>
                <p>
                    Miesiące poniżej normy: <strong>${STATIC_REPORT.history.monthsBelowNorm}</strong> |
                    Okresy suche: <strong>${STATIC_REPORT.history.drySpells}</strong> |
                    Średni deficyt w miesiącach z niedoborem: <strong>${STATIC_REPORT.history.avgDeficit}</strong> |
                    Największy niedobór: <strong>${STATIC_REPORT.history.maxDeficit}</strong>
                </p>
                <ul>${repeatItems}</ul>
                <h4 style="margin-top: 0.85rem;">Anomalia opadów w analizowanym roku</h4>
                <div class="report-anomalies-grid">${anomalyCards}</div>
            </div>

            <div class="report-grid" style="margin-top: 1rem;">
                <div class="report-box">
                    <h4>Rekomendacje</h4>
                    <ul>${recItems}</ul>
                </div>

                <div class="report-box">
                    <h4>Źródła i ograniczenia</h4>
                    <ul>${sourceItems}</ul>
                </div>
            </div>
        `;

        const reportStatus = document.getElementById("analysisReportStatus");
        if (reportStatus) {
            reportStatus.textContent = `Raport gotowy dla działki ${STATIC_REPORT.parcelTitle} (uprawa: ${STATIC_REPORT.crop}, data: ${STATIC_REPORT.analysisDate}).`;
        }
    }

    function init() {
        fetchFromGeoportal();
        renderStaticReport();

        document
            .getElementById("btnSearchById")
            ?.addEventListener("click", fetchFromGeoportal);

        document
            .getElementById("perunChkContour")
            ?.addEventListener("change", () => {
                updateWmsLayer(currentParcelData.bbox);
            });

        document
            .getElementById("perunChkBuildings")
            ?.addEventListener("change", () => {
                updateWmsLayer(currentParcelData.bbox);
                renderParcelCanvas(currentParcelData);
            });

        document
            .getElementById("btnCopyPointsJson")
            ?.addEventListener("click", () => {
                const jsonArea = document.getElementById("perunPunktyOutput");
                if (!jsonArea) return;
                navigator.clipboard?.writeText(jsonArea.value).catch(() => {});
                const btn = document.getElementById("btnCopyPointsJson");
                if (btn) {
                    btn.textContent = "Skopiowano!";
                    setTimeout(() => {
                        btn.textContent = "Kopiuj JSON";
                    }, 1500);
                }
            });

        document
            .getElementById("btnStartAnalysis")
            ?.addEventListener("click", () => {
                const sec = document.getElementById("analysisReportSection");
                if (sec) sec.hidden = false;
                renderStaticReport();
            });

        document
            .getElementById("btnSaveAnalysisPdf")
            ?.addEventListener("click", () => {
                const sec = document.getElementById("analysisReportSection");
                if (sec) sec.hidden = false;
                window.print();
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
