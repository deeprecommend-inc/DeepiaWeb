import { useSession, signIn, signOut } from 'next-auth/react';
import Button from '@mui/material/Button';

export const SignInButton = () => {
    const { data: session } = useSession();

    return (
        <>
            <Button
                type="submit"
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => signIn()}
            >
                Log In
            </Button>
        </>
    );
};

export default SignInButton;
