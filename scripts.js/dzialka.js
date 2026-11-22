(function () {
    "use strict";

    const SVG_NS = "http://www.w3.org/2000/svg";
    const FACTOR = 260;

    const TEMP_STOPS = [
        { t: 0.0, r: 37, g: 99, b: 235 },
        { t: 0.35, r: 50, g: 167, b: 58 },
        { t: 0.68, r: 234, g: 179, b: 8 },
        { t: 1.0, r: 220, g: 38, b: 38 },
    ];

    const state = {
        selectedFieldId: 1,
        selectedSensorId: null,
        probePoint: null,
        overlayMode: "temp",
        showSensors: true,
        view: {
            scale: 1.4,
            offsetX: 120,
            offsetY: 80,
            isPanning: false,
            panStartX: 0,
            panStartY: 0,
            movedDuringDrag: false,
        },
    };

    function classifyTemp(temp) {
        if (temp < 0 || temp > 34) {
            return { status: "crit", color: "#dc2626", label: "Krytyczny" };
        }
        if (temp < 5 || temp > 28) {
            return { status: "warn", color: "#eab308", label: "Ostrzeżenie" };
        }
        return { status: "ok", color: "#32a73a", label: "OK" };
    }

    function hydrateParcel(raw) {
        const corners = raw.points.map((p, idx) => ({
            id: `P${idx + 1}`,
            x: Number((p.x * FACTOR).toFixed(1)),
            y: Number((p.y * FACTOR).toFixed(1)),
        }));
        const xs = corners.map((c) => c.x);
        const ys = corners.map((c) => c.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const sensors = raw.sensors.map((s) => ({
            ...s,
            x: Number((minX + s.nx * (maxX - minX || FACTOR)).toFixed(1)),
            y: Number((minY + s.ny * (maxY - minY || FACTOR)).toFixed(1)),
        }));

        return { ...raw, corners, sensors };
    }

    const parcels = (window.PERUN_STATIC_PARCELS || []).map(hydrateParcel);

    function getCurrentParcel() {
        return (
            parcels.find((p) => p.fieldId === Number(state.selectedFieldId)) ||
            parcels[0]
        );
    }

    function interpolateTempIdw(parcel, x, y) {
        let num = 0;
        let den = 0;
        for (const s of parcel.sensors) {
            const d = Math.hypot(x - s.x, y - s.y);
            if (d < 0.001) return s.temp;
            const w = 1 / (d * d);
            num += w * s.temp;
            den += w;
        }
        return den ? num / den : 18.0;
    }

    function tempToRgb(temp) {
        const clamped = Math.max(0, Math.min(45, temp));
        const t = clamped / 45;
        for (let i = 0; i < TEMP_STOPS.length - 1; i++) {
            const a = TEMP_STOPS[i];
            const b = TEMP_STOPS[i + 1];
            if (t >= a.t && t <= b.t) {
                const lt = (t - a.t) / (b.t - a.t || 1);
                return [
                    Math.round(a.r + (b.r - a.r) * lt),
                    Math.round(a.g + (b.g - a.g) * lt),
                    Math.round(a.b + (b.b - a.b) * lt),
                ];
            }
        }
        return [220, 38, 38];
    }

    function isPointInPolygon(pt, polygon) {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x;
            const yi = polygon[i].y;
            const xj = polygon[j].x;
            const yj = polygon[j].y;

            const intersect =
                yi > pt.y !== yj > pt.y &&
                pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi || 1e-9) + xi;
            if (intersect) inside = !inside;
        }
        return inside;
    }

    function screenToWorld(clientX, clientY) {
        const svg = document.getElementById("fieldSvg");
        const rect = svg.getBoundingClientRect();
        const sx = clientX - rect.left;
        const sy = clientY - rect.top;
        const wx = (sx - state.view.offsetX) / state.view.scale;
        const wy = -((sy - state.view.offsetY) / state.view.scale);
        return { x: wx, y: wy };
    }

    function createSvgEl(tag, attrs = {}) {
        const el = document.createElementNS(SVG_NS, tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        return el;
    }

    function renderOverlay(parcel) {
        const layer = document.getElementById("heatmapLayer");
        const img = document.getElementById("heatmapImage");
        const grid = document.getElementById("oniGridLayer");
        if (!layer || !img || !grid) return;

        if (state.overlayMode === "off") {
            layer.style.display = "none";
            return;
        }
        layer.style.display = "inline";

        const xs = parcel.corners.map((c) => c.x);
        const ys = parcel.corners.map((c) => c.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const width = Math.max(maxX - minX, 1);
        const height = Math.max(maxY - minY, 1);

        const cols = 30;
        const rows = 30;
        const canvas = document.createElement("canvas");
        canvas.width = cols;
        canvas.height = rows;
        const ctx = canvas.getContext("2d");
        const imgData = ctx.createImageData(cols, rows);

        for (let py = 0; py < rows; py++) {
            const wy = maxY - ((py + 0.5) / rows) * height;
            for (let px = 0; px < cols; px++) {
                const wx = minX + ((px + 0.5) / cols) * width;
                const val = interpolateTempIdw(parcel, wx, wy);
                const [r, g, b] = tempToRgb(val);
                const idx = (py * cols + px) * 4;
                imgData.data[idx] = r;
                imgData.data[idx + 1] = g;
                imgData.data[idx + 2] = b;
                imgData.data[idx + 3] = 195;
            }
        }

        ctx.putImageData(imgData, 0, 0);
        img.setAttribute("x", minX);
        img.setAttribute("y", -maxY);
        img.setAttribute("width", width);
        img.setAttribute("height", height);
        img.style.imageRendering = "pixelated";
        img.setAttribute("href", canvas.toDataURL("image/png"));

        grid.innerHTML = "";
        let d = "";
        for (let c = 1; c < cols; c++) {
            const gx = (minX + (c * width) / cols).toFixed(2);
            d += `M ${gx} ${(-maxY).toFixed(2)} L ${gx} ${(-minY).toFixed(2)} `;
        }
        for (let r = 1; r < rows; r++) {
            const gy = (-maxY + (r * height) / rows).toFixed(2);
            d += `M ${minX.toFixed(2)} ${gy} L ${maxX.toFixed(2)} ${gy} `;
        }
        grid.appendChild(
            createSvgEl("path", {
                d,
                fill: "none",
                stroke: "rgba(15, 23, 42, 0.22)",
                "stroke-width": "0.75",
            }),
        );
    }

    function renderParcelSvg(parcel) {
        const ptsStr = parcel.corners.map((c) => `${c.x},${-c.y}`).join(" ");
        document
            .getElementById("fieldClipPolygon")
            ?.setAttribute("points", ptsStr);

        const fieldLayer = document.getElementById("fieldLayer");
        const cornersLayer = document.getElementById("cornersLayer");
        const sensorsLayer = document.getElementById("sensorsLayer");
        const probeLayer = document.getElementById("probeLayer");
        fieldLayer.innerHTML = "";
        cornersLayer.innerHTML = "";
        sensorsLayer.innerHTML = "";
        if (probeLayer) probeLayer.innerHTML = "";

        fieldLayer.appendChild(
            createSvgEl("polygon", {
                points: ptsStr,
                fill:
                    state.overlayMode === "off"
                        ? "rgba(50, 167, 58, 0.16)"
                        : "rgba(50, 167, 58, 0.03)",
                stroke: "#14532d",
                "stroke-width": "2.4",
            }),
        );

        parcel.corners.forEach((c) => {
            cornersLayer.appendChild(
                createSvgEl("circle", {
                    cx: c.x,
                    cy: -c.y,
                    r: "3.5",
                    fill: "#ffffff",
                    stroke: "#1f6b24",
                    "stroke-width": "1.6",
                }),
            );
        });

        if (probeLayer && state.probePoint) {
            const p = state.probePoint;
            const val = interpolateTempIdw(parcel, p.x, p.y);
            probeLayer.appendChild(
                createSvgEl("circle", {
                    cx: p.x,
                    cy: -p.y,
                    r: "4.5",
                    fill: "#0f172a",
                    stroke: "#ffffff",
                    "stroke-width": "1.5",
                }),
            );
            const pLabel = createSvgEl("text", {
                x: p.x + 8,
                y: -p.y - 6,
                fill: "#0f172a",
                "font-size": "9",
                "font-weight": "700",
            });
            pLabel.textContent = `Sonda IDW: ${val.toFixed(1)}°C`;
            probeLayer.appendChild(pLabel);
        }

        sensorsLayer.style.display = state.showSensors ? "inline" : "none";
        if (!state.showSensors) return;

        parcel.sensors.forEach((s) => {
            const info = classifyTemp(s.temp);
            const g = createSvgEl("g", {
                class: `sensor-node${s.id === state.selectedSensorId ? " active" : ""}`,
            });

            g.appendChild(
                createSvgEl("circle", {
                    cx: s.x,
                    cy: -s.y,
                    r: "12",
                    fill: info.color,
                    "fill-opacity": "0.28",
                }),
            );
            g.appendChild(
                createSvgEl("circle", {
                    class: "sensor-ring",
                    cx: s.x,
                    cy: -s.y,
                    r: "5.5",
                    fill: info.color,
                    stroke: "#ffffff",
                    "stroke-width": "1.8",
                }),
            );
            const label = createSvgEl("text", {
                x: s.x + 9,
                y: -s.y + 3,
                fill: "#181818",
                "font-size": "9.5",
                "font-weight": "700",
            });
            label.textContent = `${s.id} (${s.temp.toFixed(1)}°C)`;
            g.appendChild(label);

            g.addEventListener("click", (e) => {
                e.stopPropagation();
                state.selectedSensorId = s.id;
                renderAll();
            });
            sensorsLayer.appendChild(g);
        });
    }

    function renderSidebar(parcel) {
        const switchListEl = document.getElementById("parcelSwitchList");
        if (switchListEl) {
            switchListEl.innerHTML = parcels
                .map((p) => {
                    const active = p.fieldId === parcel.fieldId;
                    return `
                        <button type="button" class="parcel-pick-btn ${active ? "is-selected" : ""}"
                            data-switch-field="${p.fieldId}">
                            <strong>#${p.fieldId} ${p.name}</strong> (${p.teryt})
                        </button>
                    `;
                })
                .join("");

            switchListEl
                .querySelectorAll("[data-switch-field]")
                .forEach((btn) => {
                    btn.addEventListener("click", () => {
                        state.selectedFieldId = Number(btn.dataset.switchField);
                        state.selectedSensorId = null;
                        state.probePoint = null;
                        const nextUrl = new URL(window.location.href);
                        nextUrl.searchParams.set(
                            "id",
                            String(state.selectedFieldId),
                        );
                        window.history.replaceState({}, "", nextUrl);
                        fitView();
                        renderAll();
                    });
                });
        }

        const sensorListEl = document.getElementById("sensorListContainer");
        if (sensorListEl) {
            const activeId = state.selectedSensorId || parcel.sensors[0]?.id;
            sensorListEl.innerHTML = parcel.sensors
                .map((s) => {
                    const st = classifyTemp(s.temp);
                    const isSel = s.id === activeId;
                    return `
                        <button type="button" class="parcel-pick-btn ${isSel ? "is-selected" : ""}"
                            data-pick-sensor="${s.id}">
                            <strong>${s.id}</strong> – ${s.name}<br/>
                            Odczyt: <strong>${s.temp.toFixed(1)} °C</strong> (${st.label})
                        </button>
                    `;
                })
                .join("");

            sensorListEl
                .querySelectorAll("[data-pick-sensor]")
                .forEach((btn) => {
                    btn.addEventListener("click", () => {
                        state.selectedSensorId = btn.dataset.pickSensor;
                        renderAll();
                    });
                });
        }

        document.getElementById("infoFieldName").textContent =
            `${parcel.name} (${parcel.teryt})`;
        document.getElementById("infoCoords").textContent =
            `${parcel.lat.toFixed(6)}, ${parcel.lon.toFixed(6)}`;
        document.getElementById("infoSensorsCount").textContent =
            `${parcel.sensors.length} termometry`;

        const vals = parcel.sensors.map((s) => s.temp);
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        document.getElementById("infoMetricSummary").textContent =
            `${avg.toFixed(1)}°C (zakres: ${Math.min(...vals).toFixed(1)}–${Math.max(...vals).toFixed(1)}°C)`;

        const detailsEl = document.getElementById("sensorDetails");
        const activeSensor =
            parcel.sensors.find((s) => s.id === state.selectedSensorId) ||
            parcel.sensors[0];
        if (detailsEl && activeSensor) {
            const st = classifyTemp(activeSensor.temp);
            detailsEl.className = "";
            detailsEl.innerHTML = `
                <dl class="meta-list">
                    <div><dt>Czujka:</dt><dd>${activeSensor.id} – ${activeSensor.name}</dd></div>
                    <div><dt>Temperatura:</dt><dd>${activeSensor.temp.toFixed(1)} °C</dd></div>
                    <div><dt>Status:</dt><dd><span class="state-pill" style="background:${st.color}20;color:${st.color}">${st.label}</span></dd></div>
                    <div><dt>Pozycja na polu:</dt><dd>${activeSensor.x} m, ${activeSensor.y} m</dd></div>
                    <div><dt>Pozycja norm. [0..1]:</dt><dd>${activeSensor.nx}, ${activeSensor.ny}</dd></div>
                </dl>
            `;
        }

        const probeEl = document.getElementById("probeDetails");
        if (probeEl) {
            if (!state.probePoint) {
                probeEl.className = "details-empty";
                probeEl.textContent =
                    "Kliknij dowolny punkt wewnątrz zielonego obrysu działki, aby sprawdzić temperaturę wyliczoną metodą IDW.";
            } else {
                const tempVal = interpolateTempIdw(
                    parcel,
                    state.probePoint.x,
                    state.probePoint.y,
                );
                const st = classifyTemp(tempVal);
                probeEl.className = "";
                probeEl.innerHTML = `
                    <dl class="meta-list">
                        <div><dt>Współrzędne punktu:</dt><dd>${state.probePoint.x.toFixed(1)} m, ${state.probePoint.y.toFixed(1)} m</dd></div>
                        <div><dt>Temperatura IDW:</dt><dd>${tempVal.toFixed(2)} °C</dd></div>
                        <div><dt>Ocena strefy:</dt><dd><span class="state-pill" style="background:${st.color}20;color:${st.color}">${st.label}</span></dd></div>
                    </dl>
                `;
            }
        }
    }

    function applyTransform() {
        document
            .getElementById("viewportLayer")
            ?.setAttribute(
                "transform",
                `translate(${state.view.offsetX}, ${state.view.offsetY}) scale(${state.view.scale})`,
            );
    }

    function fitView() {
        const parcel = getCurrentParcel();
        const svg = document.getElementById("fieldSvg");
        if (!parcel || !svg) return;
        const rect = svg.getBoundingClientRect();
        const svgW = rect.width || 760;
        const svgH = rect.height || 580;
        const xs = parcel.corners.map((c) => c.x);
        const ys = parcel.corners.map((c) => c.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const scale = Math.max(
            0.4,
            Math.min(
                (svgW - 180) / (maxX - minX || 1),
                (svgH - 180) / (maxY - minY || 1),
                4,
            ),
        );
        state.view.scale = scale;
        state.view.offsetX = svgW / 2 - ((minX + maxX) / 2) * scale;
        state.view.offsetY = svgH / 2 - -((minY + maxY) / 2) * scale;
        applyTransform();
    }

    function renderAll() {
        const select = document.getElementById("fieldSelect");
        if (select) {
            select.innerHTML = parcels
                .map(
                    (p) =>
                        `<option value="${p.fieldId}" ${p.fieldId === state.selectedFieldId ? "selected" : ""}>Działka #${p.fieldId} – ${p.name}</option>`,
                )
                .join("");
        }

        const grad = document.getElementById("legendGradient");
        if (grad) {
            const stops = TEMP_STOPS.map(
                (s) => `rgb(${s.r}, ${s.g}, ${s.b}) ${Math.round(s.t * 100)}%`,
            ).join(", ");
            grad.style.background = `linear-gradient(90deg, ${stops})`;
        }

        const parcel = getCurrentParcel();
        renderOverlay(parcel);
        renderParcelSvg(parcel);
        renderSidebar(parcel);
    }

    function bindEvents() {
        document
            .getElementById("fieldSelect")
            ?.addEventListener("change", (e) => {
                state.selectedFieldId = Number(e.target.value);
                state.selectedSensorId = null;
                state.probePoint = null;
                const nextUrl = new URL(window.location.href);
                nextUrl.searchParams.set("id", String(state.selectedFieldId));
                window.history.replaceState({}, "", nextUrl);
                fitView();
                renderAll();
            });

        document
            .querySelectorAll("#oniOverlayBar [data-overlay-mode]")
            .forEach((btn) => {
                btn.addEventListener("click", () => {
                    state.overlayMode = btn.dataset.overlayMode;
                    document
                        .querySelectorAll("#oniOverlayBar [data-overlay-mode]")
                        .forEach((b) => {
                            b.classList.toggle("is-active", b === btn);
                        });
                    renderAll();
                });
            });

        document
            .getElementById("toggleSensors")
            ?.addEventListener("change", (e) => {
                state.showSensors = e.target.checked;
                renderAll();
            });

        document.getElementById("btnZoomIn")?.addEventListener("click", () => {
            state.view.scale = Math.min(state.view.scale * 1.2, 6);
            applyTransform();
        });

        document.getElementById("btnZoomOut")?.addEventListener("click", () => {
            state.view.scale = Math.max(state.view.scale / 1.2, 0.25);
            applyTransform();
        });

        document
            .getElementById("btnFitView")
            ?.addEventListener("click", fitView);

        const svg = document.getElementById("fieldSvg");
        if (!svg) return;

        svg.addEventListener("mousemove", (e) => {
            const pt = screenToWorld(e.clientX, e.clientY);
            const coordsEl = document.getElementById("cursorCoords");
            if (coordsEl) {
                coordsEl.textContent = `X: ${pt.x.toFixed(1)} m | Y: ${pt.y.toFixed(1)} m`;
            }

            if (!state.view.isPanning) return;
            const dx = e.clientX - state.view.panStartX;
            const dy = e.clientY - state.view.panStartY;
            if (Math.hypot(dx, dy) > 4) state.view.movedDuringDrag = true;
            state.view.offsetX += dx;
            state.view.offsetY += dy;
            state.view.panStartX = e.clientX;
            state.view.panStartY = e.clientY;
            applyTransform();
        });

        svg.addEventListener("mousedown", (e) => {
            if (e.button !== 0) return;
            state.view.isPanning = true;
            state.view.movedDuringDrag = false;
            state.view.panStartX = e.clientX;
            state.view.panStartY = e.clientY;
            svg.classList.add("is-panning");
        });

        window.addEventListener("mouseup", () => {
            if (state.view.isPanning) {
                state.view.isPanning = false;
                svg.classList.remove("is-panning");
            }
        });

        svg.addEventListener(
            "wheel",
            (e) => {
                e.preventDefault();
                const rect = svg.getBoundingClientRect();
                const mx = e.clientX - rect.left;
                const my = e.clientY - rect.top;
                const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
                const nextScale = Math.max(
                    0.25,
                    Math.min(6, state.view.scale * factor),
                );
                const ratio = nextScale / state.view.scale;
                state.view.offsetX = mx - (mx - state.view.offsetX) * ratio;
                state.view.offsetY = my - (my - state.view.offsetY) * ratio;
                state.view.scale = nextScale;
                applyTransform();
            },
            { passive: false },
        );

        svg.addEventListener("click", (e) => {
            if (state.view.movedDuringDrag) return;
            const parcel = getCurrentParcel();
            const pt = screenToWorld(e.clientX, e.clientY);
            if (isPointInPolygon(pt, parcel.corners)) {
                state.probePoint = {
                    x: Number(pt.x.toFixed(1)),
                    y: Number(pt.y.toFixed(1)),
                };
                renderAll();
            }
        });
    }

    function init() {
        const params = new URLSearchParams(window.location.search);
        const idFromUrl = Number(params.get("id"));
        if (idFromUrl && parcels.some((p) => p.fieldId === idFromUrl)) {
            state.selectedFieldId = idFromUrl;
        }

        bindEvents();
        fitView();
        renderAll();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
