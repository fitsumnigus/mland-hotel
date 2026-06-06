// src/app/(marketing)/account/bookings/page.tsx
// Guest booking lookup — redirects to booking page.
// Full authenticated account system is a future scope item.
import { redirect } from "next/navigation";
export default function AccountBookingsPage() { redirect("/book"); }
