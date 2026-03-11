document.addEventListener("DOMContentLoaded", function () {
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var revealNodes = document.querySelectorAll("[data-reveal]");
    if (revealNodes.length && !reducedMotion) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealNodes.forEach(function (node) {
            observer.observe(node);
        });
    } else {
        revealNodes.forEach(function (node) {
            node.classList.add("revealed");
        });
    }

    var toggleBtn = document.querySelector("[data-toggle-nav]");
    var navLinks = document.querySelector("[data-nav-links]");

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener("click", function () {
            navLinks.classList.toggle("open");
            toggleBtn.classList.toggle("open");
        });
    }

    var openPanelBtn = document.querySelector("[data-open-panel]");
    var closePanelBtn = document.querySelector("[data-close-panel]");
    var panel = document.querySelector("[data-panel]");
    var firstField = panel ? panel.querySelector("input, select, textarea, button") : null;

    function closePanel() {
        panel.classList.remove("show");
        document.body.classList.remove("modal-open");
    }

    if (openPanelBtn && closePanelBtn && panel) {
        openPanelBtn.addEventListener("click", function () {
            panel.classList.add("show");
            document.body.classList.add("modal-open");
            if (firstField) {
                window.setTimeout(function () {
                    firstField.focus();
                }, 120);
            }
        });

        closePanelBtn.addEventListener("click", function () {
            closePanel();
        });

        panel.addEventListener("click", function (event) {
            if (event.target === panel) {
                closePanel();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && panel.classList.contains("show")) {
                closePanel();
            }
        });
    }

    document.querySelectorAll("a[data-confirm]").forEach(function (link) {
        link.addEventListener("click", function (event) {
            var msg = link.getAttribute("data-confirm") || "Are you sure?";
            if (!window.confirm(msg)) {
                event.preventDefault();
            } else {
                var toastMsg = link.getAttribute("data-toast-success");
                if (toastMsg) {
                    localStorage.setItem("app.pendingToast", toastMsg);
                }
            }
        });
    });

    document.querySelectorAll("form[data-confirm]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            var msg = form.getAttribute("data-confirm") || "Are you sure?";
            if (!window.confirm(msg)) {
                event.preventDefault();
                event.stopImmediatePropagation();
                return;
            }

            var toastMsg = form.getAttribute("data-toast-success");
            if (toastMsg) {
                localStorage.setItem("app.pendingToast", toastMsg);
            }
        });
    });

    document.querySelectorAll("input[type='date'][data-default-today]").forEach(function (input) {
        if (!input.value) {
            var now = new Date();
            var month = String(now.getMonth() + 1).padStart(2, "0");
            var day = String(now.getDate()).padStart(2, "0");
            input.value = now.getFullYear() + "-" + month + "-" + day;
        }
    });

    var toastContainer = document.createElement("div");
    toastContainer.className = "toast-stack";
    document.body.appendChild(toastContainer);

    function showToast(message, type) {
        if (!message) {
            return;
        }

        var toast = document.createElement("div");
        toast.className = "toast " + (type || "success");
        toast.textContent = message;
        toastContainer.appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.add("show");
        });

        window.setTimeout(function () {
            toast.classList.remove("show");
            window.setTimeout(function () {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 260);
        }, 2800);
    }

    var queuedToast = localStorage.getItem("app.pendingToast");
    if (queuedToast) {
        showToast(queuedToast, "success");
        localStorage.removeItem("app.pendingToast");
    }

    document.querySelectorAll("form[data-toast-success]").forEach(function (form) {
        form.addEventListener("submit", function () {
            if (form.hasAttribute("data-confirm")) {
                return;
            }
            localStorage.setItem("app.pendingToast", form.getAttribute("data-toast-success"));
        });
    });

    function normalizeValue(value, type) {
        var normalized = String(value || "").trim();
        if (type === "number") {
            return parseFloat(normalized.replace(/,/g, "")) || 0;
        }

        if (type === "date") {
            var parsed = Date.parse(normalized);
            return isNaN(parsed) ? 0 : parsed;
        }

        return normalized.toLowerCase();
    }

    document.querySelectorAll("[data-table-search]").forEach(function (searchInput) {
        var selector = searchInput.getAttribute("data-table-search");
        var table = selector ? document.querySelector(selector) : null;
        if (!table) {
            return;
        }

        var tbody = table.querySelector("tbody");
        if (!tbody) {
            return;
        }

        var rows = Array.prototype.slice.call(tbody.querySelectorAll("tr"));

        searchInput.addEventListener("input", function () {
            var q = searchInput.value.trim().toLowerCase();
            rows.forEach(function (row) {
                if (row.classList.contains("empty-row")) {
                    return;
                }
                var text = row.textContent.toLowerCase();
                row.style.display = text.indexOf(q) > -1 ? "" : "none";
            });
        });
    });

    document.querySelectorAll("table[data-sortable='true']").forEach(function (table) {
        var headers = table.querySelectorAll("th[data-sort='true']");
        var tbody = table.querySelector("tbody");
        if (!headers.length || !tbody) {
            return;
        }

        headers.forEach(function (header) {
            header.style.cursor = "pointer";
            header.setAttribute("title", "Sort");

            header.addEventListener("click", function () {
                var type = header.getAttribute("data-sort-type") || "text";
                var idx = parseInt(header.getAttribute("data-col"), 10);
                var current = header.getAttribute("data-order") || "none";
                var next = current === "asc" ? "desc" : "asc";

                headers.forEach(function (h) {
                    h.removeAttribute("data-order");
                });
                header.setAttribute("data-order", next);

                var rows = Array.prototype.slice
                    .call(tbody.querySelectorAll("tr"))
                    .filter(function (row) {
                        return !row.classList.contains("empty-row");
                    });

                rows.sort(function (a, b) {
                    var aText = a.children[idx] ? a.children[idx].textContent : "";
                    var bText = b.children[idx] ? b.children[idx].textContent : "";
                    var av = normalizeValue(aText, type);
                    var bv = normalizeValue(bText, type);

                    if (av < bv) {
                        return next === "asc" ? -1 : 1;
                    }
                    if (av > bv) {
                        return next === "asc" ? 1 : -1;
                    }
                    return 0;
                });

                rows.forEach(function (row) {
                    tbody.appendChild(row);
                });
            });
        });
    });
});
