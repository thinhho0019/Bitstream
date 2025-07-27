
import LoginPageClient from "./loginClient";
import { Suspense } from 'react';
export const metadata = {
    title: 'Login Page',
    describe: 'Bitstream follow bitcoin every where'
};
export default function LoginPage() {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPageClient />;
        </Suspense>
    )
}