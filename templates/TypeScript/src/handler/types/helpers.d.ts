export type Override<A extends Record<string, unknown>, B extends Record<string, unknown>> = Omit<
    A,
    keyof B
> &
    B;
