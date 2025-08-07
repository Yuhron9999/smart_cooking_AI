import apiService, { ApiResponse } from './apiService';

/**
 * Interface cho kết quả truy vấn MySQL
 */
export interface MySQLQueryResult {
  rows: any[];
  fieldCount?: number;
  affectedRows?: number;
  insertId?: number;
}

/**
 * Interface cho thông tin bảng MySQL
 */
export interface MySQLTableInfo {
  tableName: string;
  columns: MySQLColumnInfo[];
  primaryKey: string[];
  foreignKeys: MySQLForeignKeyInfo[];
}

/**
 * Interface cho thông tin cột MySQL
 */
export interface MySQLColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: any;
  comment?: string;
}

/**
 * Interface cho thông tin khóa ngoại MySQL
 */
export interface MySQLForeignKeyInfo {
  columnName: string;
  referencedTable: string;
  referencedColumn: string;
}

/**
 * MySQLService - Dịch vụ tích hợp với MySQL
 * 
 * Service này cung cấp các phương thức để tương tác trực tiếp với MySQL database
 * thông qua Spring Boot backend.
 */
class MySQLService {
  /**
   * Kiểm tra kết nối với MySQL
   */
  public async testConnection(): Promise<ApiResponse<{ connected: boolean, version: string }>> {
    try {
      return await apiService.get<{ connected: boolean, version: string }>('/database/test');
    } catch (error) {
      console.error('Error testing MySQL connection:', error);
      return {
        success: false,
        message: 'Không thể kết nối đến MySQL.',
        errorCode: 'MYSQL_CONNECTION_ERROR',
        data: null
      };
    }
  }

  /**
   * Lấy danh sách các bảng trong database
   */
  public async getTables(): Promise<ApiResponse<string[]>> {
    try {
      return await apiService.get<string[]>('/database/tables');
    } catch (error) {
      console.error('Error getting MySQL tables:', error);
      return {
        success: false,
        message: 'Không thể lấy danh sách các bảng từ MySQL.',
        errorCode: 'MYSQL_TABLES_ERROR',
        data: null
      };
    }
  }

  /**
   * Lấy thông tin chi tiết về một bảng
   */
  public async getTableInfo(tableName: string): Promise<ApiResponse<MySQLTableInfo>> {
    try {
      return await apiService.get<MySQLTableInfo>(`/database/tables/${tableName}`);
    } catch (error) {
      console.error(`Error getting MySQL table info for ${tableName}:`, error);
      return {
        success: false,
        message: `Không thể lấy thông tin bảng ${tableName} từ MySQL.`,
        errorCode: 'MYSQL_TABLE_INFO_ERROR',
        data: null
      };
    }
  }

  /**
   * Thực thi truy vấn SQL an toàn
   */
  public async executeQuery<T = any>(query: string, params?: any[]): Promise<ApiResponse<MySQLQueryResult>> {
    try {
      return await apiService.post<MySQLQueryResult>('/database/query', {
        query,
        params
      });
    } catch (error) {
      console.error('Error executing MySQL query:', error);
      return {
        success: false,
        message: 'Không thể thực thi truy vấn MySQL.',
        errorCode: 'MYSQL_QUERY_ERROR',
        data: null
      };
    }
  }

  /**
   * Thực thi thủ tục MySQL (stored procedure)
   */
  public async executeStoredProcedure<T = any>(
    procedureName: string, 
    params?: any[]
  ): Promise<ApiResponse<MySQLQueryResult>> {
    try {
      return await apiService.post<MySQLQueryResult>('/database/procedure', {
        procedureName,
        params
      });
    } catch (error) {
      console.error(`Error executing MySQL stored procedure ${procedureName}:`, error);
      return {
        success: false,
        message: `Không thể thực thi thủ tục ${procedureName} trong MySQL.`,
        errorCode: 'MYSQL_PROCEDURE_ERROR',
        data: null
      };
    }
  }

  /**
   * Sao lưu database
   */
  public async backupDatabase(): Promise<ApiResponse<{ backupPath: string }>> {
    try {
      return await apiService.post<{ backupPath: string }>('/database/backup', {});
    } catch (error) {
      console.error('Error backing up MySQL database:', error);
      return {
        success: false,
        message: 'Không thể sao lưu cơ sở dữ liệu MySQL.',
        errorCode: 'MYSQL_BACKUP_ERROR',
        data: null
      };
    }
  }

  /**
   * Khôi phục database từ bản sao lưu
   */
  public async restoreDatabase(backupPath: string): Promise<ApiResponse<boolean>> {
    try {
      return await apiService.post<boolean>('/database/restore', {
        backupPath
      });
    } catch (error) {
      console.error('Error restoring MySQL database:', error);
      return {
        success: false,
        message: 'Không thể khôi phục cơ sở dữ liệu MySQL từ bản sao lưu.',
        errorCode: 'MYSQL_RESTORE_ERROR',
        data: null
      };
    }
  }

  /**
   * Lấy thống kê tổng quan về database
   */
  public async getDatabaseStats(): Promise<ApiResponse<{
    tableCount: number;
    totalRows: Record<string, number>;
    dbSize: string;
    version: string;
  }>> {
    try {
      return await apiService.get<{
        tableCount: number;
        totalRows: Record<string, number>;
        dbSize: string;
        version: string;
      }>('/database/stats');
    } catch (error) {
      console.error('Error getting MySQL database stats:', error);
      return {
        success: false,
        message: 'Không thể lấy thống kê cơ sở dữ liệu MySQL.',
        errorCode: 'MYSQL_STATS_ERROR',
        data: null
      };
    }
  }
}

// Export singleton instance
const mySQLService = new MySQLService();
export default mySQLService;
