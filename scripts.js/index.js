(function () {
    "use strict";

    function classifyTempColor(temp) {
        if (temp < 0 || temp > 34) return { bg: "#fee2e2", fg: "#b91c1c" };
        if (temp < 5 || temp > 28) return { bg: "#fef3c7", fg: "#b45309" };
        return { bg: "#dcfce7", fg: "#15803d" };
    }

    function buildMiniSvg(parcel) {
        const xs = parcel.points.map((p) => p.x);
        const ys = parcel.points.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const spanX = maxX - minX || 1;
        const spanY = maxY - minY || 1;

        const w = 116;
        const h = 92;
        const scale = Math.min(w / spanX, h / spanY);
        const offX = (w - spanX * scale) / 2 + 4;
        const offY = (h - spanY * scale) / 2 + 4;

        const pts = parcel.points
            .map((p) => {
                const sx = (offX + (p.x - minX) * scale).toFixed(1);
                const sy = (offY + (maxY - p.y) * scale).toFixed(1);
                return `${sx},${sy}`;
            })
            .join(" ");

        const dots = parcel.sensors
            .map((s) => {
                const sx = (offX + s.nx * spanX * scale).toFixed(1);
                const sy = (offY + (1 - s.ny) * spanY * scale).toFixed(1);
                const col = classifyTempColor(s.temp).fg;
                return `<circle cx="${sx}" cy="${sy}" r="3.6" fill="${col}" stroke="#ffffff" stroke-width="1.2" />`;
            })
            .join("");

        return `
            <svg viewBox="0 0 124 100" width="124" height="100" aria-hidden="true">
                <polygon points="${pts}" fill="rgba(33, 110, 39, 0.16)" stroke="#216e27" stroke-width="2" />
                ${dots}
            </svg>
        `;
    }

    function renderParcelsList() {
        const grid = document.getElementById("parcelsGrid");
        const parcels = window.PERUN_STATIC_PARCELS || [];
        if (!grid) return;

        grid.innerHTML = parcels
            .map((p) => {
                const temps = p.sensors.map((s) => s.temp);
                const minT = Math.min(...temps).toFixed(1);
                const maxT = Math.max(...temps).toFixed(1);
                const avgT = (
                    temps.reduce((a, b) => a + b, 0) / temps.length
                ).toFixed(1);

                const sensorPills = p.sensors
                    .map((s) => {
                        const c = classifyTempColor(s.temp);
                        return `<span class="sensor-chip" style="background:${c.bg};color:${c.fg}">${s.id}: ${s.temp.toFixed(1)}°C</span>`;
                    })
                    .join("");

                return `
                    <article class="parcel-card">
                        <div class="parcel-card-top">
                            <div>
                                <h2 class="parcel-card-title">${p.name}</h2>
                                <div class="parcel-card-teryt">TERYT: ${p.teryt}</div>
                            </div>
                            <span class="parcel-card-badge">Uprawa: ${p.crop}</span>
                        </div>

                        <div class="parcel-card-body">
                            <div class="parcel-mini-preview">
                                ${buildMiniSvg(p)}
                            </div>
                            <div class="parcel-card-stats">
                                <div class="parcel-stat-row">
                                    <span>Współrzędne:</span>
                                    <strong>${p.lat.toFixed(6)}, ${p.lon.toFixed(6)}</strong>
                                </div>
                                <div class="parcel-stat-row">
                                    <span>Liczba czujek:</span>
                                    <strong>${p.sensors.length} termometry</strong>
                                </div>
                                <div class="parcel-stat-row">
                                    <span>Średnia / Zakres:</span>
                                    <strong>${avgT}°C (${minT}–${maxT}°C)</strong>
                                </div>
                            </div>
                        </div>

                        <div class="parcel-card-footer">
                            <div class="parcel-sensors-pills">${sensorPills}</div>
                            <a href="dzialka.html?id=${p.fieldId}" class="btn btn-primary btn-sm">
                                Podgląd działki &rarr;
                            </a>
                        </div>
                    </article>
                `;
            })
            .join("");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderParcelsList);
    } else {
        renderParcelsList();
    }
})();
