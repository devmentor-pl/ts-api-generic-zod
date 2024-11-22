import { z } from 'zod';
import fetch from 'node-fetch';

const TodoSchema = z.object({
    userId: z.number(),
    id: z.number(),
    title: z.string(),
    completed: z.boolean(),
});

const TodoListSchema = z.array(TodoSchema);

async function request<T>(
    url: string,
    Schema: z.ZodType<T>,
    options?: RequestInit
 ): Promise<T> {
    const resp = await fetch(url, options);
    if(!resp.ok) throw new Error(`Error: ${resp.status}`);
 
    const data:unknown = await resp.json();
    return Schema.parse(data);
 }
 

(async () => { // IIFE do obsługi async/await
    const url = 'https://jsonplaceholder.typicode.com/todos/';
    try {
        const data = await request(url, TodoListSchema);

        console.log(data);
    } catch(err) {
        if(err instanceof Error) {
            console.error(err.message)
        } else if(err instanceof z.ZodError) {
            console.error('validation', err);
        } else {
            console.error(err)
        }
    };
})();