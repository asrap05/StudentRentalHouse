/**
 * Student Rental House Management System
 * Client-side interactivity: navigation, filtering, pagination, toasts
 */

// ═══════════════════════════════════════
// PAGE NAVIGATION
// ═══════════════════════════════════════

function switchPage(name, tabEl) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    var page = document.getElementById('page-' + name);
    if (page) page.classList.add('active');
    if (tabEl) tabEl.classList.add('active');
}

function switchPageByName(name) {
    var pages = ['login', 'dashboard', 'house', 'tenant', 'complaint'];
    var idx = pages.indexOf(name);
    var tabs = document.querySelectorAll('.nav-tab');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    var page = document.getElementById('page-' + name);
    if (page) page.classList.add('active');
    if (idx >= 0 && tabs[idx]) tabs[idx].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════

function showToast(msg, type) {
    type = type || 'info';
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = msg;
    toast.setAttribute('role', 'alert');
    document.body.appendChild(toast);
    requestAnimationFrame(function() { toast.classList.add('show'); });
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() { toast.remove(); }, 300);
    }, 2500);
}

// ═══════════════════════════════════════
// FILTER BUTTONS
// ═══════════════════════════════════════

document.addEventListener('click', function(e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;
    var bar = btn.closest('.filter-bar');
    if (!bar) return;
    bar.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var table = bar.closest('.card').querySelector('table');
    if (!table) return;
    var filter = btn.textContent.trim();
    var rows = table.querySelectorAll('tbody tr');
    rows.forEach(function(row) {
        if (filter === 'All') { row.style.display = ''; return; }
        var statusCell = row.querySelector('.badge');
        if (statusCell && statusCell.textContent.trim() === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    updatePagination(table);
});

// ═══════════════════════════════════════
// SEARCH INPUTS
// ═══════════════════════════════════════

document.addEventListener('input', function(e) {
    var input = e.target.closest('.search-input');
    if (!input) return;
    var query = input.value.toLowerCase().trim();
    var table = input.closest('.card').querySelector('table');
    if (!table) return;
    var rows = table.querySelectorAll('tbody tr');
    rows.forEach(function(row) {
        if (!query) { row.style.display = ''; return; }
        row.style.display = row.textContent.toLowerCase().indexOf(query) >= 0 ? '' : 'none';
    });
    updatePagination(table);
});

// ═══════════════════════════════════════
// PAGINATION
// ═══════════════════════════════════════

function updatePagination(table) {
    var visible = table.querySelectorAll('tbody tr:not([style*="display: none"])');
    var footer = table.closest('.card').querySelector('.table-info');
    var total = table.querySelectorAll('tbody tr').length;
    var shown = visible.length;
    if (footer) footer.textContent = 'Showing 1 - ' + shown + ' of ' + total + ' records';
}

document.addEventListener('click', function(e) {
    var pg = e.target.closest('.pg-btn');
    if (!pg || pg.classList.contains('active')) return;
    var pagination = pg.closest('.pagination');
    if (!pagination) return;
    pagination.querySelectorAll('.pg-btn').forEach(function(b) { b.classList.remove('active'); });
    pg.classList.add('active');

    var table = pagination.closest('.card').querySelector('table');
    if (!table) return;
    var rows = table.querySelectorAll('tbody tr:not([style*="display: none"])');
    var perPage = 5;
    var pageNum = parseInt(pg.textContent.trim()) || 1;
    var start = (pageNum - 1) * perPage;
    var end = start + perPage;
    rows.forEach(function(row, i) {
        row.style.display = (i >= start && i < end) ? '' : 'none';
    });
});

// ═══════════════════════════════════════
// TABLE ACTION BUTTONS (Edit / Delete / Resolve / View)
// ═══════════════════════════════════════

document.addEventListener('click', function(e) {
    var btn = e.target.closest('button');
    if (!btn || btn.closest('.topbar') || btn.closest('.login-outer') ||
        btn.closest('.nav-tabs-bar') || btn.closest('.sidebar') ||
        btn.closest('.quick-links') || btn.closest('.login-btn') ||
        btn.closest('.form-actions')) return;

    var text = btn.textContent.trim();
    if (text === 'Edit') {
        var row = btn.closest('tr');
        var id = row ? row.querySelector('.id-label') : null;
        showToast(id ? id.textContent.trim() + ' — Edit mode (simulated)' : 'Edit mode (simulated)', 'warning');
    } else if (text === 'Delete') {
        var row2 = btn.closest('tr');
        var id2 = row2 ? row2.querySelector('.id-label') : null;
        if (confirm(id2 ? 'Delete ' + id2.textContent.trim() + '?' : 'Delete this record?')) {
            if (row2) {
                row2.style.opacity = '0';
                row2.style.transition = 'opacity 0.3s';
                setTimeout(function() { row2.remove(); updatePagination(row2.closest('table')); }, 300);
            }
            showToast(id2 ? id2.textContent.trim() + ' deleted (simulated)' : 'Record deleted (simulated)', 'error');
        }
    } else if (text === 'Resolve') {
        var row3 = btn.closest('tr');
        if (row3) {
            var statusBadge = row3.querySelector('.badge');
            if (statusBadge) {
                statusBadge.textContent = 'Resolved';
                statusBadge.className = 'badge badge-green';
            }
        }
        showToast('Complaint resolved (simulated)', 'success');
    } else if (text === 'View') {
        showToast('Viewing record details — feature coming soon', 'info');
    }
});

// ═══════════════════════════════════════
// FORM SUBMISSION (Save House / Save Tenant / Submit Complaint)
// ═══════════════════════════════════════

document.addEventListener('click', function(e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var text = btn.textContent.trim();

    if (text === 'Save House' || text === 'Save Tenant' || text === 'Submit Complaint') {
        e.preventDefault();
        showToast('Record saved successfully! (demo mode)', 'success');
    } else if (text === 'Clear Form') {
        e.preventDefault();
        var formCard = btn.closest('.card-body');
        if (formCard) {
            formCard.querySelectorAll('input:not([disabled]), select, textarea').forEach(function(el) {
                if (el.tagName === 'SELECT') el.selectedIndex = 0;
                else el.value = '';
            });
        }
        showToast('Form cleared', 'info');
    }
});

// ═══════════════════════════════════════
// TOPBAR BUTTONS (Export / + New Record)
// ═══════════════════════════════════════

document.addEventListener('click', function(e) {
    var btn = e.target.closest('.topbar-btn');
    if (!btn) return;
    var text = btn.textContent.trim();
    if (text === 'Export Report') {
        e.preventDefault();
        showToast('Exporting report as PDF... (demo)', 'info');
    } else if (text === '+ New Record' || text === '+ Add New House' || text === '+ Register Tenant' || text === '+ New Complaint') {
        e.preventDefault();
        var pageBody = btn.closest('.main-content');
        if (pageBody) {
            var formCard = pageBody.querySelector('.card[id$="-form-card"]') || pageBody.querySelector('.card');
            if (formCard) formCard.scrollIntoView({ behavior: 'smooth' });
        }
        showToast('Scroll to form below to add a new record', 'info');
    }
});

// ═══════════════════════════════════════
// PASSWORD TOGGLE (eye icon)
// ═══════════════════════════════════════

document.addEventListener('click', function(e) {
    var icon = e.target.closest('.login-right span[style]');
    if (!icon) return;
    var pwInput = icon.parentElement.querySelector('input[type="password"], input[type="text"]');
    if (!pwInput) return;
    if (pwInput.type === 'password') {
        pwInput.type = 'text';
        icon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9333ea" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    } else {
        pwInput.type = 'password';
        icon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
    }
});

// ═══════════════════════════════════════
// SIDEBAR ACTIVE STATE (keeps sidebar in sync when switching pages via tabs)
// ═══════════════════════════════════════

var origSwitchPage = switchPage;
switchPage = function(name, tabEl) {
    origSwitchPage(name, tabEl);
    // Update sidebar active state
    document.querySelectorAll('.sidebar-link').forEach(function(link) {
        link.classList.remove('active');
    });
    var sidebarLinks = document.querySelectorAll('#page-' + name + ' .sidebar-link');
    if (sidebarLinks.length > 0) {
        // Match sidebar link by page name
        sidebarLinks.forEach(function(link) {
            var onclick = link.getAttribute('onclick') || '';
            if (onclick.indexOf("'" + name + "'") >= 0) link.classList.add('active');
        });
    }
};

var origSwitchByName = switchPageByName;
switchPageByName = function(name) {
    origSwitchByName(name);
    // Update all sidebars
    document.querySelectorAll('.sidebar-link').forEach(function(link) {
        link.classList.remove('active');
    });
    var sidebarLinks = document.querySelectorAll('#page-' + name + ' .sidebar-link');
    sidebarLinks.forEach(function(link) {
        var onclick = link.getAttribute('onclick') || '';
        if (onclick.indexOf("'" + name + "'") >= 0) link.classList.add('active');
    });
};
