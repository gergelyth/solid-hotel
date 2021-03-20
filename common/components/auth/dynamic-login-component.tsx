import dynamic from "next/dynamic";

export const DynamicLoginComponent = dynamic(
  () => import("./login-component"),
  {
    ssr: false,
  }
);
