// components/PublicLayout/PublicLayout.tsx
import React from "react";

const PublicLayout = ({ children }: any) => {
  return (
    <>
      {/* You can add a different header or no header at all for public pages */}
      {/* <HeaderPublic /> */}
      <div className="public-main-wrapper">{children}</div>
      {/* You can add a different footer or no footer at all for public pages */}
      {/* <FooterPublic /> */}
    </>
  );
};

export default PublicLayout;
