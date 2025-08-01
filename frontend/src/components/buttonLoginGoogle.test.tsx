import { render, screen } from '@testing-library/react';
import ButtonLoginGoogle from './buttonLoginGoogle';

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
describe('render button google', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('renders login form', () => {
        render(<ButtonLoginGoogle />);
        const btn = screen.getByRole('button', { name: /continue with google/i });
        expect(btn).toBeInTheDocument();
    })
});
