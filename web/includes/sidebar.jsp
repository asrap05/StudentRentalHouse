<%-- 
    sidebar.jsp — Shared sidebar (used by dashboard, house, tenant, complaint pages)
    Active link is set via `activePage` request attribute 
--%>
<%
    String active = (String) request.getAttribute("activePage");
    if (active == null) active = "dashboard";
%>
<aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
        <div class="sidebar-logo-mark">
            <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/></svg>
        </div>
        <div class="sidebar-logo-title">Rental House<br/>Management</div>
        <div class="sidebar-logo-sub">University Project v1.0</div>
    </div>

    <!-- Main Menu -->
    <div class="sidebar-section-label">Main Menu</div>
    <div class="sidebar-link <%= "dashboard".equals(active) ? "active" : "" %>" onclick="switchPageByName('dashboard')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Dashboard
    </div>

    <!-- Modules -->
    <div class="sidebar-section-label">Modules</div>
    <div class="sidebar-link <%= "house".equals(active) ? "active" : "" %>" onclick="switchPageByName('house')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z"/></svg>
        House Management
    </div>
    <div class="sidebar-link <%= "tenant".equals(active) ? "active" : "" %>" onclick="switchPageByName('tenant')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7 7 0 0113 0"/></svg>
        Tenant Management
    </div>
    <div class="sidebar-link <%= "complaint".equals(active) ? "active" : "" %>" onclick="switchPageByName('complaint')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        Complaint Management
    </div>

    <!-- System -->
    <div class="sidebar-section-label">System</div>
    <div class="sidebar-link <%= "settings".equals(active) ? "active" : "" %>" onclick="switchPageByName('settings')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        Settings
    </div>
    <div class="sidebar-link" onclick="switchPageByName('login')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Logout
    </div>

    <!-- User Info -->
    <div class="sidebar-bottom">
        <div class="sidebar-user">
            <div class="sidebar-avatar" id="sidebar-avatar">AD</div>
            <div>
                <div class="sidebar-user-name" id="sidebar-name">Admin User</div>
                <div class="sidebar-user-role" id="sidebar-role">Administrator</div>
            </div>
        </div>
    </div>
</aside>
