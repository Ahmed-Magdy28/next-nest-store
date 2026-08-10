#!/bin/bash

# ============================================
# SCAN ENTIRE PROJECT
# ============================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'
BOLD='\033[1m'

# ============================================
# EXCLUDED DIRECTORIES
# ============================================

EXCLUDE_DIRS=(
    "node_modules"
    ".git"
    "dist"
    "build"
    ".next"
    "out"
    "coverage"
    ".vscode"
    ".idea"
    "tmp"
    "temp"
    "logs"
    "*.log"
    "cache"
    ".cache"
    "public"
    "static"
    "assets"
    "images"
    "*.png"
    "*.jpg"
    "*.jpeg"
    "*.gif"
    "*.svg"
    "*.ico"
    "*.mp4"
    "*.mp3"
    "*.wav"
    "*.pdf"
    "*.doc"
    "*.docx"
)

# ============================================
# SEARCH LOCATIONS
# ============================================

LOCATION_NAMES=(
    "Full Project"
    "Backend API"
    "Backend API Src"
    "Backend Tests"
    "Frontend Web"
    "Docker (folder + compose)"
    "Database Package"
    "Shared Packages"
    "UI Components"
    "Scripts"
)

LOCATION_PATHS=(
    "."
    "apps/backend"
    "apps/backend/src"
    "apps/backend/test"
    "apps/frontend"
    "docker|docker-compose.yml"
    "packages/database"
    "packages"
    "packages/ui"
    "scripts"
)

# ============================================
# FILE TYPES TO SCAN
# ============================================

FILE_TYPES=(
    "*.ts"
    "*.tsx"
    "*.js"
    "*.jsx"
    "*.schema.ts"
    "*.dto.ts"
    "*.module.ts"
    "*.controller.ts"
    "*.service.ts"
    "*.repository.ts"
    "*.entity.ts"
    "*.interface.ts"
    "*.enum.ts"
    "*.decorator.ts"
    "*.guard.ts"
    "*.interceptor.ts"
    "*.pipe.ts"
    "*.middleware.ts"
    "*.filter.ts"
    "*.spec.ts"
    "*.e2e-spec.ts"
    "*.config.ts"
    "*.env"
    "*.json"
    "*.yml"
    "*.yaml"
    "*.html"
    "*.css"
    "*.scss"
    "*.sql"
    "*.prisma"
    "*.sh"
    "*.bash"
)

# ============================================
# MAIN SCAN FUNCTION
# ============================================

OUTPUT=""
TOTAL_FILES=0
TOTAL_LINES=0

scan_files() {
    target_path="$1"
    
    # Check if it's a combined path (contains |)
    if echo "$target_path" | grep -q "|"; then
        # Split and scan each path
        old_ifs="$IFS"
        IFS='|'
        for single_path in $target_path; do
            IFS="$old_ifs"
            scan_single_path "$single_path"
        done
        IFS="$old_ifs"
    else
        scan_single_path "$target_path"
    fi
}

scan_single_path() {
    dir="$1"
    
    # Check if path exists
    if [ ! -e "$dir" ]; then
        OUTPUT+="${RED}❌ Path not found: $dir${NC}\n"
        return 1
    fi
    
    OUTPUT+="\n${BLUE}════════════════════════════════════════════════════════════${NC}\n"
    if [ -d "$dir" ]; then
        OUTPUT+="${GREEN}📁 Scanning directory: $(realpath "$dir" 2>/dev/null || echo "$dir")${NC}\n"
    else
        OUTPUT+="${GREEN}📄 Scanning file: $(realpath "$dir" 2>/dev/null || echo "$dir")${NC}\n"
    fi
    OUTPUT+="${BLUE}════════════════════════════════════════════════════════════${NC}\n"
    
    # If it's a single file
    if [ -f "$dir" ]; then
        lines=$(wc -l < "$dir" 2>/dev/null || echo "0")
        TOTAL_LINES=$((TOTAL_LINES + lines))
        TOTAL_FILES=$((TOTAL_FILES + 1))
        
        OUTPUT+="${YELLOW}📄 [1/1] $dir${NC}\n"
        OUTPUT+="${MAGENTA}📊 Lines: $lines${NC}\n"
        OUTPUT+="${RED}─────────────────────────────────────────────────────────────${NC}\n"
        OUTPUT+=$(cat "$dir" 2>/dev/null || echo "⚠️ Cannot read file")
        OUTPUT+="\n${RED}─────────────────────────────────────────────────────────────${NC}\n"
        return 0
    fi
    
    # Build exclude pattern
    exclude_pattern=""
    for exclude in "${EXCLUDE_DIRS[@]}"; do
        exclude_pattern="$exclude_pattern -not -path \"*/$exclude/*\""
    done
    
    # Build file pattern
    file_pattern=""
    for type in "${FILE_TYPES[@]}"; do
        file_pattern="$file_pattern -o -name \"$type\""
    done
    file_pattern="${file_pattern# -o }"
    
    # Find and process files
    find_cmd="find \"$dir\" -type f \( $file_pattern \) $exclude_pattern | sort"
    
    files=$(eval $find_cmd 2>/dev/null)
    
    if [ -z "$files" ]; then
        OUTPUT+="${YELLOW}⚠️  No files found${NC}\n"
        return 0
    fi
    
    file_count=$(echo "$files" | wc -l)
    TOTAL_FILES=$((TOTAL_FILES + file_count))
    
    OUTPUT+="${CYAN}📊 Found $file_count files${NC}\n\n"
    
    counter=0
    while IFS= read -r file; do
        counter=$((counter + 1))
        lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        TOTAL_LINES=$((TOTAL_LINES + lines))
        
        OUTPUT+="${YELLOW}📄 [$counter/$file_count] $file${NC}\n"
        OUTPUT+="${MAGENTA}📊 Lines: $lines${NC}\n"
        OUTPUT+="${RED}─────────────────────────────────────────────────────────────${NC}\n"
        OUTPUT+=$(cat "$file" 2>/dev/null || echo "⚠️ Cannot read file")
        OUTPUT+="\n${RED}─────────────────────────────────────────────────────────────${NC}\n"
    done <<< "$files"
}

# ============================================
# SHOW STATISTICS
# ============================================

show_stats() {
    OUTPUT+="\n${BLUE}════════════════════════════════════════════════════════════${NC}\n"
    OUTPUT+="${GREEN}📊 SCAN COMPLETE${NC}\n"
    OUTPUT+="${BLUE}════════════════════════════════════════════════════════════${NC}\n"
    OUTPUT+="${CYAN}📁 Total files scanned: $TOTAL_FILES${NC}\n"
    OUTPUT+="${CYAN}📝 Total lines of code: $TOTAL_LINES${NC}\n"
    OUTPUT+="${CYAN}📂 Project root: $(pwd)${NC}\n"
}

# ============================================
# SAVE OUTPUT
# ============================================

save_to_file() {
    filename="project_scan_$(date +%Y%m%d_%H%M%S).txt"
    echo -e "$OUTPUT" | sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]//g" > "$filename"
    echo -e "\n${GREEN}✅ File saved: ${CYAN}$filename${NC}"
    echo -e "${GREEN}📍 Location: $(pwd)/$filename${NC}"
    echo -e "${GREEN}📊 Size: $(du -h "$filename" | cut -f1)${NC}"
}

ask_to_save() {
    echo ""
    echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}💾 Save output to file?${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "  ${GREEN}1${NC}) Yes  ${RED}2${NC}) No"
    echo -n "Choice [1/2]: "
    read choice
    case $choice in 1|yes|y|Yes|YES) save_to_file ;; *) echo -e "\n${YELLOW}⏭️  Skipped${NC}" ;; esac
}

# ============================================
# DISPLAY MENU
# ============================================

show_menu() {
    clear
    echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${BLUE}║${NC}      ${BOLD}🔍 PROJECT SCANNER - SELECT TARGET ${NC}          ${BOLD}${BLUE}║${NC}"
    echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}📂 Current directory: $(pwd)${NC}"
    echo -e "${CYAN}📂 Project: $(basename "$(pwd)")${NC}"
    echo ""
    echo -e "${BOLD}Select what to scan:${NC}"
    echo ""
    
    for i in "${!LOCATION_NAMES[@]}"; do
        num=$((i + 1))
        name="${LOCATION_NAMES[$i]}"
        path="${LOCATION_PATHS[$i]}"
        
        # Check if path exists (handle combined paths)
        if echo "$path" | grep -q "|"; then
            # Check if any part exists
            old_ifs="$IFS"
            IFS='|'
            found=0
            for single_path in $path; do
                if [ -e "$single_path" ]; then
                    found=1
                    break
                fi
            done
            IFS="$old_ifs"
            if [ $found -eq 1 ]; then
                echo -e "  ${GREEN}$num${NC}) ${BOLD}$name${NC}  → ${CYAN}$path${NC} ${GREEN}✓${NC}"
            else
                echo -e "  ${YELLOW}$num${NC}) ${BOLD}$name${NC}  → ${RED}$path (not found)${NC}"
            fi
        else
            if [ -e "$path" ]; then
                echo -e "  ${GREEN}$num${NC}) ${BOLD}$name${NC}  → ${CYAN}$path${NC} ${GREEN}✓${NC}"
            else
                echo -e "  ${YELLOW}$num${NC}) ${BOLD}$name${NC}  → ${RED}$path (not found)${NC}"
            fi
        fi
    done
    echo ""
    echo -e "  ${RED}0${NC}) ${BOLD}Exit${NC}"
    echo ""
    echo -e "${BOLD}────────────────────────────────────────────────────────────${NC}"
}

# ============================================
# EXECUTION
# ============================================

while true; do
    show_menu
    echo -n "Enter your choice [0-${#LOCATION_NAMES[@]}]: "
    read choice
    
    if [ "$choice" = "0" ]; then
        echo -e "\n${GREEN}👋 Goodbye!${NC}"
        exit 0
    fi
    
    # Check if choice is a number and within range
    if echo "$choice" | grep -q '^[0-9]\+$' && [ "$choice" -ge 1 ] && [ "$choice" -le "${#LOCATION_NAMES[@]}" ]; then
        index=$((choice - 1))
        scan_name="${LOCATION_NAMES[$index]}"
        scan_path="${LOCATION_PATHS[$index]}"
        
        echo -e "\n${GREEN}▶ Selected: ${BOLD}$scan_name${NC} (${CYAN}$scan_path${NC})${NC}"
        
        # Check if path exists (handle combined paths)
        if echo "$scan_path" | grep -q "|"; then
            # Check if any part exists
            old_ifs="$IFS"
            IFS='|'
            found=0
            for single_path in $scan_path; do
                if [ -e "$single_path" ]; then
                    found=1
                    break
                fi
            done
            IFS="$old_ifs"
            if [ $found -eq 0 ]; then
                echo -e "${RED}❌ No paths exist in: $scan_path${NC}"
                echo -e "${YELLOW}Press Enter to continue...${NC}"
                read
                continue
            fi
        else
            if [ ! -e "$scan_path" ]; then
                echo -e "${RED}❌ Path does not exist: $scan_path${NC}"
                echo -e "${YELLOW}Press Enter to continue...${NC}"
                read
                continue
            fi
        fi
        
        echo -e "${YELLOW}Press Enter to start scanning...${NC}"
        read
        
        echo -e "\n${GREEN}▶ Scanning...${NC}\n"
        
        OUTPUT=""
        TOTAL_FILES=0
        TOTAL_LINES=0
        
        scan_files "$scan_path"
        show_stats
        
        echo -e "$OUTPUT"
        ask_to_save
        
        echo -e "\n${GREEN}✅ Scan completed!${NC}"
        echo ""
        echo -e "${CYAN}Press Enter to return to menu...${NC}"
        read
    else
        echo -e "\n${RED}❌ Invalid option! Press Enter to try again...${NC}"
        read
    fi
done