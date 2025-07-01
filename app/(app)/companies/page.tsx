import { getCompaniesAction } from "@/app/actions/company-actions";
import CompaniesPage from "@/components/companies-page";
import React from "react";

const Companies = async () => {
  const { companies, error } = await getCompaniesAction();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <CompaniesPage companies={companies} />
    </div>
  );
};

export default Companies;
