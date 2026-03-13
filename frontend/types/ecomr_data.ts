export interface data_status {
    table_name: string;
    row_count?: number;
    columns?: string[];
    error?: string;
}

export interface table_data {
    table_name: string;
    total: number;
    offset: number;
    limit: number;
    data: any[];
}