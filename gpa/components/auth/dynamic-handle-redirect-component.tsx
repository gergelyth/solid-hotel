import dynamic from "next/dynamic";

export const DynamicHandleRedirectComponent = dynamic(
  () => import("./handle-redirect-component"),
  { ssr: false }
);
