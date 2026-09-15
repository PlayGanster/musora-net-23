# Copy header, nav, mobile menu, footer from index.html to all service pages
# Logo becomes <a href="index.html"> on service pages
$main = [System.IO.File]::ReadAllText('index.html', [System.Text.Encoding]::UTF8)
$files = @('bytovoy-musor.html','demontazh.html','musor-posle-remonta.html','musor-s-dachi.html','staraya-mebel.html','stroitelniy-musor.html')

# Extract sections from main page
$header = [regex]::Match($main, '(?s)<header class="header">.*?</header>').Value
$nav = [regex]::Match($main, '(?s)<nav class="nav">.*?</nav>').Value
$mobileOverlay = [regex]::Match($main, '(?s)<div class="mobile-overlay".*?</div>').Value
$mobileMenu = [regex]::Match($main, '(?s)<aside class="mobile-menu".*?</aside>').Value
$stickyCall = [regex]::Match($main, '(?s)<div class="mobile-sticky-call">.*?</div>').Value
$footer = [regex]::Match($main, '(?s)<footer class="footer">.*?</footer>').Value

Write-Host "Header: $($header.Length) chars"
Write-Host "Nav: $($nav.Length) chars"
Write-Host "MobileMenu: $($mobileMenu.Length) chars"
Write-Host "StickyCall: $($stickyCall.Length) chars"
Write-Host "Footer: $($footer.Length) chars"

foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

    # Fix broken FA CDN link
    $c = $c.Replace('<link rel="stylesheet href=https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css>', '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">')
    $c = $c.Replace('<link rel=stylesheet href=https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css>', '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">')

    # Replace header
    $oldHeader = [regex]::Match($c, '(?s)<header class="header">.*?</header>').Value
    if ($oldHeader) { $c = $c.Replace($oldHeader, $header) }

    # Replace nav
    $oldNav = [regex]::Match($c, '(?s)<nav class="nav">.*?</nav>').Value
    if ($oldNav) { $c = $c.Replace($oldNav, $nav) }

    # Replace mobile overlay
    $oldOverlay = [regex]::Match($c, '(?s)<div class="mobile-overlay".*?</div>').Value
    if ($oldOverlay) { $c = $c.Replace($oldOverlay, $mobileOverlay) }

    # Replace mobile menu
    $oldMenu = [regex]::Match($c, '(?s)<aside class="mobile-menu".*?</aside>').Value
    if ($oldMenu) { $c = $c.Replace($oldMenu, $mobileMenu) }

    # Replace footer
    $oldFooter = [regex]::Match($c, '(?s)<footer class="footer">.*?</footer>').Value
    if ($oldFooter) { $c = $c.Replace($oldFooter, $footer) }

    # Ensure sticky call exists before </body>
    if ($c -notmatch 'mobile-sticky-call') {
        $c = $c.Replace('</body>', "`n$stickyCall`n</body>")
    }

    # Change logo div to link: <div class="logo">...</div> -> <a href="index.html" class="logo">...</a>
    # Use regex to match the full logo block and replace
    $logoPattern = '(?s)<div class="logo">\s*<img src="assets/logo\.webp" alt="Мусора Нет 23" class="logo-icon">\s*</div>'
    $logoReplace = '<a href="index.html" class="logo"><img src="assets/logo.webp" alt="Мусора Нет 23" class="logo-icon"></a>'
    $c = [regex]::Replace($c, $logoPattern, $logoReplace)

    [System.IO.File]::WriteAllText($f, $c, [System.Text.Encoding]::UTF8)
    Write-Host "Done: $f"
}
