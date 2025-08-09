# PowerShell script to consolidate frontend components
Write-Host "Consolidating frontend-clean components..." -ForegroundColor Green

# Define paths
$sourceDir = "c:\SmartCookingAI_2\frontend-clean\components"
$targetDir = "c:\SmartCookingAI_2\frontend-clean\src\components"

# Function to move files and create directories if needed
function Move-ComponentFiles {
    param($source, $target)
    
    if (Test-Path $source) {
        Write-Host "Moving files from $source to $target" -ForegroundColor Yellow
        
        # Create target directory if it doesn't exist
        if (!(Test-Path $target)) {
            New-Item -ItemType Directory -Path $target -Force | Out-Null
        }
        
        # Get all items in source directory
        Get-ChildItem -Path $source -Recurse | ForEach-Object {
            $relativePath = $_.FullName.Substring($source.Length + 1)
            $targetPath = Join-Path $target $relativePath
            
            if ($_.PSIsContainer) {
                # Create directory
                if (!(Test-Path $targetPath)) {
                    New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
                    Write-Host "Created directory: $targetPath" -ForegroundColor Cyan
                }
            }
            else {
                # Move file, check if exists
                $targetFile = $targetPath
                if (Test-Path $targetFile) {
                    Write-Host "File exists, renaming: $targetFile" -ForegroundColor Yellow
                    $ext = [System.IO.Path]::GetExtension($targetFile)
                    $nameWithoutExt = [System.IO.Path]::GetFileNameWithoutExtension($targetFile)
                    $dir = [System.IO.Path]::GetDirectoryName($targetFile)
                    $newName = "${nameWithoutExt}_backup${ext}"
                    $targetFile = Join-Path $dir $newName
                }
                
                Copy-Item -Path $_.FullName -Destination $targetFile -Force
                Write-Host "Moved: $($_.FullName) -> $targetFile" -ForegroundColor Green
            }
        }
    }
}

# Move specific directories to avoid conflicts
Move-ComponentFiles "$sourceDir\common" "$targetDir\common"
Move-ComponentFiles "$sourceDir\dashboard" "$targetDir\dashboard" 
Move-ComponentFiles "$sourceDir\layout" "$targetDir\layout"

# Move individual files
$individualFiles = @(
    "AuthWrapper.tsx",
    "ClientOnly.tsx", 
    "LanguageSwitcher.tsx",
    "LoadingState.tsx",
    "NotificationSystem.tsx",
    "SettingsModal.tsx"
)

foreach ($file in $individualFiles) {
    $sourcePath = Join-Path $sourceDir $file
    $targetPath = Join-Path $targetDir $file
    
    if (Test-Path $sourcePath) {
        if (Test-Path $targetPath) {
            $backupPath = Join-Path $targetDir "$([System.IO.Path]::GetFileNameWithoutExtension($file))_backup$([System.IO.Path]::GetExtension($file))"
            Copy-Item -Path $sourcePath -Destination $backupPath -Force
            Write-Host "Moved: $sourcePath -> $backupPath (backup)" -ForegroundColor Yellow
        }
        else {
            Copy-Item -Path $sourcePath -Destination $targetPath -Force
            Write-Host "Moved: $sourcePath -> $targetPath" -ForegroundColor Green
        }
    }
}

Write-Host "Component consolidation completed!" -ForegroundColor Green
Write-Host "Please review the merged components and remove duplicates manually." -ForegroundColor Yellow
