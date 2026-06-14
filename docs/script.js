/**
 * Student Rental House Management System
 * Client-side interactivity: navigation, filtering, pagination, toasts
 */

// ═══ LOGIN VALIDATION ═══

function doLogin() {
    var usernameInput = document.getElementById('login-username');
    var passwordInput = document.getElementById('login-password');
    var errorDiv = document.getElementById('login-error');

    var username = usernameInput ? usernameInput.value.trim() : '';
    var password = passwordInput ? passwordInput.value : '';

    if (username === 'admin' && password === 'admin123') {
        if (errorDiv) errorDiv.style.display = 'none';
        switchPageByName('dashboard');
        showToast('Welcome back, Admin!', 'success');
        return;
    }
    if (username === 'staff' && password === 'staff123') {
        if (errorDiv) errorDiv.style.display = 'none';
        switchPageByName('dashboard');
        showToast('Welcome back, Staff!', 'success');
        return;
    }

    if (errorDiv) {
        errorDiv.textContent = '✗ Invalid username or password.';
        errorDiv.style.display = 'block';
    }
    if (usernameInput) { usernameInput.style.borderColor = '#dc2626'; setTimeout(function() { usernameInput.style.borderColor = ''; }, 1500); }
    if (passwordInput) { passwordInput.style.borderColor = '#dc2626'; setTimeout(function() { passwordInput.style.borderColor = ''; }, 1500); }
}

// ═══ PAGE NAVIGATION ═══

function switchPage(name, tabEl) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
    var page = document.getElementById('page-' + name);
    if (page) page.classList.add('active');
    if (tabEl) tabEl.classList.add('active');
}

function switchPageByName(name) {
    var pages = ['login', 'dashboard', 'house', 'tenant', 'complaint'];
    var idx = pages.indexOf(name);
    var tabs = document.querySelectorAll('.nav-tab');
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    tabs.forEach(function(t) { t.classList.remove('active'); });
    var page = document.getElementById('page-' + name);
    if (page) page.classList.add('active');
    if (idx >= 0 && tabs[idx]) tabs[idx].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══ TOAST NOTIFICATIONS ═══

function showToast(msg, type) {
    type = type || 'info';
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function() { toast.classList.add('show'); });
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() { toast.remove(); }, 300);
    }, 2500);
}

// ═══ HELPER: get visible rows ═══

function getVisibleRows(table) {
    var rows = table.querySelectorAll('tbody tr');
    var visible = [];
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].style.display !== 'none') visible.push(rows[i]);
    }
    return visible;
}

function updateFooter(table) {
    var total = table.querySelectorAll('tbody tr').length;
    var shown = getVisibleRows(table).length;
    var footer = table.closest('.card').querySelector('.table-info');
    if (footer) footer.textContent = 'Showing 1 - ' + shown + ' of ' + total + ' records';
}

// ═══ FILTER BUTTONS ═══

document.addEventListener('click', function(e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;
    var bar = btn.closest('.filter-bar');
    if (!bar) return;
    bar.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');

    var card = bar.closest('.card');
    if (!card) return;
    var table = card.querySelector('table');
    if (!table) return;

    var filter = btn.textContent.trim();
    var rows = table.querySelectorAll('tbody tr');
    rows.forEach(function(row) {
        if (filter === 'All') { row.style.display = ''; return; }
        var badge = row.querySelector('.badge');
        if (badge && badge.textContent.trim() === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    updateFooter(table);
});

// ═══ SEARCH ═══

document.addEventListener('input', function(e) {
    var input = e.target.closest('.search-input');
    if (!input) return;
    var query = input.value.toLowerCase().trim();
    var card = input.closest('.card');
    if (!card) return;
    var table = card.querySelector('table');
    if (!table) return;
    var rows = table.querySelectorAll('tbody tr');
    rows.forEach(function(row) {
        if (!query) { row.style.display = ''; return; }
        row.style.display = row.textContent.toLowerCase().indexOf(query) >= 0 ? '' : 'none';
    });
    updateFooter(table);
});

// ═══ PAGINATION ═══

document.addEventListener('click', function(e) {
    var pg = e.target.closest('.pg-btn');
    if (!pg || pg.classList.contains('active')) return;
    var pagination = pg.closest('.pagination');
    if (!pagination) return;
    pagination.querySelectorAll('.pg-btn').forEach(function(b) { b.classList.remove('active'); });
    pg.classList.add('active');

    var card = pagination.closest('.card');
    if (!card) return;
    var table = card.querySelector('table');
    if (!table) return;

    var pageNum = parseInt(pg.textContent.trim()) || 1;
    var perPage = 5;
    var visible = getVisibleRows(table);
    // If none hidden, paginate all rows
    if (visible.length === table.querySelectorAll('tbody tr').length) {
        visible = Array.from(table.querySelectorAll('tbody tr'));
    }
    var start = (pageNum - 1) * perPage;
    var end = start + perPage;

    table.querySelectorAll('tbody tr').forEach(function(row, i) {
        var realIdx = visible.indexOf(row);
        if (realIdx >= start && realIdx < end) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    updateFooter(table);
});

// ═══ PASSWORD TOGGLE ═══

document.addEventListener('click', function(e) {
    var toggle = e.target.closest('.pw-toggle');
    if (!toggle) return;
    var pwInput = document.getElementById('login-password');
    if (!pwInput) return;
    if (pwInput.type === 'password') {
        pwInput.type = 'text';
        toggle.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9333ea" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    } else {
        pwInput.type = 'password';
        toggle.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
    }
});

// ═══ TABLE ACTION BUTTONS ═══

document.addEventListener('click', function(e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    if (btn.closest('.topbar') || btn.closest('.login-outer') ||
        btn.closest('.nav-tabs-bar') || btn.closest('.sidebar') ||
        btn.closest('.quick-links') || btn.closest('.form-actions') ||
        btn.closest('.login-btn')) return;

    var text = btn.textContent.trim();
    if (text === 'Edit') {
        var row = btn.closest('tr');
        var id = row ? row.querySelector('.id-label') : null;
        showToast(id ? id.textContent.trim() + ' — Edit mode' : 'Edit mode', 'warning');
    } else if (text === 'Delete') {
        var row2 = btn.closest('tr');
        var id2 = row2 ? row2.querySelector('.id-label') : null;
        if (confirm(id2 ? 'Delete ' + id2.textContent.trim() + '?' : 'Delete record?')) {
            if (row2) {
                row2.style.transition = 'opacity 0.3s';
                row2.style.opacity = '0';
                setTimeout(function() {
                    row2.style.display = 'none';
                    var table = row2.closest('table');
                    if (table) updateFooter(table);
                }, 300);
            }
            showToast(id2 ? id2.textContent.trim() + ' deleted' : 'Deleted', 'error');
        }
    } else if (text === 'Resolve') {
        var row3 = btn.closest('tr');
        if (row3) {
            var badge = row3.querySelector('.badge');
            if (badge) { badge.textContent = 'Resolved'; badge.className = 'badge badge-green'; }
        }
        showToast('Resolved', 'success');
    } else if (text === 'View') {
        showToast('View details — coming soon', 'info');
    }
});

// ═══ FORM BUTTONS ═══

document.addEventListener('click', function(e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var text = btn.textContent.trim();

    if (text === 'Save House') {
        e.preventDefault();
        var formCard = btn.closest('.card-body');
        if (!formCard) return;
        var inputs = formCard.querySelectorAll('input, select');
        var location = inputs[2] ? inputs[2].value.trim() : '';
        var price = inputs[3] ? inputs[3].value.trim() : '';
        var rooms = inputs[4] ? inputs[4].value.trim() : '';
        var status = inputs[1] ? inputs[1].value : 'Available';
        if (!location || !price) { showToast('Please fill Location and Price', 'error'); return; }

        var table = document.querySelector('#page-house table tbody');
        if (!table) return;
        var count = table.querySelectorAll('tr').length + 1;
        var id = 'H-' + String(count).padStart(3, '0');
        var statusBadge = status === 'Available' ? 'badge-green' : status === 'Occupied' ? 'badge-purple' : 'badge-yellow';

        var row = table.insertRow();
        row.innerHTML = '<td style="color:var(--gray-400);font-size:12px;">' + count + '</td>' +
            '<td><span class="id-label">' + id + '</span></td>' +
            '<td>' + location + '</td>' +
            '<td style="font-weight:600;color:var(--green-700);">RM ' + price + '</td>' +
            '<td>' + (rooms || '-') + '</td>' +
            '<td><span class="badge ' + statusBadge + '">' + status + '</span></td>' +
            '<td><div class="actions-cell"><button class="topbar-btn btn-warning btn-sm">Edit</button><button class="topbar-btn btn-danger btn-sm">Delete</button></div></td>';
        updateFooter(row.closest('table'));
        showToast(id + ' saved!', 'success');
        inputs[2].value = ''; inputs[3].value = ''; inputs[4].value = '';

    } else if (text === 'Save Tenant') {
        e.preventDefault();
        var card = btn.closest('.card-body');
        if (!card) return;
        var inputs = card.querySelectorAll('input, select');
        var name = inputs[1] ? inputs[1].value.trim() : '';
        var phone = inputs[2] ? inputs[2].value.trim() : '';
        var matric = inputs[3] ? inputs[3].value.trim() : '';
        var house = inputs[4] ? inputs[4].value : '';
        var date = inputs[5] ? inputs[5].value : '';
        if (!name || !phone) { showToast('Please fill Name and Phone', 'error'); return; }

        var table = document.querySelector('#page-tenant table tbody');
        if (!table) return;
        var count = table.querySelectorAll('tr').length + 1;
        var id = 'T-' + String(count).padStart(3, '0');
        var displayDate = date ? new Date(date).toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'}) : '-';

        var row = table.insertRow();
        row.innerHTML = '<td style="color:var(--gray-400);font-size:12px;">' + count + '</td>' +
            '<td><span class="id-label">' + id + '</span></td>' +
            '<td style="font-weight:600;color:var(--gray-800);">' + name + '</td>' +
            '<td>' + phone + '</td>' +
            '<td style="font-size:11px;color:var(--gray-400);">' + (matric || '-') + '</td>' +
            '<td><span class="badge badge-purple">' + (house.split('|')[0] || house || '-') + '</span></td>' +
            '<td style="font-size:12px;color:var(--gray-500);">' + displayDate + '</td>' +
            '<td><div class="actions-cell"><button class="topbar-btn btn-warning btn-sm">Edit</button><button class="topbar-btn btn-danger btn-sm">Delete</button></div></td>';
        updateFooter(row.closest('table'));
        showToast(id + ' saved!', 'success');
        inputs[1].value = ''; inputs[2].value = ''; inputs[3].value = '';

    } else if (text === 'Submit Complaint') {
        e.preventDefault();
        var card = btn.closest('.card-body');
        if (!card) return;
        var inputs = card.querySelectorAll('input, select, textarea');
        var date = inputs[1] ? inputs[1].value : '';
        var tenant = inputs[2] ? inputs[2].value : '';
        var status = inputs[3] ? inputs[3].value : 'Pending';
        var desc = inputs[4] ? inputs[4].value.trim() : '';
        if (!desc) { showToast('Please fill the description', 'error'); return; }

        var table = document.querySelector('#page-complaint table tbody');
        if (!table) return;
        var count = table.querySelectorAll('tr').length + 1;
        var id = 'C-' + String(count).padStart(3, '0');
        var tenantName = tenant.split('|')[1] ? tenant.split('|')[1].trim() : (tenant || '-');
        var tenantInfo = tenant.split('|')[0] ? tenant.split('|')[0].trim() : '';
        var displayDate = date ? new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'}) : '-';
        var statusClass = status === 'Pending' ? 'badge-red' : status === 'In Progress' ? 'badge-yellow' : 'badge-green';

        var row = table.insertRow();
        row.innerHTML = '<td style="color:var(--gray-400);font-size:12px;">' + count + '</td>' +
            '<td><span class="id-label">' + id + '</span></td>' +
            '<td style="max-width:200px;"><div style="font-weight:500;color:var(--gray-800);">' + desc + '</div><div style="font-size:11px;color:var(--gray-400);">New submission</div></td>' +
            '<td><div style="font-weight:600;font-size:12px;color:var(--purple-700);">' + tenantName + '</div><div style="font-size:10px;color:var(--gray-400);">' + tenantInfo + '</div></td>' +
            '<td style="font-size:12px;color:var(--gray-500);">' + displayDate + '</td>' +
            '<td><span class="badge ' + statusClass + '">' + status + '</span></td>' +
            '<td><div class="actions-cell"><button class="topbar-btn btn-green btn-sm">Resolve</button><button class="topbar-btn btn-warning btn-sm">Edit</button><button class="topbar-btn btn-danger btn-sm">Delete</button></div></td>';
        updateFooter(row.closest('table'));
        showToast(id + ' submitted!', 'success');
        inputs[4].value = '';

    } else if (text === 'Clear Form') {
        e.preventDefault();
        var fc = btn.closest('.card-body');
        if (fc) {
            fc.querySelectorAll('input:not([disabled]), select, textarea').forEach(function(el) {
                if (el.tagName === 'SELECT') el.selectedIndex = 0;
                else el.value = '';
            });
        }
        showToast('Form cleared', 'info');
    }
});

// ═══ TOPBAR BUTTONS ═══

document.addEventListener('click', function(e) {
    var btn = e.target.closest('.topbar-btn');
    if (!btn) return;
    var text = btn.textContent.trim();
    if (text === 'Export Report') {
        e.preventDefault();
        showToast('Exporting report... (demo)', 'info');
    } else if (text === '+ New Record' || text === '+ Add New House' || text === '+ Register Tenant' || text === '+ New Complaint') {
        e.preventDefault();
        var page = btn.closest('.main-content');
        if (page) {
            var form = page.querySelector('.card[id$="-form-card"]') || page.querySelector('.card');
            if (form) form.scrollIntoView({ behavior: 'smooth' });
        }
        showToast('Scroll down to add a new record', 'info');
    }
});
