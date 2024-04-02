"use server"
import { redirect } from "next/navigation";

export async function redirectClient(path: string) {
    redirect(path)
}

export async function toLogin() {
    redirect("/login")
}