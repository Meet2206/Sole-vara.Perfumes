import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const Invoice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const invoiceData = location.state;

  if (!invoiceData) {
    return (
      <div className="p-16 text-center">
        <h2 className="text-lg font-semibold mb-4">No Invoice Data Found</h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const doc = new jsPDF("p", "pt", "a4");

      // GST calculation
      const gstRate = invoiceData.gstRate ?? 0.18;
      const subTotal = invoiceData.totalPrice;
      const tax = subTotal * gstRate;
      const grandTotal = subTotal + tax;
      const invoiceNo = invoiceData.invoiceNo || "INV-0001";
      const currentDate = new Date().toLocaleDateString();

      // Generate professional invoice PDF
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      // Company Header
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(6, 78, 59); // Emerald color
      doc.text("SOLÉVARA PERFUMES", 50, 60);
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("Organic Fragrances | Premium Quality", 50, 80);
      doc.text("Email: info@solevara.com | Phone: +91 00000100001", 50, 95);
      doc.text("Vadodara, Gujarat, India - 390010", 50, 110);

      // Invoice Details (top right)
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 450, 60);
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice No: ${invoiceNo}`, 450, 80);
      doc.text(`Date: ${currentDate}`, 450, 95);

      // Horizontal line
      doc.setLineWidth(1);
      doc.line(50, 130, 545, 130);

      // Customer Details
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("BILL TO:", 50, 155);
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(invoiceData.customerName || "Customer Name", 50, 175);
      doc.text(invoiceData.email || "customer@email.com", 50, 190);
      doc.text(invoiceData.phone || "Phone Number", 50, 205);
      if (invoiceData.address) {
        doc.text(invoiceData.address, 50, 220);
      }

      // Table Header
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(6, 78, 59); // Emerald background
      doc.rect(50, 250, 495, 25, 'F');
      doc.setTextColor(255, 255, 255); // White text
      doc.text("ITEM", 60, 267);
      doc.text("QTY", 300, 267);
      doc.text("PRICE", 380, 267);
      doc.text("TOTAL", 480, 267);

      // Products
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      let y = 290;
      invoiceData.cart.forEach((item: any, index: number) => {
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(50, y - 12, 495, 20, 'F');
        }
        
        const itemName = item.name.length > 25 ? item.name.substring(0, 25) + "..." : item.name;
        doc.text(itemName, 60, y);
        doc.text(String(item.quantity), 300, y);
        doc.text(`₹${item.price.toLocaleString()}`, 380, y);
        doc.text(`₹${(item.price * item.quantity).toLocaleString()}`, 480, y);
        y += 25;
      });

      // Totals section
      const totalsY = y + 20;
      doc.setLineWidth(0.5);
      doc.line(350, totalsY - 10, 545, totalsY - 10);
      
      doc.setFont("helvetica", "normal");
      doc.text("Subtotal:", 400, totalsY);
      doc.text(`₹${subTotal.toLocaleString()}`, 480, totalsY);
      
      doc.text("GST (18%):", 400, totalsY + 20);
      doc.text(`₹${tax.toLocaleString()}`, 480, totalsY + 20);
      
      // Grand total with emphasis
      doc.setLineWidth(1);
      doc.line(350, totalsY + 30, 545, totalsY + 30);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(6, 78, 59);
      doc.text("GRAND TOTAL:", 400, totalsY + 50);
      doc.text(`₹${grandTotal.toLocaleString()}`, 480, totalsY + 50);

      // Footer
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for choosing Solévara Perfumes!", 50, 750);
      doc.text("For any queries, contact us at info@solevara.com", 50, 765);
      doc.text("This is a computer-generated invoice and does not require a signature.", 50, 780);

      // Save PDF
      doc.save(`Solevara_Invoice_${invoiceNo}.pdf`);

    } catch (err) {
      console.error("Error generating invoice:", err);
      alert("Error generating invoice. Please try again.");
    }
  };

  return (
    <div className="p-16 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center mb-4">
        Solévara FRAGRANCES
      </h1>
      <p className="text-center mb-6">
        Invoice Date: {new Date().toLocaleDateString()}
      </p>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Customer Details</h2>
        <p><strong>Name:</strong> {invoiceData.customerName}</p>
        <p><strong>Email:</strong> {invoiceData.email}</p>
        <p><strong>Phone:</strong> {invoiceData.phone}</p>
      </div>

      <table className="w-full border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Price</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.cart.map((item: any) => (
            <tr key={item.id}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">
                ₹{(item.price * item.quantity).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-lg font-semibold text-right mb-6">
        Subtotal: ₹{invoiceData.totalPrice.toLocaleString()} <br />
        GST (18%): ₹{(invoiceData.totalPrice * 0.18).toLocaleString()} <br />
        <span className="font-bold">
          Total: ₹{(invoiceData.totalPrice * 1.18).toLocaleString()}
        </span>
      </h2>

      <div className="flex justify-between">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Home
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default Invoice;
