/**
 * Student Rental House Management System
 * Client-side interactivity: navigation, filtering, pagination, toasts, form saving
 */

// ═══ LOGIN VALIDATION ═══

function doLogin() {
    var u = document.getElementById('login-username');
    var p = document.getElementById('login-password');
    var err = document.getElementById('login-error');
    var user = u ? u.value.trim() : '', pass = p ? p.value : '';

    if (user === 'admin' && pass === 'admin123') {
        if (err) err.style.display = 'none';
        updateSidebar('Admin User', 'Administrator', 'AD');
        switchPageByName('dashboard');
        showToast('Welcome back, Admin!', 'success'); return;
    }
    if (user === 'staff' && pass === 'staff123') {
        if (err) err.style.display = 'none';
        updateSidebar('Staff User', 'Staff', 'ST');
        switchPageByName('dashboard');
        showToast('Welcome back, Staff!', 'success'); return;
    }
    if (err) { err.textContent = '✗ Invalid username or password.'; err.style.display = 'block'; }
    if (u) { u.style.borderColor = '#dc2626'; setTimeout(function(){u.style.borderColor='';},1500); }
    if (p) { p.style.borderColor = '#dc2626'; setTimeout(function(){p.style.borderColor='';},1500); }
}

function updateSidebar(name, role, avatar) {
    var names = document.querySelectorAll('#sidebar-username');
    var roles = document.querySelectorAll('#sidebar-role');
    names.forEach(function(el) { el.textContent = name; });
    roles.forEach(function(el) { el.textContent = role; });
}

// ═══ DASHBOARD STATS ═══

function updateDashboardStats() {
    // Count houses
    var houseRows = document.querySelectorAll('#page-house table tbody tr');
    var totalHouses = houseRows.length;
    var occupied = 0, vacant = 0, maint = 0, totalRent = 0, occupiedRent = 0;
    houseRows.forEach(function(r) {
        var badge = r.querySelector('.badge');
        var priceCell = r.querySelectorAll('td')[3];
        var price = priceCell ? parseFloat(priceCell.textContent.replace('RM','').trim()) : 0;
        totalRent += price;
        if (badge) {
            var st = badge.textContent.trim();
            if (st === 'Occupied') { occupied++; occupiedRent += price; }
            else if (st === 'Available') vacant++;
            else if (st === 'Maintenance' || st === 'Under Maintenance') maint++;
        }
    });

    // Count tenants
    var tenantCount = document.querySelectorAll('#page-tenant table tbody tr').length;

    // Count open complaints (Pending + In Progress)
    var complaintRows = document.querySelectorAll('#page-complaint table tbody tr');
    var openComplaints = 0;
    complaintRows.forEach(function(r) {
        var badge = r.querySelector('.badge');
        if (badge && (badge.textContent.trim() === 'Pending' || badge.textContent.trim() === 'In Progress')) openComplaints++;
    });

    // Update stat cards
    var stats = document.querySelectorAll('#page-dashboard .stat-value');
    if (stats[0]) stats[0].textContent = totalHouses;
    if (stats[1]) stats[1].textContent = tenantCount;
    if (stats[2]) stats[2].textContent = openComplaints;
    if (stats[3]) stats[3].textContent = vacant;

    // Update occupancy overview
    var occBar = document.querySelector('#page-dashboard .card-body [style*="flex-direction:column"]');
    if (occBar && totalHouses > 0) {
        var rows2 = occBar.querySelectorAll('[style*="display:flex;justify-content:space-between"]');
        if (rows2[0]) rows2[0].querySelectorAll('span')[1].textContent = occupied + ' / ' + totalHouses;
        if (rows2[1]) rows2[1].querySelectorAll('span')[1].textContent = vacant + ' / ' + totalHouses;
        if (rows2[2]) rows2[2].querySelectorAll('span')[1].textContent = maint + ' / ' + totalHouses;
        var bars = occBar.querySelectorAll('[style*="border-radius:20px"][style*="height:10px"] [style*="width:"]');
        if (bars[0]) bars[0].style.width = (occupied/totalHouses*100) + '%';
        if (bars[1]) bars[1].style.width = (vacant/totalHouses*100) + '%';
        if (bars[2]) bars[2].style.width = (maint/totalHouses*100) + '%';
    }

    // Update occupancy rate / revenue
    var occStats = document.querySelectorAll('#page-dashboard .card-body [style*="text-align:center"] [style*="font-family:\\\'Syne\\\'"]');
    if (occStats[0]) occStats[0].textContent = totalHouses > 0 ? Math.round(occupied/totalHouses*100) + '%' : '0%';
    if (occStats[1]) occStats[1].textContent = 'RM ' + occupiedRent.toLocaleString();
    if (occStats[2]) occStats[2].textContent = occupied > 0 ? 'RM ' + Math.round(occupiedRent/occupied).toLocaleString() : 'RM 0';
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
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var page = document.getElementById('page-' + name);
    if (page) page.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══ TOAST ═══

function showToast(msg, type) {
    type = type || 'info';
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function() { toast.classList.add('show'); });
    setTimeout(function() { toast.classList.remove('show'); setTimeout(function() { toast.remove(); }, 300); }, 2500);
}

// ═══ HELPERS ═══

function getVisibleRows(table) {
    var rows = table.querySelectorAll('tbody tr'), visible = [];
    for (var i = 0; i < rows.length; i++) if (rows[i].style.display !== 'none') visible.push(rows[i]);
    return visible;
}
function updateFooter(table) {
    var total = table.querySelectorAll('tbody tr').length, shown = getVisibleRows(table).length;
    var footer = table.closest('.card').querySelector('.table-info');
    if (footer) footer.textContent = 'Showing 1 - ' + shown + ' of ' + total + ' records';
}

// ═══ FILTER ═══

// Button-style filters (complaint page)
document.addEventListener('click', function(e) {
    var btn = e.target.closest('.filter-btn'); if (!btn) return;
    var bar = btn.closest('.filter-bar'); if (!bar) return;
    bar.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    applyFilter(bar);
});

// Dropdown filters (house/tenant pages)
document.addEventListener('change', function(e) {
    var sel = e.target.closest('.filter-bar select'); if (!sel) return;
    applyFilter(sel.closest('.filter-bar'));
});

function applyFilter(bar) {
    var table = bar.closest('.card').querySelector('table'); if (!table) return;
    var btnActive = bar.querySelector('.filter-btn.active');
    var sel = bar.querySelector('select');
    var filter = btnActive ? btnActive.textContent.trim() : (sel ? sel.value : '');
    if (!filter || filter === 'All Status' || filter === 'All Houses') filter = '';

    table.querySelectorAll('tbody tr').forEach(function(row) {
        if (!filter) { row.style.display = ''; return; }
        var badge = row.querySelector('.badge');
        row.style.display = (badge && badge.textContent.trim() === filter) ? '' : 'none';
    });
    updateFooter(table);
}

// ═══ SEARCH ═══

document.addEventListener('input', function(e) {
    var input = e.target.closest('.search-input'); if (!input) return;
    var table = input.closest('.card').querySelector('table'); if (!table) return;
    var q = input.value.toLowerCase().trim();
    table.querySelectorAll('tbody tr').forEach(function(row) {
        row.style.display = (!q || row.textContent.toLowerCase().indexOf(q) >= 0) ? '' : 'none';
    });
    updateFooter(table);
});

// ═══ PAGINATION ═══

document.addEventListener('click', function(e) {
    var pg = e.target.closest('.pg-btn'); if (!pg) return;
    var pag = pg.closest('.pagination'); if (!pag) return;

    var text = pg.textContent.trim();
    if (!text) {
        // Arrow button — find current page and navigate
        var btns = Array.from(pag.querySelectorAll('.pg-btn')).filter(function(b) { return b.textContent.trim(); });
        var active = pag.querySelector('.pg-btn.active');
        var idx = btns.indexOf(active);
        if (idx < 0) idx = 0;

        // < arrow: points="15 18 9 12 15 6" (left-pointing)
        var svg = pg.querySelector('svg');
        var isLeft = svg && svg.innerHTML.indexOf('15 18') >= 0;
        idx = isLeft ? Math.max(0, idx - 1) : Math.min(btns.length - 1, idx + 1);
        btns[idx].click();
        return;
    }

    // Number button
    if (pg.classList.contains('active')) return;
    pag.querySelectorAll('.pg-btn').forEach(function(b){b.classList.remove('active');});
    pg.classList.add('active');
    var table = pag.closest('.card').querySelector('table'); if (!table) return;
    var pageNum = parseInt(text) || 1, perPage = 5;
    var allRows = Array.from(table.querySelectorAll('tbody tr'));
    var start = (pageNum-1)*perPage, end = start+perPage;
    allRows.forEach(function(r,i) { r.style.display = (i >= start && i < end) ? '' : 'none'; });
    updateFooter(table);
});

// ═══ PASSWORD TOGGLE ═══

document.addEventListener('click', function(e) {
    var tg = e.target.closest('.pw-toggle'); if (!tg) return;
    var pw = document.getElementById('login-password'); if (!pw) return;
    if (pw.type === 'password') {
        pw.type = 'text';
        tg.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9333ea" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    } else {
        pw.type = 'password';
        tg.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
    }
});

// ═══ TABLE ACTION BUTTONS (Edit/Delete/Resolve) ═══

document.addEventListener('click', function(e) {
    var btn = e.target.closest('button'); if (!btn) return;
    if (btn.closest('.topbar') || btn.closest('.login-outer') || btn.closest('.sidebar') ||
        btn.closest('.quick-links') || btn.closest('.form-actions')) return;
    var text = btn.textContent.trim();

    if (text === 'Edit') {
        var row = btn.closest('tr'); if (!row) return;
        var idEl = row.querySelector('.id-label'); if (!idEl) return;
        var id = idEl.textContent.trim();
        var cells = row.querySelectorAll('td');

        // Scroll to form on current page
        var page = row.closest('[id^="page-"]');
        if (page) {
            var formCard = page.querySelector('.card[id$="-form-card"]') || page.querySelector('.card');
            if (formCard) {
                formCard.scrollIntoView({ behavior: 'smooth' });
                formCard.setAttribute('data-editing-id', id);
                // Change form badge
                var badge = formCard.querySelector('.badge');
                if (badge) { badge.textContent = 'Editing'; badge.className = 'badge badge-yellow'; }
            }
        }

        if (id.charAt(0) === 'H') {
            // House: cells[1]=id, [2]=location, [3]=price, [4]=rooms, [5]=status badge
            var loc = document.getElementById('house-location');
            var pr = document.getElementById('house-price');
            var rm = document.getElementById('house-rooms');
            var st = document.getElementById('house-status');
            if (loc) loc.value = (cells[2] && cells[2].textContent.trim()) || '';
            if (pr) pr.value = (cells[3] && cells[3].textContent.replace(/[^0-9]/g,'')) || '';
            if (rm) rm.value = (cells[4] && cells[4].textContent.trim()) || '';
            if (st) {
                var stText = (cells[5] && cells[5].querySelector('.badge')) ? cells[5].querySelector('.badge').textContent.trim() : '';
                for (var i=0; i<st.options.length; i++) if (st.options[i].text === stText) { st.selectedIndex = i; break; }
            }
        } else if (id.charAt(0) === 'T') {
            var name = document.getElementById('tenant-name'), ph = document.getElementById('tenant-phone'),
                mat = document.getElementById('tenant-matric'), hse = document.getElementById('tenant-house'),
                dt = document.getElementById('tenant-date');
            if (name) name.value = (cells[2] && cells[2].textContent.trim()) || '';
            if (ph) ph.value = (cells[3] && cells[3].textContent.trim()) || '';
            if (mat) mat.value = (cells[4] && cells[4].textContent.trim()) || '';
            if (hse) { for (var j=0; j<hse.options.length; j++) if (hse.options[j].text.indexOf('H-')===0) { hse.selectedIndex = j; break; } }
            if (dt) dt.value = '';
        } else if (id.charAt(0) === 'C') {
            var desc = document.getElementById('complaint-desc'), ten = document.getElementById('complaint-tenant'),
                cst = document.getElementById('complaint-status'), cdt = document.getElementById('complaint-date');
            if (desc) desc.value = (cells[2] && cells[2].querySelector('div')) ? cells[2].querySelector('div').textContent.trim() : '';
            if (cdt) cdt.value = '';
            if (cst) {
                var st2 = (cells[5] && cells[5].querySelector('.badge')) ? cells[5].querySelector('.badge').textContent.trim() : '';
                for (var k=0; k<cst.options.length; k++) if (cst.options[k].text === st2) { cst.selectedIndex = k; break; }
            }
        }
        showToast(id + ' — edit mode', 'warning');
    } else if (text === 'Delete') {
        var row = btn.closest('tr'), idEl = row ? row.querySelector('.id-label') : null;
        if (confirm(idEl ? 'Delete ' + idEl.textContent.trim() + '?' : 'Delete record?')) {
            if (row) {
                row.style.opacity = '0'; row.style.transition = 'opacity 0.3s';
                setTimeout(function() { row.remove(); updateFooter(row.closest('table')); updateDashboardStats(); }, 300);
            }
            showToast(idEl ? idEl.textContent.trim() + ' deleted' : 'Deleted', 'error');
        }
    } else if (text === 'Resolve') {
        var r3 = btn.closest('tr'), badge = r3 ? r3.querySelector('.badge') : null;
        if (badge) { badge.textContent = 'Resolved'; badge.className = 'badge badge-green'; }
        showToast('Resolved', 'success');
    } else if (text === 'View') { showToast('View details — coming soon', 'info'); }
});

// ═══ FORM SAVING ═══

document.addEventListener('click', function(e) {
    var btn = e.target.closest('button'); if (!btn) return;
    var text = btn.textContent.trim();

    if (text === 'Save House') {
        e.preventDefault();
        var loc = document.getElementById('house-location'), pr = document.getElementById('house-price'),
            rm = document.getElementById('house-rooms'), st = document.getElementById('house-status');
        if (!loc || !pr || !loc.value.trim() || !pr.value.trim()) { showToast('Please fill Location and Price', 'error'); return; }
        var statusVal = st ? st.value : 'Available';
        var badgeClass = statusVal === 'Available' ? 'badge-green' : statusVal === 'Occupied' ? 'badge-purple' : 'badge-yellow';

        // Check if editing existing row
        var formCard = document.getElementById('house-form-card');
        var editId = formCard ? formCard.getAttribute('data-editing-id') : null;

        if (editId) {
            // Update existing row
            var row = document.querySelector('#page-house tbody tr:has(.id-label)');
            var allRows = document.querySelectorAll('#page-house table tbody tr');
            allRows.forEach(function(r) {
                var lbl = r.querySelector('.id-label');
                if (lbl && lbl.textContent.trim() === editId) {
                    var cells = r.querySelectorAll('td');
                    cells[2].textContent = loc.value.trim();
                    cells[3].innerHTML = 'RM ' + pr.value.trim();
                    cells[3].style.cssText = 'font-weight:600;color:var(--green-700);';
                    cells[4].textContent = rm ? rm.value : '-';
                    cells[5].innerHTML = '<span class="badge ' + badgeClass + '">' + statusVal + '</span>';
                }
            });
            formCard.removeAttribute('data-editing-id');
            var badge = formCard.querySelector('.badge');
            if (badge) { badge.textContent = 'Add New'; badge.className = 'badge badge-green'; }
            showToast(editId + ' updated!', 'success');
        } else {
            // Create new row
            var table = document.querySelector('#page-house table tbody'); if (!table) return;
            var count = table.querySelectorAll('tr').length + 1;
            var id = 'H-' + String(count).padStart(3, '0');
            var newRow = table.insertRow();
            newRow.innerHTML = '<td style="color:var(--gray-400);font-size:12px;">' + count + '</td>' +
                '<td><span class="id-label">' + id + '</span></td><td>' + loc.value.trim() + '</td>' +
                '<td style="font-weight:600;color:var(--green-700);">RM ' + pr.value.trim() + '</td>' +
                '<td>' + (rm ? rm.value : '-') + '</td>' +
                '<td><span class="badge ' + badgeClass + '">' + statusVal + '</span></td>' +
                '<td><div class="actions-cell"><button class="topbar-btn btn-warning btn-sm">Edit</button><button class="topbar-btn btn-danger btn-sm">Delete</button></div></td>';
            showToast(id + ' saved!', 'success');
        }
        updateFooter(document.querySelector('#page-house table')); updateDashboardStats();
        loc.value = ''; pr.value = ''; if (rm) rm.value = '';

    } else if (text === 'Save Tenant') {
        e.preventDefault();
        var name = document.getElementById('tenant-name'), phone = document.getElementById('tenant-phone'),
            matric = document.getElementById('tenant-matric'), house = document.getElementById('tenant-house'),
            date = document.getElementById('tenant-date');
        if (!name || !phone || !name.value.trim() || !phone.value.trim()) { showToast('Please fill Name and Phone', 'error'); return; }
        var table = document.querySelector('#page-tenant table tbody'); if (!table) return;
        var count = table.querySelectorAll('tr').length + 1, id = 'T-' + String(count).padStart(3, '0');
        var dispDate = date && date.value ? new Date(date.value + 'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '-';
        var houseVal = house ? house.value : '';
        var row = table.insertRow();
        row.innerHTML = '<td style="color:var(--gray-400);font-size:12px;">' + count + '</td>' +
            '<td><span class="id-label">' + id + '</span></td>' +
            '<td style="font-weight:600;color:var(--gray-800);">' + name.value.trim() + '</td>' +
            '<td>' + phone.value.trim() + '</td>' +
            '<td style="font-size:11px;color:var(--gray-400);">' + (matric ? matric.value.trim() || '-' : '-') + '</td>' +
            '<td><span class="badge badge-purple">' + (houseVal.split('|')[0] || houseVal || '-') + '</span></td>' +
            '<td style="font-size:12px;color:var(--gray-500);">' + dispDate + '</td>' +
            '<td><div class="actions-cell"><button class="topbar-btn btn-warning btn-sm">Edit</button><button class="topbar-btn btn-danger btn-sm">Delete</button></div></td>';
        updateFooter(table); updateDashboardStats();
        showToast(id + ' saved!', 'success');
        name.value = ''; phone.value = ''; if (matric) matric.value = '';

    } else if (text === 'Submit Complaint') {
        e.preventDefault();
        var desc = document.getElementById('complaint-desc'), tenant = document.getElementById('complaint-tenant'),
            status = document.getElementById('complaint-status'), date = document.getElementById('complaint-date');
        if (!desc || !desc.value.trim()) { showToast('Please fill the description', 'error'); return; }
        var table = document.querySelector('#page-complaint table tbody'); if (!table) return;
        var count = table.querySelectorAll('tr').length + 1, id = 'C-' + String(count).padStart(3, '0');
        var tenantVal = tenant ? tenant.value : '';
        var tenantName = tenantVal.split('|')[1] ? tenantVal.split('|')[1].trim() : (tenantVal || '-');
        var tenantInfo = tenantVal.split('|')[0] ? tenantVal.split('|')[0].trim() : '';
        var dispDate = date && date.value ? new Date(date.value + 'T00:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '-';
        var stVal = status ? status.value : 'Pending';
        var stClass = stVal === 'Pending' ? 'badge-red' : stVal === 'In Progress' ? 'badge-yellow' : 'badge-green';
        var row = table.insertRow();
        row.innerHTML = '<td style="color:var(--gray-400);font-size:12px;">' + count + '</td>' +
            '<td><span class="id-label">' + id + '</span></td>' +
            '<td style="max-width:200px;"><div style="font-weight:500;color:var(--gray-800);">' + desc.value.trim() + '</div><div style="font-size:11px;color:var(--gray-400);">New submission</div></td>' +
            '<td><div style="font-weight:600;font-size:12px;color:var(--purple-700);">' + tenantName + '</div><div style="font-size:10px;color:var(--gray-400);">' + tenantInfo + '</div></td>' +
            '<td style="font-size:12px;color:var(--gray-500);">' + dispDate + '</td>' +
            '<td><span class="badge ' + stClass + '">' + stVal + '</span></td>' +
            '<td><div class="actions-cell"><button class="topbar-btn btn-green btn-sm">Resolve</button><button class="topbar-btn btn-warning btn-sm">Edit</button><button class="topbar-btn btn-danger btn-sm">Delete</button></div></td>';
        updateFooter(table); updateDashboardStats();
        showToast(id + ' submitted!', 'success');
        desc.value = '';

    } else if (text === 'Clear Form') {
        e.preventDefault();
        var fc = btn.closest('.card-body');
        if (fc) fc.querySelectorAll('input:not([disabled]), select, textarea').forEach(function(el){
            if (el.tagName === 'SELECT') el.selectedIndex = 0; else el.value = '';
        });
        showToast('Form cleared', 'info');
    }
});

// ═══ TOPBAR BUTTONS ═══

document.addEventListener('click', function(e) {
    var btn = e.target.closest('.topbar-btn'); if (!btn) return;
    var text = btn.textContent.trim();
    if (text === 'Export Report') { e.preventDefault(); showToast('Exporting report... (demo)', 'info'); }
    else if (text === '+ New Record' || text === '+ Add New House' || text === '+ Register Tenant' || text === '+ New Complaint') {
        e.preventDefault();
        var form = btn.closest('.main-content').querySelector('.card[id$="-form-card"]') || btn.closest('.main-content').querySelector('.card');
        if (form) form.scrollIntoView({ behavior: 'smooth' });
        showToast('Scroll down to add a new record', 'info');
    }
});
