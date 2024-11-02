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
    });
</script>