#!/bin/bash

# تعريف الألوان لجعل الإخراج أوضح
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# دالة لعرض محتوى الملفات
show_files() {
    local dir=$1
    local title=$2
    
    echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}📁 $title${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
    
    # التحقق من وجود المجلد
    if [ ! -d "$dir" ]; then
        echo -e "${RED}❌ Folder not found: $dir${NC}"
        return
    fi
    
    # البحث عن جميع ملفات TypeScript
    files=$(find "$dir" -type f \( -name "*.ts" -o -name "*.schema.ts" -o -name "*.dto.ts" \) | sort)
    
    if [ -z "$files" ]; then
        echo -e "${YELLOW}⚠️  No .ts files found${NC}"
        return
    fi
    
    for file in $files; do
        echo -e "\n${YELLOW}📄 File: $file${NC}"
        echo -e "${RED}─────────────────────────────────────────────────────────────${NC}"
        cat "$file"
        echo -e "${RED}─────────────────────────────────────────────────────────────${NC}"
    done
}

# عرض جميع الملفات
# show_files "apps/backend/src/modules/auth" "AUTH MODULE FILES"
# show_files "apps/backend/src/common" "COMMON FILES"
# show_files "apps/backend/src/config" "CONFIG FILES"

echo -e "\n${GREEN}✅ Done!${NC}"