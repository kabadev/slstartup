import React, { ReactNode } from "react";
import ClientLayout from "./clientLayout";

const layout = ({ children }: { children: ReactNode }) => {
  return <ClientLayout>{children}</ClientLayout>;
};

export default layout;
