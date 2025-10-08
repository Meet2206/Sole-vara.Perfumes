import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

interface InvoiceData {
  invoice: {
    invoiceTo: string;
    invoiceNo: string;
    invoiceDate: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    grandTotal: number;
  };
  admin: {
    name: string;
    email: string;
    phone: string;
    designation: string;
    location: string;
  };
  brand: {
    companyName: string;
    contactNumber: string;
    email: string;
    address: string;
  };
}

const Invoice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const invoiceData = location.state as InvoiceData | null;

  if (!invoiceData) {
    return (
      <div className="p-16 text-center">
        <h2 className="text-lg font-semibold mb-4">No Invoice Data Found</h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const { invoice, admin, brand } = invoiceData;

  const handleDownload = () => {
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(16, 78, 66);
      doc.rect(0, 0, pageWidth, 45, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text(brand.companyName, 20, 20);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(brand.address, 20, 28);
      doc.text(`Email: ${brand.email}`, 20, 34);
      doc.text(`Phone: ${brand.contactNumber}`, 20, 40);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", pageWidth - 20, 20, { align: "right" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice #: ${invoice.invoiceNo}`, pageWidth - 20, 28, { align: "right" });
      doc.text(`Date: ${invoice.invoiceDate}`, pageWidth - 20, 34, { align: "right" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Bill To:", 20, 60);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(invoice.invoiceTo, 20, 68);

      doc.setFont("helvetica", "bold");
      doc.text("Administrator:", pageWidth - 20, 60, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.text(admin.name, pageWidth - 20, 68, { align: "right" });
      doc.text(admin.designation, pageWidth - 20, 74, { align: "right" });
      doc.text(admin.location, pageWidth - 20, 80, { align: "right" });
      doc.text(admin.phone, pageWidth - 20, 86, { align: "right" });

      const tableData = invoice.items.map((item) => [
        item.name,
        item.qty.toString(),
        `₹${item.price.toLocaleString()}`,
        `₹${item.total.toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: 95,
        head: [["Item", "Qty", "Price", "Total"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [16, 78, 66],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 11,
        },
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 30, halign: "center" },
          2: { cellWidth: 40, halign: "right" },
          3: { cellWidth: 40, halign: "right" },
        },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Subtotal:`, pageWidth - 60, finalY);
      doc.text(`₹${invoice.subtotal.toLocaleString()}`, pageWidth - 20, finalY, { align: "right" });

      doc.text(`Tax (6%):`, pageWidth - 60, finalY + 6);
      doc.text(`₹${invoice.tax.toLocaleString()}`, pageWidth - 20, finalY + 6, { align: "right" });

      doc.setDrawColor(16, 78, 66);
      doc.line(pageWidth - 60, finalY + 10, pageWidth - 20, finalY + 10);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Grand Total:`, pageWidth - 60, finalY + 18);
      doc.text(`₹${invoice.grandTotal.toLocaleString()}`, pageWidth - 20, finalY + 18, { align: "right" });

      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      const footerY = doc.internal.pageSize.getHeight() - 20;
      doc.text("Thank you for your business!", pageWidth / 2, footerY, { align: "center" });
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, footerY + 5, { align: "center" });

      doc.save(`Solevara_Invoice_${invoice.invoiceNo}.pdf`);
    } catch (err) {
      console.error("Error generating invoice:", err);
      alert("Error generating invoice. Please try again.");
    }
  };

  return (
    <div className="pt-16 md:pt-20 pb-16">
      <div className="bg-emerald-800 py-12 md:py-16 mb-12">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white text-center">
            Invoice
          </h1>
          <p className="text-emerald-100 text-center mt-4 max-w-xl mx-auto">
            {brand.companyName}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between mb-8 pb-6 border-b-2 border-emerald-800">
            <div>
              <h2 className="text-2xl font-bold text-emerald-900 mb-2">{brand.companyName}</h2>
              <p className="text-gray-600">{brand.address}</p>
              <p className="text-gray-600">{brand.email}</p>
              <p className="text-gray-600">{brand.contactNumber}</p>
            </div>
            <div className="mt-6 md:mt-0 text-left md:text-right">
              <p className="text-sm text-gray-600 mb-1">Invoice Number</p>
              <p className="text-xl font-bold text-emerald-900 mb-3">#{invoice.invoiceNo}</p>
              <p className="text-sm text-gray-600 mb-1">Date</p>
              <p className="font-semibold text-gray-800">{invoice.invoiceDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-emerald-900 uppercase mb-2">Bill To</h3>
              <p className="font-semibold text-gray-800 text-lg">{invoice.invoiceTo}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-900 uppercase mb-2">Administrator</h3>
              <p className="font-semibold text-gray-800">{admin.name}</p>
              <p className="text-gray-600 text-sm">{admin.designation}</p>
              <p className="text-gray-600 text-sm">{admin.location}</p>
              <p className="text-gray-600 text-sm">{admin.phone}</p>
              <p className="text-gray-600 text-sm">{admin.email}</p>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-emerald-800 text-white">
                  <th className="text-left py-3 px-4">Item</th>
                  <th className="text-center py-3 px-4">Qty</th>
                  <th className="text-right py-3 px-4">Price</th>
                  <th className="text-right py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{item.name}</td>
                    <td className="py-3 px-4 text-center text-gray-800">{item.qty}</td>
                    <td className="py-3 px-4 text-right text-gray-800">₹{item.price.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-800">₹{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-full md:w-64">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-800">₹{invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Tax (6%):</span>
                <span className="font-semibold text-gray-800">₹{invoice.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-emerald-800">
                <span className="text-lg font-bold text-emerald-900">Grand Total:</span>
                <span className="text-lg font-bold text-emerald-900">₹{invoice.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Home
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors font-medium"
            >
              Download PDF Invoice
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 italic">Thank you for your business!</p>
            <p className="text-xs text-gray-400 mt-2">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
