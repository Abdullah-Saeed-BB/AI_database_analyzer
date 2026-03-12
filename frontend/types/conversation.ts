export default interface Conversation {
    id: string;
    is_archived: boolean;
    data: {[key: string]: any[]};
    data_metadata: metadata;
    title: string;
    user_id: string;
    prompt: string;
    text: string;
    sql: string;
    sql_generation_time: string;
    created_at: string;
    error?: string;
}

export interface metadata {
    stats: object;
    columns: string[];
    datetime: string[];
    numerical: string[];
    categorical: string[];
}
