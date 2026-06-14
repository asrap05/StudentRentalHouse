/**
 * Student Rental House Management System
 * Client-side page switching for SPA navigation.
 */

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

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var group = this.closest('.filter-bar');
            if (group) {
                group.querySelectorAll('.filter-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
            }
            this.classList.add('active');
        });
    });
});
