#!/bin/bash

# ============================================
# 🚀 SCAN ENTIRE PROJECT - من البداية للنهاية
# ============================================

# تعريف الألوان
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'
BOLD='\033[1m'

# ============================================
# 📁 المجلدات اللي عايز تستثنيها (ماتجيش ناحيتها)
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
# 🎯 أماكن البحث (كل المشروع من أوله لآخره)
# ============================================

SEARCH_PATHS=(
    # 🔍 ابدأ من المجلد الحالي (next-nest-store)
    "."                                     # كل المشروع
    
    # أو مجلدات محددة لو عايز:
    # "apps"                                 # apps folder only
    # "apps/backend"                         # backend only
    # "apps/frontend"                        # frontend only
    # "packages"                             # shared packages
)

# ============================================
# 📝 أنواع الملفات اللي عايز تبحث فيها
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
)

# ============================================
# 🛠️ دالة البحث الرئيسية
# ============================================

OUTPUT=""
TOTAL_FILES=0
TOTAL_LINES=0

scan_files() {
    local dir=$1
    
    OUTPUT+="\n${BLUE}════════════════════════════════════════════════════════════${NC}\n"
    OUTPUT+="${GREEN}📁 Scanning: $(realpath "$dir")${NC}\n"
    OUTPUT+="${BLUE}════════════════════════════════════════════════════════════${NC}\n"
    
    if [ ! -d "$dir" ]; then
        OUTPUT+="${RED}❌ Folder not found: $dir${NC}\n"
        return
    fi
    
    # بناء أمر find مع الاستثناءات
    local exclude_pattern=""
    for exclude in "${EXCLUDE_DIRS[@]}"; do
        exclude_pattern="$exclude_pattern -not -path \"*/$exclude/*\""
    done
    
    # بناء أمر find مع أنواع الملفات
    local file_pattern=""
    for type in "${FILE_TYPES[@]}"; do
        file_pattern="$file_pattern -o -name \"$type\""
    done
    # إزالة الـ -o الأول
    file_pattern="${file_pattern# -o }"
    
    # البحث عن الملفات
    local find_cmd="find \"$dir\" -type f \( $file_pattern \) $exclude_pattern | sort"
    
    # تنفيذ البحث
    local files=$(eval $find_cmd 2>/dev/null)
    
    if [ -z "$files" ]; then
        OUTPUT+="${YELLOW}⚠️  No files found${NC}\n"
        return
    fi
    
    # عدد الملفات
    local file_count=$(echo "$files" | wc -l)
    TOTAL_FILES=$((TOTAL_FILES + file_count))
    
    OUTPUT+="${CYAN}📊 Found $file_count files${NC}\n\n"
    
    # عرض كل ملف
    local counter=0
    for file in $files; do
        counter=$((counter + 1))
        local lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        TOTAL_LINES=$((TOTAL_LINES + lines))
        
        OUTPUT+="${YELLOW}📄 [$counter/$file_count] $file${NC}\n"
        OUTPUT+="${MAGENTA}📊 Lines: $lines${NC}\n"
        OUTPUT+="${RED}─────────────────────────────────────────────────────────────${NC}\n"
        OUTPUT+=$(cat "$file" 2>/dev/null || echo "⚠️ Cannot read file")
        OUTPUT+="\n${RED}─────────────────────────────────────────────────────────────${NC}\n"
    done
}

# ============================================
# 📊 عرض الإحصائيات
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
# 💾 حفظ الناتج
# ============================================

save_to_file() {
    local filename="project_scan_$(date +%Y%m%d_%H%M%S).txt"
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
# 🚀 التنفيذ
# ============================================

clear
echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║${NC}      ${BOLD}🔍 FULL PROJECT SCANNER ${NC}                   ${BOLD}${BLUE}║${NC}"
echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📂 Current directory: $(pwd)${NC}"
echo -e "${CYAN}📂 Project: $(basename "$(pwd)")${NC}"
echo ""

# عرض المجلدات المستثناة
echo -e "${YELLOW}🚫 Excluded directories:${NC}"
for exclude in "${EXCLUDE_DIRS[@]}"; do
    echo -e "  ${RED}✗${NC} $exclude"
done
echo ""

# عرض أنواع الملفات
echo -e "${YELLOW}📝 File types to scan:${NC}"
for type in "${FILE_TYPES[@]}"; do
    echo -e "  ${GREEN}✓${NC} $type"
done
echo ""

# تأكيد البدء
echo -e "${CYAN}Press Enter to start scanning...${NC}"
read

# بدء المسح
echo -e "\n${GREEN}▶ Scanning...${NC}\n"

# مسح كل المسارات
for path in "${SEARCH_PATHS[@]}"; do
    scan_files "$path"
done

# إضافة الإحصائيات
show_stats

# عرض الناتج
echo -e "$OUTPUT"

# سؤال عن الحفظ
ask_to_save

echo -e "\n${GREEN}✅ Scan completed!${NC}"