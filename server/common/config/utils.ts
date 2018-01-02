// Sample Unique ID generator
export function IDGenerator(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
}