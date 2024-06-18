import { dashboadRoute } from './routes/dashboardRoute';
import { orderRoute } from './routes/orderRoute';
import { serverRoute } from './routes/serverRoute';
import { userRoute } from './routes/userRoute';
import { router } from './trpc';

export const appRouter = router({
    user: userRoute,
    dashboard: dashboadRoute,
    server: serverRoute,
    order: orderRoute
});

export type AppRouter = typeof appRouter;