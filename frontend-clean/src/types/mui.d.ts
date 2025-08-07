import { GridProps } from '@mui/material/Grid';

/**
 * Định nghĩa lại kiểu cho Grid để bổ sung hỗ trợ cho các prop container và item
 * Điều này giúp khắc phục lỗi TypeScript với Material UI v5
 */
declare module '@mui/material/Grid' {
  interface GridProps {
    container?: boolean;
    item?: boolean;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
  }
}
