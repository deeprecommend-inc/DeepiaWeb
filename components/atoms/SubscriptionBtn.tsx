import { Button } from '@mui/material';

const SubscriptionBtn = () => {
    return (
        <form action="/api/checkout" method="POST">
            <section>
                <Button type="submit" role="link">
                    Subscribe
                </Button>
            </section>
        </form>
    );
};

export default SubscriptionBtn;
