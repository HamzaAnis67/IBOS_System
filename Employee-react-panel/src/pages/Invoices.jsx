import InvoiceCard from '../components/InvoiceCard';

export default function Invoices() {
  const invData = [
    { id: 'INV-30042', amount: '1240.00', date: 'Sept 14, 2023', status: 'PAID' },
    { id: 'INV-30043', amount: '800.00', date: 'Oct 01, 2023', status: 'PENDING' },
    { id: 'INV-30044', amount: '220.00', date: 'Oct 04, 2023', status: 'PAID' },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Financial History</h1>
      <div className="space-y-3">
        {invData.map(inv => <InvoiceCard key={inv.id} invoice={inv} />)}
      </div>
    </div>
  );
}