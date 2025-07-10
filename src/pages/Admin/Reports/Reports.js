import React from 'react';
import { FraudTab } from './components/FraudTab';
import { ReportView } from './components/ReportView';

export const AdminReportsPage = () => {
  const [viewData, setViewData] = React.useState(null);

  return (
    <main className="main">
      {viewData ? (
        <ReportView data={viewData} closeView={() => setViewData(null)} />
      ) : (
        <FraudTab setActiveReport={setViewData} />
      )}
    </main>
  );
};
