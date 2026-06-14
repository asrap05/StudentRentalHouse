<%-- 
    500.jsp — Internal Server Error
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>500 — Server Error | Student Rental House</title>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
    <style>
        :root { --purple-600: #9333ea; --purple-700: #7e22ce; --purple-800: #6b21a8; --purple-900: #581c87; --green-500: #22c55e; --green-600: #16a34a; --gray-400: #9ca3af; --white: #ffffff; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: linear-gradient(145deg, #7e22ce 0%, #581c87 50%, #dc2626 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; color: white; text-align: center; }
        .error-wrap { max-width: 480px; padding: 48px; }
        .error-code { font-family: 'Syne', sans-serif; font-size: 120px; font-weight: 800; line-height: 1; opacity: 0.25; }
        .error-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; margin: -10px 0 12px; }
        .error-desc { font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 32px; line-height: 1.6; }
        .error-btn { display: inline-block; padding: 12px 28px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; color: white; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; transition: all 0.2s; }
        .error-btn:hover { background: rgba(255,255,255,0.25); }
    </style>
</head>
<body>
    <div class="error-wrap">
        <div class="error-code">500</div>
        <div class="error-title">Internal Server Error</div>
        <p class="error-desc">Something went wrong on the server. Our team has been notified. Please try again later.</p>
        <a href="../index.jsp" class="error-btn">&larr; Back to Dashboard</a>
    </div>
</body>
</html>
