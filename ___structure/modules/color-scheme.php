<!-- Color scheme setter has to load ASAP to prevent flash of wrong scheme -->
<script>
    decodeURIComponent(document.cookie)
    .split(";")
    .forEach((cookie) => {
        cookie = cookie.trim();
        if (cookie.startsWith("color-scheme")) {
            document.documentElement.setAttribute(
                "data-color-scheme",
                cookie.split("=")[1]
            );
        }
        if (cookie.startsWith("theme")) {
            document.documentElement.setAttribute(
                "data-theme",
                cookie.split("=")[1]
            );
        }
    });
</script>