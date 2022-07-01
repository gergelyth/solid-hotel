import dynamic from "next/dynamic";

/**
 * Workaround for Next.JS's server-side rendering to avoid calling functions related to "window" on server-side.
 */
export const DynamicLoginComponent = dynamic(
  () => import("./login-component"),
  {
    ssr: false,
  }
);
