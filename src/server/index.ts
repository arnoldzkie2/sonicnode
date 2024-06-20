import { contactRoute } from './routes/contactRoute';
import { dashboadRoute } from './routes/dashboardRoute';
import { orderRoute } from './routes/orderRoute';
import { serverPlansRoute } from './routes/serverPlansRoute';
import { serverRoute } from './routes/serverRoute';
import { userRoute } from './routes/userRoute';
import { router } from './trpc';

export const appRouter = router({
    user: userRoute,
    dashboard: dashboadRoute,
    server: serverRoute,
    order: orderRoute,
    server_plans: serverPlansRoute,
    contact: contactRoute
});

export type AppRouter = typeof appRouter;