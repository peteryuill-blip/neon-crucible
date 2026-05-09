import { type Config } from "tailwindcss";

export default {
  // ... your existing content config ...
  safelist: [
    "col-span-1", "col-span-2", "col-span-3",
    "row-span-1", "row-span-2", "row-span-3",
  ],
  // ... rest of your config
} satisfies Config;
