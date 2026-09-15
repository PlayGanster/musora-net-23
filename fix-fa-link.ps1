$files = @('bytovoy-musor.html','demontazh.html','musor-posle-remonta.html','musor-s-dachi.html','staraya-mebel.html','stroitelniy-musor.html')

foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

    # Fix the broken Font Awesome link - missing closing quote on rel
    $broken = '<link rel="stylesheet href=https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css>'
    $fixed = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">'

    $c = $c.Replace($broken, $fixed)

    # Also handle the variant where quotes were stripped
    $broken2 = '<link rel=stylesheet href=https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css>'
    $c = $c.Replace($broken2, $fixed)

    [System.IO.File]::WriteAllText($f, $c, [System.Text.Encoding]::UTF8)
    Write-Host "Done: $f"
}
