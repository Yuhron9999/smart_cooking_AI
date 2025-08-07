import { Grid } from '@mui/material';

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
export const GridContainer = (props: any) => <Grid {...props} />;
