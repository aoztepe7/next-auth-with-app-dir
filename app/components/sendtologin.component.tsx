"use client";
import { useRouter } from 'next/router'
export const SendToLogin = () => {
    const router = useRouter();
    router.push('/');
};