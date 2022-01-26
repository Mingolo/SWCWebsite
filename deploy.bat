call ng build
powershell -Command "(gc dist\SimFrontEnd\index.html) -replace 'module', 'text/javascript' | Out-File -encoding ASCII dist\SimFrontEnd\index.html"
gcloud app deploy --project=bobscombatsim