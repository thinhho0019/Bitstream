import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPageClient from './registerClients';
import { toast } from 'sonner';

const mockFetch = jest.fn();
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => new URLSearchParams('code=abc')),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('sonner', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));
global.fetch = jest.fn();

describe('register test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockClear();
    });

    it('renders register form', () => {
        render(<RegisterPageClient />);
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Password Again')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
    });
    it('updates input values correctly', () => {
        render(<RegisterPageClient />);

        const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
        const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
        const passwordAgainInput = screen.getByLabelText('Password Again') as HTMLInputElement;

        // Fire change events
        fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } });
        fireEvent.change(passwordInput, { target: { value: 'admin123' } });
        fireEvent.change(passwordAgainInput, { target: { value: 'admin1234' } });

        // Assert values
        expect(emailInput.value).toBe('admin@gmail.com');
        expect(passwordInput.value).toBe('admin123');
        expect(passwordAgainInput.value).toBe('admin1234');
    });
    it('shows error when email or password is empty or password again is empty', async () => {
        render(<RegisterPageClient />);
        fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
        expect(toast.error).toHaveBeenCalledWith("Please enter all fields.");
    });
    it('shows error when passwords do not match', async () => {
        render(<RegisterPageClient />);
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@gmail.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin123' } });
        fireEvent.change(screen.getByLabelText('Password Again'), { target: { value: 'admin1234' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
        expect(toast.error).toHaveBeenCalledWith("Passwords do not match. Please try again.");
    });
    it('shows success message when registration is successful', async () => {
        (global.fetch as jest.Mock) = mockFetch
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ message: "Account created successfully" }),
        } as Response); // ép kiểu để tránh TypeScript lỗi
        render(<RegisterPageClient />);
        // Mock API response
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@gmail.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin123' } });
        fireEvent.change(screen.getByLabelText('Password Again'), { target: { value: 'admin123' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Registration successful");
        })

    });

});