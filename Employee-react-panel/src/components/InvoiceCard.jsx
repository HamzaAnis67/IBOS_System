export default function InvoiceCard({ invoice }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="bg-indigo-50 text-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold">#</div>
        <div>
          <p className="font-bold text-sm">{invoice.id}</p>
          <p className="text-xs text-gray-400">{invoice.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-indigo-600">${invoice.amount}</p>
        <p className="text-[10px] font-black uppercase text-gray-300">{invoice.status}</p>
      </div>
    </div>
  );
}