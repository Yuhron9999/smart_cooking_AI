// Script để sửa lỗi với Grid trong Material UI v5 TypeScript
// Chạy script này bằng lệnh: node fix-grid-error.js

const fs = require('fs');
const path = require('path');

// Đường dẫn đến các file cần sửa
const filesToFix = [
  'src/components/ai/AiInteractionHistory.tsx',
  'src/components/ai/AiRecipeGenerator.tsx',
  'src/components/user/UserPreferencesPage.tsx'
];

// Thực hiện thay thế các Grid
function fixGridInFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`File không tồn tại: ${fullPath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Thay thế tất cả Grid item bằng GridItem
  content = content.replace(/<Grid item/g, '<GridItem item');
  content = content.replace(/<\/Grid>/g, (match, offset) => {
    // Kiểm tra xem đây là đóng của Grid item hay Grid container
    const previousText = content.substring(Math.max(0, offset - 100), offset);
    if (previousText.includes('<GridItem')) {
      return '</GridItem>';
    }
    if (previousText.includes('<GridContainer')) {
      return '</GridContainer>';
    }
    return match;
  });
  
  // Thay thế tất cả Grid container bằng GridContainer
  content = content.replace(/<Grid container/g, '<GridContainer container');
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Đã sửa file ${filePath}`);
}

// Import GridContainer và GridItem nếu chưa có
function addImportsIfNeeded(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  if (!content.includes('GridContainer') || !content.includes('GridItem')) {
    // Tìm vị trí sau import cuối cùng
    const importEndIndex = content.lastIndexOf('import ');
    let importEndLine = content.indexOf(';', importEndIndex) + 1;
    
    // Thêm import mới
    const newImport = "\nimport { GridContainer, GridItem } from '../common/GridHelper';";
    content = content.substring(0, importEndLine) + newImport + content.substring(importEndLine);
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Đã thêm import vào ${filePath}`);
  }
}

// Tạo file helper nếu chưa có
function createHelperFile() {
  const helperPath = path.join(process.cwd(), 'src/components/common/GridHelper.tsx');
  const helperDir = path.dirname(helperPath);
  
  if (!fs.existsSync(helperDir)) {
    fs.mkdirSync(helperDir, { recursive: true });
  }
  
  if (!fs.existsSync(helperPath)) {
    const helperContent = `import { Grid } from '@mui/material';

/**
 * Material UI v5 đã thay đổi cách sử dụng Grid và TypeScript không chấp nhận prop "item".
 * Helper này tạo ra Grid được đánh dấu kiểu đúng cho việc sử dụng Grid.item
 * 
 * Cách dùng:
 * <GridItem xs={12} md={6}>
 *   Nội dung
 * </GridItem>
 */
export const GridItem = (props: any) => <Grid {...props} />;

/**
 * Material UI v5 đã thay đổi cách sử dụng Grid và TypeScript không chấp nhận prop "container".
 * Helper này tạo ra Grid được đánh dấu kiểu đúng cho việc sử dụng Grid.container
 * 
 * Cách dùng:
 * <GridContainer spacing={2}>
 *   <GridItem xs={12}>...</GridItem>
 * </GridContainer>
 */
export const GridContainer = (props: any) => <Grid {...props} />;`;

    fs.writeFileSync(helperPath, helperContent, 'utf8');
    console.log('Đã tạo file GridHelper.tsx');
  }
}

// Chạy chương trình
(async function main() {
  try {
    // Tạo file helper trước
    createHelperFile();
    
    // Sửa từng file
    for (const file of filesToFix) {
      addImportsIfNeeded(file);
      fixGridInFile(file);
    }
    
    console.log('Hoàn thành sửa lỗi Grid trong Material UI v5');
  } catch (error) {
    console.error('Lỗi:', error);
  }
})();
