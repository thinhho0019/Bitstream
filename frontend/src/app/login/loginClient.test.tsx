import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPageClient from './page';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

const mockPush = jest.fn();

jest.mock("next-auth/react", () => ({
    signIn: jest.fn(),
}));
jest.mock('sonner', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));
describe('Login test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('renders login form', () => {
        render(<LoginPageClient />);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    })
    it('shows error when email or password is empty', async () => {
        render(<LoginPageClient />);
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        expect(toast.error).toHaveBeenCalledWith("Please enter both email and password.");
    });
    it('calls signIn with correct credentials', async () => {
        const email = "admin@gmail.com";
        const password = "admin123";
        render(<LoginPageClient />);
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));   
        await waitFor(() => {
            expect(signIn).toHaveBeenCalledWith("credentials", {
                email,
                password,
                redirect: false,
            });
        });  
    });
    it('shows error when signIn fails', async () => {
        (signIn as jest.Mock).mockResolvedValueOnce({ error: "Invalid credentials" });
        render(<LoginPageClient />);
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: "admin@gmail.com" } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: "wrongpassword" } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Login failed. Please check your credentials.");
        });
    });
    it('redirects to dashboard on successful login', async () => {
        (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });
        render(<LoginPageClient />);
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: "admin@gmai.com"}});
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: "admin123" } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/dashboard");
        });
    });
});
