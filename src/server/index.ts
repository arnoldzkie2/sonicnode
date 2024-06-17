import { dashboadRoute } from './routes/dashboardRoute';
import { userRoute } from './routes/userRoute';
import { router } from './trpc';

export const appRouter = router({
    user: userRoute,
    dashboard: dashboadRoute
});

export type AppRouter = typeof appRouter;