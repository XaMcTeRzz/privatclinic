# Тест кодировки файлов
Write-Host "Проверка содержимого файла doctors.json в data:"
Get-Content -Path "c:\SiteNEWprivatna\data\doctors.json" -Encoding UTF8

Write-Host "`nПроверка содержимого файла doctors.json в /tmp/data:"
Get-Content -Path "\tmp\data\doctors.json" -Encoding UTF8