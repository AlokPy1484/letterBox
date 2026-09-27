import { createBrowserClient } from "@supabase/ssr"



export function createClient() {

    console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(
        "SUPABASE KEY:",
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.slice(0, 15)
    );

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )

}