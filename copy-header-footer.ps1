# Read main page header (lines 44-99, 0-indexed: 43-98)
$mainLines = Get-Content 'index.html' -Raw
$files = @('bytovoy-musor.html','demontazh.html','musor-posle-remonta.html','musor-s-dachi.html','staraya-mebel.html','stroitelniy-musor.html')

# Extract sections from main page using regex
$headerPattern = '(?s)<header class="header">.*?</header>'
$navPattern = '(?s)<nav class="nav">.*?</nav>'
$mobileOverlayPattern = '(?s)<div class="mobile-overlay".*?</div>'
$mobileMenuPattern = '(?s)<aside class="mobile-menu".*?</aside>'
$stickyCallPattern = '(?s)<div class="mobile-sticky-call">.*?</div>'
$footerPattern = '(?s)<footer class="footer">.*?</footer>'

# Get main page sections
$header = [regex]::Match($mainLines, $headerPattern).Value
$nav = [regex]::Match($mainLines, $navPattern).Value
$mobileOverlay = [regex]::Match($mainLines, $mobileOverlayPattern).Value
$mobileMenu = [regex]::Match($mainLines, $mobileMenuPattern).Value
$stickyCall = [regex]::Match($mainLines, $stickyCallPattern).Value
$footer = [regex]::Match($mainLines, $footerPattern).Value

Write-Host "Header length: $($header.Length)"
Write-Host "Nav length: $($nav.Length)"
Write-Host "Mobile overlay length: $($mobileOverlay.Length)"
Write-Host "Mobile menu length: $($mobileMenu.Length)"
Write-Host "Sticky call length: $($stickyCall.Length)"
Write-Host "Footer length: $($footer.Length)"

foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

    # Replace header
    $oldHeader = [regex]::Match($c, $headerPattern).Value
    if ($oldHeader) { $c = $c.Replace($oldHeader, $header) }

    # Replace mobile overlay
    $oldOverlay = [regex]::Match($c, $mobileOverlayPattern).Value
    if ($oldOverlay) { $c = $c.Replace($oldOverlay, $mobileOverlay) }

    # Replace mobile menu
    $oldMenu = [regex]::Match($c, $mobileMenuPattern).Value
    if ($oldMenu) { $c = $c.Replace($oldMenu, $mobileMenu) }

    # Replace footer
    $oldFooter = [regex]::Match($c, $footerPattern).Value
    if ($oldFooter) { $c = $c.Replace($oldFooter, $footer) }

    # Add mobile-sticky-call before </body> if not present
    if ($c -notmatch 'mobile-sticky-call') {
        $c = $c.Replace('</body>', "$stickyCall`n</body>")
    }

    [System.IO.File]::WriteAllText($f, $c, [System.Text.Encoding]::UTF8)
    Write-Host "Done: $f"
}
